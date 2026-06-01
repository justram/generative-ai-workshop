import { i18n as e } from "../mini-lit/index.js";
import { agentLoop as t, getModel as n } from "./AgentAppRuntime.js";
import { getAuthToken as r } from "./AuthTokenRuntime.js";
import { streamSimpleProxy as i } from "./ProxyClientRuntime.js";
var a = class {
    constructor(e, t) {
      ((this.getMessages = e), (this.authTokenProvider = t));
    }
    async *run(n, r, a) {
      let o = await this.authTokenProvider();
      if (!o) throw Error(e(`Auth token is required for proxy transport`));
      let s = (e, t, n) => i(e, t, { ...n, authToken: o }),
        c = {
          systemPrompt: r.systemPrompt,
          messages: await this.getMessages(),
          tools: r.tools,
        },
        l = { model: r.model, reasoning: r.reasoning };
      for await (let e of t(n, c, l, a, s)) yield e;
    }
  },
  o = class {
    constructor(e = { authTokenProvider: async () => r() }) {
      ((this._state = {
        id: `default`,
        systemPrompt: ``,
        model: n(`openai-codex`, `gpt-5.4-mini`),
        thinkingLevel: `off`,
        tools: [],
        messages: [],
        isStreaming: !1,
        streamMessage: null,
        pendingToolCalls: new Set(),
        error: void 0,
      }),
        (this.listeners = new Set()),
        (this._state = { ...this._state, ...e.initialState }),
        (this.messagePreprocessor = e.messagePreprocessor),
        (this.transport =
          e.transport ??
          new a(async () => {
            let e = this._state.messages.map((e) => {
              if (e.role === `user`) {
                let { attachments: t, ...n } = e;
                return n;
              } else return e;
            });
            return this.messagePreprocessor ? this.messagePreprocessor(e) : e;
          }, e.authTokenProvider)),
        (this.debugListener = e.debugListener));
    }
    get state() {
      return this._state;
    }
    subscribe(e) {
      return (
        this.listeners.add(e),
        e({ type: `state-update`, state: this._state }),
        () => this.listeners.delete(e)
      );
    }
    setSystemPrompt(e) {
      this.patch({ systemPrompt: e });
    }
    setModel(e) {
      this.patch({ model: e });
    }
    setThinkingLevel(e) {
      this.patch({ thinkingLevel: e });
    }
    setTools(e) {
      this.patch({ tools: e });
    }
    replaceMessages(e) {
      this.patch({ messages: e.slice() });
    }
    appendMessage(e) {
      this.patch({ messages: [...this._state.messages, e] });
    }
    clearMessages() {
      this.patch({ messages: [] });
    }
    abort() {
      this.abortController?.abort();
    }
    async prompt(e, t) {
      let n = this._state.model;
      if (!n) {
        this.emit({ type: `error-no-model` });
        return;
      }
      let r = [{ type: `text`, text: e }];
      if (t?.length)
        for (let e of t) {
          (e.type === `image` &&
            r.push({ type: `image`, data: e.content, mimeType: e.mimeType }),
            e.extractedText &&
              r.push({
                type: `text`,
                text: `\n\n[Document preprocessed from ${e.fileName}]\n${e.extractedText}`,
                isDocument: !0,
              }));
        }
      let i = {
        role: `user`,
        content: r,
        attachments: t?.length ? t : void 0,
        timestamp: Date.now(),
      };
      ((this.abortController = new AbortController()),
        this.patch({ isStreaming: !0, streamMessage: null, error: void 0 }));
      let a =
          this._state.thinkingLevel === `off`
            ? void 0
            : this._state.thinkingLevel === `minimal`
              ? `low`
              : this._state.thinkingLevel,
        o = {
          systemPrompt: this._state.systemPrompt,
          tools: this._state.tools,
          model: n,
          reasoning: a,
        };
      try {
        let e = null,
          t = null,
          n = 0;
        for await (let r of this.transport.run(
          i,
          o,
          this.abortController.signal,
        ))
          switch (r.type) {
            case `turn_start`: {
              n = performance.now();
              let e = this._state.messages,
                r = {
                  systemPrompt: this._state.systemPrompt,
                  messages: [...e],
                  tools: this._state.tools,
                };
              t = {
                timestamp: new Date().toISOString(),
                request: {
                  provider: o.model.provider,
                  model: o.model.id,
                  context: { ...r },
                },
                sseEvents: [],
              };
              break;
            }
            case `message_start`:
            case `message_update`:
              if (
                ((e = r.message),
                r.type === `message_update` && r.assistantMessageEvent && t)
              ) {
                let e = { ...r.assistantMessageEvent };
                (e && `partial` in e && delete e.partial,
                  t.sseEvents.push(JSON.stringify(e)),
                  (t.ttft ||= performance.now() - n));
              }
              this.patch({ streamMessage: r.message });
              break;
            case `message_end`:
              ((e = null),
                this.appendMessage(r.message),
                this.patch({ streamMessage: null }),
                t &&
                  (r.message.role !== `assistant` &&
                    r.message.role !== `toolResult` &&
                    t.request.context.messages.push(r.message),
                  r.message.role === `assistant` && (t.response = r.message)));
              break;
            case `tool_execution_start`: {
              let e = new Set(this._state.pendingToolCalls);
              (e.add(r.toolCallId), this.patch({ pendingToolCalls: e }));
              break;
            }
            case `tool_execution_end`: {
              let e = new Set(this._state.pendingToolCalls);
              (e.delete(r.toolCallId), this.patch({ pendingToolCalls: e }));
              break;
            }
            case `turn_end`:
              t &&=
                ((t.totalTime = performance.now() - n),
                this.debugListener?.(t),
                null);
              break;
            case `agent_end`:
              this.patch({ streamMessage: null });
              break;
          }
        if (e && e.role === `assistant` && e.content.length > 0) {
          if (
            e.content.some(
              (e) =>
                (e.type === `thinking` && e.thinking.trim().length > 0) ||
                (e.type === `text` && e.text.trim().length > 0) ||
                (e.type === `toolCall` && e.name.trim().length > 0),
            )
          )
            this.appendMessage(e);
          else if (this.abortController?.signal.aborted)
            throw Error(`Request was aborted`);
        }
      } catch (e) {
        if (String(e?.message || e) === `no-api-key`)
          this.emit({ type: `error-no-api-key`, provider: n.provider });
        else {
          let t = {
            role: `assistant`,
            content: [{ type: `text`, text: `` }],
            api: n.api,
            provider: n.provider,
            model: n.id,
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
            stopReason: this.abortController?.signal.aborted
              ? `aborted`
              : `error`,
            errorMessage: e?.message || String(e),
            timestamp: Date.now(),
          };
          (this.appendMessage(t),
            this.patch({ error: e?.message || String(e) }));
        }
      } finally {
        (this.patch({
          isStreaming: !1,
          streamMessage: null,
          pendingToolCalls: new Set(),
        }),
          (this.abortController = void 0));
      }
    }
    patch(e) {
      ((this._state = { ...this._state, ...e }),
        this.emit({ type: `state-update`, state: this._state }));
    }
    emit(e) {
      for (let t of this.listeners) t(e);
    }
  };
export { o as AgentSession };
