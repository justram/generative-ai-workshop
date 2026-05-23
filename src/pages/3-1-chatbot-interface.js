import { __decorate as e, i18n as t, r as n, t$1 as r, x as i } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface as a, getModel as o } from "../workshop-runtime/AgentRuntime.js";
import { Textarea as s } from "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import { getAuthToken as c } from "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as l } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession as u } from "../workshop-runtime/AgentSession.js";
let d = class extends l {
  constructor() {
    (super(),
      (this.headerTitle = t(`How Chatbot Interfaces Work`)),
      (this.sectionId = `3.1`),
      (this.debugLog = []),
      (this.systemPromptText = t(`Memory: the user is named Mario and lives in Graz`)),
      (this.session = new u({
        authTokenProvider: c,
        debugListener: (e) => {
          this.debugLog = [...this.debugLog, e];
        },
      })),
      this.session.setModel(o(`openai-codex`, `gpt-5.4-mini`)),
      this.session.setSystemPrompt(this.systemPromptText),
      (this.agentInterface = new a()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !1),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.showThemeToggle = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  renderContentPanel() {
    return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return i`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${t(`編輯系統提示，並使用下方偵錯檢視檢查請求與回應。`)}
				</p>
				<div class="flex-shrink-0">
					${s({
            label: t(`System Prompt`),
            value: this.systemPromptText,
            rows: 5,
            resize: `vertical`,
            onInput: (e) => {
              let t = e.target.value;
              ((this.systemPromptText = t), this.session.setSystemPrompt(t));
            },
          })}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto">
						<debug-view .debugLog=${this.debugLog}></debug-view>
					</div>
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return i`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
			</div>
		`;
  }
};
(e([n()], d.prototype, `debugLog`, void 0),
  e([n()], d.prototype, `systemPromptText`, void 0),
  (d = e([r(`chatbot-demo`)], d)),
  (document.body.innerHTML = `<chatbot-demo></chatbot-demo>`));
export { d as ChatbotDemo };
