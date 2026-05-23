import {
  m
} from "../chunks/chunk-737EQ6X6.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/7-where-to-go.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`\u63A5\u4E0B\u4F86\u53EF\u4EE5\u5F80\u54EA\u88E1\u8D70`), this.sectionId = `7`, this.sectionMode = `subtree`;
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
a = __decorate([t(`where-to-go-demo`)], a);
var o = document.createElement(`where-to-go-demo`);
document.body.appendChild(o);
export {
  a as WhereToGoDemo
};
//# sourceMappingURL=7-where-to-go.js.map
