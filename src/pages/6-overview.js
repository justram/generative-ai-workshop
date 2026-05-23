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
    this.headerTitle = t(`自架 LLM：先判斷值不值得`);
    this.sectionId = `6.0`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return r`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="overview"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="mb-3 text-sm font-bold text-foreground">${s(`When is it worth studying further?`, `什麼時候值得往下研究？`)}</div>
						<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The data cannot leave`, `資料出不去`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`For example: customer data, unreleased R&D documents, internal knowledge bases, or compliance rules that cannot be handed to an external service.`, `例如客戶資料、未公開研發文件、內部知識庫或法規要求不能交給外部服務。`)}</div>
							</div>
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The task is fixed and high-volume`, `任務固定又大量`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Repeated daily summarization, classification, support drafts, or internal search are where cost can start to amortize.`, `每天重複跑同一類摘要、分類、客服草稿或內部搜尋，才有機會把成本攤平。`)}</div>
							</div>
							<div class="native-decision-row px-3 py-3">
								<div class="font-semibold text-foreground">${s(`You need control over the environment`, `需要掌握環境`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Self-hosting becomes worth studying when you need control over versions, latency, deployment location, permissions, and monitoring.`, `想控制版本、延遲、部署位置、權限與監控時，自架才開始有研究價值。`)}</div>
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
a = e([n(`self-hosting-overview`)], a);
document.body.innerHTML = `<self-hosting-overview></self-hosting-overview>`;
export { a as SelfHostingOverviewDemo };
