import {
  Button,
  i18n,
  iconArrowLeftLine,
  iconArticleLine,
  iconEqualizerLine,
  x as html,
} from "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as LegacyDemoBase } from "./DemoBaseRuntime.js";

export class DemoBase extends LegacyDemoBase {
  firstUpdated(changedProperties) {
    super.firstUpdated?.(changedProperties);
    this.mountAgentInterfaceHosts();
  }

  updated(changedProperties) {
    super.updated?.(changedProperties);
    this.mountAgentInterfaceHosts();
  }

  mountAgentInterfaceHosts() {
    if (!this.agentInterface) return;
    this.syncAgentInterfaceSession();
    for (const host of this.querySelectorAll("agent-interface-host")) {
      host.agentInterface = this.agentInterface;
      host.session = this.session;
    }
  }

  syncAgentInterfaceSession() {
    if (!this.session) throw Error("No session set on demo page");
    if (this.agentInterface.session !== this.session) {
      this.agentInterface.session = this.session;
      this.agentInterface.setupSessionSubscription?.();
      this.agentInterface.requestUpdate?.();
    }
    if (this._agentSessionSubscriptionFor === this.session) return;
    this._unsubscribeAgentSession?.();
    this._agentSessionSubscriptionFor = this.session;
    this._unsubscribeAgentSession = this.session.subscribe((event) => {
      if (event.type !== "state-update") return;
      this.refreshAgentInterfaceFromSession(event.state);
    });
  }

  refreshAgentInterfaceFromSession(state = this.session?.state) {
    if (!this.agentInterface || !state) return;
    this.agentInterface.requestUpdate?.();

    const streamingContainer = this.agentInterface.querySelector?.("streaming-message-container");
    if (streamingContainer) {
      streamingContainer.tools = state.tools;
      streamingContainer.isStreaming = state.isStreaming;
      streamingContainer.pendingToolCalls = state.pendingToolCalls;
      const toolResultsById = new Map();
      for (const message of state.messages) {
        if (message.role === "toolResult") toolResultsById.set(message.toolCallId, message);
      }
      streamingContainer.toolResultsById = toolResultsById;
      streamingContainer.setMessage?.(state.streamMessage, !state.isStreaming);
      streamingContainer.requestUpdate?.();
    }

    for (const messageList of this.agentInterface.querySelectorAll?.("message-list") ?? []) {
      messageList.messages = state.messages;
      messageList.tools = state.tools;
      messageList.pendingToolCalls = state.pendingToolCalls;
      messageList.isStreaming = state.isStreaming;
      messageList.requestUpdate?.();
    }
  }

  disconnectedCallback() {
    this._unsubscribeAgentSession?.();
    this._unsubscribeAgentSession = undefined;
    this._agentSessionSubscriptionFor = undefined;
    super.disconnectedCallback?.();
  }

  async runAgentPrompt(prompt, attachments) {
    if (!this.session) throw Error("No session set on demo page");
    if (this.session.state.isStreaming) return;
    if (this.agentInterface?._messageEditor) {
      this.agentInterface._messageEditor.value = "";
      this.agentInterface._messageEditor.attachments = [];
    }
    if (this.agentInterface) this.agentInterface._autoScroll = true;
    const run = this.session.prompt(prompt, attachments);
    this.refreshAgentInterfaceFromSession();
    await run;
    this.refreshAgentInterfaceFromSession();
  }

