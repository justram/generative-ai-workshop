import { Button as e, __decorate as t, i18n as n, r, t$1 as i, x as a } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock-SUyIenKs.js";
import { AgentInterface as o, getModel as s } from "../workshop-runtime/app-C9nW8ndw.js";
import {
  Card as c,
  CardContent as l,
  CardHeader as u,
  CardTitle as d,
  Textarea as f,
} from "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as p } from "../workshop-runtime/DemoBase-7724hyNv.js";
import "../workshop-runtime/proxy-client-DO8A5rUF.js";
import { AgentSession as m } from "../workshop-runtime/agent-session-CtmWvP9t.js";
let h = class extends p {
  get steps() {
    return [
      {
        id: `generate`,
        name: n(`步驟 1：產生主管摘要`),
        prompt: `請根據以下季度結果，寫一份兩段式主管摘要：\n\n"${this.reportData}"\n\n請聚焦關鍵指標與商業意涵。`,
      },
      {
        id: `critique`,
        name: n(`步驟 2：批判摘要`),
        prompt: `請檢查你剛剛寫的主管摘要，評估：\n1. 關鍵指標是否清楚\n2. 商業洞察是否足夠\n3. 語氣是否有行動導向\n4. 是否適合主管閱讀\n\n請列出具體問題與改善建議。`,
      },
      {
        id: `improve`,
        name: n(`步驟 3：根據批判改寫`),
        prompt: `請根據你的批判，重寫主管摘要，修正所有指出的問題，讓它更適合高階主管閱讀。`,
      },
    ];
  }
  constructor() {
    (super(),
      (this.headerTitle = n(`自我修正 - 反覆改進`)),
      (this.sectionId = `4.8`),
      (this.currentStep = 0),
      (this.isProcessing = !1),
      (this.completed = new Set()),
      (this.reportData = n(
        `2024 Q3 results: revenue grew 15%, new customers increased 22%, but expansion costs rose 18%. We entered three new markets. Customer satisfaction reached a record high of 94%.`,
      )),
      (this.session = new m()),
      this.session.setModel(s(`openai-codex`, `gpt-5.4-mini`)),
      (this.agentInterface = new o()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`),
      this.session.setSystemPrompt(
        n(`You are a helpful assistant. Follow the instructions exactly and be concise.`),
      ),
      this.session.clearMessages());
  }
  async runStep(e) {
    this.isProcessing ||
      e < 0 ||
      e >= this.steps.length ||
      (e > 0 && !this.completed.has(this.steps[e - 1].id)) ||
      ((this.isProcessing = !0),
      await this.agentInterface.sendMessage(this.steps[e].prompt),
      this.completed.add(this.steps[e].id),
      (this.currentStep = e + 1),
      (this.isProcessing = !1));
  }
  resetFlow() {
    ((this.currentStep = 0), this.completed.clear(), this.session.clearMessages());
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(a`
					${u(d(n(`季度報告資料`)))}
					${l(
            a`${f({
              label: n(`可編輯資料`),
              rows: 3,
              value: this.reportData,
              onInput: (e) => {
                ((this.reportData = e.target.value), this.resetFlow());
              },
            })}`,
          )}
				`)}
				${c(a`
					${u(d(n(`自我修正流程`)))}
					${l(a`
						<div class="space-y-2">
							${this.steps.map((t, n) => e({ variant: this.completed.has(t.id) ? `secondary` : `outline`, size: `sm`, disabled: this.isProcessing || (n > 0 && !this.completed.has(this.steps[n - 1].id)), onClick: () => this.runStep(n), children: t.name, className: `w-full justify-start` }))}
						</div>
						${this.currentStep > 0 ? e({ variant: `outline`, size: `sm`, onClick: () => this.resetFlow(), children: n(`Start Over`), className: `mt-3 w-full` }) : ``}
					`)}
				`)}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
		</div>`;
  }
};
(t([r()], h.prototype, `currentStep`, void 0),
  t([r()], h.prototype, `isProcessing`, void 0),
  t([r()], h.prototype, `completed`, void 0),
  t([r()], h.prototype, `reportData`, void 0),
  (h = t([i(`self-correction-demo`)], h)),
  (document.body.innerHTML = `<self-correction-demo></self-correction-demo>`));
export { h as SelfCorrectionDemo };
