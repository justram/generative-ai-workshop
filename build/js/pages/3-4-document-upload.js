import {
  o
} from "../chunks/chunk-BUQY3BQN.js";
import {
  A,
  E,
  O,
  T,
  _R,
  bR,
  m,
  u
} from "../chunks/chunk-FCZIHEE4.js";
import {
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-4L3FZKEY.js";

// src/pages/3-4-document-upload.js
var h = `CC-OCR-V2`;
var b2 = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u6587\u4EF6\u4E0A\u50B3`);
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
    this.providerSystemPrompt = i18n(
      `\u4F60\u662F\u4E00\u4F4D\u6587\u4EF6\u554F\u7B54\u670D\u52D9\u4E2D\u7684\u52A9\u7406\u3002\u82E5\u670D\u52D9\u4F9B\u61C9\u5546\u5DF2\u628A\u6587\u4EF6\u524D\u8655\u7406\u6210\u6587\u5B57\u3001\u8868\u683C\u6216 JSON\uFF0C\u8ACB\u512A\u5148\u6839\u64DA\u62BD\u53D6\u5167\u5BB9\u56DE\u7B54\uFF1B\u82E5\u4F7F\u7528\u8005\u53EA\u4E0A\u50B3\u539F\u59CB\u5F71\u50CF\u3001\u6C92\u6709\u62BD\u53D6\u5167\u5BB9\uFF0C\u8ACB\u660E\u78BA\u8AAA\u660E\u4F60\u6B63\u5728\u76F4\u63A5\u8B80\u5716\uFF0C\u4E26\u63D0\u9192\u6B04\u4F4D\u3001\u91D1\u984D\u3001\u65E5\u671F\u8207\u55AE\u4F4D\u4ECD\u9700\u4EBA\u5DE5\u6838\u5C0D\u3002\u82E5\u5167\u5BB9\u4E0D\u8DB3\uFF0C\u8ACB\u8AAA\u660E\u7121\u6CD5\u5224\u65B7\u3002\u9047\u5230\u91D1\u984D\u3001\u65E5\u671F\u3001\u7DE8\u865F\u3001\u6CD5\u898F\u689D\u6587\u6216\u627F\u8AFE\u6642\uFF0C\u8ACB\u4FDD\u7559\u539F\u59CB\u683C\u5F0F\u8207\u55AE\u4F4D\uFF0C\u4E0D\u8981\u81EA\u884C\u88DC\u5B8C\u3002`
    );
    this.files = [
      {
        markdownName: `ccocr-financial-lease-note.md`,
        imageName: `ccocr-financial-lease-note.jpg`,
        displayName: i18n(`\u8CA1\u5831\u79DF\u8CC3\u9644\u8A3B`),
        kind: i18n(`\u8CA1\u52D9\u8868\u683C`),
        source: `parsing/general_documents_parsing/doc_parsing_doc_doc_photo_150/02eaef2be0a5`,
        dimensions: `1096 \xD7 1440`,
        gpt5HighTokens: 630,
        gpt4oHighTokens: 765,
        datasetTask: i18n(`\u5F71\u50CF\u8F49\u5BEB\u70BA\u53EF\u8B80\u6587\u5B57`),
        prompt: i18n(
          `\u4E8C\u96F6\u4E8C\u4E8C\u5E74\u4F7F\u7528\u6B0A\u8CC7\u7522\u7E3D\u984D\u662F\u591A\u5C11\uFF1F\u79DF\u8CC3\u8CA0\u50B5\u6D41\u52D5\u8207\u975E\u6D41\u52D5\u5404\u662F\u591A\u5C11\uFF1F\u88AB\u8CEA\u62BC\u7684\u571F\u5730\u4F7F\u7528\u6B0A\u8CEC\u9762\u6DE8\u503C\u662F\u591A\u5C11\uFF1F\u8ACB\u4FDD\u7559\u55AE\u4F4D\u3002`
        ),
        learnerReference: i18n(
          `\u4E8C\u96F6\u4E8C\u4E8C\u5E74\u4F7F\u7528\u6B0A\u8CC7\u7522\u7E3D\u984D\u662F\u4EBA\u6C11\u5E63 532,750 \u5343\u5143\u3002\u79DF\u8CC3\u8CA0\u50B5\u6D41\u52D5\u70BA\u4EBA\u6C11\u5E63 5,629 \u5343\u5143\uFF0C\u975E\u6D41\u52D5\u70BA\u4EBA\u6C11\u5E63 8,936 \u5343\u5143\u3002\u88AB\u8CEA\u62BC\u7684\u571F\u5730\u4F7F\u7528\u6B0A\u8CEC\u9762\u6DE8\u503C\u662F\u4EBA\u6C11\u5E63 106,237,000 \u5143\u3002`
        ),
        teaching: i18n(
          `\u6559\u5B78\u91CD\u9EDE\uFF1A\u6587\u4EF6\u62BD\u53D6\u5F8C\u4ECD\u8981\u5C0F\u5FC3\u55AE\u4F4D\u3002\u8868\u683C\u662F\u300C\u4EBA\u6C11\u5E63\u5343\u5143\u300D\uFF0C\u6558\u8FF0\u6BB5\u843D\u662F\u300C\u4EBA\u6C11\u5E63\u5143\u300D\uFF0C\u5C11\u770B\u55AE\u4F4D\u5C31\u6703\u5DEE\u4E00\u5343\u500D\u3002`
        )
      },
      {
        markdownName: `ccocr-administrative-penalty.md`,
        imageName: `ccocr-administrative-penalty.jpg`,
        displayName: i18n(`\u884C\u653F\u8655\u5206\u516C\u958B\u8868`),
        kind: i18n(`\u6CD5\u5F8B\u6B04\u4F4D`),
        source: `extraction/public_services/kie_administrative_100/04a2c58230e0`,
        dimensions: `1700 \xD7 2338`,
        gpt5HighTokens: 910,
        gpt4oHighTokens: 1105,
        datasetTask: i18n(`\u5F71\u50CF\u6B04\u4F4D\u62BD\u53D6\u70BA JSON`),
        prompt: i18n(
          `\u9019\u500B\u6848\u4EF6\u7684\u9055\u6CD5\u55AE\u4F4D\u662F\u8AB0\uFF1F\u5169\u9805\u9055\u6CD5\u4E8B\u5BE6\u3001\u8655\u7F70\u5167\u5BB9\u8207\u6C7A\u5B9A\u65E5\u671F\u5206\u5225\u662F\u4EC0\u9EBC\uFF1F\u4E0D\u8981\u628A\u8655\u7F70\u4F9D\u64DA\u8AA4\u7576\u6210\u9055\u6CD5\u4E8B\u5BE6\u3002`
        ),
        learnerReference: i18n(
          `\u9055\u6CD5\u55AE\u4F4D\u662F\u967D\u7DAD\u53E3\u8154\u8A3A\u6240\u3002\u9055\u6CD5\u4E8B\u5BE6\u6709\u5169\u9805\uFF1A\u672A\u5B9A\u671F\u958B\u5C55\u6D88\u6BD2\u8207\u9AD8\u58D3\u6EC5\u83CC\u6548\u679C\u6AA2\u6E2C\u5DE5\u4F5C\uFF1B\u904E\u671F\u85E5\u54C1\u672A\u6309\u985E\u5225\u5206\u7F6E\u65BC\u5C08\u7528\u5305\u88DD\u7269\u53CA\u5BB9\u5668\u5167\u3002\u8655\u7F70\u5167\u5BB9\u662F\u8B66\u544A\u3001\u7F70\u6B3E\u4EBA\u6C11\u5E63 3000.00 \u5143\uFF0C\u4E26\u8CAC\u4EE4\u7ACB\u5373\u6539\u6B63\u3002\u6C7A\u5B9A\u65E5\u671F\u662F 2019 \u5E74 12 \u6708 6 \u65E5\u3002`
        ),
        teaching: i18n(
          `\u6559\u5B78\u91CD\u9EDE\uFF1A\u9019\u985E\u516C\u6587\u6B04\u4F4D\u5F88\u9577\uFF0C\u6A21\u578B\u5E38\u628A\u300C\u9055\u6CD5\u4E8B\u5BE6\u3001\u6CD5\u5F8B\u4F9D\u64DA\u3001\u8655\u7F70\u5167\u5BB9\u300D\u6DF7\u6210\u4E00\u6BB5\u770B\u4F3C\u6B63\u78BA\u7684\u6458\u8981\u3002\u8981\u7DF4\u7684\u662F\u6B04\u4F4D\u908A\u754C\u3002`
        )
      },
      {
        markdownName: `ccocr-tax-receipt.md`,
        imageName: `ccocr-tax-receipt.jpeg`,
        displayName: i18n(`\u7A05\u52D9\u6536\u64DA`),
        kind: i18n(`\u6536\u64DA\u6B04\u4F4D`),
        source: `extraction/regulated_records/kie_tax_compliant_100/00fb624f78cb`,
        dimensions: `436 \xD7 1488`,
        gpt5HighTokens: 1750,
        gpt4oHighTokens: 2125,
        datasetTask: i18n(`\u5F71\u50CF\u6B04\u4F4D\u62BD\u53D6\u70BA JSON`),
        prompt: i18n(
          `\u8ACB\u5217\u51FA\u9019\u5F35\u6536\u64DA\u7684\u65E5\u671F\u3001\u6536\u64DA\u865F\u78BC\u3001\u8CE3\u65B9\u540D\u7A31\u3001GST ID\u3001\u7E3D\u984D\u8207\u7A05\u984D\u3002\u91D1\u984D\u8ACB\u7167\u6587\u4EF6\u5167\u5BB9\uFF0C\u4E0D\u8981\u81EA\u884C\u88DC\u5E63\u5225\u3002`
        ),
        learnerReference: i18n(
          `\u65E5\u671F\uFF1A26/02/2018\u3002\u6536\u64DA\u865F\u78BC\uFF1ABWMC02000047293\u3002\u8CE3\u65B9\u540D\u7A31\uFF1AEco - Shop Marketing Sdn Bhd\u3002GST ID\uFF1A000313901056\u3002\u7E3D\u984D\uFF1A16.31\u3002\u7A05\u984D\uFF1A0.91\u3002`
        ),
        teaching: i18n(
          `\u6559\u5B78\u91CD\u9EDE\uFF1A\u6536\u64DA\u8CC7\u6599\u770B\u8D77\u4F86\u77ED\uFF0C\u4F46\u932F\u4E00\u500B\u5B57\u5143\u5C31\u53EF\u80FD\u5C0D\u5E33\u5931\u6557\u3002\u9019\u984C\u9069\u5408\u8AAA\u660E\u300C\u6458\u8981\u6B63\u78BA\u300D\u548C\u300C\u6B04\u4F4D\u7CBE\u6E96\u300D\u662F\u5169\u7A2E\u4E0D\u540C\u80FD\u529B\u3002`
        )
      },
      {
        markdownName: `ccocr-sales-ledger-table.md`,
        imageName: `ccocr-sales-ledger-table.jpg`,
        displayName: i18n(`\u5546\u54C1\u92B7\u552E\u660E\u7D30\u8868`),
        kind: i18n(`\u5927\u578B\u8868\u683C`),
        source: `parsing/complex_table_parsing/doc_parsing_table_table_photo_150/04456dfd256a`,
        dimensions: `1425 \xD7 1900`,
        gpt5HighTokens: 630,
        gpt4oHighTokens: 765,
        datasetTask: i18n(`\u8868\u683C\u5F71\u50CF\u8F49\u5BEB\u70BA HTML`),
        prompt: i18n(
          `\u9019\u4EFD\u5546\u54C1\u92B7\u552E\u660E\u7D30\u7684\u7D71\u8A08\u671F\u9593\u662F\u4EC0\u9EBC\uFF1F\u524D\u4E09\u7B46\u300C\u5343\u79BE\u300D\u5546\u54C1\u7684\u570B\u969B\u689D\u78BC\u3001\u54C1\u540D\u3001\u6578\u91CF\u5C0F\u8A08\u8207\u91D1\u984D\u5C0F\u8A08\u5206\u5225\u662F\u591A\u5C11\uFF1F\u8ACB\u9010\u5217\u56DE\u7B54\u3002`
        ),
        learnerReference: i18n(
          `\u7D71\u8A08\u671F\u9593\u662F 2022-04-01 \u5230 2022-04-30\u3002\u524D\u4E09\u7B46\u5343\u79BE\u5546\u54C1\uFF1A1. 6928312913136\uFF0C\u5343\u79BE\u7279\u9BAE\u751F\u62BD500ml\uFF0C\u6578\u91CF 20.00\uFF0C\u91D1\u984D 138.00\u30022. 6928312964664\uFF0C\u5343\u79BE\u7279\u9999\u8001\u62BD500ml\uFF0C\u6578\u91CF 21.00\uFF0C\u91D1\u984D 144.54\u30023. 6928312988882\uFF0C\u5343\u79BE\u9EC3\u8C46\u91AC\u6CB9680m1\uFF0C\u6578\u91CF 21.00\uFF0C\u91D1\u984D 136.01\u3002`
        ),
        teaching: i18n(
          `\u6559\u5B78\u91CD\u9EDE\uFF1A\u5927\u578B\u8868\u683C\u4E0D\u662F\u53EA\u8981\u300C\u770B\u61C2\u5167\u5BB9\u300D\uFF0C\u9084\u8981\u7DAD\u6301\u6B04\u4F4D\u5C0D\u9F4A\u3002\u6A21\u578B\u82E5\u8DF3\u5217\u3001\u6F0F\u5217\u6216\u628A\u76F8\u9130\u6B04\u4F4D\u5408\u4F75\uFF0C\u7B54\u6848\u6703\u5F88\u50CF\u771F\u7684\u4F46\u5176\u5BE6\u4E0D\u80FD\u7528\u3002`
        )
      }
    ];
    this.session = new o();
    this.session.setSystemPrompt(this.getProviderSystemPrompt());
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.unsubscribe = this.session.subscribe((e) => {
      if (e.type !== `state-update`) return;
      const n = [...e.state.messages].reverse().find((e2) => e2.role === `user`);
      if (n?.attachments && n.attachments.length > 0) {
        const e2 = n.attachments[0];
        this.currentAttachment = e2;
        this.extractedText = e2.extractedText || ``;
        if (!this.files.find((t2) => t2.imageName === e2.fileName)) {
          this.selectedFile = ``;
          if (!(this.selectedDocument?.isCustom && this.selectedDocument.displayName === e2.fileName))
            this.prepareCustomAttachmentPipeline(e2);
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
    return this.isOcrMode() ? i18n(
      `\u4F60\u662F\u4E00\u4F4D\u6587\u4EF6\u554F\u7B54\u670D\u52D9\u4E2D\u7684\u52A9\u7406\u3002\u670D\u52D9\u4F9B\u61C9\u5546\u6703\u5148\u628A\u6587\u4EF6\u524D\u8655\u7406\u6210\u6587\u5B57\u3001\u8868\u683C\u6216 JSON\u3002\u8ACB\u512A\u5148\u6839\u64DA\u62BD\u53D6\u5167\u5BB9\u56DE\u7B54\uFF0C\u4E26\u63D0\u9192\u6B04\u4F4D\u3001\u91D1\u984D\u3001\u65E5\u671F\u8207\u55AE\u4F4D\u4ECD\u9700\u4EBA\u5DE5\u6838\u5C0D\u3002\u82E5\u5167\u5BB9\u4E0D\u8DB3\uFF0C\u8ACB\u8AAA\u660E\u7121\u6CD5\u5224\u65B7\u3002\u9047\u5230\u91D1\u984D\u3001\u65E5\u671F\u3001\u7DE8\u865F\u3001\u6CD5\u898F\u689D\u6587\u6216\u627F\u8AFE\u6642\uFF0C\u8ACB\u4FDD\u7559\u539F\u59CB\u683C\u5F0F\u8207\u55AE\u4F4D\uFF0C\u4E0D\u8981\u81EA\u884C\u88DC\u5B8C\u3002`
    ) : i18n(
      `\u4F60\u662F\u4E00\u4F4D\u6587\u4EF6\u554F\u7B54\u670D\u52D9\u4E2D\u7684\u52A9\u7406\u3002\u9019\u6B21\u670D\u52D9\u4E0D\u63D0\u4F9B OCR/Markdown \u4E2D\u9593\u8868\u793A\uFF0C\u6A21\u578B\u6703\u76F4\u63A5\u770B\u539F\u59CB\u5F71\u50CF\u6216\u9644\u4EF6\u3002\u56DE\u7B54\u6642\u8ACB\u660E\u78BA\u8AAA\u660E\u4F60\u6B63\u5728\u76F4\u63A5\u8B80\u5716\uFF1B\u82E5\u5C0F\u5B57\u3001\u6B04\u4F4D\u3001\u91D1\u984D\u3001\u65E5\u671F\u6216\u55AE\u4F4D\u770B\u4E0D\u6E05\u695A\uFF0C\u8ACB\u8AAA\u4E0D\u78BA\u5B9A\u4E26\u5EFA\u8B70\u4EBA\u5DE5\u6838\u5C0D\uFF0C\u4E0D\u8981\u81EA\u884C\u88DC\u5B8C\u3002`
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
    const n = this.files.find((e2) => e2.markdownName === this.selectedFile);
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
    e.onFilesChange = (r2) => {
      n?.(r2);
      this.handleEditorAttachmentsChange(r2);
    };
    if (e.attachments?.length) this.handleEditorAttachmentsChange(e.attachments);
  }
  handleEditorAttachmentsChange(e) {
    if (this.loadingAttachment) return;
    const n = [...e || []].reverse().find((e2) => !this.files.find((t2) => t2.imageName === e2.fileName)) || e?.[0];
    if (!n) {
      if (this.selectedDocument?.isCustom) this.resetCustomUploadPipeline();
      return;
    }
    if (this.currentAttachment?.id === n.id || this.customAttachmentId === n.id) return;
    if (this.files.find((e2) => e2.imageName === n.fileName)) return;
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
      markdownName: this.isOcrMode() && e.extractedText ? i18n(`\u4F7F\u7528\u8005\u4E0A\u50B3\u9644\u4EF6\u7684\u62BD\u53D6\u6587\u5B57`) : i18n(`\u6C92\u6709\u4E2D\u9593\u6587\u5B57`),
      imageName: e.fileName,
      displayName: e.fileName,
      kind: e.type === `image` ? i18n(`\u4F7F\u7528\u8005\u5F71\u50CF`) : i18n(`\u4F7F\u7528\u8005\u9644\u4EF6`),
      source: i18n(`\u4F7F\u7528\u8005\u672C\u6A5F\u4E0A\u50B3`),
      dimensions: i18n(`\u8B80\u53D6\u4E2D`),
      gpt5HighTokens: void 0,
      gpt4oHighTokens: void 0,
      datasetTask: this.isOcrMode() && e.extractedText ? i18n(`\u9644\u4EF6\u8655\u7406\u5668\u62BD\u53D6\u6587\u5B57`) : e.type === `image` ? i18n(`\u539F\u751F\u8996\u89BA\u8F38\u5165\uFF0C\u6C92\u6709\u62BD\u53D6\u6587\u5B57`) : i18n(`\u9644\u4EF6\u8B80\u53D6`),
      prompt: ``,
      learnerReference: ``,
      teaching: ``
    };
    if (!this.isOcrMode()) this.extractedText = ``;
    this.pipelineStage = `image`;
    this.pipelineExpanded = true;
    this.startPipelineClock();
    await new Promise((e2) => setTimeout(e2, 350));
    if (e.type === `image`) {
      const n = await this.measureImageAttachment(e).catch(() => null);
      if (n && this.currentAttachment?.id === e.id) {
        const r2 = this.estimateHighDetailTokens(n.width, n.height);
        this.selectedDocument = {
          ...this.selectedDocument,
          dimensions: `${n.width} \xD7 ${n.height}`,
          gpt5HighTokens: r2.gpt5,
          gpt4oHighTokens: r2.gpt4o
        };
      }
    }
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `extract`;
    await new Promise((e2) => setTimeout(e2, 550));
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `context`;
    await new Promise((e2) => setTimeout(e2, 500));
    if (this.currentAttachment?.id !== e.id) return;
    this.pipelineStage = `ready`;
    this.stopPipelineClock(true);
  }
  attachmentDataUrl(e = this.currentAttachment) {
    if (!e) return ``;
    return `data:${e.mimeType};base64,${e.content}`;
  }
  measureImageAttachment(e) {
    return new Promise((n, r2) => {
      const i = new Image();
      i.onload = () => n({ width: i.naturalWidth, height: i.naturalHeight });
      i.onerror = r2;
      i.src = this.attachmentDataUrl(e);
    });
  }
  estimateHighDetailTokens(e, n) {
    let r2 = e;
    let i = n;
    const a = Math.min(2048 / r2, 2048 / i, 1);
    r2 *= a;
    i *= a;
    const o2 = 768 / Math.min(r2, i);
    r2 *= o2;
    i *= o2;
    const s = Math.ceil(r2 / 512) * Math.ceil(i / 512);
    return { gpt5: 70 + s * 140, gpt4o: 85 + s * 170 };
  }
  renderContentPanel() {
    return b`
			<div class="w-full h-full flex flex-col bg-background">
				${this.selectedDocument || this.pipelineStage !== `idle` ? b`<div class="border-b border-border bg-card/70 px-4 py-3">${this.renderPipelineCard()}</div>` : b``}
				<div class="flex-1 min-h-0 p-4 pb-4">${this.agentInterface}</div>
			</div>
		`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${i18n(`\u9019\u4E00\u9801\u4F7F\u7528 CC-OCR-V2 \u7684\u771F\u5BE6\u6587\u4EF6\u5F71\u50CF\uFF0C\u4E26\u8B93\u4F60\u5207\u63DB\u5169\u7A2E\u7522\u54C1\u505A\u6CD5\uFF1A\u5148 OCR/\u7248\u9762\u89E3\u6790\u6210\u4E2D\u9593\u8868\u793A\uFF0C\u6216\u76F4\u63A5\u628A\u539F\u5716\u4EA4\u7D66\u8996\u89BA\u6A21\u578B\u3002\u8ACB\u6BD4\u8F03\u6210\u672C\u3001\u53EF\u9664\u932F\u6027\u8207\u56DE\u7B54\u53EF\u9760\u5EA6\u3002`)}
				</p>
				${this.renderModeToggle()}
				${T(b`
					${E(O(i18n(`\u8CC7\u6599\u96C6\u6587\u4EF6`)))}
					${A(b`<div class="flex flex-col gap-2">${this.files.map((e) => this.renderFileButton(e))}</div>`)}
				`)}
				${this.renderProviderWindow()}
				${this.renderVisionTradeoffWindow()}
				${this.selectedDocument ? T(b`
							${E(O(i18n(`\u4F86\u6E90\u5F71\u50CF`)))}
							${A(b`
								${this.selectedDocument.isCustom && this.currentAttachment?.type !== `image` ? b`<div class="rounded-md border border-border bg-muted/40 p-3 text-xs text-muted-foreground">${i18n(`\u9019\u4EFD\u81EA\u8A02\u9644\u4EF6\u4E0D\u662F\u5F71\u50CF\u9810\u89BD\uFF1B\u8ACB\u770B\u4E0B\u65B9\u804A\u5929\u9644\u4EF6\u3002`)}</div>` : b`<img
											src="${this.selectedDocument.isCustom ? this.attachmentDataUrl() : `/data/doc-upload/${this.selectedDocument.imageName}`}"
											alt="${this.selectedDocument.displayName}"
											class="w-full max-h-72 object-contain rounded-md border border-border bg-white p-2"
										/>`}
								<div class="mt-2 text-[11px] text-muted-foreground break-all">${this.selectedDocument.isCustom ? i18n(`\u4F86\u6E90`) : h}: ${this.selectedDocument.source}</div>
							`)}
						`) : ``}
				${this.referenceAnswer ? T(b`
							${E(O(i18n(`\u7B54\u6848\u6AA2\u67E5`)))}
							${A(b`<div class="rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed whitespace-pre-wrap">${this.referenceAnswer}</div>`)}
						`) : ``}
			</div>
		`;
  }
  renderModeToggle() {
    const e = this.isOcrMode();
    return T(b`
			${E(O(i18n(`\u8655\u7406\u65B9\u5F0F`)))}
			${A(b`
				<div class="grid grid-cols-2 gap-2">
					<button
						class="rounded-md border px-3 py-2 text-left transition-colors ${e ? `border-primary bg-primary/15 text-foreground` : `border-border bg-muted/20 text-muted-foreground hover:bg-accent/30`}"
						?disabled=${this.loadingAttachment}
						@click=${() => this.setProcessingMode(`ocr`)}
					>
						<div class="text-sm font-bold">${i18n(`OCR\uFF0F\u524D\u8655\u7406`)}</div>
						<div class="mt-1 text-[11px] leading-4">${i18n(`\u5148\u62BD\u6587\u5B57\u8868\u683C\uFF0C\u518D\u8B93\u6A21\u578B\u56DE\u7B54\u3002\u53EF\u6AA2\u67E5\u3001\u53EF\u91CD\u7528\u3002`)}</div>
					</button>
					<button
						class="rounded-md border px-3 py-2 text-left transition-colors ${!e ? `border-primary bg-primary/15 text-foreground` : `border-border bg-muted/20 text-muted-foreground hover:bg-accent/30`}"
						?disabled=${this.loadingAttachment}
						@click=${() => this.setProcessingMode(`native`)}
					>
						<div class="text-sm font-bold">${i18n(`\u539F\u751F\u8996\u89BA`)}</div>
						<div class="mt-1 text-[11px] leading-4">${i18n(`\u76F4\u63A5\u628A\u539F\u5716\u4EA4\u7D66\u6A21\u578B\u3002\u4E0A\u624B\u5FEB\uFF0C\u4F46\u8F03\u96E3 debug\u3002`)}</div>
					</button>
				</div>
				<div class="mt-2 rounded-md border border-border bg-muted/30 p-2 text-[11px] leading-5 text-muted-foreground">
					${e ? i18n(`\u76EE\u524D\u804A\u5929\u6846\u6703\u6536\u5230\u5F71\u50CF\u9644\u4EF6\u8207\u62BD\u53D6\u51FA\u7684\u4E2D\u9593\u8868\u793A\u3002\u5B78\u751F\u53EF\u4EE5\u5C55\u958B\u6D41\u7A0B\u67E5\u770B OCR/\u8868\u683C\u5167\u5BB9\u3002`) : i18n(
      `\u76EE\u524D\u804A\u5929\u6846\u53EA\u6703\u6536\u5230\u539F\u59CB\u5F71\u50CF\u9644\u4EF6\u3002\u6D41\u7A0B\u6703\u4FDD\u7559\u300C\u6C92\u6709\u4E2D\u9593\u8868\u793A\u300D\u9019\u4EF6\u4E8B\uFF0C\u907F\u514D\u628A\u8B80\u5716\u7D50\u679C\u507D\u88DD\u6210 OCR\u3002`
    )}
				</div>
			`)}
		`);
  }
  renderProviderWindow() {
    return T(b`
			${E(O(i18n(`\u670D\u52D9\u4F9B\u61C9\u5546\u80CC\u5F8C\u505A\u7684\u4E8B`)))}
			${A(b`
				<div class="space-y-3 text-xs leading-relaxed">
					<div class="rounded-md border border-border bg-muted/30 p-3">
						<div class="font-semibold text-foreground">${i18n(`\u4F7F\u7528\u8005\u770B\u898B`)}</div>
						<div class="mt-1 text-muted-foreground">${i18n(`\u4E0A\u50B3\u6587\u4EF6\u5F8C\uFF0C\u76F4\u63A5\u554F\uFF1A\u300C\u9019\u4EFD\u6587\u4EF6\u7684\u91CD\u9EDE\u662F\u4EC0\u9EBC\uFF1F\u300D\u6216\u300C\u9019\u500B\u91D1\u984D\u662F\u591A\u5C11\uFF1F\u300D`)}</div>
					</div>
					<div class="rounded-md border border-border bg-muted/30 p-3">
						<div class="font-semibold text-foreground">${this.isOcrMode() ? i18n(`\u670D\u52D9\u80CC\u5F8C\uFF1AOCR\uFF0F\u524D\u8655\u7406\u8DEF\u5F91`) : i18n(`\u670D\u52D9\u80CC\u5F8C\uFF1A\u539F\u751F\u8996\u89BA\u8DEF\u5F91`)}</div>
						<ol class="mt-1 list-decimal pl-4 text-muted-foreground space-y-1">
							${this.isOcrMode() ? b`
										<li>${i18n(`\u5148\u7528 OCR\u3001\u7248\u9762\u5206\u6790\u6216\u8868\u683C\u89E3\u6790\uFF0C\u628A\u6587\u4EF6\u8F49\u6210\u6587\u5B57\u3001\u8868\u683C\u3001JSON \u6216 HTML\u3002`)}</li>
										<li>${i18n(`\u628A\u4E2D\u9593\u8868\u793A\u653E\u9032\u4E0A\u4E0B\u6587\uFF0C\u8B93\u6A21\u578B\u6839\u64DA\u53EF\u6AA2\u67E5\u7684\u5167\u5BB9\u56DE\u7B54\u3002`)}</li>
										<li>${i18n(`\u7528\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u9650\u5236\u6A21\u578B\uFF1A\u6839\u64DA\u62BD\u53D6\u5167\u5BB9\u56DE\u7B54\uFF0C\u683C\u5F0F\u8207\u55AE\u4F4D\u4E0D\u80FD\u4E82\u88DC\u3002`)}</li>
									` : b`
										<li>${i18n(`\u8DF3\u904E OCR/Markdown \u4E2D\u9593\u5C64\uFF0C\u76F4\u63A5\u628A\u539F\u59CB\u5F71\u50CF\u4EA4\u7D66\u8996\u89BA\u6A21\u578B\u3002`)}</li>
										<li>${i18n(`\u6A21\u578B\u81EA\u5DF1\u8B80\u5716\u3001\u627E\u6B04\u4F4D\u3001\u8FA8\u8B58\u6587\u5B57\uFF1B\u6C92\u6709\u53EF diff \u6216\u6253 patch \u7684\u4E2D\u9593\u7D50\u679C\u3002`)}</li>
										<li>${i18n(`\u7528\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u8981\u6C42\u6A21\u578B\u6A19\u660E\u4E0D\u78BA\u5B9A\u8655\uFF0C\u907F\u514D\u628A\u770B\u4E0D\u6E05\u695A\u7684\u5167\u5BB9\u8B1B\u5F97\u592A\u80AF\u5B9A\u3002`)}</li>
									`}
						</ol>
					</div>
					<div>
						<div class="font-semibold text-foreground mb-1">${i18n(`\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A`)}</div>
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
    const n = Math.max(0, e) / 1e3;
    if (n < 60) return `${n.toFixed(1)}s`;
    const r2 = Math.floor(n / 60);
    const i = Math.round(n % 60);
    return `${r2}m ${i}s`;
  }
  renderProgressMarker(e, n, r2) {
    if (n)
      return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-emerald-500 text-xs font-bold text-black">✓</div>`;
    if (e) {
      return b`
				<div class="grid h-7 w-7 place-items-center rounded-full border border-amber-400/70 bg-amber-400/15">
					<div class="h-3 w-3 animate-spin rounded-full border-2 border-amber-300 border-t-transparent"></div>
				</div>
			`;
    }
    return b`<div class="grid h-7 w-7 place-items-center rounded-full bg-muted text-xs font-bold text-muted-foreground">${r2}</div>`;
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
  renderStepOutcome(e, n) {
    if (!e) return ``;
    return b`
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
      return b`
				<div class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
					<div class="font-semibold text-foreground">${i18n(`\u9019\u6B21\u6C92\u6709\u62BD\u53D6\u6587\u5B57`)}</div>
					<div class="mt-1 text-muted-foreground">
						${this.isOcrMode() ? i18n(
        `\u9019\u4EFD\u81EA\u8A02\u9644\u4EF6\u6C92\u6709\u53EF\u7528\u7684\u672C\u6A5F OCR/Markdown \u4E2D\u9593\u8868\u793A\u3002\u7CFB\u7D71\u4E0D\u6703\u5047\u88DD\u62BD\u53D6\u6210\u529F\uFF1B\u82E5\u8981\u5B8C\u6574\u89C0\u5BDF OCR \u6D41\u7A0B\uFF0C\u8ACB\u9078\u5DE6\u5074\u8CC7\u6599\u96C6\u7BC4\u4F8B\u3002`
      ) : i18n(
        `\u76EE\u524D\u662F\u539F\u751F\u8996\u89BA\u8DEF\u5F91\uFF1A\u6A21\u578B\u76F4\u63A5\u8B80\u5716\u3002\u9019\u5F88\u65B9\u4FBF\uFF0C\u4F46\u6C92\u6709 Markdown/\u8868\u683C\u4E2D\u9593\u7D50\u679C\u53EF\u4EE5 debug\u3002`
      )}
					</div>
				</div>
			`;
    }
    return b`
			<div>
				<div class="text-xs text-muted-foreground">${i18n(`\u5DF2\u7522\u751F\u53EF\u6AA2\u67E5\u7684\u4E2D\u9593\u8868\u793A\u3002\u9019\u4E0D\u662F\u4F7F\u7528\u8005\u539F\u672C\u4E0A\u50B3\u7684\u6A94\u6848\uFF0C\u800C\u662F\u670D\u52D9\u653E\u9032\u6A21\u578B\u4E0A\u4E0B\u6587\u7684\u5167\u5BB9\u3002`)}</div>
				${this.renderStepOutcome(
      i18n(`\u67E5\u770B\u7CFB\u7D71\u62BD\u51FA\u7684\u5167\u5BB9`),
      b`<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.extractedText}</pre>`
    )}
			</div>
		`;
  }
  renderContextOutcome() {
    return b`
			<div>
				<div>
					${this.hasExtractedLayer() ? i18n(`\u5DF2\u628A\u62BD\u53D6\u5167\u5BB9\u8207\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u653E\u5165\u6A21\u578B\u4E0A\u4E0B\u6587\u3002`) : i18n(
      `\u5DF2\u628A\u539F\u59CB\u5F71\u50CF\u8207\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u653E\u5165\u6A21\u578B\u4E0A\u4E0B\u6587\uFF1B\u9019\u6B21\u6C92\u6709\u53EF\u6AA2\u67E5\u7684 OCR/Markdown \u4E2D\u9593\u8868\u793A\u3002`
    )}
				</div>
				${this.renderStepOutcome(
      i18n(`\u67E5\u770B\u9001\u9032\u6A21\u578B\u7684\u670D\u52D9\u898F\u5247`),
      b`<pre class="max-h-44 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.providerSystemPrompt}</pre>`
    )}
				${this.renderStepOutcome(
      i18n(`\u67E5\u770B\u5BE6\u969B\u9001\u7D66\u6A21\u578B\u7684 payload`),
      b`
						<div class="mb-2 rounded-md border border-border bg-muted/30 p-2 text-[11px] leading-5 text-muted-foreground">
							${i18n(`\u70BA\u4E86\u53EF\u8B80\u6027\uFF0C\u9019\u88E1\u7701\u7565\u5716\u7247\u7684 base64 \u5167\u5BB9\uFF1B\u6A21\u578B\u5BE6\u969B\u6536\u5230\u7684\u662F\u540C\u4E00\u500B image part\u3002OCR \u6A21\u5F0F\u6703\u591A\u4E00\u6BB5 document text\uFF0C\u539F\u751F\u8996\u89BA\u6A21\u5F0F\u4E0D\u6703\u3002`)}
						</div>
						<pre class="max-h-72 overflow-y-auto whitespace-pre-wrap rounded-md bg-muted/40 p-3 font-mono text-[11px] leading-5 text-muted-foreground">${this.renderModelPayloadPreview()}</pre>
					`
    )}
			</div>
		`;
  }
  renderModelPayloadPreview() {
    const e = this.agentInterface?._messageEditor;
    const n = e?.value || this.selectedDocument?.prompt || i18n(`\u4F7F\u7528\u8005\u5C1A\u672A\u8F38\u5165\u554F\u984C`);
    const r2 = this.currentAttachment;
    const i = [{ type: `text`, text: n }];
    if (r2?.type === `image`) {
      i.push({
        type: `image`,
        mimeType: r2.mimeType,
        fileName: r2.fileName,
        data: `<base64 image omitted>`
      });
    }
    if (this.hasExtractedLayer()) {
      i.push({
        type: `text`,
        isDocument: true,
        text: `\\n\\n[Document preprocessed from ${r2?.fileName || this.selectedDocument?.imageName}]\\n${this.extractedText}`
      });
    }
    return JSON.stringify(
      {
        systemPrompt: this.providerSystemPrompt,
        messages: [
          {
            role: `user`,
            content: i
          }
        ]
      },
      null,
      2
    );
  }
  renderPipelineCard() {
    if (!this.selectedDocument && this.pipelineStage === `idle`) return ``;
    const e = this.getCompletedPipelineCount();
    const n = this.getPipelineOrder().length;
    const r2 = Math.round(e / n * 100);
    const a = Math.max(
      0,
      (this.pipelineFinishedAt || this.pipelineNow || Date.now()) - (this.pipelineStartedAt || Date.now())
    );
    const o2 = this.pipelineStage === `ready`;
    const s = this.selectedDocument;
    return b`
			<details class="group rounded-xl border border-border bg-background/70" ?open=${this.pipelineExpanded} @toggle=${(e2) => this.pipelineExpanded = e2.currentTarget.open}>
				<summary class="flex cursor-pointer select-none items-center justify-between gap-3 px-4 py-3">
					<div class="min-w-0 flex-1">
						<div class="flex flex-wrap items-center gap-3">
							<div class="text-sm font-bold text-foreground">${o2 ? i18n(`\u6587\u4EF6\u8655\u7406\u6D41\u7A0B\u5B8C\u6210`) : i18n(`\u6587\u4EF6\u8655\u7406\u6D41\u7A0B\u9032\u884C\u4E2D`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${e}/${n} ${i18n(`\u5B8C\u6210`)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 font-mono text-[11px] text-muted-foreground">${this.formatElapsedTime(a)}</div>
							<div class="rounded-full bg-muted px-2 py-0.5 text-[11px] font-semibold text-muted-foreground">${this.isOcrMode() ? i18n(`OCR\uFF0F\u524D\u8655\u7406`) : i18n(`\u539F\u751F\u8996\u89BA`)}</div>
						</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">
							${this.isOcrMode() ? i18n(
      `\u9019\u88E1\u770B\u7684\u662F OCR \u8DEF\u5F91\uFF1A\u539F\u59CB\u6A94\u9032\u4F86\uFF0C\u670D\u52D9\u5148\u62BD\u53D6\u6587\u5B57/\u8868\u683C\uFF0C\u518D\u7D44\u4E0A\u4E0B\u6587\u8B93\u6A21\u578B\u56DE\u7B54\u3002`
    ) : i18n(
      `\u9019\u88E1\u770B\u7684\u662F\u539F\u751F\u8996\u89BA\u8DEF\u5F91\uFF1A\u539F\u59CB\u6A94\u76F4\u63A5\u9032\u6A21\u578B\u4E0A\u4E0B\u6587\uFF0C\u6C92\u6709\u53EF\u6AA2\u67E5\u7684 OCR/Markdown \u4E2D\u9593\u8868\u793A\u3002`
    )}
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
						${i18n(`\u6587\u4EF6\u4E0A\u50B3\u4E0D\u662F\u9B54\u6CD5\u3002\u540C\u4E00\u5F35\u5716\u53EF\u4EE5\u8D70\u5169\u689D\u8DEF\uFF1A\u5148\u8B8A\u6210\u53EF\u6AA2\u67E5\u7684\u4E2D\u9593\u8868\u793A\uFF0C\u6216\u76F4\u63A5\u4EA4\u7D66\u8996\u89BA\u6A21\u578B\u8B80\u3002`)}
					</div>
					<div class="grid gap-3">
						${this.renderPipelineStep(
      `image`,
      1,
      i18n(`\u6536\u5230\u539F\u59CB\u5F71\u50CF`),
      i18n(`\u4F7F\u7528\u8005\u4EE5\u70BA\u53EA\u662F\u4E0A\u50B3\u5716\u7247\u6216 PDF\uFF1B\u7522\u54C1\u5148\u62FF\u5230\u539F\u59CB\u6A94\u8207\u6A94\u540D\u3002`),
      s ? b`
										<div>${s.imageName} · ${s.dimensions}</div>
										${this.renderStepOutcome(
        i18n(`\u67E5\u770B\u539F\u59CB\u5F71\u50CF`),
        s.isCustom && this.currentAttachment?.type !== `image` ? b`<div class="rounded-md border border-border bg-muted/40 p-3">${i18n(`\u9019\u4EFD\u81EA\u8A02\u9644\u4EF6\u4E0D\u662F\u5F71\u50CF\u9810\u89BD\uFF1B\u8ACB\u770B\u4E0B\u65B9\u804A\u5929\u9644\u4EF6\u3002`)}</div>` : b`<img src="${s.isCustom ? this.attachmentDataUrl() : `/data/doc-upload/${s.imageName}`}" alt="${s.displayName}" class="max-h-72 w-full rounded-md border border-border bg-white object-contain p-2" />`
      )}
									` : i18n(`\u7B49\u5F85\u9078\u64C7\u6587\u4EF6\u3002`)
    )}
						${this.renderPipelineStep(
      `extract`,
      2,
      i18n(`\u524D\u8655\u7406\u62BD\u6210\u6587\u5B57/\u8868\u683C`),
      s?.isCustom && !this.extractedText ? i18n(`\u9019\u4EFD\u81EA\u8A02\u9644\u4EF6\u6C92\u6709 OCR/Markdown \u4E2D\u9593\u8868\u793A\uFF1B\u7CFB\u7D71\u4E0D\u6703\u5047\u88DD\u62BD\u53D6\u6210\u529F\u3002`) : this.isOcrMode() ? i18n(
        `\u670D\u52D9\u7528 OCR\u3001\u8868\u683C\u89E3\u6790\u6216\u7248\u9762\u5206\u6790\u7522\u751F\u4E2D\u9593\u8868\u793A\u3002\u9019\u4E00\u9801\u4F7F\u7528\u8CC7\u6599\u96C6\u5DF2\u6A19\u8A3B\u7684\u62BD\u53D6\u7D50\u679C\u793A\u7BC4\u3002`
      ) : i18n(`\u9019\u4E00\u6B65\u88AB\u8DF3\u904E\uFF1A\u539F\u751F\u8996\u89BA\u8DEF\u5F91\u4E0D\u7522\u751F\u53EF\u6AA2\u67E5\u7684 Markdown/\u8868\u683C\u4E2D\u9593\u8868\u793A\u3002`),
      s ? b`
										<div>${this.hasExtractedLayer() ? i18n(`\u4E2D\u9593\u683C\u5F0F`) : i18n(`\u76EE\u524D\u72C0\u614B`)}：${this.hasExtractedLayer() ? s.markdownName : i18n(`\u6C92\u6709\u4E2D\u9593\u8868\u793A`)} · ${s.datasetTask}</div>
										${this.renderExtractedContentOutcome()}
									` : ``
    )}
						${this.renderPipelineStep(
      `context`,
      3,
      i18n(`\u7D44\u6210\u6A21\u578B\u4E0A\u4E0B\u6587`),
      this.hasExtractedLayer() ? i18n(`\u62BD\u53D6\u7D50\u679C\u548C\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u4E00\u8D77\u9032\u4E0A\u4E0B\u6587\uFF1B\u4F7F\u7528\u8005\u4E0D\u9700\u8981\u77E5\u9053\u670D\u52D9\u628A\u6587\u4EF6\u6539\u6210\u4EC0\u9EBC\u683C\u5F0F\u3002`) : i18n(
        `\u539F\u59CB\u5F71\u50CF\u548C\u96B1\u85CF\u7CFB\u7D71\u63D0\u793A\u4E00\u8D77\u9032\u4E0A\u4E0B\u6587\uFF1B\u9019\u6642\u6210\u672C\u8207\u932F\u8AA4\u4F86\u6E90\u8981\u7528 native vision \u7684\u65B9\u5F0F\u7406\u89E3\u3002`
      ),
      this.renderContextOutcome()
    )}
						${this.renderPipelineStep(
      `ready`,
      4,
      i18n(`\u7B49\u5F85\u6A21\u578B\u56DE\u7B54\u8207\u4EBA\u5DE5\u6AA2\u67E5`),
      i18n(`\u73FE\u5728\u624D\u8F2A\u5230\u6A21\u578B\u56DE\u7B54\u3002\u5B78\u751F\u8981\u7528\u8CC7\u6599\u96C6\u53C3\u8003\u7B54\u6848\u6AA2\u67E5\u6B04\u4F4D\u3001\u55AE\u4F4D\u8207\u4F86\u6E90\u3002`),
      o2 ? s?.isCustom ? this.hasExtractedLayer() ? i18n(
        `\u4E0B\u65B9\u804A\u5929\u6846\u4FDD\u7559\u4E86\u4F60\u4E0A\u50B3\u7684\u9644\u4EF6\u8207\u62BD\u53D6\u6587\u5B57\uFF1B\u9001\u51FA\u5F8C\uFF0C\u8ACB\u6AA2\u67E5\u6A21\u578B\u662F\u5426\u53EA\u6839\u64DA\u53EF\u7528\u5167\u5BB9\u56DE\u7B54\u3002`
      ) : i18n(
        `\u4E0B\u65B9\u804A\u5929\u6846\u4FDD\u7559\u4E86\u4F60\u4E0A\u50B3\u7684\u9644\u4EF6\uFF1B\u9001\u51FA\u5F8C\uFF0C\u8ACB\u7279\u5225\u7559\u610F\u6A21\u578B\u662F\u5426\u628A\u770B\u4E0D\u6E05\u695A\u7684\u6B04\u4F4D\u8AAA\u5F97\u592A\u78BA\u5B9A\u3002`
      ) : this.hasExtractedLayer() ? i18n(
        `\u4E0B\u65B9\u804A\u5929\u6846\u5DF2\u653E\u5165\u539F\u59CB\u5F71\u50CF\u3001\u62BD\u53D6\u5167\u5BB9\u8207\u554F\u984C\uFF1B\u9001\u51FA\u5F8C\uFF0C\u8ACB\u5C0D\u7167\u5DE6\u5074\u53C3\u8003\u7B54\u6848\u6AA2\u67E5\u6A21\u578B\u56DE\u7B54\u3002`
      ) : i18n(
        `\u4E0B\u65B9\u804A\u5929\u6846\u5DF2\u653E\u5165\u539F\u59CB\u5F71\u50CF\u8207\u554F\u984C\uFF0C\u4F46\u6C92\u6709\u62BD\u53D6\u5167\u5BB9\uFF1B\u9001\u51FA\u5F8C\uFF0C\u8ACB\u5C0D\u7167\u5DE6\u5074\u53C3\u8003\u7B54\u6848\u6AA2\u67E5\u6A21\u578B\u8B80\u5716\u662F\u5426\u53EF\u9760\u3002`
      ) : i18n(`\u7B49\u5F85\u6587\u4EF6\u7BA1\u7DDA\u5B8C\u6210\u3002`),
      false
    )}
					</div>
				</div>
			</details>
		`;
  }
  renderVisionTradeoffWindow() {
    const e = this.selectedDocument;
    const n = e?.gpt5HighTokens && e?.gpt4oHighTokens;
    return T(b`
			${E(O(i18n(`\u76F4\u63A5\u7528\u8996\u89BA\u6A21\u578B\u8B80\u5716\uFF1F`)))}
			${A(b`
				<div class="space-y-3 text-xs leading-relaxed">
					<div class="grid grid-cols-2 gap-2">
						<div class="rounded-md border border-border bg-muted/30 p-3">
							<div class="font-semibold text-foreground">${i18n(`\u539F\u5716\u9032\u6A21\u578B`)}</div>
							<ul class="mt-1 list-disc pl-4 text-muted-foreground space-y-1">
								<li>${i18n(`\u6700\u5FEB\u958B\u59CB\uFF0C\u5C11\u4E00\u500B OCR/\u89E3\u6790\u7BA1\u7DDA\u3002`)}</li>
								<li>${i18n(`\u6BCF\u6B21\u554F\u554F\u984C\u90FD\u53EF\u80FD\u91CD\u65B0\u628A\u5716\u7247\u585E\u9032\u4E0A\u4E0B\u6587\u3002`)}</li>
								<li>${i18n(`\u8B80\u932F\u6216\u5E7B\u89BA\u6642\uFF0C\u5F88\u96E3\u77E5\u9053\u662F\u5716\u7247\u3001\u63D0\u793A\uFF0C\u9084\u662F\u6A21\u578B\u8996\u89BA\u5224\u8B80\u51FA\u932F\u3002`)}</li>
							</ul>
						</div>
						<div class="rounded-md border border-border bg-muted/30 p-3">
							<div class="font-semibold text-foreground">${i18n(`\u5148\u62BD\u6210\u6587\u5B57/\u8868\u683C`)}</div>
							<ul class="mt-1 list-disc pl-4 text-muted-foreground space-y-1">
								<li>${i18n(`\u62BD\u53D6\u7D50\u679C\u53EF\u4EE5\u88AB\u6AA2\u67E5\u3001diff\u3001\u6253 patch\u3002`)}</li>
								<li>${i18n(`\u540C\u4E00\u4EFD\u6587\u4EF6\u53CD\u8986\u554F\u7B54\u6642\uFF0C\u4E0D\u5FC5\u6BCF\u8F2A\u90FD\u91CD\u8B80\u6574\u5F35\u5716\u3002`)}</li>
								<li>${i18n(`\u53EF\u4EE5\u5207\u7AE0\u7BC0\u3001\u5207\u8868\u683C\u3001\u52A0\u7CFB\u7D71\u898F\u5247\uFF0C\u964D\u4F4E\u5168\u5716\u4E82\u731C\u3002`)}</li>
							</ul>
						</div>
					</div>
					<div class="rounded-md border border-amber-500/40 bg-amber-500/10 p-3">
						<div class="font-semibold text-foreground">${i18n(`\u5927\u6982\u6703\u5403\u591A\u5C11\u4E0A\u4E0B\u6587\uFF1F`)}</div>
						<div class="mt-1 text-muted-foreground">
							${e ? n ? i18n(
      `${e.displayName} \u539F\u5716 ${e.dimensions}\u3002\u4F9D OpenAI API \u5F71\u50CF token \u516C\u5F0F\u4F30\u7B97\uFF0CGPT-5 high detail \u7D04 70 + \u6BCF\u500B 512px tile 140 tokens\uFF0C\u9019\u5F35\u7D04 ${e.gpt5HighTokens.toLocaleString(`en-US`)} tokens\uFF1BGPT-4o high detail \u7D04 85 + \u6BCF tile 170 tokens\uFF0C\u9019\u5F35\u7D04 ${e.gpt4oHighTokens.toLocaleString(`en-US`)} tokens\u3002low detail \u662F\u56FA\u5B9A\u4F4E\u89E3\u6790\u9810\u89BD\uFF0C\u4FBF\u5B9C\u4F46\u4E0D\u9069\u5408\u8B80\u5C0F\u5B57\u8207\u8868\u683C\u3002`
    ) : i18n(
      `${e.displayName} \u539F\u5716\u5C3A\u5BF8\u4ECD\u5728\u8B80\u53D6\u4E2D\u3002\u82E5\u662F\u5F71\u50CF\uFF0C\u9019\u88E1\u6703\u4F30\u7B97 high detail image tokens\uFF1B\u82E5\u4E0D\u662F\u5F71\u50CF\uFF0C\u6210\u672C\u4E3B\u8981\u53D6\u6C7A\u65BC\u62BD\u51FA\u7684\u6587\u5B57\u9577\u5EA6\u3002`
    ) : i18n(
      `\u9078\u4E00\u4EFD\u6587\u4EF6\u5F8C\uFF0C\u9019\u88E1\u6703\u7528\u8A72\u5F71\u50CF\u5C3A\u5BF8\u4F30\u7B97 high detail \u7684 image tokens\u3002OpenAI API \u6587\u4EF6\u5217\u51FA GPT-5 high detail \u7D04 70 + \u6BCF\u500B 512px tile 140 tokens\uFF1BGPT-4o \u7D04 85 + \u6BCF tile 170 tokens\u3002`
    )}
						</div>
						<a class="mt-2 inline-block text-[11px] text-blue-500 underline" href="https://platform.openai.com/docs/guides/images-vision" target="_blank">${i18n(`OpenAI Images and vision \u6587\u4EF6`)}</a>
					</div>
					<div class="rounded-md border border-border bg-muted/30 p-3 text-muted-foreground">
						${i18n(`\u8AB2\u5802\u5224\u65B7\uFF1A\u4E00\u6B21\u6027\u770B\u5716\u3001\u554F\u5927\u610F\uFF0C\u53EF\u4EE5\u76F4\u63A5\u7528\u8996\u89BA\u6A21\u578B\uFF1B\u8981\u53CD\u8986\u67E5\u8A62\u3001\u7CBE\u6E96\u6B04\u4F4D\u3001\u6210\u672C\u53EF\u63A7\u3001\u932F\u8AA4\u53EF debug\uFF0C\u5C31\u61C9\u8A72\u5148\u4ED8\u4E00\u6B21\u524D\u8655\u7406\u4EE3\u50F9\uFF0C\u628A\u6587\u4EF6\u505A\u6210\u53EF\u6AA2\u67E5\u7684\u4E2D\u9593\u8868\u793A\u3002`)}
					</div>
				</div>
			`)}
		`);
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
  renderFileButton(e) {
    const n = this.selectedFile === e.markdownName;
    return b`
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
								${u(e.kind, `secondary`)}
							</div>
							<div class="text-xs text-muted-foreground mt-0.5">${e.imageName}</div>
						</div>
					${n ? u(i18n(`\u5DF2\u9078\u53D6`), `secondary`) : b``}
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
      await new Promise((e2) => setTimeout(e2, 450));
      this.pipelineStage = `extract`;
      const n = await fetch(`./data/doc-upload/${e.markdownName}`);
      const r2 = await n.text();
      await new Promise((e2) => setTimeout(e2, 650));
      const o2 = await fetch(`./data/doc-upload/${e.imageName}`);
      const s = await o2.blob();
      this.referenceAnswer = `${i18n(`\u8CC7\u6599\u4F86\u6E90`)}\uFF1A${h} / ${e.source}
${i18n(`\u8CC7\u6599\u96C6\u6A19\u8A3B\u4EFB\u52D9`)}\uFF1A${e.datasetTask}
${i18n(`\u76EE\u524D\u8DEF\u5F91`)}\uFF1A${this.isOcrMode() ? i18n(`OCR\uFF0F\u524D\u8655\u7406\uFF0C\u6703\u628A\u8CC7\u6599\u96C6\u6A19\u8A3B\u5167\u5BB9\u653E\u9032\u6A21\u578B\u4E0A\u4E0B\u6587`) : i18n(`\u539F\u751F\u8996\u89BA\uFF0C\u53EA\u628A\u539F\u59CB\u5F71\u50CF\u653E\u9032\u6A21\u578B\u4E0A\u4E0B\u6587`)}

${i18n(`\u672C\u6559\u5B78\u984C\u7B54\u6848`)}\uFF1A
${e.learnerReference}

${e.teaching}`;
      const c = await _R(s, e.imageName);
      if (this.isOcrMode()) {
        c.extractedText = r2;
        c.preprocessedFileName = e.markdownName;
      }
      this.currentAttachment = c;
      this.extractedText = this.isOcrMode() ? r2 : ``;
      this.pipelineStage = `context`;
      await new Promise((e2) => setTimeout(e2, 650));
      this.agentInterface.setInput(e.prompt, [c]);
      this.pipelineStage = `ready`;
      this.stopPipelineClock(true);
    } catch (n) {
      console.error(`Failed to load`, e.markdownName, n);
      this.extractedText = `${i18n(`\u7121\u6CD5\u8F09\u5165`)} ${e.markdownName}`;
      this.stopPipelineClock(false);
    } finally {
      this.loadingAttachment = false;
    }
  }
  getFileGlyph() {
    const e = `w-5 h-5`;
    return b`<svg class="${e} text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
__decorate([r()], b2.prototype, `currentAttachment`, void 0);
__decorate([r()], b2.prototype, `selectedDocument`, void 0);
__decorate([r()], b2.prototype, `extractedText`, void 0);
__decorate([r()], b2.prototype, `loadingAttachment`, void 0);
__decorate([r()], b2.prototype, `selectedFile`, void 0);
__decorate([r()], b2.prototype, `referenceAnswer`, void 0);
__decorate([r()], b2.prototype, `processingMode`, void 0);
__decorate([r()], b2.prototype, `providerSystemPrompt`, void 0);
__decorate([r()], b2.prototype, `pipelineStage`, void 0);
__decorate([r()], b2.prototype, `pipelineStartedAt`, void 0);
__decorate([r()], b2.prototype, `pipelineFinishedAt`, void 0);
__decorate([r()], b2.prototype, `pipelineNow`, void 0);
__decorate([r()], b2.prototype, `pipelineExpanded`, void 0);
b2 = __decorate([t(`document-upload-demo`)], b2);
document.body.innerHTML = `<document-upload-demo></document-upload-demo>`;
export {
  b2 as DocumentUploadDemo
};
//# sourceMappingURL=3-4-document-upload.js.map
