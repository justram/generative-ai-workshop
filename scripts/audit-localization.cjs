#!/usr/bin/env node

const fs = require("node:fs");
const path = require("node:path");
const { app, BrowserWindow, session } = require("electron");

const ROOT = path.resolve(__dirname, "..");
const BASE_URL = process.env.BASE_URL || "http://127.0.0.1:4174";
const PAGE_ARG = process.argv.find((arg) => arg.startsWith("--pages="));
const LANG_ARG = process.argv.find((arg) => arg.startsWith("--langs="));
const MAX_FINDINGS = Number(process.env.MAX_FINDINGS || 240);

const CJK_RE = /[\u3400-\u4dbf\u4e00-\u9fff\u3000-\u303f\uff00-\uffef]/;
const MIXED_TOKEN_RE =
  /[A-Za-z][A-Za-z0-9_-]*[\u3400-\u4dbf\u4e00-\u9fff]+|[\u3400-\u4dbf\u4e00-\u9fff]+[A-Za-z][A-Za-z0-9_-]*/g;
const EN_ALLOWED_CJK_PAGES = new Set([
  // These sections intentionally use Chinese source documents/images as learning examples.
  "3-4-document-upload.html",
  "3-5-multi-document.html",
  "3-6-image-demo.html",
]);

function listPages() {
  if (PAGE_ARG) return PAGE_ARG.slice("--pages=".length).split(",").filter(Boolean);
  return fs
    .readdirSync(ROOT)
    .filter((file) => file.endsWith(".html"))
    .filter((file) => file !== "0-full-content.html")
    .sort((a, b) => a.localeCompare(b, "en", { numeric: true }));
}

function listLangs() {
  if (LANG_ARG) return LANG_ARG.slice("--langs=".length).split(",").filter(Boolean);
  return ["en", "zh-TW"];
}

function normalize(text) {
  return String(text || "")
    .replace(/\s+/g, " ")
    .trim();
}

function short(text, max = 180) {
  const value = normalize(text);
  return value.length > max ? `${value.slice(0, max - 1)}…` : value;
}

function lineFor(page, lang, type, severity, text) {
  return { page, lang, type, severity, text: short(text) };
}

async function loadPage(win, page, lang) {
  const pathname = page === "index.html" ? "/" : `/${page}`;
  const runId = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  const url = `${BASE_URL}${pathname}?audit=${runId}`;
  const localizedUrl = `${BASE_URL}${pathname}?audit=${runId}-${lang}`;
  await win.loadURL(url);
  await win.webContents.executeJavaScript(
    `localStorage.setItem("language", ${JSON.stringify(lang)}); localStorage.setItem("theme", "light");`,
  );
  await win.loadURL(localizedUrl);
  await new Promise((resolve) => setTimeout(resolve, 450));
  return win.webContents.executeJavaScript(`
    (() => {
      const visibleText = document.body ? document.body.innerText || "" : "";
      const attrs = [];
      const attrNames = ["aria-label", "aria-valuetext", "title", "placeholder", "alt"];
      for (const el of document.querySelectorAll("*")) {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        const visible = style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
        if (!visible) continue;
        for (const name of attrNames) {
          const value = el.getAttribute(name);
          if (value && value.trim()) attrs.push({ name, tag: el.tagName.toLowerCase(), value });
        }
      }
      const title = document.title || "";
      const langAttr = document.documentElement.lang || "";
      return { title, langAttr, visibleText, attrs };
    })()
  `);
}

