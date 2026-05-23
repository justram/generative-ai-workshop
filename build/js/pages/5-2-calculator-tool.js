import {
  o
} from "../chunks/chunk-BUQY3BQN.js";
import {
  Pi,
  RP,
  bR,
  m,
  v
} from "../chunks/chunk-FCZIHEE4.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-4L3FZKEY.js";

// src/pages/5-2-calculator-tool.js
var CalculatorToolDemo = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u8A08\u7B97\u6A5F\u5DE5\u5177\uFF1A\u6A21\u578B\u8CA0\u8CAC\u7406\u89E3\uFF0C\u5DE5\u5177\u8CA0\u8CAC\u8A08\u7B97`);
    this.sectionId = `5.2`;
    this.mode = `intro`;
    this.isRunning = false;
    this.pipelineStage = `idle`;
    this.liveExpression = ``;
    this.localResult = ``;
    this.problem = {
      prompt: i18n(
        `\u8ACB\u7CBE\u78BA\u8A08\u7B97\uFF1A(9,876,543,219 \xD7 12,345,679) - 88,888,888,888\u3002\u8ACB\u76F4\u63A5\u7D66\u7B54\u6848\uFF0C\u4E26\u7C21\u77ED\u8AAA\u660E\u4F60\u600E\u9EBC\u7B97\u3002`
      ),
      expression: `(9876543219 * 12345679) - 88888888888`,
      reference: `121,932,543,322,511,813`
    };
    this.calculateTool = {
      ...RP,
      label: i18n(`\u8A08\u7B97\u6A5F`),
      description: i18n(`\u8A08\u7B97\u6578\u5B78\u7B97\u5F0F`)
    };
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
    this.liveExpression = ``;
    this.localResult = ``;
    this.session.setTools([]);
    this.session.setSystemPrompt(
      useTool ? i18n(
        `\u4F60\u662F\u4E00\u4F4D\u8B39\u614E\u7684\u52A9\u6559\u3002\u4E0D\u8981\u76F4\u63A5\u56DE\u7B54\u6700\u5F8C\u6578\u5B57\u3002\u8ACB\u5148\u628A\u4F7F\u7528\u8005\u7684\u7B97\u8853\u984C\u8F49\u6210 JSON\uFF0C\u683C\u5F0F\u53EA\u80FD\u662F {"expression":"\u7B97\u5F0F"}\uFF0Cexpression \u4F7F\u7528 JavaScript \u53EF\u57F7\u884C\u7684 + - * / \u548C\u62EC\u865F\uFF0C\u4E0D\u8981\u52A0\u9017\u865F\u3001\u4E2D\u6587\u6216\u89E3\u91CB\u3002`
      ) : i18n(`\u4F60\u662F\u4E00\u4F4D\u6A02\u65BC\u52A9\u4EBA\u7684\u52A9\u6559\u3002\u8ACB\u4E0D\u8981\u4F7F\u7528\u4EFB\u4F55\u5DE5\u5177\uFF0C\u76F4\u63A5\u6839\u64DA\u81EA\u5DF1\u7684\u63A8\u7406\u56DE\u7B54\u3002`)
    );
    this.session.clearMessages();
  }
  async runLive(useTool) {
    if (this.isRunning) return;
    this.isRunning = true;
    this.mode = useTool ? `tool` : `no-tool`;
    this.configureSession(useTool);
    await this.updateComplete;
    if (useTool) this.pipelineStage = `model`;
    if (!useTool) {
      const run2 = this.agentInterface.sendMessage(this.problem.prompt).catch(() => {
      });
      await run2;
      this.isRunning = false;
      return;
    }
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: this.problem.prompt }],
      timestamp: Date.now()
    });
    const plannerSession = new o({
      authTokenProvider: v
    });
    plannerSession.setModel(this.session.state.model ?? Pi(`openai-codex`, `gpt-5.4-mini`));
    plannerSession.setTools([]);
    plannerSession.setSystemPrompt(
      i18n(
        `\u4F60\u662F\u4E00\u4F4D\u8B39\u614E\u7684\u52A9\u6559\u3002\u4E0D\u8981\u76F4\u63A5\u56DE\u7B54\u6700\u5F8C\u6578\u5B57\u3002\u8ACB\u5148\u628A\u4F7F\u7528\u8005\u7684\u7B97\u8853\u984C\u8F49\u6210 JSON\uFF0C\u683C\u5F0F\u53EA\u80FD\u662F {"expression":"\u7B97\u5F0F"}\uFF0Cexpression \u4F7F\u7528 JavaScript \u53EF\u57F7\u884C\u7684 + - * / \u548C\u62EC\u865F\uFF0C\u4E0D\u8981\u52A0\u9017\u865F\u3001\u4E2D\u6587\u6216\u89E3\u91CB\u3002`
      )
    );
    const run = plannerSession.prompt(this.problem.prompt).catch(() => {
    });
    const expression = await this.waitForExpression(plannerSession);
    this.liveExpression = expression;
    this.pipelineStage = `detected`;
    await new Promise((resolve) => setTimeout(resolve, 350));
    plannerSession.abort();
    await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 1e3))]);
    this.removeAbortedPlaceholders();
    this.removePlannerJsonMessages();
    this.clearModelStreamUi();
    this.pipelineStage = `calculating`;
    await new Promise((resolve) => setTimeout(resolve, 350));
    this.appendLocalCalculatorResult(expression);
    this.removeAbortedPlaceholders();
    this.removePlannerJsonMessages();
    this.clearModelStreamUi();
    setTimeout(() => {
      this.removeAbortedPlaceholders();
      this.removePlannerJsonMessages();
      this.clearModelStreamUi();
    }, 1200);
    this.isRunning = false;
    this.removeAbortedPlaceholders();
    this.removePlannerJsonMessages();
    this.clearModelStreamUi();
    this.requestUpdate();
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
  removePlannerJsonMessages() {
    const messages = this.session.state.messages.filter((message) => {
      if (message.role !== `assistant`) return true;
      const hasToolOrNonText = message.content?.some((part) => part.type !== `text`);
      if (hasToolOrNonText) return true;
      const text = message.content?.filter((part) => part.type === `text`).map((part) => part.text).join(`
