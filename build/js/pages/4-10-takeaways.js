import {
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/4-10-takeaways.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`\u63D0\u793A\u6280\u5DE7\u91CD\u9EDE\u6574\u7406`), this.sectionId = `4.10`;
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
a = __decorate([t(`takeaways-demo`)], a), document.body.innerHTML = `<takeaways-demo></takeaways-demo>`;
export {
  a as TakeawaysDemo
};
//# sourceMappingURL=4-10-takeaways.js.map
