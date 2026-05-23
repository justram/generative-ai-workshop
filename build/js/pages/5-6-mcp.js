import {
  o
} from "../chunks/chunk-6TTNE7IQ.js";
import {
  Pi,
  bR,
  m,
  v
} from "../chunks/chunk-QLBDILTC.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/5-6-mcp.js
var TOOL_LIST = [
  {
    name: `shell.date`,
    title: `\u8B80\u53D6\u76EE\u524D\u65E5\u671F\u6642\u9593`,
    description: `\u56DE\u50B3\u672C\u6A5F\u4F3A\u670D\u5668\u76EE\u524D\u6642\u9593\u3002\u53EA\u8B80\u3002`,
    risk: `read`
  },
  {
    name: `shell.pwd_list`,
    title: `\u8B80\u53D6\u76EE\u524D\u8CC7\u6599\u593E`,
    description: `\u56DE\u50B3\u6559\u5B78 app \u7684\u5DE5\u4F5C\u76EE\u9304\u8207\u524D\u5E7E\u500B\u6A94\u6848\u3002\u53EA\u8B80\u3002`,
    risk: `read`
  },
  {
    name: `runtime.node_version`,
    title: `\u8B80\u53D6 Node.js \u7248\u672C`,
    description: `\u56DE\u50B3\u672C\u6A5F Node.js \u7248\u672C\u3002\u53EA\u8B80\u3002`,
    risk: `read`
  },
  {
    name: `project.package_summary`,
    title: `\u8B80\u53D6 package.json \u6458\u8981`,
    description: `\u8B80\u53D6 app \u540D\u7A31\u3001scripts \u8207 Electron \u6253\u5305\u8A2D\u5B9A\u3002\u53EA\u8B80\u3002`,
    risk: `read`
  },
  {
    name: `notes.write_practice`,
    title: `\u5BEB\u5165\u7DF4\u7FD2\u7B46\u8A18`,
    description: `\u53EA\u5141\u8A31\u5BEB\u5165\u672C\u6A5F\u6559\u5B78\u6C99\u76D2\u88E1\u7684 mcp-practice-note.txt\u3002`,
    risk: `write`
  },
  {
    name: `notes.read_practice`,
    title: `\u8B80\u53D6\u7DF4\u7FD2\u7B46\u8A18`,
    description: `\u8B80\u53D6\u672C\u6A5F\u6559\u5B78\u6C99\u76D2\u88E1\u7684 mcp-practice-note.txt\u3002`,
    risk: `read`
  }
];
var EXAMPLES = [
  {
    title: `\u76EE\u524D\u65E5\u671F\uFF0F\u6642\u9593`,
    description: `\u53EA\u8B80\uFF1A\u53D6\u5F97\u5916\u90E8\u72C0\u614B`,
    prompt: `\u8ACB\u53D6\u5F97\u76EE\u524D\u65E5\u671F\u8207\u6642\u9593\uFF0C\u4E26\u7528\u4E00\u53E5\u8A71\u8AAA\u660E\u7D50\u679C\u3002`,
    defaultPlan: { tool: `shell.date`, arguments: {} }
  },
  {
    title: `\u76EE\u524D\u5DE5\u4F5C\u76EE\u9304`,
    description: `\u53EA\u8B80\uFF1Apwd + ls \u7684\u5B89\u5168\u66FF\u4EE3`,
    prompt: `\u8ACB\u986F\u793A\u76EE\u524D\u5DE5\u4F5C\u76EE\u9304\uFF0C\u4E26\u5217\u51FA\u524D 10 \u500B\u6A94\u6848\u6216\u8CC7\u6599\u593E\u3002\u4E0D\u8981\u4FEE\u6539\u4EFB\u4F55\u6A94\u6848\u3002`,
    defaultPlan: { tool: `shell.pwd_list`, arguments: { limit: 10 } }
  },
  {
    title: `Node.js \u7248\u672C`,
    description: `\u53EA\u8B80\uFF1A\u6AA2\u67E5\u672C\u6A5F\u57F7\u884C\u74B0\u5883`,
    prompt: `\u8ACB\u6AA2\u67E5\u76EE\u524D\u5B89\u88DD\u7684 Node.js \u7248\u672C\uFF0C\u4E26\u8AAA\u660E\u9019\u5C0D\u672C\u5730 Electron app \u6709\u4EC0\u9EBC\u610F\u7FA9\u3002`,
    defaultPlan: { tool: `runtime.node_version`, arguments: {} }
  },
  {
    title: `\u5C08\u6848\u8CC7\u8A0A\u6458\u8981`,
    description: `\u53EA\u8B80\uFF1A\u8B80\u53D6 package.json`,
    prompt: `\u8ACB\u8B80\u53D6 package.json\uFF0C\u6574\u7406\u9019\u500B app \u7684\u540D\u7A31\u3001\u4E3B\u8981 scripts\u3001Electron \u6253\u5305\u8A2D\u5B9A\u3002\u4E0D\u8981\u4FEE\u6539\u6A94\u6848\u3002`,
    defaultPlan: { tool: `project.package_summary`, arguments: {} }
  },
  {
    title: `\u5EFA\u7ACB\u7DF4\u7FD2\u7B46\u8A18`,
    description: `\u5BEB\u5165\uFF1A\u53D7\u63A7\u55AE\u4E00\u6A94\u6848`,
    prompt: `\u8ACB\u5EFA\u7ACB\u4E00\u500B mcp-practice-note.txt\uFF0C\u5167\u5BB9\u7528\u4E09\u9EDE\u8AAA\u660E MCP \u5DE5\u5177\u70BA\u4EC0\u9EBC\u9700\u8981\u6B0A\u9650\u63A7\u7BA1\u3002\u53EA\u5EFA\u7ACB\u9019\u500B\u6A94\u6848\uFF0C\u4E0D\u8981\u6539\u5176\u4ED6\u6A94\u6848\u3002`,
    defaultPlan: {
      tool: `notes.write_practice`,
      arguments: {
        content: `- MCP server \u53EF\u80FD\u8B93\u6A21\u578B\u8B80\u53D6\u672C\u6A5F\u8CC7\u6599\u3002
- \u80FD\u5BEB\u5165\u6216\u57F7\u884C\u547D\u4EE4\u7684\u5DE5\u5177\u8981\u6709\u4EBA\u5DE5\u78BA\u8A8D\u3002
- \u6B0A\u9650\u8981\u9650\u5236\u5728\u6559\u5B78\u6C99\u76D2\uFF0C\u4E0D\u8981\u76F4\u63A5\u63A5\u5230\u91CD\u8981\u8CC7\u6599\u3002`
      }
    }
  },
  {
    title: `\u6AA2\u67E5\u525B\u525B\u7684\u6A94\u6848`,
    description: `\u53EA\u8B80\uFF1A\u8B80\u56DE\u5DE5\u5177\u8F38\u51FA`,
    prompt: `\u8ACB\u8B80\u53D6 mcp-practice-note.txt\uFF0C\u78BA\u8A8D\u5167\u5BB9\u662F\u5426\u7B26\u5408\u8981\u6C42\uFF0C\u4E26\u56DE\u5831\u6A94\u6848\u8DEF\u5F91\u3002\u4E0D\u8981\u4FEE\u6539\u6A94\u6848\u3002`,
    defaultPlan: { tool: `notes.read_practice`, arguments: {} }
  }
];
function normalizePlan(plan, fallback) {
  const tool = typeof plan?.tool === `string` ? plan.tool : fallback.tool;
  const argumentsObject = plan?.arguments && typeof plan.arguments === `object` ? plan.arguments : fallback.arguments ?? {};
  return { tool, arguments: argumentsObject };
}
var MCPDemoInteractive = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u6A21\u578B\u4E0A\u4E0B\u6587\u5354\u5B9A\uFF1A\u5DE5\u5177\u4E0D\u662F\u76F4\u63A5\u585E\u9032\u6A21\u578B\u88E1`);
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
    this.session = new o({ authTokenProvider: v });
    this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`));
    this.session.setTools([]);
    this.session.setSystemPrompt(
      i18n(`\u4F60\u662F\u4E00\u4F4D\u6559\u5B78\u52A9\u7406\u3002\u8ACB\u6839\u64DA\u5DE5\u5177\u7D50\u679C\u56DE\u7B54\uFF0C\u4E0D\u8981\u8072\u7A31\u4F60\u76F4\u63A5\u78B0\u5230\u4F7F\u7528\u8005\u96FB\u8166\u3002`)
    );
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = false;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.showDebugToggle = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.loadToolList();
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
          params: {}
        })
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
        `\u672C\u6A5F MCP \u6559\u5B78\u7AEF\u9EDE\u5C1A\u672A\u9023\u7DDA\u3002\u8ACB\u91CD\u65B0\u555F\u52D5\u672C\u6A5F app \u6216 dev server\uFF0C\u8B93 /api/mcp-demo \u8F09\u5165\u3002`
      );
    }
  }
  resetDemo() {
    this.session.abort();
    this.session.clearMessages();
    this.session.patch({
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: /* @__PURE__ */ new Set()
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
        `\u672C\u6A5F MCP \u6559\u5B78\u7AEF\u9EDE\u672A\u9023\u7DDA\uFF0C\u9019\u6B21\u4E0D\u4F7F\u7528\u5047\u8CC7\u6599\u66FF\u4EE3\u3002\u8ACB\u91CD\u65B0\u555F\u52D5 app \u5F8C\u518D\u8A66\u3002`
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
      content: [{ type: `text`, text: example.prompt }],
      timestamp: Date.now()
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
    const plannerSession = new o({
      authTokenProvider: v
    });
    plannerSession.setModel(this.session.state.model ?? Pi(`openai-codex`, `gpt-5.4-mini`));
    plannerSession.setTools([]);
    plannerSession.setSystemPrompt(`\u4F60\u662F MCP client \u7684\u8DEF\u7531\u5668\u3002\u8ACB\u628A\u4F7F\u7528\u8005\u9700\u6C42\u8F49\u6210\u4E00\u500B JSON \u7269\u4EF6\uFF0C\u4E0D\u8981\u56DE\u7B54\u554F\u984C\u672C\u8EAB\u3002\u683C\u5F0F\u53EA\u80FD\u662F {"tool":"\u5DE5\u5177\u540D\u7A31","arguments":{...}}\u3002
\u53EF\u7528\u5DE5\u5177\uFF1A
${TOOL_LIST.map((tool) => `- ${tool.name}: ${tool.description}`).join(`
`)}`);
    const run = plannerSession.prompt(example.prompt).catch(() => {
    });
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
    const candidates = streamMessage ? [...plannerSession.state.messages, streamMessage] : plannerSession.state.messages;
    for (const message of [...candidates].reverse()) {
      if (message.role !== `assistant`) continue;
      const text = message.content?.filter((part) => part.type === `text`).map((part) => part.text).join(`
`);
      if (!text) continue;
      const match = text.match(/\{[\s\S]*"tool"\s*:\s*"[^"]+"[\s\S]*\}/);
      if (!match) continue;
      try {
        return JSON.parse(match[0]);
      } catch {
      }
    }
    return void 0;
  }
  async callMcpTool(plan) {
    this.mcpRequest = {
      jsonrpc: `2.0`,
      id: Date.now(),
      method: `tools/call`,
      params: { name: plan.tool, arguments: plan.arguments ?? {} }
    };
    try {
      const response = await fetch(`/api/mcp-demo`, {
        method: `POST`,
        headers: { "content-type": `application/json` },
        body: JSON.stringify(this.mcpRequest)
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
          isError: true
        }
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
          arguments: plan.arguments ?? {}
        }
      ],
      api: `local-mcp-demo`,
      provider: `local`,
      model: `mcp`,
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
      toolName: plan.tool,
      output: response.result?.content?.[0]?.text ?? JSON.stringify(response, null, 2),
      details: response.result?.structuredContent ?? response,
      isError: Boolean(response.result?.isError || response.error),
      timestamp: Date.now()
    });
  }
  async generateFinalAnswer(example, plan, response) {
    const output = response.result?.content?.[0]?.text ?? ``;
    const risk = TOOL_LIST.find((tool) => tool.name === plan.tool)?.risk === `write` ? `\u5BEB\u5165\u578B\u5DE5\u5177\uFF0C\u63D0\u9192\u8981\u4EBA\u5DE5\u78BA\u8A8D` : `\u53EA\u8B80\u5DE5\u5177\uFF0C\u63D0\u9192\u5DE5\u5177\u7D50\u679C\u4ECD\u6703\u9032\u5165\u6A21\u578B\u4E0A\u4E0B\u6587`;
    const finalSession = new o({ authTokenProvider: v });
    finalSession.setModel(this.session.state.model ?? Pi(`openai-codex`, `gpt-5.4-mini`));
    finalSession.setTools([]);
    finalSession.setSystemPrompt(
      `\u4F60\u662F\u7E41\u9AD4\u4E2D\u6587\u6559\u5B78\u52A9\u7406\u3002\u8ACB\u6839\u64DA MCP \u5DE5\u5177\u7D50\u679C\u56DE\u7B54\u5B78\u751F\u539F\u672C\u554F\u984C\uFF0C\u8A9E\u6C23\u81EA\u7136\u7CBE\u7C21\u3002\u6700\u5F8C\u7528\u4E00\u53E5\u8A71\u9EDE\u51FA MCP \u548C\u524D\u9762\u5DE5\u5177\u547C\u53EB\u7684\u5DEE\u5225\uFF1A\u524D\u9762\u7684\u5DE5\u5177\u591A\u534A\u662F app \u5167\u5EFA\uFF1BMCP \u662F\u5916\u90E8 server \u5148\u5BA3\u544A\u5DE5\u5177\u6E05\u55AE\uFF0Cclient \u518D\u7528\u6A19\u6E96\u5354\u5B9A\u547C\u53EB\u3002\u4E0D\u8981\u63D0\u5230 JSON\u3002`
    );
    const prompt = `\u5B78\u751F\u554F\u984C\uFF1A
${example.prompt}

MCP \u5DE5\u5177\uFF1A${plan.tool}
\u5DE5\u5177\u53C3\u6578\uFF1A
${JSON.stringify(plan.arguments ?? {}, null, 2)}

\u5DE5\u5177\u7D50\u679C\uFF1A
${output}

\u98A8\u96AA\u63D0\u793A\uFF1A${risk}`;
    const run = finalSession.prompt(prompt).catch(() => {
    });
    await Promise.race([run, new Promise((resolve) => setTimeout(resolve, 45e3))]);
    const text = this.extractAssistantText(finalSession);
    if (text) return text;
    return `${output}

\u89C0\u5BDF\u91CD\u9EDE\uFF1A\u524D\u9762\u7684\u5DE5\u5177\u591A\u534A\u662F app \u5167\u5EFA\uFF1BMCP \u662F\u5916\u90E8 server \u5148\u5BA3\u544A\u5DE5\u5177\u6E05\u55AE\uFF0Cclient \u518D\u7528\u6A19\u6E96\u5354\u5B9A\u547C\u53EB\u3002`;
  }
  extractAssistantText(session) {
    const streamMessage = session.state.streamMessage;
    const candidates = streamMessage ? [...session.state.messages, streamMessage] : session.state.messages;
    for (const message of [...candidates].reverse()) {
      if (message.role !== `assistant`) continue;
      const text = message.content?.filter((part) => part.type === `text`).map((part) => part.text).join(`
`).trim();
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
          text: answer
        }
      ],
      api: `local-mcp-demo`,
      provider: `local`,
      model: `mcp`,
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
    const seconds = Math.max(0, milliseconds) / 1e3;
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
    return b`
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
    return b`
			<details class="mt-2 rounded-md border border-border bg-background/75">
				<summary class="cursor-pointer select-none px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
					${title}
				</summary>
				<div class="border-t border-border px-3 pb-3 pt-1">${this.renderJsonPreview(i18n(`\u5354\u5B9A\u5167\u5BB9`), value)}</div>
			</details>
		`;
  }
  renderProgressMarker(active, done, index) {
    if (done) {
      return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    }
    if (active) {
      return b`
				<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15">
					<div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div>
				</div>
			`;
    }
    return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${index}</div>`;
  }
  renderPipelineStep(id, index, label, meaning, detail, hasConnector = true) {
    const order = this.getPipelineOrder();
    const currentIndex = order.indexOf(this.pipelineStage);
    const stepIndex = order.indexOf(id);
    const active = this.pipelineStage === id && this.pipelineStage !== `done`;
    const done = currentIndex > stepIndex || this.pipelineStage === `done`;
    const stateClass = active ? `border-amber-400/70 bg-amber-400/10` : done ? `border-emerald-500/40 bg-emerald-500/10` : `border-border bg-muted/15`;
    return b`
			<div class="rounded-lg border ${stateClass} p-3">
				<div class="flex gap-3">
					<div class="relative shrink-0">
						${hasConnector ? b`<div class="absolute left-1/2 top-7 h-[calc(100%+1rem)] w-px -translate-x-1/2 bg-border"></div>` : ``}
						${this.renderProgressMarker(active, done, index)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<div class="text-sm font-bold text-foreground">${label}</div>
							${active ? b`<span class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">${i18n(`\u9032\u884C\u4E2D`)}</span>` : ``}
							${done ? b`<span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">${i18n(`\u5B8C\u6210`)}</span>` : ``}
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">${meaning}</div>
						${detail ? b`<div class="mt-2">${detail}</div>` : ``}
					</div>
				</div>
			</div>
		`;
  }
  renderPipeline() {
    if (this.mode !== `run`) return ``;
    const previewPlan = this.plannedCall ?? this.currentExample?.defaultPlan ?? { tool: `shell.date`, arguments: {} };
    const previewManifest = this.mcpToolManifest ?? {
      jsonrpc: `2.0`,
      id: 1,
      result: {
        tools: TOOL_LIST.map((tool) => ({
          name: tool.name,
          description: tool.description
        }))
      }
    };
    const previewRequest = this.mcpRequest ?? {
      jsonrpc: `2.0`,
      id: 1,
      method: `tools/call`,
      params: {
        name: previewPlan.tool,
        arguments: previewPlan.arguments ?? {}
      }
    };
    const compactManifest = {
      jsonrpc: previewManifest.jsonrpc ?? `2.0`,
      id: previewManifest.id ?? 1,
      result: {
        tools: (previewManifest.result?.tools ?? TOOL_LIST).map((tool) => ({
          name: tool.name,
          description: tool.description,
          risk: tool.risk ?? `read`
        }))
      }
    };
    const compactResponse = this.mcpResponse ? {
      jsonrpc: this.mcpResponse.jsonrpc,
      id: this.mcpResponse.id,
      result: {
        isError: Boolean(this.mcpResponse.result?.isError || this.mcpResponse.error),
        content: this.mcpResponse.result?.content,
        structuredContent: this.mcpResponse.result?.structuredContent
      }
    } : void 0;
    const completed = this.getCompletedPipelineCount();
    const total = this.getPipelineOrder().length;
    const progress = Math.round(completed / total * 100);
    const elapsedMilliseconds = Math.max(
      0,
      (this.traceFinishedAt || this.traceNow || Date.now()) - (this.traceStartedAt || Date.now())
    );
    return b`
			<div class="border-b border-border bg-card/70 px-4 py-3">
				<details class="group rounded-xl border border-border bg-background/70" ?open=${this.traceExpanded} @toggle=${(event) => this.traceExpanded = event.currentTarget.open}>
					<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
						<div class="min-w-0">
							<div class="flex flex-wrap items-center gap-3">
								<div class="text-sm font-bold text-foreground">${i18n(`MCP \u6D41\u7A0B\u6AA2\u8996`)}</div>
								<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${completed}/${total} ${i18n(`\u5B8C\u6210`)}</div>
								<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(elapsedMilliseconds)}</div>
							</div>
							<div class="mt-1 text-xs leading-5 text-muted-foreground">
								${i18n(`\u9019\u88E1\u770B\u7684\u662F\u5354\u5B9A\u6D41\u7A0B\uFF0C\u4E0D\u662F\u804A\u5929\u5167\u5BB9\uFF1Aserver \u5BA3\u544A\u5DE5\u5177\uFF0Cclient \u547C\u53EB\uFF0C\u7D50\u679C\u518D\u56DE\u5230\u6A21\u578B\u3002`)}
							</div>
							<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
								<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${progress}%`}></div>
							</div>
						</div>
						<span class="shrink-0 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground">${this.traceExpanded ? i18n(`\u6536\u5408`) : i18n(`\u5C55\u958B`)}</span>
					</summary>
					<div class="overflow-y-auto border-t border-border p-4 overscroll-contain" style="max-height:42vh">
						<div class="mb-3 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs leading-6 text-muted-foreground">
							<span class="font-bold text-foreground">${i18n(`\u65B0\u6982\u5FF5\uFF1A`)}</span>
							${i18n(`\u524D\u9762\u7AE0\u7BC0\u662F app \u76F4\u63A5\u628A\u5DE5\u5177\u4EA4\u7D66\u6A21\u578B\uFF1B\u9019\u88E1\u591A\u4E86\u4E00\u5C64 MCP server\u3002AI app \u5148\u554F server\u300C\u4F60\u6709\u54EA\u4E9B\u5DE5\u5177\uFF1F\u300D\u518D\u7528\u6A19\u6E96\u683C\u5F0F\u547C\u53EB\u3002`)}
						</div>
						<div class="grid gap-3">
							${this.renderPipelineStep(
      `discover`,
      0,
      i18n(`\u767C\u73FE\u5DE5\u5177`),
      i18n(
        `MCP server \u5148\u56DE\u8986\u5DE5\u5177\u6E05\u55AE\u3002\u9019\u4E00\u6B65\u6C7A\u5B9A\u6A21\u578B\u7B49\u4E00\u4E0B\u300C\u770B\u5F97\u5230\u300D\u54EA\u4E9B\u80FD\u529B\uFF0C\u4E5F\u6C7A\u5B9A\u6B0A\u9650\u908A\u754C\u5728\u54EA\u88E1\u3002`
      ),
      this.renderProtocolDetail(i18n(`tools/list response`), compactManifest)
    )}
							${this.renderPipelineStep(
      `model`,
      1,
      i18n(`\u6A21\u578B\u9078\u5DE5\u5177`),
      i18n(`\u6A21\u578B\u8B80\u5230\u5DE5\u5177\u6E05\u55AE\u5F8C\uFF0C\u628A\u5B78\u751F\u7684\u81EA\u7136\u8A9E\u8A00\u554F\u984C\u8F49\u6210\u300C\u8981\u7528\u54EA\u500B\u5DE5\u5177\u3001\u5E36\u54EA\u4E9B\u53C3\u6578\u300D\u3002`),
      b`
									<div class="rounded-md border border-border bg-background/75 p-3 text-xs leading-5 text-muted-foreground">
										<div><span class="font-semibold text-foreground">${i18n(`\u5DE5\u5177\uFF1A`)}</span>${previewPlan.tool}</div>
										<div><span class="font-semibold text-foreground">${i18n(`\u53C3\u6578\uFF1A`)}</span>${JSON.stringify(previewPlan.arguments ?? {})}</div>
									</div>
									${this.renderProtocolDetail(i18n(`\u6A21\u578B\u7522\u751F\u7684\u5DE5\u5177\u610F\u5716`), previewPlan)}
								`
    )}
							${this.renderPipelineStep(
      `call`,
      2,
      i18n(`client \u547C\u53EB server`),
      i18n(
        `MCP client \u628A\u5DE5\u5177\u540D\u7A31\u8207\u53C3\u6578\u5305\u6210 tools/call request\u3002server \u53EA\u61C9\u8A72\u57F7\u884C\u81EA\u5DF1\u5141\u8A31\u7684\u5DE5\u5177\u3002`
      ),
      this.renderProtocolDetail(i18n(`tools/call request`), previewRequest)
    )}
							${this.renderPipelineStep(
      `result`,
      3,
      i18n(`server \u56DE\u50B3\u7D50\u679C`),
      i18n(
        `\u5DE5\u5177\u5728\u5916\u90E8 server \u57F7\u884C\uFF0C\u7D50\u679C\u518D\u7528\u6A19\u6E96\u683C\u5F0F\u56DE\u5230 app\u3002\u9019\u500B\u7D50\u679C\u6703\u9032\u5165\u6A21\u578B\u4E0A\u4E0B\u6587\uFF0C\u6210\u70BA\u56DE\u7B54\u7684\u4F9D\u64DA\u3002`
      ),
      compactResponse ? this.renderProtocolDetail(i18n(`tools/call response`), compactResponse) : b`<div class="text-xs text-muted-foreground">${i18n(`\u7B49\u5F85 MCP server \u56DE\u50B3\u7D50\u679C\u3002`)}</div>`
    )}
							${this.renderPipelineStep(
      `answer`,
      4,
      i18n(`\u6A21\u578B\u6574\u7406\u56DE\u7B54`),
      i18n(
        `\u6A21\u578B\u4E0D\u9700\u8981\u77E5\u9053\u5DE5\u5177\u600E\u9EBC\u5BE6\u4F5C\uFF0C\u53EA\u6839\u64DA\u5DE5\u5177\u7D50\u679C\uFF0C\u7528\u5B78\u751F\u770B\u5F97\u61C2\u7684\u65B9\u5F0F\u56DE\u7B54\u539F\u672C\u554F\u984C\u3002`
      ),
      this.generatedAnswer ? b`<div class="rounded-md border border-border bg-background/75 p-3 text-xs leading-5 text-muted-foreground">${this.generatedAnswer}</div>` : b`<div class="text-xs text-muted-foreground">${i18n(`\u7B49\u5F85\u6A21\u578B\u6574\u7406\u7B54\u6848\u3002`)}</div>`
    )}
							${this.renderPipelineStep(
      `done`,
      5,
      i18n(`\u5C0D\u7167\u804A\u5929\u5340`),
      i18n(
        `\u804A\u5929\u5340\u53EA\u7559\u4E0B\u5B78\u751F\u554F\u984C\u3001\u5DE5\u5177\u5361\u3001\u5DE5\u5177\u7D50\u679C\u8207\u6A21\u578B\u56DE\u7B54\uFF1B\u5354\u5B9A\u7D30\u7BC0\u7559\u5728\u9019\u500B\u6AA2\u8996\u88E1\uFF0C\u907F\u514D\u5E72\u64FE\u4E00\u822C\u5C0D\u8A71\u3002`
      ),
      void 0,
      false
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
      return b`
				<div class="rounded-md border ${done ? `border-border bg-muted/30` : `border-emerald-500/50 bg-emerald-500/10`} p-3 text-xs leading-6">
					<div class="font-bold text-foreground mb-1">${done ? i18n(`\u5DF2\u5B8C\u6210\uFF1AMCP \u5DE5\u5177\u547C\u53EB`) : i18n(`\u6B63\u5728\u8DD1\uFF1AMCP \u5DE5\u5177\u547C\u53EB`)}</div>
					<div class="text-muted-foreground">
						${done ? i18n(
        `\u8ACB\u5C0D\u7167\u4E2D\u592E\u6D41\u7A0B\u6AA2\u8996\u8207\u804A\u5929\u5340\uFF1A\u5354\u5B9A\u7D30\u7BC0\u7559\u5728\u6D41\u7A0B\u88E1\uFF0C\u804A\u5929\u5340\u53EA\u4FDD\u7559\u5B78\u751F\u771F\u6B63\u9700\u8981\u770B\u7684\u4E92\u52D5\u3002`
      ) : i18n(
        `\u8ACB\u7279\u5225\u770B\u7B2C 0 \u6B65\uFF1Aserver \u5148\u5BA3\u544A\u5DE5\u5177\u6E05\u55AE\u3002\u9019\u5C31\u662F MCP \u548C\u524D\u9762 app \u5167\u5EFA\u5DE5\u5177\u6700\u5927\u7684\u4E0D\u540C\u3002`
      )}
					</div>
				</div>
			`;
    }
    return b`
			<div class="rounded-md border border-border bg-muted/30 p-3 text-xs leading-6 text-muted-foreground">
				${i18n(`\u5148\u9078\u4E00\u500B MCP \u4EFB\u52D9\u3002\u9019\u9801\u8981\u770B\u7684\u4E0D\u662F\u53C8\u591A\u4E00\u500B\u5DE5\u5177\uFF0C\u800C\u662F\u5DE5\u5177\u5F9E\u54EA\u88E1\u4F86\uFF1A\u524D\u9762\u662F app \u5167\u5EFA\u5DE5\u5177\uFF1BMCP \u662F\u5916\u90E8 server \u5148\u5BA3\u544A\u5DE5\u5177\uFF0Cclient \u518D\u547C\u53EB\u3002`)}
			</div>
		`;
  }
  renderComparisonPanel() {
    return b`
			<div class="rounded-lg border border-border bg-card p-3">
				<div class="text-sm font-bold mb-2">${i18n(`\u548C\u524D\u9762\u5DE5\u5177\u547C\u53EB\u5DEE\u5728\u54EA\uFF1F`)}</div>
				<div class="grid grid-cols-2 gap-2 text-xs">
					<div class="rounded-md border border-border bg-muted/25 p-2">
						<div class="font-bold text-foreground">${i18n(`\u524D\u9762\uFF1Aapp \u5167\u5EFA\u5DE5\u5177`)}</div>
						<div class="mt-1 text-muted-foreground leading-5">
							${i18n(`calculate()\u3001get_current_time()\u3001artifacts() \u90FD\u662F\u9019\u500B app \u81EA\u5DF1\u63D0\u4F9B\u7D66\u6A21\u578B\u7684\u80FD\u529B\u3002\u63DB\u4E00\u500B app\uFF0C\u901A\u5E38\u8981\u91CD\u505A\u4E00\u6B21\u6574\u5408\u3002`)}
						</div>
					</div>
					<div class="rounded-md border border-primary/40 bg-primary/10 p-2">
						<div class="font-bold text-foreground">MCP server</div>
						<div class="mt-1 text-muted-foreground leading-5">
							${i18n(`\u5DE5\u5177\u4F4F\u5728\u5916\u90E8 server\u3002AI app \u5148\u7528 tools/list \u8B80\u53D6\u80FD\u529B\u6E05\u55AE\uFF0C\u518D\u7528 tools/call \u547C\u53EB\u3002\u7406\u8AD6\u4E0A\u540C\u4E00\u500B server \u53EF\u4EE5\u7D66\u4E0D\u540C app \u4F7F\u7528\u3002`)}
						</div>
					</div>
				</div>
				<div class="mt-2 rounded-md border border-amber-500/40 bg-amber-500/10 p-2 text-xs leading-5 text-muted-foreground">
					${i18n(`\u6240\u4EE5 MCP \u4E0D\u662F\u300C\u66F4\u6703\u7528\u5DE5\u5177\u300D\uFF1B\u5B83\u662F\u628A\u5DE5\u5177\u7684\u767C\u73FE\u3001\u547C\u53EB\u3001\u6B0A\u9650\u908A\u754C\u6A19\u6E96\u5316\u3002\u98A8\u96AA\u4E5F\u8DDF\u8457\u96C6\u4E2D\u5230 server \u6B0A\u9650\u8A2D\u8A08\u3002`)}
				</div>
			</div>
		`;
  }
  renderToolCard(tool) {
    const riskClass = tool.risk === `write` ? `bg-amber-500/15 text-amber-300` : `bg-emerald-500/15 text-emerald-300`;
    return b`
			<div class="rounded-md border border-border bg-muted/25 p-2">
				<div class="flex items-start justify-between gap-2">
					<div class="min-w-0">
						<div class="text-xs font-bold text-foreground">${tool.name}</div>
						<div class="text-xs text-muted-foreground leading-5 mt-1">${tool.description}</div>
					</div>
					<span class="shrink-0 rounded-full px-2 py-0.5 text-[11px] ${riskClass}">${tool.risk === `write` ? i18n(`\u5BEB\u5165`) : i18n(`\u53EA\u8B80`)}</span>
				</div>
			</div>
		`;
  }
  renderExample(example) {
    return b`
			<button
				@click=${() => this.runExample(example)}
				class="w-full text-left p-3 rounded-md border border-border hover:bg-muted/50 transition-colors ${this.currentExample?.title === example.title ? `bg-muted/40` : ``} ${this.mcpConnected ? `` : `opacity-50 cursor-not-allowed`}"
				?disabled=${this.isRunning || !this.mcpConnected}
			>
				<div class="text-sm font-medium text-foreground">${example.title}</div>
				<div class="text-xs text-muted-foreground mt-1">${example.description}</div>
			</button>
		`;
  }
  renderContentPanel() {
    return b`
			<div class="h-full bg-background flex flex-col">
				<div class="border-b border-border p-3">${this.renderStatus()}</div>
				${this.renderPipeline()}
				<div class="flex-1 min-h-0 p-4 pb-4">${this.agentInterface}</div>
			</div>
		`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`MCP \u662F\u54EA\u4E09\u6BB5\uFF1F`)}</div>
					<div class="grid grid-cols-3 gap-2 text-xs">
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">${i18n(`\u6A21\u578B`)}</div><div class="text-muted-foreground mt-1">${i18n(`\u6C7A\u5B9A\u610F\u5716`)}</div></div>
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">MCP client</div><div class="text-muted-foreground mt-1">${i18n(`\u9001 request`)}</div></div>
						<div class="rounded-md bg-muted/30 p-2"><div class="font-bold text-foreground">MCP server</div><div class="text-muted-foreground mt-1">${i18n(`\u57F7\u884C\u6388\u6B0A\u5DE5\u5177`)}</div></div>
					</div>
				</div>

				${this.renderComparisonPanel()}

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="flex items-center gap-2">
						<span class="w-2 h-2 rounded-full ${this.mcpConnected ? `bg-green-500` : `bg-destructive`}"></span>
						<span class="text-sm font-medium text-foreground">
							${this.mcpConnected ? i18n(`\u6559\u5B78 MCP server \u5DF2\u9023\u7DDA`) : i18n(`\u6559\u5B78 MCP server \u672A\u9023\u7DDA`)}
						</span>
					</div>
					${this.mcpError ? b`<div class="mt-2 text-xs text-muted-foreground leading-5">${this.mcpError}</div>` : ``}
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u5DE5\u5177\u6E05\u55AE\uFF1Aserver \u5BA3\u544A\u81EA\u5DF1\u80FD\u505A\u4EC0\u9EBC`)}</div>
					<div class="space-y-2">${TOOL_LIST.map((tool) => this.renderToolCard(tool))}</div>
				</div>

				<div class="rounded-lg border border-border bg-card p-3">
					<div class="text-sm font-bold mb-2">${i18n(`\u73FE\u5834\u64CD\u4F5C`)}</div>
					<div class="space-y-2">${EXAMPLES.map((example) => this.renderExample(example))}</div>
					${Button({ variant: `ghost`, size: `sm`, onClick: () => this.resetDemo(), children: i18n(`\u91CD\u8A2D`), className: `w-full justify-start mt-3` })}
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
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
MCPDemoInteractive = __decorate([t(`mcp-demo-interactive`)], MCPDemoInteractive);
document.body.innerHTML = `<mcp-demo-interactive></mcp-demo-interactive>`;
export {
  MCPDemoInteractive
};
//# sourceMappingURL=5-6-mcp.js.map
