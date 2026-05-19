import { __decorate as e, getCurrentLanguage as l, i18n as t, t$1 as n, x as r } from "./ThemeToggle-zh-tw7.js?v=proper-i18n-1";
import "./CodeBlock-SUyIenKs.js?v=msg-placeholder-1";
import "./app-C9nW8ndw.js";
import "./Textarea-DCZnYrSo.js";
import "./Dialog-C7MHz9Dg.js";
import "./Input-0pADT9gU.js";
import "./auth-token-Dkh_JH49.js";
import "./MarkdownBlock-CNBIWDl3.js";
import "./mini-zh-tw7.js?v=proper-i18n-1";
import "./self-hosting-lab.js?v=i18n-lab-3";
import { DemoBase as i } from "./DemoBase-7724hyNv.js";

const s = (e, t) => l() === "en" ? e : t;

let a = class extends i {
	constructor(...e) {
		super(...e);
		this.headerTitle = t(`Models: size, architecture, and memory budget`);
		this.sectionId = `6.1`;
		this.sectionMode = `single`;
	}
	renderContentPanel() {
		return r`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="native-section-stack max-w-5xl mx-auto p-6">
					<self-hosting-lab variant="models"></self-hosting-lab>
					<div class="rounded-lg border border-border bg-card p-4">
						<div class="flex items-center justify-between gap-3">
							<div class="text-sm font-bold text-foreground">${s(`Check these five things before choosing a model`, `選模型時先看這五件事`)}</div>
							<div class="text-xs text-muted-foreground">${s(`Higher on a leaderboard does not mean better for you`, `不是排行榜越高越適合`)}</div>
						</div>
						<div class="mt-3 overflow-hidden rounded-lg border border-border bg-background/60">
							${[
								["1", s(`Can you download the weights?`, `權重能不能下載`), s(`Closed models are usually available only through websites or APIs. Open-weight models can run on your own hardware, but that does not mean the training data, code, or cleaning pipeline is public.`, `封閉模型通常只能透過網站或 API 使用；開放權重模型可以放到自己的設備上跑，但不一定代表訓練資料、程式與清理流程都公開。`)],
								["2", s(`Treat Dense and MoE separately`, `Dense 和 MoE 分開看`), s(`For dense models, total parameters roughly track per-token compute. For MoE, separate total weights from active parameters. Looking only at 35B or 284B can misjudge speed and cost.`, `Dense 的總參數大致就是每 token 的計算量；MoE 還要分成總權重與啟用參數。只看 35B、284B 會誤判速度與成本。`)],
								["3", s(`Where does memory go?`, `記憶體吃在哪裡`), s(`Total weights affect the model body, quantization bits affect weight precision, and longer context increases KV cache. MoE saves per-token compute; it does not make all weights disappear.`, `總權重影響模型本體，量化位元影響每個權重多精細，上下文長度會增加 KV cache。MoE 省的是每 token 計算量，不是把全部權重變不見。`)],
								["4", s(`Do the task and license fit?`, `任務與授權是否合適`), s(`Do not look only at leaderboards or download counts. Check Chinese capability, commercial license, tool support, safety notes, and whether the community is actually using it in practice.`, `不要只看排行榜或下載數。要看中文能力、商用授權、工具支援、安全注意事項，以及社群是否真的在實務使用。`)],
								["5", s(`Learn to read Hugging Face model cards`, `Hugging Face 模型卡要會讀`), s(`Before downloading, check total / active params, context length, quantization format, VRAM needs, and usage restrictions. These matter more than whether a model looks new.`, `下載前確認 total / active params、context length、量化格式、需要多少 VRAM、有沒有使用限制。這些比「模型看起來很新」更重要。`)],
							].map(([number, title, body]) => r`
								<div class="native-decision-row border-b border-border px-3 py-3 last:border-b-0">
									<div class="flex items-center gap-2 text-sm font-semibold text-foreground">
										<span class="grid h-5 w-5 place-items-center rounded-md bg-muted text-[11px] text-muted-foreground">${number}</span>
										<span>${title}</span>
									</div>
									<div class="text-sm leading-6 text-muted-foreground">${body}</div>
								</div>
							`)}
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
a = e([n(`models-demo`)], a);
document.body.innerHTML = `<models-demo></models-demo>`;
export { a as ModelsDemo };
