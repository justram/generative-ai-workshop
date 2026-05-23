import {
  o
} from "../chunks/chunk-BUQY3BQN.js";
import {
  Pi,
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

// src/pages/4-5-nlp-tasks.js
var f = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u81EA\u7136\u8A9E\u8A00\u8655\u7406\u4EFB\u52D9`), this.sectionId = `4.5`, this.selectedTask = ``, this.defaultText = ` announced strong growth in the latest quarter. The company said customer adoption of its flagship product, , increased by 35%. In the quarterly earnings call, the CEO said: \u201CWe are very pleased with these results.\u201D With new partners driving further expansion, this positive momentum is expected to continue into Q4.`, this.nlpTasks = [
      {
        id: `translate`,
        name: i18n(`\u7FFB\u8B6F`),
        prompt: i18n(`\u7FFB\u8B6F\u6210\u5FB7\u6587\uFF1A`),
        sampleInput: this.defaultText
      },
      {
        id: `summarize`,
        name: i18n(`\u6458\u8981`),
        prompt: i18n(`\u7528\u4E00\u53E5\u8A71\u6458\u8981\uFF1A`),
        sampleInput: this.defaultText
      },
      {
        id: `paraphrase`,
        name: i18n(`\u6539\u5BEB`),
        prompt: i18n(`\u6539\u5BEB\u9019\u6BB5\u6587\u5B57\uFF08\u4FDD\u7559\u610F\u601D\uFF0C\u4F46\u63DB\u4E00\u7A2E\u8AAA\u6CD5\uFF09\uFF1A`),
        sampleInput: i18n(
          `Our staff members have diverse professional backgrounds and bring unique perspectives to the team.`
        )
      },
      {
        id: `improve`,
        name: i18n(`\u6F64\u98FE\u6587\u98A8`),
        prompt: i18n(`\u6539\u5584\u5BEB\u4F5C\u98A8\u683C\uFF08\u8B93\u5B83\u66F4\u5C08\u696D\u3001\u66F4\u7CBE\u7149\uFF09\uFF1A`),
        sampleInput: i18n(
          `The meeting was ok i guess. We talked about the new project and stuff. People seemed interested but who knows. We should probably meet again next week or something to figure out the details.`
        )
      },
      {
        id: `ner`,
        name: i18n(`\u547D\u540D\u5BE6\u9AD4\u8FA8\u8B58`),
        prompt: i18n(`Extract all entities from this text and classify them:
- People (include titles if present)
- Companies
- Products
- Locations
- Percentages/numbers
- Dates/times

Text:`),
        sampleInput: this.defaultText
      },
      {
        id: `sentiment`,
        name: i18n(`\u60C5\u7DD2\u5206\u6790`),
        prompt: i18n(`\u5206\u6790\u9019\u6BB5\u6587\u5B57\u7684\u60C5\u7DD2\u3002\u8ACB\u7528 -1\uFF08\u975E\u5E38\u8CA0\u9762\uFF09\u5230 1\uFF08\u975E\u5E38\u6B63\u9762\uFF09\u8A55\u5206\uFF0C\u4E26\u8AAA\u660E\u539F\u56E0\uFF1A`),
        sampleInput: i18n(
          `\u9019\u6B21\u8EDF\u9AD4\u66F4\u65B0\u6839\u672C\u662F\u707D\u96E3\u3002\u529F\u80FD\u90FD\u4E0D\u7167\u9810\u671F\u904B\u4F5C\uFF0C\u4ECB\u9762\u5F88\u6DF7\u4E82\uFF0C\u9084\u4E00\u76F4\u7576\u6389\u3002\u6211\u5011\u6D6A\u8CBB\u4E86\u597D\u5E7E\u500B\u5C0F\u6642\uFF0C\u5C0D\u5C08\u696D\u5DE5\u5177\u4F86\u8AAA\u5B8C\u5168\u4E0D\u80FD\u63A5\u53D7\u3002`
        )
      },
      {
        id: `classify`,
        name: i18n(`\u6587\u5B57\u5206\u985E`),
        prompt: i18n(`Classify this customer feedback into one category:
- Bug report
- Feature request
- Complaint
- Praise
- Question

Feedback:`),
        sampleInput: i18n(
          `\u7576\u6211\u5617\u8A66\u5132\u5B58\u8D85\u904E 100MB \u7684\u6A94\u6848\u6642\uFF0C\u532F\u51FA\u529F\u80FD\u7121\u6CD5\u904B\u4F5C\u3002\u5B83\u6703\u5361\u4F4F\uFF0C\u6700\u5F8C\u903E\u6642\u3002\u9019\u963B\u7919\u4E86\u6211\u5011\u7684\u90E8\u7F72\u3002`
        )
      },
      {
        id: `keywords`,
        name: i18n(`\u95DC\u9375\u5B57\u62BD\u53D6`),
        prompt: i18n(`\u8ACB\u5F9E\u9019\u6BB5\u6587\u5B57\u62BD\u51FA 5 \u500B\u6700\u91CD\u8981\u7684\u95DC\u9375\u5B57\u6216\u7247\u8A9E\uFF1A`),
        sampleInput: this.defaultText
      },
      {
        id: `simplify`,
        name: i18n(`\u7C21\u5316\u8AAA\u660E`),
        prompt: i18n(`\u8ACB\u7528 10 \u6B72\u5C0F\u5B69\u4E5F\u807D\u5F97\u61C2\u7684\u65B9\u5F0F\u89E3\u91CB\u9019\u6BB5\u6587\u5B57\uFF1A`),
        sampleInput: i18n(`\u91CF\u5B50\u904B\u7B97\u5229\u7528\u758A\u52A0\u8207\u7CFE\u7E8F\u7B49\u91CF\u5B50\u529B\u5B78\u73FE\u8C61\uFF0C\u57F7\u884C\u50B3\u7D71\u96FB\u8166\u96E3\u4EE5\u8655\u7406\u7684\u8A08\u7B97\u3002`)
      },
      {
        id: `formal`,
        name: i18n(`\u6B63\u5F0F\u5316`),
        prompt: i18n(`\u8ACB\u6539\u5BEB\u6210\u6B63\u5F0F\u7684\u5B78\u8853\u8A9E\u6C23\uFF1A`),
        sampleInput: i18n(
          `\u55E8\uFF01\u60F3\u8DDF\u4F60\u8AAA\u6211\u5011\u5728\u7814\u7A76\u88E1\u767C\u73FE\u4E86\u4E00\u4E9B\u5F88\u9177\u7684\u6771\u897F\u3002\u7C21\u55AE\u8AAA\uFF0C\u6750\u6599\u52A0\u71B1\u5F8C\u6703\u8B8A\u5F97\u66F4\u5F37\u3002\u5F88\u6709\u8DA3\u5427\uFF1F`
        )
      },
      {
        id: `bullets`,
        name: i18n(`\u689D\u5217\u91CD\u9EDE`),
        prompt: i18n(`\u8ACB\u628A\u9019\u6BB5\u6587\u5B57\u6574\u7406\u6210\u6E05\u695A\u7684\u689D\u5217\u91CD\u9EDE\uFF1A`),
        sampleInput: this.defaultText
      }
    ], this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.session.setSystemPrompt(
      i18n(
        `You are an assistant specialized in natural-language tasks. Complete each task precisely, with correct formatting.`
      )
    ), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  async runTask(e) {
    this.selectedTask = e.id;
    let t2 = e.sampleInput.trim();
    this.session.clearMessages(), await this.agentInterface.sendMessage(`${e.prompt}

${t2}`);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u770B\u770B LLM \u4E0D\u7D93\u984D\u5916\u8A13\u7DF4\u6642\uFF0C\u80FD\u5982\u4F55\u8655\u7406\u5E38\u898B\u81EA\u7136\u8A9E\u8A00\u4EFB\u52D9\u3002`)}
				</p>

				<div class="space-y-2">
					${this.nlpTasks.map(
      (t2) => b`
							<div class="flex items-center justify-between p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
								<div class="flex-1 min-w-0 mr-2">
									<div class="font-medium text-sm text-foreground">${t2.name}</div>
									<div class="text-xs text-muted-foreground truncate">
										${t2.prompt.substring(0, 50)}${t2.prompt.length > 50 ? `...` : ``}
									</div>
								</div>
								${Button({ variant: this.selectedTask === t2.id ? `secondary` : `outline`, size: `sm`, onClick: () => this.runTask(t2), children: i18n(`\u57F7\u884C`) })}
							</div>
						`
    )}
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], f.prototype, `selectedTask`, void 0), f = __decorate([t(`nlp-tasks-demo`)], f), document.body.innerHTML = `<nlp-tasks-demo></nlp-tasks-demo>`;
export {
  f as NLPTasksDemo
};
//# sourceMappingURL=4-5-nlp-tasks.js.map