function auditSnapshot(page, lang, snapshot) {
  const findings = [];
  const body = normalize(snapshot.visibleText);
  const allText = [snapshot.title, body, ...snapshot.attrs.map((attr) => attr.value)].join("\n");

  if (lang === "en") {
    if (snapshot.langAttr && !snapshot.langAttr.startsWith("en")) {
      findings.push(lineFor(page, lang, "html-lang", "error", snapshot.langAttr));
    }
    if (CJK_RE.test(snapshot.title)) {
      findings.push(lineFor(page, lang, "document-title-cjk", "error", snapshot.title));
    }
    const cjkSeverity = EN_ALLOWED_CJK_PAGES.has(page) ? "warning" : "error";
    if (CJK_RE.test(body)) {
      findings.push(lineFor(page, lang, "visible-cjk", cjkSeverity, body.match(/.{0,70}[\u3400-\u4dbf\u4e00-\u9fff].{0,110}/u)?.[0] || body));
    }
    for (const attr of snapshot.attrs) {
      if (CJK_RE.test(attr.value)) {
        findings.push(lineFor(page, lang, `attr-cjk:${attr.tag}[${attr.name}]`, cjkSeverity, attr.value));
      }
    }
    for (const match of allText.matchAll(MIXED_TOKEN_RE)) {
      findings.push(lineFor(page, lang, "mixed-token", "error", match[0]));
    }
  }

  if (lang === "zh-TW") {
    if (snapshot.langAttr && snapshot.langAttr !== "zh-Hant-TW") {
      findings.push(lineFor(page, lang, "html-lang", "error", snapshot.langAttr));
    }
    const learnerVoiceLeaks = [
      /學生比較懂/g,
      /給學生看/g,
      /教學生/g,
      /for students/gi,
      /student-readable/gi,
    ];
    for (const re of learnerVoiceLeaks) {
      const match = allText.match(re);
      if (match) findings.push(lineFor(page, lang, "learner-voice-leak", "error", match[0]));
    }
    for (const match of allText.matchAll(MIXED_TOKEN_RE)) {
      const token = match[0];
      if (!/^(API|MCP|LLM|GPT|RAG|OCR|JSON|PDF|Word|Excel|ChatGPT|OpenAI|Hugging|Face|KV|VRAM|MoE|Apple|Mac|Studio|DGX|RTX|CPU|GPU)/.test(token)) {
        findings.push(lineFor(page, lang, "mixed-token", "warning", token));
      }
    }
  }

  return findings;
}

async function main() {
  const pages = listPages();
  const langs = listLangs();
  const consoleErrors = [];
  const win = new BrowserWindow({
    width: 1280,
    height: 1000,
    show: false,
    webPreferences: { nodeIntegration: false, contextIsolation: true },
  });
  win.webContents.on("console-message", (event) => {
    if (event.level === "error") {
      consoleErrors.push({
        page: currentPage || "(unknown)",
        lang: currentLang || "(unknown)",
        message: short(`${event.message} ${event.sourceId || ""}:${event.lineNumber || ""}`, 220),
      });
    }
  });

  await session.defaultSession.clearCache();
  const allFindings = [];
  let currentPage = "";
  let currentLang = "";

  for (const lang of langs) {
    for (const page of pages) {
      currentPage = page;
      currentLang = lang;
      try {
        const snapshot = await loadPage(win, page, lang);
        allFindings.push(...auditSnapshot(page, lang, snapshot));
      } catch (error) {
        allFindings.push(lineFor(page, lang, "load-failed", "error", error.message || String(error)));
      }
    }
  }
  for (const error of consoleErrors) {
    allFindings.push(lineFor(error.page, error.lang, "console-error", "error", error.message));
  }

  const errors = allFindings.filter((finding) => finding.severity === "error");
  const warnings = allFindings.filter((finding) => finding.severity === "warning");

  console.log(`Localization audit: ${pages.length} pages x ${langs.length} languages`);
  console.log(`Errors: ${errors.length}; warnings: ${warnings.length}`);

  for (const finding of allFindings.slice(0, MAX_FINDINGS)) {
    console.log(
      `[${finding.severity.toUpperCase()}] ${finding.lang} ${finding.page} ${finding.type}: ${finding.text}`,
    );
  }

  if (allFindings.length > MAX_FINDINGS) {
    console.log(`... ${allFindings.length - MAX_FINDINGS} more findings omitted. Increase MAX_FINDINGS to print all.`);
  }

  await win.close();
  app.exit(errors.length ? 1 : 0);
}

app.whenReady().then(main).catch((error) => {
  console.error(error);
  app.exit(1);
});
