import { Button as e, __decorate as t, i18n as n, r, t$1 as i, x as a } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface as o, getModel as s } from "../workshop-runtime/AgentRuntime.js";
import {
  Badge as c,
  Card as l,
  CardContent as u,
  CardHeader as d,
  CardTitle as f,
} from "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as p } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession as m } from "../workshop-runtime/AgentSession.js";
import {
  COMPANY_INFO as h,
  COMPANY_NAME as g,
  PRODUCT_INFO as _,
  PRODUCT_NAME as v,
} from "../workshop-runtime/demoCompanyConfig.js";
let y = class extends p {
  constructor() {
    (super(),
      (this.headerTitle = n(`用參考資料讓回答有根據`)),
      (this.sectionId = `4.4`),
      (this.selectedExample = ``),
      (this.useGrounding = !1),
      (this.isRunning = !1),
      (this.examples = [
        {
          id: `company`,
          name:
            n(`Company information`) === `Company information` ? `Company information` : `公司資訊`,
          question:
            n(`Can you introduce BEST?`) === `Can you introduce BEST?`
              ? `Can you introduce BEST?`
              : `請介紹 BEST 這家公司。`,
          withoutGrounding: {
            systemPrompt: n(`You are an assistant helping answer company questions.`),
          },
          withGrounding: {
            systemPrompt: `You are an assistant answering questions about ${g}.

Important: answer only from the reference material below. If the reference does not contain the answer, say "${n(`The reference material does not contain this information.`)}"

Company information:
\`\`\`
${h}
\`\`\``,
            reference: n(`Company reference`),
          },
        },
        {
          id: `product`,
          name: n(`Product details`) === `Product details` ? `Product details` : `產品細節`,
          question:
            n(`What are the main features of the Modular Simulation Framework?`) ===
            `What are the main features of the Modular Simulation Framework?`
              ? `What are the main features of the Modular Simulation Framework?`
              : `Modular Simulation Framework 的主要功能有哪些？`,
          withoutGrounding: {
            systemPrompt: n(`You are an assistant helping answer software product questions.`),
          },
          withGrounding: {
            systemPrompt: `You are the technical assistant for ${v}.

Important: only use the information in the reference material below. Do not invent features or specifications.

Product information:
\`\`\`
${_}
\`\`\``,
            reference: n(`Product reference`),
          },
        },
      ]),
      (this.session = this.createSession()),
      (this.agentInterface = new o()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  createSession(model = this.session?.state?.model ?? s(`openai-codex`, `gpt-5.4-mini`)) {
    const e = new m();
    e.setModel(model);
    return e;
  }
  attachFreshSession(e) {
    const t = this.session?.state?.model ?? s(`openai-codex`, `gpt-5.4-mini`);
    this.session?.abort();
    this.session = this.createSession(t);
    this.session.setSystemPrompt(e);
    this.agentInterface.session = this.session;
    this.agentInterface.setupSessionSubscription?.();
    this.agentInterface?._streamingContainer?.setMessage?.(null, !0);
    this.agentInterface?.requestUpdate?.();
  }
  async runExample(e, t) {
    if (this.isRunning) this.session.abort();
    ((this.selectedExample = e.id), (this.useGrounding = t), (this.isRunning = !0));
    let n = t ? e.withGrounding.systemPrompt : e.withoutGrounding.systemPrompt;
    (this.attachFreshSession(n),
      this.requestUpdate(),
      await this.updateComplete,
      await new Promise((e) => requestAnimationFrame(e)));
    try {
      await this.runAgentPrompt(e.question);
    } finally {
      this.isRunning = !1;
    }
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4"><agent-interface-host .agentInterface=${this.agentInterface}></agent-interface-host></div>`;
  }
  renderLeftDemoPanel() {
    let t = this.examples.find((e) => e.id === this.selectedExample);
    return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`See how providing reference material improves accuracy and reduces hallucination.`)}
				</p>

				${this.examples.map((t) =>
          l(a`
						${d(
              f(a`${t.name}
								${this.selectedExample === t.id ? c(this.useGrounding ? `有參考資料` : `無參考資料`, `secondary`, `ml-2`) : ``}`),
            )}
						${u(a`
							<div class="text-xs text-muted-foreground mb-2">"${t.question}"</div>
							<div class="flex flex-col gap-2">
								${e({ variant: this.selectedExample === t.id && !this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !1), children: n(`不使用參考資料執行`), disabled: this.isRunning })}
								${e({ variant: this.selectedExample === t.id && this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !0), children: n(`使用參考資料執行`), disabled: this.isRunning })}
							</div>
						`)}
					`),
        )}
				${
          t && this.useGrounding
            ? l(a`
							${d(f(n(`Reference Material`) === `Reference Material` ? `Reference Material` : `參考資料`))}
							${u(a`<div class="text-xs bg-muted rounded p-2 max-h-48 overflow-auto">
									${t.id === `company` ? h : _}
								</div>`)}
						`)
            : ``
        }
			</div>
		`;
  }
  renderRightDemoPanel() {
    return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
		</div>`;
  }
};
(t([r()], y.prototype, `selectedExample`, void 0),
  t([r()], y.prototype, `useGrounding`, void 0),
  t([r()], y.prototype, `isRunning`, void 0),
  (y = t([i(`grounding-demo`)], y)),
  (document.body.innerHTML = `<grounding-demo></grounding-demo>`));
export { y as GroundingDemo };
