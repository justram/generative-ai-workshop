import { __decorate as e, i18n as t, r as n, t$1 as r, x as i } from "./ThemeToggle-zh-tw7.js?v=proper-i18n-1";
import "./CodeBlock-SUyIenKs.js?v=msg-placeholder-1";
import { AgentInterface as a } from "./app-C9nW8ndw.js";
import { Badge as o, Card as s, CardContent as c, CardHeader as l, CardTitle as u } from "./Textarea-DCZnYrSo.js";
import "./Dialog-C7MHz9Dg.js";
import "./Input-0pADT9gU.js";
import { getAuthToken as d } from "./auth-token-Dkh_JH49.js";
import "./MarkdownBlock-CNBIWDl3.js";
import "./mini-zh-tw7.js?v=proper-i18n-1";
import { DemoBase as f } from "./DemoBase-7724hyNv.js";
import "./proxy-client-DO8A5rUF.js";
import { AgentSession as p } from "./agent-session-CtmWvP9t.js";

let m = class extends f {
	constructor() {
		super();
		this.headerTitle = t(`上下文視窗`);
		this.sectionId = `3.3`;
		this.maxContextTokens = 200;
		this.droppedMessages = [];
		this.actualMessages = [];
		this.currentTokens = { input: 0, output: 0 };
		this.messagesToSkip = 0;
		this.session = new p({
			messagePreprocessor: async e => {
				this.recomputeWindow(e);
				return e.slice(this.messagesToSkip);
			},
			authTokenProvider: d,
		});
		const e = [
			{ role: `user`, content: [{ type: `text`, text: t(`我叫 Mario。你今天好嗎？`) }] },
			{
				role: `assistant`,
				content: [{ type: `text`, text: t(`Mario 你好！很高興認識你。我很好，謝謝關心！你今天過得如何？`) }],
				api: `openai-codex-responses`,
				provider: `openai-codex`,
				model: `gpt-5.4-mini`,
				usage: { input: 12, output: 14, cacheRead: 0, cacheWrite: 0, cost: { cacheRead: 0, cacheWrite: 0, input: 0, output: 0, total: 0 } },
				stopReason: `stop`,
			},
		];
		this.session.replaceMessages(e);
		this.recomputeWindow(e);
		this.agentInterface = new a();
		this.agentInterface.session = this.session;
		this.agentInterface.enableAttachments = false;
		this.agentInterface.enableModelSelector = false;
		this.agentInterface.enableThinking = false;
		this.agentInterface.style.width = `100%`;
		this.agentInterface.style.height = `100%`;
		this.agentInterface.setInput(t(`你可以告訴我哪些關於量子運算的事？`));
		this.unsubscribe = this.session.subscribe(e => {
			if (e.type !== `state-update`) return;
			this.recomputeWindow(e.state.messages);
		});
	}

	estimateMessageTokens(e) {
		const n = this.getMessageText(e);
		const r = e.role === `assistant` ? 4 : 3;
		const i = Array.from(n).length;
		const a = n.trim() ? n.trim().split(/\s+/u).length : 0;
		// Mixed zh-TW/English text has fewer spaces than English. This rough estimator
		// is intentionally visible and deterministic for the teaching demo.
		return Math.max(1, Math.ceil(i / 2.2), a) + r;
	}

	recomputeWindow(e) {
		let n = e.slice(this.messagesToSkip);
		let r = n.reduce((e, n) => e + this.estimateMessageTokens(n), 0);
		while (r > this.maxContextTokens && n.length > 2 && this.messagesToSkip < e.length - 2) {
			this.messagesToSkip += 2;
			n = e.slice(this.messagesToSkip);
			r = n.reduce((e, n) => e + this.estimateMessageTokens(n), 0);
		}
		this.droppedMessages = e.slice(0, this.messagesToSkip);
		this.actualMessages = n;
		this.currentTokens = { input: r, output: 0 };
	}

	getMessageText(e) {
		if (typeof e.content === `string`) return e.content;
		if (Array.isArray(e.content)) {
			return e.content
				.filter(e => e.type === `text`)
				.map(e => e.text || ``)
				.join(` `);
		}
		return ``;
	}

	renderContentPanel() {
		return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
	}

	renderLeftDemoPanel() {
		const e = this.currentTokens.input + this.currentTokens.output;
		const n = Math.min((e / this.maxContextTokens) * 100, 100);
		return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${t(`先送幾則訊息，再問「我叫什麼名字？」觀察上下文塞滿後，較早的訊息如何被移出模型這一輪看得到的範圍。`)}
				</p>
				${s(i`
					${l(u(t(`上下文視窗`)))}
					${c(i`
						<div class="mb-2 flex items-baseline justify-between">
							<span class="text-3xl font-light">${e}</span>
							<span class="text-sm text-muted-foreground">/ ${this.maxContextTokens}</span>
						</div>
						<div class="text-xs text-muted-foreground mb-2">
							${t(`估算目前仍在上下文中的訊息 token；送出更多訊息時會累積，超過上限後會丟掉最早的對話。`)}
						</div>
						<div class="w-full bg-muted rounded-full h-1 overflow-hidden">
							<div
								class="h-full transition-all duration-500 ease-out ${n > 90 ? `bg-red-500` : n > 70 ? `bg-amber-500` : `bg-emerald-500/80`}"
								style="width: ${n}%"
							></div>
						</div>
					`)}
				`)}
				${this.droppedMessages.length > 0
					? s(i`
							${l(u(i`<div class="flex flex-row gap-2">
										${t(`已移出上下文`)} ${o(String(this.droppedMessages.length), `secondary`, `ml-2`)}
									</div>`))}
							${c(i`${this.droppedMessages.map(e => i`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e.role === `user` ? t(`User`) : e.role === `assistant` ? t(`Assistant`) : e.role}</div>
											<div class="text-xs text-muted-foreground line-through opacity-60 mt-0.5">
												${this.getMessageText(e).substring(0, 80)}${this.getMessageText(e).length > 80 ? `...` : ``}
											</div>
										</div>
									`)}`)}
						`)
					: i``}
				${s(i`
					${l(u(i`${t(`In Context`)} ${o(String(this.actualMessages.length), `secondary`, `ml-2`)}`))}
					${c(i`${this.actualMessages.length > 0
						? this.actualMessages.map(e => i`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e.role === `user` ? t(`User`) : e.role === `assistant` ? t(`Assistant`) : e.role}</div>
											<div class="text-xs mt-0.5">
												${this.getMessageText(e).substring(0, 80)}${this.getMessageText(e).length > 80 ? `...` : ``}
											</div>
										</div>
									`)
						: i`<div class="text-sm text-muted-foreground">
									${t(`Messages will appear here as the conversation grows`)}
								</div>`}`)}
				`)}
			</div>
		`;
	}

	renderRightDemoPanel() {
		return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
	}

	disconnectedCallback() {
		super.disconnectedCallback();
		this.unsubscribe?.();
	}
};

e([n()], m.prototype, `maxContextTokens`, void 0);
e([n()], m.prototype, `droppedMessages`, void 0);
e([n()], m.prototype, `actualMessages`, void 0);
e([n()], m.prototype, `currentTokens`, void 0);
e([n()], m.prototype, `messagesToSkip`, void 0);
m = e([r(`context-window-demo`)], m);
document.body.innerHTML = `<context-window-demo></context-window-demo>`;
export { m as ContextWindowDemo };
