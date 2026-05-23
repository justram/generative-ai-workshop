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

const SOURCE_LABEL_RE =
  /\b(Source|source document|source data|original document|reference answer|dataset|OCR|extracted|attachment|uploaded file|example document)\b|來源|原始|資料集|參考答案|抽出|上傳|附件|文件內容/i;

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
      const isElementVisible = (el) => {
        const style = getComputedStyle(el);
        const rect = el.getBoundingClientRect();
        return style.display !== "none" && style.visibility !== "hidden" && rect.width > 0 && rect.height > 0;
      };
      const elementPath = (el) => {
        const parts = [];
        let node = el;
        while (node && node.nodeType === Node.ELEMENT_NODE && parts.length < 6) {
          let part = node.tagName.toLowerCase();
          if (node.id) part += "#" + node.id;
          else if (node.className && typeof node.className === "string") {
            const classes = node.className.trim().split(/\\s+/).slice(0, 2).join(".");
            if (classes) part += "." + classes;
          }
          parts.unshift(part);
          node = node.parentElement;
        }
        return parts.join(" > ");
      };
      const isSourceLike = (el, text = "") => {
        let node = el;
        let hops = 0;
        while (node && hops < 4) {
          const labelText = [
            node.getAttribute?.("aria-label"),
            node.getAttribute?.("title"),
            node.getAttribute?.("data-audit-context"),
            node.querySelector?.("h1,h2,h3,h4,.text-xs,.text-sm")?.textContent,
          ]
            .filter(Boolean)
            .join(" ");
          if (${SOURCE_LABEL_RE}.test(labelText) || ${SOURCE_LABEL_RE}.test(text)) return true;
          node = node.parentElement;
          hops += 1;
        }
        return false;
      };
      const visibleText = document.body ? document.body.innerText || "" : "";
      const textNodes = [];
      if (document.body) {
        const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, {
          acceptNode(node) {
            const parent = node.parentElement;
            if (!parent) return NodeFilter.FILTER_REJECT;
            if (["SCRIPT", "STYLE", "NOSCRIPT", "SVG"].includes(parent.tagName)) {
              return NodeFilter.FILTER_REJECT;
            }
            const value = node.nodeValue.replace(/\\s+/g, " ").trim();
            if (!value) return NodeFilter.FILTER_REJECT;
            return NodeFilter.FILTER_ACCEPT;
          },
        });
        while (walker.nextNode()) {
          const node = walker.currentNode;
          const parent = node.parentElement;
          const value = node.nodeValue.replace(/\\s+/g, " ").trim();
          textNodes.push({
            value,
            visible: isElementVisible(parent),
            sourceLike: isSourceLike(parent, value),
            path: elementPath(parent),
          });
        }
      }
      const attrs = [];
      const attrNames = ["aria-label", "aria-valuetext", "title", "placeholder", "alt"];
      for (const el of document.querySelectorAll("*")) {
        const visible = isElementVisible(el);
        for (const name of attrNames) {
          const value = el.getAttribute(name);
          if (value && value.trim()) {
            attrs.push({
              name,
              tag: el.tagName.toLowerCase(),
              value,
              visible,
              sourceLike: isSourceLike(el, value),
              path: elementPath(el),
            });
          }
        }
        if (["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName)) {
          let value = "";
          if (el.tagName === "SELECT") {
            value = el.selectedOptions && el.selectedOptions[0] ? el.selectedOptions[0].textContent : el.value;
          } else {
            value = el.value;
          }
          if (value && value.trim()) {
            attrs.push({
              name: "value",
              tag: el.tagName.toLowerCase(),
              value,
              visible,
              sourceLike: isSourceLike(el, value),
              path: elementPath(el),
            });
          }
        }
      }
      const title = document.title || "";
      const langAttr = document.documentElement.lang || "";
      return { title, langAttr, visibleText, textNodes, attrs };
    })()
  `);
}

function auditSnapshot(page, lang, snapshot) {
  const findings = [];
  const body = normalize(snapshot.visibleText);
  const nodeTexts = snapshot.textNodes || [];
  const allNodeText = nodeTexts.map((node) => node.value).join("\n");
  const allText = [
    snapshot.title,
    body,
    allNodeText,
    ...snapshot.attrs.map((attr) => attr.value),
  ].join("\n");

  if (lang === "en") {
    if (snapshot.langAttr && !snapshot.langAttr.startsWith("en")) {
      findings.push(lineFor(page, lang, "html-lang", "error", snapshot.langAttr));
    }
    if (CJK_RE.test(snapshot.title)) {
      findings.push(lineFor(page, lang, "document-title-cjk", "error", snapshot.title));
    }
    for (const node of nodeTexts) {
      if (!CJK_RE.test(node.value)) continue;
      const allowedSource = EN_ALLOWED_CJK_PAGES.has(page) && node.sourceLike;
      findings.push(
        lineFor(
          page,
          lang,
          node.visible ? "text-cjk" : "hidden-text-cjk",
          allowedSource ? "warning" : "error",
          `${node.path}: ${node.value}`,
        ),
      );
    }
    for (const attr of snapshot.attrs) {
      if (CJK_RE.test(attr.value)) {
        findings.push(
          lineFor(
            page,
            lang,
            `attr-cjk:${attr.tag}[${attr.name}]`,
            EN_ALLOWED_CJK_PAGES.has(page) && attr.sourceLike ? "warning" : "error",
            `${attr.path}: ${attr.value}`,
          ),
        );
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
      if (
        !/^(API|MCP|LLM|GPT|RAG|OCR|JSON|PDF|Word|Excel|ChatGPT|OpenAI|Hugging|Face|KV|VRAM|MoE|Apple|Mac|Studio|DGX|RTX|CPU|GPU)/.test(
          token,
        )
      ) {
        findings.push(lineFor(page, lang, "mixed-token", "warning", token));
      }
    }
  }

  return findings;
}

async function main() {
  const pages = listPages();
  const langs = listLangs();

  await session.defaultSession.clearCache();
  const allFindings = [];

  for (const lang of langs) {
    for (const page of pages) {
      const consoleErrors = [];
      const win = new BrowserWindow({
        width: 1280,
        height: 1000,
        show: false,
        webPreferences: { nodeIntegration: false, contextIsolation: true },
      });
      const onConsoleMessage = (event) => {
        if (event.level === "error") {
          consoleErrors.push({
            page,
            lang,
            message: short(
              `${event.message} ${event.sourceId || ""}:${event.lineNumber || ""}`,
              220,
            ),
          });
        }
      };
      win.webContents.on("console-message", onConsoleMessage);
      try {
        const snapshot = await loadPage(win, page, lang);
        allFindings.push(...auditSnapshot(page, lang, snapshot));
      } catch (error) {
        allFindings.push(
          lineFor(page, lang, "load-failed", "error", error.message || String(error)),
        );
      } finally {
        for (const error of consoleErrors) {
          allFindings.push(
            lineFor(error.page, error.lang, "console-error", "error", error.message),
          );
        }
        win.webContents.off("console-message", onConsoleMessage);
        if (!win.isDestroyed()) {
          await new Promise((resolve) => {
            win.once("closed", resolve);
            win.close();
          });
        }
      }
    }
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
    console.log(
      `... ${allFindings.length - MAX_FINDINGS} more findings omitted. Increase MAX_FINDINGS to print all.`,
    );
  }

  app.exit(errors.length ? 1 : 0);
}

app
  .whenReady()
  .then(main)
  .catch((error) => {
    console.error(error);
    app.exit(1);
  });
