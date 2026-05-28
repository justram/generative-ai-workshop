#!/usr/bin/env node

const fs = require("node:fs/promises");
const path = require("node:path");
const { app, BrowserWindow, session } = require("electron");
const { listWorkshopPages } = require("./workshop-pages.cjs");

const root = path.resolve(__dirname, "..");
const baseUrl = process.env.BASE_URL || "http://127.0.0.1:4174";
const pageArg = process.argv.find((arg) => arg.startsWith("--pages="));
const languageArg = process.argv.find((arg) => arg.startsWith("--langs="));
const themeArg = process.argv.find((arg) => arg.startsWith("--themes="));
const noProbes = process.argv.includes("--no-probes");
const onlyProbes = process.argv.includes("--only-probes");
const pageTimeoutMs = Number(process.env.FULL_APP_AUDIT_PAGE_TIMEOUT_MS || 12000);
const outputDir =
  process.env.FULL_APP_AUDIT_OUTPUT_DIR ||
  path.join(root, "test-results", "full-app-audit", new Date().toISOString().replace(/[:.]/g, "-"));
const screenshotsDir = path.join(outputDir, "screenshots");
const logsDir = path.join(outputDir, "logs");
const languages = languageArg ? languageArg.slice("--langs=".length).split(",") : ["zh-TW", "en"];
const themes = themeArg ? themeArg.slice("--themes=".length).split(",") : ["light", "dark"];

function selectedPages() {
  if (!pageArg) return listWorkshopPages(root);
  return pageArg.slice("--pages=".length).split(",").filter(Boolean);
}

function shortText(value, max = 320) {
  const text = String(value || "")
    .replace(/\s+/g, " ")
    .trim();
  return text.length > max ? `${text.slice(0, max - 1)}…` : text;
}

function safeName(value) {
  return String(value).replace(/[^a-z0-9._-]+/gi, "_");
}

function classifyFinding(type) {
  if (/runtime|console|load|blank|crash/i.test(type)) return "P0";
  if (/language|wrong-language|interaction|old-transcript|missing-learning-signal/i.test(type))
    return "P1";
  if (/layout|overflow|weak|stale|visibility|scroll/i.test(type)) return "P2";
  return "P3";
}

function isProbablyWrongLanguageHeading(language, heading) {
  const text = shortText(heading, 160);
  if (language === "en") return /[\u3400-\u9fff]/.test(text);
  if (language !== "zh-TW") return false;
  const withoutAllowedTerms = text
    .replace(
      /\b(?:AI|LLM|GPT|ChatGPT|OpenAI|MCP|API|JSON|OCR|PDF|HTML|CSS|SVG|Artifacts?|BEST|Matt|Jheng-Hong|Yang|DBLP|Hugging\s*Face)\b/gi,
      "",
    )
    .replace(/[0-9.\s:：／/()（）\-–—]+/g, "");
  const latinLetters = (withoutAllowedTerms.match(/[A-Za-z]/g) || []).length;
  const cjkLetters = (withoutAllowedTerms.match(/[\u3400-\u9fff]/g) || []).length;
  return latinLetters >= 8 && latinLetters > cjkLetters;
}

const zhTwForbiddenLearnerPhrases = [
  "Run without CoT",
  "Run with CoT",
  "No CoT",
  "With CoT",
  "Start Over",
  "Selected",
  "See how examples improve",
  "Reference Material",
  "Company information",
  "Product details",
  "Pick a model and press play",
  "Search tools add",
  "Learning goals",
  "Tool Invocation",
  "Calculator Tool",
  "Date/Time Tool",
  "Artifacts Tool",
  "Model Context Protocol",
];

const enForbiddenLearnerPhrases = [
  "本頁學習目標",
  "重點整理",
  "系統提示",
  "重新開始",
  "執行這個方法",
  "使用參考資料執行",
  "啟用搜尋",
  "即時流程",
  "模型已產生",
];

function pageUrl(page, language, theme, marker = "audit") {
  const pathname = page === "index.html" ? "/" : `/${page}`;
  const url = new URL(pathname, baseUrl);
  url.searchParams.set(marker, `${Date.now()}-${language}-${theme}`);
  return url.toString();
}