`).trim();
      if (!text) return true;
      try {
        const parsed = JSON.parse(text);
        return !(parsed && typeof parsed === `object` && typeof parsed.expression === `string`);
      } catch {
        return !/^```(?:json)?\s*\{[\s\S]*"expression"\s*:/i.test(text);
      }
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
  extractExpressionFromMessages(session = this.session) {
    const messages = session.state.messages;
    const streamMessage = session.state.streamMessage;
    const candidates = streamMessage ? [...messages, streamMessage] : messages;
    for (const message of [...candidates].reverse()) {
      if (message.role !== `assistant`) continue;
      const text = message.content?.filter((part) => part.type === `text`).map((part) => part.text).join(`
`);
      if (!text) continue;
      const jsonMatch = text.match(/\{[\s\S]*"expression"\s*:\s*"([^"]+)"[\s\S]*\}/);
      if (jsonMatch?.[1]) return jsonMatch[1];
      const partialJsonMatch = text.match(/"expression"\s*:\s*"([^"]+)"/);
      if (partialJsonMatch?.[1]) return partialJsonMatch[1];
      const expressionMatch = text.match(
        /\(?\s*9876543219\s*\*\s*12345679\s*\)?\s*-\s*88888888888/
      );
      if (expressionMatch?.[0]) return expressionMatch[0].replace(/^\(|\)$/g, ``);
    }
    return void 0;
  }
  async waitForExpression(session = this.session) {
    for (let attempt = 0; attempt < 120; attempt += 1) {
      const expression = this.extractExpressionFromMessages(session);
      if (expression) {
        this.liveExpression = expression;
        this.requestUpdate();
        return expression;
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    return this.problem.expression;
  }
  appendLocalCalculatorResult(expression = this.extractExpressionFromMessages() ?? this.problem.expression) {
    const toolCallId = `local-calculate-${Date.now()}`;
    let output;
    let isError = false;
    try {
      const bigintExpression = expression.replace(/\d+/g, (number) => `${number}n`);
      const value = Function(`"use strict"; return (${bigintExpression});`)();
      output = `${expression} = ${value.toLocaleString(`en-US`)}`;
      this.localResult = output;
    } catch (error) {
      isError = true;
      output = error instanceof Error ? error.message : String(error);
      this.localResult = output;
    }
    this.pipelineStage = isError ? `error` : `done`;
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `toolCall`,
          id: toolCallId,
          name: `calculate`,
          arguments: { expression }
        }
      ],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `calculate`,
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
      toolName: `calculate`,
      output,
      details: { source: `local-bridge` },
      isError,
      timestamp: Date.now()
    });
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `text`,
          text: isError ? `\u672C\u6A5F\u8A08\u7B97\u6A5F\u7121\u6CD5\u57F7\u884C\u6A21\u578B\u9001\u51FA\u7684\u7B97\u5F0F\u3002\u9019\u6B63\u597D\u63D0\u9192\u6211\u5011\uFF1A\u5DE5\u5177\u524D\u9762\u7684\u89E3\u6790\u6B65\u9A5F\u4ECD\u7136\u8981\u6AA2\u67E5\u3002` : `\u672C\u6A5F\u8A08\u7B97\u6A5F\u56DE\u50B3\uFF1A${output}

\u8ACB\u5C0D\u7167\u5DE6\u5074\u53C3\u8003\u7B54\u6848\u3002\u9019\u500B\u4F8B\u5B50\u8981\u770B\u7684\u4E0D\u662F\u6A21\u578B\u6587\u7B46\uFF0C\u800C\u662F\u6A21\u578B\u9001\u9032\u5DE5\u5177\u7684\u7B97\u5F0F\u662F\u5426\u6B63\u78BA\u3002`
        }
      ],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `calculate`,
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
    this.configureSession(false);
  }
  renderPipelineStep(id, label, detail) {
    const order = [`model`, `detected`, `calculating`, `done`];
    const currentIndex = order.indexOf(this.pipelineStage);
    const stepIndex = order.indexOf(id);
    const active = this.pipelineStage === id && this.pipelineStage !== `done`;
    const done = currentIndex > stepIndex || this.pipelineStage === `done`;
    const failed = this.pipelineStage === `error` && id === `done`;
    const dotClass = failed ? `bg-destructive` : active ? `bg-amber-500 animate-pulse` : done ? `bg-emerald-500` : `bg-muted-foreground/30`;
    return b`
			<div class="flex gap-3">
				<div class="pt-1">
					<div class="h-2.5 w-2.5 rounded-full ${dotClass}"></div>
				</div>
				<div class="min-w-0">
					<div class="text-xs font-semibold text-foreground">${label}</div>
					${detail ? b`<div class="text-xs text-muted-foreground mt-1 break-words">${detail}</div>` : ``}
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
  renderExpressionPreview() {
    const expression = this.liveExpression || this.problem.expression;
    return b`
			${this.liveExpression ? i18n(`\u6A21\u578B\u5DF2\u7522\u751F calculate() \u7684 expression\uFF1B\u4E0B\u4E00\u6B65\u672C\u6A5F\u5DE5\u5177\u6703\u7167\u9019\u500B\u5B57\u4E32\u57F7\u884C\u3002`) : i18n(
      `\u9084\u6C92\u6536\u5230\u6A21\u578B\u8F38\u51FA\u524D\uFF0C\u5148\u770B calculate() \u671F\u5F85\u7684\u53C3\u6578\u5F62\u72C0\uFF1B\u6A21\u578B\u7B49\u7B49\u53EA\u80FD\u586B expression \u9019\u4E00\u683C\u3002`
    )}
			${this.renderJsonPreview(
      this.liveExpression ? i18n(`\u6A21\u578B\u5373\u6642\u5DE5\u5177\u53C3\u6578`) : i18n(`\u9810\u671F\u5DE5\u5177\u53C3\u6578\u5F62\u72C0`),
      JSON.stringify({ expression }, null, 2)
    )}
		`;
  }
  renderPipeline() {
    if (this.mode !== `tool`) return ``;
    return b`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-3">${i18n(`\u5373\u6642\u6D41\u7A0B`)}</div>
				<div class="space-y-3">
					${this.renderPipelineStep(`model`, i18n(`1. \u6A21\u578B\u7522\u751F\u5DE5\u5177\u53C3\u6578`), this.renderExpressionPreview())}
					${this.renderPipelineStep(`detected`, i18n(`2. \u5075\u6E2C\u5230\u7B97\u5F0F`), this.liveExpression || i18n(`\u5C1A\u672A\u5075\u6E2C\u5230\u5B8C\u6574 expression\u3002`))}
					${this.renderPipelineStep(`calculating`, i18n(`3. \u672C\u6A5F\u8A08\u7B97\u6A5F\u57F7\u884C`), this.liveExpression || i18n(`\u7B49\u5F85\u7B97\u5F0F\u3002`))}
					${this.renderPipelineStep(`done`, i18n(`4. \u56DE\u50B3\u5DE5\u5177\u7D50\u679C`), this.localResult || i18n(`\u5C1A\u672A\u5B8C\u6210\u3002`))}
				</div>
			</div>
		`;
  }
  renderStatus() {
    if (this.mode === `no-tool`) {
      return b`
				<div class="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`\u6B63\u5728\u8DD1\uFF1A\u6A21\u578B\u81EA\u5DF1\u7B97`)}</div>
					<div class="text-muted-foreground">${i18n(`\u8ACB\u770B\u6A21\u578B\u662F\u5426\u771F\u7684\u7B97\u5C0D\u3002\u8A9E\u6C23\u5F88\u7A69\uFF0C\u4E0D\u4EE3\u8868\u6578\u5B57\u6B63\u78BA\u3002`)}</div>
				</div>
			`;
    }
    if (this.mode === `tool`) {
      if (this.pipelineStage === `done`) {
        return b`
					<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
						<div class="font-bold text-foreground mb-1">${i18n(`\u5DE5\u5177\u5DF2\u56DE\u50B3\u7D50\u679C`)}</div>
						<div class="text-muted-foreground">${i18n(`\u73FE\u5728\u8ACB\u5C0D\u7167\u5DE6\u5074\u53C3\u8003\u7B54\u6848\uFF0C\u78BA\u8A8D\u6A21\u578B\u9001\u51FA\u7684\u7B97\u5F0F\u8207\u672C\u6A5F\u8A08\u7B97\u7D50\u679C\u3002`)}</div>
					</div>
				`;
      }
      return b`
				<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`\u6B63\u5728\u8DD1\uFF1A\u555F\u7528 calculate()`)}</div>
					<div class="text-muted-foreground">${i18n(`\u8ACB\u5148\u770B\u6A21\u578B\u5373\u6642\u8F38\u51FA\u7684\u5DE5\u5177\u53C3\u6578\uFF0C\u518D\u770B\u672C\u6A5F\u8A08\u7B97\u6A5F\u7528\u540C\u4E00\u500B\u7B97\u5F0F\u57F7\u884C\u7684\u7D50\u679C\u3002`)}</div>
				</div>
			`;
    }
    return b`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`\u5148\u6309\u5DE6\u5074\u5176\u4E2D\u4E00\u500B\u6309\u9215\u3002\u9019\u6B21\u6703\u771F\u7684\u9001\u51FA\u7D66\u6A21\u578B\uFF0C\u8B93\u5B78\u751F\u770B\u5230\u5373\u6642\u8F38\u51FA\uFF0C\u800C\u4E0D\u662F\u9810\u5148\u5BEB\u597D\u7684\u5287\u672C\u3002`)}
			</div>
		`;
  }
  renderContentPanel() {
    return b`
			<div class="h-full bg-background flex flex-col">
				<style>
					calculator-tool-demo-v3 aborted-message {
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
					<div class="text-sm text-foreground leading-6">${this.problem.prompt}</div>
					<div class="mt-3 rounded-md border border-border bg-muted/40 p-2 text-xs">
						<div class="font-bold text-foreground">${i18n(`\u53C3\u8003\u7B54\u6848`)}</div>
						<div class="font-mono text-muted-foreground mt-1">${this.problem.reference}</div>
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u6BD4\u8F03\u5169\u7A2E\u5BE6\u969B\u8F38\u51FA`)}</div>
					<div class="space-y-2">
						${Button({
      variant: this.mode === `no-tool` ? `default` : `outline`,
      size: `sm`,
      onClick: () => this.runLive(false),
      children: i18n(`A. \u771F\u7684\u8B93\u6A21\u578B\u81EA\u5DF1\u7B97`),
      disabled: this.isRunning,
      className: `w-full justify-start`
    })}
						${Button({
      variant: this.mode === `tool` ? `default` : `outline`,
      size: `sm`,
      onClick: () => this.runLive(true),
      children: i18n(`B. \u771F\u7684\u555F\u7528 calculate() \u5DE5\u5177`),
      disabled: this.isRunning,
      className: `w-full justify-start`
    })}
						${Button({
      variant: `ghost`,
      size: `sm`,
      onClick: () => this.resetDemo(),
      children: i18n(`\u91CD\u8A2D`),
      className: `w-full justify-start`
    })}
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u5B78\u751F\u8981\u770B\u4EC0\u9EBC`)}</div>
					<ul class="text-xs text-muted-foreground leading-6 list-disc pl-4">
						<li>${i18n(`A \u8DEF\u5F91\u662F\u5426\u7B97\u932F\uFF0C\u6216\u662F\u5426\u7528\u542B\u7CCA\u6587\u5B57\u907F\u958B\u7CBE\u78BA\u7B54\u6848\u3002`)}</li>
						<li>${i18n(`B \u8DEF\u5F91\u662F\u5426\u51FA\u73FE calculate() \u5DE5\u5177\u547C\u53EB\u3002`)}</li>
						<li>${i18n(`\u5DE5\u5177\u547C\u53EB\u88E1\u7684\u6578\u5B57\u3001\u62EC\u865F\u548C\u904B\u7B97\u5B50\u662F\u5426\u5C0D\u61C9\u539F\u984C\u3002`)}</li>
						<li>${i18n(`\u6700\u5F8C\u7B54\u6848\u662F\u5426\u7B49\u65BC\u53C3\u8003\u7B54\u6848\u3002`)}</li>
					</ul>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`calculate() \u662F\u4EC0\u9EBC\uFF1F`)}</div>
					<div class="text-xs text-muted-foreground leading-6 space-y-2">
						<p>${i18n(`\u53EF\u4EE5\u628A\u5B83\u60F3\u6210\u300C\u53EA\u6703\u7B97\u5F0F\u7684\u8FF7\u4F60\u7A0B\u5F0F\u300D\u3002\u6A21\u578B\u4E0D\u80FD\u4E1F\u4E00\u6574\u6BB5\u4E2D\u6587\u7D66\u5B83\uFF0C\u53EA\u80FD\u586B\u4E00\u500B\u6B04\u4F4D\u3002`)}</p>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`\u8F38\u5165`)}</div>
							<code class="block mt-1 break-all">${`{"expression":"(9876543219*12345679)-88888888888"}`}</code>
						</div>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`\u8F38\u51FA`)}</div>
							<code class="block mt-1 break-all">${`121,932,543,322,511,813`}</code>
						</div>
						<p>${i18n(`\u6240\u4EE5\u8981\u6AA2\u67E5\u5169\u4EF6\u4E8B\uFF1A\u6A21\u578B\u586B\u9032\u53BB\u7684 expression \u5C0D\u4E0D\u5C0D\uFF0C\u8A08\u7B97\u6A5F\u56DE\u4F86\u7684\u7B54\u6848\u6709\u6C92\u6709\u5C0D\u4E0A\u984C\u76EE\u3002`)}</p>
					</div>
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
__decorate([r()], CalculatorToolDemo.prototype, `mode`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `isRunning`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `pipelineStage`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `liveExpression`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `localResult`, void 0);
CalculatorToolDemo = __decorate([t(`calculator-tool-demo-v3`)], CalculatorToolDemo);
document.body.innerHTML = `<calculator-tool-demo-v3></calculator-tool-demo-v3>`;
export {
  CalculatorToolDemo
};
//# sourceMappingURL=5-2-calculator-tool.js.map
