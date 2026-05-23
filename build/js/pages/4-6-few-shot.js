import {
  o
} from "../chunks/chunk-6TTNE7IQ.js";
import {
  Pi,
  bR,
  m
} from "../chunks/chunk-QLBDILTC.js";
import {
  Button,
  __decorate,
  b,
  i18n,
  r,
  t2 as t
} from "../chunks/chunk-2NPHVPQR.js";

// src/pages/4-6-few-shot.js
var u = class extends m {
  constructor() {
    super(), this.headerTitle = i18n(`\u5C11\u6A23\u672C\u63D0\u793A\uFF1A\u63D0\u4F9B\u7BC4\u4F8B`), this.sectionId = `4.6`, this.selectedExample = ``, this.shotCount = 0, this.examples = [
      {
        id: `sentiment`,
        name: `\u7522\u54C1\u8A55\u8AD6\u60C5\u7DD2`,
        description: `\u7A69\u5B9A\u5206\u6790\u60C5\u7DD2`,
        testData: `\u65C5\u9928\u5F88\u4E7E\u6DE8\uFF0C\u4F46\u54E1\u5DE5\u5F88\u6C92\u79AE\u8C8C`,
        zeroShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u60C5\u7DD2\u5206\u6790\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u5224\u65B7\u9019\u53E5\u8A71\u7684\u60C5\u7DD2\uFF1A\u65C5\u9928\u5F88\u4E7E\u6DE8\uFF0C\u4F46\u54E1\u5DE5\u5F88\u6C92\u79AE\u8C8C`
        },
        oneShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u60C5\u7DD2\u5206\u6790\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u6839\u64DA\u9019\u500B\u7BC4\u4F8B\u5206\u6790\u60C5\u7DD2\uFF1A

\u8A55\u8AD6\uFF1A "\u98DF\u7269\u5F88\u597D\uFF0C\u4F46\u670D\u52D9\u5F88\u7CDF"
\u60C5\u7DD2\uFF1A \u6DF7\u5408\uFF08\u6B63\u9762\uFF1A\u98DF\u7269\uFF1B\u8CA0\u9762\uFF1A\u670D\u52D9\uFF09

\u8A55\u8AD6\uFF1A "\u65C5\u9928\u5F88\u4E7E\u6DE8\uFF0C\u4F46\u54E1\u5DE5\u5F88\u6C92\u79AE\u8C8C"
\u60C5\u7DD2\uFF1A`
        },
        threeShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u60C5\u7DD2\u5206\u6790\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u6839\u64DA\u9019\u4E9B\u7BC4\u4F8B\u5206\u6790\u60C5\u7DD2\uFF1A

\u8A55\u8AD6\uFF1A "\u98DF\u7269\u5F88\u597D\uFF0C\u4F46\u670D\u52D9\u5F88\u7CDF"
\u60C5\u7DD2\uFF1A \u6DF7\u5408\uFF08\u6B63\u9762\uFF1A\u98DF\u7269\uFF1B\u8CA0\u9762\uFF1A\u670D\u52D9\uFF09

\u8A55\u8AD6\uFF1A "\u5F9E\u958B\u59CB\u5230\u7D50\u675F\u4E00\u5207\u90FD\u5F88\u5B8C\u7F8E"
\u60C5\u7DD2\uFF1A \u6B63\u9762\uFF08\u5404\u65B9\u9762\u90FD\u6B63\u9762\uFF09

\u8A55\u8AD6\uFF1A "\u7B49\u5F88\u4E45\uFF0C\u98DF\u7269\u4E5F\u662F\u51B7\u7684"
\u60C5\u7DD2\uFF1A \u8CA0\u9762\uFF08\u7B49\u5F85\u6642\u9593\u3001\u98DF\u7269\u54C1\u8CEA\uFF09

\u8A55\u8AD6\uFF1A "\u65C5\u9928\u5F88\u4E7E\u6DE8\uFF0C\u4F46\u54E1\u5DE5\u5F88\u6C92\u79AE\u8C8C"
\u60C5\u7DD2\uFF1A`
        }
      },
      {
        id: `thankyou`,
        name: `\u611F\u8B1D\u5361`,
        description: `\u5BEB\u51FA\u98A8\u683C\u4E00\u81F4\u7684\u611F\u8B1D\u5361`,
        testData: `Bob \u53D4\u53D4\u9001\u7684\u5EDA\u623F\u5200\u5177`,
        zeroShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Write a thank you note for a wedding gift of kitchen knives from Uncle Bob`
        },
        oneShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Write thank you notes following this example:

Gift: Blanket from Aunt Mary
Note: Dear Aunt Mary, Thank you so much for the beautiful blanket! We've already put it on our couch and it adds such warmth to our living room. It was lovely seeing you at the wedding. Love, Sarah & Tom

Gift: Bob \u53D4\u53D4\u9001\u7684\u5EDA\u623F\u5200\u5177
Note:`
        },
        threeShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Write thank you notes following these examples:

Gift: Blanket from Aunt Mary
Note: Dear Aunt Mary, Thank you so much for the beautiful blanket! We've already put it on our couch and it adds such warmth to our living room. It was lovely seeing you at the wedding. Love, Sarah & Tom

Gift: Wine glasses from the Johnsons
Note: Dear Mr. & Mrs. Johnson, Thank you for the elegant wine glasses! We can't wait to use them for our first dinner party. Your presence at our wedding meant the world to us. Warmly, Sarah & Tom

Gift: Photo album from cousin Lisa
Note: Dear Lisa, Thank you for the thoughtful photo album! We're excited to fill it with memories from our new life together. Having you celebrate with us was so special. Love, Sarah & Tom

Gift: Bob \u53D4\u53D4\u9001\u7684\u5EDA\u623F\u5200\u5177
Note:`
        }
      },
      {
        id: `expense`,
        name: `\u8CBB\u7528\u5206\u985E`,
        description: `\u7A69\u5B9A\u5206\u985E\u8CBB\u7528`,
        testData: `\u5728\u7FA9\u5927\u5229\u9910\u5EF3\u8207\u5BA2\u6236\u5348\u9910`,
        zeroShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u985E\u8CBB\u7528\u7684\u52A9\u7406\u3002`,
          prompt: `Categorize this expense: \u5728\u7FA9\u5927\u5229\u9910\u5EF3\u8207\u5BA2\u6236\u5348\u9910`
        },
        oneShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u985E\u8CBB\u7528\u7684\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u6839\u64DA\u9019\u500B\u7BC4\u4F8B\u5206\u985E\u8CBB\u7528\uFF1A

Expense: "Taxi to airport"
\u985E\u5225\uFF1A Transportation

Expense: "\u5728\u7FA9\u5927\u5229\u9910\u5EF3\u8207\u5BA2\u6236\u5348\u9910"
\u985E\u5225\uFF1A`
        },
        threeShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u5354\u52A9\u5206\u985E\u8CBB\u7528\u7684\u52A9\u7406\u3002`,
          prompt: `Categorize expenses using these examples:

