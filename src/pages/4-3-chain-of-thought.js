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
let h = class extends p {
  constructor() {
    (super(),
      (this.headerTitle = n(`深度思考與逐步作答`)),
      (this.sectionId = `4.3`),
      (this.selectedExample = ``),
      (this.useCoT = !1),
      (this.examples = [
        {
          id: `alice`,
          name: n(`愛麗絲問題（AIW）`),
          withoutCoT: {
            systemPrompt: n(`你是一位樂於助人的助理，回答要精簡。`),
            prompt: n(
              `家裡有 5 個小孩：A、B、C 是男生，D、E 是女生。D 說：「我有 3 個兄弟和 1 個姊妹。」A 是 D 的哥哥。A 有幾個姊妹？請只回答數字。`,
            ),
          },
          withCoT: {
            systemPrompt: n(`你是一位樂於助人的助理，請一步一步思考問題。`),
            prompt: n(
              `家裡有 5 個小孩：A、B、C 是男生，D、E 是女生。D 說：「我有 3 個兄弟和 1 個姊妹。」A 是 D 的哥哥。A 有幾個姊妹？請一步一步列出家庭成員，再給出答案。`,
            ),
          },
        },
        {
          id: `math`,
          name: n(`數學題`),
          withoutCoT: {
            systemPrompt: n(`你是一位樂於助人的助理，回答要精簡。`),
            prompt: n(`不要使用計算機：47 × 83 + 47 × 17 = 多少？請只回答數字。`),
          },
          withCoT: {
            systemPrompt: n(`你是一位樂於助人的助理，請一步一步寫出推理過程。`),
            prompt: n(`不要使用計算機：47 × 83 + 47 × 17 = 多少？請先觀察可否合併，再一步一步算。`),
          },
        },
        {
          id: `word-problem`,
          name: n(`文字應用題`),
          withoutCoT: {
            systemPrompt: n(`你是一位協助解題的助理。`),
            prompt: n(
              `一個水槽有兩個水龍頭。A 單獨開 6 小時注滿，B 單獨開 3 小時注滿。兩個一起開 1 小時後關掉 B，只剩 A。總共還要多久注滿？`,
            ),
          },
          withCoT: {
            systemPrompt: n(`你是一位協助系統化拆解問題的助理。`),
            prompt:
              n(`一個水槽有兩個水龍頭。A 單獨開 6 小時注滿，B 單獨開 3 小時注滿。兩個一起開 1 小時後關掉 B，只剩 A。總共還要多久注滿？

請一步一步解：
1. 算出 A 與 B 每小時注滿比例
2. 算一起開 1 小時完成多少
3. 算剩下多少
4. 算 A 還需要多久
5. 給出總時間`),
          },
        },
        {
          id: `logic`,
          name: n(`邏輯題`),
          withoutCoT: {
            systemPrompt: n(`你是一位協助解謎的助理。`),
            prompt: n(
              `四個人排隊。A 在 B 前面，C 在 A 後面但在 D 前面，B 不在最後。誰一定排第一？`,
            ),
          },
          withCoT: {
            systemPrompt: n(`你是一位協助邏輯推理的助理。`),
            prompt: n(`四個人排隊。A 在 B 前面，C 在 A 後面但在 D 前面，B 不在最後。誰一定排第一？

請一步一步推理：
1. 列出所有限制
2. 嘗試可能的排序
3. 判斷是否有唯一答案；如果沒有，請明確說不唯一`),
          },
        },
      ]),
      (this.session = new m()),
      this.session.setModel(s(`openai-codex`, `gpt-5.4-mini`)),
      (this.agentInterface = new o()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !0),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  async runExample(e, t) {
    ((this.selectedExample = e.id), (this.useCoT = t));
    let n = t ? e.withCoT : e.withoutCoT;
    (this.session.setSystemPrompt(n.systemPrompt),
      this.session.clearMessages(),
      await this.agentInterface.sendMessage(n.prompt));
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`比較有沒有要求逐步推理時，模型表現會如何改變。`)}
				</p>

				${this.examples.map((t) =>
          l(a`
						${d(
              f(a`${t.name}
								${this.selectedExample === t.id ? c(this.useCoT ? n(`With CoT`) : n(`No CoT`), `secondary`, `ml-2`) : ``}`),
            )}
						${u(a`
							<div class="flex flex-col gap-2">
								<div class="text-sm text-muted-foreground p-2 bg-muted/50 rounded">${
                  t.withoutCoT.prompt.split(`
`)[0]
                }</div>
								${e({ variant: this.selectedExample === t.id && !this.useCoT ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !1), children: n(`Run without CoT`) })}
								${e({ variant: this.selectedExample === t.id && this.useCoT ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, !0), children: n(`Run with CoT`) })}
							</div>
						`)}
					`),
        )}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
		</div>`;
  }
};
(t([r()], h.prototype, `selectedExample`, void 0),
  t([r()], h.prototype, `useCoT`, void 0),
  (h = t([i(`chain-of-thought-demo`)], h)),
  (document.body.innerHTML = `<chain-of-thought-demo></chain-of-thought-demo>`));
export { h as ChainOfThoughtDemo };