async function ensureDirs() {
  await fs.mkdir(screenshotsDir, { recursive: true });
  await fs.mkdir(logsDir, { recursive: true });
}

async function screenshot(win, label) {
  const file = path.join(screenshotsDir, `${safeName(label)}.png`);
  const image = await win.webContents.capturePage();
  await fs.writeFile(file, image.toPNG());
  return path.relative(outputDir, file);
}

async function clickButtonContaining(win, text) {
  const target = await win.webContents.executeJavaScript(`
    (() => {
      const button = Array.from(document.querySelectorAll("button"))
        .find((button) => button.textContent.includes(${JSON.stringify(text)}));
      if (!button) return null;
      button.scrollIntoView({ block: "center", inline: "center" });
      const rect = button.getBoundingClientRect();
      return {
        x: Math.round(rect.left + rect.width / 2),
        y: Math.round(rect.top + rect.height / 2),
        text: button.textContent.trim(),
        disabled: button.disabled,
      };
    })()
  `);
  if (!target || target.disabled) return target;
  win.webContents.sendInputEvent({ type: "mouseMove", x: target.x, y: target.y });
  win.webContents.sendInputEvent({
    type: "mouseDown",
    button: "left",
    clickCount: 1,
    x: target.x,
    y: target.y,
  });
  win.webContents.sendInputEvent({
    type: "mouseUp",
    button: "left",
    clickCount: 1,
    x: target.x,
    y: target.y,
  });
  await new Promise((resolve) => setTimeout(resolve, 120));
  return target;
}

async function setLanguageAndTheme(win, language, theme) {
  await withTimeout(win.loadURL(baseUrl), pageTimeoutMs, `load base ${baseUrl}`);
  await withTimeout(
    win.webContents.executeJavaScript(
      `localStorage.setItem("language", ${JSON.stringify(language)}); localStorage.setItem("theme", ${JSON.stringify(theme)});`,
    ),
    pageTimeoutMs,
    "set language/theme",
  );
}

function withTimeout(promise, timeoutMs, label) {
  let timer;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise((_, reject) => {
      timer = setTimeout(
        () => reject(new Error(`${label} timed out after ${timeoutMs}ms`)),
        timeoutMs,
      );
    }),
  ]);
}

