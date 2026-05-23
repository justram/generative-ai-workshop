import {
  __decorate,
  b,
  getCurrentLanguage,
  i,
  i18n,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/index.js
var attribution = {
  en: {
    created: "Created by",
    maintained: "Traditional Chinese translation and maintenance by"
  },
  "zh-TW": {
    created: "\u539F\u4F5C\u8005\uFF1A",
    maintained: "\u7FFB\u8B6F\u8207\u7DAD\u8B77\uFF1A"
  }
};
var sections = [
  {
    title: {
      en: "1. What This Workshop Is and Is Not",
      "zh-TW": "1. \u9019\u500B\u5DE5\u4F5C\u574A\u662F\u4EC0\u9EBC\uFF0C\u4EE5\u53CA\u4E0D\u662F\u4EC0\u9EBC"
    },
    description: {
      en: "A practical map of what you will learn.",
      "zh-TW": "\u672C\u5DE5\u4F5C\u574A\u5B78\u7FD2\u5167\u5BB9\u7E3D\u89BD\u3002"
    },
    href: "1-introduction.html"
  },
  {
    title: {
      en: "2. What Is a Large Language Model?",
      "zh-TW": "2. \u4EC0\u9EBC\u662F\u5927\u578B\u8A9E\u8A00\u6A21\u578B\uFF1F"
    },
    description: {
      en: "Interactively explore how LLMs operate.",
      "zh-TW": "\u4E92\u52D5\u63A2\u7D22 LLM \u7684\u904B\u4F5C\u65B9\u5F0F\u3002"
    },
    href: "2-what-is-llm.html"
  },
  {
    title: { en: "3. Understanding Chatbots", "zh-TW": "3. \u4E86\u89E3\u804A\u5929\u6A5F\u5668\u4EBA" },
    children: [
      [
        "3.1",
        "The Fundamental Illusion",
        "\u804A\u5929\u6A5F\u5668\u4EBA\u7684\u57FA\u672C\u5E7B\u8C61",
        "How chatbot interfaces work behind the scenes",
        "\u804A\u5929\u6A5F\u5668\u4EBA\u4ECB\u9762\u80CC\u5F8C\u5982\u4F55\u904B\u4F5C",
        "3-1-chatbot-interface.html"
      ],
      [
        "3.2",
        "Providers and Models",
        "\u4F9B\u61C9\u5546\u8207\u6A21\u578B",
        "AI providers and their different models",
        "AI \u4F9B\u61C9\u5546\u8207\u5404\u7A2E\u6A21\u578B",
        "3-2-providers-models.html"
      ],
      [
        "3.3",
        "Context Window",
        "\u4E0A\u4E0B\u6587\u9577\u5EA6",
        "Context limits and memory limitations",
        "\u4E0A\u4E0B\u6587\u9577\u5EA6\u9650\u5236\u8207\u8A18\u61B6\u9650\u5236",
        "3-3-context-window.html"
      ],
      [
        "3.4",
        "Document Upload",
        "\u6587\u4EF6\u4E0A\u50B3",
        "What happens when you upload PDFs and images",
        "\u4E0A\u50B3 PDF \u8207\u5716\u7247\u6642\u6703\u767C\u751F\u4EC0\u9EBC",
        "3-4-document-upload.html"
      ],
      [
        "3.5",
        "Multiple Documents",
        "\u591A\u4EFD\u6587\u4EF6",
        "Multi-document synthesis challenges",
        "\u591A\u6587\u4EF6\u6574\u5408\u7684\u6311\u6230",
        "3-5-multi-document.html"
      ],
      [
        "3.6",
        "Image Upload",
        "\u5716\u7247\u4E0A\u50B3",
        "Test vision model limitations",
        "\u6E2C\u8A66\u8996\u89BA\u6A21\u578B\u7684\u9650\u5236",
        "3-6-image-demo.html"
      ],
      [
        "3.7",
        "The Hidden Costs",
        "\u96B1\u85CF\u6210\u672C",
        "Watch costs add up in real time",
        "\u5373\u6642\u89C0\u5BDF\u6210\u672C\u5982\u4F55\u7D2F\u7A4D",
        "3-7-hidden-costs.html"
      ],
      [
        "3.8",
        "Key Takeaways",
        "\u91CD\u9EDE\u6574\u7406",
        "Real-world limitations of chatbots",
        "\u804A\u5929\u6A5F\u5668\u4EBA\u5728\u771F\u5BE6\u4E16\u754C\u4E2D\u7684\u9650\u5236",
        "3-8-practice.html"
      ]
    ]
  },
  {
    title: { en: "4. Prompting Techniques", "zh-TW": "4. \u63D0\u793A\u5DE5\u7A0B\u6280\u5DE7" },
    children: [
      [
        "4.0",
        "Prompting Overview",
        "\u63D0\u793A\u5DE5\u7A0B\u7E3D\u89BD",
        "The reality of prompting and key techniques",
        "\u63D0\u793A\u5DE5\u7A0B\u7684\u5BE6\u969B\u6A23\u8C8C\u8207\u95DC\u9375\u6280\u5DE7",
        "4-overview.html"
      ],
      [
        "4.1",
        "Personas",
        "\u89D2\u8272\u8A2D\u5B9A",
        "Make LLMs roleplay with personalities",
        "\u8B93\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u4EE5\u4E0D\u540C\u4EBA\u683C\u626E\u6F14\u89D2\u8272",
        "4-1-personas.html"
      ],
      [
        "4.2",
        "Structured I/O",
        "\u7D50\u69CB\u5316\u8F38\u5165\uFF0F\u8F38\u51FA",
        "Delimiters and formats for parsing",
        "\u7528\u65BC\u89E3\u6790\u7684\u5206\u9694\u7B26\u8207\u683C\u5F0F",
        "4-2-structured-io.html"
      ],
      [
        "4.3",
        "Chain of Thought",
        "Chain of Thought\uFF08\u53EB\u6A21\u578B\u601D\u8003\uFF09",
        "Step-by-step reasoning",
        "\u8B93\u6A21\u578B\u9010\u6B65\u601D\u8003",
        "4-3-chain-of-thought.html"
      ],
      [
        "4.4",
        "Grounding",
        "\u63D0\u4F9B\u984D\u5916\u8CC7\u8A0A",
        "Prevent hallucination with references",
        "\u63D0\u4F9B\u53C3\u8003\u8CC7\u6599\uFF0C\u964D\u4F4E\u6A21\u578B\u4E82\u8B1B\u7684\u6A5F\u6703",
        "4-4-grounding.html"
      ],
      [
        "4.5",
        "NLP Tasks",
        "\u81EA\u7136\u8A9E\u8A00\u8655\u7406\u4EFB\u52D9",
        "Language processing with simple verbs",
        "\u7528\u7C21\u55AE\u52D5\u8A5E\u8655\u7406\u8A9E\u8A00\u4EFB\u52D9",
        "4-5-nlp-tasks.html"
      ],
      [
        "4.6",
        "Few-Shot Learning",
        "\u63D0\u4F9B\u7BC4\u4F8B\uFF08In-context learning\uFF09",
        "Teach patterns through examples",
        "\u900F\u904E\u7BC4\u4F8B\u8B93\u8A9E\u8A00\u6A21\u578B\u6293\u5230\u4EFB\u52D9\u6A21\u5F0F",
        "4-6-few-shot.html"
      ],
      [
        "4.7",
        "Prompt Chaining",
        "\u62C6\u89E3\u4EFB\u52D9",
        "Break complex tasks into steps",
        "\u628A\u8907\u96DC\u4EFB\u52D9\u5206\u591A\u6B65\u9A5F\u4F86\u89E3",
        "4-7-prompt-chaining.html"
      ],
      [
        "4.8",
        "Self-Correction",
        "\u81EA\u6211\u4FEE\u6B63",
        "Iterative improvement",
        "\u6AA2\u67E5\u5F8C\u518D\u6539\u9032\u8F38\u51FA",
        "4-8-self-correction.html"
      ],
      [
        "4.9",
        "Prompt Injection",
        "\u63D0\u793A\u6CE8\u5165",
        "Security awareness",
        "\u5B89\u5168\u6027\u8B70\u984C",
        "4-9-prompt-injection.html"
      ],
      [
        "4.10",
        "Key Takeaways",
        "\u91CD\u9EDE\u6574\u7406",
        "Best practices summary",
        "\u6700\u4F73\u5BE6\u52D9\u7E3D\u7D50",
        "4-10-takeaways.html"
      ]
    ]
  },
  {
    title: {
      en: "5. Agents: Giving LLMs Tools",
      "zh-TW": "5. AI \u4EE3\u7406\u4EBA\uFF1A\u8B93\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u4F7F\u7528\u5DE5\u5177"
    },
    children: [
      [
        "5.0",
        "Agents Overview",
        "AI \u4EE3\u7406\u4EBA\u7E3D\u89BD",
        "Introduction to tool use",
        "\u4F7F\u7528\u5DE5\u5177\u5165\u9580",
        "5-overview.html"
      ],
      [
        "5.1",
        "Tool Calls",
        "\u5DE5\u5177\u547C\u53EB",
        "How LLMs call tools and risks",
        "\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u5982\u4F55\u547C\u53EB\u5DE5\u5177\uFF0C\u4EE5\u53CA\u76F8\u95DC\u98A8\u96AA",
        "5-1-tool-invocation.html"
      ],
      [
        "5.2",
        "Calculator Tool",
        "\u8A08\u7B97\u6A5F\u5DE5\u5177",
        "Hand exact arithmetic to a tool",
        "\u628A\u7CBE\u78BA\u8A08\u7B97\u4EA4\u7D66\u5DE5\u5177",
        "5-2-calculator-tool.html"
      ],
      [
        "5.3",
        "Date/Time Tool",
        "\u65E5\u671F\uFF0F\u6642\u9593\u5DE5\u5177",
        "LLMs have no real-time awareness",
        "\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u6C92\u6709\u5373\u6642\u611F\u77E5\u80FD\u529B",
        "5-3-datetime-tool.html"
      ],
      [
        "5.4",
        "Web Search Tool",
        "\u7DB2\u8DEF\u641C\u5C0B\u5DE5\u5177",
        "Breaking the knowledge cutoff",
        "\u7A81\u7834\u77E5\u8B58\u622A\u6B62\u65E5\u671F",
        "5-4-websearch-tool.html"
      ],
      [
        "5.5",
        "Artifacts Tool",
        "\u7522\u7269\u5DE5\u5177\uFF08Artifacts\uFF09",
        "Co-create and modify files with the model",
        "\u548C\u6A21\u578B\u4E00\u8D77\u5EFA\u7ACB\u8207\u4FEE\u6539\u6A94\u6848",
        "5-5-artifacts-tool.html"
      ],
      [
        "5.6",
        "Model Context Protocol",
        "\u6A21\u578B\u4E0A\u4E0B\u6587\u5354\u5B9A\uFF08MCP\uFF09",
        "Tools declared by an external server",
        "\u770B\u5DE5\u5177\u5982\u4F55\u7531\u5916\u90E8 server \u5BA3\u544A\u8207\u6388\u6B0A",
        "5-6-mcp.html"
      ],
      [
        "5.7",
        "Key Takeaways",
        "\u91CD\u9EDE\u6574\u7406",
        "Tools, agents, and risks",
        "\u5DE5\u5177\u3001AI \u4EE3\u7406\u4EBA\u8207\u98A8\u96AA",
        "5-7-key-takeaways.html"
      ]
    ]
  },
  {
    title: { en: "6. Self-Hosting LLMs", "zh-TW": "6. \u81EA\u884C\u67B6\u8A2D\u5927\u578B\u8A9E\u8A00\u6A21\u578B" },
    children: [
      [
        "6.0",
        "Self-Hosting Overview",
        "\u81EA\u884C\u67B6\u8A2D\u7E3D\u89BD",
        "What self-hosting is and when it is worth it",
        "\u4EC0\u9EBC\u662F\u81EA\u884C\u67B6\u8A2D\uFF1F\u4EC0\u9EBC\u6642\u5019\u9069\u5408\uFF1F",
        "6-overview.html"
      ],
      [
        "6.1",
        "Models: What to Run and Where to Find Them",
        "\u6A21\u578B\uFF1A\u8981\u8DD1\u4EC0\u9EBC\u3001\u53BB\u54EA\u88E1\u627E",
        "Closed/open weights, model size, and sources",
        "\u5C01\u9589\u8207\u958B\u653E\u6B0A\u91CD\u3001\u6A21\u578B\u5927\u5C0F\u8207\u4F86\u6E90",
        "6-1-models.html"
      ],
      [
        "6.2",
        "Software Stack",
        "\u8EDF\u9AD4\u5806\u758A",
        "Models, inference engines, APIs, and UIs",
        "\u6A21\u578B\u3001\u63A8\u8AD6\u5F15\u64CE\u3001API \u8207 UI",
        "6-2-software-stack.html"
      ],
      [
        "6.3",
        "Hardware",
        "\u786C\u9AD4",
        "GPUs, consumer hardware, and cloud options",
        "GPU\u3001\u6D88\u8CBB\u7D1A\u786C\u9AD4\u8207\u96F2\u7AEF\u9078\u9805",
        "6-3-hardware.html"
      ],
      [
        "6.4",
        "Hands-On Demos",
        "\u5BE6\u4F5C\u793A\u7BC4",
        "Practical checks for local models and APIs",
        "\u672C\u6A5F\u6A21\u578B\u8207 API \u7684\u5BE6\u4F5C\u9A57\u6536",
        "6-4-demos.html"
      ]
    ]
  },
  {
    title: { en: "7. Where to Go from Here", "zh-TW": "7. \u63A5\u4E0B\u4F86\u53EF\u4EE5\u5F80\u54EA\u88E1\u8D70" },
    description: {
      en: "Resources, tools, and next steps for your AI journey.",
      "zh-TW": "AI \u65C5\u7A0B\u4E2D\u7684\u8CC7\u6E90\u3001\u5DE5\u5177\u8207\u4E0B\u4E00\u6B65\u3002"
    },
    href: "7-where-to-go.html"
  }
];
function text(value, language) {
  if (typeof value === "string") return i18n(value);
  return value[language] ?? value.en ?? "";
}
var WorkshopIndex = class WorkshopIndex2 extends i {
  createRenderRoot() {
    return this;
  }
  renderLeaf(section, language) {
    return b`
      <div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
        <a href=${section.href} class="block hover:bg-muted/50 rounded-md p-3 transition-colors">
          <h2 class="text-lg font-semibold">${text(section.title, language)}</h2>
          <p class="text-sm text-muted-foreground mt-1">${text(section.description, language)}</p>
        </a>
      </div>
    `;
  }
  renderGroup(section, language) {
    return b`
      <div class="p-4 border border-border rounded-md bg-card text-card-foreground shadow-xs">
        <h2 class="text-lg font-bold mb-3 px-3">${text(section.title, language)}</h2>
        <div class="space-y-2">
          ${section.children.map(
      ([number, enTitle, zhTitle, enDescription, zhDescription, href]) => b`
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
            `
    )}
        </div>
      </div>
    `;
  }
  render() {
    const language = getCurrentLanguage() === "en" ? "en" : "zh-TW";
    const copy = attribution[language];
    return b`
      <div class="min-h-screen p-4 lg:p-8">
        <div class="fixed top-4 right-4 z-10 flex items-center gap-2">
          <language-selector></language-selector>
          <theme-toggle includeSystem></theme-toggle>
        </div>
        <div class="max-w-6xl mx-auto">
          <h1 class="text-3xl lg:text-4xl text-foreground font-bold mb-4">
            ${language === "en" ? "Generative AI Workshop" : "\u751F\u6210\u5F0F\u4EBA\u5DE5\u667A\u6167\u5DE5\u4F5C\u574A"}
          </h1>
          <p class="text-sm text-muted-foreground mb-8 leading-relaxed">
            ${copy.created} <strong>Mario Zechner</strong> (<a
              href="https://mariozechner.at"
              target="_blank"
              class="underline hover:no-underline"
              >mariozechner.at</a
            >,
            <a href="mailto:contact@mariozechner.at" class="underline hover:no-underline"
              >contact@mariozechner.at</a
            >).<br />
            ${copy.maintained}
            <strong>Jheng-Hong (Matt) Yang / 楊政紘</strong> (<a
              href="https://justram.github.io"
              target="_blank"
              class="underline hover:no-underline"
              >justram.github.io</a
            >,
            <a href="mailto:jhyang@stencilzeit.com" class="underline hover:no-underline"
              >jhyang@stencilzeit.com</a
            >), Stencilzeit.
          </p>
          <div class="space-y-6">
            ${sections.map(
      (section) => section.children ? this.renderGroup(section, language) : this.renderLeaf(section, language)
    )}
          </div>
        </div>
      </div>
    `;
  }
};
WorkshopIndex = __decorate([t("workshop-index")], WorkshopIndex);
document.body.appendChild(document.createElement("workshop-index"));
//# sourceMappingURL=index.js.map
