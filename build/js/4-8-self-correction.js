import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import{Card as c,CardContent as l,CardHeader as u,CardTitle as d,Textarea as f}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as p}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as m}from"./agent-session-CtmWvP9t.js";let h=class extends p{get steps(){return[{id:`generate`,name:`Step 1: Generate Executive Summary`,prompt:`Write a 2-paragraph executive summary of these quarterly results:\n\n"${this.reportData}"\n\nFocus on key metrics and business implications.`},{id:`critique`,name:`Step 2: Critique the Summary`,prompt:`Review the executive summary you just wrote for:
1. Clarity of key metrics
2. Business insight depth
3. Action-oriented language
4. Executive audience appropriateness

List specific issues found and suggestions for improvement.`},{id:`improve`,name:`Step 3: Improve Based on Critique`,prompt:`Based on your critique, rewrite the executive summary to address all the issues you identified. Make it more impactful for senior executives.`}]}constructor(){super(),this.headerTitle=`Self-Correction - Iterative Improvement`,this.sectionId=`4.8`,this.currentStep=0,this.isProcessing=!1,this.completed=new Set,this.reportData=`Q3 2024 results: Revenue up 15%, new customers up 22%, but costs increased 18% due to expansion. Launched in 3 new markets. Customer satisfaction at all-time high of 94%.`,this.session=new m,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.session.setSystemPrompt(`You are a helpful assistant. Follow the instructions exactly and be concise.`),this.session.clearMessages()}async runStep(e){this.isProcessing||e<0||e>=this.steps.length||e>0&&!this.completed.has(this.steps[e-1].id)||(this.isProcessing=!0,await this.agentInterface.sendMessage(this.steps[e].prompt),this.completed.add(this.steps[e].id),this.currentStep=e+1,this.isProcessing=!1)}resetFlow(){this.currentStep=0,this.completed.clear(),this.session.clearMessages()}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(a`
					${u(d(`Quarterly Report Data`))}
					${l(a`${f({label:n(`Editable data`),rows:3,value:this.reportData,onInput:e=>{this.reportData=e.target.value,this.resetFlow()}})}`)}
				`)}
				${c(a`
					${u(d(`Self-Correction Process`))}
					${l(a`
						<div class="space-y-2">
							${this.steps.map((t,n)=>e({variant:this.completed.has(t.id)?`secondary`:`outline`,size:`sm`,disabled:this.isProcessing||n>0&&!this.completed.has(this.steps[n-1].id),onClick:()=>this.runStep(n),children:t.name,className:`w-full justify-start`}))}
						</div>
						${this.currentStep>0?e({variant:`outline`,size:`sm`,onClick:()=>this.resetFlow(),children:n(`Start Over`),className:`mt-3 w-full`}):``}
					`)}
				`)}
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],h.prototype,`currentStep`,void 0),t([r()],h.prototype,`isProcessing`,void 0),t([r()],h.prototype,`completed`,void 0),t([r()],h.prototype,`reportData`,void 0),h=t([i(`self-correction-demo`)],h),document.body.innerHTML=`<self-correction-demo></self-correction-demo>`;export{h as SelfCorrectionDemo};