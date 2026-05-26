import { LitElement } from "lit";
import {
  __decorate,
  getCurrentLanguage,
  i18n,
  t$1 as customElement,
  x as html,
} from "../mini-lit/index.js";
import "../mini-lit/index.js";

const PACKAGE_DRIVE_URL =
  "https://drive.google.com/drive/folders/1emRlwPseX7F0VFKkzMJvAFDTPH7VRKBF?usp=drive_link";

const attribution = {
  en: {
    originalPrefix: "Original workshop content ©",
    originalSuffix: ". Authorized for release in this package under Apache-2.0.",
    licensePrefix: "Traditional Chinese translation, localization, and local app changes © 2026",
    maintainerName: "Jheng-Hong (Matt) Yang",
    licenseSuffix: ", Stencilzeit. The complete package is released under Apache-2.0.",
  },
  "zh-TW": {
    originalPrefix: "原始工作坊內容 ©",
    originalSuffix: "；Mario 已授權本套件以 Apache-2.0 釋出。",
    licensePrefix: "繁體中文翻譯、在地化內容與本地 app 修改 © 2026",
    maintainerName: "Jheng-Hong (Matt) Yang / 楊政紘",
    licenseSuffix: "，Stencilzeit。本完整套件以 Apache-2.0 授權釋出。",
  },
};

