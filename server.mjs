import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import { createRequire } from "node:module";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getModel, getModels, streamSimple } from "@earendil-works/pi-ai";
import { getOAuthApiKey, loginOpenAICodex } from "@earendil-works/pi-ai/oauth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const require = createRequire(import.meta.url);
const DEFAULT_PORT = 4174;
const DEFAULT_MODEL_ID = "gpt-5.4-mini";
const CODEX_PROVIDER = "openai-codex";
const PACKAGE_DRIVE_URL =
  "https://drive.google.com/drive/folders/1emRlwPseX7F0VFKkzMJvAFDTPH7VRKBF?usp=drive_link";
const PRICED_GPT_MODEL_IDS = ["gpt-5.5", "gpt-5.4", "gpt-5.4-mini", "gpt-5.3-codex"];
const GPT_MODEL_IDS = new Set(
  getModels(CODEX_PROVIDER)
    .filter((model) => PRICED_GPT_MODEL_IDS.includes(model.id))
    .map((model) => model.id),
);

let pendingLogin = null;
let movieEmbeddingDim = null;
let authDir = process.env.GENAI_AUTH_DIR || path.join(__dirname, ".local-auth");
let authFile = path.join(authDir, "openai-codex.json");
let staticRoots = [__dirname];

const MIME_TYPES = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jsonl": "application/x-ndjson; charset=utf-8",
  ".png": "image/png",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".gif": "image/gif",
  ".svg": "image/svg+xml",
  ".ico": "image/x-icon",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function sendJson(res, status, body) {
  res.writeHead(status, {
    "content-type": "application/json; charset=utf-8",
    "cache-control": "no-store",
    "access-control-allow-origin": "*",
  });
  res.end(JSON.stringify(body));
}

let qrCodeModules = null;

function getQrCodeModules() {
  if (!qrCodeModules) {
    const QRCode = require("qrcode-terminal/vendor/QRCode");
    const QRErrorCorrectLevel = require("qrcode-terminal/vendor/QRCode/QRErrorCorrectLevel");
    qrCodeModules = { QRCode, QRErrorCorrectLevel };
  }
  return qrCodeModules;
}

function renderQrSvg(content, { margin = 3 } = {}) {
  const { QRCode, QRErrorCorrectLevel } = getQrCodeModules();
  const qrcode = new QRCode(-1, QRErrorCorrectLevel.L);
  qrcode.addData(content);
  qrcode.make();

  const moduleCount = qrcode.getModuleCount();
  const size = moduleCount + margin * 2;
  const parts = [
    `<?xml version="1.0" encoding="UTF-8"?>`,
    `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" shape-rendering="crispEdges">`,
    `<rect width="100%" height="100%" fill="#fff" />`,
  ];

  for (let row = 0; row < moduleCount; row += 1) {
    for (let col = 0; col < moduleCount; col += 1) {
      if (qrcode.modules[row][col]) {
        parts.push(
          `<rect x="${col + margin}" y="${row + margin}" width="1" height="1" fill="#111" />`,
        );
      }
    }
  }

  parts.push(`</svg>`);
  return parts.join("");
}

function sendPackageQr(res, method = "GET") {
  const svg = renderQrSvg(PACKAGE_DRIVE_URL);
  res.writeHead(200, {
    "content-type": MIME_TYPES[".svg"],
    "cache-control": "public, max-age=3600",
  });
  if (method === "HEAD") res.end();
  else res.end(svg);
}

function writeSse(res, event) {
  res.write(`data: ${JSON.stringify(event)}\n\n`);
}

async function readJson(req) {
  let raw = "";
  for await (const chunk of req) raw += chunk;
  if (!raw.trim()) return {};
  return JSON.parse(raw);
}

async function loadCredentials() {
  try {
    return JSON.parse(await fs.readFile(authFile, "utf8"));
  } catch (error) {
    if (error.code === "ENOENT") return null;
    throw error;
  }
}

async function saveCredentials(credentials) {
  await fs.mkdir(authDir, { recursive: true });
  await fs.writeFile(authFile, JSON.stringify(credentials, null, 2), "utf8");
}

async function clearCredentials() {
  await fs.rm(authFile, { force: true });
}

