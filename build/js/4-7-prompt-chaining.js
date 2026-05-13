import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import{Card as c,CardContent as l,CardHeader as u,CardTitle as d,Textarea as f}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as p}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as m}from"./agent-session-CtmWvP9t.js";let h=class extends p{get steps(){return[{id:`extract`,name:n(`Step 1: Extract Key Points`),prompt:`List the 4 main achievements from this announcement as bullet points:\n\n"${this.rawInput}"\n\nFormat as:\n• Achievement 1\n• Achievement 2\n• Achievement 3\n• Achievement 4`},{id:`context`,name:n(`Step 2: Add Customer Value`),prompt:`Now for each achievement you just listed, add a brief explanation of why it matters to customers/users (one sentence each).

Format as:
• Achievement: Why it matters`},{id:`draft`,name:n(`Step 3: Write LinkedIn Post`),prompt:n(`Now turn those achievements with customer value into an engaging LinkedIn post. Make it 3-4 sentences, professional but enthusiastic. Start with an exciting hook.`)},{id:`engage`,name:n(`Step 4: Add Engagement`),prompt:n(`Add a question at the end of the LinkedIn post to encourage comments and engagement. The question should invite people to share their experiences or opinions.`)}]}constructor(){super(),this.headerTitle=n(`Prompt Chaining - Breaking Down Complex Tasks`),this.sectionId=`4.7`,this.currentStep=0,this.isProcessing=!1,this.completed=new Set,this.rawInput=n(`Our company just hit 1 million users, revenue up 40% this quarter, launched in 3 new countries (Germany, France, Japan), and hired 50 new people`),this.session=new m,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.session.setSystemPrompt(n(`You are a helpful assistant. Follow the instructions exactly and be concise.`)),this.session.clearMessages()}async runStep(e){this.isProcessing||e<0||e>=this.steps.length||e>0&&!this.completed.has(this.steps[e-1].id)||(this.isProcessing=!0,await this.agentInterface.sendMessage(this.steps[e].prompt),this.completed.add(this.steps[e].id),this.currentStep=e+1,this.isProcessing=!1)}resetChain(){this.currentStep=0,this.completed.clear(),this.session.clearMessages()}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(a`
					${u(d(n(`Raw Input`)))}
					${l(a`${f({label:n(`Company announcement`),rows:3,value:this.rawInput,onInput:e=>{this.rawInput=e.target.value,this.resetChain()}})}`)}
				`)}
				${c(a`
					${u(d(n(`Transformation Chain`)))}
					${l(a`
						<div class="space-y-2">
							${this.steps.map((t,n)=>e({variant:this.completed.has(t.id)?`secondary`:`outline`,size:`sm`,disabled:this.isProcessing||n>0&&!this.completed.has(this.steps[n-1].id),onClick:()=>this.runStep(n),children:t.name,className:`w-full justify-start`}))}
						</div>
						${this.currentStep>0?e({variant:`outline`,size:`sm`,onClick:()=>this.resetChain(),children:n(`Start Over`),className:`mt-3 w-full`}):``}
					`)}
				`)}
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],h.prototype,`currentStep`,void 0),t([r()],h.prototype,`isProcessing`,void 0),t([r()],h.prototype,`completed`,void 0),t([r()],h.prototype,`rawInput`,void 0),h=t([i(`prompt-chaining-demo`)],h),document.body.innerHTML=`<prompt-chaining-demo></prompt-chaining-demo>`;export{h as PromptChainingDemo};