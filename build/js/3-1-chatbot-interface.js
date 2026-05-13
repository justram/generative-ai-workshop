import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as a,getModel as o}from"./app-C9nW8ndw.js";import{Textarea as s}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as c}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as l}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as u}from"./agent-session-CtmWvP9t.js";let d=class extends l{constructor(){super(),this.headerTitle=t(`How Chatbot Interfaces Work`),this.sectionId=`3.1`,this.debugLog=[],this.systemPromptText=t(`Memory: the user is named Mario and lives in Graz`),this.session=new u({authTokenProvider:c,debugListener:e=>{this.debugLog=[...this.debugLog,e]}}),this.session.setModel({...o(`openai`,`gpt-4-turbo`),id:`gpt-3.5-turbo`,name:`GPT-3.5 Turbo`,contextWindow:16385,maxTokens:4096}),this.session.setSystemPrompt(this.systemPromptText),this.agentInterface=new a,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!1,this.agentInterface.enableThinking=!1,this.agentInterface.showThemeToggle=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return i`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${t(`Edit the system prompt and use the debug view below to inspect requests and responses.`)}
				</p>
				<div class="flex-shrink-0">
					${s({label:t(`System Prompt`),value:this.systemPromptText,rows:5,resize:`vertical`,onInput:e=>{let t=e.target.value;this.systemPromptText=t,this.session.setSystemPrompt(t)}})}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto">
						<debug-view .debugLog=${this.debugLog}></debug-view>
					</div>
				</div>
			</div>
		`}renderRightDemoPanel(){return i`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
			</div>
		`}};e([n()],d.prototype,`debugLog`,void 0),e([n()],d.prototype,`systemPromptText`,void 0),d=e([r(`chatbot-demo`)],d),document.body.innerHTML=`<chatbot-demo></chatbot-demo>`;export{d as ChatbotDemo};