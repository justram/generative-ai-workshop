import {
  Button as e,
  __decorate as t,
  i18n as n,
  iconBrainLine as r,
  iconImageLine as i,
  iconPlayLine as a,
  t$1 as o,
  x as s,
} from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface as c, getModel as l } from "../workshop-runtime/AgentRuntime.js";
import {
  Badge as u,
  Card as d,
  CardAction as f,
  CardContent as p,
  CardHeader as m,
  CardTitle as h,
} from "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as g } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession as _ } from "../workshop-runtime/AgentSession.js";
let v = class extends g {
  constructor() {
    (super(),
      (this.headerTitle = n(`Providers and Models`)),
      (document.title = this.headerTitle),
      (this.sectionId = `3.2`),
      (this.question = n(
        `Without web search: what is the exact current time in Taipei, down to the second? If you cannot know, say clearly that you cannot know; do not guess.`,
      )),
      (this.session = new _()),
      this.session.setSystemPrompt(
        n(
          `You are a helpful assistant. When a question requires real-time information, external data, or local state, explain the limitation honestly instead of fabricating.`,
        ),
      ),
      this.session.setModel(l(`openai-codex`, `gpt-5.4-mini`)),
      (this.agentInterface = new c()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !0),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !0),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`),
      this.agentInterface.setInput(this.question),
      (this.unsubscribe = this.session.subscribe(() => {})));
  }
  renderContentPanel() {
    return s`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    let t = [
        {
          provider: `chatgpt`,
          id: `gpt-5.5`,
          name: n(`GPT-5.5`),
          model: l(`openai-codex`, `gpt-5.5`),
        },
        {
          provider: `chatgpt`,
          id: `gpt-5.4-mini`,
          name: n(`GPT-5.4 Mini`),
          model: l(`openai-codex`, `gpt-5.4-mini`),
        },
        {
          provider: `chatgpt`,
          id: `gpt-5.4`,
          name: n(`GPT-5.4`),
          model: l(`openai-codex`, `gpt-5.4`),
        },
        {
          provider: `chatgpt`,
          id: `gpt-5.3-codex`,
          name: n(`GPT-5.3 Codex`),
          model: l(`openai-codex`, `gpt-5.3-codex`),
        },
      ],
      o = async (e) => {
        (this.session.setModel(e),
          this.session.clearMessages(),
          await this.agentInterface.sendMessage(this.question));
      };
    return s`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`Pick a model and press play to run the sample question; switch models to compare behavior.`)}
				</p>
				${t.map((t) =>
          d(s`
						${m(s`
							${h(s`${u(t.provider.toUpperCase(), `secondary`)} ${t.name}`)}
							${f(
                e({
                  variant: `secondary`,
                  size: `icon`,
                  title: `${n(`Run with`)} ${t.name}`,
                  onClick: async () => {
                    try {
                      await o(t.model);
                    } catch (e) {
                      (console.error(`Failed to set model`, e),
                        alert(n(`Failed to set model {id}: {error}`)(t.id, String(e))));
                    }
                  },
                  children: a(`md`),
                  className: `ui-card-action`,
                }),
              )}
						`)}
						${p(s`
							<div class="space-y-2">
								<!-- Icons for capabilities -->
								<div class="flex items-center gap-3 mb-3">
									<span
										class="${t.model.reasoning ? `text-foreground` : `text-muted-foreground opacity-30`}"
										title="${t.model.reasoning ? n(`Supports reasoning/thinking`) : n(`No reasoning support`)}"
										>${r(`sm`)}</span
									>
									<span
										class="${t.model.input.includes(`image`) ? `text-foreground` : `text-muted-foreground opacity-30`}"
										title="${t.model.input.includes(`image`) ? n(`Supports image input`) : n(`Text only`)}"
										>${i(`sm`)}</span
									>
								</div>

								<!-- Model details -->
								<div class="space-y-1 text-sm">
									<div class="flex justify-between">
										<span class="text-muted-foreground">${n(`Context size:`)}</span>
										<span class="font-mono text-foreground"
											>${this.formatTokensComma(t.model.contextWindow)}${n(` tokens`)}</span
										>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${n(`Max output:`)}</span>
										<span class="font-mono text-foreground">${this.formatTokensComma(t.model.maxTokens)}${n(` tokens`)}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${n(`Input cost:`)}</span>
										<span class="font-mono text-foreground">$${t.model.cost.input.toFixed(2)}${n(` / 1M tokens`)}</span>
									</div>
									<div class="flex justify-between">
										<span class="text-muted-foreground">${n(`Output cost:`)}</span>
										<span class="font-mono text-foreground">$${t.model.cost.output.toFixed(2)}${n(` / 1M tokens`)}</span>
									</div>
								</div>
							</div>
						`)}
					`),
        )}
			</div>
		`;
  }
  formatTokensComma(e) {
    return e.toLocaleString(`en-US`);
  }
  renderRightDemoPanel() {
    return s`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
			</div>
		`;
  }
  disconnectedCallback() {
    (super.disconnectedCallback(), this.unsubscribe?.());
  }
};
((v = t([o(`providers-models-demo`)], v)),
  (document.body.innerHTML = `<providers-models-demo></providers-models-demo>`));
export { v as ProvidersModelsDemo };
