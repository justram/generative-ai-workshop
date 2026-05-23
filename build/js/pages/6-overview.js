import "../chunks/chunk-5F3NW7E5.js";
import {
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  getCurrentLanguage,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/6-overview.js
var s = (e, t2) => getCurrentLanguage() === "en" ? e : t2;
var a = class extends m {
  constructor(...e) {
    super(...e);
    this.headerTitle = i18n(`\u81EA\u67B6 LLM\uFF1A\u5148\u5224\u65B7\u503C\u4E0D\u503C\u5F97`);
    this.sectionId = `6.0`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return b`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="overview"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="mb-3 text-sm font-bold text-foreground">${s(`When is it worth studying further?`, `\u4EC0\u9EBC\u6642\u5019\u503C\u5F97\u5F80\u4E0B\u7814\u7A76\uFF1F`)}</div>
						<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The data cannot leave`, `\u8CC7\u6599\u51FA\u4E0D\u53BB`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`For example: customer data, unreleased R&D documents, internal knowledge bases, or compliance rules that cannot be handed to an external service.`, `\u4F8B\u5982\u5BA2\u6236\u8CC7\u6599\u3001\u672A\u516C\u958B\u7814\u767C\u6587\u4EF6\u3001\u5167\u90E8\u77E5\u8B58\u5EAB\u6216\u6CD5\u898F\u8981\u6C42\u4E0D\u80FD\u4EA4\u7D66\u5916\u90E8\u670D\u52D9\u3002`)}</div>
							</div>
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The task is fixed and high-volume`, `\u4EFB\u52D9\u56FA\u5B9A\u53C8\u5927\u91CF`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Repeated daily summarization, classification, support drafts, or internal search are where cost can start to amortize.`, `\u6BCF\u5929\u91CD\u8907\u8DD1\u540C\u4E00\u985E\u6458\u8981\u3001\u5206\u985E\u3001\u5BA2\u670D\u8349\u7A3F\u6216\u5167\u90E8\u641C\u5C0B\uFF0C\u624D\u6709\u6A5F\u6703\u628A\u6210\u672C\u6524\u5E73\u3002`)}</div>
							</div>
							<div class="native-decision-row px-3 py-3">
								<div class="font-semibold text-foreground">${s(`You need control over the environment`, `\u9700\u8981\u638C\u63E1\u74B0\u5883`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Self-hosting becomes worth studying when you need control over versions, latency, deployment location, permissions, and monitoring.`, `\u60F3\u63A7\u5236\u7248\u672C\u3001\u5EF6\u9072\u3001\u90E8\u7F72\u4F4D\u7F6E\u3001\u6B0A\u9650\u8207\u76E3\u63A7\u6642\uFF0C\u81EA\u67B6\u624D\u958B\u59CB\u6709\u7814\u7A76\u50F9\u503C\u3002`)}</div>
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
a = __decorate([t(`self-hosting-overview`)], a);
document.body.innerHTML = `<self-hosting-overview></self-hosting-overview>`;
export {
  a as SelfHostingOverviewDemo
};
//# sourceMappingURL=6-overview.js.map
