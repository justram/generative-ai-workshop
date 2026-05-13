import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as a,getModel as o,webSearchTool as s}from"./app-C9nW8ndw.js";import{Card as c,CardContent as l,CardHeader as u,CardTitle as d,Switch as f}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as p}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as m}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as h}from"./agent-session-CtmWvP9t.js";let g=class extends m{constructor(){super(),this.headerTitle=t(`Web Search Tool - Grounding with the Web`),this.sectionId=`6.4`,this.debugLog=[],this.toolEnabled=!1,this.searchQuestions=[{question:t(`Who is Mario Zechner?`),description:t(`Niche person not in training data`)},{question:t(`Who's the CEO of MADx?`),description:t(`Recent company information`)},{question:t(`What happened in the news today?`),description:t(`Current events beyond training cutoff`)},{question:t(`What are the latest developments in large language models?`),description:t(`Recent AI research and announcements`)},{question:t(`What's the current stock price of NVIDIA?`),description:t(`Real-time financial information`)}],this.session=new h({authTokenProvider:p,debugListener:e=>{this.debugLog=[...this.debugLog,e]}}),this.session.setModel(o(`openai`,`gpt-4o-mini`)),this.updateTools(),this.agentInterface=new a,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}updateTools(){let e=this.toolEnabled?[s]:[];this.session.setTools(e),this.session.setSystemPrompt(this.toolEnabled?t(`You are a helpful assistant with access to a web search tool. Use it to find relevant information and cite sources with markdown links.`):t(`You are a helpful assistant. Answer questions based on your training data.`)),this.session.clearMessages()}async runSearch(e){e.trim()&&(this.session.clearMessages(),await this.agentInterface.sendMessage(e))}toggleTool(){this.toolEnabled=!this.toolEnabled,this.updateTools()}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return i`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${t(`See how LLMs can't access current information without search tools.`)}
				</p>

				<div class="flex-shrink-0">
					${c(i`
						${u(d(t(`Web Search Tool`)))}
						${l(i`
							<div class="flex items-center justify-between">
								<div class="text-xs text-muted-foreground">
									${this.toolEnabled?t(`LLM will search the web for current information`):t(`LLM only knows data up to training cutoff`)}
								</div>
								${f({checked:this.toolEnabled,onChange:()=>this.toggleTool()})}
							</div>
						`)}
					`)}
				</div>

				<div class="space-y-2 flex-shrink-0">
					<div class="text-xs font-medium text-muted-foreground">${t(`Example Questions:`)}</div>
					${this.searchQuestions.map(e=>i`
							<button
								@click=${()=>this.runSearch(e.question)}
								class="w-full text-left p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
							>
								<div class="text-sm font-medium text-foreground">${e.question}</div>
								<div class="text-xs text-muted-foreground mt-1">${e.description}</div>
							</button>
						`)}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto">
						<debug-view .debugLog=${this.debugLog}></debug-view>
					</div>
				</div>
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};e([n()],g.prototype,`debugLog`,void 0),e([n()],g.prototype,`toolEnabled`,void 0),g=e([r(`websearch-tool-demo`)],g),document.body.innerHTML=`<websearch-tool-demo></websearch-tool-demo>`;export{g as WebsearchToolDemo};