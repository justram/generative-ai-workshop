import {
  m
} from "../chunks/chunk-QLBDILTC.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/2-what-is-llm.js
var a = class extends m {
  constructor(...e) {
    super(...e), this.headerTitle = i18n(`What is a Large Language Model?`), this.sectionId = `2`, this.sectionMode = `subtree`, this.iframeUrl = `https://excalidraw.com`;
  }
  renderContentPanel() {
    return b`<iframe src="${this.iframeUrl}" class="w-full h-full border-0" title="${i18n(`Interactive Demo`)}"></iframe>`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
a = __decorate([t(`what-is-llm-demo`)], a), document.body.innerHTML = `<what-is-llm-demo></what-is-llm-demo>`;
export {
  a as WhatIsLLMDemo
};
//# sourceMappingURL=2-what-is-llm.js.map
