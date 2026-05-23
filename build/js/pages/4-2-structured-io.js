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
  iconPlayLine,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/4-2-structured-io.js
var g = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u7D50\u69CB\u5316\u8F38\u5165\u8207\u8F38\u51FA`), this.sectionId = `4.2`, this.selectedFormat = ``, this.feedbackExamples = [
      {
        id: `shipping`,
        text: i18n(
          `\u5546\u54C1\u665A\u5230\u800C\u4E14\u6709\u7834\u640D\uFF0C\u5305\u88DD\u5F88\u7CDF\u3002\u6211\u6253\u7D66\u5BA2\u670D\u7B49\u4E86 45 \u5206\u9418\u624D\u63A5\u901A\uFF0C\u4E0D\u904E Sarah \u5F88\u6709\u5E6B\u52A9\uFF0C\u6700\u5F8C\u89E3\u6C7A\u4E86\u6211\u7684\u554F\u984C\u3002\u50F9\u683C\u5012\u662F\u9084\u4E0D\u932F\u3002`
        )
      },
      {
        id: `quality`,
        text: i18n(
          `\u5F88\u68D2\u7684\u7522\u54C1\uFF01\u529F\u80FD\u8DDF\u5EE3\u544A\u8AAA\u7684\u4E00\u6A23\uFF0C\u8A2D\u5B9A\u8D85\u7C21\u55AE\uFF0C\u4E0D\u5230 5 \u5206\u9418\u5C31\u5B8C\u6210\u3002\u505A\u5DE5\u5F88\u6709\u8CEA\u611F\u3002\u552F\u4E00\u62B1\u6028\u662F\u50F9\u683C\u504F\u9AD8\uFF0C\u4F46\u4EE5\u54C1\u8CEA\u4F86\u8AAA\u6211\u89BA\u5F97\u503C\u5F97\u3002`
        )
      },
      {
        id: `service`,
        text: i18n(
          `\u661F\u671F\u4E00\u4E0B\u55AE\uFF0C\u661F\u671F\u4E09\u5982\u671F\u5230\u8CA8\u3002\u7522\u54C1\u53EF\u4EE5\u7528\uFF0C\u4F46\u8AAA\u660E\u66F8\u5F88\u96E3\u61C2\uFF0C\u6211\u9084\u5F97\u770B YouTube \u624D\u5F04\u6E05\u695A\u3002\u7DDA\u4E0A\u5BA2\u670D\u56DE\u8986\u5F88\u5FEB\u4E5F\u5F88\u6709\u5E6B\u52A9\u3002\u5982\u679C\u6587\u4EF6\u5BEB\u597D\u4E00\u9EDE\uFF0C\u6211\u6703\u7D66 5 \u9846\u661F\u3002`
        )
      }
    ], this.approaches = [
      {
        id: `unstructured`,
        name: i18n(`A. \u672A\u7D50\u69CB\u5316\uFF08\u4E0D\u7406\u60F3\uFF09`),
        description: i18n(`\u63D0\u793A\u592A\u6A21\u7CCA\uFF0C\u8F38\u51FA\u96E3\u9810\u6E2C`),
        systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u6790\u5BA2\u6236\u56DE\u994B\u7684\u52A9\u7406\u3002`),
        prompt: `${i18n(`\u8ACB\u5206\u6790\u4EE5\u4E0B\u5BA2\u6236\u8A55\u8AD6\uFF1A`)}

${this.feedbackExamples.map((e) => e.text).join(`

