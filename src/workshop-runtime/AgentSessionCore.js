function textFromMessage(message) {
  if (!message?.content) return "";
  if (typeof message.content === "string") return message.content;
  return message.content
    .filter((part) => part.type === "text")
    .map((part) => part.text)
    .join("");
}

function contentFingerprint(message) {
  if (!message?.content) return "";
  try {
    return JSON.stringify(message.content);
  } catch {
    return textFromMessage(message);
  }
}

function hasUsefulAssistantContent(message) {
  if (!message || message.role !== "assistant") return false;
  if (typeof message.content === "string") return message.content.trim().length > 0;
  if (!Array.isArray(message.content)) return false;
  return message.content.some((part) => {
    if (part.type === "thinking") return part.thinking?.trim().length > 0;
    if (part.type === "text") return part.text?.trim().length > 0;
    if (part.type === "toolCall") return part.name?.trim().length > 0;
    return false;
  });
}

function sameUserMessage(a, b) {
  return a?.role === "user" && b?.role === "user" && a.timestamp === b.timestamp;
}

function sameAssistantMessage(a, b) {
  if (a?.role !== "assistant" || b?.role !== "assistant") return false;
  if (a.timestamp && b.timestamp && a.timestamp === b.timestamp) return true;
  return contentFingerprint(a) === contentFingerprint(b);
}

class ProxyAgentTransport {
  constructor(deps, getMessages, authTokenProvider) {
    this.deps = deps;
    this.getMessages = getMessages;
    this.authTokenProvider = authTokenProvider;
  }

  async *run(userMessage, sessionState, signal) {
    const authToken = await this.authTokenProvider();
    if (!authToken)
      throw Error(this.deps.i18n("Auth token is required for proxy transport"));

    const streamTransport = (model, context, options) =>
      this.deps.streamSimpleProxy(model, context, { ...options, authToken });

    const context = {
      systemPrompt: sessionState.systemPrompt,
      messages: await this.getMessages(),
      tools: sessionState.tools,
    };
    const options = {
      model: sessionState.model,
      reasoning: sessionState.reasoning,
    };

    for await (const event of this.deps.agentLoop(
      userMessage,
      context,
      options,
      signal,
      streamTransport,
    )) {
      yield event;
    }
  }
}

