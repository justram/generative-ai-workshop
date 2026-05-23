import {
  o
} from "../chunks/chunk-BUQY3BQN.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  U,
  bR,
  m
} from "../chunks/chunk-FCZIHEE4.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-4L3FZKEY.js";

// src/pages/4-8-self-correction.js
var h = class extends m {
  get steps() {
    return [
      {
        id: `generate`,
        name: i18n(`\u6B65\u9A5F 1\uFF1A\u7522\u751F\u4E3B\u7BA1\u6458\u8981`),
        prompt: `\u8ACB\u6839\u64DA\u4EE5\u4E0B\u5B63\u5EA6\u7D50\u679C\uFF0C\u5BEB\u4E00\u4EFD\u5169\u6BB5\u5F0F\u4E3B\u7BA1\u6458\u8981\uFF1A

"${this.reportData}"

\u8ACB\u805A\u7126\u95DC\u9375\u6307\u6A19\u8207\u5546\u696D\u610F\u6DB5\u3002`
      },
      {
        id: `critique`,
        name: i18n(`\u6B65\u9A5F 2\uFF1A\u6279\u5224\u6458\u8981`),
        prompt: `\u8ACB\u6AA2\u67E5\u4F60\u525B\u525B\u5BEB\u7684\u4E3B\u7BA1\u6458\u8981\uFF0C\u8A55\u4F30\uFF1A
1. \u95DC\u9375\u6307\u6A19\u662F\u5426\u6E05\u695A
2. \u5546\u696D\u6D1E\u5BDF\u662F\u5426\u8DB3\u5920
3. \u8A9E\u6C23\u662F\u5426\u6709\u884C\u52D5\u5C0E\u5411
4. \u662F\u5426\u9069\u5408\u4E3B\u7BA1\u95B1\u8B80

\u8ACB\u5217\u51FA\u5177\u9AD4\u554F\u984C\u8207\u6539\u5584\u5EFA\u8B70\u3002`
      },
      {
        id: `improve`,
        name: i18n(`\u6B65\u9A5F 3\uFF1A\u6839\u64DA\u6279\u5224\u6539\u5BEB`),
        prompt: `\u8ACB\u6839\u64DA\u4F60\u7684\u6279\u5224\uFF0C\u91CD\u5BEB\u4E3B\u7BA1\u6458\u8981\uFF0C\u4FEE\u6B63\u6240\u6709\u6307\u51FA\u7684\u554F\u984C\uFF0C\u8B93\u5B83\u66F4\u9069\u5408\u9AD8\u968E\u4E3B\u7BA1\u95B1\u8B80\u3002`
      }
    ];
  }
  constructor() {
    super(), this.headerTitle = i18n(`\u81EA\u6211\u4FEE\u6B63 - \u53CD\u8986\u6539\u9032`), this.sectionId = `4.8`, this.currentStep = 0, this.isProcessing = false, this.completed = /* @__PURE__ */ new Set(), this.reportData = i18n(
      `2024 Q3 results: revenue grew 15%, new customers increased 22%, but expansion costs rose 18%. We entered three new markets. Customer satisfaction reached a record high of 94%.`
    ), this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`, this.session.setSystemPrompt(
      i18n(`You are a helpful assistant. Follow the instructions exactly and be concise.`)
    ), this.session.clearMessages();
  }
  async runStep(e) {
    this.isProcessing || e < 0 || e >= this.steps.length || e > 0 && !this.completed.has(this.steps[e - 1].id) || (this.isProcessing = true, await this.agentInterface.sendMessage(this.steps[e].prompt), this.completed.add(this.steps[e].id), this.currentStep = e + 1, this.isProcessing = false);
  }
  resetFlow() {
    this.currentStep = 0, this.completed.clear(), this.session.clearMessages();
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${T(b`
					${E(O(i18n(`\u5B63\u5EA6\u5831\u544A\u8CC7\u6599`)))}
					${A(
      b`${U({
        label: i18n(`\u53EF\u7DE8\u8F2F\u8CC7\u6599`),
        rows: 3,
        value: this.reportData,
        onInput: (e) => {
          this.reportData = e.target.value, this.resetFlow();
        }
      })}`
    )}
				`)}
				${T(b`
					${E(O(i18n(`\u81EA\u6211\u4FEE\u6B63\u6D41\u7A0B`)))}
					${A(b`
						<div class="space-y-2">
							${this.steps.map((t2, n) => Button({ variant: this.completed.has(t2.id) ? `secondary` : `outline`, size: `sm`, disabled: this.isProcessing || n > 0 && !this.completed.has(this.steps[n - 1].id), onClick: () => this.runStep(n), children: t2.name, className: `w-full justify-start` }))}
						</div>
						${this.currentStep > 0 ? Button({ variant: `outline`, size: `sm`, onClick: () => this.resetFlow(), children: i18n(`Start Over`), className: `mt-3 w-full` }) : ``}
					`)}
				`)}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], h.prototype, `currentStep`, void 0), __decorate([r()], h.prototype, `isProcessing`, void 0), __decorate([r()], h.prototype, `completed`, void 0), __decorate([r()], h.prototype, `reportData`, void 0), h = __decorate([t(`self-correction-demo`)], h), document.body.innerHTML = `<self-correction-demo></self-correction-demo>`;
export {
  h as SelfCorrectionDemo
};
//# sourceMappingURL=4-8-self-correction.js.map
