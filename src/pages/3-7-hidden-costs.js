import { __decorate as e, i18n as t, t$1 as n, x as r } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import {
  AgentInterface as i,
  formatCost as a,
  formatTokenCount as o,
  getModel as s,
} from "../workshop-runtime/AgentRuntime.js";
import {
  Card as c,
  CardContent as l,
  CardHeader as u,
  CardTitle as d,
} from "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as f } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession as p } from "../workshop-runtime/AgentSession.js";

function h(e) {
  if (!e) return ``;
  if (typeof e === `string`) return e;
  if (Array.isArray(e)) return e.map(h).join(`\n`);
  if (e.type === `text`) return e.text || ``;
  if (e.type === `thinking`) return e.thinking || ``;
  if (e.type === `image`) return `[image]`;
  if (e.type === `toolCall`) return `${e.name || `tool`} ${JSON.stringify(e.arguments || {})}`;
  return String(e.text || e.content || ``);
}

function g(e) {
  return Math.max(1, Math.ceil(String(e || ``).length / 2.5));
}

function _(e, t) {
  const n = t.cost || { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 };
  return {
    input: e.input,
    output: e.output,
    cacheRead: 0,
    cacheWrite: 0,
    cost: {
      input: (e.input / 1e6) * (n.input || 0),
      output: (e.output / 1e6) * (n.output || 0),
      cacheRead: 0,
      cacheWrite: 0,
      total: (e.input / 1e6) * (n.input || 0) + (e.output / 1e6) * (n.output || 0),
    },
    estimated: true,
  };
}

let m = class extends f {
  constructor() {
    super();
    this.headerTitle = t(`The (Hidden) Costs`);
    this.sectionId = `3.7`;
    this.session = new p();
    this.session.setModel(s(`openai-codex`, `gpt-5.4-mini`));
    this.session.setSystemPrompt(
      t(`你是一個協助示範大型語言模型隱藏成本的助理。
請用繁體中文回答，保持自然、有幫助，並偶爾點出 token 使用量與成本的有趣事實。
例如，你可以提醒使用者：這段 系統提示 本身也會在每一輪訊息中消耗 token。`),
    );
    this.session.setThinkingLevel(`off`);
    this.agentInterface = new i();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = true;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.agentInterface.setInput(t(`嗨！可以幫我理解為什麼大型語言模型的成本會累積得這麼快嗎？`));
    this.unsubscribe = this.session.subscribe((e) => {
      if (e.type === `state-update`) this.requestUpdate();
    });
  }

  renderContentPanel() {
    return r`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }

  getCostRecords() {
    const e = this.session.state;
    const t = e.model || s(`openai-codex`, `gpt-5.4-mini`);
    const n = [];
    let r = e.systemPrompt || ``;
    for (const i of e.messages) {
      if (i.role === `assistant`) {
        const e =
          i.usage?.cost?.total > 0
            ? { ...i.usage, estimated: false }
            : _({ input: g(r), output: g(h(i.content)) }, t);
        n.push(e);
      }
      r += `\n${i.role}: ${h(i.content)}`;
    }
    return n;
  }

  renderLeftDemoPanel() {
    const e = this.getCostRecords();
    let n = 0;
    let i = 0;
    const s = [];
    let f = 0;
    for (const t of e) {
      const e = Number(t.cost?.total || 0);
      s.push(e);
      n += e;
      f += t.input || 0;
      f += t.output || 0;
      if (e > i) i = e;
    }
    return r`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(r`
					${u(d(t(`成本追蹤器`)))}
					${l(r`
						<div class="text-sm mb-2"><span class="text-muted-foreground">${t(`估算總計：`)}</span> ${a(n)}</div>
						<div class="text-xs text-muted-foreground mb-3">
							${
                e.length > 0
                  ? t(`本頁用目前模型牌價與文字長度估算 token；這不是 ChatGPT 訂閱的實際帳單。`)
                  : t(`送出幾則訊息後，這裡會估算每一輪把系統提示、歷史訊息與輸出算進去後的成本。`)
              }
						</div>
						<div class="space-y-2">
							${e.map((e, t) => {
                const n = s[t] || 0;
                const c = i > 0 ? Math.max(3, Math.round((n / i) * 100)) : 0;
                return r` <div>
									<div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
										<span>#${t + 1}${e.estimated ? ` ${`估算`}` : ``}</span>
										<span>${a(n)}</span>
									</div>
									<div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
										<div class="h-full bg-primary/70" style="width: ${c}%"></div>
									</div>
									<div class="mt-1 text-xs text-muted-foreground">
										↑${o(e.input || 0)} ↓${o(e.output || 0)}
									</div>
								</div>`;
              })}
							${e.length === 0 ? r`<div class="text-xs text-muted-foreground">${t(`尚無助理訊息。`)}</div>` : ``}
						</div>
					`)}
				`)}
			</div>
		`;
  }

  renderRightDemoPanel() {
    return r`
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

m = e([n(`hidden-costs-demo`)], m);
document.body.innerHTML = `<hidden-costs-demo></hidden-costs-demo>`;
export { m as HiddenCostsDemo };
