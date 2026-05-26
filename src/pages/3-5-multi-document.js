import { __decorate as e, i18n as t, r as n, t$1 as r, x as i } from "../mini-lit/index.js";
import { loadAttachment as a } from "../workshop-runtime/CodeBlock.js";
import { AgentInterface as o } from "../workshop-runtime/AgentRuntime.js";
import {
  Badge as s,
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

let m = class extends f {
  constructor() {
    super();
    this.headerTitle = t(`當你上傳多份文件時`);
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
    this.session = new p();
    this.session.setSystemPrompt(
      t(
        `你是一位協助分析多份文件的助理。請只根據提供的文件回答；如果答案需要跨文件比對，請明確指出依據來自哪份文件。`,
      ),
    );
    this.agentInterface = new o();
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
    e.onFilesChange = (r) => {
      n?.(r);
      this.handleEditorAttachmentsChange(r);
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
    const r = n.map((e) => e.id).join(`|`);
    if (r === this.currentAttachments.map((e) => e.id).join(`|`)) return;
    this.selectedChallenge = `custom-upload`;
    this.currentChallenge = {
      name: `custom-upload`,
      displayName: t(`自訂多文件上傳`),
      description: t(`你上傳的文件；請在聊天框輸入需要跨文件比對的問題。`),
      question:
        this.agentInterface?._messageEditor?.value || t(`請輸入一個需要同時讀多份文件的問題。`),
      choices: {},
      answer: ``,
      explanation: t(
        `自訂上傳沒有預設參考答案。教學重點是檢查 payload 裡是否真的包含多份文件，以及模型回答是否明確標示來源。`,
      ),
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
    return i`
			<div class="w-full h-full flex flex-col bg-background">
				${
          this.currentAttachments.length || this.pipelineStage !== `idle`
            ? i`<div class="border-b border-border bg-card/70 px-4 py-3">${this.renderPipelineCard()}</div>`
            : i``
        }
				<div class="flex-1 min-h-0 p-4 pb-4">${this.agentInterface}</div>
			</div>
		`;
  }

  renderLeftDemoPanel() {
    return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${t(`選一個情境，載入兩份文件，觀察模型能不能跨文件核對條件、排除錯誤選項，並用來源支持答案。`)}
				</p>
				${c(i`
					${u(d(t(`多文件挑戰`)))}
					${l(i`<div class="flex flex-col gap-2">${this.challenges.map((e) => this.renderChallengeButton(e))}</div>`)}
				`)}
				${c(i`${u(d(t(`參考答案與教學重點`)))} ${l(i`${this.renderCorrectAnswer()}`)}`)}
			</div>
		`;
  }

  renderRightDemoPanel() {
    return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }

  renderChallengeButton(e) {
    const n = this.selectedChallenge === e.name;
    return i`
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
							${e.files.length} ${t(`份文件`)}: ${e.fileLabels.join(`, `)}
						</div>
					</div>
					${n ? s(t(`已選取`), `secondary`) : i``}
				</div>
			</button>
		`;
  }

  renderCorrectAnswer() {
    if (!this.selectedChallenge) {
      return i`<div class="text-sm text-muted-foreground">${t(`選取一個挑戰後，這裡會顯示參考答案與判斷依據。`)}</div>`;
    }
    if (this.selectedChallenge === `custom-upload`) {
      return i`
				<div class="rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed">
					<div class="font-semibold text-foreground">${t(`自訂上傳沒有標準答案`)}</div>
					<div class="mt-1 text-muted-foreground">${t(`請要求模型逐一引用檔名或段落。這一頁要看的不是模型有沒有猜中選項，而是它是否真的同時使用多份文件、是否把來源說清楚。`)}</div>
				</div>
			`;
    }
    const e = this.challenges.find((e) => e.name === this.selectedChallenge);
    if (!e) return i``;
    return i`
			<div class="text-sm font-medium mb-2">${e.question}</div>
			<div class="space-y-2 mb-3">
				${Object.entries(e.choices).map(([t, n]) => {
          const r = t === e.answer;
          return i`<div
						class="text-xs p-2 rounded ${r ? `bg-green-100 dark:bg-green-500/10 border border-green-500 text-green-700 dark:text-green-400` : `text-muted-foreground`}"
					>
						<strong>${t})</strong> ${n} ${r ? i`<span class="ml-2 font-medium">✓</span>` : ``}
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
    const n = Math.max(0, e) / 1000;
    return n < 60 ? `${n.toFixed(1)}s` : `${Math.floor(n / 60)}m ${Math.round(n % 60)}s`;
  }

  renderProgressMarker(e, n, r) {
    if (n)
      return i`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    if (e) {
      return i`<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15"><div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div></div>`;
    }
    return i`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${r}</div>`;
  }

  renderStepOutcome(e, n) {
    if (!e) return ``;
    return i`
			<details class="mt-2 rounded-md border border-border bg-background/75">
				<summary class="cursor-pointer select-none px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground">${e}</summary>
				<div class="border-t border-border p-3">${n}</div>
			</details>
		`;
  }

  renderPipelineStep(e, n, r, a, o, s = true) {
    const c = this.getPipelineOrder();
    const l = c.indexOf(this.pipelineStage);
    const u = c.indexOf(e);
    const d = this.pipelineStage === e && this.pipelineStage !== `ready`;
    const f = l > u || this.pipelineStage === `ready`;
    const p = d
      ? `border-amber-400/70 bg-amber-400/10`
      : f
        ? `border-emerald-500/40 bg-emerald-500/10`
        : `border-border bg-muted/15`;
    return i`
			<div class="rounded-lg border ${p} p-3">
				<div class="flex gap-3">
					<div class="relative shrink-0">
						${s ? i`<div class="absolute left-1/2 top-7 h-[calc(100%+0.75rem)] w-px -translate-x-1/2 bg-border"></div>` : ``}
						${this.renderProgressMarker(d, f, n)}
					</div>
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-2">
							<div class="text-sm font-bold text-foreground">${r}</div>
							${d ? i`<span class="rounded-full bg-amber-500/15 px-2 py-0.5 text-[11px] font-semibold text-amber-300">${t(`進行中`)}</span>` : ``}
							${f ? i`<span class="rounded-full bg-emerald-500/15 px-2 py-0.5 text-[11px] font-semibold text-emerald-300">${t(`完成`)}</span>` : ``}
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">${a}</div>
						${o ? i`<div class="mt-2 text-xs leading-5 text-muted-foreground">${o}</div>` : ``}
					</div>
				</div>
			</div>
		`;
  }

  renderPipelineCard() {
    if (!this.currentAttachments.length && this.pipelineStage === `idle`) return ``;
    const e = this.getCompletedPipelineCount();
    const n = this.getPipelineOrder().length;
    const r = Math.round((e / n) * 100);
    const a = Math.max(
      0,
      (this.pipelineFinishedAt || this.pipelineNow || Date.now()) -
        (this.pipelineStartedAt || Date.now()),
    );
    const o = this.pipelineStage === `ready`;
    const f = this.currentChallenge;
    return i`
			<details class="group rounded-xl border border-border bg-background/70" ?open=${this.pipelineExpanded} @toggle=${(e) => (this.pipelineExpanded = e.currentTarget.open)}>
				<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-3">
							<div class="text-sm font-bold text-foreground">${o ? t(`多文件上下文已準備好`) : t(`多文件處理中`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${e}/${n} ${t(`完成`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(a)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">${this.currentAttachments.length} ${t(`份文件`)}</div>
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">
							${t(`多文件任務的重點不是把文字全部丟進去，而是知道每份文件提供哪個證據、哪個文件排除了錯誤答案。`)}
						</div>
						<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
							<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${r}%`}></div>
						</div>
					</div>
					<span class="shrink-0 rounded-full border border-border px-2 py-1 text-[11px] font-semibold text-muted-foreground">${this.pipelineExpanded ? t(`收合`) : t(`展開`)}</span>
				</summary>
				<div class="overflow-y-auto border-t border-border p-4 overscroll-contain" style="max-height:42vh">
					<div class="mb-3 rounded-lg border border-primary/40 bg-primary/10 p-3 text-xs leading-6 text-muted-foreground">
						<span class="font-bold text-foreground">${t(`新概念：`)}</span>
						${t(`單文件問答常是在找答案；多文件問答是在做交叉檢查。模型必須同時保留來源、條件與排除理由。`)}
					</div>
					<div class="grid gap-3">
						${this.renderPipelineStep(
              `files`,
              1,
              t(`收到多份附件`),
              t(`每份文件會以獨立附件進入聊天框。順序、檔名與來源都會影響學生之後怎麼檢查回答。`),
              this.renderAttachmentListOutcome(),
            )}
						${this.renderPipelineStep(
              `extract`,
              2,
              t(`各自抽成文字`),
              t(
                `這裡示範文字文件的抽取結果。真實產品若是 PDF、Word 或掃描圖，也會先形成可送進模型的文字片段。`,
              ),
              this.renderExtractedDocumentsOutcome(),
            )}
						${this.renderPipelineStep(
              `context`,
              3,
              t(`組成多文件上下文`),
              t(`模型收到的不只是一包文字，而是使用者問題，加上多個標記了檔名的 document text。`),
              this.renderContextOutcome(),
            )}
						${this.renderPipelineStep(
              `ready`,
              4,
              t(`要求跨文件作答`),
              t(`答案應該說明哪些條件來自哪份文件；如果只引用一份文件或只抓關鍵字，就很容易選錯。`),
              o
                ? f?.answer
                  ? t(`送出後，請對照左側參考答案，看模型是否同時使用兩份文件並排除錯誤選項。`)
                  : t(`送出後，請檢查模型是否逐一標示來源；自訂文件沒有標準答案。`)
                : t(`等待多文件上下文完成。`),
              false,
            )}
					</div>
				</div>
			</details>
		`;
  }

  renderAttachmentListOutcome() {
    if (!this.currentAttachments.length) return t(`等待附件。`);
    return i`
			<div class="grid gap-2">
				${this.currentAttachments.map(
          (e, n) => i`
					<div class="rounded-md border border-border bg-muted/30 p-2 text-xs">
						<div class="font-semibold text-foreground">${t(`文件`)} ${n + 1}: ${e.fileName}</div>
						<div class="mt-1 text-muted-foreground">${e.mimeType || t(`未知格式`)} · ${Math.round((e.size || 0) / 1024)} KB</div>
					</div>
				`,
        )}
			</div>
		`;
  }

  renderExtractedDocumentsOutcome() {
    if (!this.currentAttachments.length) return ``;
    return i`
			<div class="grid gap-2">
				${this.currentAttachments.map((e, n) =>
          this.renderStepOutcome(
            `${t(`查看文件`)} ${n + 1}: ${e.fileName}`,
            i`<pre class="max-h-52 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${e.extractedText || t(`這份附件沒有抽取文字。`)}</pre>`,
          ),
        )}
			</div>
		`;
  }

  renderContextOutcome() {
    return i`
			<div>
				<div>${t(`已把多份文件分別標記檔名後放進模型上下文。你可以檢查模型是否真的跨文件引用，而不是只抓其中一份。`)}</div>
				${this.renderStepOutcome(
          t(`查看實際送給模型的 payload`),
          i`<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.renderModelPayloadPreview()}</pre>`,
        )}
				${
          this.currentChallenge?.answer
            ? this.renderStepOutcome(
                t(`查看這題需要的跨文件判斷`),
                i`<div class="space-y-2 text-xs leading-5 text-muted-foreground">
								<div><span class="font-semibold text-foreground">${t(`問題`)}</span>：${this.currentChallenge.question}</div>
								<div><span class="font-semibold text-foreground">${t(`正確答案`)}</span>：${this.currentChallenge.answer}</div>
								<div class="rounded-md border border-border bg-muted/30 p-3 whitespace-pre-wrap">${this.currentChallenge.explanation}</div>
							</div>`,
              )
            : ``
        }
			</div>
		`;
  }

  renderModelPayloadPreview() {
    const e = this.agentInterface?._messageEditor;
    const n = e?.value || this.currentChallenge?.question || t(`使用者尚未輸入問題`);
    const r = [{ type: `text`, text: n }];
    for (const e of this.currentAttachments) {
      if (e.extractedText) {
        r.push({
          type: `text`,
          isDocument: true,
          fileName: e.fileName,
          text: `\\n\\n[Document preprocessed from ${e.fileName}]\\n${e.extractedText}`,
        });
      } else {
        r.push({
          type: e.type || `document`,
          fileName: e.fileName,
          mimeType: e.mimeType,
          data: `<raw attachment omitted>`,
        });
      }
    }
    return JSON.stringify(
      {
        systemPrompt: this.session.state.systemPrompt,
        messages: [{ role: `user`, content: r }],
      },
      null,
      2,
    );
  }

  async loadChallenges() {
    try {
      const [e, n] = await Promise.all([
        fetch(`/data/multidoc-1-question.json`),
        fetch(`/data/multidoc-2-question.json`),
      ]);
      const r = await e.json();
      const i = await n.json();
      this.challenges = [
        {
          name: `battery-charger`,
          displayName: t(`電池規格與充電器報價`),
          description: t(`跨文件核對規格，避免被「48V」這種行銷分類誤導。`),
          files: [`multidoc-battery-spec.txt`, `multidoc-charger-quotes.txt`],
          fileLabels: [t(`電池規格摘要`), t(`供應商報價節錄`)],
          question: r.question,
          choices: {
            A: r.choice_A,
            B: r.choice_B,
            C: r.choice_C,
            D: r.choice_D,
          },
          answer: r.answer,
          explanation: r.explanation,
        },
        {
          name: `customer-service-pilot`,
          displayName: t(`客服 GenAI 試點限制`),
          description: t(`把會議目標和資安限制合在一起讀，找出第一版真正該做的事。`),
          files: [`multidoc-pilot-meeting.txt`, `multidoc-security-policy.txt`],
          fileLabels: [t(`導入會議紀錄`), t(`資安與法務限制清單`)],
          question: i.question,
          choices: {
            A: i.choice_A,
            B: i.choice_B,
            C: i.choice_C,
            D: i.choice_D,
          },
          answer: i.answer,
          explanation: i.explanation,
        },
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
      for (const r of e.files) {
        const e = await (await fetch(`/data/${r}`)).blob();
        const i = await a(e, r);
        n.push(i);
      }
      this.currentAttachments = n;
      this.pipelineStage = `extract`;
      await new Promise((e) => setTimeout(e, 500));
      this.session.clearMessages();
      const r = `${e.question}

A) ${e.choices.A}
B) ${e.choices.B}
C) ${e.choices.C}
D) ${e.choices.D}

${t(`請仔細分析附件中的兩份文件，選出最佳答案。請先用 2 到 4 點列出判斷依據，說明依據來自哪份文件；最後請用「答案是 [LETTER]」作結。`)}`;
      this.pipelineStage = `context`;
      await new Promise((e) => setTimeout(e, 500));
      this.agentInterface.setInput(r, n);
      this.pipelineStage = `ready`;
      this.stopPipelineClock(true);
    } catch (t) {
      console.error(`Failed to load challenge`, e.name, t);
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

e([n()], m.prototype, `loadingChallenge`, void 0);
e([n()], m.prototype, `selectedChallenge`, void 0);
e([n()], m.prototype, `challenges`, void 0);
e([n()], m.prototype, `currentChallenge`, void 0);
e([n()], m.prototype, `currentAttachments`, void 0);
e([n()], m.prototype, `pipelineStage`, void 0);
e([n()], m.prototype, `pipelineExpanded`, void 0);
e([n()], m.prototype, `pipelineStartedAt`, void 0);
e([n()], m.prototype, `pipelineFinishedAt`, void 0);
e([n()], m.prototype, `pipelineNow`, void 0);
m = e([r(`multi-document-demo`)], m);
document.body.innerHTML = `<multi-document-demo></multi-document-demo>`;
export { m as MultiDocumentDemo };