async function readPageSnapshot(win, page, language, theme) {
  return win.webContents.executeJavaScript(`
    (() => {
      const body = document.body?.innerText || "";
      const rect = document.body?.getBoundingClientRect?.() || { width: 0, height: 0 };
      const viewportWidth = window.innerWidth;
      const viewportHeight = window.innerHeight;
      const elements = [...document.body.querySelectorAll("*")];
      const overflowing = [];
      const clipped = [];
      const fixedOverlaps = [];
      for (const el of elements) {
        const style = getComputedStyle(el);
        if (style.display === "none" || style.visibility === "hidden") continue;
        const r = el.getBoundingClientRect();
        if (r.width <= 0 || r.height <= 0) continue;
        const label = (el.innerText || el.getAttribute("aria-label") || el.getAttribute("title") || el.tagName).replace(/\\s+/g, " ").trim().slice(0, 80);
        if (r.right > viewportWidth + 4 || r.left < -4) {
          overflowing.push({ tag: el.tagName.toLowerCase(), label, left: Math.round(r.left), right: Math.round(r.right), width: Math.round(r.width) });
        }
        const intentionallyTiny =
          r.width < 16 ||
          r.height < 10 ||
          el.closest("#local-pi-auth") ||
          el.classList.contains("truncate");
        const isFormChrome = ["INPUT", "TEXTAREA", "SELECT"].includes(el.tagName) && (r.width < 40 || r.height < 18);
        if (!intentionallyTiny && !isFormChrome && (el.scrollWidth > el.clientWidth + 8 || el.scrollHeight > el.clientHeight + 8) && !/auto|scroll/.test(style.overflow + style.overflowX + style.overflowY)) {
          clipped.push({ tag: el.tagName.toLowerCase(), label, scrollWidth: el.scrollWidth, clientWidth: el.clientWidth, scrollHeight: el.scrollHeight, clientHeight: el.clientHeight });
        }
        if (style.position === "fixed" && r.width > 0 && r.height > 0) {
          fixedOverlaps.push({ tag: el.tagName.toLowerCase(), label, left: Math.round(r.left), top: Math.round(r.top), right: Math.round(r.right), bottom: Math.round(r.bottom) });
        }
      }
      const visibleErrors = [...body.matchAll(/(?:錯誤：|建立失敗：|Error:|TypeError:|ReferenceError:)[^\\n]+|[^\\n]*is not a function[^\\n]*/gi)]
        .map((match) => match[0].trim())
        .filter(Boolean)
        .slice(0, 10);
      const mixedTokens = [...body.matchAll(/[A-Za-z][A-Za-z0-9_-]*[\\u3400-\\u9fff]+|[\\u3400-\\u9fff]+[A-Za-z][A-Za-z0-9_-]*/g)]
        .map((match) => match[0])
        .filter((token) => !/ChatGPT|OpenAI|GPT|JSON|API|MCP|LLM|AI|PDF|OCR|HTML|CSS|JavaScript|TypeScript/.test(token))
        .slice(0, 20);
      const forbiddenPhrases = ${JSON.stringify(
        language === "zh-TW" ? zhTwForbiddenLearnerPhrases : enForbiddenLearnerPhrases,
      )};
      const wrongLanguagePhrases = forbiddenPhrases
        .filter((phrase) => body.includes(phrase))
        .slice(0, 12);
      return {
        page: ${JSON.stringify(page)},
        language: ${JSON.stringify(language)},
        theme: ${JSON.stringify(theme)},
        url: location.href,
        title: document.title || "",
        lang: document.documentElement.lang || "",
        heading: document.querySelector("h1")?.innerText?.trim() || "",
        bodyLength: body.trim().length,
        bodyStart: body.replace(/\\s+/g, " ").trim().slice(0, 280),
        blankish: body.trim().length < 80,
        visibleErrors,
        wrongLanguagePhrases,
        mixedTokens,
        overflowing: overflowing.slice(0, 12),
        clipped: clipped.slice(0, 12),
        fixedOverlaps: fixedOverlaps.slice(0, 8),
        viewport: { width: viewportWidth, height: viewportHeight, bodyWidth: Math.round(rect.width), bodyHeight: Math.round(rect.height) },
      };
    })()
  `);
}

async function loadAndSnapshot(win, page, language, theme) {
  const consoleErrors = [];
  const failedLoads = [];
  const onConsole = (_event, level, message, line, sourceId) => {
    if (level === 3 || level === "error") {
      consoleErrors.push(shortText(`${message} ${sourceId || ""}:${line || ""}`, 420));
    }
  };
  const onFailLoad = (_event, errorCode, errorDescription, validatedURL, isMainFrame) => {
    if (isMainFrame) failedLoads.push({ errorCode, errorDescription, validatedURL });
  };
  win.webContents.on("console-message", onConsole);
  win.webContents.on("did-fail-load", onFailLoad);
  try {
    await setLanguageAndTheme(win, language, theme);
    await withTimeout(win.loadURL(pageUrl(page, language, theme)), pageTimeoutMs, `load ${page}`);
    await new Promise((resolve) => setTimeout(resolve, 600));
    const snapshot = await readPageSnapshot(win, page, language, theme);
    const findings = [];
    if (failedLoads.length) findings.push({ type: "load-failure", detail: failedLoads });
    if (consoleErrors.length) findings.push({ type: "console-error", detail: consoleErrors });
    if (snapshot.blankish) findings.push({ type: "blankish-page", detail: snapshot.bodyStart });
    if (snapshot.visibleErrors.length)
      findings.push({ type: "visible-error", detail: snapshot.visibleErrors });
    if (snapshot.overflowing.length)
      findings.push({ type: "layout-horizontal-overflow", detail: snapshot.overflowing });
    if (snapshot.clipped.length)
      findings.push({ type: "layout-clipped-content", detail: snapshot.clipped });
    if (isProbablyWrongLanguageHeading(language, snapshot.heading)) {
      findings.push({ type: "wrong-language-heading", detail: snapshot.heading });
    }
    if (snapshot.wrongLanguagePhrases.length) {
      findings.push({
        type: "wrong-language-learner-phrase",
        detail: snapshot.wrongLanguagePhrases,
      });
    }
    if (snapshot.mixedTokens.length) {
      findings.push({ type: "mixed-language-token", detail: snapshot.mixedTokens });
    }
    const result = { ...snapshot, consoleErrors, failedLoads, findings };
    if (findings.length) result.screenshot = await screenshot(win, `${page}-${language}-${theme}`);
    return result;
  } catch (error) {
    const result = {
      page,
      language,
      theme,
      url: pageUrl(page, language, theme),
      consoleErrors,
      failedLoads,
      findings: [{ type: "runtime-exception", detail: String(error.stack || error) }],
    };
    result.screenshot = await screenshot(win, `${page}-${language}-${theme}-exception`).catch(
      () => null,
    );
    return result;
  } finally {
    win.webContents.off("console-message", onConsole);
    win.webContents.off("did-fail-load", onFailLoad);
  }
}

