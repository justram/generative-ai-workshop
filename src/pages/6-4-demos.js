import {
  __decorate as e,
  getCurrentLanguage as l,
  i18n as t,
  t$1 as n,
  x as r,
} from "../mini-lit/index.js";
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

const s = (e, t) => (l() === "en" ? e : t);

let a = class extends i {
  constructor(...e) {
    super(...e);
    this.headerTitle = t(`實作示範：不要只看有沒有回應`);
    this.sectionId = `6.4`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return r`<div class="flex-1 overflow-y-auto h-full"><div class="native-section-stack max-w-5xl mx-auto p-6"><self-hosting-lab variant="demos"></self-hosting-lab>${this.renderTakeaway()}</div></div>`;
  }
  renderTakeaway() {
    return r`<section class="native-demo-summary">
			<div class="native-demo-summary-kicker">${s(`Learning focus`, `學習重點`)}</div>
			<div class="native-demo-summary-title">${s(`Translate “it runs” into “can we use it?”`, `把「可以跑」翻譯成「能不能用」`)}</div>
			<div class="native-demo-summary-grid">
				<div>
					<div class="native-demo-summary-label">${s(`First run chat`, `先跑對話`)}</div>
					<p>${s(`Watch latency, follow-up questions, memory, and temperature to confirm local inference is a viable path.`, `看等待時間、連續追問、記憶體與溫度，確認本機推論這條路打得開。`)}</p>
				</div>
				<div>
					<div class="native-demo-summary-label">${s(`Then connect the API`, `再接 API`)}</div>
					<p>${s(`Confirm streaming, errors, timeouts, JSON output, and tool calls fit the existing product flow.`, `確認串流、錯誤、timeout、JSON 與工具呼叫能不能接進現有產品流程。`)}</p>
				</div>
				<div>
					<div class="native-demo-summary-label">${s(`Finally evaluate`, `最後評測`)}</div>
					<p>${s(`Compare GPT and the local model on your real tasks, especially the failures that are expensive to fix.`, `用自己的真實任務比較 GPT 與本機模型，特別留意高代價失敗。`)}</p>
				</div>
			</div>
		</section>`;
  }
};
a = e([n(`demos-demo`)], a);
document.body.innerHTML = `<demos-demo></demos-demo>`;
export { a as DemosDemo };