async function startLogin() {
  if (pendingLogin) return pendingLogin.urlPromise;

  let resolveUrl;
  let rejectUrl;
  const urlPromise = new Promise((resolve, reject) => {
    resolveUrl = resolve;
    rejectUrl = reject;
  });

  const loginPromise = loginOpenAICodex({
    onAuth: (info) => resolveUrl(info),
    onProgress: (message) => console.log(`[auth] ${message}`),
    onPrompt: async () => {
      throw new Error("沒有收到瀏覽器登入回呼。請重新登入，並完成 ChatGPT 登入頁面。");
    },
  })
    .then(async (credentials) => {
      await saveCredentials(credentials);
      return credentials;
    })
    .catch((error) => {
      rejectUrl(error);
      throw error;
    })
    .finally(() => {
      pendingLogin = null;
    });

  pendingLogin = { urlPromise, loginPromise };
  return urlPromise;
}

async function getApiKeyFromLocalLogin() {
  const credentials = await loadCredentials();
  if (!credentials) return null;

  const result = await getOAuthApiKey(CODEX_PROVIDER, { [CODEX_PROVIDER]: credentials });
  if (!result) return null;
  await saveCredentials(result.newCredentials);
  return result.apiKey;
}

function normalizeContent(content) {
  if (typeof content === "string") return content;
  if (Array.isArray(content)) {
    return content
      .map((part) => {
        if (part?.type === "text") return { type: "text", text: String(part.text ?? "") };
        if (part?.type === "image") return part;
        return { type: "text", text: String(part?.text ?? part?.content ?? part ?? "") };
      })
      .filter((part) => part.type !== "text" || part.text.length > 0);
  }
  return String(content ?? "");
}

function normalizeMessage(message) {
  const normalized = { ...message, timestamp: message.timestamp || Date.now() };
  if (normalized.role === "user") {
    normalized.content = normalizeContent(normalized.content);
  }
  if (normalized.role === "toolResult") {
    normalized.content = Array.isArray(normalized.content)
      ? normalizeContent(normalized.content)
      : [{ type: "text", text: String(normalized.output ?? "") }];
    normalized.isError = Boolean(normalized.isError);
  }
  return normalized;
}

function normalizeContext(context = {}) {
  return {
    systemPrompt: context.systemPrompt,
    messages: Array.isArray(context.messages) ? context.messages.map(normalizeMessage) : [],
    tools: Array.isArray(context.tools) ? context.tools : undefined,
  };
}

function selectModel(requestedModel = {}) {
  const requestedId =
    requestedModel.provider === CODEX_PROVIDER && GPT_MODEL_IDS.has(requestedModel.id)
      ? requestedModel.id
      : DEFAULT_MODEL_ID;
  return getModel(CODEX_PROVIDER, requestedId);
}

async function handleStream(req, res) {
  let started = false;
  try {
    const body = await readJson(req);
    const apiKey = await getApiKeyFromLocalLogin();
    if (!apiKey) {
      sendJson(res, 401, {
        error: "尚未登入。請先點選右上角的 ChatGPT 狀態燈，完成 ChatGPT 登入。",
      });
      return;
    }

    const model = selectModel(body.model);
    const context = normalizeContext(body.context);
    const controller = new AbortController();
    res.on("close", () => controller.abort());

    res.writeHead(200, {
      "content-type": "text/event-stream; charset=utf-8",
      "cache-control": "no-cache, no-transform",
      connection: "keep-alive",
      "x-accel-buffering": "no",
    });
    started = true;

    const stream = streamSimple(model, context, {
      apiKey,
      temperature: body.options?.temperature,
      maxTokens: body.options?.maxTokens,
      reasoning: body.options?.reasoning,
      signal: controller.signal,
      sessionId: "genai-workshop-local",
      transport: "auto",
    });

    for await (const event of stream) writeSse(res, event);
    res.end();
  } catch (error) {
    const message = error?.friendlyMessage || error?.message || String(error);
    console.error("[stream]", error);
    if (started) {
      writeSse(res, { type: "error", error: message });
      res.end();
    } else {
      sendJson(res, 500, { error: message });
    }
  }
}

async function getMovieEmbeddingDim() {
  if (movieEmbeddingDim) return movieEmbeddingDim;
  const file = path.join(__dirname, "data/movies/embeddings.jsonl");
  const firstLine = (await fs.readFile(file, "utf8")).split("\n").find(Boolean);
  const parsed = JSON.parse(firstLine);
  movieEmbeddingDim = Array.isArray(parsed) ? parsed.length : 1536;
  return movieEmbeddingDim;
}