`)}`
      },
      {
        id: `semi-structured`,
        name: i18n(`B. \u534A\u7D50\u69CB\u5316\uFF08\u8F03\u597D\uFF09`),
        description: i18n(`\u6709\u4E00\u9EDE\u7D50\u69CB\uFF0C\u4F46\u4ECD\u4EE5\u6563\u6587\u56DE\u7B54\u70BA\u4E3B`),
        systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u6790\u5BA2\u6236\u56DE\u994B\u7684\u52A9\u7406\u3002 \u8ACB\u7528\u6E05\u695A\u7684\u5C0F\u7BC0\u6574\u7406\u5206\u6790\u3002`),
        prompt: `\u8ACB\u5206\u6790\u4EE5\u4E0B\u5BA2\u6236\u56DE\u994B\u3002\u91DD\u5C0D\u6BCF\u5247\u8A55\u8AD6\uFF0C\u6574\u7406\u4E3B\u8981\u60C5\u7DD2\u8207\u91CD\u9EDE\u3002

\u8A55\u8AD6 1: ${this.feedbackExamples[0].text}

\u8A55\u8AD6 2: ${this.feedbackExamples[1].text}

\u8A55\u8AD6 3: ${this.feedbackExamples[2].text}`
      },
      {
        id: `fully-structured`,
        name: i18n(`C. \u5B8C\u6574\u7D50\u69CB\u5316\uFF08\u6700\u597D\uFF09`),
        description: i18n(`\u660E\u78BA\u5206\u9694\u7B26\u8207\u56FA\u5B9A\u8F38\u51FA\u683C\u5F0F`),
        systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5BA2\u6236\u56DE\u994B\u5206\u6790\u5E2B\u3002\u8ACB\u4F9D\u7167\u6307\u5B9A\u683C\u5F0F\uFF0C\u5F9E\u8A55\u8AD6\u4E2D\u62BD\u51FA\u5177\u9AD4\u8CC7\u6599\u9EDE\u3002`),
        prompt: `\u8ACB\u5206\u6790\u4EE5\u4E0B\u5BA2\u6236\u56DE\u994B\u3002\u6BCF\u5247\u8A55\u8AD6\u90FD\u7528\u4E09\u500B\u5F15\u865F\u5206\u9694\u3002

\u8A55\u8AD6 1:
"""
${this.feedbackExamples[0].text}
"""

\u8A55\u8AD6 2:
"""
${this.feedbackExamples[1].text}
"""

\u8A55\u8AD6 3:
"""
${this.feedbackExamples[2].text}
"""

\u8ACB\u91DD\u5C0D\u6BCF\u5247\u8A55\u8AD6\uFF0C\u5B8C\u5168\u4F9D\u7167\u4EE5\u4E0B\u683C\u5F0F\u8F38\u51FA\uFF1A

\u8A55\u8AD6 1:
- \u60C5\u7DD2\uFF1A\u6B63\u9762\uFF0F\u8CA0\u9762\uFF0F\u6DF7\u5408
- \u554F\u984C\uFF1A\u5217\u51FA\u6BCF\u500B\u554F\u984C\uFF0C\u82E5\u6C92\u6709\u8ACB\u5BEB\u300C\u7121\u300D
- \u512A\u9EDE\uFF1A\u5217\u51FA\u6B63\u9762\u91CD\u9EDE\uFF0C\u82E5\u6C92\u6709\u8ACB\u5BEB\u300C\u7121\u300D
- \u63D0\u5230\u7684\u54E1\u5DE5\uFF1A\u59D3\u540D\uFF0C\u82E5\u6C92\u6709\u8ACB\u5BEB\u300C\u7121\u300D
- \u512A\u5148\u8655\u7406\uFF1A\u6700\u91CD\u8981\u7684\u6539\u5584\u9805\u76EE\uFF0C\u82E5\u6C92\u6709\u8ACB\u5BEB\u300C\u7121\u9700\u8655\u7406\u300D`
      }
    ], this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  async runApproach(e) {
    this.selectedFormat = e.id, this.session.setSystemPrompt(e.systemPrompt), this.session.clearMessages(), await this.agentInterface.sendMessage(e.prompt);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u6BD4\u8F03\u4E0D\u540C\u63D0\u793A\u5BEB\u6CD5\uFF0C\u5982\u4F55\u8655\u7406\u540C\u4E00\u7D44\u5BA2\u6236\u56DE\u994B\u3002`)}
				</p>

				${T(b`
					${E(O(i18n(`\u5BA2\u6236\u56DE\u994B\u7BC4\u4F8B`)))}
					${A(b`
						<div class="space-y-3">
							${this.feedbackExamples.map(
      (e, t2) => b`
									<div class="text-xs">
										<div class="font-semibold text-foreground mb-1">${i18n(`\u8A55\u8AD6`)} ${t2 + 1}:</div>
										<div class="text-muted-foreground pl-2">${e.text}</div>
									</div>
								`
    )}
						</div>
					`)}
				`)}
				${this.approaches.map(
      (t2) => T(b`
						${E(
        O(b`${t2.name}
								${this.selectedFormat === t2.id ? u(i18n(`\u5DF2\u9078\u53D6`), `secondary`, `ml-2`) : ``}`)
      )}
						${A(b`
							<div class="text-xs text-muted-foreground mb-3">${t2.description}</div>
							${Button({
        variant: this.selectedFormat === t2.id ? `default` : `secondary`,
        size: `sm`,
        onClick: async () => {
          try {
            await this.runApproach(t2);
          } catch (e) {
            console.error(`Failed to run approach`, e);
          }
        },
        children: b`${iconPlayLine(`sm`)}<span class="ml-1">${i18n(`\u57F7\u884C\u9019\u500B\u65B9\u6CD5`)}</span>`
      })}
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
__decorate([r()], g.prototype, `selectedFormat`, void 0), g = __decorate([t(`structured-io-demo`)], g), document.body.innerHTML = `<structured-io-demo></structured-io-demo>`;
export {
  g as StructuredIODemo
};
//# sourceMappingURL=4-2-structured-io.js.map
