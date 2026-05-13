import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as c}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as l}from"./agent-session-CtmWvP9t.js";let u=class extends c{constructor(){super(),this.headerTitle=`Few-Shot Learning`,this.sectionId=`4.6`,this.selectedExample=``,this.shotCount=0,this.examples=[{id:`sentiment`,name:`Product Review Sentiment`,description:`Analyze sentiment consistently`,testData:`The hotel was clean but the staff were rude`,zeroShot:{systemPrompt:`You are a sentiment analysis assistant.`,prompt:`What's the sentiment of: The hotel was clean but the staff were rude`},oneShot:{systemPrompt:`You are a sentiment analysis assistant.`,prompt:`Analyze sentiment using this example:

Review: "Great food but terrible service"
Sentiment: Mixed (positive: food, negative: service)

Review: "The hotel was clean but the staff were rude"
Sentiment:`},threeShot:{systemPrompt:`You are a sentiment analysis assistant.`,prompt:`Analyze sentiment using these examples:

Review: "Great food but terrible service"
Sentiment: Mixed (positive: food, negative: service)

Review: "Everything was perfect from start to finish"
Sentiment: Positive (all aspects positive)

Review: "Long wait times and cold food"
Sentiment: Negative (wait time, food quality)

Review: "The hotel was clean but the staff were rude"
Sentiment:`}},{id:`thankyou`,name:`Thank You Notes`,description:`Write consistent thank you notes`,testData:`Kitchen knives from Uncle Bob`,zeroShot:{systemPrompt:`You are a helpful writing assistant.`,prompt:`Write a thank you note for a wedding gift of kitchen knives from Uncle Bob`},oneShot:{systemPrompt:`You are a helpful writing assistant.`,prompt:`Write thank you notes following this example:

Gift: Blanket from Aunt Mary
Note: Dear Aunt Mary, Thank you so much for the beautiful blanket! We've already put it on our couch and it adds such warmth to our living room. It was lovely seeing you at the wedding. Love, Sarah & Tom

Gift: Kitchen knives from Uncle Bob
Note:`},threeShot:{systemPrompt:`You are a helpful writing assistant.`,prompt:`Write thank you notes following these examples:

Gift: Blanket from Aunt Mary
Note: Dear Aunt Mary, Thank you so much for the beautiful blanket! We've already put it on our couch and it adds such warmth to our living room. It was lovely seeing you at the wedding. Love, Sarah & Tom

Gift: Wine glasses from the Johnsons
Note: Dear Mr. & Mrs. Johnson, Thank you for the elegant wine glasses! We can't wait to use them for our first dinner party. Your presence at our wedding meant the world to us. Warmly, Sarah & Tom

Gift: Photo album from cousin Lisa
Note: Dear Lisa, Thank you for the thoughtful photo album! We're excited to fill it with memories from our new life together. Having you celebrate with us was so special. Love, Sarah & Tom

Gift: Kitchen knives from Uncle Bob
Note:`}},{id:`expense`,name:`Expense Categories`,description:`Categorize expenses consistently`,testData:`Lunch with client at Italian restaurant`,zeroShot:{systemPrompt:`You are an expense categorization assistant.`,prompt:`Categorize this expense: Lunch with client at Italian restaurant`},oneShot:{systemPrompt:`You are an expense categorization assistant.`,prompt:`Categorize expenses using this example:

Expense: "Taxi to airport"
Category: Transportation

Expense: "Lunch with client at Italian restaurant"
Category:`},threeShot:{systemPrompt:`You are an expense categorization assistant.`,prompt:`Categorize expenses using these examples:

Expense: "Taxi to airport"
Category: Transportation

Expense: "Dinner with team after project completion"
Category: Team Building

Expense: "Coffee with potential customer"
Category: Business Development

Expense: "Lunch with client at Italian restaurant"
Category:`}},{id:`specs`,name:`Product Specs Extraction`,description:`Extract specifications in JSON format`,testData:`Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`,zeroShot:{systemPrompt:`You are a product specification extraction assistant.`,prompt:`Extract specs from: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass`},oneShot:{systemPrompt:`You are a product specification extraction assistant.`,prompt:`Extract the technical specifications from the text below in a JSON format.

<EXAMPLE>
INPUT: Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol

OUTPUT:
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

INPUT: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

OUTPUT:`},threeShot:{systemPrompt:`You are a product specification extraction assistant.`,prompt:`Extract the technical specifications from the text below in a JSON format.

<EXAMPLE>
INPUT: Google Nest Wifi, network speed up to 1200Mpbs, 2.4GHz and 5GHz frequencies, WP3 protocol
OUTPUT:
{
  "product": "Google Nest Wifi",
  "speed": "1200Mpbs",
  "frequencies": ["2.4GHz", "5GHz"],
  "protocol": "WP3"
}
</EXAMPLE>

<EXAMPLE>
INPUT: iPhone 14 Pro, A16 Bionic chip, 6GB RAM, 256GB storage, Deep Purple
OUTPUT:
{
  "product": "iPhone 14 Pro",
  "chip": "A16 Bionic",
  "ram": "6GB",
  "storage": "256GB",
  "color": "Deep Purple"
}
</EXAMPLE>

<EXAMPLE>
INPUT: Samsung Galaxy S23, Snapdragon 8 Gen 2, 8GB memory, 512GB capacity, Green
OUTPUT:
{
  "product": "Samsung Galaxy S23",
  "processor": "Snapdragon 8 Gen 2",
  "memory": "8GB",
  "capacity": "512GB",
  "color": "Green"
}
</EXAMPLE>

INPUT: Google Pixel 7, 5G network, 8GB RAM, Tensor G2 processor, 128GB storage, Lemongrass

OUTPUT:`}}],this.session=new l,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runExample(e,t){this.selectedExample=e.id,this.shotCount=t;let n=t===0?e.zeroShot:t===1?e.oneShot:e.threeShot;this.session.setSystemPrompt(n.systemPrompt),this.session.clearMessages(),await this.agentInterface.sendMessage(n.prompt)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">See how providing examples improves consistency and accuracy.</p>

				<div class="space-y-2">
					${this.examples.map(t=>a`
							<div class="p-3 rounded-md border border-border">
								<div class="font-medium text-sm text-foreground mb-1">${t.name}</div>
								<div class="text-xs text-muted-foreground mb-2">
									${n(`{description} • Test: "{testData}"`)(t.description,t.testData.substring(0,50)+(t.testData.length>50?`...`:``))}
								</div>
								<div class="flex gap-2">
									${e({variant:this.selectedExample===t.id&&this.shotCount===0?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,0),children:`Zero-shot`})}
									${e({variant:this.selectedExample===t.id&&this.shotCount===1?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,1),children:`One-shot`})}
									${e({variant:this.selectedExample===t.id&&this.shotCount===3?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,3),children:`Three-shot`})}
								</div>
							</div>
						`)}
				</div>
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],u.prototype,`selectedExample`,void 0),t([r()],u.prototype,`shotCount`,void 0),u=t([i(`few-shot-demo`)],u),document.body.innerHTML=`<few-shot-demo></few-shot-demo>`;export{u as FewShotDemo};