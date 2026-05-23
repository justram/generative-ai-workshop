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
    this.headerTitle = t(`Software stack: what else you need beyond the model`);
    this.sectionId = `6.2`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return r`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="stack"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="mb-3 text-sm font-bold text-foreground">${s(`What to take away`, `這頁要帶走的判斷`)}</div>
						<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`A model file is not a product`, `模型檔不是產品`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Model weights are raw material; you still need an inference engine to load them, run them, and handle memory and speed.`, `模型權重只是原料；還需要推論引擎把它載入、跑起來，並處理記憶體與速度。`)}</div>
							</div>
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The API is the boundary`, `API 是邊界`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`An OpenAI-compatible API may let an existing app connect by changing only baseURL/model, but features and stability still need testing.`, `OpenAI-compatible API 讓既有 app 可能只換 baseURL/model 就能接本機服務，但功能與穩定度仍要測。`)}</div>
							</div>
							<div class="native-decision-row px-3 py-3">
								<div class="font-semibold text-foreground">${s(`Production service needs operations`, `正式服務要維運`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`With multiple users, you need permissions, monitoring, logs, concurrency, restarts, model versions, and cost control. It is not just starting a server.`, `多人使用時，要處理權限、監控、日誌、併發、重啟、模型版本與成本，不是只把 server 跑起來。`)}</div>
							</div>
						</div>
					</div>
				</div>
			</div>
		`;
  }
  articleContent() {
    return (this.sectionContent ?? ``).replace(/^#{2,4}\s+6\.\d+[^\n]*\n+/, ``);
  }
};
a = e([n(`software-stack-demo`)], a);
document.body.innerHTML = `<software-stack-demo></software-stack-demo>`;
export { a as SoftwareStackDemo };