  render() {
    if (typeof document !== "undefined") document.title = this.headerTitle;

    const leftPanel = this.renderLeftDemoPanel();
    const rightPanel = this.renderRightDemoPanel();
    const hasLeftPanel = Boolean(leftPanel);
    const hasRightPanel = Boolean(rightPanel);
    const leftPanelOpen = this.showLeftPanel || this.showLeftPanelDesktop;
    const rightPanelOpen = this.showRightPanel || this.showRightPanelDesktop;

    return html`
      <div class="h-screen bg-background text-foreground flex flex-col overflow-hidden">
        <div
          class="px-4 py-3 border-b border-border flex items-center justify-between gap-3 flex-shrink-0"
        >
          <div class="min-w-0 flex items-center gap-3">
            <a
              href="./"
              class="p-2 rounded-md hover:bg-muted transition-colors"
              title="${i18n("Back to demos")}"
            >
              ${iconArrowLeftLine("md")}
            </a>
            <h1 class="truncate text-xl lg:text-2xl font-semibold">${this.headerTitle}</h1>
          </div>
          <div class="flex flex-shrink-0 items-center gap-1">
            ${hasLeftPanel
              ? Button({
                  variant: leftPanelOpen ? "secondary" : "ghost",
                  size: "icon",
                  title: this.showLeftPanelDesktop
                    ? i18n("Hide left panel")
                    : i18n("Show left panel"),
                  onClick: () => {
                    if (window.innerWidth >= 1024) {
                      this.showLeftPanelDesktop = !this.showLeftPanelDesktop;
                    } else {
                      this.showLeftPanel = !this.showLeftPanel;
                    }
                  },
                  children: iconEqualizerLine("md"),
                })
              : ""}
            ${hasRightPanel
              ? Button({
                  variant: rightPanelOpen ? "secondary" : "ghost",
                  size: "icon",
                  title: this.showRightPanelDesktop
                    ? i18n("Hide right panel")
                    : i18n("Show right panel"),
                  onClick: () => {
                    if (window.innerWidth >= 1024) {
                      this.showRightPanelDesktop = !this.showRightPanelDesktop;
                    } else {
                      this.showRightPanel = !this.showRightPanel;
                    }
                  },
                  children: iconArticleLine("md"),
                })
              : ""}
            <language-selector></language-selector>
            <theme-toggle></theme-toggle>
          </div>
        </div>

        <div class="flex-1 min-h-0 overflow-hidden flex relative">
          <div
            class="${this.showLeftPanel ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
              ${this.showLeftPanelDesktop && hasLeftPanel ? "lg:flex" : "lg:hidden"}
              fixed lg:static inset-0 lg:inset-auto z-40 lg:z-auto
              w-full lg:w-[400px] bg-card text-card-foreground lg:border-r border-border
              transition-transform duration-300 lg:transition-none
              flex flex-col h-full"
            style="${hasLeftPanel ? "" : "display:none;"}"
          >
            <div
              class="lg:hidden flex items-center justify-between p-4 border-b border-border flex-shrink-0"
            >
              <h2 class="font-semibold">${i18n("Controls")}</h2>
              ${this.renderCloseButton(() => {
                this.showLeftPanel = false;
              })}
            </div>
            <div class="flex-1 overflow-y-auto min-h-0">${leftPanel ?? ""}</div>
          </div>

          <div class="flex-1 min-w-0">${this.renderContentPanel()}</div>

          <div
            class="${this.showRightPanel
              ? "translate-x-0"
              : "translate-x-full lg:translate-x-0"}
              ${this.showRightPanelDesktop && hasRightPanel ? "lg:flex" : "lg:hidden"}
              fixed lg:static inset-0 lg:inset-auto z-40 lg:z-auto
              w-full lg:w-[500px] bg-card text-card-foreground lg:border-l border-border
              transition-transform duration-300 lg:transition-none
              flex flex-col h-full"
            style="${hasRightPanel ? "" : "display:none;"}"
          >
            <div
              class="lg:hidden flex items-center justify-between p-4 border-b border-border flex-shrink-0"
            >
              <h2 class="font-semibold">${i18n("Info")}</h2>
              ${this.renderCloseButton(() => {
                this.showRightPanel = false;
              })}
            </div>
            <div class="flex-1 overflow-y-auto min-h-0">${rightPanel ?? ""}</div>
          </div>

          ${this.showLeftPanel && hasLeftPanel
            ? html`
                <div
                  @click=${() => {
                    this.showLeftPanel = false;
                  }}
                  class="lg:hidden fixed inset-0 bg-black/50 z-30"
                ></div>
              `
            : ""}
          ${this.showRightPanel && hasRightPanel
            ? html`
                <div
                  @click=${() => {
                    this.showRightPanel = false;
                  }}
                  class="lg:hidden fixed inset-0 bg-black/50 z-30"
                ></div>
              `
            : ""}
        </div>
      </div>
    `;
  }

  renderCloseButton(onClick) {
    return Button({
      variant: "ghost",
      size: "icon",
      title: i18n("Close"),
      onClick,
      children: html`
        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          ></path>
        </svg>
      `,
    });
  }
}