export function createAgentSessionClass(deps) {
  return class AgentSession {
    constructor(options = { authTokenProvider: async () => deps.getAuthToken() }) {
      this._state = {
        id: "default",
        systemPrompt: "",
        model: deps.getModel("openai-codex", "gpt-5.4-mini"),
        thinkingLevel: "off",
        tools: [],
        messages: [],
        isStreaming: false,
        streamMessage: null,
        pendingToolCalls: new Set(),
        error: undefined,
      };
      this.listeners = new Set();
      this._state = { ...this._state, ...options.initialState };
      this.messagePreprocessor = options.messagePreprocessor;
      this._activeUserMessage = null;
      this.transport =
        options.transport ??
        new ProxyAgentTransport(
          deps,
          async () => {
            let messages = this._state.messages;
            if (this._activeUserMessage) {
              messages = messages.filter(
                (message) => !sameUserMessage(message, this._activeUserMessage),
              );
            }
            const strippedMessages = messages.map((message) => {
              if (message.role === "user") {
                const { attachments, ...withoutAttachments } = message;
                return withoutAttachments;
              }
              return message;
            });
            return this.messagePreprocessor
              ? this.messagePreprocessor(strippedMessages)
              : strippedMessages;
          },
          options.authTokenProvider ?? (async () => deps.getAuthToken()),
        );
      this.debugListener = options.debugListener;
    }

    get state() {
      return this._state;
    }

    subscribe(listener) {
      this.listeners.add(listener);
      listener({ type: "state-update", state: this._state });
      return () => this.listeners.delete(listener);
    }

    setSystemPrompt(systemPrompt) {
      this.patch({ systemPrompt });
    }

    setModel(model) {
      this.patch({ model });
    }

    setThinkingLevel(thinkingLevel) {
      this.patch({ thinkingLevel });
    }

    setTools(tools) {
      this.patch({ tools });
    }

    replaceMessages(messages) {
      this.patch({ messages: messages.slice() });
    }

    appendMessage(message) {
      this.patch({ messages: [...this._state.messages, message] });
    }

    clearMessages() {
      this.patch({ messages: [] });
    }

    abort() {
      this.abortController?.abort();
    }

    async prompt(prompt, attachments) {
      const model = this._state.model;
      if (!model) {
        this.emit({ type: "error-no-model" });
        return;
      }

      const content = [{ type: "text", text: prompt }];
      if (attachments?.length) {
        for (const attachment of attachments) {
          if (attachment.type === "image") {
            content.push({
              type: "image",
              data: attachment.content,
              mimeType: attachment.mimeType,
            });
          }
          if (attachment.extractedText) {
            content.push({
              type: "text",
              text: `\n\n[Document preprocessed from ${attachment.fileName}]\n${attachment.extractedText}`,
              isDocument: true,
            });
          }
        }
      }

      const userMessage = {
        role: "user",
        content,
        attachments: attachments?.length ? attachments : undefined,
        timestamp: Date.now(),
      };
      const baseMessages = this._state.messages.slice();

      this.abortController = new AbortController();
      this._activeUserMessage = userMessage;
      this.patch({
        messages: [...baseMessages, userMessage],
        isStreaming: true,
        streamMessage: null,
        error: undefined,
      });

      const reasoning =
        this._state.thinkingLevel === "off"
          ? undefined
          : this._state.thinkingLevel === "minimal"
            ? "low"
            : this._state.thinkingLevel;
      const sessionState = {
        systemPrompt: this._state.systemPrompt,
        tools: this._state.tools,
        model,
        reasoning,
      };

      let lastAssistantMessage = null;
      let requestDebug = null;
      let turnStart = 0;
      try {
        for await (const event of this.transport.run(
          userMessage,
          sessionState,
          this.abortController.signal,
        )) {
          switch (event.type) {
            case "turn_start": {
              turnStart = performance.now();
              requestDebug = {
                timestamp: new Date().toISOString(),
                request: {
                  provider: sessionState.model.provider,
                  model: sessionState.model.id,
                  context: {
                    systemPrompt: this._state.systemPrompt,
                    messages: [...baseMessages],
                    tools: this._state.tools,
                  },
                },
                sseEvents: [],
              };
              break;
            }
            case "message_start":
            case "message_update": {
              if (event.message?.role === "assistant") {
                lastAssistantMessage = event.message;
                this.ensureUserMessage(baseMessages, userMessage);
                if (
                  event.type === "message_update" &&
                  event.assistantMessageEvent &&
                  requestDebug
                ) {
                  const sseEvent = { ...event.assistantMessageEvent };
                  if ("partial" in sseEvent) delete sseEvent.partial;
                  requestDebug.sseEvents.push(JSON.stringify(sseEvent));
                  requestDebug.ttft ||= performance.now() - turnStart;
                }
                this.patch({ streamMessage: event.message });
              }
              break;
            }
            case "message_end": {
              if (event.message.role === "assistant") {
                lastAssistantMessage = event.message;
                this.replaceOrAppendAssistant(event.message);
                this.patch({ streamMessage: null });
                if (requestDebug) requestDebug.response = event.message;
              } else if (
                event.message.role !== "user" &&
                event.message.role !== "toolResult"
              ) {
                this.appendMessage(event.message);
                requestDebug?.request.context.messages.push(event.message);
              }
              break;
            }
            case "tool_execution_start": {
              const pendingToolCalls = new Set(this._state.pendingToolCalls);
              pendingToolCalls.add(event.toolCallId);
              this.patch({ pendingToolCalls });
              break;
            }
            case "tool_execution_end": {
              const pendingToolCalls = new Set(this._state.pendingToolCalls);
              pendingToolCalls.delete(event.toolCallId);
              this.patch({ pendingToolCalls });
              break;
            }
            case "turn_end": {
              if (requestDebug) {
                requestDebug.totalTime = performance.now() - turnStart;
                this.debugListener?.(requestDebug);
                requestDebug = null;
              }
              break;
            }
            case "agent_end": {
              if (Array.isArray(event.messages) && event.messages.length > 0) {
                const finalAssistant = [...event.messages]
                  .reverse()
                  .find((message) => message.role === "assistant");
                if (finalAssistant) lastAssistantMessage = finalAssistant;
              }
              this.patch({ streamMessage: null });
              break;
            }
          }
        }

        if (hasUsefulAssistantContent(lastAssistantMessage)) {
          this.ensureUserMessage(baseMessages, userMessage);
          this.replaceOrAppendAssistant(lastAssistantMessage);
        }
      } catch (error) {
        this.ensureUserMessage(baseMessages, userMessage);
        if (String(error?.message || error) === "no-api-key") {
          this.emit({ type: "error-no-api-key", provider: model.provider });
        } else {
          const assistantError = {
            role: "assistant",
            content: [{ type: "text", text: "" }],
            api: model.api,
            provider: model.provider,
            model: model.id,
            usage: {
              input: 0,
              output: 0,
              cacheRead: 0,
              cacheWrite: 0,
              cost: {
                input: 0,
                output: 0,
                cacheRead: 0,
                cacheWrite: 0,
                total: 0,
              },
            },
            stopReason: this.abortController?.signal.aborted ? "aborted" : "error",
            errorMessage: error?.message || String(error),
            timestamp: Date.now(),
          };
          this.appendMessage(assistantError);
          this.patch({ error: error?.message || String(error) });
        }
      } finally {
        this.patch({
          isStreaming: false,
          streamMessage: null,
          pendingToolCalls: new Set(),
        });
        this._activeUserMessage = null;
        this.abortController = undefined;
      }
    }

    replaceOrAppendAssistant(message) {
      const messages = this._state.messages.slice();
      const existingIndex = messages.findIndex((item) => sameAssistantMessage(item, message));
      if (existingIndex >= 0) messages[existingIndex] = message;
      else messages.push(message);
      this.patch({ messages });
    }

    ensureUserMessage(baseMessages, userMessage) {
      if (this._state.messages.some((message) => sameUserMessage(message, userMessage))) return;
      this.patch({ messages: [...baseMessages, userMessage, ...this._state.messages] });
    }

    patch(patch) {
      this._state = { ...this._state, ...patch };
      this.emit({ type: "state-update", state: this._state });
    }

    emit(event) {
      for (const listener of this.listeners) listener(event);
    }
  };
}
