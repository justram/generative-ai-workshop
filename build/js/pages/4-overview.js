import {
  m
} from "../chunks/chunk-737EQ6X6.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/4-overview.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`\u63D0\u793A\u6280\u5DE7\u7E3D\u89BD`), this.sectionId = `4`, this.sectionMode = `single`;
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
a = __decorate([t(`prompting-overview`)], a), document.body.innerHTML = `<prompting-overview></prompting-overview>`;
export {
  a as PromptingOverview
};
//# sourceMappingURL=4-overview.js.map
