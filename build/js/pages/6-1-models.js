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

// src/pages/6-1-models.js
var s = (e, t2) => getCurrentLanguage() === "en" ? e : t2;
var a = class extends m {
  constructor(...e) {
    super(...e);
    this.headerTitle = i18n(`Models: size, architecture, and memory budget`);
    this.sectionId = `6.1`;
    this.sectionMode = `single`;
  }
  renderContentPanel() {
    return b`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="models"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="flex items-center justify-between gap-3">
							<div class="text-sm font-bold text-foreground">${s(`Check these five things before choosing a model`, `\u9078\u6A21\u578B\u6642\u5148\u770B\u9019\u4E94\u4EF6\u4E8B`)}</div>
							<div class="text-xs text-muted-foreground">${s(`Higher on a leaderboard does not mean better for you`, `\u4E0D\u662F\u6392\u884C\u699C\u8D8A\u9AD8\u8D8A\u9069\u5408`)}</div>
						</div>
						<div class="mt-3 overflow-hidden rounded-lg border border-border bg-background/60">
							${[
      [
        "1",
        s(`Can you download the weights?`, `\u6B0A\u91CD\u80FD\u4E0D\u80FD\u4E0B\u8F09`),
        s(
          `Closed models are usually available only through websites or APIs. Open-weight models can run on your own hardware, but that does not mean the training data, code, or cleaning pipeline is public.`,
          `\u5C01\u9589\u6A21\u578B\u901A\u5E38\u53EA\u80FD\u900F\u904E\u7DB2\u7AD9\u6216 API \u4F7F\u7528\uFF1B\u958B\u653E\u6B0A\u91CD\u6A21\u578B\u53EF\u4EE5\u653E\u5230\u81EA\u5DF1\u7684\u8A2D\u5099\u4E0A\u8DD1\uFF0C\u4F46\u4E0D\u4E00\u5B9A\u4EE3\u8868\u8A13\u7DF4\u8CC7\u6599\u3001\u7A0B\u5F0F\u8207\u6E05\u7406\u6D41\u7A0B\u90FD\u516C\u958B\u3002`
        )
      ],
      [
        "2",
        s(`Treat Dense and MoE separately`, `Dense \u548C MoE \u5206\u958B\u770B`),
        s(
          `For dense models, total parameters roughly track per-token compute. For MoE, separate total weights from active parameters. Looking only at 35B or 284B can misjudge speed and cost.`,
          `Dense \u7684\u7E3D\u53C3\u6578\u5927\u81F4\u5C31\u662F\u6BCF token \u7684\u8A08\u7B97\u91CF\uFF1BMoE \u9084\u8981\u5206\u6210\u7E3D\u6B0A\u91CD\u8207\u555F\u7528\u53C3\u6578\u3002\u53EA\u770B 35B\u3001284B \u6703\u8AA4\u5224\u901F\u5EA6\u8207\u6210\u672C\u3002`
        )
      ],
      [
        "3",
        s(`Where does memory go?`, `\u8A18\u61B6\u9AD4\u5403\u5728\u54EA\u88E1`),
        s(
          `Total weights affect the model body, quantization bits affect weight precision, and longer context increases KV cache. MoE saves per-token compute; it does not make all weights disappear.`,
          `\u7E3D\u6B0A\u91CD\u5F71\u97FF\u6A21\u578B\u672C\u9AD4\uFF0C\u91CF\u5316\u4F4D\u5143\u5F71\u97FF\u6BCF\u500B\u6B0A\u91CD\u591A\u7CBE\u7D30\uFF0C\u4E0A\u4E0B\u6587\u9577\u5EA6\u6703\u589E\u52A0 KV cache\u3002MoE \u7701\u7684\u662F\u6BCF token \u8A08\u7B97\u91CF\uFF0C\u4E0D\u662F\u628A\u5168\u90E8\u6B0A\u91CD\u8B8A\u4E0D\u898B\u3002`
        )
      ],
      [
        "4",
        s(`Do the task and license fit?`, `\u4EFB\u52D9\u8207\u6388\u6B0A\u662F\u5426\u5408\u9069`),
        s(
          `Do not look only at leaderboards or download counts. Check Chinese capability, commercial license, tool support, safety notes, and whether the community is actually using it in practice.`,
          `\u4E0D\u8981\u53EA\u770B\u6392\u884C\u699C\u6216\u4E0B\u8F09\u6578\u3002\u8981\u770B\u4E2D\u6587\u80FD\u529B\u3001\u5546\u7528\u6388\u6B0A\u3001\u5DE5\u5177\u652F\u63F4\u3001\u5B89\u5168\u6CE8\u610F\u4E8B\u9805\uFF0C\u4EE5\u53CA\u793E\u7FA4\u662F\u5426\u771F\u7684\u5728\u5BE6\u52D9\u4F7F\u7528\u3002`
        )
      ],
      [
        "5",
        s(`Learn to read Hugging Face model cards`, `Hugging Face \u6A21\u578B\u5361\u8981\u6703\u8B80`),
        s(
          `Before downloading, check total / active params, context length, quantization format, VRAM needs, and usage restrictions. These matter more than whether a model looks new.`,
          `\u4E0B\u8F09\u524D\u78BA\u8A8D total / active params\u3001context length\u3001\u91CF\u5316\u683C\u5F0F\u3001\u9700\u8981\u591A\u5C11 VRAM\u3001\u6709\u6C92\u6709\u4F7F\u7528\u9650\u5236\u3002\u9019\u4E9B\u6BD4\u300C\u6A21\u578B\u770B\u8D77\u4F86\u5F88\u65B0\u300D\u66F4\u91CD\u8981\u3002`
        )
      ]
    ].map(
      ([number, title, body]) => b`
								<div class="native-decision-row border-b border-border px-3 py-3 last:border-b-0">
									<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
										<span class="grid h-5 w-5 place-items-center rounded-md bg-muted text-[11px] text-muted-foreground">${number}</span>
										<span>${title}</span>
									</div>
									<div class="text-sm leading-6 text-muted-foreground">${body}</div>
								</div>
							`
    )}
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
a = __decorate([t(`models-demo`)], a);
document.body.innerHTML = `<models-demo></models-demo>`;
export {
  a as ModelsDemo
};
//# sourceMappingURL=6-1-models.js.map
