import {
  o
} from "../chunks/chunk-ASOE6ZTL.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  bR,
  m,
  u
} from "../chunks/chunk-737EQ6X6.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/4-3-chain-of-thought.js
var h = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u6DF1\u5EA6\u601D\u8003\u8207\u9010\u6B65\u4F5C\u7B54`), this.sectionId = `4.3`, this.selectedExample = ``, this.useCoT = false, this.examples = [
      {
        id: `alice`,
        name: i18n(`\u611B\u9E97\u7D72\u554F\u984C\uFF08AIW\uFF09`),
        withoutCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u7406\uFF0C\u56DE\u7B54\u8981\u7CBE\u7C21\u3002`),
          prompt: i18n(
            `\u5BB6\u88E1\u6709 5 \u500B\u5C0F\u5B69\uFF1AA\u3001B\u3001C \u662F\u7537\u751F\uFF0CD\u3001E \u662F\u5973\u751F\u3002D \u8AAA\uFF1A\u300C\u6211\u6709 3 \u500B\u5144\u5F1F\u548C 1 \u500B\u59CA\u59B9\u3002\u300DA \u662F D \u7684\u54E5\u54E5\u3002A \u6709\u5E7E\u500B\u59CA\u59B9\uFF1F\u8ACB\u53EA\u56DE\u7B54\u6578\u5B57\u3002`
          )
        },
        withCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u7406\uFF0C\u8ACB\u4E00\u6B65\u4E00\u6B65\u601D\u8003\u554F\u984C\u3002`),
          prompt: i18n(
            `\u5BB6\u88E1\u6709 5 \u500B\u5C0F\u5B69\uFF1AA\u3001B\u3001C \u662F\u7537\u751F\uFF0CD\u3001E \u662F\u5973\u751F\u3002D \u8AAA\uFF1A\u300C\u6211\u6709 3 \u500B\u5144\u5F1F\u548C 1 \u500B\u59CA\u59B9\u3002\u300DA \u662F D \u7684\u54E5\u54E5\u3002A \u6709\u5E7E\u500B\u59CA\u59B9\uFF1F\u8ACB\u4E00\u6B65\u4E00\u6B65\u5217\u51FA\u5BB6\u5EAD\u6210\u54E1\uFF0C\u518D\u7D66\u51FA\u7B54\u6848\u3002`
          )
        }
      },
      {
        id: `math`,
        name: i18n(`\u6578\u5B78\u984C`),
        withoutCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u7406\uFF0C\u56DE\u7B54\u8981\u7CBE\u7C21\u3002`),
          prompt: i18n(`\u4E0D\u8981\u4F7F\u7528\u8A08\u7B97\u6A5F\uFF1A47 \xD7 83 + 47 \xD7 17 = \u591A\u5C11\uFF1F\u8ACB\u53EA\u56DE\u7B54\u6578\u5B57\u3002`)
        },
        withCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u7406\uFF0C\u8ACB\u4E00\u6B65\u4E00\u6B65\u5BEB\u51FA\u63A8\u7406\u904E\u7A0B\u3002`),
          prompt: i18n(`\u4E0D\u8981\u4F7F\u7528\u8A08\u7B97\u6A5F\uFF1A47 \xD7 83 + 47 \xD7 17 = \u591A\u5C11\uFF1F\u8ACB\u5148\u89C0\u5BDF\u53EF\u5426\u5408\u4F75\uFF0C\u518D\u4E00\u6B65\u4E00\u6B65\u7B97\u3002`)
        }
      },
      {
        id: `word-problem`,
        name: i18n(`\u6587\u5B57\u61C9\u7528\u984C`),
        withoutCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u89E3\u984C\u7684\u52A9\u7406\u3002`),
          prompt: i18n(
            `\u4E00\u500B\u6C34\u69FD\u6709\u5169\u500B\u6C34\u9F8D\u982D\u3002A \u55AE\u7368\u958B 6 \u5C0F\u6642\u6CE8\u6EFF\uFF0CB \u55AE\u7368\u958B 3 \u5C0F\u6642\u6CE8\u6EFF\u3002\u5169\u500B\u4E00\u8D77\u958B 1 \u5C0F\u6642\u5F8C\u95DC\u6389 B\uFF0C\u53EA\u5269 A\u3002\u7E3D\u5171\u9084\u8981\u591A\u4E45\u6CE8\u6EFF\uFF1F`
          )
        },
        withCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u7CFB\u7D71\u5316\u62C6\u89E3\u554F\u984C\u7684\u52A9\u7406\u3002`),
          prompt: `\u4E00\u500B\u6C34\u69FD\u6709\u5169\u500B\u6C34\u9F8D\u982D\u3002A \u55AE\u7368\u958B 6 \u5C0F\u6642\u6CE8\u6EFF\uFF0CB \u55AE\u7368\u958B 3 \u5C0F\u6642\u6CE8\u6EFF\u3002\u5169\u500B\u4E00\u8D77\u958B 1 \u5C0F\u6642\u5F8C\u95DC\u6389 B\uFF0C\u53EA\u5269 A\u3002\u7E3D\u5171\u9084\u8981\u591A\u4E45\u6CE8\u6EFF\uFF1F

