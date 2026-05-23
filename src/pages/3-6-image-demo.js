import { __decorate as e, i18n as t, r as n, t$1 as r, x as i } from "../mini-lit/index.js";
import { loadAttachment as a } from "../workshop-runtime/CodeBlock-SUyIenKs.js";
import { AgentInterface as o } from "../workshop-runtime/app-C9nW8ndw.js";
import {
  Card as s,
  CardContent as c,
  CardHeader as l,
  CardTitle as u,
} from "../workshop-runtime/Textarea-DCZnYrSo.js";
import "../workshop-runtime/Dialog-C7MHz9Dg.js";
import "../workshop-runtime/Input-0pADT9gU.js";
import "../workshop-runtime/auth-token-Dkh_JH49.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as d } from "../workshop-runtime/DemoBase-7724hyNv.js";
import "../workshop-runtime/proxy-client-DO8A5rUF.js";
import { AgentSession as f } from "../workshop-runtime/agent-session-CtmWvP9t.js";

let p = class extends d {
  constructor() {
    super();
    this.headerTitle = t(`When You Upload Images`);
    this.sectionId = `3.6`;
    this.loadingImage = false;
    this.selectedImage = ``;
    this.selectedPrompt = ``;
    this.imageTests = [
      {
        id: `ccocr-form-project-name`,
        name: t(`CC-OCR：掃描表單人名`),
        file: `ccocr-form-project-name.jpg`,
        prompts: [
          {
            text: t(`這份表單最下方 Copies of Confirmation Letter To 有哪些人名？請完整列出。`),
            source: t(`參考答案（依 CC-OCR 圖面標註整理）`),
            answer: t(`Mary Cloutier
Joyce Beaby
BOB JOHNSON
ANNA MARIE HENSCHKE
N/A
MARY BOWDISH
GARY PHELPS
Lisa Drum

教學重點：低品質掃描的人名很容易被模型讀成看起來合理、但拼字錯誤的名字。`),
          },
        ],
      },
      {
        id: `ccocr-table-drink-menu`,
        name: t(`CC-OCR：手機拍攝中文表格`),
        file: `ccocr-table-drink-menu.jpg`,
        prompts: [
          {
            text: t(`請讀「芒果歐蕾」這一列：配料與做法分別寫什麼？請不要臆測。`),
            source: t(`參考答案（依 CC-OCR 圖面標註整理）`),
            answer: t(`配料：半勺蒟蒻
冷熱：C
做法：冰沙機中；5 匙奶粉 + 芒果醬 1 匙半 + 果糖 14g + 220cc 熱水攪拌均勻

教學重點：模型常把「蒟蒻」誤讀成其他字，或把相鄰列的冰沙配方混進來。`),
          },
          {
            text: t(`「金桔檸檬」熱飲與冷飲的配方各是什麼？請分開回答。`),
            source: t(`參考答案（依 CC-OCR 圖面標註整理）`),
            answer: t(`熱飲：檸檬汁 1 盎 + 果糖 38g + 鮮桔壓汁 1 顆 + 熱水 8 分 + 紅茶 1 分
冷飲：檸檬 1.5 盎 + 果糖 55g + 鮮桔壓汁 2 顆；雪克杯加冰 7 分滿 + RO 水至 9 分，頂加 1 分紅茶

教學重點：模型可能讀對大意，卻把繁體字、單位或步驟文字轉成不精確的版本。`),
          },
        ],
      },
      {
        id: `ccocr-blueprint-pump-cross-section`,
        name: t(`CC-OCR：工程圖標題欄`),
        file: `ccocr-blueprint-pump-cross-section.jpg`,
        prompts: [
          {
            text: t(
              `請讀標題欄：公司名稱、標題、圖號、型號、版本、頁碼分別是什麼？請逐欄回答，不要改寫。`,
            ),
            source: t(`資料集參考答案（CC-OCR blueprint_qa / 圖面標題欄）`),
            answer: t(`公司名稱：澄岳省皓月工业股份有限公司
標題：小型离心水泵剖面图
圖號：TJ5-1070186
型號：MT-3T579G
版本：Rev.5
頁碼：2/8

教學重點：這題不是只看模型能不能讀字，而是看它會不會漏掉「水」這種小但關鍵的字。`),
          },
          {
            text: t(`請在資訊欄全部描述中拼出這份圖紙最嚴謹的完整中文名稱。只回答名稱。`),
            source: t(
              `資料集參考答案（CC-OCR blueprint_qa/answer/vqa_blueprint_100/10af6edcb983.txt）`,
            ),
            answer: t(`小型离心水泵剖面图

教學重點：gpt-5.4-mini thinking off 曾回答「小型離心泵剖面圖」，少了「水」。答案看起來通順，但不是資料集標註的正式名稱。`),
          },
          {
            text: t(
              `右側「零部件明細表」第 04、05 列：名稱、件號、數量、材料、規格、備註、腳注分別是什麼？請保留手寫註記。`,
            ),
            source: t(`參考答案（依 CC-OCR 圖面標註整理）`),
            answer:
              t(`04：名稱 支架；件號 FK39972H；數量 4；材料 Q235；規格 20x40；備註 手寫「加硬」；腳注 †
05：名稱 螺釘；件號 956802G9；數量 3*（手寫註記）；材料 SS316；規格 M6x20；備註 空白；腳注 空白

教學重點：工程圖常混合印刷字、手寫註記、符號腳注。模型即使大致讀對，也需要人工核對欄位對齊。`),
          },
        ],
      },
    ];
    this.session = new f();
    this.session.setSystemPrompt(
      t(`你是一位協助分析圖片的助理。請準確描述你看到的內容，並根據影像回答問題。`),
    );
    this.agentInterface = new o();
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

  async loadImageWithPrompt(e, t) {
    if (this.loadingImage) return;
    const n = this.getPromptText(t);
    if (this.selectedImage !== e.id) this.session.clearMessages();
    this.loadingImage = true;
    this.selectedImage = e.id;
    this.selectedPrompt = n;
    try {
      if (
        this.session.state.messages.some(
          (t) =>
            t.role === `user` &&
            Array.isArray(t.attachments) &&
            t.attachments.some((t) => t?.type === `image` && t?.fileName === e.file),
        )
      ) {
        this.agentInterface.setInput(n);
      } else {
        const r = await (await fetch(`/data/images/${e.file}`)).blob();
        const i = await a(r, e.file);
        this.agentInterface.setInput(n, [i]);
      }
    } catch (t) {
      console.error(`Failed to load image`, e.file, t);
    } finally {
      this.loadingImage = false;
    }
  }

  renderContentPanel() {
    return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }

  renderLeftDemoPanel() {
    return i`
      <div class="p-3 h-full overflow-y-auto flex flex-col gap-4">
        <p class="text-sm text-muted-foreground">
          ${t(`Pick an image prompt to test the model's vision. The image will be attached automatically.`)}
        </p>
        ${this.imageTests.map((e) =>
          s(i`
          ${l(u(e.name))}
          ${c(i`
            <div class="flex items-start gap-3 mb-2">
              <img src="/data/images/${e.file}" alt="${e.name}" class="w-28 h-20 object-contain rounded border border-border bg-white p-1" />
              <div class="text-xs text-muted-foreground break-all">${e.file}</div>
            </div>
            <div class="flex flex-col gap-2">
              ${e.prompts.map((t) => {
                const n = this.getPromptText(t);
                const r = this.selectedImage === e.id && this.selectedPrompt === n;
                return i`<div>
                  <button
                    class="px-3 py-1.5 text-xs rounded-full border transition-all text-left ${r ? `bg-primary text-primary-foreground border-primary` : `bg-card border-border hover:bg-accent/30`}"
                    ?disabled=${this.loadingImage}
                    @click=${() => this.loadImageWithPrompt(e, t)}
                  >
                    ${n.substring(0, 48)}${n.length > 48 ? `…` : ``}
                  </button>
                  ${
                    r && typeof t !== `string`
                      ? i`
                    <div class="mt-2 rounded border border-border bg-muted/40 p-3 text-xs leading-relaxed">
                      <div class="font-semibold text-foreground mb-1">${t.source}</div>
                      <div class="whitespace-pre-wrap text-muted-foreground">${t.answer}</div>
                    </div>
                  `
                      : ``
                  }
                </div>`;
              })}
            </div>
          `)}
        `),
        )}
      </div>
    `;
  }

  renderRightDemoPanel() {
    return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
      <markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
    </div>`;
  }
};

e([n()], p.prototype, `loadingImage`, void 0);
e([n()], p.prototype, `selectedImage`, void 0);
e([n()], p.prototype, `selectedPrompt`, void 0);
p = e([r(`image-demo`)], p);
document.body.innerHTML = `<image-demo></image-demo>`;
export { p as ImageDemo };
