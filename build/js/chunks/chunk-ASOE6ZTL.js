import {
  Bi,
  Li,
  Nw,
  Pi,
  v,
  y
} from "./chunk-737EQ6X6.js";
import {
  i18n
} from "./chunk-FDFAIUKR.js";

// src/workshop-runtime/proxy-client-DO8A5rUF.js
function i(i2, a2, o2) {
  let s = new Li();
  return (async () => {
    let t = {
      role: `assistant`,
      stopReason: `stop`,
      content: [],
      api: i2.api,
      provider: i2.provider,
      model: i2.id,
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
          total: 0
        }
      },
      timestamp: Date.now()
    }, c, l = () => {
      c && c.cancel(`Request aborted by user`).catch(() => {
      });
    };
    o2.signal && o2.signal.addEventListener(`abort`, l);
    try {
      let r = await fetch(`/api/stream`, {
        method: `POST`,
        headers: {
          Authorization: `Bearer ${o2.authToken}`,
          "Content-Type": `application/json`
        },
        body: JSON.stringify({
          model: i2,
          context: a2,
          options: {
            temperature: o2.temperature,
            maxTokens: o2.maxTokens,
            reasoning: o2.reasoning
          }
        }),
        signal: o2.signal
      });
      if (!r.ok) {
        let t2 = i18n(`Proxy error: {status} {statusText}`)(
          r.status,
          r.statusText
        );
        try {
          let n = await r.json();
          n.error && (t2 = i18n(`Proxy error: {error}`)(n.error));
        } catch {
        }
        throw Error(t2);
      }
      c = r.body.getReader();
      let l2 = new TextDecoder(), u = ``;
      for (; ; ) {
        let { done: e, value: r2 } = await c.read();
        if (e) break;
        if (o2.signal?.aborted) throw Error(`Request aborted by user`);
        u += l2.decode(r2, { stream: true });
        let i3 = u.split(`
`);
        u = i3.pop() || ``;
        for (let e2 of i3)
          if (e2.startsWith(`data: `)) {
            let r3 = e2.slice(6).trim();
            if (r3) {
              let e3 = JSON.parse(r3), i4;
              switch (e3.type) {
                case `start`:
                  i4 = { type: `start`, partial: t };
                  break;
                case `text_start`:
                  t.content[e3.contentIndex] = { type: `text`, text: `` }, i4 = {
                    type: `text_start`,
                    contentIndex: e3.contentIndex,
                    partial: t
                  };
                  break;
                case `text_delta`: {
                  let n = t.content[e3.contentIndex];
                  if (n?.type === `text`)
                    n.text += e3.delta, i4 = {
                      type: `text_delta`,
                      contentIndex: e3.contentIndex,
                      delta: e3.delta,
                      partial: t
                    };
                  else
                    throw Error(`Received text_delta for non-text content`);
                  break;
                }
                case `text_end`: {
                  let n = t.content[e3.contentIndex];
                  if (n?.type === `text`)
                    n.textSignature = e3.contentSignature, i4 = {
                      type: `text_end`,
                      contentIndex: e3.contentIndex,
                      content: n.text,
                      partial: t
                    };
                  else throw Error(`Received text_end for non-text content`);
                  break;
                }
                case `thinking_start`:
                  t.content[e3.contentIndex] = {
                    type: `thinking`,
                    thinking: ``
                  }, i4 = {
                    type: `thinking_start`,
                    contentIndex: e3.contentIndex,
                    partial: t
                  };
                  break;
                case `thinking_delta`: {
                  let n = t.content[e3.contentIndex];
                  if (n?.type === `thinking`)
                    n.thinking += e3.delta, i4 = {
                      type: `thinking_delta`,
                      contentIndex: e3.contentIndex,
                      delta: e3.delta,
                      partial: t
                    };
                  else
                    throw Error(
                      `Received thinking_delta for non-thinking content`
                    );
                  break;
                }
                case `thinking_end`: {
                  let n = t.content[e3.contentIndex];
                  if (n?.type === `thinking`)
                    n.thinkingSignature = e3.contentSignature, i4 = {
                      type: `thinking_end`,
                      contentIndex: e3.contentIndex,
                      content: n.thinking,
                      partial: t
                    };
                  else
                    throw Error(
                      `Received thinking_end for non-thinking content`
                    );
                  break;
                }
                case `toolcall_start`:
                  t.content[e3.contentIndex] = {
                    type: `toolCall`,
                    id: e3.id,
                    name: e3.toolName,
                    arguments: {},
                    partialJson: ``
                  }, i4 = {
                    type: `toolcall_start`,
                    contentIndex: e3.contentIndex,
                    partial: t
                  };
                  break;
                case `toolcall_delta`: {
                  let r4 = t.content[e3.contentIndex];
                  if (r4?.type === `toolCall`)
                    r4.partialJson += e3.delta, r4.arguments = Bi(r4.partialJson) || {}, i4 = {
                      type: `toolcall_delta`,
                      contentIndex: e3.contentIndex,
                      delta: e3.delta,
                      partial: t
                    }, t.content[e3.contentIndex] = { ...r4 };
                  else
                    throw Error(
                      `Received toolcall_delta for non-toolCall content`
                    );
                  break;
                }
                case `toolcall_end`: {
                  let n = t.content[e3.contentIndex];
                  n?.type === `toolCall` && (delete n.partialJson, i4 = {
                    type: `toolcall_end`,
                    contentIndex: e3.contentIndex,
                    toolCall: n,
                    partial: t
                  });
                  break;
                }
                case `done`:
                  t.stopReason = e3.reason, t.usage = e3.usage, i4 = { type: `done`, reason: e3.reason, message: t };
                  break;
                case `error`:
                  t.stopReason = e3.reason, t.errorMessage = e3.errorMessage, t.usage = e3.usage, i4 = { type: `error`, reason: e3.reason, error: t };
                  break;
                default:
                  console.warn(`Unhandled event type: ${e3.type}`);
                  break;
              }
              if (i4) s.push(i4);
              else throw Error(`Failed to create event from proxy event`);
            }
          }
      }
      if (o2.signal?.aborted) throw Error(`Request aborted by user`);
      s.end();
    } catch (e) {
      let n = e instanceof Error ? e.message : String(e);
      n.toLowerCase().includes(`proxy`) && n.includes(`Unauthorized`) && y(), t.stopReason = o2.signal?.aborted ? `aborted` : `error`, t.errorMessage = n, s.push({ type: `error`, reason: t.stopReason, error: t }), s.end();
    } finally {
      o2.signal && o2.signal.removeEventListener(`abort`, l);
    }
  })(), s;
}

