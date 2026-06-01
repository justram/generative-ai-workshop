import { AgentInterface as RegisteredAgentInterface } from "./AgentMessages.js";
export { formatCost, formatTokenCount, getModel, models } from "./AgentModels.js";
export { StringEnum, Type } from "./AgentSchema.js";
export { AssistantMessageEventStream, parseStreamingJson } from "./AgentStream.js";
export { calculateTool, getCurrentTimeTool } from "./AgentTools.js";
export { agentLoop } from "./AgentLoop.js";
export {
  AbortedMessage,
  AgentInterface as RegisteredAgentInterface,
  AssistantMessage,
  AttachmentTileList,
  ConsoleBlock,
  DebugView,
  MessageList,
  ModelSelector,
  StreamingMessageContainer,
  ToolMessage,
  ToolMessageDebugView,
  UserMessage,
  registerToolRenderer,
} from "./AgentMessages.js";

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

export const AgentInterface = RegisteredAgentInterface;
