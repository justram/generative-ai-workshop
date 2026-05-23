import {
  o
} from "../chunks/chunk-6TTNE7IQ.js";
import {
  A,
  E,
  O,
  T,
  bR,
  m,
  u,
  v
} from "../chunks/chunk-QLBDILTC.js";
import {
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/3-3-context-window.js
var m2 = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u4E0A\u4E0B\u6587\u8996\u7A97`);
    this.sectionId = `3.3`;
    this.maxContextTokens = 200;
    this.droppedMessages = [];
    this.actualMessages = [];
    this.currentTokens = { input: 0, output: 0 };
    this.messagesToSkip = 0;
    this.session = new o({
      messagePreprocessor: async (e2) => {
        this.recomputeWindow(e2);
        return e2.slice(this.messagesToSkip);
      },
      authTokenProvider: v
    });
    const e = [
      {
        role: `user`,
        content: [{ type: `text`, text: i18n(`\u6211\u53EB Mario\u3002\u4F60\u4ECA\u5929\u597D\u55CE\uFF1F`) }]
      },
      {
        role: `assistant`,
        content: [
          {
            type: `text`,
            text: i18n(`Mario \u4F60\u597D\uFF01\u5F88\u9AD8\u8208\u8A8D\u8B58\u4F60\u3002\u6211\u5F88\u597D\uFF0C\u8B1D\u8B1D\u95DC\u5FC3\uFF01\u4F60\u4ECA\u5929\u904E\u5F97\u5982\u4F55\uFF1F`)
          }
        ],
        api: `openai-codex-responses`,
        provider: `openai-codex`,
        model: `gpt-5.4-mini`,
        usage: {
          input: 12,
          output: 14,
          cacheRead: 0,
          cacheWrite: 0,
          cost: { cacheRead: 0, cacheWrite: 0, input: 0, output: 0, total: 0 }
        },
        stopReason: `stop`
      }
    ];
    this.session.replaceMessages(e);
    this.recomputeWindow(e);
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = false;
    this.agentInterface.enableModelSelector = false;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.agentInterface.setInput(i18n(`\u4F60\u53EF\u4EE5\u544A\u8A34\u6211\u54EA\u4E9B\u95DC\u65BC\u91CF\u5B50\u904B\u7B97\u7684\u4E8B\uFF1F`));
    this.unsubscribe = this.session.subscribe((e2) => {
      if (e2.type !== `state-update`) return;
      this.recomputeWindow(e2.state.messages);
    });
  }
  estimateMessageTokens(e) {
    const n = this.getMessageText(e);
    const r2 = e.role === `assistant` ? 4 : 3;
    const i = Array.from(n).length;
    const a = n.trim() ? n.trim().split(/\s+/u).length : 0;
    return Math.max(1, Math.ceil(i / 2.2), a) + r2;
  }
  recomputeWindow(e) {
    let n = e.slice(this.messagesToSkip);
    let r2 = n.reduce((e2, n2) => e2 + this.estimateMessageTokens(n2), 0);
    while (r2 > this.maxContextTokens && n.length > 2 && this.messagesToSkip < e.length - 2) {
      this.messagesToSkip += 2;
      n = e.slice(this.messagesToSkip);
      r2 = n.reduce((e2, n2) => e2 + this.estimateMessageTokens(n2), 0);
    }
    this.droppedMessages = e.slice(0, this.messagesToSkip);
    this.actualMessages = n;
    this.currentTokens = { input: r2, output: 0 };
  }
  getMessageText(e) {
    if (typeof e.content === `string`) return e.content;
    if (Array.isArray(e.content)) {
      return e.content.filter((e2) => e2.type === `text`).map((e2) => e2.text || ``).join(` `);
    }
    return ``;
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    const e = this.currentTokens.input + this.currentTokens.output;
    const n = Math.min(e / this.maxContextTokens * 100, 100);
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u5148\u9001\u5E7E\u5247\u8A0A\u606F\uFF0C\u518D\u554F\u300C\u6211\u53EB\u4EC0\u9EBC\u540D\u5B57\uFF1F\u300D\u89C0\u5BDF\u4E0A\u4E0B\u6587\u585E\u6EFF\u5F8C\uFF0C\u8F03\u65E9\u7684\u8A0A\u606F\u5982\u4F55\u88AB\u79FB\u51FA\u6A21\u578B\u9019\u4E00\u8F2A\u770B\u5F97\u5230\u7684\u7BC4\u570D\u3002`)}
				</p>
				${T(b`
					${E(O(i18n(`\u4E0A\u4E0B\u6587\u8996\u7A97`)))}
					${A(b`
						<div class="mb-2 flex items-baseline justify-between">
							<span class="text-3xl font-light">${e}</span>
							<span class="text-sm text-muted-foreground">/ ${this.maxContextTokens}</span>
						</div>
						<div class="text-xs text-muted-foreground mb-2">
							${i18n(`\u4F30\u7B97\u76EE\u524D\u4ECD\u5728\u4E0A\u4E0B\u6587\u4E2D\u7684\u8A0A\u606F token\uFF1B\u9001\u51FA\u66F4\u591A\u8A0A\u606F\u6642\u6703\u7D2F\u7A4D\uFF0C\u8D85\u904E\u4E0A\u9650\u5F8C\u6703\u4E1F\u6389\u6700\u65E9\u7684\u5C0D\u8A71\u3002`)}
						</div>
						<div class="w-full bg-muted rounded-full h-1 overflow-hidden">
							<div
								class="h-full transition-all duration-500 ease-out ${n > 90 ? `bg-red-500` : n > 70 ? `bg-amber-500` : `bg-emerald-500/80`}"
								style="width: ${n}%"
							></div>
						</div>
					`)}
				`)}
				${this.droppedMessages.length > 0 ? T(b`
							${E(
      O(b`<div class="flex flex-row gap-2">
										${i18n(`\u5DF2\u79FB\u51FA\u4E0A\u4E0B\u6587`)} ${u(String(this.droppedMessages.length), `secondary`, `ml-2`)}
									</div>`)
    )}
							${A(
      b`${this.droppedMessages.map(
        (e2) => b`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e2.role === `user` ? i18n(`User`) : e2.role === `assistant` ? i18n(`Assistant`) : e2.role}</div>
											<div class="text-xs text-muted-foreground line-through opacity-60 mt-0.5">
												${this.getMessageText(e2).substring(0, 80)}${this.getMessageText(e2).length > 80 ? `...` : ``}
											</div>
										</div>
									`
      )}`
    )}
						`) : b``}
				${T(b`
					${E(O(b`${i18n(`In Context`)} ${u(String(this.actualMessages.length), `secondary`, `ml-2`)}`))}
					${A(
      b`${this.actualMessages.length > 0 ? this.actualMessages.map(
        (e2) => b`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e2.role === `user` ? i18n(`User`) : e2.role === `assistant` ? i18n(`Assistant`) : e2.role}</div>
											<div class="text-xs mt-0.5">
												${this.getMessageText(e2).substring(0, 80)}${this.getMessageText(e2).length > 80 ? `...` : ``}
											</div>
										</div>
									`
      ) : b`<div class="text-sm text-muted-foreground">
									${i18n(`Messages will appear here as the conversation grows`)}
								</div>`}`
    )}
				`)}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }
};
__decorate([r()], m2.prototype, `maxContextTokens`, void 0);
__decorate([r()], m2.prototype, `droppedMessages`, void 0);
__decorate([r()], m2.prototype, `actualMessages`, void 0);
__decorate([r()], m2.prototype, `currentTokens`, void 0);
__decorate([r()], m2.prototype, `messagesToSkip`, void 0);
m2 = __decorate([t(`context-window-demo`)], m2);
document.body.innerHTML = `<context-window-demo></context-window-demo>`;
export {
  m2 as ContextWindowDemo
};
//# sourceMappingURL=3-3-context-window.js.map
