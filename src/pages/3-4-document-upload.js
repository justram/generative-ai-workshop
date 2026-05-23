import { __decorate as e, i18n as t, r as n, t$1 as r, x as i } from "../mini-lit/index.js";
import { loadAttachment as a } from "../workshop-runtime/CodeBlock-SUyIenKs.js";
import { AgentInterface as o } from "../workshop-runtime/app-C9nW8ndw.js";
import {
  Badge as s,
  Card as c,
  CardContent as l,
  CardHeader as u,
  CardTitle as d,
} from "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as f } from "../workshop-runtime/DemoBase-7724hyNv.js";
import "../workshop-runtime/proxy-client-DO8A5rUF.js";
import { AgentSession as p } from "../workshop-runtime/agent-session-CtmWvP9t.js";

const h = `CC-OCR-V2`;

let b = class extends f {
  constructor() {
    super();
    this.headerTitle = t(`文件上傳`);
    this.sectionId = `3.4`;
    this.currentAttachment = null;
    this.selectedDocument = null;
    this.extractedText = ``;
    this.loadingAttachment = false;
    this.selectedFile = ``;
    this.referenceAnswer = ``;
    this.pipelineStage = `idle`;
    this.pipelineStartedAt = 0;
    this.pipelineFinishedAt = 0;
    this.pipelineNow = 0;
    this.pipelineTimer = null;
    this.pipelineExpanded = true;
    this.hookedEditor = null;
    this.customAttachmentId = ``;
    this.processingMode = `ocr`;
    this.providerSystemPrompt = t(
      `你是一位文件問答服務中的助理。若服務供應商已把文件前處理成文字、表格或 JSON，請優先根據抽取內容回答；若使用者只上傳原始影像、沒有抽取內容，請明確說明你正在直接讀圖，並提醒欄位、金額、日期與單位仍需人工核對。若內容不足，請說明無法判斷。遇到金額、日期、編號、法規條文或承諾時，請保留原始格式與單位，不要自行補完。`,
    );
    this.files = [
      {
        markdownName: `ccocr-financial-lease-note.md`,
        imageName: `ccocr-financial-lease-note.jpg`,
        displayName: t(`財報租賃附註`),
        kind: t(`財務表格`),
        source: `parsing/general_documents_parsing/doc_parsing_doc_doc_photo_150/02eaef2be0a5`,
        dimensions: `1096 × 1440`,
        gpt5HighTokens: 630,
        gpt4oHighTokens: 765,
        datasetTask: t(`影像轉寫為可讀文字`),
        prompt: t(
          `二零二二年使用權資產總額是多少？租賃負債流動與非流動各是多少？被質押的土地使用權賬面淨值是多少？請保留單位。`,
        ),
        learnerReference: t(
          `二零二二年使用權資產總額是人民幣 532,750 千元。租賃負債流動為人民幣 5,629 千元，非流動為人民幣 8,936 千元。被質押的土地使用權賬面淨值是人民幣 106,237,000 元。`,
        ),
        teaching: t(
          `教學重點：文件抽取後仍要小心單位。表格是「人民幣千元」，敘述段落是「人民幣元」，少看單位就會差一千倍。`,
        ),
      },
      {
        markdownName: `ccocr-administrative-penalty.md`,
        imageName: `ccocr-administrative-penalty.jpg`,
        displayName: t(`行政處分公開表`),
        kind: t(`法律欄位`),
        source: `extraction/public_services/kie_administrative_100/04a2c58230e0`,
        dimensions: `1700 × 2338`,
        gpt5HighTokens: 910,
        gpt4oHighTokens: 1105,
        datasetTask: t(`影像欄位抽取為 JSON`),
        prompt: t(
          `這個案件的違法單位是誰？兩項違法事實、處罰內容與決定日期分別是什麼？不要把處罰依據誤當成違法事實。`,
        ),
        learnerReference: t(
          `違法單位是陽維口腔診所。違法事實有兩項：未定期開展消毒與高壓滅菌效果檢測工作；過期藥品未按類別分置於專用包裝物及容器內。處罰內容是警告、罰款人民幣 3000.00 元，並責令立即改正。決定日期是 2019 年 12 月 6 日。`,
        ),
        teaching: t(
          `教學重點：這類公文欄位很長，模型常把「違法事實、法律依據、處罰內容」混成一段看似正確的摘要。要練的是欄位邊界。`,
        ),
      },
      {
        markdownName: `ccocr-tax-receipt.md`,
        imageName: `ccocr-tax-receipt.jpeg`,
        displayName: t(`稅務收據`),
        kind: t(`收據欄位`),
        source: `extraction/regulated_records/kie_tax_compliant_100/00fb624f78cb`,
        dimensions: `436 × 1488`,
        gpt5HighTokens: 1750,
        gpt4oHighTokens: 2125,
        datasetTask: t(`影像欄位抽取為 JSON`),
        prompt: t(
          `請列出這張收據的日期、收據號碼、賣方名稱、GST ID、總額與稅額。金額請照文件內容，不要自行補幣別。`,
        ),
        learnerReference: t(
          `日期：26/02/2018。收據號碼：BWMC02000047293。賣方名稱：Eco - Shop Marketing Sdn Bhd。GST ID：000313901056。總額：16.31。稅額：0.91。`,
        ),
        teaching: t(
          `教學重點：收據資料看起來短，但錯一個字元就可能對帳失敗。這題適合說明「摘要正確」和「欄位精準」是兩種不同能力。`,
        ),
      },
      {
        markdownName: `ccocr-sales-ledger-table.md`,
        imageName: `ccocr-sales-ledger-table.jpg`,
        displayName: t(`商品銷售明細表`),
        kind: t(`大型表格`),
        source: `parsing/complex_table_parsing/doc_parsing_table_table_photo_150/04456dfd256a`,
        dimensions: `1425 × 1900`,
        gpt5HighTokens: 630,
        gpt4oHighTokens: 765,
        datasetTask: t(`表格影像轉寫為 HTML`),
        prompt: t(
          `這份商品銷售明細的統計期間是什麼？前三筆「千禾」商品的國際條碼、品名、數量小計與金額小計分別是多少？請逐列回答。`,
        ),
        learnerReference: t(
          `統計期間是 2022-04-01 到 2022-04-30。前三筆千禾商品：1. 6928312913136，千禾特鮮生抽500ml，數量 20.00，金額 138.00。2. 6928312964664，千禾特香老抽500ml，數量 21.00，金額 144.54。3. 6928312988882，千禾黃豆醬油680m1，數量 21.00，金額 136.01。`,
        ),
        teaching: t(
          `教學重點：大型表格不是只要「看懂內容」，還要維持欄位對齊。模型若跳列、漏列或把相鄰欄位合併，答案會很像真的但其實不能用。`,
        ),
      },
    ];
    this.session = new p();
    this.session.setSystemPrompt(this.getProviderSystemPrompt());
    this.agentInterface = new o();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.unsubscribe = this.session.subscribe((e) => {
      if (e.type !== `state-update`) return;
      const n = [...e.state.messages].reverse().find((e) => e.role === `user`);
      if (n?.attachments && n.attachments.length > 0) {
        const e = n.attachments[0];
        this.currentAttachment = e;
        this.extractedText = e.extractedText || ``;
        if (!this.files.find((t) => t.imageName === e.fileName)) {
          this.selectedFile = ``;
          if (
            !(this.selectedDocument?.isCustom && this.selectedDocument.displayName === e.fileName)
          )
            this.prepareCustomAttachmentPipeline(e);
          this.referenceAnswer = ``;
        }
      }
    });
  }

  isOcrMode() {
    return this.processingMode === `ocr`;
  }

  hasExtractedLayer() {
    return this.isOcrMode() && !!this.extractedText;
  }

  getProviderSystemPrompt() {
    return this.isOcrMode()
      ? t(
          `你是一位文件問答服務中的助理。服務供應商會先把文件前處理成文字、表格或 JSON。請優先根據抽取內容回答，並提醒欄位、金額、日期與單位仍需人工核對。若內容不足，請說明無法判斷。遇到金額、日期、編號、法規條文或承諾時，請保留原始格式與單位，不要自行補完。`,
        )
      : t(
          `你是一位文件問答服務中的助理。這次服務不提供 OCR/Markdown 中間表示，模型會直接看原始影像或附件。回答時請明確說明你正在直接讀圖；若小字、欄位、金額、日期或單位看不清楚，請說不確定並建議人工核對，不要自行補完。`,
        );
  }

  async setProcessingMode(e) {
    if (this.processingMode === e || this.loadingAttachment) return;
    this.processingMode = e;
    this.providerSystemPrompt = this.getProviderSystemPrompt();
    this.session.setSystemPrompt(this.providerSystemPrompt);
    if (this.selectedDocument?.isCustom && this.currentAttachment) {
      await this.prepareCustomAttachmentPipeline(this.currentAttachment);
      return;
    }
    const n = this.files.find((e) => e.markdownName === this.selectedFile);
    if (n) await this.loadFile(n);
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
    if (this.loadingAttachment) return;
    const n =
      [...(e || [])].reverse().find((e) => !this.files.find((t) => t.imageName === e.fileName)) ||
      e?.[0];
    if (!n) {
      if (this.selectedDocument?.isCustom) this.resetCustomUploadPipeline();
      return;
    }
    if (this.currentAttachment?.id === n.id || this.customAttachmentId === n.id) return;
    if (this.files.find((e) => e.imageName === n.fileName)) return;
    if (this.hookedEditor && this.hookedEditor.attachments?.length > 1) {
      this.hookedEditor.attachments = [n];
      this.hookedEditor.requestUpdate?.();
    }
    this.prepareCustomAttachmentPipeline(n);
  }

  resetCustomUploadPipeline() {
    this.currentAttachment = null;
    this.selectedDocument = null;
    this.extractedText = ``;
    this.selectedFile = ``;
    this.referenceAnswer = ``;
    this.customAttachmentId = ``;
    this.pipelineStage = `idle`;
    this.pipelineStartedAt = 0;
    this.pipelineFinishedAt = 0;
    this.pipelineNow = 0;
    this.stopPipelineClock(false);
  }

  async prepareCustomAttachmentPipeline(e) {
    this.customAttachmentId = e.id;
    this.providerSystemPrompt = this.getProviderSystemPrompt();
    this.session.setSystemPrompt(this.providerSystemPrompt);
    this.currentAttachment = e;
    this.selectedFile = ``;
    this.referenceAnswer = ``;
    this.extractedText = e.extractedText || ``;
    this.selectedDocument = {
      isCustom: true,
      markdownName:
        this.isOcrMode() && e.extractedText ? t(`使用者上傳附件的抽取文字`) : t(`沒有中間文字`),
      imageName: e.fileName,
      displayName: e.fileName,
      kind: e.type === `image` ? t(`使用者影像`) : t(`使用者附件`),
      source: t(`使用者本機上傳`),
      dimensions: t(`讀取中`),
      gpt5HighTokens: undefined,
      gpt4oHighTokens: undefined,
      datasetTask:
        this.isOcrMode() && e.extractedText
          ? t(`附件處理器抽取文字`)
          : e.type === `image`
            ? t(`原生視覺輸入，沒有抽取文字`)
            : t(`附件讀取`),
      prompt: ``,
      learnerReference: ``,
      teaching: ``,
    };
    if (!this.isOcrMode()) this.extractedText = ``;
    this.pipelineStage = `image`;
    this.pipelineExpanded = true;
    this.startPipelineClock();
    await new Promise((e) => setTimeout(e, 350));
    if (e.type === `image`) {
      const n = await this.measureImageAttachment(e).catch(() => null);
      if (n && this.currentAttachment?.id === e.id) {
        const r = this.estimateHighDetailTokens(n.width, n.height);
        this.selectedDocument = {
          ...this.selectedDocument,
          dimensions: `${n.width} × ${n.height}`,
          gpt5HighTokens: r.gpt5,
          gpt4oHighTokens: r.gpt4o,
        };
      }
    }
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `extract`;
    await new Promise((e) => setTimeout(e, 550));
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `context`;
    await new Promise((e) => setTimeout(e, 500));
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `ready`;
    this.stopPipelineClock(true);
  }

  attachmentDataUrl(e = this.currentAttachment) {
    if (!e) return ``;
    return `data:${e.mimeType};base64,${e.content}`;
  }

  measureImageAttachment(e) {
    return new Promise((n, r) => {
      const i = new Image();
      i.onload = () => n({ width: i.naturalWidth, height: i.naturalHeight });
      i.onerror = r;
      i.src = this.attachmentDataUrl(e);
    });
  }

  estimateHighDetailTokens(e, n) {
    let r = e;
    let i = n;
    const a = Math.min(2048 / r, 2048 / i, 1);
    r *= a;
    i *= a;
    const o = 768 / Math.min(r, i);
    r *= o;
    i *= o;
    const s = Math.ceil(r / 512) * Math.ceil(i / 512);
    return { gpt5: 70 + s * 140, gpt4o: 85 + s * 170 };
  }

  renderContentPanel() {
    return i`
			<div class="w-full h-full flex flex-col bg-background">
				${
          this.selectedDocument || this.pipelineStage !== `idle`
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
					${t(`這一頁使用 CC-OCR-V2 的真實文件影像，並讓你切換兩種產品做法：先 OCR/版面解析成中間表示，或直接把原圖交給視覺模型。請比較成本、可除錯性與回答可靠度。`)}
				</p>
				${this.renderModeToggle()}
				${c(i`
					${u(d(t(`資料集文件`)))}
					${l(i`<div class="flex flex-col gap-2">${this.files.map((e) => this.renderFileButton(e))}</div>`)}
				`)}
				${this.renderProviderWindow()}
				${this.renderVisionTradeoffWindow()}
				${
          this.selectedDocument
            ? c(i`
							${u(d(t(`來源影像`)))}
							${l(i`
								${
                  this.selectedDocument.isCustom && this.currentAttachment?.type !== `image`
                    ? i`<div class="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">${t(`這份自訂附件不是影像預覽；請看下方聊天附件。`)}</div>`
                    : i`<img
											src="${this.selectedDocument.isCustom ? this.attachmentDataUrl() : `/data/doc-upload/${this.selectedDocument.imageName}`}"
											alt="${this.selectedDocument.displayName}"
											class="w-full max-h-72 object-contain rounded-md border border-border bg-white p-2"
										/>`
                }
								<div class="mt-2 text-[11px] text-muted-foreground break-all">${this.selectedDocument.isCustom ? t(`來源`) : h}: ${this.selectedDocument.source}</div>
							`)}
						`)
            : ``
        }
				${
          this.referenceAnswer
            ? c(i`
							${u(d(t(`答案檢查`)))}
							${l(i`<div class="rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap">${this.referenceAnswer}</div>`)}
						`)
            : ``
        }
			</div>
		`;
  }

  renderModeToggle() {
    const e = this.isOcrMode();
    return c(i`
			${u(d(t(`處理方式`)))}
			${l(i`
				<div class="grid grid-cols-2 gap-2">
					<button
						class="rounded-md border px-3 py-2 text-left transition-colors ${e ? `border-primary bg-primary/15 text-foreground` : `border-border bg-muted/20 text-muted-foreground hover:bg-accent/30`}"
						?disabled=${this.loadingAttachment}
						@click=${() => this.setProcessingMode(`ocr`)}
					>
						<div class="text-sm font-bold">${t(`OCR／前處理`)}</div>
						<div class="mt-1 text-[11px] leading-4">${t(`先抽文字表格，再讓模型回答。可檢查、可重用。`)}</div>
					</button>
					<button
						class="rounded-md border px-3 py-2 text-left transition-colors ${!e ? `border-primary bg-primary/15 text-foreground` : `border-border bg-muted/20 text-muted-foreground hover:bg-accent/30`}"
						?disabled=${this.loadingAttachment}
						@click=${() => this.setProcessingMode(`native`)}
					>
						<div class="text-sm font-bold">${t(`原生視覺`)}</div>
						<div class="mt-1 text-[11px] leading-4">${t(`直接把原圖交給模型。上手快，但較難 debug。`)}</div>
					</button>
				</div>
				<div class="mt-2 rounded-md border border-border bg-muted/30 p-2 text-[11px] leading-5 text-muted-foreground">
					${
            e
              ? t(`目前聊天框會收到影像附件與抽取出的中間表示。學生可以展開流程查看 OCR/表格內容。`)
              : t(
                  `目前聊天框只會收到原始影像附件。流程會保留「沒有中間表示」這件事，避免把讀圖結果偽裝成 OCR。`,
                )
          }
				</div>
			`)}
		`);
  }

  renderProviderWindow() {
    return c(i`
			${u(d(t(`服務供應商背後做的事`)))}
			${l(i`
				<div class="space-y-3 text-xs leading-relaxed">
					<div class="rounded-md border border-border bg-muted/30 p-3">
						<div class="font-semibold text-foreground">${t(`使用者看見`)}</div>
						<div class="mt-1 text-muted-foreground">${t(`上傳文件後，直接問：「這份文件的重點是什麼？」或「這個金額是多少？」`)}</div>
					</div>
					<div class="rounded-md border border-border bg-muted/30 p-3">
						<div class="font-semibold text-foreground">${this.isOcrMode() ? t(`服務背後：OCR／前處理路徑`) : t(`服務背後：原生視覺路徑`)}</div>
						<ol class="mt-1 list-decimal pl-4 text-muted-foreground space-y-1">
							${
                this.isOcrMode()
                  ? i`
										<li>${t(`先用 OCR、版面分析或表格解析，把文件轉成文字、表格、JSON 或 HTML。`)}</li>
										<li>${t(`把中間表示放進上下文，讓模型根據可檢查的內容回答。`)}</li>
										<li>${t(`用隱藏系統提示限制模型：根據抽取內容回答，格式與單位不能亂補。`)}</li>
									`
                  : i`
										<li>${t(`跳過 OCR/Markdown 中間層，直接把原始影像交給視覺模型。`)}</li>
										<li>${t(`模型自己讀圖、找欄位、辨識文字；沒有可 diff 或打 patch 的中間結果。`)}</li>
										<li>${t(`用隱藏系統提示要求模型標明不確定處，避免把看不清楚的內容講得太肯定。`)}</li>
									`
              }
						</ol>
					</div>
					<div>
						<div class="font-semibold text-foreground mb-1">${t(`隱藏系統提示`)}</div>
						<pre class="max-h-40 overflow-y-auto rounded-md border border-border bg-muted/50 p-3 whitespace-pre-wrap font-mono text-[11px] text-muted-foreground">${this.providerSystemPrompt}</pre>
					</div>
				</div>
			`)}
		`);
  }

  getPipelineOrder() {
    return [`image`, `extract`, `context`, `ready`];
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
    if (n < 60) return `${n.toFixed(1)}s`;
    const r = Math.floor(n / 60);
    const i = Math.round(n % 60);
    return `${r}m ${i}s`;
  }

  renderProgressMarker(e, n, r) {
    if (n)
      return i`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    if (e) {
      return i`
				<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15">
					<div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div>
				</div>
			`;
    }
    return i`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${r}</div>`;
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

  renderStepOutcome(e, n) {
    if (!e) return ``;
    return i`
			<details class="mt-2 rounded-md border border-border bg-background/75">
				<summary class="cursor-pointer select-none px-3 py-2 text-[11px] font-semibold text-muted-foreground hover:text-foreground">
					${e}
				</summary>
				<div class="border-t border-border p-3">${n}</div>
			</details>
		`;
  }

  renderExtractedContentOutcome() {
    if (!this.hasExtractedLayer()) {
      return i`
				<div class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
					<div class="font-semibold text-foreground">${t(`這次沒有抽取文字`)}</div>
					<div class="mt-1 text-muted-foreground">
						${
              this.isOcrMode()
                ? t(
                    `這份自訂附件沒有可用的本機 OCR/Markdown 中間表示。系統不會假裝抽取成功；若要完整觀察 OCR 流程，請選左側資料集範例。`,
                  )
                : t(
                    `目前是原生視覺路徑：模型直接讀圖。這很方便，但沒有 Markdown/表格中間結果可以 debug。`,
                  )
            }
					</div>
				</div>
			`;
    }
    return i`
			<div>
				<div class="text-xs text-muted-foreground">${t(`已產生可檢查的中間表示。這不是使用者原本上傳的檔案，而是服務放進模型上下文的內容。`)}</div>
				${this.renderStepOutcome(
          t(`查看系統抽出的內容`),
          i`<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.extractedText}</pre>`,
        )}
			</div>
		`;
  }

  renderContextOutcome() {
    return i`
			<div>
				<div>
					${
            this.hasExtractedLayer()
              ? t(`已把抽取內容與隱藏系統提示放入模型上下文。`)
              : t(
                  `已把原始影像與隱藏系統提示放入模型上下文；這次沒有可檢查的 OCR/Markdown 中間表示。`,
                )
          }
				</div>
				${this.renderStepOutcome(
          t(`查看送進模型的服務規則`),
          i`<pre class="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.providerSystemPrompt}</pre>`,
        )}
				${this.renderStepOutcome(
          t(`查看實際送給模型的 payload`),
          i`
						<div class="mb-2 rounded-md border border-border bg-muted/30 p-2 text-[11px] leading-5 text-muted-foreground">
							${t(`為了可讀性，這裡省略圖片的 base64 內容；模型實際收到的是同一個 image part。OCR 模式會多一段 document text，原生視覺模式不會。`)}
						</div>
						<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.renderModelPayloadPreview()}</pre>
					`,
        )}
			</div>
		`;
  }

  renderModelPayloadPreview() {
    const e = this.agentInterface?._messageEditor;
    const n = e?.value || this.selectedDocument?.prompt || t(`使用者尚未輸入問題`);
    const r = this.currentAttachment;
    const i = [{ type: `text`, text: n }];
    if (r?.type === `image`) {
      i.push({
        type: `image`,
        mimeType: r.mimeType,
        fileName: r.fileName,
        data: `<base64 image omitted>`,
      });
    }
    if (this.hasExtractedLayer()) {
      i.push({
        type: `text`,
        isDocument: true,
        text: `\\n\\n[Document preprocessed from ${r?.fileName || this.selectedDocument?.imageName}]\\n${this.extractedText}`,
      });
    }
    return JSON.stringify(
      {
        systemPrompt: this.providerSystemPrompt,
        messages: [
          {
            role: `user`,
            content: i,
          },
        ],
      },
      null,
      2,
    );
  }

  renderPipelineCard() {
    if (!this.selectedDocument && this.pipelineStage === `idle`) return ``;
    const e = this.getCompletedPipelineCount();
    const n = this.getPipelineOrder().length;
    const r = Math.round((e / n) * 100);
    const a = Math.max(
      0,
      (this.pipelineFinishedAt || this.pipelineNow || Date.now()) -
        (this.pipelineStartedAt || Date.now()),
    );
    const o = this.pipelineStage === `ready`;
    const s = this.selectedDocument;
    return i`
			<details class="group rounded-xl border border-border bg-background/70" ?open=${this.pipelineExpanded} @toggle=${(e) => (this.pipelineExpanded = e.currentTarget.open)}>
				<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-3">
							<div class="text-sm font-bold text-foreground">${o ? t(`文件處理流程完成`) : t(`文件處理流程進行中`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${e}/${n} ${t(`完成`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(a)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">${this.isOcrMode() ? t(`OCR／前處理`) : t(`原生視覺`)}</div>
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">
							${
                this.isOcrMode()
                  ? t(
                      `這裡看的是 OCR 路徑：原始檔進來，服務先抽取文字/表格，再組上下文讓模型回答。`,
                    )
                  : t(
                      `這裡看的是原生視覺路徑：原始檔直接進模型上下文，沒有可檢查的 OCR/Markdown 中間表示。`,
                    )
              }
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
						${t(`文件上傳不是魔法。同一張圖可以走兩條路：先變成可檢查的中間表示，或直接交給視覺模型讀。`)}
					</div>
					<div class="grid gap-3">
						${this.renderPipelineStep(
              `image`,
              1,
              t(`收到原始影像`),
              t(`使用者以為只是上傳圖片或 PDF；產品先拿到原始檔與檔名。`),
              s
                ? i`
										<div>${s.imageName} · ${s.dimensions}</div>
										${this.renderStepOutcome(
                      t(`查看原始影像`),
                      s.isCustom && this.currentAttachment?.type !== `image`
                        ? i`<div class="rounded-md border border-border bg-muted/40 p-3">${t(`這份自訂附件不是影像預覽；請看下方聊天附件。`)}</div>`
                        : i`<img src="${s.isCustom ? this.attachmentDataUrl() : `/data/doc-upload/${s.imageName}`}" alt="${s.displayName}" class="max-h-72 w-full rounded-md border border-border bg-white object-contain p-2" />`,
                    )}
									`
                : t(`等待選擇文件。`),
            )}
						${this.renderPipelineStep(
              `extract`,
              2,
              t(`前處理抽成文字/表格`),
              s?.isCustom && !this.extractedText
                ? t(`這份自訂附件沒有 OCR/Markdown 中間表示；系統不會假裝抽取成功。`)
                : this.isOcrMode()
                  ? t(
                      `服務用 OCR、表格解析或版面分析產生中間表示。這一頁使用資料集已標註的抽取結果示範。`,
                    )
                  : t(`這一步被跳過：原生視覺路徑不產生可檢查的 Markdown/表格中間表示。`),
              s
                ? i`
										<div>${this.hasExtractedLayer() ? t(`中間格式`) : t(`目前狀態`)}：${this.hasExtractedLayer() ? s.markdownName : t(`沒有中間表示`)} · ${s.datasetTask}</div>
										${this.renderExtractedContentOutcome()}
									`
                : ``,
            )}
						${this.renderPipelineStep(
              `context`,
              3,
              t(`組成模型上下文`),
              this.hasExtractedLayer()
                ? t(`抽取結果和隱藏系統提示一起進上下文；使用者不需要知道服務把文件改成什麼格式。`)
                : t(
                    `原始影像和隱藏系統提示一起進上下文；這時成本與錯誤來源要用 native vision 的方式理解。`,
                  ),
              this.renderContextOutcome(),
            )}
						${this.renderPipelineStep(
              `ready`,
              4,
              t(`等待模型回答與人工檢查`),
              t(`現在才輪到模型回答。學生要用資料集參考答案檢查欄位、單位與來源。`),
              o
                ? s?.isCustom
                  ? this.hasExtractedLayer()
                    ? t(
                        `下方聊天框保留了你上傳的附件與抽取文字；送出後，請檢查模型是否只根據可用內容回答。`,
                      )
                    : t(
                        `下方聊天框保留了你上傳的附件；送出後，請特別留意模型是否把看不清楚的欄位說得太確定。`,
                      )
                  : this.hasExtractedLayer()
                    ? t(
                        `下方聊天框已放入原始影像、抽取內容與問題；送出後，請對照左側參考答案檢查模型回答。`,
                      )
                    : t(
                        `下方聊天框已放入原始影像與問題，但沒有抽取內容；送出後，請對照左側參考答案檢查模型讀圖是否可靠。`,
                      )
                : t(`等待文件管線完成。`),
              false,
            )}
					</div>
				</div>
			</details>
		`;
  }

  renderVisionTradeoffWindow() {
    const e = this.selectedDocument;
    const n = e?.gpt5HighTokens && e?.gpt4oHighTokens;
    return c(i`
			${u(d(t(`直接用視覺模型讀圖？`)))}
			${l(i`
				<div class="space-y-3 text-xs leading-relaxed">
					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-md border border-border bg-muted/30 p-3">
							<div class="font-semibold text-foreground">${t(`原圖進模型`)}</div>
							<ul class="mt-1 list-disc pl-4 text-muted-foreground space-y-1">
								<li>${t(`最快開始，少一個 OCR/解析管線。`)}</li>
								<li>${t(`每次問問題都可能重新把圖片塞進上下文。`)}</li>
								<li>${t(`讀錯或幻覺時，很難知道是圖片、提示，還是模型視覺判讀出錯。`)}</li>
							</ul>
						</div>
						<div class="rounded-md border border-border bg-muted/30 p-3">
							<div class="font-semibold text-foreground">${t(`先抽成文字/表格`)}</div>
							<ul class="mt-1 list-disc pl-4 text-muted-foreground space-y-1">
								<li>${t(`抽取結果可以被檢查、diff、打 patch。`)}</li>
								<li>${t(`同一份文件反覆問答時，不必每輪都重讀整張圖。`)}</li>
								<li>${t(`可以切章節、切表格、加系統規則，降低全圖亂猜。`)}</li>
							</ul>
						</div>
					</div>
					<div class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
						<div class="font-semibold text-foreground">${t(`大概會吃多少上下文？`)}</div>
						<div class="mt-1 text-muted-foreground">
							${
                e
                  ? n
                    ? t(
                        `${e.displayName} 原圖 ${e.dimensions}。依 OpenAI API 影像 token 公式估算，GPT-5 high detail 約 70 + 每個 512px tile 140 tokens，這張約 ${e.gpt5HighTokens.toLocaleString(`en-US`)} tokens；GPT-4o high detail 約 85 + 每 tile 170 tokens，這張約 ${e.gpt4oHighTokens.toLocaleString(`en-US`)} tokens。low detail 是固定低解析預覽，便宜但不適合讀小字與表格。`,
                      )
                    : t(
                        `${e.displayName} 原圖尺寸仍在讀取中。若是影像，這裡會估算 high detail image tokens；若不是影像，成本主要取決於抽出的文字長度。`,
                      )
                  : t(
                      `選一份文件後，這裡會用該影像尺寸估算 high detail 的 image tokens。OpenAI API 文件列出 GPT-5 high detail 約 70 + 每個 512px tile 140 tokens；GPT-4o 約 85 + 每 tile 170 tokens。`,
                    )
              }
						</div>
						<a class="mt-2 inline-block text-[11px] text-blue-500 underline" href="https://platform.openai.com/docs/guides/images-vision" target="_blank">${t(`OpenAI Images and vision 文件`)}</a>
					</div>
					<div class="rounded-md border border-border bg-muted/30 p-3 text-muted-foreground">
						${t(`課堂判斷：一次性看圖、問大意，可以直接用視覺模型；要反覆查詢、精準欄位、成本可控、錯誤可 debug，就應該先付一次前處理代價，把文件做成可檢查的中間表示。`)}
					</div>
				</div>
			`)}
		`);
  }

  renderRightDemoPanel() {
    return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }

  renderFileButton(e) {
    const n = this.selectedFile === e.markdownName;
    return i`
			<button
				class="w-full text-left p-3 rounded-md border transition-colors ${n ? `bg-accent/40 border-accent` : `bg-card border-border hover:bg-accent/30`}"
				?disabled=${this.loadingAttachment}
				@click=${() => this.loadFile(e)}
			>
				<div class="flex items-start gap-3">
					<div class="mt-0.5">${this.getFileGlyph()}</div>
					<div class="flex-1 min-w-0">
							<div class="flex items-center gap-2">
								<div class="text-sm font-medium">${e.displayName}</div>
								${s(e.kind, `secondary`)}
							</div>
							<div class="text-xs text-muted-foreground mt-0.5">${e.imageName}</div>
						</div>
					${n ? s(t(`已選取`), `secondary`) : i``}
				</div>
			</button>
		`;
  }

  async loadFile(e) {
    if (this.loadingAttachment) return;
    this.session.clearMessages();
    this.loadingAttachment = true;
    this.selectedFile = e.markdownName;
    this.selectedDocument = e;
    this.providerSystemPrompt = this.getProviderSystemPrompt();
    this.session.setSystemPrompt(this.providerSystemPrompt);
    this.pipelineStage = `image`;
    this.pipelineExpanded = true;
    this.startPipelineClock();
    this.currentAttachment = null;
    this.extractedText = ``;
    this.referenceAnswer = ``;
    try {
      await new Promise((e) => setTimeout(e, 450));
      this.pipelineStage = `extract`;
      const n = await fetch(`./data/doc-upload/${e.markdownName}`);
      const r = await n.text();
      await new Promise((e) => setTimeout(e, 650));
      const o = await fetch(`./data/doc-upload/${e.imageName}`);
      const s = await o.blob();
      this.referenceAnswer = `${t(`資料來源`)}：${h} / ${e.source}
${t(`資料集標註任務`)}：${e.datasetTask}
${t(`目前路徑`)}：${this.isOcrMode() ? t(`OCR／前處理，會把資料集標註內容放進模型上下文`) : t(`原生視覺，只把原始影像放進模型上下文`)}

${t(`本教學題答案`)}：
${e.learnerReference}

${e.teaching}`;
      const c = await a(s, e.imageName);
      if (this.isOcrMode()) {
        c.extractedText = r;
        c.preprocessedFileName = e.markdownName;
      }
      this.currentAttachment = c;
      this.extractedText = this.isOcrMode() ? r : ``;
      this.pipelineStage = `context`;
      await new Promise((e) => setTimeout(e, 650));
      this.agentInterface.setInput(e.prompt, [c]);
      this.pipelineStage = `ready`;
      this.stopPipelineClock(true);
    } catch (n) {
      console.error(`Failed to load`, e.markdownName, n);
      this.extractedText = `${t(`無法載入`)} ${e.markdownName}`;
      this.stopPipelineClock(false);
    } finally {
      this.loadingAttachment = false;
    }
  }

  getFileGlyph() {
    const e = `w-5 h-5`;
    return i`<svg class="${e} text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M4 5a2 2 0 012-2h9l5 5v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5z" />
			<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M14 3v5h5M8 13h8M8 17h6" />
		</svg>`;
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.stopPipelineClock(false);
    this.unsubscribe?.();
  }
};

e([n()], b.prototype, `currentAttachment`, void 0);
e([n()], b.prototype, `selectedDocument`, void 0);
e([n()], b.prototype, `extractedText`, void 0);
e([n()], b.prototype, `loadingAttachment`, void 0);
e([n()], b.prototype, `selectedFile`, void 0);
e([n()], b.prototype, `referenceAnswer`, void 0);
e([n()], b.prototype, `processingMode`, void 0);
e([n()], b.prototype, `providerSystemPrompt`, void 0);
e([n()], b.prototype, `pipelineStage`, void 0);
e([n()], b.prototype, `pipelineStartedAt`, void 0);
e([n()], b.prototype, `pipelineFinishedAt`, void 0);
e([n()], b.prototype, `pipelineNow`, void 0);
e([n()], b.prototype, `pipelineExpanded`, void 0);
b = e([r(`document-upload-demo`)], b);
document.body.innerHTML = `<document-upload-demo></document-upload-demo>`;
export { b as DocumentUploadDemo };
