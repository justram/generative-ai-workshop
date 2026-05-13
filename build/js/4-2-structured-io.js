import{Button as e,__decorate as t,i18n as n,iconPlayLine as r,r as i,t$1 as a,x as o}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as s,getModel as c}from"./app-C9nW8ndw.js";import{Badge as l,Card as u,CardContent as d,CardHeader as f,CardTitle as p}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as m}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as h}from"./agent-session-CtmWvP9t.js";let g=class extends m{constructor(){super(),this.headerTitle=n(`Structured Input & Output`),this.sectionId=`4.2`,this.selectedFormat=``,this.feedbackExamples=[{id:`shipping`,text:n(`The product arrived late and was damaged. The packaging was terrible. I tried calling support but waited 45 minutes. When I finally got through, Sarah was very helpful and resolved my issue. Price was good though.`)},{id:`quality`,text:n(`Amazing product! Works exactly as advertised. Setup was a breeze - took less than 5 minutes. The build quality feels premium. My only complaint is the price point, but honestly it's worth it for the quality you get.`)},{id:`service`,text:n(`Ordered on Monday, arrived Wednesday as promised. Product works but the instructions were confusing. Had to watch YouTube videos to figure it out. Customer service chat was instant and helpful. Would be 5 stars with better documentation.`)}],this.approaches=[{id:`unstructured`,name:n(`A. Unstructured (Bad)`),description:n(`Vague prompt, unpredictable output`),systemPrompt:n(`You are a helpful assistant that analyzes customer feedback.`),prompt:`${n(`Analyze these customer reviews:`)}\n\n${this.feedbackExamples.map(e=>e.text).join(`

`)}`},{id:`semi-structured`,name:n(`B. Semi-Structured (Better)`),description:n(`Some structure, but still prose-based`),systemPrompt:n(`You are a helpful assistant that analyzes customer feedback. Provide clear analysis with specific sections.`),prompt:`Analyze the customer feedback below. For each review, provide a summary that includes the main sentiment and key points.\n\nReview 1: ${this.feedbackExamples[0].text}\n\nReview 2: ${this.feedbackExamples[1].text}\n\nReview 3: ${this.feedbackExamples[2].text}`},{id:`fully-structured`,name:n(`C. Fully Structured (Best)`),description:n(`Clear delimiters, structured output format`),systemPrompt:n(`You are a customer feedback analyst. Extract specific data points from reviews in the requested format.`),prompt:`Analyze the customer feedback below. Each review is delimited by triple quotes.

REVIEW 1:
"""
${this.feedbackExamples[0].text}
"""

REVIEW 2:
"""
${this.feedbackExamples[1].text}
"""

REVIEW 3:
"""
${this.feedbackExamples[2].text}
"""

For each review, output in this exact format:

Review 1:
- Sentiment: positive/negative/mixed
- Issues: list each problem, or "none"
- Positives: list good points, or "none"
- Employee mentioned: name or "none"
- Priority action: most important thing to fix, or "none needed"`}],this.session=new h,this.session.setModel(c(`openai`,`gpt-4o-mini`)),this.agentInterface=new s,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runApproach(e){this.selectedFormat=e.id,this.session.setSystemPrompt(e.systemPrompt),this.session.clearMessages(),await this.agentInterface.sendMessage(e.prompt)}renderContentPanel(){return o`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return o`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`Compare how different prompting approaches handle the same customer feedback data.`)}
				</p>

				${u(o`
					${f(p(n(`Customer Feedback Samples`)))}
					${d(o`
						<div class="space-y-3">
							${this.feedbackExamples.map((e,t)=>o`
									<div class="text-xs">
										<div class="font-semibold text-foreground mb-1">${n(`Review {idx}:`)(t+1)}</div>
										<div class="text-muted-foreground pl-2">${e.text}</div>
									</div>
								`)}
						</div>
					`)}
				`)}
				${this.approaches.map(t=>u(o`
						${f(p(o`${t.name}
								${this.selectedFormat===t.id?l(n(`Active`),`secondary`,`ml-2`):``}`))}
						${d(o`
							<div class="text-xs text-muted-foreground mb-3">${t.description}</div>
							${e({variant:this.selectedFormat===t.id?`default`:`secondary`,size:`sm`,onClick:async()=>{try{await this.runApproach(t)}catch(e){console.error(`Failed to run approach`,e)}},children:o`${r(`sm`)}<span class="ml-1">${n(`Run This Approach`)}</span>`})}
						`)}
					`))}
			</div>
		`}renderRightDemoPanel(){return o`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
			</div>
		`}};t([i()],g.prototype,`selectedFormat`,void 0),g=t([a(`structured-io-demo`)],g),document.body.innerHTML=`<structured-io-demo></structured-io-demo>`;export{g as StructuredIODemo};