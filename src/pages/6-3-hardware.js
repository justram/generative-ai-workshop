import { __decorate as e, i18n as t, t$1 as n, x as r } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import "../workshop-runtime/AgentRuntime.js";
import "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import "../workshop-runtime/SelfHostingLab.js";
import { DemoBase as i } from "../workshop-runtime/DemoBase.js";

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
