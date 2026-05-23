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
let a = class extends i {
  constructor(...e) {
    (super(...e),
      (this.headerTitle = t(`接下來可以往哪裡走`)),
      (this.sectionId = `7`),
      (this.sectionMode = `subtree`));
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
a = e([n(`where-to-go-demo`)], a);
const o = document.createElement(`where-to-go-demo`);
document.body.appendChild(o);
export { a as WhereToGoDemo };
