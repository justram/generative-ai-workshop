import path from "node:path";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, Menu, shell } from "electron";
import { startServer } from "../server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_PORTS = [Number(process.env.GENAI_ELECTRON_PORT || 4174), 4175, 4173].filter(
  (port, index, ports) => Number.isFinite(port) && ports.indexOf(port) === index,
);

let mainWindow = null;
let serverInstance = null;
let isQuitting = false;
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

async function runSmokeProbe() {
  if (!process.env.GENAI_ELECTRON_SMOKE_RESULT || !mainWindow || !serverInstance) return;
  try {
    const authResponse = await fetch(new URL("/api/auth/status", serverInstance.url), { cache: "no-store" });
    const authStatus = await authResponse.json();
    const pageState = await mainWindow.webContents.executeJavaScript(
      `({
        title: document.title,
        lang: document.documentElement.lang,
        heading: document.querySelector("h1")?.textContent?.trim() || "",
        bodyLength: document.body?.innerText?.length || 0
      })`,
    );
    await writeSmokeResult({
      ok: authResponse.ok && pageState.bodyLength > 100,
      platform: process.platform,
      arch: process.arch,
      appVersion: app.getVersion(),
      serverUrl: serverInstance.url,
      userData: app.getPath("userData"),
      resourcesPath: process.resourcesPath,
      authStatus,
      pageState,
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
    const response = await fetch(new URL("/api/auth/status", serverInstance.url), { cache: "no-store" });
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
    runSmokeProbe();
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
