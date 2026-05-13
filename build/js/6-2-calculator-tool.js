import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,calculateTool as s,getModel as c}from"./app-C9nW8ndw.js";import{Card as l,CardContent as u,CardHeader as d,CardTitle as f,Switch as p}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as m}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as h}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as g}from"./agent-session-CtmWvP9t.js";let _=class extends h{constructor(){super(),this.headerTitle=n(`Calculator Tool - Giving Arithmetic to LLMs`),this.sectionId=`6.2`,this.debugLog=[],this.toolEnabled=!1,this.mathProblem={expression:n(`What's 1,234,567 × 8,901?`),description:n(`Multi-digit multiplication that LLMs often get wrong`)},this.session=new g({authTokenProvider:m,debugListener:e=>{this.debugLog=[...this.debugLog,e]}}),this.session.setModel(c(`openai-codex`,`gpt-5.4-mini`)),this.updateTools(),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}updateTools(){let e=this.toolEnabled?[s]:[];this.session.setTools(e),this.session.setSystemPrompt(this.toolEnabled?n(`You are a helpful assistant with access to a calculator tool. Use the calculator tool for ALL mathematical calculations to ensure accuracy.`):n(`You are a helpful assistant. Answer mathematical questions to the best of your ability.`)),this.session.clearMessages()}async sendExample(){this.session.clearMessages(),await this.agentInterface.sendMessage(this.mathProblem.expression)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<div class="flex-shrink-0">
					${l(a`
						${d(f(n(`Calculator Tool`)))}
						${u(a`
							<div class="flex items-center justify-between mb-3">
								<div class="text-xs text-muted-foreground pr-2">
									${this.toolEnabled?n(`LLM will use calculate() for precise math`):n(`LLM will attempt calculations on its own (often wrong)`)}
								</div>
								${p({checked:this.toolEnabled,onChange:e=>{this.toolEnabled=e,this.updateTools()}})}
							</div>
							<div class="text-xs font-medium mb-1">${n(`Test Problem`)}</div>
							<div class="text-xs text-muted-foreground mb-2">${this.mathProblem.description}</div>
							${e({variant:`secondary`,size:`sm`,onClick:()=>this.sendExample(),children:this.mathProblem.expression})}
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
		</div>`}};t([r()],_.prototype,`debugLog`,void 0),t([r()],_.prototype,`toolEnabled`,void 0),_=t([i(`calculator-tool-demo`)],_),document.body.innerHTML=`<calculator-tool-demo></calculator-tool-demo>`;export{_ as CalculatorToolDemo};