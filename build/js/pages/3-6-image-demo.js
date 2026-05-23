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
  m
} from "../chunks/chunk-UHFKU6VN.js";
import {
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/pages/3-6-image-demo.js
var p = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`When You Upload Images`);
    this.sectionId = `3.6`;
    this.loadingImage = false;
    this.selectedImage = ``;
    this.selectedPrompt = ``;
    this.imageTests = [
      {
        id: `ccocr-form-project-name`,
        name: i18n(`CC-OCR\uFF1A\u6383\u63CF\u8868\u55AE\u4EBA\u540D`),
        file: `ccocr-form-project-name.jpg`,
        prompts: [
          {
            text: i18n(`\u9019\u4EFD\u8868\u55AE\u6700\u4E0B\u65B9 Copies of Confirmation Letter To \u6709\u54EA\u4E9B\u4EBA\u540D\uFF1F\u8ACB\u5B8C\u6574\u5217\u51FA\u3002`),
            source: i18n(`\u53C3\u8003\u7B54\u6848\uFF08\u4F9D CC-OCR \u5716\u9762\u6A19\u8A3B\u6574\u7406\uFF09`),
            answer: i18n(`Mary Cloutier
Joyce Beaby
BOB JOHNSON
ANNA MARIE HENSCHKE
N/A
MARY BOWDISH
GARY PHELPS
Lisa Drum

\u6559\u5B78\u91CD\u9EDE\uFF1A\u4F4E\u54C1\u8CEA\u6383\u63CF\u7684\u4EBA\u540D\u5F88\u5BB9\u6613\u88AB\u6A21\u578B\u8B80\u6210\u770B\u8D77\u4F86\u5408\u7406\u3001\u4F46\u62FC\u5B57\u932F\u8AA4\u7684\u540D\u5B57\u3002`)
          }
        ]
      },
      {
        id: `ccocr-table-drink-menu`,
        name: i18n(`CC-OCR\uFF1A\u624B\u6A5F\u62CD\u651D\u4E2D\u6587\u8868\u683C`),
        file: `ccocr-table-drink-menu.jpg`,
        prompts: [
          {
            text: i18n(`\u8ACB\u8B80\u300C\u8292\u679C\u6B50\u857E\u300D\u9019\u4E00\u5217\uFF1A\u914D\u6599\u8207\u505A\u6CD5\u5206\u5225\u5BEB\u4EC0\u9EBC\uFF1F\u8ACB\u4E0D\u8981\u81C6\u6E2C\u3002`),
            source: i18n(`\u53C3\u8003\u7B54\u6848\uFF08\u4F9D CC-OCR \u5716\u9762\u6A19\u8A3B\u6574\u7406\uFF09`),
            answer: i18n(`\u914D\u6599\uFF1A\u534A\u52FA\u849F\u84BB
\u51B7\u71B1\uFF1AC
\u505A\u6CD5\uFF1A\u51B0\u6C99\u6A5F\u4E2D\uFF1B5 \u5319\u5976\u7C89 + \u8292\u679C\u91AC 1 \u5319\u534A + \u679C\u7CD6 14g + 220cc \u71B1\u6C34\u652A\u62CC\u5747\u52FB

\u6559\u5B78\u91CD\u9EDE\uFF1A\u6A21\u578B\u5E38\u628A\u300C\u849F\u84BB\u300D\u8AA4\u8B80\u6210\u5176\u4ED6\u5B57\uFF0C\u6216\u628A\u76F8\u9130\u5217\u7684\u51B0\u6C99\u914D\u65B9\u6DF7\u9032\u4F86\u3002`)
          },
          {
            text: i18n(`\u300C\u91D1\u6854\u6AB8\u6AAC\u300D\u71B1\u98F2\u8207\u51B7\u98F2\u7684\u914D\u65B9\u5404\u662F\u4EC0\u9EBC\uFF1F\u8ACB\u5206\u958B\u56DE\u7B54\u3002`),
            source: i18n(`\u53C3\u8003\u7B54\u6848\uFF08\u4F9D CC-OCR \u5716\u9762\u6A19\u8A3B\u6574\u7406\uFF09`),
            answer: i18n(`\u71B1\u98F2\uFF1A\u6AB8\u6AAC\u6C41 1 \u76CE + \u679C\u7CD6 38g + \u9BAE\u6854\u58D3\u6C41 1 \u9846 + \u71B1\u6C34 8 \u5206 + \u7D05\u8336 1 \u5206
\u51B7\u98F2\uFF1A\u6AB8\u6AAC 1.5 \u76CE + \u679C\u7CD6 55g + \u9BAE\u6854\u58D3\u6C41 2 \u9846\uFF1B\u96EA\u514B\u676F\u52A0\u51B0 7 \u5206\u6EFF + RO \u6C34\u81F3 9 \u5206\uFF0C\u9802\u52A0 1 \u5206\u7D05\u8336

\u6559\u5B78\u91CD\u9EDE\uFF1A\u6A21\u578B\u53EF\u80FD\u8B80\u5C0D\u5927\u610F\uFF0C\u537B\u628A\u7E41\u9AD4\u5B57\u3001\u55AE\u4F4D\u6216\u6B65\u9A5F\u6587\u5B57\u8F49\u6210\u4E0D\u7CBE\u78BA\u7684\u7248\u672C\u3002`)
          }
        ]
      },
      {
        id: `ccocr-blueprint-pump-cross-section`,
        name: i18n(`CC-OCR\uFF1A\u5DE5\u7A0B\u5716\u6A19\u984C\u6B04`),
        file: `ccocr-blueprint-pump-cross-section.jpg`,
        prompts: [
          {
            text: i18n(
              `\u8ACB\u8B80\u6A19\u984C\u6B04\uFF1A\u516C\u53F8\u540D\u7A31\u3001\u6A19\u984C\u3001\u5716\u865F\u3001\u578B\u865F\u3001\u7248\u672C\u3001\u9801\u78BC\u5206\u5225\u662F\u4EC0\u9EBC\uFF1F\u8ACB\u9010\u6B04\u56DE\u7B54\uFF0C\u4E0D\u8981\u6539\u5BEB\u3002`
            ),
            source: i18n(`\u8CC7\u6599\u96C6\u53C3\u8003\u7B54\u6848\uFF08CC-OCR blueprint_qa / \u5716\u9762\u6A19\u984C\u6B04\uFF09`),
            answer: i18n(`\u516C\u53F8\u540D\u7A31\uFF1A\u6F84\u5CB3\u7701\u7693\u6708\u5DE5\u4E1A\u80A1\u4EFD\u6709\u9650\u516C\u53F8
\u6A19\u984C\uFF1A\u5C0F\u578B\u79BB\u5FC3\u6C34\u6CF5\u5256\u9762\u56FE
\u5716\u865F\uFF1ATJ5-1070186
\u578B\u865F\uFF1AMT-3T579G
\u7248\u672C\uFF1ARev.5
\u9801\u78BC\uFF1A2/8

\u6559\u5B78\u91CD\u9EDE\uFF1A\u9019\u984C\u4E0D\u662F\u53EA\u770B\u6A21\u578B\u80FD\u4E0D\u80FD\u8B80\u5B57\uFF0C\u800C\u662F\u770B\u5B83\u6703\u4E0D\u6703\u6F0F\u6389\u300C\u6C34\u300D\u9019\u7A2E\u5C0F\u4F46\u95DC\u9375\u7684\u5B57\u3002`)
          },
          {
            text: i18n(`\u8ACB\u5728\u8CC7\u8A0A\u6B04\u5168\u90E8\u63CF\u8FF0\u4E2D\u62FC\u51FA\u9019\u4EFD\u5716\u7D19\u6700\u56B4\u8B39\u7684\u5B8C\u6574\u4E2D\u6587\u540D\u7A31\u3002\u53EA\u56DE\u7B54\u540D\u7A31\u3002`),
            source: i18n(
              `\u8CC7\u6599\u96C6\u53C3\u8003\u7B54\u6848\uFF08CC-OCR blueprint_qa/answer/vqa_blueprint_100/10af6edcb983.txt\uFF09`
            ),
            answer: i18n(`\u5C0F\u578B\u79BB\u5FC3\u6C34\u6CF5\u5256\u9762\u56FE

\u6559\u5B78\u91CD\u9EDE\uFF1Agpt-5.4-mini thinking off \u66FE\u56DE\u7B54\u300C\u5C0F\u578B\u96E2\u5FC3\u6CF5\u5256\u9762\u5716\u300D\uFF0C\u5C11\u4E86\u300C\u6C34\u300D\u3002\u7B54\u6848\u770B\u8D77\u4F86\u901A\u9806\uFF0C\u4F46\u4E0D\u662F\u8CC7\u6599\u96C6\u6A19\u8A3B\u7684\u6B63\u5F0F\u540D\u7A31\u3002`)
          },
          {
            text: i18n(
              `\u53F3\u5074\u300C\u96F6\u90E8\u4EF6\u660E\u7D30\u8868\u300D\u7B2C 04\u300105 \u5217\uFF1A\u540D\u7A31\u3001\u4EF6\u865F\u3001\u6578\u91CF\u3001\u6750\u6599\u3001\u898F\u683C\u3001\u5099\u8A3B\u3001\u8173\u6CE8\u5206\u5225\u662F\u4EC0\u9EBC\uFF1F\u8ACB\u4FDD\u7559\u624B\u5BEB\u8A3B\u8A18\u3002`
            ),
            source: i18n(`\u53C3\u8003\u7B54\u6848\uFF08\u4F9D CC-OCR \u5716\u9762\u6A19\u8A3B\u6574\u7406\uFF09`),
            answer: i18n(`04\uFF1A\u540D\u7A31 \u652F\u67B6\uFF1B\u4EF6\u865F FK39972H\uFF1B\u6578\u91CF 4\uFF1B\u6750\u6599 Q235\uFF1B\u898F\u683C 20x40\uFF1B\u5099\u8A3B \u624B\u5BEB\u300C\u52A0\u786C\u300D\uFF1B\u8173\u6CE8 \u2020
05\uFF1A\u540D\u7A31 \u87BA\u91D8\uFF1B\u4EF6\u865F 956802G9\uFF1B\u6578\u91CF 3*\uFF08\u624B\u5BEB\u8A3B\u8A18\uFF09\uFF1B\u6750\u6599 SS316\uFF1B\u898F\u683C M6x20\uFF1B\u5099\u8A3B \u7A7A\u767D\uFF1B\u8173\u6CE8 \u7A7A\u767D

\u6559\u5B78\u91CD\u9EDE\uFF1A\u5DE5\u7A0B\u5716\u5E38\u6DF7\u5408\u5370\u5237\u5B57\u3001\u624B\u5BEB\u8A3B\u8A18\u3001\u7B26\u865F\u8173\u6CE8\u3002\u6A21\u578B\u5373\u4F7F\u5927\u81F4\u8B80\u5C0D\uFF0C\u4E5F\u9700\u8981\u4EBA\u5DE5\u6838\u5C0D\u6B04\u4F4D\u5C0D\u9F4A\u3002`)
          }
        ]
      }
    ];
    this.session = new o();
    this.session.setSystemPrompt(
      i18n(`\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u6790\u5716\u7247\u7684\u52A9\u7406\u3002\u8ACB\u6E96\u78BA\u63CF\u8FF0\u4F60\u770B\u5230\u7684\u5167\u5BB9\uFF0C\u4E26\u6839\u64DA\u5F71\u50CF\u56DE\u7B54\u554F\u984C\u3002`)
    );
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
  }
  getPromptText(e) {
    return typeof e === `string` ? e : e.text;
  }
  async loadImageWithPrompt(e, t2) {
    if (this.loadingImage) return;
    const n = this.getPromptText(t2);
    if (this.selectedImage !== e.id) this.session.clearMessages();
    this.loadingImage = true;
    this.selectedImage = e.id;
    this.selectedPrompt = n;
    try {
      if (this.session.state.messages.some(
        (t3) => t3.role === `user` && Array.isArray(t3.attachments) && t3.attachments.some((t4) => t4?.type === `image` && t4?.fileName === e.file)
      )) {
        this.agentInterface.setInput(n);
      } else {
        const r2 = await (await fetch(`/data/images/${e.file}`)).blob();
        const i = await _R(r2, e.file);
        this.agentInterface.setInput(n, [i]);
      }
    } catch (t3) {
      console.error(`Failed to load image`, e.file, t3);
    } finally {
      this.loadingImage = false;
    }
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
      <div class="p-3 h-full overflow-y-auto flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">
          ${i18n(`Pick an image prompt to test the model's vision. The image will be attached automatically.`)}
        </p>
        ${this.imageTests.map(
      (e) => T(b`
          ${E(O(e.name))}
          ${A(b`
            <div class="flex items-start gap-3 mb-2">
              <img src="/data/images/${e.file}" alt="${e.name}" class="w-28 h-20 object-contain rounded border border-border bg-white p-1" />
              <div class="text-xs text-muted-foreground break-all">${e.file}</div>
            </div>
            <div class="flex flex-col gap-2">
              ${e.prompts.map((t2) => {
        const n = this.getPromptText(t2);
        const r2 = this.selectedImage === e.id && this.selectedPrompt === n;
        return b`<div>
                  <button
                    class="px-3 py-1.5 text-xs rounded-full border transition-all text-left ${r2 ? `bg-primary text-primary-foreground border-primary` : `bg-card border-border hover:bg-accent/30`}"
                    ?disabled=${this.loadingImage}
                    @click=${() => this.loadImageWithPrompt(e, t2)}
                  >
                    ${n.substring(0, 48)}${n.length > 48 ? `\u2026` : ``}
                  </button>
                  ${r2 && typeof t2 !== `string` ? b`
                    <div class="mt-2 rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed">
                      <div class="font-semibold text-foreground mb-1">${t2.source}</div>
                      <div class="whitespace-pre-wrap text-muted-foreground">${t2.answer}</div>
                    </div>
                  ` : ``}
                </div>`;
      })}
            </div>
          `)}
        `)
    )}
      </div>
    `;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
      <markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
    </div>`;
  }
};
__decorate([r()], p.prototype, `loadingImage`, void 0);
__decorate([r()], p.prototype, `selectedImage`, void 0);
__decorate([r()], p.prototype, `selectedPrompt`, void 0);
p = __decorate([t(`image-demo`)], p);
document.body.innerHTML = `<image-demo></image-demo>`;
export {
  p as ImageDemo
};
//# sourceMappingURL=3-6-image-demo.js.map
