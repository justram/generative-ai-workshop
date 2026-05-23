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
          name: `${g} 資訊`,
          question: `你可以介紹一下 ${g} 嗎？`,
          withoutGrounding: {
            systemPrompt: n(`你是一位協助回答公司問題的助理。`),
          },
          withGrounding: {
            systemPrompt: `你是一位回答 ${g} 相關問題的助理。

重要：只能根據下方提供的資訊回答。如果參考資料裡沒有答案，請說 "${n(`我的參考資料裡沒有這項資訊。`)}"

公司資訊：
\`\`\`
${h}
\`\`\``,
            reference: `${g} 公司資料`,
          },
        },
        {
          id: `product`,
          name: n(`產品細節`),
          question: `${v} 的主要功能有哪些？`,
          withoutGrounding: {
            systemPrompt: n(`你是一位協助回答軟體產品問題的助理。`),
          },
          withGrounding: {
            systemPrompt: `你是 ${v} 軟體的技術助理。

重要：只能使用下方參考文件中的資訊，不要編造功能或規格。

產品資訊：
\`\`\`
${_}
\`\`\``,
            reference: `${v} 文件`,
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
