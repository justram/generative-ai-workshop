import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as c}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as l}from"./agent-session-CtmWvP9t.js";import{COMPANY_NAME as u,PRODUCT_NAME as d}from"./demo-company-config-DwX2XOme.js";let f=class extends c{constructor(){super(),this.headerTitle=n(`Natural Language Processing Tasks`),this.sectionId=`4.5`,this.selectedTask=``,this.defaultText=`${u} has announced significant growth in their latest quarter. The company stated that their flagship product ${d} has seen a 35% increase in adoption among customers. "We're extremely pleased with these results," the CEO said during the quarterly earnings call. The positive momentum is expected to continue through Q4, with new partnerships driving further expansion.`,this.nlpTasks=[{id:`translate`,name:n(`Translation`),prompt:n(`Translate to German:`),sampleInput:this.defaultText},{id:`summarize`,name:n(`Summarization`),prompt:n(`Summarize in one sentence:`),sampleInput:this.defaultText},{id:`paraphrase`,name:n(`Paraphrasing`),prompt:n(`Paraphrase this text (keep the same meaning but use different words):`),sampleInput:n(`Our staff members have diverse professional backgrounds and bring unique perspectives to the team.`)},{id:`improve`,name:n(`Style Improvement`),prompt:n(`Improve the writing style (make it more professional and polished):`),sampleInput:n(`The meeting was ok i guess. We talked about the new project and stuff. People seemed interested but who knows. We should probably meet again next week or something to figure out the details.`)},{id:`ner`,name:n(`Named Entity Recognition`),prompt:`Extract all entities from this text and categorize them:
- People (with titles if mentioned)
- Companies
- Products
- Locations
- Percentages/Numbers
- Dates/Times

Text:`,sampleInput:this.defaultText},{id:`sentiment`,name:n(`Sentiment Analysis`),prompt:n(`Analyze the sentiment of this text. Rate it on a scale from -1 (very negative) to 1 (very positive) and explain why:`),sampleInput:n(`The new software update is a disaster. Nothing works as expected, the UI is confusing, and it crashes constantly. We've lost hours of work. This is completely unacceptable for a professional tool.`)},{id:`classify`,name:n(`Text Classification`),prompt:`Classify this customer feedback into one of these categories:
- Bug Report
- Feature Request
- Complaint
- Praise
- Question

Feedback:`,sampleInput:n(`The export function doesn't work when I try to save files larger than 100MB. It just hangs and eventually times out. This is blocking our deployment.`)},{id:`keywords`,name:n(`Keyword Extraction`),prompt:n(`Extract the 5 most important keywords or phrases from this text:`),sampleInput:this.defaultText},{id:`simplify`,name:n(`Simplification`),prompt:n(`Explain this text in simple terms that a 10-year-old could understand:`),sampleInput:n(`Quantum computing leverages quantum mechanical phenomena such as superposition and entanglement to perform computations that would be intractable for classical computers.`)},{id:`formal`,name:n(`Formalization`),prompt:n(`Rewrite this in formal, academic language:`),sampleInput:n(`Hey! Just wanted to let you know that we found some cool stuff in our research. Basically, when you heat up the material, it gets way stronger. Pretty neat, right?`)},{id:`bullets`,name:n(`Bullet Points`),prompt:n(`Convert this text into clear bullet points:`),sampleInput:this.defaultText}],this.session=new l,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.session.setSystemPrompt(`You are a helpful assistant specialized in natural language processing tasks.
Complete each task precisely as requested, maintaining accuracy and appropriate formatting.`),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runTask(e){this.selectedTask=e.id;let t=e.sampleInput.trim();this.session.clearMessages(),await this.agentInterface.sendMessage(`${e.prompt}\n\n${t}`)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`Explore how LLMs handle various natural language processing tasks out of the box.`)}
				</p>

				<div class="space-y-2">
					${this.nlpTasks.map(t=>a`
							<div class="flex items-center justify-between p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
								<div class="flex-1 min-w-0 mr-2">
									<div class="font-medium text-sm text-foreground">${t.name}</div>
									<div class="text-xs text-muted-foreground truncate">
										${t.prompt.substring(0,50)}${t.prompt.length>50?`...`:``}
									</div>
								</div>
								${e({variant:this.selectedTask===t.id?`secondary`:`outline`,size:`sm`,onClick:()=>this.runTask(t),children:n(`Run`)})}
							</div>
						`)}
				</div>
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],f.prototype,`selectedTask`,void 0),f=t([i(`nlp-tasks-demo`)],f),document.body.innerHTML=`<nlp-tasks-demo></nlp-tasks-demo>`;export{f as NLPTasksDemo};