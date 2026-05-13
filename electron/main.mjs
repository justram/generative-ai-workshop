import path from "node:path";
import { fileURLToPath } from "node:url";
import { app, BrowserWindow, shell } from "electron";
import { startServer } from "../server.mjs";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const APP_PORTS = [Number(process.env.GENAI_ELECTRON_PORT || 4174), 4175, 4173].filter(
  (port, index, ports) => Number.isFinite(port) && ports.indexOf(port) === index,
);

let mainWindow = null;
let serverInstance = null;

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

async function createMainWindow() {
  const authDir = path.join(app.getPath("userData"), "auth");
  serverInstance = await startWorkshopServer(authDir);

  mainWindow = new BrowserWindow({
    width: 1180,
    height: 860,
    minWidth: 900,
    minHeight: 680,
    title: "Generative AI Workshop",
    backgroundColor: "#09090b",
    autoHideMenuBar: true,
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
      sandbox: true,
    },
  });

  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    if (url.startsWith("http://127.0.0.1:") || url.startsWith("http://localhost:")) {
      return { action: "allow" };
    }
    return { action: "allow" };
  });

  mainWindow.webContents.on("will-navigate", (event, url) => {
    const localUrl = serverInstance?.url;
    if (localUrl && url.startsWith(localUrl)) return;
    if (url.startsWith("http://127.0.0.1:") || url.startsWith("http://localhost:")) return;
    if (url.startsWith("https://auth.openai.com/")) return;
    if (url.startsWith("https://")) {
      event.preventDefault();
      shell.openExternal(url);
    }
  });

  await mainWindow.loadURL(serverInstance.url);
}

app.setName("Generative AI Workshop");

app.whenReady().then(async () => {
  try {
    await createMainWindow();
  } catch (error) {
    console.error(error);
    app.quit();
  }

  app.on("activate", async () => {
    if (BrowserWindow.getAllWindows().length === 0) await createMainWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});

app.on("before-quit", async (event) => {
  if (!serverInstance) return;
  event.preventDefault();
  const instance = serverInstance;
  serverInstance = null;
  await instance.close().catch(() => {});
  app.exit(0);
});
