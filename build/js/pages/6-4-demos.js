import "../chunks/chunk-HCMUFQYY.js";
import {
  m
} from "../chunks/chunk-QLBDILTC.js";
import {
  __decorate,
  b,
  getCurrentLanguage,
  i18n,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/6-4-demos.js
var s = (e, t2) => getCurrentLanguage() === "en" ? e : t2;
var a = class extends m {
  constructor(...e) {
    super(...e);
    this.headerTitle = i18n(`\u5BE6\u4F5C\u793A\u7BC4\uFF1A\u4E0D\u8981\u53EA\u770B\u6709\u6C92\u6709\u56DE\u61C9`);
    this.sectionId = `6.4`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return b`<div class="flex-1 overflow-y-auto h-full"><div class="native-section-stack max-w-5xl mx-auto p-6"><self-hosting-lab variant="demos"></self-hosting-lab>${this.renderTakeaway()}</div></div>`;
  }
  renderTakeaway() {
    return b`<section class="native-demo-summary">
			<div class="native-demo-summary-kicker">${s(`Learning focus`, `\u5B78\u7FD2\u91CD\u9EDE`)}</div>
			<div class="native-demo-summary-title">${s(`Translate \u201Cit runs\u201D into \u201Ccan we use it?\u201D`, `\u628A\u300C\u53EF\u4EE5\u8DD1\u300D\u7FFB\u8B6F\u6210\u300C\u80FD\u4E0D\u80FD\u7528\u300D`)}</div>
			<div class="native-demo-summary-grid">
				<div>
					<div class="native-demo-summary-label">${s(`First run chat`, `\u5148\u8DD1\u5C0D\u8A71`)}</div>
					<p>${s(`Watch latency, follow-up questions, memory, and temperature to confirm local inference is a viable path.`, `\u770B\u7B49\u5F85\u6642\u9593\u3001\u9023\u7E8C\u8FFD\u554F\u3001\u8A18\u61B6\u9AD4\u8207\u6EAB\u5EA6\uFF0C\u78BA\u8A8D\u672C\u6A5F\u63A8\u8AD6\u9019\u689D\u8DEF\u6253\u5F97\u958B\u3002`)}</p>
				</div>
				<div>
					<div class="native-demo-summary-label">${s(`Then connect the API`, `\u518D\u63A5 API`)}</div>
					<p>${s(`Confirm streaming, errors, timeouts, JSON output, and tool calls fit the existing product flow.`, `\u78BA\u8A8D\u4E32\u6D41\u3001\u932F\u8AA4\u3001timeout\u3001JSON \u8207\u5DE5\u5177\u547C\u53EB\u80FD\u4E0D\u80FD\u63A5\u9032\u73FE\u6709\u7522\u54C1\u6D41\u7A0B\u3002`)}</p>
				</div>
				<div>
					<div class="native-demo-summary-label">${s(`Finally evaluate`, `\u6700\u5F8C\u8A55\u6E2C`)}</div>
					<p>${s(`Compare GPT and the local model on your real tasks, especially the failures that are expensive to fix.`, `\u7528\u81EA\u5DF1\u7684\u771F\u5BE6\u4EFB\u52D9\u6BD4\u8F03 GPT \u8207\u672C\u6A5F\u6A21\u578B\uFF0C\u7279\u5225\u7559\u610F\u9AD8\u4EE3\u50F9\u5931\u6557\u3002`)}</p>
				</div>
			</div>
		</section>`;
  }
};
a = __decorate([t(`demos-demo`)], a);
document.body.innerHTML = `<demos-demo></demos-demo>`;
export {
  a as DemosDemo
};
//# sourceMappingURL=6-4-demos.js.map
