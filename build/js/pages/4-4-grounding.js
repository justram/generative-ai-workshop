import {
  i,
  n,
  r as r2,
  t as t2
} from "../chunks/chunk-WNOXYEGF.js";
import {
  o
} from "../chunks/chunk-BUQY3BQN.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  bR,
  m,
  u
} from "../chunks/chunk-FCZIHEE4.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-4L3FZKEY.js";

// src/pages/4-4-grounding.js
var y = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u7528\u53C3\u8003\u8CC7\u6599\u8B93\u56DE\u7B54\u6709\u6839\u64DA`), this.sectionId = `4.4`, this.selectedExample = ``, this.useGrounding = false, this.examples = [
      {
        id: `company`,
        name: i18n(`Company information`),
        question: i18n(`Can you introduce BEST?`),
        withoutGrounding: {
          systemPrompt: i18n(`You are an assistant helping answer company questions.`)
        },
        withGrounding: {
          systemPrompt: `You are an assistant answering questions about ${t2}.

Important: answer only from the reference material below. If the reference does not contain the answer, say "${i18n(`The reference material does not contain this information.`)}"

Company information:
\`\`\`
${n}
\`\`\``,
          reference: i18n(`Company reference`)
        }
      },
      {
        id: `product`,
        name: i18n(`Product details`),
        question: i18n(`What are the main features of the Modular Simulation Framework?`),
        withoutGrounding: {
          systemPrompt: i18n(`You are an assistant helping answer software product questions.`)
        },
        withGrounding: {
          systemPrompt: `You are the technical assistant for ${r2}.

Important: only use the information in the reference material below. Do not invent features or specifications.

Product information:
\`\`\`
${i}
\`\`\``,
          reference: i18n(`Product reference`)
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
