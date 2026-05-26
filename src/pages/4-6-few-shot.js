import { Button as e, __decorate as t, i18n as n, r, t$1 as i, x as a } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import { AgentInterface as o, getModel as s } from "../workshop-runtime/AgentRuntime.js";
import "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as c } from "../workshop-runtime/DemoBase.js";
import "../workshop-runtime/ProxyClient.js";
import { AgentSession as l } from "../workshop-runtime/AgentSession.js";
let u = class extends c {
  constructor() {
    (super(),
      (this.headerTitle = n(`少樣本提示:提供範例`)),
      (this.sectionId = `4.6`),
      (this.selectedExample = ``),
      (this.shotCount = 0),
      (this.isRunning = !1),
      (this.examples = [
        {
          id: `sentiment`,
          name: `產品評論情緒`,
          description: `穩定分析情緒`,
          testData: `旅館很乾淨，但員工很沒禮貌`,
          zeroShot: {
            systemPrompt: `你是一位情緒分析助理。`,
            prompt: `請判斷這句話的情緒:旅館很乾淨，但員工很沒禮貌`,
          },
          oneShot: {
            systemPrompt: `你是一位情緒分析助理。`,
            prompt: `請根據這個範例分析情緒:

評論: "食物很好，但服務很糟"
情緒: 混合（正面:食物；負面:服務）

評論: "旅館很乾淨，但員工很沒禮貌"
情緒:`,
          },
          threeShot: {
            systemPrompt: `你是一位情緒分析助理。`,
            prompt: `請根據這些範例分析情緒:

評論: "食物很好，但服務很糟"
情緒: 混合（正面:食物；負面:服務）

評論: "從開始到結束一切都很完美"
情緒: 正面（各方面都正面）

評論: "等很久，食物也是冷的"
情緒: 負面（等待時間、食物品質）

評論: "旅館很乾淨，但員工很沒禮貌"
情緒:`,
          },
        },
        {
          id: `thankyou`,
          name: `感謝卡`,
          description: `寫出風格一致的感謝卡`,
          testData: `Bob 叔叔送的廚房刀具`,
          zeroShot: {
            systemPrompt: `你是一位溫暖、具體、自然的感謝卡寫作助理。`,
            prompt: `請為 Bob 叔叔送的結婚禮物「廚房刀具」寫一張感謝卡。`,
          },
          oneShot: {
            systemPrompt: `你是一位溫暖、具體、自然的感謝卡寫作助理。`,
            prompt: `請參考這個範例，寫出同樣溫暖、具體的感謝卡：

禮物：Mary 阿姨送的毛毯
感謝卡：親愛的 Mary 阿姨，謝謝你送我們這條漂亮的毛毯！我們已經把它放在客廳沙發上，整個房間都變得更溫暖。婚禮那天能見到你，我們真的很開心。愛你的 Sarah 和 Tom

禮物：Bob 叔叔送的廚房刀具
感謝卡：`,
          },
          threeShot: {
            systemPrompt: `你是一位溫暖、具體、自然的感謝卡寫作助理。`,
            prompt: `請依照下列範例的語氣與具體程度，寫出一張感謝卡：

禮物：Mary 阿姨送的毛毯
感謝卡：親愛的 Mary 阿姨，謝謝你送我們這條漂亮的毛毯！我們已經把它放在客廳沙發上，整個房間都變得更溫暖。婚禮那天能見到你，我們真的很開心。愛你的 Sarah 和 Tom

禮物：Johnson 夫婦送的紅酒杯
感謝卡：親愛的 Johnson 先生與太太，謝謝你們送我們這組優雅的紅酒杯！我們已經迫不及待想在第一次邀朋友來家裡吃飯時使用它。你們來參加婚禮，對我們意義重大。溫暖地祝福你們，Sarah 和 Tom

禮物：表妹 Lisa 送的相簿
感謝卡：親愛的 Lisa，謝謝你送我們這本貼心的相簿！我們很期待把新生活的回憶一頁一頁放進去。能和你一起慶祝這一天，真的很特別。愛你的 Sarah 和 Tom

禮物：Bob 叔叔送的廚房刀具
感謝卡：`,
          },
        },
        {
          id: `expense`,
          name: `費用分類`,
          description: `穩定分類費用`,
          testData: `在義大利餐廳與客戶午餐`,
          zeroShot: {
            systemPrompt: `你是一位協助分類費用的助理。`,
            prompt: `請分類這筆費用：在義大利餐廳與客戶午餐`,
          },
          oneShot: {
            systemPrompt: `你是一位協助分類費用的助理。`,
            prompt: `請根據這個範例分類費用:

費用："搭計程車去機場"
類別：交通

費用："在義大利餐廳與客戶午餐"
類別：`,
          },
          threeShot: {
            systemPrompt: `你是一位協助分類費用的助理。`,
            prompt: `請根據這些範例分類費用：

費用："搭計程車去機場"
類別：交通

費用："專案結束後和團隊聚餐"
類別：團隊活動

費用："和潛在客戶喝咖啡"
類別：業務開發

費用："在義大利餐廳與客戶午餐"
類別：`,
          },
        },
        {
          id: `specs`,
          name: `產品規格抽取`,
          description: `用 JSON 格式抽取規格`,
          testData: `Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
          zeroShot: {
            systemPrompt: `你是一位產品規格抽取助理。`,
            prompt: `請抽取規格: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
          },
          oneShot: {
            systemPrompt: `你是一位產品規格抽取助理。`,
            prompt: `請從下列文字抽取技術規格，並用 JSON 格式輸出。

<EXAMPLE>
輸入: Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol

輸出:
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

輸入: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

輸出:`,
          },
          threeShot: {
            systemPrompt: `你是一位產品規格抽取助理。`,
            prompt: `請從下列文字抽取技術規格，並用 JSON 格式輸出。

<EXAMPLE>
輸入: Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol
輸出:
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

<EXAMPLE>
輸入: iPhone 14 Pro, A16 Bionic chip, 6GB RAM, 256GB storage, Deep Purple
輸出:
{
  "product": "iPhone 14 Pro",
  "chip": "A16 Bionic",
  "ram": "6GB",
  "storage": "256GB",
  "color": "Deep Purple"
}
</EXAMPLE>

<EXAMPLE>
輸入: Samsung Galaxy S23, Snapdragon 8 Gen 2, 8GB memory, 512GB capacity, Green
輸出:
{
  "product": "Samsung Galaxy S23",
  "processor": "Snapdragon 8 Gen 2",
  "memory": "8GB",
  "capacity": "512GB",
  "color": "Green"
}
</EXAMPLE>

輸入: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

輸出:`,
          },
        },
      ]),
      n(`Run`) === `Run` &&
        ((this.headerTitle = `Few-Shot Prompting: Teach with Examples`),
        (this.examples = [
          {
            id: `sentiment`,
            name: `Review sentiment`,
            description: `Make sentiment labels more consistent`,
            testData: `The hotel was clean, but the staff was rude`,
            zeroShot: {
              systemPrompt: `You are a sentiment analysis assistant.`,
              prompt: `Classify the sentiment: The hotel was clean, but the staff was rude`,
            },
            oneShot: {
              systemPrompt: `You are a sentiment analysis assistant.`,
              prompt: `Use the example, then classify the new review.\n\nReview: The food was great, but the service was awful.\nSentiment: mixed (positive: food; negative: service)\n\nReview: The hotel was clean, but the staff was rude.\nSentiment:`,
            },
            threeShot: {
              systemPrompt: `You are a sentiment analysis assistant.`,
              prompt: `Use the examples, then classify the new review.\n\nReview: The food was great, but the service was awful.\nSentiment: mixed (positive: food; negative: service)\n\nReview: Everything was perfect from start to finish.\nSentiment: positive\n\nReview: We waited forever and the food was cold.\nSentiment: negative\n\nReview: The hotel was clean, but the staff was rude.\nSentiment:`,
            },
          },
          {
            id: `thankyou`,
            name: `Thank-you note`,
            description: `Keep a consistent writing style`,
            testData: `Kitchen knives from Uncle Bob`,
            zeroShot: {
              systemPrompt: `You are a helpful writing assistant.`,
              prompt: `Write a thank-you note for: kitchen knives from Uncle Bob`,
            },
            oneShot: {
              systemPrompt: `You are a helpful writing assistant.`,
              prompt: `Example:\nGift: watercolor set from Aunt May\nNote: Dear Aunt May, thank you for the beautiful watercolor set. I have already started using it, and it makes painting feel even more fun.\n\nGift: kitchen knives from Uncle Bob\nNote:`,
            },
            threeShot: {
              systemPrompt: `You are a helpful writing assistant.`,
              prompt: `Write in the same warm, specific style as these examples.\n\nGift: watercolor set from Aunt May\nNote: Dear Aunt May, thank you for the beautiful watercolor set. I have already started using it, and it makes painting feel even more fun.\n\nGift: cookbook from Grandma\nNote: Dear Grandma, thank you for the cookbook. I love that you picked recipes we can try together.\n\nGift: scarf from Sam\nNote: Dear Sam, thank you for the soft scarf. It is exactly what I needed for chilly mornings.\n\nGift: kitchen knives from Uncle Bob\nNote:`,
            },
          },
          {
            id: `expense`,
            name: `Expense category`,
            description: `Classify expenses consistently`,
            testData: `Client lunch at an Italian restaurant`,
            zeroShot: {
              systemPrompt: `You categorize business expenses.`,
              prompt: `Categorize this expense: client lunch at an Italian restaurant`,
            },
            oneShot: {
              systemPrompt: `You categorize business expenses.`,
              prompt: `Example: taxi to airport -> travel\nExpense: client lunch at an Italian restaurant ->`,
            },
            threeShot: {
              systemPrompt: `You categorize business expenses.`,
              prompt: `Examples:\nTaxi to airport -> travel\nHotel for conference -> lodging\nDinner with client -> meals and entertainment\nExpense: client lunch at an Italian restaurant ->`,
            },
          },
          {
            id: `specs`,
            name: `Product spec extraction`,
            description: `Extract specs as JSON`,
            testData: `Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
            zeroShot: {
              systemPrompt: `You extract product specifications.`,
              prompt: `Extract specs from: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
            },
            oneShot: {
              systemPrompt: `You extract product specifications as JSON.`,
              prompt: `Example input: Google Nest Wifi, network speed up to 1200Mbps, 2.4GHz and 5GHz frequencies, WPA3 protocol\nExample output: {"product":"Google Nest Wifi","speed":"1200Mbps","frequencies":["2.4GHz","5GHz"],"protocol":"WPA3"}\n\nInput: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass\nOutput:`,
            },
            threeShot: {
              systemPrompt: `You extract product specifications as JSON.`,
              prompt: `Use the examples to extract product specs as JSON.\n\nInput: Google Nest Wifi, network speed up to 1200Mbps, 2.4GHz and 5GHz frequencies, WPA3 protocol\nOutput: {"product":"Google Nest Wifi","speed":"1200Mbps","frequencies":["2.4GHz","5GHz"],"protocol":"WPA3"}\n\nInput: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass\nOutput:`,
            },
          },
        ])),
      (this.session = this.createSession()),
      (this.agentInterface = new o()),
      (this.agentInterface.session = this.session),
      (this.agentInterface.enableAttachments = !1),
      (this.agentInterface.enableModelSelector = !0),
      (this.agentInterface.enableThinking = !1),
      (this.agentInterface.style.width = `100%`),
      (this.agentInterface.style.height = `100%`));
  }
  createSession(model = this.session?.state?.model ?? s(`openai-codex`, `gpt-5.4-mini`)) {
    const e = new l();
    e.setModel(model);
    return e;
  }
  attachFreshSession(e) {
    const t = this.session?.state?.model ?? s(`openai-codex`, `gpt-5.4-mini`);
    this.session?.abort();
    this.session = this.createSession(t);
    this.session.setSystemPrompt(e);
    this.agentInterface.session = this.session;
    this.agentInterface.setupSessionSubscription?.();
    this.agentInterface?._streamingContainer?.setMessage?.(null, !0);
    this.agentInterface?.requestUpdate?.();
  }
  async runExample(e, t) {
    if (this.isRunning) this.session.abort();
    ((this.selectedExample = e.id), (this.shotCount = t), (this.isRunning = !0));
    let n = t === 0 ? e.zeroShot : t === 1 ? e.oneShot : e.threeShot;
    (this.attachFreshSession(n.systemPrompt),
      this.requestUpdate(),
      await this.updateComplete,
      await new Promise((e) => requestAnimationFrame(e)));
    try {
      await this.agentInterface.sendMessage(n.prompt);
    } finally {
      this.isRunning = !1;
    }
  }
  renderContentPanel() {
    return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">${n(`Run`) === `Run` ? `See how examples improve consistency and accuracy.` : `看看提供範例如何提升一致性與準確度。`}</p>

				<div class="space-y-2">
					${this.examples.map(
            (t) => a`
							<div class="p-3 rounded-md border border-border">
								<div class="font-medium text-sm text-foreground mb-1">${t.name}</div>
								<div class="text-xs text-muted-foreground mb-2">
									${t.description} • ${n(`測試`)}:"${t.testData.substring(0, 50) + (t.testData.length > 50 ? `...` : ``)}"
								</div>
								<div class="flex gap-2">
									${e({ variant: this.selectedExample === t.id && this.shotCount === 0 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, 0), children: `${n(`Run`) === `Run` ? `Zero-shot` : `零樣本`}`, disabled: this.isRunning })}
									${e({ variant: this.selectedExample === t.id && this.shotCount === 1 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, 1), children: `${n(`Run`) === `Run` ? `One example` : `單一範例`}`, disabled: this.isRunning })}
									${e({ variant: this.selectedExample === t.id && this.shotCount === 3 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t, 3), children: `${n(`Run`) === `Run` ? `Three examples` : `三個範例`}`, disabled: this.isRunning })}
								</div>
							</div>
						`,
          )}
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
		</div>`;
  }
};
(t([r()], u.prototype, `selectedExample`, void 0),
  t([r()], u.prototype, `shotCount`, void 0),
  t([r()], u.prototype, `isRunning`, void 0),
  (u = t([i(`few-shot-demo`)], u)),
  (document.body.innerHTML = `<few-shot-demo></few-shot-demo>`));
export { u as FewShotDemo };