function hashString(value) {
  let hash = 2166136261;
  for (let index = 0; index < value.length; index += 1) {
    hash ^= value.charCodeAt(index);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

function localEmbedding(text, dim) {
  const vector = new Float64Array(dim);
  const tokens =
    String(text ?? "")
      .toLowerCase()
      .match(/[\p{L}\p{N}]+/gu) || [];
  const features = tokens.length ? tokens : [String(text ?? "").toLowerCase()];

  for (const token of features) {
    for (let salt = 0; salt < 4; salt += 1) {
      const hash = hashString(`${salt}:${token}`);
      const index = hash % dim;
      const sign = hash & 1 ? 1 : -1;
      vector[index] += sign / Math.sqrt(features.length);
    }
  }

  let norm = 0;
  for (const value of vector) norm += value * value;
  norm = Math.sqrt(norm) || 1;
  return Array.from(vector, (value) => value / norm);
}

async function handleEmbed(req, res) {
  const body = await readJson(req);
  const text = body.text ?? body.input ?? "";
  const dim = await getMovieEmbeddingDim();
  sendJson(res, 200, { embedding: localEmbedding(text, dim), local: true });
}

function decodeHtml(value = "") {
  return String(value)
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&#x27;/g, "'")
    .replace(/&nbsp;/g, " ")
    .replace(/<[^>]+>/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

function curatedSearchResults(query = "") {
  const normalized = query.toLowerCase();
  if (!/jheng|jheng-hong|matt|justram|楊政紘|stencilzeit/.test(normalized)) return [];
  return [
    {
      title: "justram (Jheng-Hong (Matt) Yang) - Hugging Face",
      url: "https://huggingface.co/justram",
      snippet:
        "Hugging Face profile for Jheng-Hong (Matt) Yang, username justram. The profile links to justram.github.io/mypage/about and lists AI & ML interests: Information Retrieval, Multi-modal representation learning, Recommender Systems.",
      source: "curated-fallback",
    },
    {
      title: "dblp: Jheng-Hong Yang",
      url: "https://dblp.org/pid/227/0821.html",
      snippet:
        "DBLP author page for Jheng-Hong Yang. It lists publications including AToMiC: An Image/Text Retrieval Test Collection to Support Multimedia Content Creation (SIGIR 2023) and Gosling Grows Up (SIGIR 2025).",
      source: "curated-fallback",
    },
    {
      title: "Jheng-Hong (Matt) Yang - Stencilzeit | LinkedIn",
      url: "https://tw.linkedin.com/in/jheng-hong-matt-yang-64692685",
      snippet:
        "Search snippets identify Jheng-Hong (Matt) Yang with Stencilzeit and describe him as an engineer and researcher building agentic systems. Because LinkedIn content may require login, treat this as lower-confidence unless verified from the page directly.",
      source: "curated-fallback",
    },
  ];
}

function parseDuckDuckGoResults(html) {
  const results = [];
  const blocks = html.match(/<div class="result[\s\S]*?<\/div>\s*<\/div>/g) || [];
  for (const block of blocks) {
    const titleMatch = block.match(
      /<a[^>]+class="result__a"[^>]+href="([^"]+)"[^>]*>([\s\S]*?)<\/a>/,
    );
    if (!titleMatch) continue;
    const snippetMatch = block.match(
      /<a[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/a>|<div[^>]+class="result__snippet"[^>]*>([\s\S]*?)<\/div>/,
    );
    let url = decodeHtml(titleMatch[1]);
    try {
      const parsed = new URL(url);
      const uddg = parsed.searchParams.get("uddg");
      if (uddg) url = uddg;
    } catch {}
    results.push({
      title: decodeHtml(titleMatch[2]),
      url,
      snippet: decodeHtml(snippetMatch?.[1] || snippetMatch?.[2] || ""),
      source: "duckduckgo-html",
    });
  }
  return results;
}

async function handleWebSearch(req, res) {
  const body = await readJson(req);
  const query = String(body.query || "").trim();
  if (!query) {
    sendJson(res, 400, { error: "query is required" });
    return;
  }

  try {
    const url = `https://duckduckgo.com/html/?q=${encodeURIComponent(query)}`;
    const response = await fetch(url, {
      headers: {
        "user-agent": "Mozilla/5.0 (compatible; GenAIWorkshop/1.0; +https://justram.github.io)",
      },
    });
    const html = await response.text();
    let results = parseDuckDuckGoResults(html).slice(0, Number(body.numResults || 5));
    if (/jheng|jheng-hong|matt|justram|楊政紘|stencilzeit/i.test(query)) {
      const curated = curatedSearchResults(query);
      const seen = new Set(results.map((result) => result.url));
      results = [...curated.filter((result) => !seen.has(result.url)), ...results].slice(
        0,
        Number(body.numResults || 5),
      );
    }
    sendJson(res, 200, {
      query,
      searchedAt: new Date().toISOString(),
      results,
      fallback: results.some((result) => result.source === "curated-fallback"),
    });
  } catch (error) {
    const results = curatedSearchResults(query).slice(0, Number(body.numResults || 5));
    sendJson(res, 200, {
      query,
      searchedAt: new Date().toISOString(),
      results,
      fallback: true,
      warning: error.message || String(error),
    });
  }
}

const MCP_DEMO_TOOLS = [
  {
    name: "shell.date",
    title: "讀取目前日期時間",
    description: "回傳本機伺服器目前時間。只讀。",
    inputSchema: { type: "object", properties: {}, required: [] },
    risk: "read",
  },
  {
    name: "shell.pwd_list",
    title: "讀取目前資料夾",
    description: "回傳教學 app 的工作目錄與前幾個檔案。只讀。",
    inputSchema: { type: "object", properties: { limit: { type: "number" } }, required: [] },
    risk: "read",
  },
  {
    name: "runtime.node_version",
    title: "讀取 Node.js 版本",
    description: "回傳本機 Node.js 版本。只讀。",
    inputSchema: { type: "object", properties: {}, required: [] },
    risk: "read",
  },
  {
    name: "project.package_summary",
    title: "讀取 package.json 摘要",
    description: "讀取 app 名稱、scripts 與 Electron 打包設定。只讀。",
    inputSchema: { type: "object", properties: {}, required: [] },
    risk: "read",
  },
  {
    name: "notes.write_practice",
    title: "寫入練習筆記",
    description: "只允許寫入本機教學沙盒裡的 mcp-practice-note.txt。",
    inputSchema: {
      type: "object",
      properties: { content: { type: "string" } },
      required: ["content"],
    },
    risk: "write",
  },
  {
    name: "notes.read_practice",
    title: "讀取練習筆記",
    description: "讀取本機教學沙盒裡的 mcp-practice-note.txt。",
    inputSchema: { type: "object", properties: {}, required: [] },
    risk: "read",
  },
];

async function handleMcpDemo(req, res) {
  const body = await readJson(req);
  const requestId = body.id ?? 1;
  const method = String(body.method || "");
  if (method === "tools/list") {
    sendJson(res, 200, {
      jsonrpc: "2.0",
      id: requestId,
      result: {
        tools: MCP_DEMO_TOOLS,
      },
    });
    return;
  }

  if (method !== "tools/call") {
    sendJson(res, 400, {
      jsonrpc: "2.0",
      id: requestId,
      error: { code: -32601, message: `Unknown MCP demo method: ${method}` },
    });
    return;
  }

  const name = String(body.params?.name || "");
  const args =
    body.params?.arguments && typeof body.params.arguments === "object"
      ? body.params.arguments
      : {};
  const noteDir = path.join(authDir, "mcp-demo");
  const notePath = path.join(noteDir, "mcp-practice-note.txt");

  try {
    let text = "";
    let structuredContent = {};
    if (name === "shell.date") {
      const now = new Date();
      structuredContent = {
        iso: now.toISOString(),
        locale: now.toLocaleString("zh-TW", { timeZone: "Asia/Taipei" }),
      };
      text = `Asia/Taipei：${structuredContent.locale}\nISO：${structuredContent.iso}`;
    } else if (name === "shell.pwd_list") {
      const limit = Math.max(1, Math.min(Number(args.limit || 10), 30));
      const entries = (await fs.readdir(__dirname)).slice(0, limit);
      structuredContent = { cwd: __dirname, entries };
      text = `cwd: ${__dirname}\n\n${entries.map((entry) => `- ${entry}`).join("\n")}`;
    } else if (name === "runtime.node_version") {
      structuredContent = {
        version: process.version,
        platform: process.platform,
        arch: process.arch,
      };
      text = `Node.js ${process.version}\nplatform: ${process.platform}\narch: ${process.arch}`;
    } else if (name === "project.package_summary") {
      const pkg = JSON.parse(await fs.readFile(path.join(__dirname, "package.json"), "utf8"));
      structuredContent = {
        name: pkg.name,
        version: pkg.version,
        scripts: pkg.scripts || {},
        build: pkg.build || {},
      };
      text = JSON.stringify(structuredContent, null, 2);
    } else if (name === "notes.write_practice") {
      const content = String(args.content || "").trim();
      if (!content) throw new Error("content is required");
      await fs.mkdir(noteDir, { recursive: true });
      await fs.writeFile(notePath, content, "utf8");
      structuredContent = { path: notePath, bytes: Buffer.byteLength(content, "utf8") };
      text = `已寫入 ${notePath}\n${structuredContent.bytes} bytes`;
    } else if (name === "notes.read_practice") {
      const content = await fs.readFile(notePath, "utf8");
      structuredContent = { path: notePath, content };
      text = `path: ${notePath}\n\n${content}`;
    } else {
      sendJson(res, 400, {
        jsonrpc: "2.0",
        id: requestId,
        error: { code: -32602, message: `Unknown MCP demo tool: ${name}` },
      });
      return;
    }

    sendJson(res, 200, {
      jsonrpc: "2.0",
      id: requestId,
      result: {
        content: [{ type: "text", text }],
        structuredContent,
        isError: false,
      },
    });
  } catch (error) {
    sendJson(res, 200, {
      jsonrpc: "2.0",
      id: requestId,
      result: {
        content: [{ type: "text", text: error.message || String(error) }],
        structuredContent: {},
        isError: true,
      },
    });
  }
}

async function handleStatic(req, res, url) {
  const requestedPath = decodeURIComponent(url.pathname === "/" ? "/index.html" : url.pathname);
  const safePath = path.normalize(requestedPath).replace(/^(\.\.[/\\])+/, "");

  for (const root of staticRoots) {
    const filePath = path.join(root, safePath);
    if (!filePath.startsWith(root)) {
      sendJson(res, 403, { error: "Forbidden" });
      return;
    }

    try {
      const stat = await fs.stat(filePath);
      const actualPath = stat.isDirectory() ? path.join(filePath, "index.html") : filePath;
      const ext = path.extname(actualPath).toLowerCase();
      res.writeHead(200, {
        "content-type": MIME_TYPES[ext] || "application/octet-stream",
        "cache-control": "no-cache",
      });
      fsSync.createReadStream(actualPath).pipe(res);
      return;
    } catch (error) {
      if (error.code !== "ENOENT") throw error;
    }
  }

  res.writeHead(404, { "content-type": "text/plain; charset=utf-8" });
  res.end("Not found");
}

async function route(req, res) {
  try {
    const url = new URL(req.url, `http://${req.headers.host || "127.0.0.1"}`);
    if (req.method === "GET" && url.pathname === "/api/auth/status") {
      const credentials = await loadCredentials();
      sendJson(res, 200, {
        loggedIn: Boolean(credentials),
        accountId: credentials?.accountId,
        loginPending: Boolean(pendingLogin),
      });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/auth/start") {
      const info = await startLogin();
      sendJson(res, 200, info);
      return;
    }
    if (req.method === "GET" && url.pathname === "/api/auth/start-redirect") {
      const info = await startLogin();
      res.writeHead(302, {
        location: info.url,
        "cache-control": "no-store",
      });
      res.end();
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/auth/logout") {
      await clearCredentials();
      sendJson(res, 200, { ok: true });
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/stream") {
      await handleStream(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/embed") {
      await handleEmbed(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/web-search") {
      await handleWebSearch(req, res);
      return;
    }
    if (req.method === "POST" && url.pathname === "/api/mcp-demo") {
      await handleMcpDemo(req, res);
      return;
    }
    if ((req.method === "GET" || req.method === "HEAD") && url.pathname === "/api/package/qr") {
      sendPackageQr(res, req.method);
      return;
    }
    if (req.method === "GET" || req.method === "HEAD") {
      await handleStatic(req, res, url);
      return;
    }
    sendJson(res, 405, { error: "Method not allowed" });
  } catch (error) {
    console.error("[server]", error);
    if (!res.headersSent) sendJson(res, 500, { error: error.message || String(error) });
    else res.end();
  }
}

export async function startServer(options = {}) {
  const port = Number(options.port || process.env.PORT || DEFAULT_PORT);
  const host = options.host || "127.0.0.1";
  authDir = options.authDir || process.env.GENAI_AUTH_DIR || path.join(__dirname, ".local-auth");
  authFile = path.join(authDir, "openai-codex.json");
  staticRoots = [...new Set([...(options.staticRoots || []), __dirname])];

  const server = http.createServer(route);
  await new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, host, () => {
      server.off("error", reject);
      resolve();
    });
  });

  return {
    server,
    port: server.address().port,
    host,
    url: `http://${host}:${server.address().port}/`,
    authDir,
    close: () =>
      new Promise((resolve, reject) =>
        server.close((error) => (error ? reject(error) : resolve())),
      ),
  };
}

function parseCliPort() {
  const portArgIndex = process.argv.indexOf("--port");
  return portArgIndex >= 0 ? Number(process.argv[portArgIndex + 1]) : undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const instance = await startServer({ port: parseCliPort() });
  console.log(`Local GenAI workshop running at ${instance.url}`);
  console.log(
    `Use the page button to log in with ChatGPT. Credentials stay in ${instance.authDir}.`,
  );
}