// src/workshop-runtime/agent-session-CtmWvP9t.js
var a = class {
  constructor(e, t) {
    this.getMessages = e, this.authTokenProvider = t;
  }
  async *run(n, r, a2) {
    let o2 = await this.authTokenProvider();
    if (!o2) throw Error(i18n(`Auth token is required for proxy transport`));
    let s = (e, t, n2) => i(e, t, { ...n2, authToken: o2 }), c = {
      systemPrompt: r.systemPrompt,
      messages: await this.getMessages(),
      tools: r.tools
    }, l = { model: r.model, reasoning: r.reasoning };
    for await (let e of Nw(n, c, l, a2, s)) yield e;
  }
};
var o = class {
  constructor(e = { authTokenProvider: async () => v() }) {
    this._state = {
      id: `default`,
      systemPrompt: ``,
      model: Pi(`openai-codex`, `gpt-5.4-mini`),
      thinkingLevel: `off`,
      tools: [],
      messages: [],
      isStreaming: false,
      streamMessage: null,
      pendingToolCalls: /* @__PURE__ */ new Set(),
      error: void 0
    }, this.listeners = /* @__PURE__ */ new Set(), this._state = { ...this._state, ...e.initialState }, this.messagePreprocessor = e.messagePreprocessor, this.transport = e.transport ?? new a(async () => {
      let e2 = this._state.messages.map((e3) => {
        if (e3.role === `user`) {
          let { attachments: t, ...n } = e3;
          return n;
        } else return e3;
      });
      return this.messagePreprocessor ? this.messagePreprocessor(e2) : e2;
    }, e.authTokenProvider), this.debugListener = e.debugListener;
  }
  get state() {
    return this._state;
  }
  subscribe(e) {
    return this.listeners.add(e), e({ type: `state-update`, state: this._state }), () => this.listeners.delete(e);
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
      for (let e2 of t) {
        e2.type === `image` && r.push({ type: `image`, data: e2.content, mimeType: e2.mimeType }), e2.extractedText && r.push({
          type: `text`,
          text: `

[Document preprocessed from ${e2.fileName}]
${e2.extractedText}`,
          isDocument: true
        });
      }
    let i2 = {
      role: `user`,
      content: r,
      attachments: t?.length ? t : void 0,
      timestamp: Date.now()
    };
    this.abortController = new AbortController(), this.patch({ isStreaming: true, streamMessage: null, error: void 0 });
    let a2 = this._state.thinkingLevel === `off` ? void 0 : this._state.thinkingLevel === `minimal` ? `low` : this._state.thinkingLevel, o2 = {
      systemPrompt: this._state.systemPrompt,
      tools: this._state.tools,
      model: n,
      reasoning: a2
    };
    try {
      let e2 = null, t2 = null, n2 = 0;
      for await (let r2 of this.transport.run(
        i2,
        o2,
        this.abortController.signal
      ))
        switch (r2.type) {
          case `turn_start`: {
            n2 = performance.now();
            let e3 = this._state.messages, r3 = {
              systemPrompt: this._state.systemPrompt,
              messages: [...e3],
              tools: this._state.tools
            };
            t2 = {
              timestamp: (/* @__PURE__ */ new Date()).toISOString(),
              request: {
                provider: o2.model.provider,
                model: o2.model.id,
                context: { ...r3 }
              },
              sseEvents: []
            };
            break;
          }
          case `message_start`:
          case `message_update`:
            if (e2 = r2.message, r2.type === `message_update` && r2.assistantMessageEvent && t2) {
              let e3 = { ...r2.assistantMessageEvent };
              e3 && `partial` in e3 && delete e3.partial, t2.sseEvents.push(JSON.stringify(e3)), t2.ttft ||= performance.now() - n2;
            }
            this.patch({ streamMessage: r2.message });
            break;
          case `message_end`:
            e2 = null, this.appendMessage(r2.message), this.patch({ streamMessage: null }), t2 && (r2.message.role !== `assistant` && r2.message.role !== `toolResult` && t2.request.context.messages.push(r2.message), r2.message.role === `assistant` && (t2.response = r2.message));
            break;
          case `tool_execution_start`: {
            let e3 = new Set(this._state.pendingToolCalls);
            e3.add(r2.toolCallId), this.patch({ pendingToolCalls: e3 });
            break;
          }
          case `tool_execution_end`: {
            let e3 = new Set(this._state.pendingToolCalls);
            e3.delete(r2.toolCallId), this.patch({ pendingToolCalls: e3 });
            break;
          }
          case `turn_end`:
            t2 &&= (t2.totalTime = performance.now() - n2, this.debugListener?.(t2), null);
            break;
          case `agent_end`:
            this.patch({ streamMessage: null });
            break;
        }
      if (e2 && e2.role === `assistant` && e2.content.length > 0) {
        if (e2.content.some(
          (e3) => e3.type === `thinking` && e3.thinking.trim().length > 0 || e3.type === `text` && e3.text.trim().length > 0 || e3.type === `toolCall` && e3.name.trim().length > 0
        ))
          this.appendMessage(e2);
        else if (this.abortController?.signal.aborted)
          throw Error(`Request was aborted`);
      }
    } catch (e2) {
      if (String(e2?.message || e2) === `no-api-key`)
        this.emit({ type: `error-no-api-key`, provider: n.provider });
      else {
        let t2 = {
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
              total: 0
            }
          },
          stopReason: this.abortController?.signal.aborted ? `aborted` : `error`,
          errorMessage: e2?.message || String(e2),
          timestamp: Date.now()
        };
        this.appendMessage(t2), this.patch({ error: e2?.message || String(e2) });
      }
    } finally {
      this.patch({
        isStreaming: false,
        streamMessage: null,
        pendingToolCalls: /* @__PURE__ */ new Set()
      }), this.abortController = void 0;
    }
  }
  patch(e) {
    this._state = { ...this._state, ...e }, this.emit({ type: `state-update`, state: this._state });
  }
  emit(e) {
    for (let t of this.listeners) t(e);
  }
};

export {
  i,
  o
};
//# sourceMappingURL=chunk-ASOE6ZTL.js.map
