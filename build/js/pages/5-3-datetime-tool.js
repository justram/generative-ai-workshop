import {
  o
} from "../chunks/chunk-ASOE6ZTL.js";
import {
  Pi,
  bR,
  m,
  v
} from "../chunks/chunk-737EQ6X6.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-FDFAIUKR.js";

// src/pages/5-3-datetime-tool.js
var DateTimeToolDemo = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u65E5\u671F\uFF0F\u6642\u9593\u5DE5\u5177\uFF1A\u6A21\u578B\u67E5\u4E0D\u5230\u300C\u73FE\u5728\u300D`);
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
        label: i18n(`\u4ECA\u5929\u661F\u671F\u5E7E\uFF1F`),
        prompt: i18n(`\u8ACB\u7528\u53F0\u5317\u6642\u9593\u56DE\u7B54\uFF1A\u4ECA\u5929\u661F\u671F\u5E7E\uFF1F\u8ACB\u8AAA\u660E\u4F60\u7528\u7684\u662F\u54EA\u500B\u6642\u5340\u3002`),
        description: i18n(`\u9700\u8981\u76EE\u524D\u65E5\u671F`),
        defaultTimezone: `Asia/Taipei`,
        kind: `weekday`
      },
      {
        label: i18n(`\u8DDD\u96E2\u6708\u5E95\u9084\u6709\u5E7E\u5929\uFF1F`),
        prompt: i18n(`\u8ACB\u7528\u53F0\u5317\u6642\u9593\u56DE\u7B54\uFF1A\u8DDD\u96E2\u9019\u500B\u6708\u5E95\u9084\u6709\u5E7E\u5929\uFF1F\u8ACB\u8AAA\u660E\u4F60\u7684\u8A08\u7B97\u57FA\u6E96\u65E5\u671F\u3002`),
        description: i18n(`\u76F8\u5C0D\u65E5\u671F\u6703\u8B8A\u52D5`),
        defaultTimezone: `Asia/Taipei`,
        kind: `month-end`
      },
      {
        label: i18n(`\u73FE\u5728 UTC \u6642\u9593\u662F\u5E7E\u9EDE\uFF1F`),
        prompt: i18n(`\u73FE\u5728 UTC \u6642\u9593\u662F\u5E7E\u9EDE\uFF1F\u8ACB\u7528 24 \u5C0F\u6642\u5236\u56DE\u7B54\u3002`),
        description: i18n(`\u6642\u5340\u7D30\u7BC0`),
        defaultTimezone: `UTC`,
        kind: `utc`
      }
    ];
    this.session = new o({ authTokenProvider: v });
    this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`));
    this.configureSession(false);
    this.agentInterface = new bR();
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
      useTool ? `\u4F60\u662F\u4E00\u4F4D\u8B39\u614E\u7684\u52A9\u6559\u3002\u4E0D\u8981\u56DE\u7B54\u554F\u984C\u672C\u8EAB\u3002\u8ACB\u5224\u65B7\u8981\u67E5\u54EA\u500B\u6642\u5340\uFF0C\u4E26\u53EA\u8F38\u51FA JSON \u7269\u4EF6\uFF0C\u683C\u5F0F\u53EA\u80FD\u662F {"timezone":"IANA \u6642\u5340\u6216 UTC"}\u3002\u4F8B\u5982 {"timezone":"Asia/Taipei"} \u6216 {"timezone":"UTC"}\u3002` : `\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u6559\u3002\u4F60\u6C92\u6709\u76EE\u524D\u65E5\u671F\u8207\u6642\u9593\u7684\u5373\u6642\u8CC7\u8A0A\u3002\u9047\u5230\u4ECA\u5929\u3001\u73FE\u5728\u3001\u6708\u5E95\u3001\u661F\u671F\u3001\u6642\u5340\u6216\u76F8\u5C0D\u65E5\u671F\u554F\u984C\u6642\uFF0C\u8ACB\u8AA0\u5BE6\u8AAA\u4F60\u9700\u8981\u76EE\u524D\u6642\u9593\u624D\u80FD\u7CBE\u78BA\u56DE\u7B54\uFF0C\u4E0D\u8981\u731C\u65E5\u671F\u3002`
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
      const run2 = this.agentInterface.sendMessage(question.prompt).catch(() => {
      });
      await run2;
      this.isRunning = false;
      return;
    }
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: question.prompt }],
      timestamp: Date.now()
    });
    const plannerSession = new o({
      authTokenProvider: v
    });
    plannerSession.setModel(this.session.state.model ?? Pi(`openai-codex`, `gpt-5.4-mini`));
    plannerSession.setTools([]);
    plannerSession.setSystemPrompt(
      `\u4F60\u662F\u4E00\u4F4D\u8B39\u614E\u7684\u52A9\u6559\u3002\u4E0D\u8981\u56DE\u7B54\u554F\u984C\u672C\u8EAB\u3002\u8ACB\u5224\u65B7\u8981\u67E5\u54EA\u500B\u6642\u5340\uFF0C\u4E26\u53EA\u8F38\u51FA JSON \u7269\u4EF6\uFF0C\u683C\u5F0F\u53EA\u80FD\u662F {"timezone":"IANA \u6642\u5340\u6216 UTC"}\u3002\u4F8B\u5982 {"timezone":"Asia/Taipei"} \u6216 {"timezone":"UTC"}\u3002`
    );
    const run = plannerSession.prompt(question.prompt).catch(() => {
    });
    const timezone = await this.waitForTimezone(question.defaultTimezone, plannerSession);
    this.liveTimezone = timezone;
    this.pipelineStage = `detected`;
    await new Promise((resolve) => setTimeout(resolve, 300));
    plannerSession.abort();
    await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 1e3))]);
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
      const text = message.content?.filter((part) => part.type === `text`).map((part) => part.text).join(`
`);
      if (!text) continue;
      const jsonMatch = text.match(/\{[\s\S]*"timezone"\s*:\s*"([^"]+)"[\s\S]*\}/);
      if (jsonMatch?.[1]) return jsonMatch[1];
      const partialJsonMatch = text.match(/"timezone"\s*:\s*"([^"]+)"/);
      if (partialJsonMatch?.[1]) return partialJsonMatch[1];
      if (/UTC/i.test(text)) return `UTC`;
      if (/Taipei|台北|臺北|Taiwan|台灣|臺灣/i.test(text)) return `Asia/Taipei`;
    }
    return void 0;
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
      hour12: false
    }).format(date);
  }
  buildFinalAnswer(question, date, timezone, formatted) {
    if (question.kind === `month-end`) {
      const parts = new Intl.DateTimeFormat(`en-CA`, {
        timeZone: timezone,
        year: `numeric`,
        month: `numeric`,
        day: `numeric`
      }).formatToParts(date).reduce((acc, part) => ({ ...acc, [part.type]: part.value }), {});
      const year = Number(parts.year);
      const month = Number(parts.month);
      const day = Number(parts.day);
      const lastDay = new Date(Date.UTC(year, month, 0)).getUTCDate();
      const daysLeft = lastDay - day;
      return `\u672C\u6A5F get_current_time() \u56DE\u50B3\uFF1A${formatted}\uFF08${timezone}\uFF09\u3002

\u4EE5\u9019\u500B\u65E5\u671F\u70BA\u57FA\u6E96\uFF0C\u672C\u6708\u6700\u5F8C\u4E00\u5929\u662F ${year}/${String(month).padStart(2, `0`)}/${lastDay}\uFF0C\u8DDD\u96E2\u6708\u5E95\u9084\u6709 ${daysLeft} \u5929\u3002`;
    }
    if (question.kind === `utc`) {
      const time = new Intl.DateTimeFormat(`zh-TW`, {
        timeZone: `UTC`,
        hour: `2-digit`,
        minute: `2-digit`,
        second: `2-digit`,
        hour12: false
      }).format(date);
      return `\u672C\u6A5F get_current_time() \u56DE\u50B3\uFF1A${formatted}\uFF08${timezone}\uFF09\u3002

\u6240\u4EE5\u73FE\u5728 UTC \u6642\u9593\u662F ${time}\u3002`;
    }
    const weekday = new Intl.DateTimeFormat(`zh-TW`, {
      timeZone: timezone,
      weekday: `long`
    }).format(date);
    return `\u672C\u6A5F get_current_time() \u56DE\u50B3\uFF1A${formatted}\uFF08${timezone}\uFF09\u3002

\u6240\u4EE5\u4ECA\u5929\u662F${weekday}\u3002`;
  }
  appendLocalTimeResult(question, timezone) {
    const toolCallId = `local-time-${Date.now()}`;
    let output;
    let isError = false;
    let finalAnswer = ``;
    try {
      const date = /* @__PURE__ */ new Date();
      const formatted = this.formatDateInTimezone(date, timezone);
      output = JSON.stringify(
        {
          timezone,
          formatted,
          utcTimestamp: date.toISOString()
        },
        null,
        2
      );
      finalAnswer = this.buildFinalAnswer(question, date, timezone, formatted);
    } catch (error) {
      isError = true;
      output = error instanceof Error ? error.message : String(error);
      finalAnswer = `\u672C\u6A5F\u6642\u9593\u5DE5\u5177\u7121\u6CD5\u4F7F\u7528\u6642\u5340 ${timezone}\u3002\u9019\u63D0\u9192\u6211\u5011\uFF1A\u6A21\u578B\u586B\u932F\u5DE5\u5177\u53C3\u6578\uFF0C\u5DE5\u5177\u4E5F\u53EA\u80FD\u56DE\u50B3\u932F\u8AA4\u3002`;
    }
    this.localTimeResult = output;
    this.finalAnswer = finalAnswer;
    this.pipelineStage = isError ? `error` : `done`;
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `toolCall`,
          id: toolCallId,
          name: `get_current_time`,
          arguments: { timezone }
        }
      ],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `get_current_time`,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: `toolUse`,
      timestamp: Date.now()
    });
    this.session.appendMessage({
      role: `toolResult`,
      toolCallId,
      toolName: `get_current_time`,
      output,
      details: { source: `local-clock` },
      isError,
      timestamp: Date.now()
    });
    this.session.appendMessage({
      role: `assistant`,
      content: [{ type: `text`, text: finalAnswer }],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `get_current_time`,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: `stop`,
      timestamp: Date.now()
    });
  }
  removeAbortedPlaceholders() {
    const messages = this.session.state.messages.filter((message) => {
      if (message.role !== `assistant`) return true;
      const emptyText = message.content?.every(
        (part) => part.type !== `text` || part.text.trim() === ``
      );
      const aborted = message.stopReason === `aborted` || /abort|aborted|中止/i.test(message.errorMessage ?? ``);
      const abortedText = message.content?.some(
        (part) => part.type === `text` && /呼叫已中止|沒有結果|aborted/i.test(part.text)
      );
      return !(aborted && (emptyText || abortedText));
    });
    if (messages.length !== this.session.state.messages.length)
      this.session.replaceMessages(messages);
  }
  clearModelStreamUi() {
    this.session.patch({
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: /* @__PURE__ */ new Set()
    });
    this.agentInterface?._streamingContainer?.setMessage?.(null, true);
    this.agentInterface?.querySelectorAll?.(`aborted-message`)?.forEach((element) => element.remove());
    this.agentInterface?.querySelectorAll?.(`div`)?.forEach((element) => {
      if (/^(呼叫已中止；沒有結果。|Request aborted)$/.test(element.innerText?.trim() ?? ``))
        element.remove();
    });
    this.agentInterface?.requestUpdate?.();
  }
  resetDemo() {
    this.session.abort();
    this.session.patch({
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: /* @__PURE__ */ new Set()
    });
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
    const dotClass = failed ? `bg-destructive` : active ? `bg-amber-500 animate-pulse` : done ? `bg-emerald-500` : `bg-muted-foreground/30`;
    return b`
			<div class="flex gap-3">
				<div class="pt-1"><div class="h-2.5 w-2.5 rounded-full ${dotClass}"></div></div>
				<div class="min-w-0">
					<div class="text-xs font-semibold text-foreground">${label}</div>
					${detail ? b`<div class="text-xs text-muted-foreground mt-1 whitespace-pre-wrap break-words">${detail}</div>` : ``}
				</div>
			</div>
		`;
  }
  renderJsonPreview(title, code) {
    return b`
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
    return b`
			${this.liveTimezone ? i18n(`\u6A21\u578B\u5DF2\u7522\u751F get_current_time() \u7684 timezone\uFF1B\u4E0B\u4E00\u6B65\u672C\u6A5F\u6642\u9418\u6703\u7167\u9019\u500B\u6642\u5340\u67E5\u3002`) : i18n(
      `\u9084\u6C92\u6536\u5230\u6A21\u578B\u8F38\u51FA\u524D\uFF0C\u5148\u770B get_current_time() \u671F\u5F85\u7684\u53C3\u6578\u5F62\u72C0\uFF1B\u6A21\u578B\u53EA\u80FD\u586B timezone \u9019\u4E00\u683C\u3002`
    )}
			${this.renderJsonPreview(
      this.liveTimezone ? i18n(`\u6A21\u578B\u5373\u6642\u5DE5\u5177\u53C3\u6578`) : i18n(`\u9810\u671F\u5DE5\u5177\u53C3\u6578\u5F62\u72C0`),
      JSON.stringify({ timezone }, null, 2)
    )}
		`;
  }
  renderPipeline() {
    if (this.mode !== `tool`) return ``;
    return b`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-3">${i18n(`\u5373\u6642\u6D41\u7A0B`)}</div>
				<div class="space-y-3">
					${this.renderPipelineStep(`model`, i18n(`1. \u6A21\u578B\u5224\u65B7\u8981\u67E5\u54EA\u500B\u6642\u5340`), this.renderTimezonePreview())}
					${this.renderPipelineStep(`detected`, i18n(`2. \u5075\u6E2C\u5230\u6642\u5340\u53C3\u6578`), this.liveTimezone || i18n(`\u5C1A\u672A\u5075\u6E2C\u5230\u5B8C\u6574 timezone\u3002`))}
					${this.renderPipelineStep(`reading-clock`, i18n(`3. \u672C\u6A5F\u6642\u9418\u57F7\u884C\u5DE5\u5177`), this.liveTimezone || i18n(`\u7B49\u5F85\u6642\u5340\u53C3\u6578\u3002`))}
					${this.renderPipelineStep(`done`, i18n(`4. \u5DE5\u5177\u7D50\u679C\u7522\u751F\u7B54\u6848`), this.finalAnswer || i18n(`\u5C1A\u672A\u5B8C\u6210\u3002`))}
				</div>
			</div>
		`;
  }
  renderStatus() {
    if (this.mode === `no-tool`) {
      return b`
				<div class="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`\u6B63\u5728\u8DD1\uFF1A\u6C92\u6709\u6642\u9593\u5DE5\u5177`)}</div>
					<div class="text-muted-foreground">${i18n(`\u597D\u7684\u56DE\u7B54\u61C9\u8A72\u627F\u8A8D\u7F3A\u5C11\u5373\u6642\u65E5\u671F\uFF1B\u5982\u679C\u5B83\u786C\u731C\uFF0C\u5C31\u4EE3\u8868\u5B78\u751F\u770B\u5230\u4E86\u300C\u6642\u9593\u76F2\u9EDE\u300D\u3002`)}</div>
				</div>
			`;
    }
    if (this.mode === `tool`) {
      return b`
				<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`\u6B63\u5728\u8DD1\uFF1A\u555F\u7528 get_current_time()`)}</div>
					<div class="text-muted-foreground">${i18n(`\u8ACB\u770B\u6A21\u578B\u586B\u4E86\u54EA\u500B timezone\uFF0C\u672C\u6A5F\u6642\u9418\u56DE\u50B3\u4EC0\u9EBC\uFF0C\u6700\u5F8C\u7B54\u6848\u662F\u5426\u6E05\u695A\u6A19\u793A\u6642\u5340\u8207\u57FA\u6E96\u65E5\u671F\u3002`)}</div>
				</div>
			`;
    }
    return b`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`\u5148\u9078\u4E00\u984C\uFF0C\u518D\u6BD4\u8F03\u300C\u6C92\u6709\u5DE5\u5177\u300D\u8207\u300C\u555F\u7528\u6642\u9593\u5DE5\u5177\u300D\u3002\u9019\u9801\u8981\u770B\u7684\u4E0D\u662F\u6A21\u578B\u6703\u4E0D\u6703\u80CC\u7B54\u6848\uFF0C\u800C\u662F\u5B83\u5982\u4F55\u53D6\u5F97\u5916\u90E8\u72C0\u614B\u3002`)}
			</div>
		`;
  }
  renderQuestionCard(question) {
    return b`
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
      children: i18n(`\u4E0D\u7528\u5DE5\u5177`),
      disabled: this.isRunning
    })}
					${Button({
      variant: this.mode === `tool` && this.currentQuestion?.label === question.label ? `default` : `outline`,
      size: `sm`,
      onClick: () => this.runQuestion(question, true),
      children: i18n(`\u555F\u7528\u5DE5\u5177`),
      disabled: this.isRunning
    })}
				</div>
			</div>
		`;
  }
  renderContentPanel() {
    return b`
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
    return b`
			<div class="h-full overflow-y-auto p-3 space-y-3">
				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u73FE\u5834\u6E2C\u8A66\u984C`)}</div>
					<div class="space-y-2">${this.dateQuestions.map((question) => this.renderQuestionCard(question))}</div>
					${Button({
      variant: `ghost`,
      size: `sm`,
      onClick: () => this.resetDemo(),
      children: i18n(`\u91CD\u8A2D`),
      className: `w-full justify-start mt-3`
    })}
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`get_current_time() \u662F\u4EC0\u9EBC\uFF1F`)}</div>
					<div class="text-xs text-muted-foreground leading-6 space-y-2">
						<p>${i18n(`\u53EF\u4EE5\u628A\u5B83\u60F3\u6210\u300C\u53EA\u6703\u770B\u6642\u9418\u7684\u5C0F\u5DE5\u5177\u300D\u3002\u6A21\u578B\u4E0D\u80FD\u81EA\u5DF1\u77E5\u9053\u73FE\u5728\u5E7E\u9EDE\uFF0C\u53EA\u80FD\u586B\u4E00\u500B\u6642\u5340\u6B04\u4F4D\u8ACB\u672C\u6A5F\u7A0B\u5F0F\u67E5\u3002`)}</p>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`\u8F38\u5165`)}</div>
							<code class="block mt-1 break-all">${`{"timezone":"Asia/Taipei"}`}</code>
						</div>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`\u8F38\u51FA`)}</div>
							<code class="block mt-1 break-all">${`{"formatted":"2026/05/16 \u661F\u671F\u516D 13:05:00","utcTimestamp":"..."}`}</code>
						</div>
						<p>${i18n(`\u5DE5\u5177\u53EA\u8CA0\u8CAC\u56DE\u50B3\u6642\u9593\uFF1B\u300C\u8DDD\u96E2\u6708\u5E95\u9084\u6709\u5E7E\u5929\u300D\u9019\u7A2E\u5224\u65B7\uFF0C\u4ECD\u7136\u8981\u770B\u6A21\u578B\u6216\u61C9\u7528\u7A0B\u5F0F\u600E\u9EBC\u4F7F\u7528\u5DE5\u5177\u7D50\u679C\u3002`)}</p>
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u5B78\u751F\u8981\u770B\u4EC0\u9EBC`)}</div>
					<ul class="text-xs text-muted-foreground leading-6 list-disc pl-4">
						<li>${i18n(`\u6C92\u6709\u5DE5\u5177\u6642\uFF0C\u6A21\u578B\u662F\u5426\u8AA0\u5BE6\u8AAA\u4E0D\u80FD\u77E5\u9053\u73FE\u5728\u3002`)}</li>
						<li>${i18n(`\u555F\u7528\u5DE5\u5177\u6642\uFF0C\u6A21\u578B\u586B\u5165\u7684 timezone \u662F\u5426\u5408\u7406\u3002`)}</li>
						<li>${i18n(`\u6700\u5F8C\u7B54\u6848\u662F\u5426\u4FDD\u7559\u6642\u5340\u8207\u67E5\u8A62\u6642\u9593\uFF0C\u800C\u4E0D\u662F\u53EA\u7D66\u4E00\u53E5\u770B\u4F3C\u80AF\u5B9A\u7684\u7D50\u8AD6\u3002`)}</li>
					</ul>
				</div>

				${this.renderPipeline()}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
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
DateTimeToolDemo = __decorate([t(`datetime-tool-demo-v2`)], DateTimeToolDemo);
document.body.innerHTML = `<datetime-tool-demo-v2></datetime-tool-demo-v2>`;
export {
  DateTimeToolDemo
};
//# sourceMappingURL=5-3-datetime-tool.js.map
