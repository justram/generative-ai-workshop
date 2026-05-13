import{__decorate as e,i18n as t,t$1 as n,x as r}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as i,formatCost as a,formatTokenCount as o,getModel as s}from"./app-C9nW8ndw.js";import{Card as c,CardContent as l,CardHeader as u,CardTitle as d}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as f}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as p}from"./agent-session-CtmWvP9t.js";let m=class extends f{constructor(){super(),this.headerTitle=t(`The (Hidden) Costs`),this.sectionId=`3.7`,this.session=new p,this.session.setModel(s(`anthropic`,`claude-opus-4-1-20250805`)),this.session.setSystemPrompt(`You are a helpful assistant demonstrating the hidden costs of LLM usage.
Be conversational and helpful, but also occasionally mention interesting facts about token usage and costs.
For example, you might mention that this very system prompt is costing tokens every single message.`),this.session.setThinkingLevel(`medium`),this.agentInterface=new i,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!0,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!0,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.agentInterface.setInput(t(`Hi! Can you help me understand why LLM costs add up so quickly?`)),this.unsubscribe=this.session.subscribe(e=>{e.type===`state-update`&&this.requestUpdate()})}renderContentPanel(){return r`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){let e=this.session.state.messages.filter(e=>e.role===`assistant`&&e.usage&&e.usage.cost),n=0,i=0,s=[];for(let t of e){let e=Number(t.usage.cost.total||0);s.push(e),n+=e,e>i&&(i=e)}return r`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				${c(r`
					${u(d(t(`Cost Tracker`)))}
					${l(r`
						<div class="text-sm mb-3"><span class="text-muted-foreground">${t(`Total:`)}</span> ${a(n)}</div>
						<div class="space-y-2">
							${e.map((e,t)=>{let n=s[t]||0,c=i>0?Math.max(3,Math.round(n/i*100)):0,l=e.usage||{input:0,output:0};return r` <div>
									<div class="flex items-center justify-between text-xs text-muted-foreground mb-1">
										<span>#${t+1}</span>
										<span>${a(n)}</span>
									</div>
									<div class="w-full h-1.5 bg-muted rounded-full overflow-hidden">
										<div class="h-full bg-primary/70" style="width: ${c}%"></div>
									</div>
									<div class="mt-1 text-xs text-muted-foreground">
										↑${o(l.input||0)} ↓${o(l.output||0)}
									</div>
								</div>`})}
							${e.length===0?r`<div class="text-xs text-muted-foreground">${t(`No assistant messages yet.`)}</div>`:``}
						</div>
					`)}
				`)}
			</div>
		`}renderRightDemoPanel(){return r`
			<div class="flex-1 p-6 overflow-y-auto min-h-0">
				<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
			</div>
		`}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.()}};m=e([n(`hidden-costs-demo`)],m),document.body.innerHTML=`<hidden-costs-demo></hidden-costs-demo>`;export{m as HiddenCostsDemo};