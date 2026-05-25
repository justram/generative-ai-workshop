import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { createRequire } from "node:module";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, Menu, shell } from "electron";
import { startServer } from "../server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const { listWorkshopPages } = require("../scripts/workshop-pages.cjs");
const APP_PORTS = [Number(process.env.GENAI_ELECTRON_PORT || 4174), 4175, 4173].filter(
  (port, index, ports) => Number.isFinite(port) && ports.indexOf(port) === index,
);

let mainWindow = null;
let serverInstance = null;
let isQuitting = false;
let smokeProbeStarted = false;
const authWindows = new Set();

const singleInstanceLock = app.requestSingleInstanceLock();

if (!singleInstanceLock) {
  app.quit();
}

if (process.env.GENAI_ELECTRON_USER_DATA_DIR) {
  app.setPath("userData", path.resolve(process.env.GENAI_ELECTRON_USER_DATA_DIR));
}

function windowStatePath() {
  return path.join(app.getPath("userData"), "window-state.json");
}

async function readWindowState() {
  try {
    const state = JSON.parse(await readFile(windowStatePath(), "utf8"));
    if (
      Number.isFinite(state.width) &&
      Number.isFinite(state.height) &&
      Number.isFinite(state.x) &&
      Number.isFinite(state.y)
    ) {
      return state;
    }
  } catch {
    // First launch or unreadable state; fall back to native defaults below.
  }
  return {};
}

async function saveWindowState(window) {
  if (!window || window.isDestroyed()) return;
  const bounds = window.getBounds();
  await writeFile(windowStatePath(), JSON.stringify(bounds, null, 2)).catch(() => {});
}

async function writeSmokeResult(result) {
  const resultPath = process.env.GENAI_ELECTRON_SMOKE_RESULT;
  if (!resultPath) return;
  await mkdir(path.dirname(resultPath), { recursive: true });
  await writeFile(resultPath, JSON.stringify(result, null, 2), "utf8");
}

function smokeArtifactDir() {
  const configured = process.env.GENAI_ELECTRON_SMOKE_OUTPUT_DIR;
  if (configured) return path.resolve(configured);
  const resultPath = process.env.GENAI_ELECTRON_SMOKE_RESULT;
  if (resultPath) return path.join(path.dirname(resultPath), "artifacts");
  return path.join(app.getPath("temp"), "genai-workshop-smoke");
}

function safeSmokeName(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "_");
}

function shortText(value, max = 260) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function isExpectedAuthMessage(text) {
  return /ChatGPT|not connected|尚未連線|請先.*登入|login/i.test(String(text || ""));
}

async function saveSmokeScreenshot(label) {
  if (!mainWindow || mainWindow.isDestroyed()) return null;
  const dir = path.join(smokeArtifactDir(), "screenshots");
  await mkdir(dir, { recursive: true });
  const file = path.join(dir, `${safeSmokeName(label)}.png`);
  const image = await mainWindow.webContents.capturePage();
  await writeFile(file, image.toPNG());
  return file;
}

async function setSmokeLanguage(language, theme = "light") {
  if (!mainWindow || mainWindow.isDestroyed() || !serverInstance) return;
  await mainWindow.loadURL(serverInstance.url);
  await mainWindow.webContents.executeJavaScript(
    `localStorage.setItem("language", ${JSON.stringify(language)}); localStorage.setItem("theme", ${JSON.stringify(theme)});`,
  );
}

async function readSmokePageState(page, language, theme) {
  return mainWindow.webContents.executeJavaScript(`
    (() => {
      const body = document.body?.innerText || "";
      const visibleErrors = [...body.matchAll(/(?:錯誤：|Error:)[^\\n]+|[^\\n]*is not a function[^\\n]*/gi)]
        .map((match) => match[0].trim())
        .filter(Boolean)
        .slice(0, 12);
      const markdown = Array.from(document.querySelectorAll("markdown-block"))
        .map((el) => el.innerText || "")
        .join("\\n");
      return {
        page: ${JSON.stringify(page)},
        language: ${JSON.stringify(language)},
        theme: ${JSON.stringify(theme)},
        url: location.href,
        title: document.title || "",
        lang: document.documentElement.lang || "",
        heading: document.querySelector("h1")?.textContent?.trim() || "",
        bodyLength: body.trim().length,
        bodyStart: body.replace(/\\s+/g, " ").trim().slice(0, 260),
        markdownStart: markdown.replace(/\\s+/g, " ").trim().slice(0, 260),
        visibleErrors,
        blankish: body.trim().length < 80,
      };
    })()
  `);
}

