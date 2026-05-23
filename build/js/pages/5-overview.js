import {
  m
} from "../chunks/chunk-QLBDILTC.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/5-overview.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`AI \u4EE3\u7406\u4EBA\uFF1A\u8B93\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u4F7F\u7528\u5DE5\u5177`), this.sectionId = `5`, this.sectionMode = `subtree`;
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
a = __decorate([t(`agents-overview`)], a), document.body.innerHTML = `<agents-overview></agents-overview>`;
export {
  a as AgentsOverviewDemo
};
//# sourceMappingURL=5-overview.js.map
