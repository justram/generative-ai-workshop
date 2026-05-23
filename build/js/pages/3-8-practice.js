import {
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/3-8-practice.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`Chatbots: Key Takeaways`), this.sectionId = `3.8`;
  }
  renderContentPanel() {
    return b`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="max-w-4xl mx-auto p-6">
					<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
				</div>
			</div>
		`;
  }
};
a = __decorate([t(`practice-demo`)], a), document.body.innerHTML = `<practice-demo></practice-demo>`;
export {
  a as PracticeDemo
};
//# sourceMappingURL=3-8-practice.js.map
