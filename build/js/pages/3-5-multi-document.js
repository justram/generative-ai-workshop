import {
  o
} from "../chunks/chunk-KUWO6TGG.js";
import {
  A,
  E,
  O,
  T,
  _R,
  bR,
  m,
  u
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/3-5-multi-document.js
var m2 = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u7576\u4F60\u4E0A\u50B3\u591A\u4EFD\u6587\u4EF6\u6642`);
    this.sectionId = `3.5`;
    this.loadingChallenge = false;
    this.selectedChallenge = ``;
    this.challenges = [];
    this.currentChallenge = null;
    this.currentAttachments = [];
    this.pipelineStage = `idle`;
    this.pipelineExpanded = true;
    this.pipelineStartedAt = 0;
    this.pipelineFinishedAt = 0;
    this.pipelineNow = 0;
    this.pipelineTimer = null;
    this.hookedEditor = null;
    this.session = new o();
    this.session.setSystemPrompt(
      i18n(
        `\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u6790\u591A\u4EFD\u6587\u4EF6\u7684\u52A9\u7406\u3002\u8ACB\u53EA\u6839\u64DA\u63D0\u4F9B\u7684\u6587\u4EF6\u56DE\u7B54\uFF1B\u5982\u679C\u7B54\u6848\u9700\u8981\u8DE8\u6587\u4EF6\u6BD4\u5C0D\uFF0C\u8ACB\u660E\u78BA\u6307\u51FA\u4F9D\u64DA\u4F86\u81EA\u54EA\u4EFD\u6587\u4EF6\u3002`
      )
    );
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.loadChallenges();
  }
  updated() {
    super.updated?.();
    this.syncEditorFileHook();
  }
  firstUpdated() {
    super.firstUpdated?.();
    this.scheduleEditorFileHook();
  }
  scheduleEditorFileHook(e = 0) {
    window.setTimeout(() => {
      this.syncEditorFileHook();
      if (!this.hookedEditor && e < 10) this.scheduleEditorFileHook(e + 1);
    }, 100);
  }
  syncEditorFileHook() {
    const e = this.agentInterface?._messageEditor;
    if (!e || e === this.hookedEditor) return;
    this.hookedEditor = e;
    const n = e.onFilesChange;
    e.onFilesChange = (r2) => {
      n?.(r2);
      this.handleEditorAttachmentsChange(r2);
    };
    if (e.attachments?.length) this.handleEditorAttachmentsChange(e.attachments);
  }
  handleEditorAttachmentsChange(e) {
    if (this.loadingChallenge) return;
    const n = e || [];
    if (!n.length) {
      if (this.selectedChallenge === `custom-upload`) this.resetPipeline();
      return;
    }
    const r2 = n.map((e2) => e2.id).join(`|`);
    if (r2 === this.currentAttachments.map((e2) => e2.id).join(`|`)) return;
    this.selectedChallenge = `custom-upload`;
    this.currentChallenge = {
      name: `custom-upload`,
      displayName: i18n(`\u81EA\u8A02\u591A\u6587\u4EF6\u4E0A\u50B3`),
      description: i18n(`\u5B78\u751F\u81EA\u884C\u4E0A\u50B3\u7684\u6587\u4EF6\uFF1B\u8ACB\u5728\u804A\u5929\u6846\u8F38\u5165\u9700\u8981\u8DE8\u6587\u4EF6\u6BD4\u5C0D\u7684\u554F\u984C\u3002`),
      question: this.agentInterface?._messageEditor?.value || i18n(`\u8ACB\u8F38\u5165\u4E00\u500B\u9700\u8981\u540C\u6642\u8B80\u591A\u4EFD\u6587\u4EF6\u7684\u554F\u984C\u3002`),
      choices: {},
      answer: ``,
      explanation: i18n(
        `\u81EA\u8A02\u4E0A\u50B3\u6C92\u6709\u9810\u8A2D\u53C3\u8003\u7B54\u6848\u3002\u6559\u5B78\u91CD\u9EDE\u662F\u6AA2\u67E5 payload \u88E1\u662F\u5426\u771F\u7684\u5305\u542B\u591A\u4EFD\u6587\u4EF6\uFF0C\u4EE5\u53CA\u6A21\u578B\u56DE\u7B54\u662F\u5426\u660E\u78BA\u6A19\u793A\u4F86\u6E90\u3002`
      )
    };
    this.currentAttachments = n;
    this.pipelineStage = `ready`;
    this.pipelineExpanded = true;
    this.pipelineStartedAt = Date.now();
    this.pipelineFinishedAt = Date.now();
    this.pipelineNow = this.pipelineFinishedAt;
  }
  resetPipeline() {
    this.currentChallenge = null;
    this.currentAttachments = [];
    this.pipelineStage = `idle`;
    this.pipelineStartedAt = 0;
    this.pipelineFinishedAt = 0;
    this.pipelineNow = 0;
    this.stopPipelineClock(false);
  }
  renderContentPanel() {
    return b`
			<div class="w-full h-full flex flex-col bg-background">
				${this.currentAttachments.length || this.pipelineStage !== `idle` ? b`<div class="border-b border-border bg-card/70 px-4 py-3">${this.renderPipelineCard()}</div>` : b``}
				<div class="flex-1 min-h-0 p-4 pb-4">${this.agentInterface}</div>
			</div>
		`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u9078\u4E00\u500B\u60C5\u5883\uFF0C\u8F09\u5165\u5169\u4EFD\u6587\u4EF6\uFF0C\u89C0\u5BDF\u6A21\u578B\u80FD\u4E0D\u80FD\u8DE8\u6587\u4EF6\u6838\u5C0D\u689D\u4EF6\u3001\u6392\u9664\u932F\u8AA4\u9078\u9805\uFF0C\u4E26\u7528\u4F86\u6E90\u652F\u6301\u7B54\u6848\u3002`)}
				</p>
				${T(b`
					${E(O(i18n(`\u591A\u6587\u4EF6\u6311\u6230`)))}
					${A(b`<div class="flex flex-col gap-2">${this.challenges.map((e) => this.renderChallengeButton(e))}</div>`)}
				`)}
				${T(b`${E(O(i18n(`\u53C3\u8003\u7B54\u6848\u8207\u6559\u5B78\u91CD\u9EDE`)))} ${A(b`${this.renderCorrectAnswer()}`)}`)}
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
  renderChallengeButton(e) {
    const n = this.selectedChallenge === e.name;
    return b`
			<button
				class="w-full text-left p-3 rounded-md border transition-colors ${n ? `bg-accent/40 border-accent` : `bg-card border-border hover:bg-accent/30`}"
				?disabled=${this.loadingChallenge}
				@click=${() => this.loadChallenge(e)}
			>
				<div class="flex items-start gap-3">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium">${e.displayName}</div>
						<div class="text-xs text-muted-foreground mt-1">${e.description}</div>
						<div class="text-xs text-muted-foreground mt-2">
							${e.files.length} ${i18n(`\u4EFD\u6587\u4EF6`)}：${e.fileLabels.join(`\u3001`)}
						</div>
					</div>
					${n ? u(i18n(`\u5DF2\u9078\u53D6`), `secondary`) : b``}
				</div>
			</button>
		`;
  }
  renderCorrectAnswer() {
    if (!this.selectedChallenge) {
      return b`<div class="text-sm text-muted-foreground">${i18n(`\u9078\u53D6\u4E00\u500B\u6311\u6230\u5F8C\uFF0C\u9019\u88E1\u6703\u986F\u793A\u53C3\u8003\u7B54\u6848\u8207\u5224\u65B7\u4F9D\u64DA\u3002`)}</div>`;
    }
    if (this.selectedChallenge === `custom-upload`) {
      return b`
				<div class="rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed">
					<div class="font-semibold text-foreground">${i18n(`\u81EA\u8A02\u4E0A\u50B3\u6C92\u6709\u6A19\u6E96\u7B54\u6848`)}</div>
					<div class="mt-1 text-muted-foreground">${i18n(`\u8ACB\u8981\u6C42\u6A21\u578B\u9010\u4E00\u5F15\u7528\u6A94\u540D\u6216\u6BB5\u843D\u3002\u9019\u4E00\u9801\u8981\u770B\u7684\u4E0D\u662F\u6A21\u578B\u6709\u6C92\u6709\u731C\u4E2D\u9078\u9805\uFF0C\u800C\u662F\u5B83\u662F\u5426\u771F\u7684\u540C\u6642\u4F7F\u7528\u591A\u4EFD\u6587\u4EF6\u3001\u662F\u5426\u628A\u4F86\u6E90\u8AAA\u6E05\u695A\u3002`)}</div>
				</div>
			`;
    }
    const e = this.challenges.find((e2) => e2.name === this.selectedChallenge);
    if (!e) return b``;
    return b`
			<div class="text-sm font-medium mb-2">${e.question}</div>
			<div class="space-y-2 mb-3">
				${Object.entries(e.choices).map(([t2, n]) => {
      const r2 = t2 === e.answer;
      return b`<div
						class="text-xs p-2 rounded ${r2 ? `bg-green-100 dark:bg-green-500/10 border border-green-500 text-green-700 dark:text-green-400` : `text-muted-foreground`}"
					>
						<strong>${t2})</strong> ${n} ${r2 ? b`<span class="ml-2 font-medium">✓</span>` : ``}
					</div>`;
    })}
			</div>
			<div class="rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap">${e.explanation}</div>
		`;
  }
  getPipelineOrder() {
    return [`files`, `extract`, `context`, `ready`];
  }
  getCompletedPipelineCount() {
    const e = this.getPipelineOrder();
    const n = e.indexOf(this.pipelineStage);
    if (this.pipelineStage === `ready`) return e.length;
    return Math.max(0, n);
  }
  startPipelineClock() {
    this.stopPipelineClock(false);
    this.pipelineStartedAt = Date.now();
    this.pipelineFinishedAt = 0;
    this.pipelineNow = this.pipelineStartedAt;
    this.pipelineTimer = window.setInterval(() => {
      this.pipelineNow = Date.now();
    }, 500);
  }
  stopPipelineClock(e = this.pipelineStage === `ready`) {
    if (this.pipelineTimer) {
      window.clearInterval(this.pipelineTimer);
      this.pipelineTimer = null;
    }
    if (e && this.pipelineStartedAt && !this.pipelineFinishedAt) {
      this.pipelineFinishedAt = Date.now();
      this.pipelineNow = this.pipelineFinishedAt;
    }
  }
  formatElapsedTime(e) {
    const n = Math.max(0, e) / 1e3;
    return n < 60 ? `${n.toFixed(1)}s` : `${Math.floor(n / 60)}m ${Math.round(n % 60)}s`;
  }
  renderProgressMarker(e, n, r2) {
    if (n)
      return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    if (e) {
      return b`<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15"><div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div></div>`;
    }
    return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${r2}</div>`;
  }
  renderStepOutcome(e, n) {
    if (!e) return ``;
    return b`
			<details class="mt-2 rounded-md border border-border bg-background/75">
				<summary class="cursor-pointer select-none px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground">${e}</summary>
				<div class="border-t border-border p-3">${n}</div>
			</details>
		`;
  }
  renderPipelineStep(e, n, r2, a, o2, s = true) {
    const c = this.getPipelineOrder();
    const l = c.indexOf(this.pipelineStage);
    const u2 = c.indexOf(e);
    const d = this.pipelineStage === e && this.pipelineStage !== `ready`;
    const f = l > u2 || this.pipelineStage === `ready`;
    const p = d ? `border-amber-400/70 bg-amber-400/10` : f ? `border-emerald-500/40 bg-emerald-500/10` : `border-border bg-muted/15`;
    return b`
			<div class="rounded-lg border ${p} p-3">
				<div class="flex gap-3">
					<div class="relative shrink-0">
						${s ? b`<div class="absolute left-1/2 top-7 h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-border"></div>` : ``}
						${this.renderProgressMarker(d, f, n)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<div class="text-sm font-bold text-foreground">${r2}</div>
							${d ? b`<span class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">${i18n(`\u9032\u884C\u4E2D`)}</span>` : ``}
							${f ? b`<span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">${i18n(`\u5B8C\u6210`)}</span>` : ``}
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">${a}</div>
						${o2 ? b`<div class="mt-2 text-xs leading-5 text-muted-foreground">${o2}</div>` : ``}
					</div>
				</div>
			</div>
		`;
  }
  renderPipelineCard() {
    if (!this.currentAttachments.length && this.pipelineStage === `idle`) return ``;
    const e = this.getCompletedPipelineCount();
    const n = this.getPipelineOrder().length;
    const r2 = Math.round(e / n * 100);
    const a = Math.max(
      0,
      (this.pipelineFinishedAt || this.pipelineNow || Date.now()) - (this.pipelineStartedAt || Date.now())
    );
    const o2 = this.pipelineStage === `ready`;
    const f = this.currentChallenge;
    return b`
			<details class="group rounded-xl border border-border bg-background/70" ?open=${this.pipelineExpanded} @toggle=${(e2) => this.pipelineExpanded = e2.currentTarget.open}>
				<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-3">
							<div class="text-sm font-bold text-foreground">${o2 ? i18n(`\u591A\u6587\u4EF6\u4E0A\u4E0B\u6587\u5DF2\u6E96\u5099\u597D`) : i18n(`\u591A\u6587\u4EF6\u8655\u7406\u4E2D`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${e}/${n} ${i18n(`\u5B8C\u6210`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(a)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">${this.currentAttachments.length} ${i18n(`\u4EFD\u6587\u4EF6`)}</div>
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">
							${i18n(`\u591A\u6587\u4EF6\u4EFB\u52D9\u7684\u91CD\u9EDE\u4E0D\u662F\u628A\u6587\u5B57\u5168\u90E8\u4E1F\u9032\u53BB\uFF0C\u800C\u662F\u77E5\u9053\u6BCF\u4EFD\u6587\u4EF6\u63D0\u4F9B\u54EA\u500B\u8B49\u64DA\u3001\u54EA\u500B\u6587\u4EF6\u6392\u9664\u4E86\u932F\u8AA4\u7B54\u6848\u3002`)}
						</div>
						<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
							<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${r2}%`}></div>
						</div>
					</div>
					<span class="shrink-0 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground">${this.pipelineExpanded ? i18n(`\u6536\u5408`) : i18n(`\u5C55\u958B`)}</span>
				</summary>
				<div class="overflow-y-auto border-t border-border p-4 overscroll-contain" style="max-height:42vh">
					<div class="mb-3 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs leading-6 text-muted-foreground">
						<span class="font-bold text-foreground">${i18n(`\u65B0\u6982\u5FF5\uFF1A`)}</span>
						${i18n(`\u55AE\u6587\u4EF6\u554F\u7B54\u5E38\u662F\u5728\u627E\u7B54\u6848\uFF1B\u591A\u6587\u4EF6\u554F\u7B54\u662F\u5728\u505A\u4EA4\u53C9\u6AA2\u67E5\u3002\u6A21\u578B\u5FC5\u9808\u540C\u6642\u4FDD\u7559\u4F86\u6E90\u3001\u689D\u4EF6\u8207\u6392\u9664\u7406\u7531\u3002`)}
					</div>
					<div class="grid gap-3">
						${this.renderPipelineStep(
      `files`,
      1,
      i18n(`\u6536\u5230\u591A\u4EFD\u9644\u4EF6`),
      i18n(`\u6BCF\u4EFD\u6587\u4EF6\u6703\u4EE5\u7368\u7ACB\u9644\u4EF6\u9032\u5165\u804A\u5929\u6846\u3002\u9806\u5E8F\u3001\u6A94\u540D\u8207\u4F86\u6E90\u90FD\u6703\u5F71\u97FF\u5B78\u751F\u4E4B\u5F8C\u600E\u9EBC\u6AA2\u67E5\u56DE\u7B54\u3002`),
      this.renderAttachmentListOutcome()
    )}
						${this.renderPipelineStep(
      `extract`,
      2,
      i18n(`\u5404\u81EA\u62BD\u6210\u6587\u5B57`),
      i18n(
        `\u9019\u88E1\u793A\u7BC4\u6587\u5B57\u6587\u4EF6\u7684\u62BD\u53D6\u7D50\u679C\u3002\u771F\u5BE6\u7522\u54C1\u82E5\u662F PDF\u3001Word \u6216\u6383\u63CF\u5716\uFF0C\u4E5F\u6703\u5148\u5F62\u6210\u53EF\u9001\u9032\u6A21\u578B\u7684\u6587\u5B57\u7247\u6BB5\u3002`
      ),
      this.renderExtractedDocumentsOutcome()
    )}
						${this.renderPipelineStep(
      `context`,
      3,
      i18n(`\u7D44\u6210\u591A\u6587\u4EF6\u4E0A\u4E0B\u6587`),
      i18n(`\u6A21\u578B\u6536\u5230\u7684\u4E0D\u53EA\u662F\u4E00\u5305\u6587\u5B57\uFF0C\u800C\u662F\u4F7F\u7528\u8005\u554F\u984C\uFF0C\u52A0\u4E0A\u591A\u500B\u6A19\u8A18\u4E86\u6A94\u540D\u7684 document text\u3002`),
      this.renderContextOutcome()
    )}
						${this.renderPipelineStep(
      `ready`,
      4,
      i18n(`\u8981\u6C42\u8DE8\u6587\u4EF6\u4F5C\u7B54`),
      i18n(`\u7B54\u6848\u61C9\u8A72\u8AAA\u660E\u54EA\u4E9B\u689D\u4EF6\u4F86\u81EA\u54EA\u4EFD\u6587\u4EF6\uFF1B\u5982\u679C\u53EA\u5F15\u7528\u4E00\u4EFD\u6587\u4EF6\u6216\u53EA\u6293\u95DC\u9375\u5B57\uFF0C\u5C31\u5F88\u5BB9\u6613\u9078\u932F\u3002`),
      o2 ? f?.answer ? i18n(`\u9001\u51FA\u5F8C\uFF0C\u8ACB\u5C0D\u7167\u5DE6\u5074\u53C3\u8003\u7B54\u6848\uFF0C\u770B\u6A21\u578B\u662F\u5426\u540C\u6642\u4F7F\u7528\u5169\u4EFD\u6587\u4EF6\u4E26\u6392\u9664\u932F\u8AA4\u9078\u9805\u3002`) : i18n(`\u9001\u51FA\u5F8C\uFF0C\u8ACB\u6AA2\u67E5\u6A21\u578B\u662F\u5426\u9010\u4E00\u6A19\u793A\u4F86\u6E90\uFF1B\u81EA\u8A02\u6587\u4EF6\u6C92\u6709\u6A19\u6E96\u7B54\u6848\u3002`) : i18n(`\u7B49\u5F85\u591A\u6587\u4EF6\u4E0A\u4E0B\u6587\u5B8C\u6210\u3002`),
      false
    )}
					</div>
				</div>
			</details>
		`;
  }
  renderAttachmentListOutcome() {
    if (!this.currentAttachments.length) return i18n(`\u7B49\u5F85\u9644\u4EF6\u3002`);
    return b`
			<div class="grid gap-2">
				${this.currentAttachments.map(
      (e, n) => b`
					<div class="rounded-md border border-border bg-muted/30 p-2 text-xs">
						<div class="font-semibold text-foreground">${i18n(`\u6587\u4EF6`)} ${n + 1}: ${e.fileName}</div>
						<div class="mt-1 text-muted-foreground">${e.mimeType || i18n(`\u672A\u77E5\u683C\u5F0F`)} · ${Math.round((e.size || 0) / 1024)} KB</div>
					</div>
				`
    )}
			</div>
		`;
  }
  renderExtractedDocumentsOutcome() {
    if (!this.currentAttachments.length) return ``;
    return b`
			<div class="grid gap-2">
				${this.currentAttachments.map(
      (e, n) => this.renderStepOutcome(
        `${i18n(`\u67E5\u770B\u6587\u4EF6`)} ${n + 1}: ${e.fileName}`,
        b`<pre class="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${e.extractedText || i18n(`\u9019\u4EFD\u9644\u4EF6\u6C92\u6709\u62BD\u53D6\u6587\u5B57\u3002`)}</pre>`
      )
    )}
			</div>
		`;
  }
  renderContextOutcome() {
    return b`
			<div>
				<div>${i18n(`\u5DF2\u628A\u591A\u4EFD\u6587\u4EF6\u5206\u5225\u6A19\u8A18\u6A94\u540D\u5F8C\u653E\u9032\u6A21\u578B\u4E0A\u4E0B\u6587\u3002\u9019\u8B93\u5B78\u751F\u53EF\u4EE5\u6AA2\u67E5\u6A21\u578B\u662F\u5426\u771F\u7684\u8DE8\u6587\u4EF6\u5F15\u7528\uFF0C\u800C\u4E0D\u662F\u53EA\u6293\u5176\u4E2D\u4E00\u4EFD\u3002`)}</div>
				${this.renderStepOutcome(
      i18n(`\u67E5\u770B\u5BE6\u969B\u9001\u7D66\u6A21\u578B\u7684 payload`),
      b`<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.renderModelPayloadPreview()}</pre>`
    )}
				${this.currentChallenge?.answer ? this.renderStepOutcome(
      i18n(`\u67E5\u770B\u9019\u984C\u9700\u8981\u7684\u8DE8\u6587\u4EF6\u5224\u65B7`),
      b`<div class="space-y-2 text-xs leading-5 text-muted-foreground">
								<div><span class="font-semibold text-foreground">${i18n(`\u554F\u984C`)}</span>：${this.currentChallenge.question}</div>
								<div><span class="font-semibold text-foreground">${i18n(`\u6B63\u78BA\u7B54\u6848`)}</span>：${this.currentChallenge.answer}</div>
								<div class="rounded-md border border-border bg-muted/30 p-3 whitespace-pre-wrap">${this.currentChallenge.explanation}</div>
							</div>`
    ) : ``}
			</div>
		`;
  }
  renderModelPayloadPreview() {
    const e = this.agentInterface?._messageEditor;
    const n = e?.value || this.currentChallenge?.question || i18n(`\u4F7F\u7528\u8005\u5C1A\u672A\u8F38\u5165\u554F\u984C`);
    const r2 = [{ type: `text`, text: n }];
    for (const e2 of this.currentAttachments) {
      if (e2.extractedText) {
        r2.push({
          type: `text`,
          isDocument: true,
          fileName: e2.fileName,
          text: `\\n\\n[Document preprocessed from ${e2.fileName}]\\n${e2.extractedText}`
        });
      } else {
        r2.push({
          type: e2.type || `document`,
          fileName: e2.fileName,
          mimeType: e2.mimeType,
          data: `<raw attachment omitted>`
        });
      }
    }
    return JSON.stringify(
      {
        systemPrompt: this.session.state.systemPrompt,
        messages: [{ role: `user`, content: r2 }]
      },
      null,
      2
    );
  }
  async loadChallenges() {
    try {
      const [e, n] = await Promise.all([
        fetch(`/data/multidoc-1-question.json`),
        fetch(`/data/multidoc-2-question.json`)
      ]);
      const r2 = await e.json();
      const i = await n.json();
      this.challenges = [
        {
          name: `battery-charger`,
          displayName: i18n(`\u96FB\u6C60\u898F\u683C\u8207\u5145\u96FB\u5668\u5831\u50F9`),
          description: i18n(`\u8DE8\u6587\u4EF6\u6838\u5C0D\u898F\u683C\uFF0C\u907F\u514D\u88AB\u300C48V\u300D\u9019\u7A2E\u884C\u92B7\u5206\u985E\u8AA4\u5C0E\u3002`),
          files: [`multidoc-battery-spec.txt`, `multidoc-charger-quotes.txt`],
          fileLabels: [i18n(`\u96FB\u6C60\u898F\u683C\u6458\u8981`), i18n(`\u4F9B\u61C9\u5546\u5831\u50F9\u7BC0\u9304`)],
          question: r2.question,
          choices: {
            A: r2.choice_A,
            B: r2.choice_B,
            C: r2.choice_C,
            D: r2.choice_D
          },
          answer: r2.answer,
          explanation: r2.explanation
        },
        {
          name: `customer-service-pilot`,
          displayName: i18n(`\u5BA2\u670D GenAI \u8A66\u9EDE\u9650\u5236`),
          description: i18n(`\u628A\u6703\u8B70\u76EE\u6A19\u548C\u8CC7\u5B89\u9650\u5236\u5408\u5728\u4E00\u8D77\u8B80\uFF0C\u627E\u51FA\u7B2C\u4E00\u7248\u771F\u6B63\u8A72\u505A\u7684\u4E8B\u3002`),
          files: [`multidoc-pilot-meeting.txt`, `multidoc-security-policy.txt`],
          fileLabels: [i18n(`\u5C0E\u5165\u6703\u8B70\u7D00\u9304`), i18n(`\u8CC7\u5B89\u8207\u6CD5\u52D9\u9650\u5236\u6E05\u55AE`)],
          question: i.question,
          choices: {
            A: i.choice_A,
            B: i.choice_B,
            C: i.choice_C,
            D: i.choice_D
          },
          answer: i.answer,
          explanation: i.explanation
        }
      ];
    } catch (e) {
      console.error(`Failed to load challenges`, e);
    }
  }
  async loadChallenge(e) {
    if (this.loadingChallenge) return;
    this.loadingChallenge = true;
    this.selectedChallenge = e.name;
    this.currentChallenge = e;
    this.currentAttachments = [];
    this.pipelineStage = `files`;
    this.pipelineExpanded = true;
    this.startPipelineClock();
    try {
      const n = [];
      for (const r3 of e.files) {
        const e2 = await (await fetch(`/data/${r3}`)).blob();
        const i = await _R(e2, r3);
        n.push(i);
      }
      this.currentAttachments = n;
      this.pipelineStage = `extract`;
      await new Promise((e2) => setTimeout(e2, 500));
      this.session.clearMessages();
      const r2 = `${e.question}

A) ${e.choices.A}
B) ${e.choices.B}
C) ${e.choices.C}
D) ${e.choices.D}

