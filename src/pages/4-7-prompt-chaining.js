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
        id: `extract`,
        name: n(`步驟 1：抽出重點`),
        prompt: `請從以下公告抽出 4 個主要成就，並用條列式輸出：\n\n"${this.rawInput}"\n\n格式：\n• 成就 1\n• 成就 2\n• 成就 3\n• 成就 4`,
      },
      {
        id: `context`,
        name: n(`步驟 2：補上客戶價值`),
        prompt: `請針對剛剛列出的每個成就，補上一句話說明它對客戶或使用者有什麼價值。\n\n格式：\n• 成就：為什麼重要`,
      },
      {
        id: `draft`,
        name: n(`步驟 3：撰寫 LinkedIn 貼文`),
        prompt: n(
          `請把這些成就與客戶價值改寫成一篇吸引人的 LinkedIn 貼文。長度 3 到 4 句，語氣專業但有熱度，開頭要有吸引人的 hook。`,
        ),
      },
      {
        id: `engage`,
        name: n(`步驟 4：加入互動問題`),
        prompt: n(
          `請在 LinkedIn 貼文最後加上一個問題，鼓勵讀者留言互動。問題要邀請大家分享經驗或看法。`,
        ),
      },
    ];
  }
  constructor() {
    (super(),
      (this.headerTitle = n(`提示串接：把複雜任務拆成小步驟`)),
      (this.sectionId = `4.7`),
      (this.currentStep = 0),
      (this.isProcessing = !1),
      (this.completed = new Set()),
      (this.rawInput = n(
        n(
          `Our company just passed 1 million users, revenue grew 40% this quarter, we entered three new countries (Germany, France, Japan), and hired 50 new colleagues`,
        ),
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
  resetChain() {
    ((this.currentStep = 0), this.completed.clear(), this.session.clearMessages());
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(a`
					${u(d(n(`原始輸入`)))}
					${l(
            a`${f({
              label: n(`公司公告`),
              rows: 3,
              value: this.rawInput,
              onInput: (e) => {
                ((this.rawInput = e.target.value), this.resetChain());
              },
            })}`,
          )}
				`)}
				${c(a`
					${u(d(n(`轉換鏈`)))}
					${l(a`
						<div class="space-y-2">
							${this.steps.map((t, n) => e({ variant: this.completed.has(t.id) ? `secondary` : `outline`, size: `sm`, disabled: this.isProcessing || (n > 0 && !this.completed.has(this.steps[n - 1].id)), onClick: () => this.runStep(n), children: t.name, className: `w-full justify-start` }))}
						</div>
						${this.currentStep > 0 ? e({ variant: `outline`, size: `sm`, onClick: () => this.resetChain(), children: n(`Start Over`), className: `mt-3 w-full` }) : ``}
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
  t([r()], h.prototype, `rawInput`, void 0),
  (h = t([i(`prompt-chaining-demo`)], h)),
  (document.body.innerHTML = `<prompt-chaining-demo></prompt-chaining-demo>`));
export { h as PromptChainingDemo };
