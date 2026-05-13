import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getCurrentTimeTool as s,getModel as c}from"./app-C9nW8ndw.js";import{Card as l,CardContent as u,CardHeader as d,CardTitle as f,Switch as p}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as m}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as h}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as g}from"./agent-session-CtmWvP9t.js";let _=class extends h{constructor(){super(),this.headerTitle=n(`Date/Time Tool - Real-Time Awareness`),this.sectionId=`6.3`,this.debugLog=[],this.toolEnabled=!1,this.dateQuestions=[{question:n(`What day is it today?`),description:n(`LLMs have no real-time awareness`)},{question:n(`How many days until the end of the month?`),description:n(`Requires current date context`)},{question:n(`What's the current time in UTC?`),description:n(`Timezone detail`)}],this.session=new g({authTokenProvider:m,debugListener:e=>{this.debugLog=[...this.debugLog,e]}}),this.session.setModel(c(`openai`,`gpt-4o-mini`)),this.updateTools(),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}updateTools(){let e=this.toolEnabled?[s]:[];this.session.setTools(e),this.session.setSystemPrompt(this.toolEnabled?n(`You are a helpful assistant with access to a date/time tool. Always use the tool for current date/time related questions.`):n(`You are a helpful assistant. You do not have access to the current date/time.`)),this.session.clearMessages()}async ask(e){this.session.clearMessages(),await this.agentInterface.sendMessage(e)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<div class="flex-shrink-0">
					${l(a`
						${d(f(n(`Date/Time Tool`)))}
						${u(a`
							<div class="flex items-center justify-between mb-3">
								<div class="text-xs text-muted-foreground pr-2">
									${this.toolEnabled?n(`Tool enabled for real-time date/time`):n(`Tool disabled (no real-time awareness)`)}
								</div>
								${p({checked:this.toolEnabled,onChange:e=>{this.toolEnabled=e,this.updateTools()}})}
							</div>
							<div class="space-y-2">
								${this.dateQuestions.map(t=>e({variant:`outline`,size:`sm`,onClick:()=>this.ask(t.question),children:t.question}))}
							</div>
						`)}
					`)}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto">
						<debug-view .debugLog=${this.debugLog}></debug-view>
					</div>
				</div>
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],_.prototype,`debugLog`,void 0),t([r()],_.prototype,`toolEnabled`,void 0),_=t([i(`datetime-tool-demo`)],_),document.body.innerHTML=`<datetime-tool-demo></datetime-tool-demo>`;export{_ as DateTimeToolDemo};