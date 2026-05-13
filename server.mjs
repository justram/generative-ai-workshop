import http from "node:http";
import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";
import { getModel, getModels, streamSimple } from "@earendil-works/pi-ai";
import { getOAuthApiKey, loginOpenAICodex } from "@earendil-works/pi-ai/oauth";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DEFAULT_PORT = 4174;
const DEFAULT_MODEL_ID = "gpt-5.4-mini";
const CODEX_PROVIDER = "openai-codex";
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
      throw new Error("Browser callback was not received. Restart login and finish the ChatGPT sign-in page.");
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
  const requestedId = requestedModel.provider === CODEX_PROVIDER && GPT_MODEL_IDS.has(requestedModel.id)
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
      sendJson(res, 401, { error: "Not logged in. Click 'Log in with ChatGPT' on this local page first." });
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
  const tokens = String(text ?? "").toLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
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
    close: () => new Promise((resolve, reject) => server.close((error) => (error ? reject(error) : resolve()))),
  };
}

function parseCliPort() {
  const portArgIndex = process.argv.indexOf("--port");
  return portArgIndex >= 0 ? Number(process.argv[portArgIndex + 1]) : undefined;
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) {
  const instance = await startServer({ port: parseCliPort() });
  console.log(`Local GenAI workshop running at ${instance.url}`);
  console.log(`Use the page button to log in with ChatGPT. Credentials stay in ${instance.authDir}.`);
}
