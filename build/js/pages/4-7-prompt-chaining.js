import {
  o
} from "../chunks/chunk-ASOE6ZTL.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  U,
  bR,
  m
} from "../chunks/chunk-737EQ6X6.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/4-7-prompt-chaining.js
var h = class extends m {
  get steps() {
    return [
      {
        id: `extract`,
        name: i18n(`\u6B65\u9A5F 1\uFF1A\u62BD\u51FA\u91CD\u9EDE`),
        prompt: `\u8ACB\u5F9E\u4EE5\u4E0B\u516C\u544A\u62BD\u51FA 4 \u500B\u4E3B\u8981\u6210\u5C31\uFF0C\u4E26\u7528\u689D\u5217\u5F0F\u8F38\u51FA\uFF1A

"${this.rawInput}"

\u683C\u5F0F\uFF1A
\u2022 \u6210\u5C31 1
\u2022 \u6210\u5C31 2
\u2022 \u6210\u5C31 3
\u2022 \u6210\u5C31 4`
      },
      {
        id: `context`,
        name: i18n(`\u6B65\u9A5F 2\uFF1A\u88DC\u4E0A\u5BA2\u6236\u50F9\u503C`),
        prompt: `\u8ACB\u91DD\u5C0D\u525B\u525B\u5217\u51FA\u7684\u6BCF\u500B\u6210\u5C31\uFF0C\u88DC\u4E0A\u4E00\u53E5\u8A71\u8AAA\u660E\u5B83\u5C0D\u5BA2\u6236\u6216\u4F7F\u7528\u8005\u6709\u4EC0\u9EBC\u50F9\u503C\u3002

\u683C\u5F0F\uFF1A
\u2022 \u6210\u5C31\uFF1A\u70BA\u4EC0\u9EBC\u91CD\u8981`
      },
      {
        id: `draft`,
        name: i18n(`\u6B65\u9A5F 3\uFF1A\u64B0\u5BEB LinkedIn \u8CBC\u6587`),
        prompt: i18n(
          `\u8ACB\u628A\u9019\u4E9B\u6210\u5C31\u8207\u5BA2\u6236\u50F9\u503C\u6539\u5BEB\u6210\u4E00\u7BC7\u5438\u5F15\u4EBA\u7684 LinkedIn \u8CBC\u6587\u3002\u9577\u5EA6 3 \u5230 4 \u53E5\uFF0C\u8A9E\u6C23\u5C08\u696D\u4F46\u6709\u71B1\u5EA6\uFF0C\u958B\u982D\u8981\u6709\u5438\u5F15\u4EBA\u7684 hook\u3002`
        )
      },
      {
        id: `engage`,
        name: i18n(`\u6B65\u9A5F 4\uFF1A\u52A0\u5165\u4E92\u52D5\u554F\u984C`),
        prompt: i18n(
          `\u8ACB\u5728 LinkedIn \u8CBC\u6587\u6700\u5F8C\u52A0\u4E0A\u4E00\u500B\u554F\u984C\uFF0C\u9F13\u52F5\u8B80\u8005\u7559\u8A00\u4E92\u52D5\u3002\u554F\u984C\u8981\u9080\u8ACB\u5927\u5BB6\u5206\u4EAB\u7D93\u9A57\u6216\u770B\u6CD5\u3002`
        )
      }
    ];
  }
  constructor() {
    super(), this.headerTitle = i18n(`\u63D0\u793A\u4E32\u63A5\uFF1A\u628A\u8907\u96DC\u4EFB\u52D9\u62C6\u6210\u5C0F\u6B65\u9A5F`), this.sectionId = `4.7`, this.currentStep = 0, this.isProcessing = false, this.completed = /* @__PURE__ */ new Set(), this.rawInput = i18n(
      `\u6211\u5011\u516C\u53F8\u525B\u7A81\u7834 100 \u842C\u4F7F\u7528\u8005\uFF0C\u672C\u5B63\u71DF\u6536\u6210\u9577 40%\uFF0C\u9032\u5165 3 \u500B\u65B0\u570B\u5BB6\uFF08\u5FB7\u570B\u3001\u6CD5\u570B\u3001\u65E5\u672C\uFF09\uFF0C\u4E26\u65B0\u8058 50 \u4F4D\u540C\u4E8B`
    ), this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`, this.session.setSystemPrompt(
      i18n(`You are a helpful assistant. Follow the instructions exactly and be concise.`)
    ), this.session.clearMessages();
  }
  async runStep(e) {
    this.isProcessing || e < 0 || e >= this.steps.length || e > 0 && !this.completed.has(this.steps[e - 1].id) || (this.isProcessing = true, await this.agentInterface.sendMessage(this.steps[e].prompt), this.completed.add(this.steps[e].id), this.currentStep = e + 1, this.isProcessing = false);
  }
  resetChain() {
    this.currentStep = 0, this.completed.clear(), this.session.clearMessages();
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${T(b`
					${E(O(i18n(`\u539F\u59CB\u8F38\u5165`)))}
					${A(
      b`${U({
        label: i18n(`\u516C\u53F8\u516C\u544A`),
        rows: 3,
        value: this.rawInput,
        onInput: (e) => {
          this.rawInput = e.target.value, this.resetChain();
        }
      })}`
    )}
				`)}
				${T(b`
					${E(O(i18n(`\u8F49\u63DB\u93C8`)))}
					${A(b`
						<div class="space-y-2">
							${this.steps.map((t2, n) => Button({ variant: this.completed.has(t2.id) ? `secondary` : `outline`, size: `sm`, disabled: this.isProcessing || n > 0 && !this.completed.has(this.steps[n - 1].id), onClick: () => this.runStep(n), children: t2.name, className: `w-full justify-start` }))}
						</div>
						${this.currentStep > 0 ? Button({ variant: `outline`, size: `sm`, onClick: () => this.resetChain(), children: i18n(`Start Over`), className: `mt-3 w-full` }) : ``}
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
__decorate([r()], h.prototype, `currentStep`, void 0), __decorate([r()], h.prototype, `isProcessing`, void 0), __decorate([r()], h.prototype, `completed`, void 0), __decorate([r()], h.prototype, `rawInput`, void 0), h = __decorate([t(`prompt-chaining-demo`)], h), document.body.innerHTML = `<prompt-chaining-demo></prompt-chaining-demo>`;
export {
  h as PromptChainingDemo
};
//# sourceMappingURL=4-7-prompt-chaining.js.map
