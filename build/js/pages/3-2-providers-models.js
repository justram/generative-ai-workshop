import {
  o
} from "../chunks/chunk-ASOE6ZTL.js";
import {
  A,
  D,
  E,
  O,
  Pi,
  T,
  bR,
  m,
  u
} from "../chunks/chunk-737EQ6X6.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  iconBrainLine,
  iconImageLine,
  iconPlayLine,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/3-2-providers-models.js
var v = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`Providers and Models`), document.title = this.headerTitle, this.sectionId = `3.2`, this.question = i18n(
      `Without web search: what is the exact current time in Taipei, down to the second? If you cannot know, say clearly that you cannot know; do not guess.`
    ), this.session = new o(), this.session.setSystemPrompt(
      i18n(
        `You are a helpful assistant. When a question requires real-time information, external data, or local state, explain the limitation honestly instead of fabricating.`
      )
    ), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = true, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = true, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`, this.agentInterface.setInput(this.question), this.unsubscribe = this.session.subscribe(() => {
    });
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    let t2 = [
      {
        provider: `chatgpt`,
        id: `gpt-5.5`,
        name: i18n(`GPT-5.5`),
        model: Pi(`openai-codex`, `gpt-5.5`)
      },
      {
        provider: `chatgpt`,
        id: `gpt-5.4-mini`,
        name: i18n(`GPT-5.4 Mini`),
        model: Pi(`openai-codex`, `gpt-5.4-mini`)
      },
      {
        provider: `chatgpt`,
        id: `gpt-5.4`,
        name: i18n(`GPT-5.4`),
        model: Pi(`openai-codex`, `gpt-5.4`)
      },
      {
        provider: `chatgpt`,
        id: `gpt-5.3-codex`,
        name: i18n(`GPT-5.3 Codex`),
        model: Pi(`openai-codex`, `gpt-5.3-codex`)
      }
    ], o2 = async (e) => {
      this.session.setModel(e), this.session.clearMessages(), await this.agentInterface.sendMessage(this.question);
    };
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`Pick a model and press play to run the sample question; switch models to compare behavior.`)}
				</p>
				${t2.map(
      (t3) => T(b`
						${E(b`
							${O(b`${u(t3.provider.toUpperCase(), `secondary`)} ${t3.name}`)}
							${D(
        Button({
          variant: `secondary`,
          size: `icon`,
          title: `${i18n(`Run with`)} ${t3.name}`,
          onClick: async () => {
            try {
              await o2(t3.model);
            } catch (e) {
              console.error(`Failed to set model`, e), alert(i18n(`Failed to set model {id}: {error}`)(t3.id, String(e)));
            }
          },
          children: iconPlayLine(`md`),
          className: `ui-card-action`
        })
      )}
						`)}
						${A(b`
							<div class="space-y-2">
								<!-- Icons for capabilities -->
								<div class="flex items-center gap-3 mb-3">
									<span
										class="${t3.model.reasoning ? `text-foreground` : `text-muted-foreground opacity-30`}"
										title="${t3.model.reasoning ? i18n(`Supports reasoning/thinking`) : i18n(`No reasoning support`)}"
										>${iconBrainLine(`sm`)}</span
									>
									<span
										class="${t3.model.input.includes(`image`) ? `text-foreground` : `text-muted-foreground opacity-30`}"
										title="${t3.model.input.includes(`image`) ? i18n(`Supports image input`) : i18n(`Text only`)}"
										>${iconImageLine(`sm`)}</span
									>
								</div>

								<!-- Model details -->
								<div class="space-y-1 text-sm">
									<div class="flex justify-between">
										<span class="text-muted-foreground">${i18n(`Context size:`)}</span>
										<span class="font-mono text-foreground"
											>${this.formatTokensComma(t3.model.contextWindow)}${i18n(` tokens`)}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${i18n(`Max output:`)}</span>
										<span class="font-mono text-foreground">${this.formatTokensComma(t3.model.maxTokens)}${i18n(` tokens`)}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${i18n(`Input cost:`)}</span>
										<span class="font-mono text-foreground">$${t3.model.cost.input.toFixed(2)}${i18n(` / 1M tokens`)}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${i18n(`Output cost:`)}</span>
										<span class="font-mono text-foreground">$${t3.model.cost.output.toFixed(2)}${i18n(` / 1M tokens`)}</span>
									</div>
								</div>
							</div>
						`)}
					`)
    )}
			</div>
		`;
  }
  formatTokensComma(e) {
    return e.toLocaleString(`en-US`);
  }
  renderRightDemoPanel() {
    return b`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
			</div>
		`;
  }
  disconnectedCallback() {
    super.disconnectedCallback(), this.unsubscribe?.();
  }
};
v = __decorate([t(`providers-models-demo`)], v), document.body.innerHTML = `<providers-models-demo></providers-models-demo>`;
export {
  v as ProvidersModelsDemo
};
//# sourceMappingURL=3-2-providers-models.js.map
