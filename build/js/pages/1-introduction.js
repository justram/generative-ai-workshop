import {
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/1-introduction.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`What this workshop is and isn't`), this.sectionId = `1`, this.sectionMode = `subtree`;
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
a = __decorate([t(`introduction-demo`)], a);
var o = document.createElement(`introduction-demo`);
document.body.appendChild(o);
export {
  a as IntroductionDemo
};
//# sourceMappingURL=1-introduction.js.map
