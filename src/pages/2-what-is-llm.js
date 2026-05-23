import { __decorate as e, i18n as t, t$1 as n, x as r } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock-SUyIenKs.js";
import "../workshop-runtime/app-C9nW8ndw.js";
import "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as i } from "../workshop-runtime/DemoBase-7724hyNv.js";
let a = class extends i {
  constructor(...e) {
    (super(...e),
      (this.headerTitle = t(`What is a Large Language Model?`)),
      (this.sectionId = `2`),
      (this.sectionMode = `subtree`),
      (this.iframeUrl = `https://excalidraw.com`));
  }
  renderContentPanel() {
    return r`<iframe src="${this.iframeUrl}" class="w-full h-full border-0" title="${t(`Interactive Demo`)}"></iframe>`;
  }
  renderRightDemoPanel() {
    return r`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
		</div>`;
  }
};
((a = e([n(`what-is-llm-demo`)], a)),
  (document.body.innerHTML = `<what-is-llm-demo></what-is-llm-demo>`));
export { a as WhatIsLLMDemo };
