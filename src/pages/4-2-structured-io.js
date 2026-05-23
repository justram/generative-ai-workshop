import {
  Button as e,
  __decorate as t,
  i18n as n,
  iconPlayLine as r,
  r as i,
  t$1 as a,
  x as o,
} from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock-SUyIenKs.js";
import { AgentInterface as s, getModel as c } from "../workshop-runtime/app-C9nW8ndw.js";
import {
  Badge as l,
  Card as u,
  CardContent as d,
  CardHeader as f,
  CardTitle as p,
} from "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as m } from "../workshop-runtime/DemoBase-7724hyNv.js";
import "../workshop-runtime/proxy-client-DO8A5rUF.js";
import { AgentSession as h } from "../workshop-runtime/agent-session-CtmWvP9t.js";
let g = class extends m {
  constructor() {
    (super(),
      (this.headerTitle = n(`結構化輸入與輸出`)),
      (this.sectionId = `4.2`),
      (this.selectedFormat = ``),
      (this.feedbackExamples = [
        {
          id: `shipping`,
          text: n(
            `商品晚到而且有破損，包裝很糟。我打給客服等了 45 分鐘才接通，不過 Sarah 很有幫助，最後解決了我的問題。價格倒是還不錯。`,
          ),
        },
        {
          id: `quality`,
          text: n(
            `很棒的產品！功能跟廣告說的一樣，設定超簡單，不到 5 分鐘就完成。做工很有質感。唯一抱怨是價格偏高，但以品質來說我覺得值得。`,
          ),
        },
        {
          id: `service`,
          text: n(
            `星期一下單，星期三如期到貨。產品可以用，但說明書很難懂，我還得看 YouTube 才弄清楚。線上客服回覆很快也很有幫助。如果文件寫好一點，我會給 5 顆星。`,
          ),
        },
      ]),
      (this.approaches = [
        {
          id: `unstructured`,
          name: n(`A. 未結構化（不理想）`),
          description: n(`提示太模糊，輸出難預測`),
          systemPrompt: n(`你是一位協助分析客戶回饋的助理。`),
          prompt: `${n(`請分析以下客戶評論：`)}\n\n${this.feedbackExamples.map((e) => e.text).join(`

`)}`,
        },
        {
          id: `semi-structured`,
          name: n(`B. 半結構化（較好）`),
          description: n(`有一點結構，但仍以散文回答為主`),
          systemPrompt: n(`你是一位協助分析客戶回饋的助理。 請用清楚的小節整理分析。`),
          prompt: `請分析以下客戶回饋。針對每則評論，整理主要情緒與重點。\n\n評論 1: ${this.feedbackExamples[0].text}\n\n評論 2: ${this.feedbackExamples[1].text}\n\n評論 3: ${this.feedbackExamples[2].text}`,
        },
        {
          id: `fully-structured`,
          name: n(`C. 完整結構化（最好）`),
          description: n(`明確分隔符與固定輸出格式`),
          systemPrompt: n(`你是一位客戶回饋分析師。請依照指定格式，從評論中抽出具體資料點。`),
          prompt: `請分析以下客戶回饋。每則評論都用三個引號分隔。

評論 1:
"""
${this.feedbackExamples[0].text}
"""

評論 2:
"""
${this.feedbackExamples[1].text}
"""

評論 3:
"""
${this.feedbackExamples[2].text}
"""

請針對每則評論，完全依照以下格式輸出：

評論 1:
- 情緒：正面／負面／混合
- 問題：列出每個問題，若沒有請寫「無」
- 優點：列出正面重點，若沒有請寫「無」
- 提到的員工：姓名，若沒有請寫「無」
- 優先處理：最重要的改善項目，若沒有請寫「無需處理」`,
        },
      ]),
      (this.session = new h()),
      this.session.setModel(c(`openai-codex`, `gpt-5.4-mini`)),
      (this.agentInterface = new s()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  async runApproach(e) {
    ((this.selectedFormat = e.id),
      this.session.setSystemPrompt(e.systemPrompt),
      this.session.clearMessages(),
      await this.agentInterface.sendMessage(e.prompt));
  }
  renderContentPanel() {
    return o`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return o`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`比較不同提示寫法，如何處理同一組客戶回饋。`)}
				</p>

				${u(o`
					${f(p(n(`客戶回饋範例`)))}
					${d(o`
						<div class="space-y-3">
							${this.feedbackExamples.map(
                (e, t) => o`
									<div class="text-xs">
										<div class="font-semibold text-foreground mb-1">${n(`評論`)} ${t + 1}:</div>
										<div class="text-muted-foreground pl-2">${e.text}</div>
									</div>
								`,
              )}
						</div>
					`)}
				`)}
				${this.approaches.map((t) =>
          u(o`
						${f(
              p(o`${t.name}
								${this.selectedFormat === t.id ? l(n(`已選取`), `secondary`, `ml-2`) : ``}`),
            )}
						${d(o`
							<div class="text-xs text-muted-foreground mb-3">${t.description}</div>
							${e({
                variant: this.selectedFormat === t.id ? `default` : `secondary`,
                size: `sm`,
                onClick: async () => {
                  try {
                    await this.runApproach(t);
                  } catch (e) {
                    console.error(`Failed to run approach`, e);
                  }
                },
                children: o`${r(`sm`)}<span class="ml-1">${n(`執行這個方法`)}</span>`,
              })}
						`)}
					`),
        )}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return o`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
			</div>
		`;
  }
};
(t([i()], g.prototype, `selectedFormat`, void 0),
  (g = t([a(`structured-io-demo`)], g)),
  (document.body.innerHTML = `<structured-io-demo></structured-io-demo>`));
export { g as StructuredIODemo };