const sections = [
  {
    title: {
      en: "1. What This Workshop Is and Is Not",
      "zh-TW": "1. 這個工作坊是什麼，以及不是什麼",
    },
    description: {
      en: "A practical map of what you will learn.",
      "zh-TW": "本工作坊學習內容總覽。",
    },
    href: "1-introduction.html",
  },
  {
    title: {
      en: "2. What Is a Large Language Model?",
      "zh-TW": "2. 什麼是大型語言模型？",
    },
    description: {
      en: "Interactively explore how LLMs operate.",
      "zh-TW": "互動探索 LLM 的運作方式。",
    },
    href: "2-what-is-llm.html",
  },
  {
    title: { en: "3. Understanding Chatbots", "zh-TW": "3. 了解聊天機器人" },
    children: [
      [
        "3.1",
        "The Fundamental Illusion",
        "聊天機器人的基本幻象",
        "How chatbot interfaces work behind the scenes",
        "聊天機器人介面背後如何運作",
        "3-1-chatbot-interface.html",
      ],
      [
        "3.2",
        "Providers and Models",
        "供應商與模型",
        "AI providers and their different models",
        "AI 供應商與各種模型",
        "3-2-providers-models.html",
      ],
      [
        "3.3",
        "Context Window",
        "上下文長度",
        "Context limits and memory limitations",
        "上下文長度限制與記憶限制",
        "3-3-context-window.html",
      ],
      [
        "3.4",
        "Document Upload",
        "文件上傳",
        "What happens when you upload PDFs and images",
        "上傳 PDF 與圖片時會發生什麼",
        "3-4-document-upload.html",
      ],
      [
        "3.5",
        "Multiple Documents",
        "多份文件",
        "Multi-document synthesis challenges",
        "多文件整合的挑戰",
        "3-5-multi-document.html",
      ],
      [
        "3.6",
        "Image Upload",
        "圖片上傳",
        "Test vision model limitations",
        "測試視覺模型的限制",
        "3-6-image-demo.html",
      ],
      [
        "3.7",
        "The Hidden Costs",
        "隱藏成本",
        "Watch costs add up in real time",
        "即時觀察成本如何累積",
        "3-7-hidden-costs.html",
      ],
      [
        "3.8",
        "Key Takeaways",
        "重點整理",
        "Real-world limitations of chatbots",
        "聊天機器人在真實世界中的限制",
        "3-8-practice.html",
      ],
    ],
  },
  {
    title: { en: "4. Prompting Techniques", "zh-TW": "4. 提示工程技巧" },
    children: [
      [
        "4.0",
        "Prompting Overview",
        "提示工程總覽",
        "The reality of prompting and key techniques",
        "提示工程的實際樣貌與關鍵技巧",
        "4-overview.html",
      ],
      [
        "4.1",
        "Personas",
        "角色設定",
        "Make LLMs roleplay with personalities",
        "讓大型語言模型以不同人格扮演角色",
        "4-1-personas.html",
      ],
      [
        "4.2",
        "Structured I/O",
        "結構化輸入／輸出",
        "Delimiters and formats for parsing",
        "用於解析的分隔符與格式",
        "4-2-structured-io.html",
      ],
      [
        "4.3",
        "Chain of Thought",
        "Chain of Thought（叫模型思考）",
        "Step-by-step reasoning",
        "讓模型逐步思考",
        "4-3-chain-of-thought.html",
      ],
      [
        "4.4",
        "Grounding",
        "提供額外資訊",
        "Prevent hallucination with references",
        "提供參考資料，降低模型亂講的機會",
        "4-4-grounding.html",
      ],
      [
        "4.5",
        "NLP Tasks",
        "自然語言處理任務",
        "Language processing with simple verbs",
        "用簡單動詞處理語言任務",
        "4-5-nlp-tasks.html",
      ],
      [
        "4.6",
        "Few-Shot Learning",
        "提供範例（In-context learning）",
        "Teach patterns through examples",
        "透過範例讓語言模型抓到任務模式",
        "4-6-few-shot.html",
      ],
      [
        "4.7",
        "Prompt Chaining",
        "拆解任務",
        "Break complex tasks into steps",
        "把複雜任務分多步驟來解",
        "4-7-prompt-chaining.html",
      ],
      [
        "4.8",
        "Self-Correction",
        "自我修正",
        "Iterative improvement",
        "檢查後再改進輸出",
        "4-8-self-correction.html",
      ],
      [
        "4.9",
        "Prompt Injection",
        "提示注入",
        "Security awareness",
        "安全性議題",
        "4-9-prompt-injection.html",
      ],
      [
        "4.10",
        "Key Takeaways",
        "重點整理",
        "Best practices summary",
        "最佳實務總結",
        "4-10-takeaways.html",
      ],
    ],
  },
  {
    title: {
      en: "5. Agents: Giving LLMs Tools",
      "zh-TW": "5. AI 代理人：讓大型語言模型使用工具",
    },
    children: [
      [
        "5.0",
        "Agents Overview",
        "AI 代理人總覽",
        "Introduction to tool use",
        "使用工具入門",
        "5-overview.html",
      ],
      [
        "5.1",
        "Tool Calls",
        "工具呼叫",
        "How LLMs call tools and risks",
        "大型語言模型如何呼叫工具，以及相關風險",
        "5-1-tool-invocation.html",
      ],
      [
        "5.2",
        "Calculator Tool",
        "計算機工具",
        "Hand exact arithmetic to a tool",
        "把精確計算交給工具",
        "5-2-calculator-tool.html",
      ],
      [
        "5.3",
        "Date/Time Tool",
        "日期／時間工具",
        "LLMs have no real-time awareness",
        "大型語言模型沒有即時感知能力",
        "5-3-datetime-tool.html",
      ],
      [
        "5.4",
        "Web Search Tool",
        "網路搜尋工具",
        "Breaking the knowledge cutoff",
        "突破知識截止日期",
        "5-4-websearch-tool.html",
      ],
      [
        "5.5",
        "Artifacts Tool",
        "產物工具（Artifacts）",
        "Co-create and modify files with the model",
        "和模型一起建立與修改檔案",
        "5-5-artifacts-tool.html",
      ],
      [
        "5.6",
        "Model Context Protocol",
        "模型上下文協定（MCP）",
        "Tools declared by an external server",
        "看工具如何由外部 server 宣告與授權",
        "5-6-mcp.html",
      ],
      [
        "5.7",
        "Key Takeaways",
        "重點整理",
        "Tools, agents, and risks",
        "工具、AI 代理人與風險",
        "5-7-key-takeaways.html",
      ],
    ],
  },
  {
    title: { en: "6. Self-Hosting LLMs", "zh-TW": "6. 自行架設大型語言模型" },
    children: [
      [
        "6.0",
        "Self-Hosting Overview",
        "自行架設總覽",
        "What self-hosting is and when it is worth it",
        "什麼是自行架設？什麼時候適合？",
        "6-overview.html",
      ],
      [
        "6.1",
        "Models: What to Run and Where to Find Them",
        "模型：要跑什麼、去哪裡找",
        "Closed/open weights, model size, and sources",
        "封閉與開放權重、模型大小與來源",
        "6-1-models.html",
      ],
      [
        "6.2",
        "Software Stack",
        "軟體堆疊",
        "Models, inference engines, APIs, and UIs",
        "模型、推論引擎、API 與 UI",
        "6-2-software-stack.html",
      ],
      [
        "6.3",
        "Hardware",
        "硬體",
        "GPUs, consumer hardware, and cloud options",
        "GPU、消費級硬體與雲端選項",
        "6-3-hardware.html",
      ],
      [
        "6.4",
        "Hands-On Demos",
        "實作示範",
        "Practical checks for local models and APIs",
        "本機模型與 API 的實作驗收",
        "6-4-demos.html",
      ],
    ],
  },
  {
    title: { en: "7. Where to Go from Here", "zh-TW": "7. 接下來可以往哪裡走" },
    description: {
      en: "Resources, tools, and next steps for your AI journey.",
      "zh-TW": "AI 旅程中的資源、工具與下一步。",
    },
    href: "7-where-to-go.html",
  },
];

