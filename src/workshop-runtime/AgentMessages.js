import {
  Button,
  createRef,
  html,
  i$1 as LitElement,
  i18n,
  iconBugLine,
  iconCheckLine,
  iconCloseLine,
  iconFileCopy2Line,
  iconLoader4Line,
  ref,
} from "../mini-lit/index.js";
import "./CodeBlock.js";
import { formatCost, formatTokenCount, models } from "./AgentModels.js";

const toolRenderers = new Map();

export function registerToolRenderer(name, renderer) {
  if (!name) return;
  toolRenderers.set(name, renderer);
}

function messageText(message) {
  if (!message?.content) return "";
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function pretty(value) {
  if (value === undefined) return "";
  if (typeof value === "string") {
    try {
      return JSON.stringify(JSON.parse(value), null, 2);
    } catch {
      return value;
    }
  }
  try {
    return JSON.stringify(value, null, 2);
  } catch {
    return String(value);
  }
}

function renderMarkdown(text) {
  return html`<markdown-block .content=${text || ""}></markdown-block>`;
}

function renderUsage(usage) {
  if (!usage) return "";
  const pieces = [];
  if (usage.input) pieces.push(`${i18n("Input")}: ${formatTokenCount(usage.input)}`);
  if (usage.output) pieces.push(`${i18n("Output")}: ${formatTokenCount(usage.output)}`);
  if (usage.cacheRead) pieces.push(`${i18n("Cache read")}: ${formatTokenCount(usage.cacheRead)}`);
  if (usage.cost?.total) pieces.push(`${i18n("Cost")}: ${formatCost(usage.cost.total)}`);
  return pieces.join(" · ");
}

function renderToolParams(toolName, args, pending) {
  const renderer = toolRenderers.get(toolName);
  if (renderer?.renderParams) return renderer.renderParams(args, pending);
  return html`<code-block .code=${pretty(args)} language="json"></code-block>`;
}

function renderToolResult(toolName, args, result) {
  const renderer = toolRenderers.get(toolName);
  if (renderer?.renderResult) return renderer.renderResult(args, result);
  if (!result) return "";
  return html`<code-block .code=${pretty(result.output)} language="text"></code-block>`;
}

export class UserMessage extends LitElement {
  static properties = {
    message: { type: Object },
  };

  createRenderRoot() {
    return this;
  }

  renderAttachments() {
    const attachments = this.message?.attachments ?? [];
    if (!attachments.length) return "";
    return html`<attachment-tile-list .files=${attachments}></attachment-tile-list>`;
  }

  render() {
    return html`
      <div class="py-4 px-4 border-l-4 border-primary/70">
        ${renderMarkdown(messageText(this.message))} ${this.renderAttachments()}
      </div>
    `;
  }
}

export class AssistantMessage extends LitElement {
  static properties = {
    hideToolCalls: { type: Boolean },
    isStreaming: { type: Boolean },
    message: { type: Object },
    pendingToolCalls: { type: Object },
    toolResultsById: { type: Object },
    tools: { type: Array },
  };

  constructor() {
    super();
    this.hideToolCalls = false;
    this.isStreaming = false;
    this.pendingToolCalls = new Set();
    this.toolResultsById = new Map();
    this.tools = [];
  }

  createRenderRoot() {
    return this;
  }

  renderPart(part, index) {
    if (part.type === "text") return html`<div>${renderMarkdown(part.text)}</div>`;
    if (part.type === "thinking") {
      return html`
        <details class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
          <summary class="cursor-pointer font-medium">${i18n("Reasoning")}</summary>
          <div class="mt-2 whitespace-pre-wrap text-muted-foreground">${part.thinking}</div>
        </details>
      `;
    }
    if (part.type === "toolCall" && !this.hideToolCalls) {
      const tool = this.tools?.find((item) => item.name === part.name);
      const result = this.toolResultsById?.get(part.id);
      const pending = this.pendingToolCalls?.has(part.id);
      const aborted = !result && !pending && !this.isStreaming;
      return html`
        <tool-message
          .key=${part.id ?? index}
          .tool=${tool}
          .toolCall=${part}
          .result=${result}
          .pending=${pending}
          .aborted=${aborted}
          .isStreaming=${this.isStreaming}
        ></tool-message>
      `;
    }
    return "";
  }

  render() {
    const content = Array.isArray(this.message?.content) ? this.message.content : [];
    return html`
      <div class="px-4 flex flex-col gap-3">
        ${content.map((part, index) => this.renderPart(part, index))}
        ${this.message?.usage
          ? html`<div class="text-xs text-muted-foreground">
              ${renderUsage(this.message.usage)}
            </div>`
          : ""}
        ${this.message?.stopReason === "error" && this.message?.errorMessage
          ? html`
              <div class="rounded-lg bg-destructive/10 p-3 text-sm text-destructive">
                <strong>${i18n("Error:")}</strong> ${this.message.errorMessage}
              </div>
            `
          : ""}
        ${this.message?.stopReason === "aborted"
          ? html`<span class="text-sm text-destructive italic">${i18n("Request aborted")}</span>`
          : ""}
      </div>
    `;
  }
}

export class ToolMessageDebugView extends LitElement {
  static properties = {
    callArgs: { type: Object },
    hasResult: { type: Boolean },
    result: { type: Object },
  };

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="mt-3 flex flex-col gap-2">
        <div>
          <div class="mb-1 text-xs font-medium text-muted-foreground">${i18n("Call")}</div>
          <code-block .code=${pretty(this.callArgs)} language="json"></code-block>
        </div>
        <div>
          <div class="mb-1 text-xs font-medium text-muted-foreground">${i18n("Result")}</div>
          ${this.hasResult
            ? html`<code-block .code=${pretty(this.result?.output)} language="text"></code-block>`
            : html`<div class="text-xs text-muted-foreground">${i18n("(no result)")}</div>`}
        </div>
      </div>
    `;
  }
}

export class ToolMessage extends LitElement {
  static properties = {
    aborted: { type: Boolean },
    isStreaming: { type: Boolean },
    pending: { type: Boolean },
    result: { type: Object },
    tool: { type: Object },
    toolCall: { type: Object },
    _showDebug: { state: true },
  };

  constructor() {
    super();
    this.aborted = false;
    this.isStreaming = false;
    this.pending = false;
    this._showDebug = false;
  }

  createRenderRoot() {
    return this;
  }

  renderStatus() {
    if (this.pending || (this.isStreaming && !this.result)) {
      return html`<span class="inline-block animate-spin text-muted-foreground"
        >${iconLoader4Line("md")}</span
      >`;
    }
    if (this.aborted || this.result?.isError) {
      return html`<span class="text-destructive">${iconCloseLine("md")}</span>`;
    }
    return html`<span class="text-foreground">${iconCheckLine("md")}</span>`;
  }

  render() {
    const toolName = this.tool?.name ?? this.toolCall?.name ?? "tool";
    const label = this.tool?.label ?? this.toolCall?.name ?? "Tool";
    const hasResult = Boolean(this.result);
    const isError = this.result?.isError === true;
    return html`
      <div class="rounded-md border border-border bg-card p-2.5 text-card-foreground">
        <div class="flex items-center justify-between text-xs text-muted-foreground">
          <div class="flex items-center gap-2">
            ${this.renderStatus()}
            <span class="font-medium">${label}</span>
          </div>
          ${Button({
            variant: this._showDebug ? "secondary" : "ghost",
            size: "sm",
            className: "h-8 w-8",
            title: i18n("Show tool payload"),
            onClick: () => {
              this._showDebug = !this._showDebug;
            },
            children: iconBugLine("sm"),
          })}
        </div>
        ${this._showDebug
          ? html`
              <tool-message-debug
                .callArgs=${this.toolCall?.arguments}
                .result=${this.result}
                .hasResult=${hasResult}
              ></tool-message-debug>
            `
          : html`
              <div class="mt-2 text-sm text-muted-foreground">
                ${renderToolParams(toolName, this.toolCall?.arguments, this.pending)}
              </div>
              ${this.pending && !hasResult
                ? html`<div class="mt-2 text-sm text-muted-foreground">
                    ${i18n("Waiting for tool result…")}
                  </div>`
                : ""}
              ${this.aborted && !hasResult
                ? html`<div class="mt-2 text-sm text-muted-foreground">
                    ${i18n("Call was aborted; no result.")}
                  </div>`
                : ""}
              ${hasResult && isError
                ? html`<div
                    class="mt-2 rounded border border-destructive bg-destructive/10 p-2 text-sm text-destructive"
                  >
                    ${this.result.output}
                  </div>`
                : ""}
              ${hasResult && !isError
                ? html`<div class="mt-2">
                    ${renderToolResult(toolName, this.toolCall?.arguments, this.result)}
                  </div>`
                : ""}
            `}
      </div>
    `;
  }
}

export class AbortedMessage extends LitElement {
  createRenderRoot() {
    return this;
  }

  render() {
    return html`<span class="text-sm text-destructive italic">${i18n("Request aborted")}</span>`;
  }
}

export class StreamingMessageContainer extends LitElement {
  static properties = {
    isStreaming: { type: Boolean },
    pendingToolCalls: { type: Object },
    toolResultsById: { type: Object },
    tools: { type: Array },
    _message: { state: true },
  };

  constructor() {
    super();
    this.isStreaming = false;
    this.pendingToolCalls = new Set();
    this.toolResultsById = new Map();
    this.tools = [];
    this._message = null;
  }

  createRenderRoot() {
    return this;
  }

  setMessage(message, immediate = false) {
    if (immediate || message === null) {
      this._message = message;
      this.requestUpdate();
      return;
    }
    cancelAnimationFrame(this._updateFrame);
    this._updateFrame = requestAnimationFrame(() => {
      this._message = message;
      this.requestUpdate();
    });
  }

  render() {
    if (!this._message) {
      return this.isStreaming
        ? html`<div class="mx-4 my-3 h-4 w-2 animate-pulse bg-muted-foreground"></div>`
        : "";
    }
    if (this._message.role !== "assistant") return "";
    return html`
      <div class="mb-3 flex flex-col gap-3">
        <assistant-message
          .message=${this._message}
          .tools=${this.tools}
          .isStreaming=${this.isStreaming}
          .pendingToolCalls=${this.pendingToolCalls}
          .toolResultsById=${this.toolResultsById}
        ></assistant-message>
        ${this.isStreaming
          ? html`<span class="mx-4 inline-block h-4 w-2 animate-pulse bg-muted-foreground"></span>`
          : ""}
      </div>
    `;
  }
}

export class MessageList extends LitElement {
  static properties = {
    isStreaming: { type: Boolean },
    messages: { type: Array },
    pendingToolCalls: { type: Object },
    tools: { type: Array },
  };

  constructor() {
    super();
    this.isStreaming = false;
    this.messages = [];
    this.pendingToolCalls = new Set();
    this.tools = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    const toolResultsById = new Map();
    for (const message of this.messages) {
      if (message.role === "toolResult") toolResultsById.set(message.toolCallId, message);
    }
    return html`
      <div class="flex flex-col gap-3">
        ${this.messages.map((message) => {
          if (message.role === "user")
            return html`<user-message .message=${message}></user-message>`;
          if (message.role === "assistant") {
            return html`
              <assistant-message
                .message=${message}
                .tools=${this.tools}
                .isStreaming=${this.isStreaming}
                .pendingToolCalls=${this.pendingToolCalls}
                .toolResultsById=${toolResultsById}
              ></assistant-message>
            `;
          }
          return "";
        })}
      </div>
    `;
  }
}

export class AttachmentTileList extends LitElement {
  static properties = {
    files: { type: Array },
  };

  constructor() {
    super();
    this.files = [];
  }

  createRenderRoot() {
    return this;
  }

  dataUrl(file) {
    return `data:${file.mimeType || "application/octet-stream"};base64,${file.content}`;
  }

  render() {
    return html`
      <div class="flex flex-wrap gap-3">
        ${this.files.map(
          (file) => html`
            <div class="flex flex-col items-center gap-1">
              <attachment-tile .attachment=${file} .showDelete=${false}></attachment-tile>
              <a
                class="text-xs text-muted-foreground hover:text-foreground"
                href="${this.dataUrl(file)}"
                download="${file.fileName}"
                >${i18n("Download")}</a
              >
            </div>
          `,
        )}
      </div>
    `;
  }
}

export class ConsoleBlock extends LitElement {
  static properties = {
    content: { type: String },
    copied: { state: true },
  };

  constructor() {
    super();
    this.content = "";
    this.copied = false;
  }

  createRenderRoot() {
    return this;
  }

  async copy() {
    await navigator.clipboard.writeText(this.content || "");
    this.copied = true;
    setTimeout(() => {
      this.copied = false;
    }, 1500);
  }

  updated() {
    const target = this.querySelector(".console-scroll");
    if (target) target.scrollTop = target.scrollHeight;
  }

  render() {
    return html`
      <div class="overflow-hidden rounded-lg border border-border">
        <div class="flex items-center justify-between border-b border-border bg-muted px-3 py-1.5">
          <span class="font-mono text-xs text-muted-foreground">${i18n("console")}</span>
          <button
            class="flex items-center gap-1 rounded px-2 py-0.5 text-xs text-muted-foreground hover:bg-accent hover:text-accent-foreground"
            @click=${() => this.copy()}
          >
            ${iconFileCopy2Line("sm")} ${this.copied ? i18n("Copied!") : i18n("Copy")}
          </button>
        </div>
        <div class="console-scroll max-h-64 overflow-auto">
          <pre class="m-0 whitespace-pre-wrap bg-background p-3 font-mono text-xs text-foreground">
${this.content || ""}</pre
          >
        </div>
      </div>
    `;
  }
}

export class DebugView extends LitElement {
  static properties = {
    debugLog: { type: Array },
  };

  constructor() {
    super();
    this.debugLog = [];
  }

  createRenderRoot() {
    return this;
  }

  render() {
    return html`
      <div class="space-y-3">
        ${this.debugLog.map(
          (entry) => html`
            <div class="rounded-lg border border-border p-3">
              <div class="mb-2 text-xs text-muted-foreground">${entry.timestamp}</div>
              <code-block .code=${pretty(entry)} language="json"></code-block>
            </div>
          `,
        )}
      </div>
    `;
  }
}

export const ModelSelector = {
  open(currentModel, onSelect) {
    const available = Object.values(models["openai-codex"] ?? {});
    if (!available.length) return;
    const index = Math.max(
      0,
      available.findIndex((model) => model.id === currentModel?.id),
    );
    onSelect?.(available[(index + 1) % available.length]);
  },
};

function hasAssistantContent(message) {
  return message?.role === "assistant" && messageText(message).trim().length > 0;
}

function userMessageFromInput(message, attachments) {
  return {
    role: "user",
    content: [{ type: "text", text: message }],
    attachments: attachments?.length ? attachments : undefined,
    timestamp: Date.now(),
  };
}

export class AgentInterface extends LitElement {
  static properties = {
    enableAttachments: { type: Boolean },
    enableModelSelector: { type: Boolean },
    enableThinking: { type: Boolean },
    session: { attribute: false },
    showDebugToggle: { type: Boolean },
    showThemeToggle: { type: Boolean },
    _debugLog: { state: true },
    _showDebug: { state: true },
  };

  constructor() {
    super();
    this.enableAttachments = true;
    this.enableModelSelector = true;
    this.enableThinking = true;
    this.showDebugToggle = false;
    this.showThemeToggle = false;
    this._debugLog = [];
    this._showDebug = false;
    this._autoScroll = true;
    this.messageEditorRef = createRef();
    this.streamingRef = createRef();
  }

  createRenderRoot() {
    return this;
  }

  setInput(value, attachments) {
    const update = () => {
      const editor = this.messageEditorRef.value;
      if (!editor) {
        requestAnimationFrame(update);
        return;
      }
      editor.value = value;
      editor.attachments = attachments || [];
    };
    update();
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "block";
    this.style.height = "100%";
    this.setupSessionSubscription();
  }

  disconnectedCallback() {
    this._unsubscribeSession?.();
    super.disconnectedCallback();
  }

  setupSessionSubscription() {
    this._unsubscribeSession?.();
    if (!this.session) return;
    this._unsubscribeSession = this.session.subscribe((event) => {
      if (event.type === "state-update") {
        const state = event.state;
        if (this.streamingRef.value) {
          this.streamingRef.value.isStreaming = state.isStreaming;
          this.streamingRef.value.setMessage(state.streamMessage, !state.isStreaming);
        }
        this.requestUpdate();
        this.scrollToBottom();
      }
    });
    if ("debugListener" in this.session && !this.session.debugListener) {
      this.session.debugListener = (entry) => {
        this._debugLog = [...this._debugLog, entry];
      };
    }
  }

  scrollToBottom() {
    if (!this._autoScroll) return;
    requestAnimationFrame(() => {
      const container = this.querySelector(".agent-scroll");
      if (container) container.scrollTop = container.scrollHeight;
    });
  }

  async sendMessage(message, attachments) {
    const hasText = message.trim().length > 0;
    const hasAttachments = (attachments?.length ?? 0) > 0;
    if ((!hasText && !hasAttachments) || this.session?.state.isStreaming) return;
    if (!this.session) throw Error("No session set on AgentInterface");
    if (!this.session.state.model) throw Error("No model set on AgentInterface");

    const editor = this.messageEditorRef.value;
    if (editor) {
      editor.value = "";
      editor.attachments = [];
    }
    this._autoScroll = true;

    let lastStreamAssistant = null;
    const unsubscribe = this.session.subscribe((event) => {
      if (event.type !== "state-update") return;
      if (hasAssistantContent(event.state.streamMessage)) {
        lastStreamAssistant = event.state.streamMessage;
      }
    });

    try {
      await this.session.prompt(message, attachments);
    } finally {
      unsubscribe();
    }

    const messages = this.session.state.messages.slice();
    const hasUser = messages.some(
      (item) => item.role === "user" && messageText(item).trim() === message.trim(),
    );
    const hasAssistant = messages.some(hasAssistantContent);
    if (!hasUser || (!hasAssistant && hasAssistantContent(lastStreamAssistant))) {
      const repaired = hasUser
        ? messages
        : [userMessageFromInput(message, attachments), ...messages];
      if (!hasAssistant && hasAssistantContent(lastStreamAssistant))
        repaired.push(lastStreamAssistant);
      this.session.replaceMessages(repaired);
    }
  }

  renderMessages() {
    if (!this.session) {
      return html`<div class="p-4 text-center text-muted-foreground">
        ${i18n("No session available")}
      </div>`;
    }
    const state = this.session.state;
    const toolResultsById = new Map();
    for (const message of state.messages) {
      if (message.role === "toolResult") toolResultsById.set(message.toolCallId, message);
    }
    return html`
      <div class="flex flex-col gap-3">
        <message-list
          .messages=${state.messages}
          .tools=${state.tools}
          .pendingToolCalls=${state.pendingToolCalls}
          .isStreaming=${state.isStreaming}
        ></message-list>
        <streaming-message-container
          ${ref(this.streamingRef)}
          class="${state.isStreaming ? "" : "hidden"}"
          .tools=${state.tools}
          .isStreaming=${state.isStreaming}
          .pendingToolCalls=${state.pendingToolCalls}
          .toolResultsById=${toolResultsById}
        ></streaming-message-container>
      </div>
    `;
  }

  renderStats() {
    if (!this.session) return "";
    const totals = this.session.state.messages
      .filter((message) => message.role === "assistant")
      .reduce(
        (acc, message) => {
          const usage = message.usage;
          if (!usage) return acc;
          acc.input += usage.input || 0;
          acc.output += usage.output || 0;
          acc.cacheRead += usage.cacheRead || 0;
          acc.cost.total += usage.cost?.total || 0;
          return acc;
        },
        { input: 0, output: 0, cacheRead: 0, cost: { total: 0 } },
      );
    const summary = renderUsage(totals);
    return html`
      <div class="flex items-center justify-between text-xs text-muted-foreground">
        <div class="flex items-center gap-1">
          ${this.showThemeToggle ? html`<theme-toggle></theme-toggle>` : ""}
          ${this.showDebugToggle
            ? Button({
                variant: this._showDebug ? "secondary" : "ghost",
                size: "sm",
                onClick: () => {
                  this._showDebug = !this._showDebug;
                },
                children: iconBugLine("sm"),
              })
            : ""}
        </div>
        ${summary ? html`<span>${summary}</span>` : ""}
      </div>
    `;
  }

  render() {
    if (!this.session) {
      return html`<div class="p-4 text-center text-muted-foreground">
        ${i18n("No session set")}
      </div>`;
    }
    const state = this.session.state;
    return html`
      <div class="flex h-full flex-col bg-background text-foreground">
        <div
          class="agent-scroll flex-1 overflow-y-auto"
          @scroll=${(event) => {
            const target = event.currentTarget;
            this._autoScroll = target.scrollHeight - target.scrollTop - target.clientHeight < 80;
          }}
        >
          <div class="mx-auto max-w-3xl p-4 pb-0">
            ${this._showDebug
              ? html`<debug-view .debugLog=${this._debugLog}></debug-view>`
              : this.renderMessages()}
          </div>
        </div>
        <div class="shrink-0">
          <div class="mx-auto max-w-3xl px-2">
            <message-editor
              ${ref(this.messageEditorRef)}
              .isStreaming=${state.isStreaming}
              .currentModel=${state.model}
              .thinkingLevel=${state.thinkingLevel}
              .showAttachmentButton=${this.enableAttachments}
              .showModelSelector=${this.enableModelSelector}
              .showThinking=${this.enableThinking}
              .onSend=${(message, attachments) => this.sendMessage(message, attachments)}
              .onAbort=${() => this.session.abort()}
              .onModelSelect=${() =>
                ModelSelector.open(state.model, (model) => this.session.setModel(model))}
              .onThinkingChange=${this.enableThinking
                ? (value) => this.session.setThinkingLevel(value)
                : undefined}
            ></message-editor>
            ${this.renderStats()}
          </div>
        </div>
      </div>
    `;
  }
}

const definitions = {
  "aborted-message": AbortedMessage,
  "agent-interface": AgentInterface,
  "assistant-message": AssistantMessage,
  "attachment-tile-list": AttachmentTileList,
  "console-block": ConsoleBlock,
  "debug-view": DebugView,
  "message-list": MessageList,
  "streaming-message-container": StreamingMessageContainer,
  "tool-message": ToolMessage,
  "tool-message-debug": ToolMessageDebugView,
  "user-message": UserMessage,
};

for (const [name, element] of Object.entries(definitions)) {
  if (!customElements.get(name)) customElements.define(name, element);
}
