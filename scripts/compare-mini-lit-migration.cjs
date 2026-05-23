#!/usr/bin/env node

const fs = require("node:fs/promises");
const http = require("node:http");
const path = require("node:path");
const { app, BrowserWindow, session } = require("electron");

const currentRoot = path.resolve(process.argv[2] || process.cwd());
const oldRootArg = process.argv[3] || process.env.OLD_WORKSHOP_ROOT;
const outFile = path.resolve(process.argv[4] || "dist-electron/mini-lit-migration-compare.json");

if (!oldRootArg) {
  console.error(
    "Usage: electron scripts/compare-mini-lit-migration.cjs <current-root> <old-root> [out-json]",
  );
  console.error("Tip: create the old root with `git worktree add /tmp/genai-workshop-old HEAD~1`.");
  process.exit(2);
}

const oldRoot = path.resolve(oldRootArg);
const pages = [
  "index.html",
  "3-1-chatbot-interface.html",
  "3-2-providers-models.html",
  "3-4-document-upload.html",
  "5-2-calculator-tool.html",
  "5-5-artifacts-tool.html",
  "5-6-mcp.html",
  "6-1-models.html",
  "6-3-hardware.html",
  "7-where-to-go.html",
];
const langs = ["zh-TW", "en"];
const mime = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".jpeg": "image/jpeg",
  ".jpg": "image/jpeg",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".png": "image/png",
  ".svg": "image/svg+xml",
};

function serve(root, port) {
  const resolvedRoot = path.resolve(root);
  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://127.0.0.1:${port}`);
    let pathname = decodeURIComponent(url.pathname);
    if (pathname === "/") pathname = "/index.html";
    const file = path.resolve(resolvedRoot, `.${pathname}`);
    if (!file.startsWith(resolvedRoot)) {
      res.writeHead(403);
      res.end("forbidden");
      return;
    }
    try {
      const data = await fs.readFile(file);
      res.writeHead(200, {
        "cache-control": "no-store",
        "content-type": mime[path.extname(file)] || "application/octet-stream",
      });
      res.end(data);
    } catch {
      res.writeHead(404, { "content-type": "text/plain" });
      res.end("not found");
    }
  });
  return new Promise((resolve) => server.listen(port, "127.0.0.1", () => resolve(server)));
}

async function snapshot(win, baseUrl, page, lang) {
  const errors = [];
  const onConsole = (_event, level, message, line, sourceId) => {
    if (level === 3) errors.push(`${message} ${sourceId || ""}:${line || ""}`.slice(0, 240));
  };
  win.webContents.on("console-message", onConsole);
  const pathPart = page === "index.html" ? "/" : `/${page}`;
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const url = `${baseUrl}${pathPart}?compare=${runId}`;
  await win.loadURL(url);
  await win.webContents.executeJavaScript(
    `localStorage.setItem("language", ${JSON.stringify(lang)}); localStorage.setItem("theme", "light");`,
  );
  await win.loadURL(`${url}-lang-${lang}`);
  await new Promise((resolve) => setTimeout(resolve, 700));
  const result = await win.webContents.executeJavaScript(`(() => {
    const body = document.body?.innerText || "";
    const heading = document.querySelector("h1")?.innerText || "";
    const scripts = [...document.scripts].map((script) => script.getAttribute("src")).filter(Boolean);
    return {
      title: document.title || "",
      lang: document.documentElement.lang || "",
      heading,
      bodyLength: body.length,
      bodyStart: body.replace(/\\s+/g, " ").trim().slice(0, 220),
      scripts,
      blankish: body.trim().length < 80,
    };
  })()`);
  win.webContents.off("console-message", onConsole);
  result.errors = errors;
  return result;
}

function compare(row) {
  const findings = [];
  if (row.current.blankish) findings.push("current page rendered blank");
  if (row.current.errors.length)
    findings.push(`current console errors: ${row.current.errors.length}`);
  if (row.old.title && row.current.title !== row.old.title)
    findings.push(`title changed: ${row.old.title} -> ${row.current.title}`);
  if (row.old.heading && row.current.heading !== row.old.heading)
    findings.push(`heading changed: ${row.old.heading} -> ${row.current.heading}`);
  return findings;
}

async function main() {
  await app.whenReady();
  const oldServer = await serve(oldRoot, 49301);
  const currentServer = await serve(currentRoot, 49302);
  await session.defaultSession.clearCache();
  const win = new BrowserWindow({
    height: 1000,
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
    width: 1280,
  });

  const rows = [];
  for (const page of pages) {
    for (const lang of langs) {
      const old = await snapshot(win, "http://127.0.0.1:49301", page, lang);
      const current = await snapshot(win, "http://127.0.0.1:49302", page, lang);
      const row = { page, lang, old, current };
      row.findings = compare(row);
      rows.push(row);
    }
  }

  const failures = rows.filter((row) => row.findings.length);
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(
    outFile,
    JSON.stringify({ generatedAt: new Date().toISOString(), failures, rows }, null, 2),
  );
  win.destroy();
  oldServer.close();
  currentServer.close();
  console.log(`Compared ${rows.length} rendered page/language pairs.`);
  console.log(`Failures: ${failures.length}`);
  console.log(`Wrote ${outFile}`);
  for (const row of failures.slice(0, 20)) {
    console.log(`[FAIL] ${row.lang} ${row.page}: ${row.findings.join("; ")}`);
  }
  app.exit(failures.length ? 1 : 0);
}

main().catch(async (error) => {
  await fs.mkdir(path.dirname(outFile), { recursive: true });
  await fs.writeFile(outFile, JSON.stringify({ error: String(error.stack || error) }, null, 2));
  console.error(error);
  app.exit(1);
});
