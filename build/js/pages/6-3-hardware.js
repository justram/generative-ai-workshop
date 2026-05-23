import "../chunks/chunk-5F3NW7E5.js";
import {
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/6-3-hardware.js
var a = class extends m {
  constructor(...e) {
    super(...e);
    this.headerTitle = i18n(`\u786C\u9AD4\uFF1A\u80FD\u4E0D\u80FD\u8DD1\uFF0C\u4E0D\u53EA\u770B\u986F\u5361\u540D\u5B57`);
    this.sectionId = `6.3`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return b`<div class="flex-1 overflow-y-auto h-full"><div class="native-section-stack max-w-5xl mx-auto p-6"><self-hosting-lab variant="hardware"></self-hosting-lab></div></div>`;
  }
  articleContent() {
    return (this.sectionContent ?? ``).replace(/^#{2,4}\s+6\.\d+[^\n]*\n+/, ``);
  }
};
a = __decorate([t(`hardware-demo`)], a);
document.body.innerHTML = `<hardware-demo></hardware-demo>`;
export {
  a as HardwareDemo
};
//# sourceMappingURL=6-3-hardware.js.map
