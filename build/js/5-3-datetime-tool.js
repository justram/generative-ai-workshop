import { Button, __decorate, i18n, r, t$1, x } from "./ThemeToggle-zh-tw7.js?v=proper-i18n-1";
import "./CodeBlock-SUyIenKs.js?v=msg-placeholder-1";
import { AgentInterface, getModel } from "./app-C9nW8ndw.js?v=toolfix2";
import { getAuthToken } from "./auth-token-Dkh_JH49.js";
import "./MarkdownBlock-CNBIWDl3.js";
import "./mini-zh-tw7.js?v=proper-i18n-1";
import { DemoBase } from "./DemoBase-7724hyNv.js?v=section5-datetime-contract1";
import "./proxy-client-DO8A5rUF.js";
import { AgentSession } from "./agent-session-CtmWvP9t.js";

let DateTimeToolDemo = class extends DemoBase {
	constructor() {
		super();
		this.headerTitle = i18n(`日期／時間工具：模型查不到「現在」`);
		this.sectionId = `5.3`;
		this.mode = `intro`;
		this.isRunning = false;
		this.pipelineStage = `idle`;
		this.liveTimezone = ``;
		this.localTimeResult = ``;
		this.finalAnswer = ``;
		this.currentQuestion = null;
		this.dateQuestions = [
			{
				label: i18n(`今天星期幾？`),
				prompt: i18n(`請用台北時間回答：今天星期幾？請說明你用的是哪個時區。`),
				description: i18n(`需要目前日期`),
				defaultTimezone: `Asia/Taipei`,
				kind: `weekday`,
			},
			{
				label: i18n(`距離月底還有幾天？`),
				prompt: i18n(`請用台北時間回答：距離這個月底還有幾天？請說明你的計算基準日期。`),
				description: i18n(`相對日期會變動`),
				defaultTimezone: `Asia/Taipei`,
				kind: `month-end`,
			},
			{
				label: i18n(`現在 UTC 時間是幾點？`),
				prompt: i18n(`現在 UTC 時間是幾點？請用 24 小時制回答。`),
				description: i18n(`時區細節`),
				defaultTimezone: `UTC`,
				kind: `utc`,
			},
		];
		this.session = new AgentSession({ authTokenProvider: getAuthToken });
		this.session.setModel(getModel(`openai-codex`, `gpt-5.4-mini`));
		this.configureSession(false);
		this.agentInterface = new AgentInterface();
		this.agentInterface.session = this.session;
		this.agentInterface.enableAttachments = false;
		this.agentInterface.enableModelSelector = true;
		this.agentInterface.enableThinking = false;
		this.agentInterface.showDebugToggle = false;
		this.agentInterface.style.width = `100%`;
		this.agentInterface.style.height = `100%`;
	}

	configureSession(useTool) {
		this.pipelineStage = `idle`;
		this.liveTimezone = ``;
		this.localTimeResult = ``;
		this.finalAnswer = ``;
		this.session.setTools([]);
		this.session.setSystemPrompt(
			useTool
				? `你是一位謹慎的助教。不要回答問題本身。請判斷要查哪個時區，並只輸出 JSON 物件，格式只能是 {"timezone":"IANA 時區或 UTC"}。例如 {"timezone":"Asia/Taipei"} 或 {"timezone":"UTC"}。`
				: `你是一位樂於助人的助教。你沒有目前日期與時間的即時資訊。遇到今天、現在、月底、星期、時區或相對日期問題時，請誠實說你需要目前時間才能精確回答，不要猜日期。`,
		);
		this.session.clearMessages();
	}

	async runQuestion(question, useTool) {
		if (this.isRunning) return;
		this.isRunning = true;
		this.currentQuestion = question;
		this.mode = useTool ? `tool` : `no-tool`;
		this.configureSession(useTool);
		await this.updateComplete;
		if (useTool) this.pipelineStage = `model`;
		if (!useTool) {
			const run = this.agentInterface.sendMessage(question.prompt).catch(() => {});
			await run;
			this.isRunning = false;
			return;
		}
		this.session.appendMessage({ role: `user`, content: [{ type: `text`, text: question.prompt }], timestamp: Date.now() });
		const plannerSession = new AgentSession({ authTokenProvider: getAuthToken });
		plannerSession.setModel(this.session.state.model ?? getModel(`openai-codex`, `gpt-5.4-mini`));
		plannerSession.setTools([]);
		plannerSession.setSystemPrompt(`你是一位謹慎的助教。不要回答問題本身。請判斷要查哪個時區，並只輸出 JSON 物件，格式只能是 {"timezone":"IANA 時區或 UTC"}。例如 {"timezone":"Asia/Taipei"} 或 {"timezone":"UTC"}。`);
		const run = plannerSession.prompt(question.prompt).catch(() => {});
		const timezone = await this.waitForTimezone(question.defaultTimezone, plannerSession);
		this.liveTimezone = timezone;
		this.pipelineStage = `detected`;
		await new Promise((resolve) => setTimeout(resolve, 300));
		plannerSession.abort();
		await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 1000))]);
		this.removeAbortedPlaceholders();
		this.clearModelStreamUi();
		this.pipelineStage = `reading-clock`;
		await new Promise((resolve) => setTimeout(resolve, 300));
		this.appendLocalTimeResult(question, timezone);
		this.removeAbortedPlaceholders();
		this.clearModelStreamUi();
		setTimeout(() => {
			this.removeAbortedPlaceholders();
			this.clearModelStreamUi();
		}, 1200);
		this.isRunning = false;
		this.requestUpdate();
	}

	extractTimezoneFromMessages(session = this.session) {
		const messages = session.state.messages;
		const streamMessage = session.state.streamMessage;
		const candidates = streamMessage ? [...messages, streamMessage] : messages;
		for (const message of [...candidates].reverse()) {
			if (message.role !== `assistant`) continue;
			const text = message.content
				?.filter((part) => part.type === `text`)
				.map((part) => part.text)
				.join(`\n`);
			if (!text) continue;
			const jsonMatch = text.match(/\{[\s\S]*"timezone"\s*:\s*"([^"]+)"[\s\S]*\}/);
			if (jsonMatch?.[1]) return jsonMatch[1];
			const partialJsonMatch = text.match(/"timezone"\s*:\s*"([^"]+)"/);
			if (partialJsonMatch?.[1]) return partialJsonMatch[1];
			if (/UTC/i.test(text)) return `UTC`;
			if (/Taipei|台北|臺北|Taiwan|台灣|臺灣/i.test(text)) return `Asia/Taipei`;
		}
		return undefined;
	}

	async waitForTimezone(fallback, session = this.session) {
		for (let attempt = 0; attempt < 100; attempt += 1) {
			const timezone = this.extractTimezoneFromMessages(session);
			if (timezone) {
				this.liveTimezone = timezone;
				this.requestUpdate();
				return timezone;
			}
			await new Promise((resolve) => setTimeout(resolve, 250));
		}
		return fallback;
	}

	formatDateInTimezone(date, timezone) {
		return new Intl.DateTimeFormat(`zh-TW`, {
			timeZone: timezone,
			year: `numeric`,
			month: `2-digit`,
			day: `2-digit`,
			weekday: `long`,
			hour: `2-digit`,
			minute: `2-digit`,
			second: `2-digit`,
			hour12: false,
		}).format(date);
	}

	buildFinalAnswer(question, date, timezone, formatted) {
		if (question.kind === `month-end`) {
			const parts = new Intl.DateTimeFormat(`en-CA`, {
				timeZone: timezone,
				year: `numeric`,
				month: `numeric`,
				day: `numeric`,
			})
				.formatToParts(date)
				.reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
			const year = Number(parts.year);
			const month = Number(parts.month);
			const day = Number(parts.day);
			const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
			const daysLeft = lastDay - day;
			return `本機 get_current_time() 回傳：${formatted}（${timezone}）。\n\n以這個日期為基準，本月最後一天是 ${year}/${String(month).padStart(2, `0`)}/${lastDay}，距離月底還有 ${daysLeft} 天。`;
		}
		if (question.kind === `utc`) {
			const time = new Intl.DateTimeFormat(`zh-TW`, {
				timeZone: `UTC`,
				hour: `2-digit`,
				minute: `2-digit`,
				second: `2-digit`,
				hour12: false,
			}).format(date);
			return `本機 get_current_time() 回傳：${formatted}（${timezone}）。\n\n所以現在 UTC 時間是 ${time}。`;
		}
		const weekday = new Intl.DateTimeFormat(`zh-TW`, { timeZone: timezone, weekday: `long` }).format(date);
		return `本機 get_current_time() 回傳：${formatted}（${timezone}）。\n\n所以今天是${weekday}。`;
	}

	appendLocalTimeResult(question, timezone) {
		const toolCallId = `local-time-${Date.now()}`;
		let output;
		let isError = false;
		let finalAnswer = ``;
		try {
			const date = new Date();
			const formatted = this.formatDateInTimezone(date, timezone);
			output = JSON.stringify(
				{
					timezone,
					formatted,
					utcTimestamp: date.toISOString(),
				},
				null,
				2,
			);
			finalAnswer = this.buildFinalAnswer(question, date, timezone, formatted);
		} catch (error) {
			isError = true;
			output = error instanceof Error ? error.message : String(error);
			finalAnswer = `本機時間工具無法使用時區 ${timezone}。這提醒我們：模型填錯工具參數，工具也只能回傳錯誤。`;
		}
		this.localTimeResult = output;
		this.finalAnswer = finalAnswer;
		this.pipelineStage = isError ? `error` : `done`;
		this.session.appendMessage({
			role: `assistant`,
			content: [{ type: `toolCall`, id: toolCallId, name: `get_current_time`, arguments: { timezone } }],
			api: `local-tool-bridge`,
			provider: `local`,
			model: `get_current_time`,
			usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
			stopReason: `toolUse`,
			timestamp: Date.now(),
		});
		this.session.appendMessage({
			role: `toolResult`,
			toolCallId,
			toolName: `get_current_time`,
			output,
			details: { source: `local-clock` },
			isError,
			timestamp: Date.now(),
		});
		this.session.appendMessage({
			role: `assistant`,
			content: [{ type: `text`, text: finalAnswer }],
			api: `local-tool-bridge`,
			provider: `local`,
			model: `get_current_time`,
			usage: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 } },
			stopReason: `stop`,
			timestamp: Date.now(),
		});
	}

	removeAbortedPlaceholders() {
		const messages = this.session.state.messages.filter((message) => {
			if (message.role !== `assistant`) return true;
			const emptyText = message.content?.every((part) => part.type !== `text` || part.text.trim() === ``);
			const aborted = message.stopReason === `aborted` || /abort|aborted|中止/i.test(message.errorMessage ?? ``);
			const abortedText = message.content?.some((part) => part.type === `text` && /呼叫已中止|沒有結果|aborted/i.test(part.text));
			return !(aborted && (emptyText || abortedText));
		});
		if (messages.length !== this.session.state.messages.length) this.session.replaceMessages(messages);
	}

	clearModelStreamUi() {
		this.session.patch({ isStreaming: false, streamMessage: null, pendingToolCalls: new Set() });
		this.agentInterface?._streamingContainer?.setMessage?.(null, true);
		this.agentInterface?.querySelectorAll?.(`aborted-message`)?.forEach((element) => element.remove());
		this.agentInterface?.querySelectorAll?.(`div`)?.forEach((element) => {
			if (/^(呼叫已中止；沒有結果。|Request aborted)$/.test(element.innerText?.trim() ?? ``)) element.remove();
		});
		this.agentInterface?.requestUpdate?.();
	}

	resetDemo() {
		this.session.abort();
		this.session.patch({ isStreaming: false, streamMessage: null, pendingToolCalls: new Set() });
		this.clearModelStreamUi();
		this.isRunning = false;
		this.mode = `intro`;
		this.currentQuestion = null;
		this.configureSession(false);
	}

	renderPipelineStep(id, label, detail) {
		const order = [`model`, `detected`, `reading-clock`, `done`];
		const currentIndex = order.indexOf(this.pipelineStage);
		const stepIndex = order.indexOf(id);
		const active = this.pipelineStage === id && this.pipelineStage !== `done`;
		const done = currentIndex > stepIndex || this.pipelineStage === `done`;
		const failed = this.pipelineStage === `error` && id === `done`;
		const dotClass = failed
			? `bg-destructive`
			: active
				? `bg-amber-500 animate-pulse`
				: done
					? `bg-emerald-500`
					: `bg-muted-foreground/30`;
		return x`
			<div class="flex gap-3">
				<div class="pt-1"><div class="h-2.5 w-2.5 rounded-full ${dotClass}"></div></div>
				<div class="min-w-0">
					<div class="text-xs font-semibold text-foreground">${label}</div>
					${detail ? x`<div class="text-xs text-muted-foreground mt-1 whitespace-pre-wrap break-words">${detail}</div>` : ``}
				</div>
			</div>
		`;
	}

	renderJsonPreview(title, code) {
		return x`
			<div class="mt-2 rounded-md border border-border bg-background/80 p-2">
				<div class="flex items-center justify-between gap-2 text-[11px] font-semibold text-foreground">
					<span>${title}</span>
					<span class="text-muted-foreground">JSON preview</span>
				</div>
				<pre class="mt-2 max-h-36 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-muted-foreground">${code}</pre>
			</div>
		`;
	}

	renderTimezonePreview() {
		const timezone = this.liveTimezone || this.currentQuestion?.defaultTimezone || `Asia/Taipei`;
		return x`
			${this.liveTimezone
				? i18n(`模型已產生 get_current_time() 的 timezone；下一步本機時鐘會照這個時區查。`)
				: i18n(`還沒收到模型輸出前，先看 get_current_time() 期待的參數形狀；模型只能填 timezone 這一格。`)}
			${this.renderJsonPreview(
				this.liveTimezone ? i18n(`模型即時工具參數`) : i18n(`預期工具參數形狀`),
				JSON.stringify({ timezone }, null, 2),
			)}
		`;
	}

	renderPipeline() {
		if (this.mode !== `tool`) return ``;
		return x`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-3">${i18n(`即時流程`)}</div>
				<div class="space-y-3">
					${this.renderPipelineStep(`model`, i18n(`1. 模型判斷要查哪個時區`), this.renderTimezonePreview())}
					${this.renderPipelineStep(`detected`, i18n(`2. 偵測到時區參數`), this.liveTimezone || i18n(`尚未偵測到完整 timezone。`))}
					${this.renderPipelineStep(`reading-clock`, i18n(`3. 本機時鐘執行工具`), this.liveTimezone || i18n(`等待時區參數。`))}
					${this.renderPipelineStep(`done`, i18n(`4. 工具結果產生答案`), this.finalAnswer || i18n(`尚未完成。`))}
				</div>
			</div>
		`;
	}

	renderStatus() {
		if (this.mode === `no-tool`) {
			return x`
				<div class="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`正在跑：沒有時間工具`)}</div>
					<div class="text-muted-foreground">${i18n(`好的回答應該承認缺少即時日期；如果它硬猜，就代表學生看到了「時間盲點」。`)}</div>
				</div>
			`;
		}
		if (this.mode === `tool`) {
			return x`
				<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`正在跑：啟用 get_current_time()`)}</div>
					<div class="text-muted-foreground">${i18n(`請看模型填了哪個 timezone，本機時鐘回傳什麼，最後答案是否清楚標示時區與基準日期。`)}</div>
				</div>
			`;
		}
		return x`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`先選一題，再比較「沒有工具」與「啟用時間工具」。這頁要看的不是模型會不會背答案，而是它如何取得外部狀態。`)}
			</div>
		`;
	}

	renderQuestionCard(question) {
		return x`
			<div class="rounded-md border border-border bg-muted/20 p-2">
				<div class="flex items-start justify-between gap-2">
					<div class="min-w-0">
						<div class="text-sm font-bold text-foreground">${question.label}</div>
						<div class="text-xs text-muted-foreground mt-1">${question.description}</div>
					</div>
				</div>
				<div class="grid grid-cols-2 gap-2 mt-3">
					${Button({
						variant: this.mode === `no-tool` && this.currentQuestion?.label === question.label ? `default` : `outline`,
						size: `sm`,
						onClick: () => this.runQuestion(question, false),
						children: i18n(`不用工具`),
						disabled: this.isRunning,
					})}
					${Button({
						variant: this.mode === `tool` && this.currentQuestion?.label === question.label ? `default` : `outline`,
						size: `sm`,
						onClick: () => this.runQuestion(question, true),
						children: i18n(`啟用工具`),
						disabled: this.isRunning,
					})}
				</div>
			</div>
		`;
	}

	renderContentPanel() {
		return x`
			<div class="h-full bg-background flex flex-col">
				<style>
					datetime-tool-demo-v2 aborted-message {
						display: none !important;
					}
				</style>
				<div class="border-b border-border p-3">${this.renderStatus()}</div>
				<div class="flex-1 min-h-0 p-4 pb-4">${this.agentInterface}</div>
			</div>
		`;
	}

	renderLeftDemoPanel() {
		return x`
			<div class="h-full overflow-y-auto p-3 space-y-3">
				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`現場測試題`)}</div>
					<div class="space-y-2">${this.dateQuestions.map((question) => this.renderQuestionCard(question))}</div>
					${Button({
						variant: `ghost`,
						size: `sm`,
						onClick: () => this.resetDemo(),
						children: i18n(`重設`),
						className: `w-full justify-start mt-3`,
					})}
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`get_current_time() 是什麼？`)}</div>
					<div class="text-xs text-muted-foreground leading-6 space-y-2">
						<p>${i18n(`可以把它想成「只會看時鐘的小工具」。模型不能自己知道現在幾點，只能填一個時區欄位請本機程式查。`)}</p>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`輸入`)}</div>
							<code class="block mt-1 break-all">${`{"timezone":"Asia/Taipei"}`}</code>
						</div>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`輸出`)}</div>
							<code class="block mt-1 break-all">${`{"formatted":"2026/05/16 星期六 13:05:00","utcTimestamp":"..."}`}</code>
						</div>
						<p>${i18n(`工具只負責回傳時間；「距離月底還有幾天」這種判斷，仍然要看模型或應用程式怎麼使用工具結果。`)}</p>
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`學生要看什麼`)}</div>
					<ul class="text-xs text-muted-foreground leading-6 list-disc pl-4">
						<li>${i18n(`沒有工具時，模型是否誠實說不能知道現在。`)}</li>
						<li>${i18n(`啟用工具時，模型填入的 timezone 是否合理。`)}</li>
						<li>${i18n(`最後答案是否保留時區與查詢時間，而不是只給一句看似肯定的結論。`)}</li>
					</ul>
				</div>

				${this.renderPipeline()}
			</div>
		`;
	}

	renderRightDemoPanel() {
		return x`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
	}
};

__decorate([r()], DateTimeToolDemo.prototype, `mode`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `isRunning`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `pipelineStage`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `liveTimezone`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `localTimeResult`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `finalAnswer`, void 0);
__decorate([r()], DateTimeToolDemo.prototype, `currentQuestion`, void 0);
DateTimeToolDemo = __decorate([t$1(`datetime-tool-demo-v2`)], DateTimeToolDemo);
document.body.innerHTML = `<datetime-tool-demo-v2></datetime-tool-demo-v2>`;
export { DateTimeToolDemo };
