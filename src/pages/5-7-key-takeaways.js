import { __decorate as e, i18n as t, t$1 as n, x as r } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import "../workshop-runtime/AgentRuntime.js";
import "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as i } from "../workshop-runtime/DemoBase.js";
import { getSectionFiveContent as s } from "./section-5-content.js";
let a = class extends i {
  constructor(...e) {
    (super(...e), (this.headerTitle = t(`AI 代理人：重點整理`)), (this.sectionId = `5.7`));
  }
  get sectionContent() {
    return s(`5.7`);
  }
  renderContentPanel() {
    return r`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="max-w-4xl mx-auto p-6">
					<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
				</div>
			</div>
		`;
  }
};
((a = e([n(`agents-key-takeaways`)], a)),
  (document.body.innerHTML = `<agents-key-takeaways></agents-key-takeaways>`));
export { a as AgentsKeyTakeaways };