async function loadSmokePage(page, language, theme = "light") {
  const consoleErrors = [];
  const failedLoads = [];
  const onConsoleMessage = (event) => {
    if (event.level === "error") {
      consoleErrors.push(
        shortText(`${event.message} ${event.sourceId || ""}:${event.lineNumber || ""}`, 360),
      );
    }
  };
  const onFailLoad = (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) failedLoads.push({ errorCode, errorDescription, validatedURL });
  };
  mainWindow.webContents.on("console-message", onConsoleMessage);
  mainWindow.webContents.on("did-fail-load", onFailLoad);
  try {
    await setSmokeLanguage(language, theme);
    const pathname = page === "index.html" ? "/" : `/${page}`;
    const url = new URL(pathname, serverInstance.url);
    url.searchParams.set("smoke", `${Date.now()}-${language}-${theme}`);
    await mainWindow.loadURL(url.toString());
    await new Promise((resolve) => setTimeout(resolve, 500));
    const state = await readSmokePageState(page, language, theme);
    return {
      ...state,
      consoleErrors,
      failedLoads,
      ok:
        !state.blankish &&
        consoleErrors.length === 0 &&
        failedLoads.length === 0 &&
        state.visibleErrors.filter((error) => !isExpectedAuthMessage(error)).length === 0,
    };
  } catch (error) {
    return {
      page,
      language,
      theme,
      ok: false,
      loadError: error?.stack || error?.message || String(error),
      consoleErrors,
      failedLoads,
    };
  } finally {
    mainWindow.webContents.off("console-message", onConsoleMessage);
    mainWindow.webContents.off("did-fail-load", onFailLoad);
  }
}

async function probeNlpTaskInteraction() {
  const page = "4-5-nlp-tasks.html";
  const result = await loadSmokePage(page, "zh-TW", "dark");
  result.probe = "4-5-first-task-click";
  if (!result.ok) return result;
  try {
    await mainWindow.webContents.executeJavaScript(`
      Array.from(document.querySelectorAll("button"))
        .find((button) => button.textContent.includes("執行"))
        ?.click();
    `);
    await new Promise((resolve) => setTimeout(resolve, 5000));
    const after = await readSmokePageState(page, "zh-TW", "dark");
    const unexpectedVisibleErrors = after.visibleErrors.filter(
      (error) => !isExpectedAuthMessage(error),
    );
    const ok = unexpectedVisibleErrors.length === 0;
    return {
      ...result,
      afterClick: after,
      unexpectedVisibleErrors,
      ok,
      screenshot: ok ? null : await saveSmokeScreenshot("4-5-nlp-tasks-zh-TW-after-click"),
    };
  } catch (error) {
    return {
      ...result,
      ok: false,
      interactionError: error?.stack || error?.message || String(error),
      screenshot: await saveSmokeScreenshot("4-5-nlp-tasks-zh-TW-interaction-error"),
    };
  }
}

async function runSmokeProbe() {
  if (!process.env.GENAI_ELECTRON_SMOKE_RESULT || !mainWindow || !serverInstance) return;
  if (smokeProbeStarted) return;
  smokeProbeStarted = true;
  try {
    const authResponse = await fetch(new URL("/api/auth/status", serverInstance.url), {
      cache: "no-store",
    });
    const authStatus = await authResponse.json();
    const pages = listWorkshopPages(app.getAppPath());
    const pageResults = [];
    for (const page of pages) {
      for (const language of ["zh-TW", "en"]) {
        const result = await loadSmokePage(page, language, "light");
        if (!result.ok) result.screenshot = await saveSmokeScreenshot(`${page}-${language}`);
        pageResults.push(result);
      }
    }
    const probes = [await probeNlpTaskInteraction()];
    const failures = [...pageResults, ...probes].filter((result) => !result.ok);
    await writeSmokeResult({
      ok: authResponse.ok && failures.length === 0,
      platform: process.platform,
      arch: process.arch,
      appVersion: app.getVersion(),
      serverUrl: serverInstance.url,
      userData: app.getPath("userData"),
      resourcesPath: process.resourcesPath,
      authStatus,
      pagesChecked: pageResults.length,
      probeCount: probes.length,
      failures,
      pageResults,
      probes,
    });
    setTimeout(() => app.quit(), 150);
  } catch (error) {
    await writeSmokeResult({
      ok: false,
      platform: process.platform,
      arch: process.arch,
      error: error?.stack || error?.message || String(error),
    });
    setTimeout(() => app.exit(1), 150);
  }
}

function scheduleSmokeProbe() {
  if (!process.env.GENAI_ELECTRON_SMOKE_RESULT) return;
  setTimeout(() => {
    runSmokeProbe();
  }, 50);
}