function text(value, language) {
  if (typeof value === "string") return i18n(value);
  return value[language] ?? value.en ?? "";
}

let WorkshopIndex = class WorkshopIndex extends LitElement {
  constructor() {
    super();
    this.showPackageQr = false;
  }

  createRenderRoot() {
    return this;
  }

  openPackageQr() {
    this.showPackageQr = true;
    this.requestUpdate();
  }

  closePackageQr() {
    this.showPackageQr = false;
    this.requestUpdate();
  }

  renderLeaf(section, language) {
    return html`
      <div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
        <a href=${section.href} class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
          <h2 class="text-lg font-semibold">${text(section.title, language)}</h2>
          <p class="text-sm text-muted-foreground mt-1">${text(section.description, language)}</p>
        </a>
      </div>
    `;
  }

  renderGroup(section, language) {
    return html`
      <div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
        <h2 class="text-lg font-bold mb-3 px-3">${text(section.title, language)}</h2>
        <div class="space-y-2">
          ${section.children.map(
            ([number, enTitle, zhTitle, enDescription, zhDescription, href]) => html`
              <a href=${href} class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
                <div class="flex items-start gap-2">
                  <span class="text-xs font-mono text-muted-foreground mt-0.5">${number}</span>
                  <div class="flex-1">
                    <h3 class="font-medium">${language === "en" ? enTitle : zhTitle}</h3>
                    <p class="text-xs text-muted-foreground mt-0.5">
                      ${language === "en" ? enDescription : zhDescription}
                    </p>
                  </div>
                </div>
              </a>
            `,
          )}
        </div>
      </div>
    `;
  }

  render() {
    const language = getCurrentLanguage() === "en" ? "en" : "zh-TW";
    const copy = attribution[language];
    document.documentElement.lang = language === "en" ? "en" : "zh-Hant-TW";
    document.title = language === "en" ? "Generative AI Workshop" : "生成式人工智慧工作坊";
    return html`
      <div class="min-h-screen p-4 lg:p-8">
        <div class="fixed top-4 right-4 z-10 flex items-center gap-2">
          <language-selector></language-selector>
          <theme-toggle includeSystem></theme-toggle>
        </div>
        <div class="max-w-6xl mx-auto">
          <div class="mb-4 flex flex-col gap-3 pr-24 sm:flex-row sm:items-end sm:justify-between">
            <h1 class="text-3xl lg:text-4xl text-foreground font-bold">
              ${language === "en" ? "Generative AI Workshop" : "生成式人工智慧工作坊"}
            </h1>
            <button
              type="button"
              class="inline-flex w-fit items-center gap-2 rounded-md border border-border bg-card px-3 py-2 text-sm font-semibold text-foreground shadow-xs transition-colors hover:bg-muted"
              @click=${() => this.openPackageQr()}
            >
              <span aria-hidden="true">▦</span>
              <span>${language === "en" ? "Package QR" : "下載 QR Code"}</span>
            </button>
          </div>
          <div class="space-y-6">
            ${sections.map((section) =>
              section.children
                ? this.renderGroup(section, language)
                : this.renderLeaf(section, language),
            )}
            <footer
              class="p-4 border border-border rounded-md bg-card text-xs text-muted-foreground leading-relaxed"
            >
              <div class="px-3 py-2">
                <p>
                  ${copy.originalPrefix}
                  <strong>Mario Zechner</strong> (<a
                    href="https://mariozechner.at"
                    target="_blank"
                    class="underline hover:no-underline"
                    >mariozechner.at</a
                  >,
                  <a href="mailto:contact@mariozechner.at" class="underline hover:no-underline"
                    >contact@mariozechner.at</a
                  >)${copy.originalSuffix}
                </p>
                <p class="mt-1">
                  ${copy.licensePrefix}
                  <strong>${copy.maintainerName}</strong> (<a
                    href="https://justram.github.io"
                    target="_blank"
                    class="underline hover:no-underline"
                    >justram.github.io</a
                  >,
                  <a href="mailto:jhyang@stencilzeit.com" class="underline hover:no-underline"
                    >jhyang@stencilzeit.com</a
                  >)${copy.licenseSuffix}
                  <a
                    href="https://www.apache.org/licenses/LICENSE-2.0"
                    target="_blank"
                    class="underline hover:no-underline"
                  >
                    Apache-2.0
                  </a>
                </p>
              </div>
            </footer>
          </div>
        </div>
      </div>
      ${this.showPackageQr
        ? html`
            <div
              class="fixed inset-0 z-50 flex items-center justify-center bg-black/55 p-4"
              role="dialog"
              aria-modal="true"
              aria-label=${language === "en" ? "Package download QR code" : "套件下載 QR Code"}
              @click=${(event) => {
                if (event.target === event.currentTarget) this.closePackageQr();
              }}
            >
              <div
                class="w-full max-w-sm rounded-xl border border-border bg-card p-5 text-card-foreground shadow-xl"
              >
                <div class="flex items-start justify-between gap-4">
                  <div>
                    <div class="text-lg font-bold">
                      ${language === "en" ? "Download Package" : "下載套件"}
                    </div>
                    <p class="mt-1 text-sm text-muted-foreground">
                      ${language === "en"
                        ? "Scan to open the shared Google Drive folder."
                        : "掃描後開啟共享 Google Drive 資料夾。"}
                    </p>
                  </div>
                  <button
                    type="button"
                    class="rounded-md px-2 py-1 text-xl leading-none text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label=${language === "en" ? "Close" : "關閉"}
                    @click=${() => this.closePackageQr()}
                  >
                    ×
                  </button>
                </div>
                <div class="mt-4 rounded-lg border border-border bg-white p-4">
                  <img
                    src="/api/package/qr"
                    alt=${language === "en"
                      ? "QR code for the package Google Drive folder"
                      : "套件 Google Drive 資料夾 QR Code"}
                    class="block h-auto w-full"
                    loading="lazy"
                    decoding="async"
                  />
                </div>
                <a
                  class="mt-4 block break-all rounded-md border border-border bg-muted/40 px-3 py-2 text-sm font-semibold text-foreground underline hover:bg-muted"
                  href=${PACKAGE_DRIVE_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  ${PACKAGE_DRIVE_URL}
                </a>
              </div>
            </div>
          `
        : ``}
    `;
  }
};

WorkshopIndex = __decorate([customElement("workshop-index")], WorkshopIndex);

document.body.appendChild(document.createElement("workshop-index"));
