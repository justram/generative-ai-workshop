import { Button as e, __decorate as t, i18n as n, r, t$1 as i, x as a } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock-SUyIenKs.js";
import { AgentInterface as o, getModel as s } from "../workshop-runtime/app-C9nW8ndw.js";
import {
  Badge as c,
  Card as l,
  CardContent as u,
  CardHeader as d,
  CardTitle as f,
} from "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as p } from "../workshop-runtime/DemoBase-7724hyNv.js";
import "../workshop-runtime/proxy-client-DO8A5rUF.js";
import { AgentSession as m } from "../workshop-runtime/agent-session-CtmWvP9t.js";
import {
  COMPANY_INFO as h,
  COMPANY_NAME as g,
  PRODUCT_INFO as _,
  PRODUCT_NAME as v,
} from "../workshop-runtime/demo-company-config-DwX2XOme.js";
let y = class extends p {
  constructor() {
    (super(),
      (this.headerTitle = n(`用參考資料讓回答有根據`)),
      (this.sectionId = `4.4`),
      (this.selectedExample = ``),
      (this.useGrounding = !1),
      (this.examples = [
        {
          id: `company`,
          name: n(`Company information`),
          question: n(`Can you introduce BEST?`),
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
          name: n(`Product details`),
          question: n(`What are the main features of the Modular Simulation Framework?`),
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
      (this.session = new m()),
      this.session.setModel(s(`openai-codex`, `gpt-5.4-mini`)),
      (this.agentInterface = new o()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  async runExample(e, t) {
    ((this.selectedExample = e.id), (this.useGrounding = t));
    let n = t ? e.withGrounding.systemPrompt : e.withoutGrounding.systemPrompt;
    (this.session.setSystemPrompt(n),
      this.session.clearMessages(),
      await this.agentInterface.sendMessage(e.question));
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
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
								${e({ variant: this.selectedExample === t.id && !this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !1), children: n(`不使用參考資料執行`) })}
								${e({ variant: this.selectedExample === t.id && this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !0), children: n(`使用參考資料執行`) })}
							</div>
						`)}
					`),
        )}
				${
          t && this.useGrounding
            ? l(a`
							${d(f(n(`Reference Material`)))}
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
  (y = t([i(`grounding-demo`)], y)),
  (document.body.innerHTML = `<grounding-demo></grounding-demo>`));
export { y as GroundingDemo };
