import {
  m
} from "../chunks/chunk-FCZIHEE4.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-4L3FZKEY.js";

// src/pages/5-7-key-takeaways.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`AI \u4EE3\u7406\u4EBA\uFF1A\u91CD\u9EDE\u6574\u7406`), this.sectionId = `5.7`;
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
a = __decorate([t(`agents-key-takeaways`)], a), document.body.innerHTML = `<agents-key-takeaways></agents-key-takeaways>`;
export {
  a as AgentsKeyTakeaways
};
//# sourceMappingURL=5-7-key-takeaways.js.map
