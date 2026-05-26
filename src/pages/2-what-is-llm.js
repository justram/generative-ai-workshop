import { html, i18n, getCurrentLanguage } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import "../workshop-runtime/AgentRuntime.js";
import "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../workshop-runtime/LlmConceptAnimation.js";
import { DemoBase } from "../workshop-runtime/DemoBase.js";
import { getLlmConceptScenes } from "../workshop-runtime/LlmConceptAnimation.js";

const PAGE_COPY = {
  en: {
    title: "What is a Large Language Model?",
    section: "2. What is a large language model?",
    learningTarget: "Learning target",
    learningTargetText:
      "Build a useful mental model for LLMs: they turn text into tokens, use context to predict a distribution for the next token, then repeat.",
    currentScene: "Current scene",
    whatToWatch: "What to watch",
    whyItMatters: "Why it matters",
    whyItMattersText:
      "This is the bridge for the rest of the workshop. Hallucinations, prompt sensitivity, context windows, document upload, tools, and cost all sit on top of this next-token loop.",
    controlsHint:
      "Use play, step, sample sentence, and temperature to see the concept move. The right panel follows the active scene.",
    scenes: "Scenes",
  },
  "zh-TW": {
    title: "什麼是大型語言模型？",
    section: "2. 什麼是大型語言模型？",
    learningTarget: "本頁學習目標",
    learningTargetText:
      "建立一個好用的心智模型：大型語言模型先把文字變成 token，利用上下文預測下一個 token 的機率分布，再一直重複。",
    currentScene: "目前場景",
    whatToWatch: "觀察重點",
    whyItMatters: "為什麼重要",
    whyItMattersText:
      "這是後面所有章節的地基。幻覺、提示敏感度、上下文視窗、文件上傳、工具與成本，都疊在這個預測下一個 token 的迴圈上。",
    controlsHint: "你可以播放、逐步切換、換例句、調溫度。右側說明會跟著目前場景走。",
    scenes: "場景列表",
  },
};

function pageCopy() {
  return PAGE_COPY[getCurrentLanguage()] ?? PAGE_COPY["zh-TW"];
}

class WhatIsLLMDemo extends DemoBase {
  constructor(...args) {
    super(...args);
    this.headerTitle = i18n("What is a Large Language Model?");
    this.sectionId = "2";
    this.sectionMode = "subtree";
    this.activeScene = 0;
  }

  renderContentPanel() {
    return html`
      <llm-concept-animation
        .sceneIndex=${this.activeScene}
        @scene-change=${(event) => {
          this.activeScene = event.detail.sceneIndex;
          this.requestUpdate();
        }}
      ></llm-concept-animation>
    `;
  }

  renderRightDemoPanel() {
    const copy = pageCopy();
    const scenes = getLlmConceptScenes();
    const activeScene = scenes[this.activeScene] ?? scenes[0];

    return html`
      <div class="flex-1 overflow-y-auto min-h-0">
        <div class="p-6 space-y-4">
          <section class="rounded-xl border border-border bg-card p-4">
            <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
              ${copy.section}
            </div>
            <h2 class="mt-2 font-serif text-2xl font-bold leading-tight text-foreground">
              ${copy.learningTarget}
            </h2>
            <p class="mt-3 text-sm leading-6 text-muted-foreground">${copy.learningTargetText}</p>
          </section>

          <section class="rounded-xl border border-border bg-card p-4">
            <div class="flex items-start justify-between gap-3">
              <div>
                <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                  ${copy.currentScene}
                </div>
                <h3 class="mt-2 text-lg font-bold leading-tight text-foreground">
                  ${activeScene.eyebrow} · ${activeScene.title}
                </h3>
              </div>
              <span
                class="rounded-full border border-border bg-muted px-2 py-1 text-xs font-semibold text-muted-foreground"
              >
                ${this.activeScene + 1}/${scenes.length}
              </span>
            </div>
            <p class="mt-3 text-sm leading-6 text-muted-foreground">${activeScene.summary}</p>
            <div class="mt-4 rounded-lg border border-border bg-background/60 p-3">
              <div class="text-xs font-semibold uppercase tracking-wide text-muted-foreground">
                ${copy.whatToWatch}
              </div>
              <p class="mt-2 text-sm leading-6 text-foreground">${activeScene.watch}</p>
            </div>
          </section>

          <section class="rounded-xl border border-border bg-card p-4">
            <div class="text-sm font-bold text-foreground">${copy.scenes}</div>
            <div class="mt-3 grid gap-2">
              ${scenes.map(
                (scene, index) => html`
                  <button
                    type="button"
                    style="display: grid; grid-template-columns: 1.5rem minmax(0, 1fr); align-items: start; gap: 0.75rem;"
                    class=${`w-full rounded-lg border px-3 py-3 text-left transition-colors ${
                      index === this.activeScene
                        ? "border-primary bg-muted text-foreground"
                        : "border-border bg-background/60 text-muted-foreground"
                    }`}
                    @click=${() => {
                      this.activeScene = index;
                      this.requestUpdate();
                    }}
                  >
                    <span
                      style="display: flex; width: 1.5rem; height: 1.5rem; align-items: center; justify-content: center; border-radius: 999px;"
                      class=${`mt-0.5 shrink-0 text-xs font-bold ${
                        index === this.activeScene
                          ? "bg-background text-foreground"
                          : "bg-muted text-muted-foreground"
                      }`}
                    >
                      ${index + 1}
                    </span>
                    <span style="min-width: 0;">
                      <span class="block text-sm font-semibold leading-5">${scene.title}</span>
                      <span class="mt-1 block text-xs leading-5 text-muted-foreground">
                        ${scene.summary}
                      </span>
                    </span>
                  </button>
                `,
              )}
            </div>
          </section>

          <section class="rounded-xl border border-border bg-card p-4">
            <div class="text-sm font-bold text-foreground">${copy.whyItMatters}</div>
            <p class="mt-2 text-sm leading-6 text-muted-foreground">${copy.whyItMattersText}</p>
            <p class="mt-3 text-xs leading-5 text-muted-foreground">${copy.controlsHint}</p>
          </section>
        </div>
      </div>
    `;
  }
}

customElements.define("what-is-llm-demo", WhatIsLLMDemo);
document.body.innerHTML = "<what-is-llm-demo></what-is-llm-demo>";

export { WhatIsLLMDemo };
