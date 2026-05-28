import { Button, __decorate, i18n, r, t$1, x } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface, getModel } from "../workshop-runtime/AgentRuntime.js";
import { getAuthToken } from "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession } from "../workshop-runtime/AgentSession.js";
import { getSectionFiveContent } from "./section-5-content.js";

const TOOL_LIST = [
  {
    name: `shell.date`,
    title: `讀取目前日期時間`,
    description: `回傳本機伺服器目前時間。只讀。`,
    risk: `read`,
  },
  {
    name: `shell.pwd_list`,
    title: `讀取目前資料夾`,
    description: `回傳教學 app 的工作目錄與前幾個檔案。只讀。`,
    risk: `read`,
  },
  {
    name: `runtime.node_version`,
    title: `讀取 Node.js 版本`,
    description: `回傳本機 Node.js 版本。只讀。`,
    risk: `read`,
  },
  {
    name: `project.package_summary`,
    title: `讀取 package.json 摘要`,
    description: `讀取 app 名稱、scripts 與 Electron 打包設定。只讀。`,
    risk: `read`,
  },
  {
    name: `notes.write_practice`,
    title: `寫入練習筆記`,
    description: `只允許寫入本機教學沙盒裡的 mcp-practice-note.txt。`,
    risk: `write`,
  },
  {
    name: `notes.read_practice`,
    title: `讀取練習筆記`,
    description: `讀取本機教學沙盒裡的 mcp-practice-note.txt。`,
    risk: `read`,
  },
];

const EXAMPLES = [
  {
    title: `目前日期／時間`,
    description: `只讀：取得外部狀態`,
    prompt: `請取得目前日期與時間，並用一句話說明結果。`,
    defaultPlan: { tool: `shell.date`, arguments: {} },
  },
  {
    title: `目前工作目錄`,
    description: `只讀：pwd + ls 的安全替代`,
    prompt: `請顯示目前工作目錄，並列出前 10 個檔案或資料夾。不要修改任何檔案。`,
    defaultPlan: { tool: `shell.pwd_list`, arguments: { limit: 10 } },
  },
  {
    title: `Node.js 版本`,
    description: `只讀：檢查本機執行環境`,
    prompt: `請檢查目前安裝的 Node.js 版本，並說明這對本地 Electron app 有什麼意義。`,
    defaultPlan: { tool: `runtime.node_version`, arguments: {} },
  },
  {
    title: `專案資訊摘要`,
    description: `只讀：讀取 package.json`,
    prompt: `請讀取 package.json，整理這個 app 的名稱、主要 scripts、Electron 打包設定。不要修改檔案。`,
    defaultPlan: { tool: `project.package_summary`, arguments: {} },
  },
  {
    title: `建立練習筆記`,
    description: `寫入：受控單一檔案`,
    prompt: `請建立一個 mcp-practice-note.txt，內容用三點說明 MCP 工具為什麼需要權限控管。只建立這個檔案，不要改其他檔案。`,
    defaultPlan: {
      tool: `notes.write_practice`,
      arguments: {
        content: `- MCP server 可能讓模型讀取本機資料。\n- 能寫入或執行命令的工具要有人工確認。\n- 權限要限制在教學沙盒，不要直接接到重要資料。`,
      },
    },
  },
  {
    title: `檢查剛剛的檔案`,
    description: `只讀：讀回工具輸出`,
    prompt: `請讀取 mcp-practice-note.txt，確認內容是否符合要求，並回報檔案路徑。不要修改檔案。`,
    defaultPlan: { tool: `notes.read_practice`, arguments: {} },
  },
];

function normalizePlan(plan, fallback) {
  const tool = typeof plan?.tool === `string` ? plan.tool : fallback.tool;
  const argumentsObject =
    plan?.arguments && typeof plan.arguments === `object`
      ? plan.arguments
      : (fallback.arguments ?? {});
  return { tool, arguments: argumentsObject };
}

