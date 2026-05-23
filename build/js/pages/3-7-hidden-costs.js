import {
  o
} from "../chunks/chunk-KUWO6TGG.js";
import {
  A,
  E,
  O,
  Pi,
  T,
  bR,
  ft,
  lt,
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/3-7-hidden-costs.js
function h(e) {
  if (!e) return ``;
  if (typeof e === `string`) return e;
  if (Array.isArray(e)) return e.map(h).join(`
`);
  if (e.type === `text`) return e.text || ``;
  if (e.type === `thinking`) return e.thinking || ``;
  if (e.type === `image`) return `[image]`;
  if (e.type === `toolCall`) return `${e.name || `tool`} ${JSON.stringify(e.arguments || {})}`;
  return String(e.text || e.content || ``);
}
function g(e) {
  return Math.max(1, Math.ceil(String(e || ``).length / 2.5));
}
function _(e, t2) {
  const n = t2.cost || { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  return {
    input: e.input,
    output: e.output,
    cacheRead: 0,
    cacheWrite: 0,
    cost: {
      input: e.input / 1e6 * (n.input || 0),
      output: e.output / 1e6 * (n.output || 0),
      cacheRead: 0,
      cacheWrite: 0,
      total: e.input / 1e6 * (n.input || 0) + e.output / 1e6 * (n.output || 0)
    },
    estimated: true
  };
}
var m2 = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`The (Hidden) Costs`);
    this.sectionId = `3.7`;
    this.session = new o();
    this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`));
    this.session.setSystemPrompt(`\u4F60\u662F\u4E00\u500B\u5354\u52A9\u793A\u7BC4\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u96B1\u85CF\u6210\u672C\u7684\u52A9\u7406\u3002
\u8ACB\u7528\u7E41\u9AD4\u4E2D\u6587\u56DE\u7B54\uFF0C\u4FDD\u6301\u81EA\u7136\u3001\u6709\u5E6B\u52A9\uFF0C\u4E26\u5076\u723E\u9EDE\u51FA token \u4F7F\u7528\u91CF\u8207\u6210\u672C\u7684\u6709\u8DA3\u4E8B\u5BE6\u3002
\u4F8B\u5982\uFF0C\u4F60\u53EF\u4EE5\u63D0\u9192\u4F7F\u7528\u8005\uFF1A\u9019\u6BB5 \u7CFB\u7D71\u63D0\u793A \u672C\u8EAB\u4E5F\u6703\u5728\u6BCF\u4E00\u8F2A\u8A0A\u606F\u4E2D\u6D88\u8017 token\u3002`);
    this.session.setThinkingLevel(`off`);
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = true;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.agentInterface.setInput(`\u55E8\uFF01\u53EF\u4EE5\u5E6B\u6211\u7406\u89E3\u70BA\u4EC0\u9EBC\u5927\u578B\u8A9E\u8A00\u6A21\u578B\u7684\u6210\u672C\u6703\u7D2F\u7A4D\u5F97\u9019\u9EBC\u5FEB\u55CE\uFF1F`);
    this.unsubscribe = this.session.subscribe((e) => {
      if (e.type === `state-update`) this.requestUpdate();
    });
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  getCostRecords() {
    const e = this.session.state;
    const t2 = e.model || Pi(`openai-codex`, `gpt-5.4-mini`);
    const n = [];
    let r = e.systemPrompt || ``;
    for (const i of e.messages) {
      if (i.role === `assistant`) {
        const e2 = i.usage?.cost?.total > 0 ? { ...i.usage, estimated: false } : _({ input: g(r), output: g(h(i.content)) }, t2);
        n.push(e2);
      }
      r += `
${i.role}: ${h(i.content)}`;
    }
    return n;
  }
  renderLeftDemoPanel() {
    const e = this.getCostRecords();
    let n = 0;
    let i = 0;
    const s = [];
    let f = 0;
    for (const t2 of e) {
      const e2 = Number(t2.cost?.total || 0);
      s.push(e2);
      n += e2;
      f += t2.input || 0;
      f += t2.output || 0;
      if (e2 > i) i = e2;
    }
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${T(b`
					${E(O(i18n(`\u6210\u672C\u8FFD\u8E64\u5668`)))}
					${A(b`
						<div class="text-sm mb-2"><span class="text-muted-foreground">${i18n(`\u4F30\u7B97\u7E3D\u8A08\uFF1A`)}</span> ${lt(n)}</div>
						<div class="text-xs text-muted-foreground mb-3">
							${e.length > 0 ? i18n(`\u672C\u9801\u7528\u76EE\u524D\u6A21\u578B\u724C\u50F9\u8207\u6587\u5B57\u9577\u5EA6\u4F30\u7B97 token\uFF1B\u9019\u4E0D\u662F ChatGPT \u8A02\u95B1\u7684\u5BE6\u969B\u5E33\u55AE\u3002`) : i18n(`\u9001\u51FA\u5E7E\u5247\u8A0A\u606F\u5F8C\uFF0C\u9019\u88E1\u6703\u4F30\u7B97\u6BCF\u4E00\u8F2A\u628A\u7CFB\u7D71\u63D0\u793A\u3001\u6B77\u53F2\u8A0A\u606F\u8207\u8F38\u51FA\u7B97\u9032\u53BB\u5F8C\u7684\u6210\u672C\u3002`)}
						</div>
						<div class="space-y-2">
							${e.map((e2, t2) => {
      const n2 = s[t2] || 0;
      const c = i > 0 ? Math.max(3, Math.round(n2 / i * 100)) : 0;
      return b` <div>
									<div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
										<span>#${t2 + 1}${e2.estimated ? ` ${`\u4F30\u7B97`}` : ``}</span>
										<span>${lt(n2)}</span>
									</div>
									<div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
										<div class="h-full bg-primary/70" style="width: ${c}%"></div>
									</div>
									<div class="mt-1 text-xs text-muted-foreground">
										↑${ft(e2.input || 0)} ↓${ft(e2.output || 0)}
									</div>
								</div>`;
    })}
							${e.length === 0 ? b`<div class="text-xs text-muted-foreground">${i18n(`\u5C1A\u7121\u52A9\u7406\u8A0A\u606F\u3002`)}</div>` : ``}
						</div>
					`)}
				`)}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
			</div>
		`;
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.unsubscribe?.();
  }
};
m2 = __decorate([t(`hidden-costs-demo`)], m2);
document.body.innerHTML = `<hidden-costs-demo></hidden-costs-demo>`;
export {
  m2 as HiddenCostsDemo
};
//# sourceMappingURL=3-7-hidden-costs.js.map
