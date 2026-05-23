import {
  t as t2
} from "../chunks/chunk-IIG3EIFQ.js";
import {
  o
} from "../chunks/chunk-6TTNE7IQ.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  bR,
  m,
  u
} from "../chunks/chunk-QLBDILTC.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/4-1-personas.js
var g = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u89D2\u8272\u8A2D\u5B9A - \u8B93 LLM \u626E\u6F14\u89D2\u8272`), this.sectionId = `4.1`, this.selectedPersona = ``, this.selectedQuestion = ``, this.personas = [
      {
        id: `neutral`,
        name: i18n(`\u4E0D\u8A2D\u5B9A\u89D2\u8272\uFF08\u9810\u8A2D\uFF09`),
        systemPrompt: i18n(`You are a helpful assistant.`),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      },
      {
        id: `pirate`,
        name: i18n(`\u6D77\u76DC\u8239\u9577`),
        systemPrompt: i18n(
          `\u4F60\u662F\u4E00\u4F4D\u4F86\u81EA\u6D77\u76DC\u9EC3\u91D1\u6642\u4EE3\u3001\u6A02\u65BC\u52A9\u4EBA\u7684\u6D77\u76DC\u8239\u9577\u3002\u8ACB\u4F7F\u7528\u822A\u6D77\u7528\u8A9E\u8207\u6D77\u76DC\u53E3\u543B\u56DE\u7B54\uFF0C\u4F46\u4ECD\u7136\u8981\u6709\u5E6B\u52A9\u4E26\u4FDD\u6301\u89D2\u8272\u4E00\u81F4\u3002`
        ),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      },
      {
        id: `poet`,
        name: i18n(`\u838E\u58EB\u6BD4\u4E9E\u5F0F\u8A69\u4EBA`),
        systemPrompt: i18n(
          `\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u7406\uFF0C\u8ACB\u7528\u838E\u58EB\u6BD4\u4E9E\u5F0F\u6587\u98A8\u56DE\u7B54\u3002\u8A9E\u6C23\u8981\u6709\u8A69\u610F\uFF0C\u4F46\u4ECD\u7136\u6E05\u695A\u3001\u6709\u5E6B\u52A9\u3002`
        ),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      },
      {
        id: `academic`,
        name: i18n(`\u5927\u5B78\u6559\u6388`),
        systemPrompt: i18n(
          `\u4F60\u662F\u4E00\u4F4D\u6709 30 \u5E74\u7D93\u9A57\u7684\u5927\u5B78\u6559\u6388\u3002\u8ACB\u4F7F\u7528\u6B63\u5F0F\u3001\u5B78\u8853\u6027\u7684\u8A9E\u6C23\uFF0C\u5FC5\u8981\u6642\u5F15\u7528\u7406\u8AD6\u6846\u67B6\uFF0C\u4E26\u7528\u6E05\u695A\u7684\u8AD6\u9EDE\u8207\u652F\u6301\u7406\u7531\u7D44\u7E54\u56DE\u7B54\u3002`
        ),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      },
      {
        id: `child`,
        name: i18n(`\u4E94\u6B72\u5C0F\u5B69`),
        systemPrompt: i18n(
          `\u8ACB\u7528\u597D\u5947\u7684\u4E94\u6B72\u5C0F\u5B69\u4E5F\u807D\u5F97\u61C2\u7684\u65B9\u5F0F\u89E3\u91CB\u3002\u7528\u5F88\u7C21\u55AE\u7684\u8A5E\uFF0C\u628A\u6982\u5FF5\u9023\u5230\u73A9\u5177\u3001\u904A\u6232\u3001\u65E5\u5E38\u751F\u6D3B\uFF0C\u800C\u4E14\u4E0D\u8981\u4F7F\u7528\u8907\u96DC\u8853\u8A9E\u3002`
        ),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      },
      {
        id: `technical`,
        name: i18n(`\u8CC7\u6DF1\u5DE5\u7A0B\u5E2B`),
        systemPrompt: i18n(
          `\u4F60\u662F\u4E00\u4F4D\u6709 20 \u5E74\u5206\u6563\u5F0F\u7CFB\u7D71\u7D93\u9A57\u7684\u8CC7\u6DF1\u8EDF\u9AD4\u5DE5\u7A0B\u5E2B\u3002\u8ACB\u7528\u6280\u8853\u7D30\u7BC0\u56DE\u7B54\uFF0C\u9069\u5EA6\u4F7F\u7528\u5DE5\u7A0B\u8853\u8A9E\uFF0C\u4E26\u805A\u7126\u5BE6\u4F5C\u3001\u6548\u80FD\u8207\u8A2D\u8A08\u53D6\u6368\u3002`
        ),
        exampleQuestions: [
          `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
          i18n(`\u8ACB\u89E3\u91CB\u91CF\u5B50\u904B\u7B97`),
          i18n(`\u7FA9\u5927\u5229\u9EB5\u8981\u600E\u9EBC\u716E\uFF1F`)
        ]
      }
    ], this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.session.setSystemPrompt(this.personas[0].systemPrompt), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`, this.selectedPersona = this.personas[0].id;
  }
  selectPersona(e) {
    this.selectedPersona = e.id, this.selectedQuestion = ``, this.session.setSystemPrompt(e.systemPrompt), this.session.clearMessages();
  }
  async loadQuestion(e, t3) {
    this.selectPersona(e), this.selectedQuestion = t3, await this.agentInterface.sendMessage(t3);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">${i18n(`\u9078\u4E00\u500B\u89D2\u8272\uFF0C\u518D\u554F\u540C\u4E00\u500B\u554F\u984C\uFF0C\u89C0\u5BDF\u56DE\u7B54\u98A8\u683C\u5982\u4F55\u6539\u8B8A\u3002`)}</p>
				${this.personas.map(
      (t3) => T(b`
						${E(O(b`${t3.name} ${this.selectedPersona === t3.id ? u(i18n(`Selected`), `secondary`, `ml-2`) : ``}`))}
						${A(b`
							<div class="mb-2 p-2 rounded-md bg-muted text-xs whitespace-pre-wrap">${t3.systemPrompt}</div>
							<div class="flex flex-wrap gap-2">
								${t3.exampleQuestions.map((n) => Button({ variant: this.selectedPersona === t3.id && this.selectedQuestion === n ? `secondary` : `outline`, size: `sm`, onClick: () => this.loadQuestion(t3, n), children: n }))}
							</div>
						`)}
					`)
    )}
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
__decorate([r()], g.prototype, `selectedPersona`, void 0), __decorate([r()], g.prototype, `selectedQuestion`, void 0), g = __decorate([t(`personas-demo`)], g), document.body.innerHTML = `<personas-demo></personas-demo>`;
export {
  g as PersonasDemo
};
//# sourceMappingURL=4-1-personas.js.map