async function probe(win, id, page, language, theme, body) {
  await setLanguageAndTheme(win, language, theme);
  await withTimeout(
    win.loadURL(pageUrl(page, language, theme, `probe-${id}`)),
    pageTimeoutMs,
    `load probe ${id}`,
  );
  await new Promise((resolve) => setTimeout(resolve, 900));
  try {
    const before = await readPageSnapshot(win, page, language, theme);
    const outcome = await body(win, before);
    const after = await readPageSnapshot(win, page, language, theme);
    const findings = outcome.findings || [];
    const result = { id, page, language, theme, before, after, ...outcome, findings };
    if (findings.length) result.screenshot = await screenshot(win, `${id}-${page}-${language}`);
    return result;
  } catch (error) {
    const result = {
      id,
      page,
      language,
      theme,
      findings: [{ type: "interaction-runtime-exception", detail: String(error.stack || error) }],
    };
    result.screenshot = await screenshot(win, `${id}-${page}-${language}-exception`).catch(
      () => null,
    );
    return result;
  }
}

async function runProbes(win) {
  const probes = [];
  probes.push(
    await probe(win, "section2-scenes", "2-what-is-llm.html", "zh-TW", "light", async () => {
      const result = await win.webContents.executeJavaScript(`
        (async () => {
          const findings = [];
          const next = () => Array.from(document.querySelectorAll("button")).find((button) => button.textContent.trim() === "→");
          for (let index = 0; index < 7; index += 1) {
            await new Promise((resolve) => setTimeout(resolve, 120));
            const stage = document.querySelector(".stage");
            const rect = stage?.getBoundingClientRect();
            const overflows = [...(stage?.querySelectorAll("*") || [])].filter((el) => {
              const r = el.getBoundingClientRect();
              return rect && (r.left < rect.left - 3 || r.right > rect.right + 3 || r.top < rect.top - 3 || r.bottom > rect.bottom + 3);
            }).slice(0, 5).map((el) => el.textContent?.replace(/\\s+/g, " ").trim().slice(0, 80) || el.tagName);
            if (overflows.length) findings.push({ type: "layout-overflow-scene-" + index, detail: overflows });
            if (index < 6) next()?.click();
          }
          const temp = document.querySelector("input[type=range]");
          let tempChanged = true;
          if (temp) {
            const before = document.body.innerText;
            temp.value = String(Number(temp.max || 1));
            temp.dispatchEvent(new Event("input", { bubbles: true }));
            await new Promise((resolve) => setTimeout(resolve, 160));
            tempChanged = before !== document.body.innerText || temp.value === String(temp.max);
          }
          if (!tempChanged) findings.push({ type: "interaction-temperature-no-visible-change", detail: "temperature slider did not change visible state" });
          return { findings };
        })()
      `);
      return result;
    }),
  );

  probes.push(
    await probe(
      win,
      "calculator-ab-reset",
      "5-2-calculator-tool.html",
      "zh-TW",
      "light",
      async () => {
        const result = await win.webContents.executeJavaScript(`
        (async () => {
          const findings = [];
          const clickText = (text) => Array.from(document.querySelectorAll("button")).find((button) => button.textContent.includes(text))?.click();
          clickText("啟用 calculate");
          await new Promise((resolve) => setTimeout(resolve, 5200));
          const afterTool = document.querySelector("agent-interface")?.innerText || document.body.innerText;
          clickText("模型自己算");
          await new Promise((resolve) => setTimeout(resolve, 1400));
          const afterNoTool = document.querySelector("agent-interface")?.innerText || document.body.innerText;
          if (/本機計算機回傳|即時流程|工具已回傳結果/.test(afterNoTool)) {
            findings.push({ type: "interaction-old-transcript-not-cleared", detail: "tool run text remained after switching to no-tool run" });
          }
          if (/Write thank you notes|Gift: Blanket|使用者/.test(afterNoTool) && !/使用者/.test(afterTool)) {
            findings.push({ type: "unexpected-cross-page-text", detail: "unrelated text leaked into calculator page" });
          }
          return { findings, evidence: { afterToolHasCalculator: /本機計算機回傳|即時流程/.test(afterTool), afterNoToolStart: afterNoTool.replace(/\\s+/g, " ").slice(0, 600) } };
        })()
      `);
        return result;
      },
    ),
  );

  probes.push(
    await probe(win, "fewshot-zh-prompt", "4-6-few-shot.html", "zh-TW", "light", async () => {
      const result = await win.webContents.executeJavaScript(`
        (async () => {
          const findings = [];
          const demo = document.querySelector("few-shot-demo");
          const buttons = Array.from(document.querySelectorAll("button")).filter((button) => button.textContent.includes("三個範例"));
          const thankYouButton = buttons[1] || buttons[0];
          if (!thankYouButton) return { findings: [{ type: "interaction-control-missing", detail: "三個範例" }] };
          thankYouButton.click();
          await new Promise((resolve) => setTimeout(resolve, 1800));
          const agentText = document.querySelector("agent-interface")?.innerText || "";
          const bodyText = document.body.innerText;
          if (demo?.selectedExample !== "thankyou" || demo?.shotCount !== 3) {
            findings.push({ type: "missing-learning-signal", detail: "few-shot selection did not update component state" });
          }
          if (/Write thank you notes|Gift: Blanket|Wine glasses from the Johnsons/.test(agentText + "\\n" + bodyText)) {
            findings.push({ type: "wrong-language-interaction-prompt", detail: "old English few-shot prompt visible in zh-TW" });
          }
          return { findings, evidence: { selectedExample: demo?.selectedExample, shotCount: demo?.shotCount, agentTextStart: agentText.replace(/\\s+/g, " ").slice(0, 500) } };
        })()
      `);
      return result;
    }),
  );

  const presetRegressionSpecs = [
    ["persona-preset-persist", "4-1-personas.html", "請介紹 BEST 是什麼。"],
    ["structured-io-preset-persist", "4-2-structured-io.html", "執行這個方法"],
    ["reasoning-preset-persist", "4-3-chain-of-thought.html", "直接回答"],
    ["prompt-chain-preset-persist", "4-7-prompt-chaining.html", "步驟 1"],
    ["self-correction-preset-persist", "4-8-self-correction.html", "步驟 1"],
    ["datetime-preset-persist", "5-3-datetime-tool.html", "不用工具"],
  ];

  for (const [id, page, buttonText] of presetRegressionSpecs) {
    probes.push(
      await probe(win, id, page, "zh-TW", "light", async () => {
        const clicked = await clickButtonContaining(win, buttonText);
        if (!clicked) {
          return { findings: [{ type: "interaction-control-missing", detail: buttonText }] };
        }
        if (clicked.disabled) {
          return { findings: [{ type: "interaction-control-disabled", detail: buttonText }] };
        }
        await new Promise((resolve) => setTimeout(resolve, 9000));
        const result = await win.webContents.executeJavaScript(`
          (async () => {
            const findings = [];
            const userMessages = Array.from(document.querySelectorAll("user-message"))
              .map((node) => node.innerText.trim())
              .filter(Boolean);
            const assistantMessages = Array.from(document.querySelectorAll("assistant-message"))
              .map((node) => node.innerText.trim())
              .filter(Boolean)
              .filter((text) => !/^錯誤：/.test(text));
            const streamingText = Array.from(document.querySelectorAll(".streaming-message, .stream-message, [data-streaming]"))
              .map((node) => node.innerText.trim())
              .filter(Boolean);
            const bodyAfter = document.body.innerText;
            const authBlocked = /not connected|尚未連線|請先.*登入|No auth token|ChatGPT not connected/i.test(bodyAfter);
            if (!authBlocked && userMessages.length < 1) {
              findings.push({ type: "interaction-user-message-disappeared", detail: "preset click left no persisted user message" });
            }
            if (!authBlocked && assistantMessages.length < 1) {
              findings.push({ type: "interaction-assistant-message-disappeared", detail: "preset click left no persisted assistant message" });
            }
            if (/is not a function|TypeError:|ReferenceError:/.test(bodyAfter)) {
              findings.push({ type: "visible-runtime-error", detail: bodyAfter.match(/[^\\n]*(?:is not a function|TypeError:|ReferenceError:)[^\\n]*/)?.[0] });
            }
            return {
              findings,
              blocked: authBlocked,
              evidence: {
                clicked: ${JSON.stringify(clicked)},
                userCount: userMessages.length,
                assistantCount: assistantMessages.length,
                streamingTextCount: streamingText.length,
                userStart: userMessages[0]?.slice(0, 160) || "",
                assistantStart: assistantMessages[0]?.slice(0, 220) || "",
              },
            };
          })()
        `);
        return result;
      }),
    );
  }

  const liveProbeSpecs = [
    ["grounding-visible", "4-4-grounding.html", "zh-TW", "light", "使用參考資料執行"],
    ["websearch-localized", "5-4-websearch-tool.html", "zh-TW", "light", "啟用搜尋"],
    ["artifacts-progress", "5-5-artifacts-tool.html", "zh-TW", "light", "建立"],
    ["mcp-protocol", "5-6-mcp.html", "zh-TW", "light", "執行"],
    ["injection-visible", "4-9-prompt-injection.html", "zh-TW", "light", "送出"],
  ];

  for (const [id, page, language, theme, buttonText] of liveProbeSpecs) {
    probes.push(
      await probe(win, id, page, language, theme, async () => {
        const result = await win.webContents.executeJavaScript(`
          (async () => {
            const findings = [];
            const bodyBefore = document.body.innerText;
            const button = Array.from(document.querySelectorAll("button")).find((button) => button.textContent.includes(${JSON.stringify(buttonText)}));
            if (!button) {
              return { findings: [{ type: "interaction-control-missing", detail: ${JSON.stringify(buttonText)} }], blocked: false };
            }
            button.click();
            await new Promise((resolve) => setTimeout(resolve, 5200));
            const bodyAfter = document.body.innerText;
            const authBlocked = /not connected|尚未連線|請先.*登入|No auth token|ChatGPT not connected/i.test(bodyAfter);
            const changed = bodyAfter !== bodyBefore;
            if (!authBlocked && !changed) {
              findings.push({ type: "missing-learning-signal", detail: "click did not visibly change the page" });
            }
            if (/is not a function|TypeError:|ReferenceError:/.test(bodyAfter)) {
              findings.push({ type: "visible-runtime-error", detail: bodyAfter.match(/[^\\n]*(?:is not a function|TypeError:|ReferenceError:)[^\\n]*/)?.[0] });
            }
            if (${JSON.stringify(id)} === "fewshot-zh-prompt" && /Write thank you notes|Gift: Blanket|Wine glasses from the Johnsons/.test(bodyAfter)) {
              findings.push({ type: "wrong-language-interaction-prompt", detail: "old English few-shot prompt visible in zh-TW" });
            }
            return { findings, blocked: authBlocked, evidence: { changed, bodyAfterStart: bodyAfter.replace(/\\s+/g, " ").slice(0, 700) } };
          })()
        `);
        return result;
      }),
    );
  }
  return probes;
}