Expense: "Taxi to airport"
\u985E\u5225\uFF1A Transportation

Expense: "Dinner with team after project completion"
\u985E\u5225\uFF1A Team Building

Expense: "Coffee with potential customer"
\u985E\u5225\uFF1A Business Development

Expense: "\u5728\u7FA9\u5927\u5229\u9910\u5EF3\u8207\u5BA2\u6236\u5348\u9910"
\u985E\u5225\uFF1A`
        }
      },
      {
        id: `specs`,
        name: `\u7522\u54C1\u898F\u683C\u62BD\u53D6`,
        description: `\u7528 JSON \u683C\u5F0F\u62BD\u53D6\u898F\u683C`,
        testData: `Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
        zeroShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u7522\u54C1\u898F\u683C\u62BD\u53D6\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u62BD\u53D6\u898F\u683C\uFF1A Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`
        },
        oneShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u7522\u54C1\u898F\u683C\u62BD\u53D6\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u5F9E\u4E0B\u5217\u6587\u5B57\u62BD\u53D6\u6280\u8853\u898F\u683C\uFF0C\u4E26\u7528 JSON \u683C\u5F0F\u8F38\u51FA\u3002

<EXAMPLE>
\u8F38\u5165\uFF1A Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol

\u8F38\u51FA\uFF1A
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

\u8F38\u5165\uFF1A Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

\u8F38\u51FA\uFF1A`
        },
        threeShot: {
          systemPrompt: `\u4F60\u662F\u4E00\u4F4D\u7522\u54C1\u898F\u683C\u62BD\u53D6\u52A9\u7406\u3002`,
          prompt: `\u8ACB\u5F9E\u4E0B\u5217\u6587\u5B57\u62BD\u53D6\u6280\u8853\u898F\u683C\uFF0C\u4E26\u7528 JSON \u683C\u5F0F\u8F38\u51FA\u3002

<EXAMPLE>
\u8F38\u5165\uFF1A Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol
\u8F38\u51FA\uFF1A
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

<EXAMPLE>
\u8F38\u5165\uFF1A iPhone 14 Pro, A16 Bionic chip, 6GB RAM, 256GB storage, Deep Purple
\u8F38\u51FA\uFF1A
{
  "product": "iPhone 14 Pro",
  "chip": "A16 Bionic",
  "ram": "6GB",
  "storage": "256GB",
  "color": "Deep Purple"
}
</EXAMPLE>

<EXAMPLE>
\u8F38\u5165\uFF1A Samsung Galaxy S23, Snapdragon 8 Gen 2, 8GB memory, 512GB capacity, Green
\u8F38\u51FA\uFF1A
{
  "product": "Samsung Galaxy S23",
  "processor": "Snapdragon 8 Gen 2",
  "memory": "8GB",
  "capacity": "512GB",
  "color": "Green"
}
</EXAMPLE>

\u8F38\u5165\uFF1A Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

\u8F38\u51FA\uFF1A`
        }
      }
    ], i18n(`Run`) === `Run` && (this.headerTitle = `Few-Shot Prompting: Teach with Examples`, this.examples = [
      {
        id: `sentiment`,
        name: `Review sentiment`,
        description: `Make sentiment labels more consistent`,
        testData: `The hotel was clean, but the staff was rude`,
        zeroShot: {
          systemPrompt: `You are a sentiment analysis assistant.`,
          prompt: `Classify the sentiment: The hotel was clean, but the staff was rude`
        },
        oneShot: {
          systemPrompt: `You are a sentiment analysis assistant.`,
          prompt: `Use the example, then classify the new review.

Review: The food was great, but the service was awful.
Sentiment: mixed (positive: food; negative: service)

Review: The hotel was clean, but the staff was rude.
Sentiment:`
        },
        threeShot: {
          systemPrompt: `You are a sentiment analysis assistant.`,
          prompt: `Use the examples, then classify the new review.

Review: The food was great, but the service was awful.
Sentiment: mixed (positive: food; negative: service)

Review: Everything was perfect from start to finish.
Sentiment: positive

Review: We waited forever and the food was cold.
Sentiment: negative

Review: The hotel was clean, but the staff was rude.
Sentiment:`
        }
      },
      {
        id: `thankyou`,
        name: `Thank-you note`,
        description: `Keep a consistent writing style`,
        testData: `Kitchen knives from Uncle Bob`,
        zeroShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Write a thank-you note for: kitchen knives from Uncle Bob`
        },
        oneShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Example:
Gift: watercolor set from Aunt May
Note: Dear Aunt May, thank you for the beautiful watercolor set. I have already started using it, and it makes painting feel even more fun.

Gift: kitchen knives from Uncle Bob
Note:`
        },
        threeShot: {
          systemPrompt: `You are a helpful writing assistant.`,
          prompt: `Write in the same warm, specific style as these examples.

Gift: watercolor set from Aunt May
Note: Dear Aunt May, thank you for the beautiful watercolor set. I have already started using it, and it makes painting feel even more fun.

Gift: cookbook from Grandma
Note: Dear Grandma, thank you for the cookbook. I love that you picked recipes we can try together.

Gift: scarf from Sam
Note: Dear Sam, thank you for the soft scarf. It is exactly what I needed for chilly mornings.

Gift: kitchen knives from Uncle Bob
Note:`
        }
      },
      {
        id: `expense`,
        name: `Expense category`,
        description: `Classify expenses consistently`,
        testData: `Client lunch at an Italian restaurant`,
        zeroShot: {
          systemPrompt: `You categorize business expenses.`,
          prompt: `Categorize this expense: client lunch at an Italian restaurant`
        },
        oneShot: {
          systemPrompt: `You categorize business expenses.`,
          prompt: `Example: taxi to airport -> travel
Expense: client lunch at an Italian restaurant ->`
        },
        threeShot: {
          systemPrompt: `You categorize business expenses.`,
          prompt: `Examples:
Taxi to airport -> travel
Hotel for conference -> lodging
Dinner with client -> meals and entertainment
Expense: client lunch at an Italian restaurant ->`
        }
      },
      {
        id: `specs`,
        name: `Product spec extraction`,
        description: `Extract specs as JSON`,
        testData: `Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,
        zeroShot: {
          systemPrompt: `You extract product specifications.`,
          prompt: `Extract specs from: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`
        },
        oneShot: {
          systemPrompt: `You extract product specifications as JSON.`,
          prompt: `Example input: Google Nest Wifi, network speed up to 1200Mbps, 2.4GHz and 5GHz frequencies, WPA3 protocol
Example output: {"product":"Google Nest Wifi","speed":"1200Mbps","frequencies":["2.4GHz","5GHz"],"protocol":"WPA3"}

Input: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass
Output:`
        },
        threeShot: {
          systemPrompt: `You extract product specifications as JSON.`,
          prompt: `Use the examples to extract product specs as JSON.

Input: Google Nest Wifi, network speed up to 1200Mbps, 2.4GHz and 5GHz frequencies, WPA3 protocol
Output: {"product":"Google Nest Wifi","speed":"1200Mbps","frequencies":["2.4GHz","5GHz"],"protocol":"WPA3"}

Input: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass
Output:`
        }
      }
    ]), this.session = new o(), this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`)), this.agentInterface = new bR(), this.agentInterface.session = this.session, this.agentInterface.enableAttachments = false, this.agentInterface.enableModelSelector = true, this.agentInterface.enableThinking = false, this.agentInterface.style.width = `100%`, this.agentInterface.style.height = `100%`;
  }
  async runExample(e, t2) {
    this.selectedExample = e.id, this.shotCount = t2;
    let n = t2 === 0 ? e.zeroShot : t2 === 1 ? e.oneShot : e.threeShot;
    this.session.setSystemPrompt(n.systemPrompt), this.session.clearMessages(), await this.agentInterface.sendMessage(n.prompt);
  }
  renderContentPanel() {
    return b`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`;
  }
  renderLeftDemoPanel() {
    return b`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">${i18n(`Run`) === `Run` ? `See how examples improve consistency and accuracy.` : `\u770B\u770B\u63D0\u4F9B\u7BC4\u4F8B\u5982\u4F55\u63D0\u5347\u4E00\u81F4\u6027\u8207\u6E96\u78BA\u5EA6\u3002`}</p>

				<div class="space-y-2">
					${this.examples.map(
      (t2) => b`
							<div class="p-3 rounded-md border border-border">
								<div class="font-medium text-sm text-foreground mb-1">${t2.name}</div>
								<div class="text-xs text-muted-foreground mb-2">
									${t2.description} • ${i18n(`\u6E2C\u8A66`)}："${t2.testData.substring(0, 50) + (t2.testData.length > 50 ? `...` : ``)}"
								</div>
								<div class="flex gap-2">
									${Button({ variant: this.selectedExample === t2.id && this.shotCount === 0 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t2, 0), children: `${i18n(`Run`) === `Run` ? `Zero-shot` : `\u96F6\u6A23\u672C`}` })}
									${Button({ variant: this.selectedExample === t2.id && this.shotCount === 1 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t2, 1), children: `${i18n(`Run`) === `Run` ? `One example` : `\u55AE\u4E00\u7BC4\u4F8B`}` })}
									${Button({ variant: this.selectedExample === t2.id && this.shotCount === 3 ? `secondary` : `outline`, size: `sm`, onClick: () => this.runExample(t2, 3), children: `${i18n(`Run`) === `Run` ? `Three examples` : `\u4E09\u500B\u7BC4\u4F8B`}` })}
								</div>
							</div>
						`
    )}
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], u.prototype, `selectedExample`, void 0), __decorate([r()], u.prototype, `shotCount`, void 0), u = __decorate([t(`few-shot-demo`)], u), document.body.innerHTML = `<few-shot-demo></few-shot-demo>`;
export {
  u as FewShotDemo
};
//# sourceMappingURL=4-6-few-shot.js.map