function buildMenu() {
  const isMac = process.platform === "darwin";
  const template = [
    ...(isMac
      ? [
          {
            label: app.name,
            submenu: [
              { role: "about" },
              { type: "separator" },
              { role: "services" },
              { type: "separator" },
              { role: "hide" },
              { role: "hideOthers" },
              { role: "unhide" },
              { type: "separator" },
              { role: "quit" },
            ],
          },
        ]
      : []),
    {
      label: "File",
      submenu: [{ role: "close" }],
    },
    {
      label: "Edit",
      submenu: [
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      ],
    },
    {
      label: "View",
      submenu: [
        { role: "reload" },
        { role: "forceReload" },
        { role: "toggleDevTools" },
        { type: "separator" },
        { role: "resetZoom" },
        { role: "zoomIn" },
        { role: "zoomOut" },
        { type: "separator" },
        { role: "togglefullscreen" },
      ],
    },
    {
      label: "Window",
      submenu: [{ role: "minimize" }, ...(isMac ? [{ role: "zoom" }] : [])],
    },
  ];
  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

async function startWorkshopServer(authDir) {
  let lastError = null;
  for (const port of APP_PORTS) {
    try {
      return await startServer({ port, authDir, staticRoots: [process.resourcesPath] });
    } catch (error) {
      lastError = error;
      if (error?.code !== "EADDRINUSE") throw error;
    }
  }
  throw lastError || new Error("Could not start local workshop server.");
}

function isLocalUrl(url) {
  return url.startsWith("http://127.0.0.1:") || url.startsWith("http://localhost:");
}

async function closeAuthWindowIfConnected(window) {
  if (!window || window.isDestroyed() || !serverInstance) return;
  try {
    const response = await fetch(new URL("/api/auth/status", serverInstance.url), {
      cache: "no-store",
    });
    if (!response.ok) return;
    const status = await response.json();
    if (!status.loggedIn) return;
    window.close();
    mainWindow?.show();
    mainWindow?.focus();
  } catch {
    // The local status endpoint may not be ready while OAuth is still redirecting.
  }
}

function watchAuthWindow(window) {
  authWindows.add(window);
  window.on("closed", () => authWindows.delete(window));

  const scheduleCloseCheck = () => {
    setTimeout(() => closeAuthWindowIfConnected(window), 300);
  };

  window.webContents.on("did-finish-load", scheduleCloseCheck);
  window.webContents.on("did-navigate", scheduleCloseCheck);
  window.webContents.on("did-redirect-navigation", scheduleCloseCheck);
}

async function createMainWindow() {
  const authDir = path.join(app.getPath("userData"), "auth");
  serverInstance = await startWorkshopServer(authDir);
  const savedBounds = await readWindowState();

  mainWindow = new BrowserWindow({
    width: savedBounds.width || 1180,
    height: savedBounds.height || 860,
    x: savedBounds.x,
    y: savedBounds.y,
    minWidth: 900,
    minHeight: 680,
    title: "Generative AI Workshop",
    backgroundColor: "#09090b",
    autoHideMenuBar: true,
    show: false,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (isLocalUrl(url) || url.startsWith("https://auth.openai.com/")) {
      return {
        action: "allow",
        overrideBrowserWindowOptions: {
          width: 980,
          height: 760,
          minWidth: 720,
          minHeight: 560,
          title: "ChatGPT Login",
          parent: mainWindow,
          autoHideMenuBar: true,
          backgroundColor: "#09090b",
          webPreferences: {
            contextIsolation: true,
            nodeIntegration: false,
            sandbox: true,
          },
        },
      };
    }
    shell.openExternal(url);
    return { action: "deny" };
  });

  mainWindow.webContents.on("did-create-window", (window) => {
    watchAuthWindow(window);
  });

  mainWindow.webContents.on("context-menu", (event, params) => {
    event.preventDefault();
    const template = [];
    if (params.isEditable) {
      template.push(
        { role: "undo" },
        { role: "redo" },
        { type: "separator" },
        { role: "cut" },
        { role: "copy" },
        { role: "paste" },
        { role: "selectAll" },
      );
    } else if (params.selectionText) {
      template.push({ role: "copy" });
    }
    if (template.length > 0) {
      Menu.buildFromTemplate(template).popup({ window: mainWindow });
    }
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const localUrl = serverInstance?.url;
    if (localUrl && url.startsWith(localUrl)) return;
    if (isLocalUrl(url)) return;
    if (url.startsWith("https://auth.openai.com/")) return;
    if (url.startsWith("https://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  mainWindow.once("ready-to-show", () => {
    mainWindow?.show();
    scheduleSmokeProbe();
  });

  mainWindow.webContents.once("did-finish-load", () => {
    scheduleSmokeProbe();
  });

  mainWindow.on("close", () => {
    saveWindowState(mainWindow);
  });

  mainWindow.on("closed", () => {
    mainWindow = null;
  });

  await mainWindow.loadURL(serverInstance.url);
}

app.setName("Generative AI Workshop");

if (singleInstanceLock) {
  app.on("second-instance", () => {
    if (!mainWindow) return;
    if (mainWindow.isMinimized()) mainWindow.restore();
    mainWindow.show();
    mainWindow.focus();
  });

  app.whenReady().then(async () => {
    try {
      buildMenu();
      await createMainWindow();
    } catch (error) {
      console.error(error);
      app.quit();
    }

    app.on("activate", async () => {
      if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
      else mainWindow?.show();
    });
  });
}

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", async (event) => {
  if (isQuitting) return;
  if (!serverInstance) return;
  event.preventDefault();
  isQuitting = true;
  const instance = serverInstance;
  serverInstance = null;
  await instance.close().catch(() => {});
  app.exit(0);
});
