import {
  o
} from "../chunks/chunk-6TTNE7IQ.js";
import {
  Pi,
  U,
  bR,
  m,
  v
} from "../chunks/chunk-QLBDILTC.js";
import {
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/3-1-chatbot-interface.js
var d = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`How Chatbot Interfaces Work`), this.sectionId = `3.1`, this.debugLog = [], this.systemPromptText = i18n(`Memory: the user is named Mario and lives in Graz`), this.session = new o({
      authTokenProvider: v,
      debugListener: (e) => {
        this.debugLog = [...this.debugLog, e];
      }
    }), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.session.setSystemPrompt(this.systemPromptText), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = false, this.agentInterface.enableThinking = false, this.agentInterface.showThemeToggle = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${i18n(`\u7DE8\u8F2F\u7CFB\u7D71\u63D0\u793A\uFF0C\u4E26\u4F7F\u7528\u4E0B\u65B9\u5075\u932F\u6AA2\u8996\u6AA2\u67E5\u8ACB\u6C42\u8207\u56DE\u61C9\u3002`)}
				</p>
				<div class="flex-shrink-0">
					${U({
      label: i18n(`System Prompt`),
      value: this.systemPromptText,
      rows: 5,
      resize: `vertical`,
      onInput: (e) => {
        let t2 = e.target.value;
        this.systemPromptText = t2, this.session.setSystemPrompt(t2);
      }
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
    return b`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
			</div>
		`;
  }
};
__decorate([r()], d.prototype, `debugLog`, void 0), __decorate([r()], d.prototype, `systemPromptText`, void 0), d = __decorate([t(`chatbot-demo`)], d), document.body.innerHTML = `<chatbot-demo></chatbot-demo>`;
export {
  d as ChatbotDemo
};
//# sourceMappingURL=3-1-chatbot-interface.js.map
