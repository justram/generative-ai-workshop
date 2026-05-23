import {
  i,
  n,
  r as r2,
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

// src/pages/4-4-grounding.js
var y = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u7528\u53C3\u8003\u8CC7\u6599\u8B93\u56DE\u7B54\u6709\u6839\u64DA`), this.sectionId = `4.4`, this.selectedExample = ``, this.useGrounding = false, this.examples = [
      {
        id: `company`,
        name: `${t2} \u8CC7\u8A0A`,
        question: `\u4F60\u53EF\u4EE5\u4ECB\u7D39\u4E00\u4E0B ${t2} \u55CE\uFF1F`,
        withoutGrounding: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u56DE\u7B54\u516C\u53F8\u554F\u984C\u7684\u52A9\u7406\u3002`)
        },
        withGrounding: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u56DE\u7B54 ${t2} \u76F8\u95DC\u554F\u984C\u7684\u52A9\u7406\u3002

\u91CD\u8981\uFF1A\u53EA\u80FD\u6839\u64DA\u4E0B\u65B9\u63D0\u4F9B\u7684\u8CC7\u8A0A\u56DE\u7B54\u3002\u5982\u679C\u53C3\u8003\u8CC7\u6599\u88E1\u6C92\u6709\u7B54\u6848\uFF0C\u8ACB\u8AAA "${i18n(`\u6211\u7684\u53C3\u8003\u8CC7\u6599\u88E1\u6C92\u6709\u9019\u9805\u8CC7\u8A0A\u3002`)}"

\u516C\u53F8\u8CC7\u8A0A\uFF1A
\`\`\`
${n}
\`\`\``,
          reference: `${t2} \u516C\u53F8\u8CC7\u6599`
        }
      },
      {
        id: `product`,
        name: i18n(`\u7522\u54C1\u7D30\u7BC0`),
        question: `${r2} \u7684\u4E3B\u8981\u529F\u80FD\u6709\u54EA\u4E9B\uFF1F`,
        withoutGrounding: {
          systemPrompt: i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u56DE\u7B54\u8EDF\u9AD4\u7522\u54C1\u554F\u984C\u7684\u52A9\u7406\u3002`)
        },
        withGrounding: {
          systemPrompt: `\u4F60\u662F ${r2} \u8EDF\u9AD4\u7684\u6280\u8853\u52A9\u7406\u3002

\u91CD\u8981\uFF1A\u53EA\u80FD\u4F7F\u7528\u4E0B\u65B9\u53C3\u8003\u6587\u4EF6\u4E2D\u7684\u8CC7\u8A0A\uFF0C\u4E0D\u8981\u7DE8\u9020\u529F\u80FD\u6216\u898F\u683C\u3002

\u7522\u54C1\u8CC7\u8A0A\uFF1A
\`\`\`
${i}
\`\`\``,
          reference: `${r2} \u6587\u4EF6`
        }
      }
    ], this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  async runExample(e, t3) {
    this.selectedExample = e.id, this.useGrounding = t3;
    let n2 = t3 ? e.withGrounding.systemPrompt : e.withoutGrounding.systemPrompt;
    this.session.setSystemPrompt(n2), this.session.clearMessages(), await this.agentInterface.sendMessage(e.question);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    let t3 = this.examples.find((e) => e.id === this.selectedExample);
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`See how providing reference material improves accuracy and reduces hallucination.`)}
				</p>

				${this.examples.map(
      (t4) => T(b`
						${E(
        O(b`${t4.name}
								${this.selectedExample === t4.id ? u(this.useGrounding ? `\u6709\u53C3\u8003\u8CC7\u6599` : `\u7121\u53C3\u8003\u8CC7\u6599`, `secondary`, `ml-2`) : ``}`)
      )}
						${A(b`
							<div class="text-xs text-muted-foreground mb-2">"${t4.question}"</div>
							<div class="flex flex-col gap-2">
								${Button({ variant: this.selectedExample === t4.id && !this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t4, false), children: i18n(`\u4E0D\u4F7F\u7528\u53C3\u8003\u8CC7\u6599\u57F7\u884C`) })}
								${Button({ variant: this.selectedExample === t4.id && this.useGrounding ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t4, true), children: i18n(`\u4F7F\u7528\u53C3\u8003\u8CC7\u6599\u57F7\u884C`) })}
							</div>
						`)}
					`)
    )}
				${t3 && this.useGrounding ? T(b`
							${E(O(i18n(`Reference Material`)))}
							${A(b`<div class="text-xs bg-muted rounded p-2 max-h-48 overflow-auto">
									${t3.id === `company` ? n : i}
								</div>`)}
						`) : ``}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], y.prototype, `selectedExample`, void 0), __decorate([r()], y.prototype, `useGrounding`, void 0), y = __decorate([t(`grounding-demo`)], y), document.body.innerHTML = `<grounding-demo></grounding-demo>`;
export {
  y as GroundingDemo
};
//# sourceMappingURL=4-4-grounding.js.map