function flattenFindings(results, probes) {
  const findings = [];
  for (const result of results) {
    for (const finding of result.findings || []) {
      findings.push({
        severity: classifyFinding(finding.type),
        page: result.page,
        language: result.language,
        theme: result.theme,
        type: finding.type,
        detail: finding.detail,
        screenshot: result.screenshot || null,
      });
    }
  }
  for (const result of probes) {
    for (const finding of result.findings || []) {
      findings.push({
        severity: classifyFinding(finding.type),
        probe: result.id,
        page: result.page,
        language: result.language,
        theme: result.theme,
        type: finding.type,
        detail: finding.detail,
        screenshot: result.screenshot || null,
      });
    }
  }
  return findings.sort((a, b) => a.severity.localeCompare(b.severity));
}

function markdownValue(value) {
  if (typeof value === "string") return value;
  return `\`${JSON.stringify(value).slice(0, 700)}\``;
}

async function writeReport({ pages, results, probes, findings }) {
  const grouped = new Map();
  for (const finding of findings) {
    if (!grouped.has(finding.severity)) grouped.set(finding.severity, []);
    grouped.get(finding.severity).push(finding);
  }
  const lines = [];
  lines.push("# Full App Hybrid Audit Report", "");
  lines.push(`- Generated: ${new Date().toISOString()}`);
  lines.push(`- Base URL: ${baseUrl}`);
  lines.push(`- Pages: ${pages.length}`);
  lines.push(`- Render checks: ${results.length}`);
  lines.push(`- Interaction probes: ${probes.length}`);
  lines.push(`- Findings: ${findings.length}`, "");
  lines.push("## Summary", "");
  for (const severity of ["P0", "P1", "P2", "P3"]) {
    lines.push(`- ${severity}: ${(grouped.get(severity) || []).length}`);
  }
  lines.push("");
  for (const severity of ["P0", "P1", "P2", "P3"]) {
    const items = grouped.get(severity) || [];
    if (!items.length) continue;
    lines.push(`## ${severity} Findings`, "");
    for (const item of items) {
      const target = item.probe ? `${item.page} / ${item.probe}` : item.page;
      lines.push(
        `- **${item.type}** on \`${target}\` (${item.language}, ${item.theme}): ${markdownValue(item.detail)}`,
      );
      if (item.screenshot) lines.push(`  - Screenshot: \`${item.screenshot}\``);
    }
    lines.push("");
  }
  lines.push("## Probe Outcomes", "");
  for (const probeResult of probes) {
    lines.push(
      `- \`${probeResult.id}\` on \`${probeResult.page}\`: ${
        probeResult.findings?.length
          ? "findings"
          : probeResult.blocked
            ? "blocked by auth/offline state"
            : "passed"
      }`,
    );
  }
  await fs.writeFile(path.join(outputDir, "audit-report.md"), lines.join("\n"));
}

