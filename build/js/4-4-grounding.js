import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import{Badge as c,Card as l,CardContent as u,CardHeader as d,CardTitle as f}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as p}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as m}from"./agent-session-CtmWvP9t.js";import{COMPANY_INFO as h,COMPANY_NAME as g,PRODUCT_INFO as _,PRODUCT_NAME as v}from"./demo-company-config-DwX2XOme.js";let y=class extends p{constructor(){super(),this.headerTitle=n(`Grounding Through References`),this.sectionId=`4.4`,this.selectedExample=``,this.useGrounding=!1,this.examples=[{id:`company`,name:`${g} Info`,question:`What can you tell me about ${g}?`,withoutGrounding:{systemPrompt:n(`You are a helpful assistant that answers questions about companies.`)},withGrounding:{systemPrompt:`You are an assistant who answers questions about ${g}.

IMPORTANT: Only answer based on the information provided below. If the information is not available in the reference material, say "${n(`I don't have that information in my reference material.`)}"

Company Information:
\`\`\`
${h}
\`\`\``,reference:`${g} company facts`}},{id:`product`,name:n(`Product Details`),question:`What are the main features of ${v}?`,withoutGrounding:{systemPrompt:n(`You are a helpful assistant that answers questions about software products.`)},withGrounding:{systemPrompt:`You are a technical assistant for ${v} software.

IMPORTANT: Only provide information from the reference documentation below. Do not make up features or specifications.

Product Information:
\`\`\`
${_}
\`\`\``,reference:`${v} documentation`}}],this.session=new m,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runExample(e,t){this.selectedExample=e.id,this.useGrounding=t;let n=t?e.withGrounding.systemPrompt:e.withoutGrounding.systemPrompt;this.session.setSystemPrompt(n),this.session.clearMessages(),await this.agentInterface.sendMessage(e.question)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){let t=this.examples.find(e=>e.id===this.selectedExample);return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`See how providing reference material improves accuracy and reduces hallucination.`)}
				</p>

				${this.examples.map(t=>l(a`
						${d(f(a`${t.name}
								${this.selectedExample===t.id?c(this.useGrounding?`Grounded`:`Ungrounded`,`secondary`,`ml-2`):``}`))}
						${u(a`
							<div class="text-xs text-muted-foreground mb-2">"${t.question}"</div>
							<div class="flex flex-col gap-2">
								${e({variant:this.selectedExample===t.id&&!this.useGrounding?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,!1),children:n(`Run without reference`)})}
								${e({variant:this.selectedExample===t.id&&this.useGrounding?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,!0),children:n(`Run with reference`)})}
							</div>
						`)}
					`))}
				${t&&this.useGrounding?l(a`
							${d(f(n(`Reference Material`)))}
							${u(a`<div class="text-xs bg-muted rounded p-2 max-h-48 overflow-auto">
									${t.id===`company`?h:_}
								</div>`)}
						`):``}
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],y.prototype,`selectedExample`,void 0),t([r()],y.prototype,`useGrounding`,void 0),y=t([i(`grounding-demo`)],y),document.body.innerHTML=`<grounding-demo></grounding-demo>`;export{y as GroundingDemo};