${i18n(`\u8ACB\u4ED4\u7D30\u5206\u6790\u9644\u4EF6\u4E2D\u7684\u5169\u4EFD\u6587\u4EF6\uFF0C\u9078\u51FA\u6700\u4F73\u7B54\u6848\u3002\u8ACB\u5148\u7528 2 \u5230 4 \u9EDE\u5217\u51FA\u5224\u65B7\u4F9D\u64DA\uFF0C\u8AAA\u660E\u4F9D\u64DA\u4F86\u81EA\u54EA\u4EFD\u6587\u4EF6\uFF1B\u6700\u5F8C\u8ACB\u7528\u300C\u7B54\u6848\u662F [LETTER]\u300D\u4F5C\u7D50\u3002`)}`;
      this.pipelineStage = `context`;
      await new Promise((e2) => setTimeout(e2, 500));
      this.agentInterface.setInput(r2, n);
      this.pipelineStage = `ready`;
      this.stopPipelineClock(true);
    } catch (t2) {
      console.error(`Failed to load challenge`, e.name, t2);
      this.stopPipelineClock(false);
    } finally {
      this.loadingChallenge = false;
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopPipelineClock(false);
  }
};
__decorate([r()], m2.prototype, `loadingChallenge`, void 0);
__decorate([r()], m2.prototype, `selectedChallenge`, void 0);
__decorate([r()], m2.prototype, `challenges`, void 0);
__decorate([r()], m2.prototype, `currentChallenge`, void 0);
__decorate([r()], m2.prototype, `currentAttachments`, void 0);
__decorate([r()], m2.prototype, `pipelineStage`, void 0);
__decorate([r()], m2.prototype, `pipelineExpanded`, void 0);
__decorate([r()], m2.prototype, `pipelineStartedAt`, void 0);
__decorate([r()], m2.prototype, `pipelineFinishedAt`, void 0);
__decorate([r()], m2.prototype, `pipelineNow`, void 0);
m2 = __decorate([t(`multi-document-demo`)], m2);
document.body.innerHTML = `<multi-document-demo></multi-document-demo>`;
export {
  m2 as MultiDocumentDemo
};
//# sourceMappingURL=3-5-multi-document.js.map
