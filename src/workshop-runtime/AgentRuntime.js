import { AgentInterface as RegisteredAgentInterface } from "./app-C9nW8ndw.js";
import { i18n, x as html } from "../mini-lit/index.js";

export * from "./app-C9nW8ndw.js";

class AgentInterfaceHost extends HTMLElement {
  constructor() {
    super();
    this._agentInterface = null;
    this._session = null;
  }

  connectedCallback() {
    this.style.display = "block";
    this.style.width = "100%";
    this.style.height = "100%";
    this.mountAgentInterface();
  }

  set agentInterface(value) {
    if (this._agentInterface === value) return;
    this._agentInterface = value;
    this.mountAgentInterface();
  }

  get agentInterface() {
    return this._agentInterface;
  }

  set session(value) {
    if (this._session === value) return;
    this._session = value;
    this.syncSession();
  }

  get session() {
    return this._session;
  }

  mountAgentInterface() {
    if (!this.isConnected || !this._agentInterface) return;
    if (this._agentInterface.parentElement !== this) {
      this.replaceChildren(this._agentInterface);
    }
    this.syncSession();
  }

  syncSession() {
    if (!this._agentInterface || !this._session) return;
    this._agentInterface.session = this._session;
    requestAnimationFrame(() => {
      if (!this.isConnected || this._agentInterface?.parentElement !== this) return;
      this._agentInterface.setupSessionSubscription?.();
      this._agentInterface.requestUpdate?.();
    });
  }
}

if (!customElements.get("agent-interface-host")) {
  customElements.define("agent-interface-host", AgentInterfaceHost);
}

function messageText(message) {
  if (!message?.content) return "";
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function hasAssistantContent(message) {
  return message?.role === "assistant" && messageText(message).trim().length > 0;
}

function userMessageFromInput(message, attachments) {
  const content = [{ type: "text", text: message }];
  return {
    role: "user",
    content,
    attachments: attachments?.length ? attachments : undefined,
    timestamp: Date.now(),
  };
}

RegisteredAgentInterface.prototype.sendMessage = async function sendMessage(message, attachments) {
  const hasText = message.trim().length > 0;
  const hasAttachments = (attachments?.length ?? 0) > 0;
  if ((!hasText && !hasAttachments) || this.session?.state.isStreaming) return;

  const session = this.session;
  if (!session) throw Error("No session set on AgentInterface");
  if (!session.state.model) throw Error("No model set on AgentInterface");

  if (this._messageEditor) {
    this._messageEditor.value = "";
    this._messageEditor.attachments = [];
  }
  this._autoScroll = true;

  let lastStreamAssistant = null;
  const unsubscribe = session.subscribe((event) => {
    if (event.type !== "state-update") return;
    if (hasAssistantContent(event.state.streamMessage)) {
      lastStreamAssistant = event.state.streamMessage;
    }
  });

  try {
    await session.prompt(message, attachments);
  } finally {
    unsubscribe();
  }

  const messages = session.state.messages.slice();
  const hasUser = messages.some(
    (item) => item.role === "user" && messageText(item).trim() === message.trim(),
  );
  const hasAssistant = messages.some(hasAssistantContent);
  if (!hasUser || (!hasAssistant && hasAssistantContent(lastStreamAssistant))) {
    const repairedMessages = hasUser ? messages : [userMessageFromInput(message, attachments), ...messages];
    if (!hasAssistant && hasAssistantContent(lastStreamAssistant)) {
      repairedMessages.push(lastStreamAssistant);
    }
    session.replaceMessages(repairedMessages);
  }
};

RegisteredAgentInterface.prototype.renderMessages = function renderMessages() {
  if (!this.session) {
    return html`<div class="p-4 text-center text-muted-foreground">${i18n("No session available")}</div>`;
  }

  const state = this.session.state;
  const toolResultsById = new Map();
  for (const message of state.messages) {
    if (message.role === "toolResult") toolResultsById.set(message.toolCallId, message);
  }

  return html`
    <div class="flex flex-col gap-3">
      ${state.messages.map((message) => {
        if (message.role === "user") {
          return html`<user-message .message=${message}></user-message>`;
        }
        if (message.role === "assistant") {
          return html`
            <assistant-message
              .message=${message}
              .tools=${state.tools}
              .isStreaming=${state.isStreaming}
              .pendingToolCalls=${state.pendingToolCalls}
              .toolResultsById=${toolResultsById}
              .hideToolCalls=${false}
            ></assistant-message>
          `;
        }
        return "";
      })}
      <streaming-message-container
        class="${state.isStreaming ? "" : "hidden"}"
        .tools=${state.tools}
        .isStreaming=${state.isStreaming}
        .pendingToolCalls=${state.pendingToolCalls}
        .toolResultsById=${toolResultsById}
      ></streaming-message-container>
    </div>
  `;
};

export const AgentInterface = RegisteredAgentInterface;
