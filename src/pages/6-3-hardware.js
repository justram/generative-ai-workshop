import { __decorate as e, i18n as t, t$1 as n, x as r } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock-SUyIenKs.js";
import "../workshop-runtime/app-C9nW8ndw.js";
import "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import "../workshop-runtime/self-hosting-lab.js";
import { DemoBase as i } from "../workshop-runtime/DemoBase-7724hyNv.js";

let a = class extends i {
  constructor(...e) {
    super(...e);
    this.headerTitle = t(`硬體：能不能跑，不只看顯卡名字`);
    this.sectionId = `6.3`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return r`<div class="flex-1 overflow-y-auto h-full"><div class="native-section-stack max-w-5xl mx-auto p-6"><self-hosting-lab variant="hardware"></self-hosting-lab></div></div>`;
  }
  articleContent() {
    return (this.sectionContent ?? ``).replace(/^#{2,4}\s+6\.\d+[^\n]*\n+/, ``);
  }
};
a = e([n(`hardware-demo`)], a);
document.body.innerHTML = `<hardware-demo></hardware-demo>`;
export { a as HardwareDemo };
