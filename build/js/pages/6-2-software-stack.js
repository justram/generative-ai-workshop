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

// src/pages/6-2-software-stack.js
var s = (e, t2) => getCurrentLanguage() === "en" ? e : t2;
var a = class extends m {
  constructor(...e) {
    super(...e);
    this.headerTitle = i18n(`Software stack: what else you need beyond the model`);
    this.sectionId = `6.2`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return b`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="stack"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="mb-3 text-sm font-bold text-foreground">${s(`What to take away`, `\u9019\u9801\u8981\u5E36\u8D70\u7684\u5224\u65B7`)}</div>
						<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`A model file is not a product`, `\u6A21\u578B\u6A94\u4E0D\u662F\u7522\u54C1`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`Model weights are raw material; you still need an inference engine to load them, run them, and handle memory and speed.`, `\u6A21\u578B\u6B0A\u91CD\u53EA\u662F\u539F\u6599\uFF1B\u9084\u9700\u8981\u63A8\u8AD6\u5F15\u64CE\u628A\u5B83\u8F09\u5165\u3001\u8DD1\u8D77\u4F86\uFF0C\u4E26\u8655\u7406\u8A18\u61B6\u9AD4\u8207\u901F\u5EA6\u3002`)}</div>
							</div>
							<div class="native-decision-row border-b border-border px-3 py-3">
								<div class="font-semibold text-foreground">${s(`The API is the boundary`, `API \u662F\u908A\u754C`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`An OpenAI-compatible API may let an existing app connect by changing only baseURL/model, but features and stability still need testing.`, `OpenAI-compatible API \u8B93\u65E2\u6709 app \u53EF\u80FD\u53EA\u63DB baseURL/model \u5C31\u80FD\u63A5\u672C\u6A5F\u670D\u52D9\uFF0C\u4F46\u529F\u80FD\u8207\u7A69\u5B9A\u5EA6\u4ECD\u8981\u6E2C\u3002`)}</div>
							</div>
							<div class="native-decision-row px-3 py-3">
								<div class="font-semibold text-foreground">${s(`Production service needs operations`, `\u6B63\u5F0F\u670D\u52D9\u8981\u7DAD\u904B`)}</div>
								<div class="leading-6 text-muted-foreground">${s(`With multiple users, you need permissions, monitoring, logs, concurrency, restarts, model versions, and cost control. It is not just starting a server.`, `\u591A\u4EBA\u4F7F\u7528\u6642\uFF0C\u8981\u8655\u7406\u6B0A\u9650\u3001\u76E3\u63A7\u3001\u65E5\u8A8C\u3001\u4F75\u767C\u3001\u91CD\u555F\u3001\u6A21\u578B\u7248\u672C\u8207\u6210\u672C\uFF0C\u4E0D\u662F\u53EA\u628A server \u8DD1\u8D77\u4F86\u3002`)}</div>
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
a = __decorate([t(`software-stack-demo`)], a);
document.body.innerHTML = `<software-stack-demo></software-stack-demo>`;
export {
  a as SoftwareStackDemo
};
//# sourceMappingURL=6-2-software-stack.js.map