async function main() {
  await ensureDirs();
  await app.whenReady();
  await session.defaultSession.clearCache();
  const win = new BrowserWindow({
    width: 1280,
    height: 960,
    show: false,
    webPreferences: { contextIsolation: true, nodeIntegration: false },
  });
  const pages = onlyProbes ? [] : selectedPages();
  const results = [];
  for (const page of pages) {
    for (const language of languages) {
      for (const theme of themes) {
        results.push(await loadAndSnapshot(win, page, language, theme));
      }
    }
  }
  const probes = noProbes ? [] : await runProbes(win);
  const findings = flattenFindings(results, probes);
  const report = {
    generatedAt: new Date().toISOString(),
    root,
    baseUrl,
    pages,
    languages,
    themes,
    results,
    probes,
    findings,
  };
  await fs.writeFile(path.join(outputDir, "audit-report.json"), JSON.stringify(report, null, 2));
  await writeReport({ pages, results, probes, findings });
  await fs.writeFile(path.join(logsDir, "browser-results.json"), JSON.stringify(results, null, 2));
  win.destroy();
  app.exit(0);
}

main().catch(async (error) => {
  await fs.mkdir(outputDir, { recursive: true });
  await fs.writeFile(
    path.join(outputDir, "audit-error.txt"),
    String(error.stack || error.message || error),
  );
  console.error(error);
  app.exit(1);
});
