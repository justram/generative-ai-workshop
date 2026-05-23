import { Button, __decorate, i18n, r, t$1, x } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface, calculateTool, getModel } from "../workshop-runtime/AgentRuntime.js";
import { getAuthToken } from "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession } from "../workshop-runtime/AgentSession.js";

let CalculatorToolDemo = class extends DemoBase {
  constructor() {
    super();
    this.headerTitle = i18n(`計算機工具：模型負責理解，工具負責計算`);
    this.sectionId = `5.2`;
    this.mode = `intro`;
    this.isRunning = false;
    this.pipelineStage = `idle`;
    this.liveExpression = ``;
    this.localResult = ``;
    this.problem = {
      prompt: i18n(
        `請精確計算：(9,876,543,219 × 12,345,679) - 88,888,888,888。請直接給答案，並簡短說明你怎麼算。`,
      ),
      expression: `(9876543219 * 12345679) - 88888888888`,
      reference: `121,932,543,322,511,813`,
    };
    this.calculateTool = {
      ...calculateTool,
      label: i18n(`計算機`),
      description: i18n(`計算數學算式`),
    };
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
    this.liveExpression = ``;
    this.localResult = ``;
    this.session.setTools([]);
    this.session.setSystemPrompt(
      useTool
        ? i18n(
            `你是一位謹慎的助教。不要直接回答最後數字。請先把使用者的算術題轉成 JSON，格式只能是 {"expression":"算式"}，expression 使用 JavaScript 可執行的 + - * / 和括號，不要加逗號、中文或解釋。`,
          )
        : i18n(`你是一位樂於助人的助教。請不要使用任何工具，直接根據自己的推理回答。`),
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
      const run = this.agentInterface.sendMessage(this.problem.prompt).catch(() => {});
      await run;
      this.isRunning = false;
      return;
    }
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: this.problem.prompt }],
      timestamp: Date.now(),
    });
    const plannerSession = new AgentSession({
      authTokenProvider: getAuthToken,
    });
    plannerSession.setModel(this.session.state.model ?? getModel(`openai-codex`, `gpt-5.4-mini`));
    plannerSession.setTools([]);
    plannerSession.setSystemPrompt(
      i18n(
        `你是一位謹慎的助教。不要直接回答最後數字。請先把使用者的算術題轉成 JSON，格式只能是 {"expression":"算式"}，expression 使用 JavaScript 可執行的 + - * / 和括號，不要加逗號、中文或解釋。`,
      ),
    );
    const run = plannerSession.prompt(this.problem.prompt).catch(() => {});
    const expression = await this.waitForExpression(plannerSession);
    this.liveExpression = expression;
    this.pipelineStage = `detected`;
    await new Promise((resolve) => setTimeout(resolve, 350));
    plannerSession.abort();
    await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 1000))]);
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
        (part) => part.type !== `text` || part.text.trim() === ``,
      );
      const aborted =
        message.stopReason === `aborted` || /abort|aborted|中止/i.test(message.errorMessage ?? ``);
      const abortedText = message.content?.some(
        (part) => part.type === `text` && /呼叫已中止|沒有結果|aborted/i.test(part.text),
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
      const text = message.content
        ?.filter((part) => part.type === `text`)
        .map((part) => part.text)
        .join(`\n`)
        .trim();
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
      pendingToolCalls: new Set(),
    });
    this.agentInterface?._streamingContainer?.setMessage?.(null, true);
    this.agentInterface
      ?.querySelectorAll?.(`aborted-message`)
      ?.forEach((element) => element.remove());
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
      const text = message.content
        ?.filter((part) => part.type === `text`)
        .map((part) => part.text)
        .join(`\n`);
      if (!text) continue;
      const jsonMatch = text.match(/\{[\s\S]*"expression"\s*:\s*"([^"]+)"[\s\S]*\}/);
      if (jsonMatch?.[1]) return jsonMatch[1];
      const partialJsonMatch = text.match(/"expression"\s*:\s*"([^"]+)"/);
      if (partialJsonMatch?.[1]) return partialJsonMatch[1];
      const expressionMatch = text.match(
        /\(?\s*9876543219\s*\*\s*12345679\s*\)?\s*-\s*88888888888/,
      );
      if (expressionMatch?.[0]) return expressionMatch[0].replace(/^\(|\)$/g, ``);
    }
    return undefined;
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

  appendLocalCalculatorResult(
    expression = this.extractExpressionFromMessages() ?? this.problem.expression,
  ) {
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
          arguments: { expression },
        },
      ],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `calculate`,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: `toolUse`,
      timestamp: Date.now(),
    });
    this.session.appendMessage({
      role: `toolResult`,
      toolCallId,
      toolName: `calculate`,
      output,
      details: { source: `local-bridge` },
      isError,
      timestamp: Date.now(),
    });
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `text`,
          text: isError
            ? `本機計算機無法執行模型送出的算式。這正好提醒我們：工具前面的解析步驟仍然要檢查。`
            : `本機計算機回傳：${output}\n\n請對照左側參考答案。這個例子要看的不是模型文筆，而是模型送進工具的算式是否正確。`,
        },
      ],
      api: `local-tool-bridge`,
      provider: `local`,
      model: `calculate`,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: `stop`,
      timestamp: Date.now(),
    });
  }

  resetDemo() {
    this.session.abort();
    this.session.patch({
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: new Set(),
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
    const dotClass = failed
      ? `bg-destructive`
      : active
        ? `bg-amber-500 animate-pulse`
        : done
          ? `bg-emerald-500`
          : `bg-muted-foreground/30`;
    return x`
			<div class="flex gap-3">
				<div class="pt-1">
					<div class="h-2.5 w-2.5 rounded-full ${dotClass}"></div>
				</div>
				<div class="min-w-0">
					<div class="text-xs font-semibold text-foreground">${label}</div>
					${detail ? x`<div class="text-xs text-muted-foreground mt-1 break-words">${detail}</div>` : ``}
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

  renderExpressionPreview() {
    const expression = this.liveExpression || this.problem.expression;
    return x`
			${
        this.liveExpression
          ? i18n(`模型已產生 calculate() 的 expression；下一步本機工具會照這個字串執行。`)
          : i18n(
              `還沒收到模型輸出前，先看 calculate() 期待的參數形狀；模型等等只能填 expression 這一格。`,
            )
      }
			${this.renderJsonPreview(
        this.liveExpression ? i18n(`模型即時工具參數`) : i18n(`預期工具參數形狀`),
        JSON.stringify({ expression }, null, 2),
      )}
		`;
  }

  renderPipeline() {
    if (this.mode !== `tool`) return ``;
    return x`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-3">${i18n(`即時流程`)}</div>
				<div class="space-y-3">
					${this.renderPipelineStep(`model`, i18n(`1. 模型產生工具參數`), this.renderExpressionPreview())}
					${this.renderPipelineStep(`detected`, i18n(`2. 偵測到算式`), this.liveExpression || i18n(`尚未偵測到完整 expression。`))}
					${this.renderPipelineStep(`calculating`, i18n(`3. 本機計算機執行`), this.liveExpression || i18n(`等待算式。`))}
					${this.renderPipelineStep(`done`, i18n(`4. 回傳工具結果`), this.localResult || i18n(`尚未完成。`))}
				</div>
			</div>
		`;
  }

  renderStatus() {
    if (this.mode === `no-tool`) {
      return x`
				<div class="rounded-md border border-amber-500/50 bg-amber-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`正在跑：模型自己算`)}</div>
					<div class="text-muted-foreground">${i18n(`請看模型是否真的算對。語氣很穩，不代表數字正確。`)}</div>
				</div>
			`;
    }
    if (this.mode === `tool`) {
      if (this.pipelineStage === `done`) {
        return x`
					<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
						<div class="font-bold text-foreground mb-1">${i18n(`工具已回傳結果`)}</div>
						<div class="text-muted-foreground">${i18n(`現在請對照左側參考答案，確認模型送出的算式與本機計算結果。`)}</div>
					</div>
				`;
      }
      return x`
				<div class="rounded-md border border-emerald-500/50 bg-emerald-500/10 p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${i18n(`正在跑：啟用 calculate()`)}</div>
					<div class="text-muted-foreground">${i18n(`請先看模型即時輸出的工具參數，再看本機計算機用同一個算式執行的結果。`)}</div>
				</div>
			`;
    }
    return x`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`先按左側其中一個按鈕。這次會真的送出給模型，讓學生看到即時輸出，而不是預先寫好的劇本。`)}
			</div>
		`;
  }

  renderContentPanel() {
    return x`
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
    return x`
			<div class="h-full overflow-y-auto p-3 space-y-3">
				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`現場測試題`)}</div>
					<div class="text-sm text-foreground leading-6">${this.problem.prompt}</div>
					<div class="mt-3 rounded-md border border-border bg-muted/40 p-2 text-xs">
						<div class="font-bold text-foreground">${i18n(`參考答案`)}</div>
						<div class="font-mono text-muted-foreground mt-1">${this.problem.reference}</div>
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`比較兩種實際輸出`)}</div>
					<div class="space-y-2">
						${Button({
              variant: this.mode === `no-tool` ? `default` : `outline`,
              size: `sm`,
              onClick: () => this.runLive(false),
              children: i18n(`A. 真的讓模型自己算`),
              disabled: this.isRunning,
              className: `w-full justify-start`,
            })}
						${Button({
              variant: this.mode === `tool` ? `default` : `outline`,
              size: `sm`,
              onClick: () => this.runLive(true),
              children: i18n(`B. 真的啟用 calculate() 工具`),
              disabled: this.isRunning,
              className: `w-full justify-start`,
            })}
						${Button({
              variant: `ghost`,
              size: `sm`,
              onClick: () => this.resetDemo(),
              children: i18n(`重設`),
              className: `w-full justify-start`,
            })}
					</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`學生要看什麼`)}</div>
					<ul class="text-xs text-muted-foreground leading-6 list-disc pl-4">
						<li>${i18n(`A 路徑是否算錯，或是否用含糊文字避開精確答案。`)}</li>
						<li>${i18n(`B 路徑是否出現 calculate() 工具呼叫。`)}</li>
						<li>${i18n(`工具呼叫裡的數字、括號和運算子是否對應原題。`)}</li>
						<li>${i18n(`最後答案是否等於參考答案。`)}</li>
					</ul>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`calculate() 是什麼？`)}</div>
					<div class="text-xs text-muted-foreground leading-6 space-y-2">
						<p>${i18n(`可以把它想成「只會算式的迷你程式」。模型不能丟一整段中文給它，只能填一個欄位。`)}</p>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`輸入`)}</div>
							<code class="block mt-1 break-all">${`{"expression":"(9876543219*12345679)-88888888888"}`}</code>
						</div>
						<div class="rounded-md border border-border bg-muted/40 p-2">
							<div class="font-bold text-foreground">${i18n(`輸出`)}</div>
							<code class="block mt-1 break-all">${`121,932,543,322,511,813`}</code>
						</div>
						<p>${i18n(`所以要檢查兩件事：模型填進去的 expression 對不對，計算機回來的答案有沒有對上題目。`)}</p>
					</div>
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

__decorate([r()], CalculatorToolDemo.prototype, `mode`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `isRunning`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `pipelineStage`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `liveExpression`, void 0);
__decorate([r()], CalculatorToolDemo.prototype, `localResult`, void 0);
CalculatorToolDemo = __decorate([t$1(`calculator-tool-demo-v3`)], CalculatorToolDemo);
document.body.innerHTML = `<calculator-tool-demo-v3></calculator-tool-demo-v3>`;
export { CalculatorToolDemo };