let MCPDemoInteractive = class extends DemoBase {
  constructor() {
    super();
    this.headerTitle = i18n(`模型上下文協定：工具不是直接塞進模型裡`);
    this.sectionId = `5.6`;
    this.mode = `intro`;
    this.isRunning = false;
    this.pipelineStage = `idle`;
    this.currentExample = null;
    this.plannedCall = null;
    this.mcpRequest = null;
    this.mcpResponse = null;
    this.mcpToolManifest = null;
    this.mcpConnected = false;
    this.mcpSource = `checking`;
    this.mcpError = ``;
    this.generatedAnswer = ``;
    this.traceExpanded = true;
    this.traceStartedAt = 0;
    this.traceFinishedAt = 0;
    this.traceNow = 0;
    this.traceTimer = null;
    this.session = new AgentSession({ authTokenProvider: getAuthToken });
    this.session.setModel(getModel(`openai-codex`, `gpt-5.4-mini`));
    this.session.setTools([]);
    this.session.setSystemPrompt(
      i18n(`你是一位教學助理。請根據工具結果回答，不要聲稱你直接碰到使用者電腦。`),
    );
    this.agentInterface = new AgentInterface();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = false;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.showDebugToggle = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.loadToolList();
  }

  get sectionContent() {
    return getSectionFiveContent(`5.6`);
  }

  async loadToolList() {
    try {
      const response = await fetch(`/api/mcp-demo`, {
        method: `POST`,
        headers: { "content-type": `application/json` },
        body: JSON.stringify({
          jsonrpc: `2.0`,
          id: 1,
          method: `tools/list`,
          params: {},
        }),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const payload = await response.json();
      this.mcpConnected = Array.isArray(payload.result?.tools);
      this.mcpToolManifest = payload;
      this.mcpSource = `local-server`;
      this.mcpError = ``;
    } catch {
      this.mcpConnected = false;
      this.mcpSource = `disconnected`;
      this.mcpError = i18n(
        `本機 MCP 教學端點尚未連線。請重新啟動本機 app 或 dev server，讓 /api/mcp-demo 載入。`,
      );
    }
  }

  resetDemo() {
    this.session.abort();
    this.session.clearMessages();
    this.session.patch({
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: new Set(),
    });
    this.mode = `intro`;
    this.isRunning = false;
    this.pipelineStage = `idle`;
    this.currentExample = null;
    this.plannedCall = null;
    this.mcpRequest = null;
    this.mcpResponse = null;
    this.generatedAnswer = ``;
    this.traceExpanded = true;
    this.traceStartedAt = 0;
    this.traceFinishedAt = 0;
    this.traceNow = 0;
    this.stopTraceClock();
  }

  async runExample(example) {
    if (this.isRunning) return;
    if (!this.mcpConnected) {
      this.mcpError = i18n(
        `本機 MCP 教學端點未連線，這次不使用假資料替代。請重新啟動 app 後再試。`,
      );
      return;
    }
    this.resetDemo();
    this.isRunning = true;
    this.mode = `run`;
    this.currentExample = example;
    this.pipelineStage = `discover`;
    this.startTraceClock();
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: i18n(example.prompt) }],
      timestamp: Date.now(),
    });
    await this.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 650));
    this.pipelineStage = `model`;
    const plan = await this.planToolCall(example);
    this.plannedCall = plan;
    this.pipelineStage = `call`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    const response = await this.callMcpTool(plan);
    this.mcpResponse = response;
    this.pipelineStage = `result`;
    await new Promise((resolve) => setTimeout(resolve, 450));
    this.appendVisibleToolMessages(plan, response);
    this.pipelineStage = `answer`;
    this.generatedAnswer = await this.generateFinalAnswer(example, plan, response);
    this.appendFinalAnswer(plan, response, this.generatedAnswer);
    this.pipelineStage = `done`;
    this.isRunning = false;
    this.stopTraceClock();
    this.requestUpdate();
  }

  async planToolCall(example) {
    const plannerSession = new AgentSession({
      authTokenProvider: getAuthToken,
    });
    plannerSession.setModel(this.session.state.model ?? getModel(`openai-codex`, `gpt-5.4-mini`));
    plannerSession.setTools([]);
    plannerSession.setSystemPrompt(`你是 MCP client 的路由器。請把使用者需求轉成一個 JSON 物件，不要回答問題本身。格式只能是 {"tool":"工具名稱","arguments":{...}}。
可用工具：
${TOOL_LIST.map((tool) => `- ${tool.name}: ${tool.description}`).join(`\n`)}`);
    const run = plannerSession.prompt(i18n(example.prompt)).catch(() => {});
    for (let attempt = 0; attempt < 80; attempt += 1) {
      const parsed = this.extractPlan(plannerSession);
      if (parsed) {
        plannerSession.abort();
        await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 500))]);
        return normalizePlan(parsed, example.defaultPlan);
      }
      await new Promise((resolve) => setTimeout(resolve, 250));
    }
    plannerSession.abort();
    return example.defaultPlan;
  }

  extractPlan(plannerSession) {
    const streamMessage = plannerSession.state.streamMessage;
    const candidates = streamMessage
      ? [...plannerSession.state.messages, streamMessage]
      : plannerSession.state.messages;
    for (const message of [...candidates].reverse()) {
      if (message.role !== `assistant`) continue;
      const text = message.content
        ?.filter((part) => part.type === `text`)
        .map((part) => part.text)
        .join(`\n`);
      if (!text) continue;
      const match = text.match(/\{[\s\S]*"tool"\s*:\s*"[^"]+"[\s\S]*\}/);
      if (!match) continue;
      try {
        return JSON.parse(match[0]);
      } catch {}
    }
    return undefined;
  }

  async callMcpTool(plan) {
    this.mcpRequest = {
      jsonrpc: `2.0`,
      id: Date.now(),
      method: `tools/call`,
      params: { name: plan.tool, arguments: plan.arguments ?? {} },
    };
    try {
      const response = await fetch(`/api/mcp-demo`, {
        method: `POST`,
        headers: { "content-type": `application/json` },
        body: JSON.stringify(this.mcpRequest),
      });
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      return await response.json();
    } catch (error) {
      return {
        jsonrpc: `2.0`,
        id: this.mcpRequest.id,
        result: {
          content: [{ type: `text`, text: error.message || String(error) }],
          structuredContent: {},
          isError: true,
        },
      };
    }
  }

  appendVisibleToolMessages(plan, response) {
    const toolCallId = `mcp-demo-${Date.now()}`;
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `toolCall`,
          id: toolCallId,
          name: plan.tool,
          arguments: plan.arguments ?? {},
        },
      ],
      api: `local-mcp-demo`,
      provider: `local`,
      model: `mcp`,
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
      toolName: plan.tool,
      output: response.result?.content?.[0]?.text ?? JSON.stringify(response, null, 2),
      details: response.result?.structuredContent ?? response,
      isError: Boolean(response.result?.isError || response.error),
      timestamp: Date.now(),
    });
  }

  async generateFinalAnswer(example, plan, response) {
    const output = response.result?.content?.[0]?.text ?? ``;
    const risk =
      TOOL_LIST.find((tool) => tool.name === plan.tool)?.risk === `write`
        ? `寫入型工具，提醒要人工確認`
        : `只讀工具，提醒工具結果仍會進入模型上下文`;
    const finalSession = new AgentSession({ authTokenProvider: getAuthToken });
    finalSession.setModel(this.session.state.model ?? getModel(`openai-codex`, `gpt-5.4-mini`));
    finalSession.setTools([]);
    finalSession.setSystemPrompt(
      `你是繁體中文教學助理。請根據 MCP 工具結果回答學生原本問題，語氣自然精簡。最後用一句話點出 MCP 和前面工具呼叫的差別：前面的工具多半是 app 內建；MCP 是外部 server 先宣告工具清單，client 再用標準協定呼叫。不要提到 JSON。`,
    );
    const prompt = `學生問題：
${example.prompt}

MCP 工具：${plan.tool}
工具參數：
${JSON.stringify(plan.arguments ?? {}, null, 2)}

工具結果：
${output}

風險提示：${risk}`;
    const run = finalSession.prompt(prompt).catch(() => {});
    await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 45000))]);
    const text = this.extractAssistantText(finalSession);
    if (text) return text;
    return `${output}\n\n觀察重點：前面的工具多半是 app 內建；MCP 是外部 server 先宣告工具清單，client 再用標準協定呼叫。`;
  }

  extractAssistantText(session) {
    const streamMessage = session.state.streamMessage;
    const candidates = streamMessage
      ? [...session.state.messages, streamMessage]
      : session.state.messages;
    for (const message of [...candidates].reverse()) {
      if (message.role !== `assistant`) continue;
      const text = message.content
        ?.filter((part) => part.type === `text`)
        .map((part) => part.text)
        .join(`\n`)
        .trim();
      if (text) return text;
    }
    return ``;
  }

  appendFinalAnswer(plan, response, answer) {
    this.session.appendMessage({
      role: `assistant`,
      content: [
        {
          type: `text`,
          text: answer,
        },
      ],
      api: `local-mcp-demo`,
      provider: `local`,
      model: `mcp`,
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

  startTraceClock() {
    this.stopTraceClock();
    this.traceStartedAt = Date.now();
    this.traceFinishedAt = 0;
    this.traceNow = this.traceStartedAt;
    this.traceTimer = window.setInterval(() => {
      this.traceNow = Date.now();
    }, 500);
  }

  stopTraceClock() {
    if (this.traceTimer) {
      window.clearInterval(this.traceTimer);
      this.traceTimer = null;
    }
    if (this.traceStartedAt && !this.traceFinishedAt && this.pipelineStage === `done`) {
      this.traceFinishedAt = Date.now();
      this.traceNow = this.traceFinishedAt;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.stopTraceClock();
  }

  formatElapsedTime(milliseconds) {
    const seconds = Math.max(0, milliseconds) / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  getPipelineOrder() {
    return [`discover`, `model`, `call`, `result`, `answer`, `done`];
  }

  getCompletedPipelineCount() {
    const order = this.getPipelineOrder();
    const currentIndex = order.indexOf(this.pipelineStage);
    if (this.pipelineStage === `done`) return order.length;
    return Math.max(0, currentIndex);
  }

  renderJsonPreview(title, value) {
    return x`
			<div class="mt-2 rounded-md border border-border bg-background/80 p-2">
				<div class="flex items-center justify-between gap-2 text-[11px] font-semibold text-foreground">
					<span>${title}</span>
					<span class="text-muted-foreground">JSON-RPC</span>
				</div>
				<pre class="mt-2 max-h-44 overflow-auto whitespace-pre-wrap break-words text-[11px] leading-5 text-muted-foreground">${JSON.stringify(value, null, 2)}</pre>
			</div>
		`;
  }

  renderProtocolDetail(title, value) {
    return x`
			<details class="mt-2 rounded-md border border-border bg-background/75">
				<summary class="cursor-pointer select-none px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
					${title}
				</summary>
				<div class="border-t border-border px-3 pb-3 pt-1">${this.renderJsonPreview(i18n(`協定內容`), value)}</div>
			</details>
		`;
  }

  renderProgressMarker(active, done, index) {
    if (done) {
      return x`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    }
    if (active) {
      return x`
				<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15">
					<div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div>
				</div>
			`;
    }
    return x`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${index}</div>`;
  }

  renderPipelineStep(id, index, label, meaning, detail, hasConnector = true) {
    const order = this.getPipelineOrder();
    const currentIndex = order.indexOf(this.pipelineStage);
    const stepIndex = order.indexOf(id);
    const active = this.pipelineStage === id && this.pipelineStage !== `done`;
    const done = currentIndex > stepIndex || this.pipelineStage === `done`;
    const stateClass = active
      ? `border-amber-400/70 bg-amber-400/10`
      : done
        ? `border-emerald-500/40 bg-emerald-500/10`
        : `border-border bg-muted/15`;
    return x`
			<div class="rounded-lg border ${stateClass} p-3">
				<div class="flex gap-3">
					<div class="relative shrink-0">
						${hasConnector ? x`<div class="absolute left-1/2 top-7 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-border"></div>` : ``}
						${this.renderProgressMarker(active, done, index)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<div class="text-sm font-bold text-foreground">${label}</div>
							${active ? x`<span class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">${i18n(`進行中`)}</span>` : ``}
							${done ? x`<span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">${i18n(`完成`)}</span>` : ``}
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">${meaning}</div>
						${detail ? x`<div class="mt-2">${detail}</div>` : ``}
					</div>
				</div>
			</div>
		`;
  }

  renderPipeline() {
    if (this.mode !== `run`) return ``;
    const previewPlan = this.plannedCall ??
      this.currentExample?.defaultPlan ?? { tool: `shell.date`, arguments: {} };
    const previewManifest = this.mcpToolManifest ?? {
      jsonrpc: `2.0`,
      id: 1,
      result: {
        tools: TOOL_LIST.map((tool) => ({
          name: tool.name,
          description: tool.description,
        })),
      },
    };
    const previewRequest = this.mcpRequest ?? {
      jsonrpc: `2.0`,
      id: 1,
      method: `tools/call`,
      params: {
        name: previewPlan.tool,
        arguments: previewPlan.arguments ?? {},
      },
    };
    const compactManifest = {
      jsonrpc: previewManifest.jsonrpc ?? `2.0`,
      id: previewManifest.id ?? 1,
      result: {
        tools: (previewManifest.result?.tools ?? TOOL_LIST).map((tool) => ({
          name: tool.name,
          description: tool.description,
          risk: tool.risk ?? `read`,
        })),
      },
    };
    const compactResponse = this.mcpResponse
      ? {
          jsonrpc: this.mcpResponse.jsonrpc,
          id: this.mcpResponse.id,
          result: {
            isError: Boolean(this.mcpResponse.result?.isError || this.mcpResponse.error),
            content: this.mcpResponse.result?.content,
            structuredContent: this.mcpResponse.result?.structuredContent,
          },
        }
      : undefined;
    const completed = this.getCompletedPipelineCount();
    const total = this.getPipelineOrder().length;
    const progress = Math.round((completed / total) * 100);
    const elapsedMilliseconds = Math.max(
      0,
      (this.traceFinishedAt || this.traceNow || Date.now()) - (this.traceStartedAt || Date.now()),
    );
    return x`
			<div class="border-b border-border bg-card/70 px-4 py-3">
				<details class="group rounded-xl border border-border bg-background/70" ?open=${this.traceExpanded} @toggle=${(event) => (this.traceExpanded = event.currentTarget.open)}>
					<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-3">
								<div class="text-sm font-bold text-foreground">${i18n(`MCP 流程檢視`)}</div>
								<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${completed}/${total} ${i18n(`完成`)}</div>
								<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(elapsedMilliseconds)}</div>
							</div>
							<div class="mt-1 text-xs leading-5 text-muted-foreground">
								${i18n(`這裡看的是協定流程，不是聊天內容：server 宣告工具，client 呼叫，結果再回到模型。`)}
							</div>
							<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
								<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${progress}%`}></div>
							</div>
						</div>
						<span class="shrink-0 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground">${this.traceExpanded ? i18n(`收合`) : i18n(`展開`)}</span>
					</summary>
					<div class="overflow-y-auto border-t border-border p-4 overscroll-contain" style="max-height:42vh">
						<div class="mb-3 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs leading-6 text-muted-foreground">
							<span class="font-bold text-foreground">${i18n(`新概念：`)}</span>
							${i18n(`前面章節是 app 直接把工具交給模型；這裡多了一層 MCP server。AI app 先問 server「你有哪些工具？」再用標準格式呼叫。`)}
						</div>
						<div class="grid gap-3">
							${this.renderPipelineStep(
                `discover`,
                0,
                i18n(`發現工具`),
                i18n(
                  `MCP server 先回覆工具清單。這一步決定模型等一下「看得到」哪些能力，也決定權限邊界在哪裡。`,
                ),
                this.renderProtocolDetail(i18n(`tools/list response`), compactManifest),
              )}
							${this.renderPipelineStep(
                `model`,
                1,
                i18n(`模型選工具`),
                i18n(`模型讀到工具清單後，把學生的自然語言問題轉成「要用哪個工具、帶哪些參數」。`),
                x`
									<div class="rounded-md border border-border bg-background/75 p-3 text-xs leading-5 text-muted-foreground">
										<div><span class="font-semibold text-foreground">${i18n(`工具：`)}</span>${previewPlan.tool}</div>
										<div><span class="font-semibold text-foreground">${i18n(`參數：`)}</span>${JSON.stringify(previewPlan.arguments ?? {})}</div>
									</div>
									${this.renderProtocolDetail(i18n(`模型產生的工具意圖`), previewPlan)}
								`,
              )}
							${this.renderPipelineStep(
                `call`,
                2,
                i18n(`client 呼叫 server`),
                i18n(
                  `MCP client 把工具名稱與參數包成 tools/call request。server 只應該執行自己允許的工具。`,
                ),
                this.renderProtocolDetail(i18n(`tools/call request`), previewRequest),
              )}
							${this.renderPipelineStep(
                `result`,
                3,
                i18n(`server 回傳結果`),
                i18n(
                  `工具在外部 server 執行，結果再用標準格式回到 app。這個結果會進入模型上下文，成為回答的依據。`,
                ),
                compactResponse
                  ? this.renderProtocolDetail(i18n(`tools/call response`), compactResponse)
                  : x`<div class="text-xs text-muted-foreground">${i18n(`等待 MCP server 回傳結果。`)}</div>`,
              )}
							${this.renderPipelineStep(
                `answer`,
                4,
                i18n(`模型整理回答`),
                i18n(
                  `模型不需要知道工具怎麼實作，只根據工具結果，用學生看得懂的方式回答原本問題。`,
                ),
                this.generatedAnswer
                  ? x`<div class="rounded-md border border-border bg-background/75 p-3 text-xs leading-5 text-muted-foreground">${this.generatedAnswer}</div>`
                  : x`<div class="text-xs text-muted-foreground">${i18n(`等待模型整理答案。`)}</div>`,
              )}
							${this.renderPipelineStep(
                `done`,
                5,
                i18n(`對照聊天區`),
                i18n(
                  `聊天區只留下學生問題、工具卡、工具結果與模型回答；協定細節留在這個檢視裡，避免干擾一般對話。`,
                ),
                undefined,
                false,
              )}
						</div>
					</div>
				</details>
			</div>
		`;
  }

  renderStatus() {
    if (this.mode === `run`) {
      const done = this.pipelineStage === `done`;
      return x`
				<div class="rounded-md border ${done ? `border-border bg-muted/30` : `border-emerald-500/50 bg-emerald-500/10`} p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${done ? i18n(`已完成：MCP 工具呼叫`) : i18n(`正在跑：MCP 工具呼叫`)}</div>
					<div class="text-muted-foreground">
						${
              done
                ? i18n(
                    `請對照中央流程檢視與聊天區：協定細節留在流程裡，聊天區只保留學生真正需要看的互動。`,
                  )
                : i18n(
                    `請特別看第 0 步：server 先宣告工具清單。這就是 MCP 和前面 app 內建工具最大的不同。`,
                  )
            }
					</div>
				</div>
			`;
    }
    return x`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`先選一個 MCP 任務。這頁要看的不是又多一個工具，而是工具從哪裡來：前面是 app 內建工具；MCP 是外部 server 先宣告工具，client 再呼叫。`)}
			</div>
		`;
  }

  renderComparisonPanel() {
    return x`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-2">${i18n(`和前面工具呼叫差在哪？`)}</div>
				<div class="grid grid-cols-2 gap-2 text-xs">
					<div class="rounded-md border border-border bg-muted/25 p-2">
						<div class="font-bold text-foreground">${i18n(`前面：app 內建工具`)}</div>
						<div class="mt-1 text-muted-foreground leading-5">
							${i18n(`calculate()、get_current_time()、artifacts() 都是這個 app 自己提供給模型的能力。換一個 app，通常要重做一次整合。`)}
						</div>
					</div>
					<div class="rounded-md border border-primary/40 bg-primary/10 p-2">
						<div class="font-bold text-foreground">MCP server</div>
						<div class="mt-1 text-muted-foreground leading-5">
							${i18n(`工具住在外部 server。AI app 先用 tools/list 讀取能力清單，再用 tools/call 呼叫。理論上同一個 server 可以給不同 app 使用。`)}
						</div>
					</div>
				</div>
				<div class="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs leading-5 text-muted-foreground">
					${i18n(`所以 MCP 不是「更會用工具」；它是把工具的發現、呼叫、權限邊界標準化。風險也跟著集中到 server 權限設計。`)}
				</div>
			</div>
		`;
  }

  renderToolCard(tool) {
    const riskClass =
      tool.risk === `write`
        ? `bg-amber-500/15 text-amber-300`
        : `bg-emerald-500/15 text-emerald-300`;
    return x`
			<div class="rounded-md border border-border bg-muted/25 p-2">
				<div class="flex items-start justify-between gap-2">
					<div class="min-w-0">
						<div class="text-xs font-bold text-foreground">${tool.name}</div>
						<div class="text-xs text-muted-foreground leading-5 mt-1">${i18n(tool.description)}</div>
					</div>
					<span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] ${riskClass}">${tool.risk === `write` ? i18n(`寫入`) : i18n(`只讀`)}</span>
				</div>
			</div>
		`;
  }

  renderExample(example) {
    return x`
			<button
				@click=${() => this.runExample(example)}
				class="w-full text-left p-3 rounded-md border border-border hover:bg-muted/50 transition-colors ${this.currentExample?.title === example.title ? `bg-muted/40` : ``} ${this.mcpConnected ? `` : `opacity-50 cursor-not-allowed`}"
				?disabled=${this.isRunning || !this.mcpConnected}
			>
				<div class="text-sm font-medium text-foreground">${i18n(example.title)}</div>
				<div class="text-xs text-muted-foreground mt-1">${i18n(example.description)}</div>
			</button>
		`;
  }

  renderContentPanel() {
    return x`
			<div class="h-full bg-background flex flex-col">
				<div class="border-b border-border p-3">${this.renderStatus()}</div>
				${this.renderPipeline()}
				<div class="flex-1 min-h-0 p-4 pb-4"><agent-interface-host .agentInterface=${this.agentInterface}></agent-interface-host></div>
			</div>
		`;
  }

  renderLeftDemoPanel() {
    return x`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`MCP 是哪三段？`)}</div>
					<div class="grid grid-cols-3 gap-2 text-xs">
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">${i18n(`模型`)}</div><div class="text-muted-foreground mt-1">${i18n(`決定意圖`)}</div></div>
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">MCP client</div><div class="text-muted-foreground mt-1">${i18n(`送 request`)}</div></div>
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">MCP server</div><div class="text-muted-foreground mt-1">${i18n(`執行授權工具`)}</div></div>
					</div>
				</div>

				${this.renderComparisonPanel()}

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full ${this.mcpConnected ? `bg-green-500` : `bg-destructive`}"></span>
						<span class="text-sm font-medium text-foreground">
							${this.mcpConnected ? i18n(`教學 MCP server 已連線`) : i18n(`教學 MCP server 未連線`)}
						</span>
					</div>
					${this.mcpError ? x`<div class="mt-2 text-xs text-muted-foreground leading-5">${this.mcpError}</div>` : ``}
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`工具清單：server 宣告自己能做什麼`)}</div>
					<div class="space-y-2">${TOOL_LIST.map((tool) => this.renderToolCard(tool))}</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`現場操作`)}</div>
					<div class="space-y-2">${EXAMPLES.map((example) => this.renderExample(example))}</div>
					${Button({ variant: `ghost`, size: `sm`, onClick: () => this.resetDemo(), children: i18n(`重設`), className: `w-full justify-start mt-3` })}
				</div>
			</div>
		`;
  }

  renderRightDemoPanel() {
    return x`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};

__decorate([r()], MCPDemoInteractive.prototype, `mode`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `isRunning`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `pipelineStage`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `currentExample`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `plannedCall`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpRequest`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpResponse`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpToolManifest`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpConnected`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpSource`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `mcpError`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `generatedAnswer`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `traceExpanded`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `traceStartedAt`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `traceFinishedAt`, void 0);
__decorate([r()], MCPDemoInteractive.prototype, `traceNow`, void 0);
MCPDemoInteractive = __decorate([t$1(`mcp-demo-interactive`)], MCPDemoInteractive);
document.body.innerHTML = `<mcp-demo-interactive></mcp-demo-interactive>`;
export { MCPDemoInteractive };