\u8ACB\u4E00\u6B65\u4E00\u6B65\u89E3\uFF1A
1. \u7B97\u51FA A \u8207 B \u6BCF\u5C0F\u6642\u6CE8\u6EFF\u6BD4\u4F8B
2. \u7B97\u4E00\u8D77\u958B 1 \u5C0F\u6642\u5B8C\u6210\u591A\u5C11
3. \u7B97\u5269\u4E0B\u591A\u5C11
4. \u7B97 A \u9084\u9700\u8981\u591A\u4E45
5. \u7D66\u51FA\u7E3D\u6642\u9593`
        }
      },
      {
        id: `logic`,
        name: i18n(`\u908F\u8F2F\u984C`),
        withoutCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u89E3\u8B0E\u7684\u52A9\u7406\u3002`),
          prompt: i18n(
            `\u56DB\u500B\u4EBA\u6392\u968A\u3002A \u5728 B \u524D\u9762\uFF0CC \u5728 A \u5F8C\u9762\u4F46\u5728 D \u524D\u9762\uFF0CB \u4E0D\u5728\u6700\u5F8C\u3002\u8AB0\u4E00\u5B9A\u6392\u7B2C\u4E00\uFF1F`
          )
        },
        withCoT: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u908F\u8F2F\u63A8\u7406\u7684\u52A9\u7406\u3002`),
          prompt: `\u56DB\u500B\u4EBA\u6392\u968A\u3002A \u5728 B \u524D\u9762\uFF0CC \u5728 A \u5F8C\u9762\u4F46\u5728 D \u524D\u9762\uFF0CB \u4E0D\u5728\u6700\u5F8C\u3002\u8AB0\u4E00\u5B9A\u6392\u7B2C\u4E00\uFF1F

\u8ACB\u4E00\u6B65\u4E00\u6B65\u63A8\u7406\uFF1A
1. \u5217\u51FA\u6240\u6709\u9650\u5236
2. \u5617\u8A66\u53EF\u80FD\u7684\u6392\u5E8F
3. \u5224\u65B7\u662F\u5426\u6709\u552F\u4E00\u7B54\u6848\uFF1B\u5982\u679C\u6C92\u6709\uFF0C\u8ACB\u660E\u78BA\u8AAA\u4E0D\u552F\u4E00`
        }
      }
    ], this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = true, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  async runExample(e, t2) {
    this.selectedExample = e.id, this.useCoT = t2;
    let n = t2 ? e.withCoT : e.withoutCoT;
    this.session.setSystemPrompt(n.systemPrompt), this.session.clearMessages(), await this.agentInterface.sendMessage(n.prompt);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u6BD4\u8F03\u6709\u6C92\u6709\u8981\u6C42\u9010\u6B65\u63A8\u7406\u6642\uFF0C\u6A21\u578B\u8868\u73FE\u6703\u5982\u4F55\u6539\u8B8A\u3002`)}
				</p>

				${this.examples.map(
      (t2) => T(b`
						${E(
        O(b`${t2.name}
								${this.selectedExample === t2.id ? u(this.useCoT ? i18n(`With CoT`) : i18n(`No CoT`), `secondary`, `ml-2`) : ``}`)
      )}
						${A(b`
							<div class="flex flex-col gap-2">
								<div class="text-sm text-muted-foreground p-2 bg-muted/50 rounded">${t2.withoutCoT.prompt.split(`
`)[0]}</div>
								${Button({ variant: this.selectedExample === t2.id && !this.useCoT ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t2, false), children: i18n(`Run without CoT`) })}
								${Button({ variant: this.selectedExample === t2.id && this.useCoT ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t2, true), children: i18n(`Run with CoT`) })}
							</div>
						`)}
					`)
    )}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], h.prototype, `selectedExample`, void 0), __decorate([r()], h.prototype, `useCoT`, void 0), h = __decorate([t(`chain-of-thought-demo`)], h), document.body.innerHTML = `<chain-of-thought-demo></chain-of-thought-demo>`;
export {
  h as ChainOfThoughtDemo
};
//# sourceMappingURL=4-3-chain-of-thought.js.map
