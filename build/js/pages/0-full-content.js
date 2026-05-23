import {
  m
} from "../chunks/chunk-737EQ6X6.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/0-full-content.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`Complete Workshop Content`), this.sectionId = `*`;
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
a = __decorate([t(`full-content-demo`)], a);
var o = document.createElement(`full-content-demo`);
document.body.appendChild(o);
export {
  a as FullContentDemo
};
//# sourceMappingURL=0-full-content.js.map
