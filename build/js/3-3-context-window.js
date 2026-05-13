import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as a}from"./app-C9nW8ndw.js";import{Badge as o,Card as s,CardContent as c,CardHeader as l,CardTitle as u}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as d}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as f}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as p}from"./agent-session-CtmWvP9t.js";let m=class extends f{constructor(){super(),this.headerTitle=t(`Context Window`),this.sectionId=`3.3`,this.maxContextTokens=200,this.droppedMessages=[],this.actualMessages=[],this.currentTokens={input:0,output:0},this.messagesToSkip=0,this.session=new p({messagePreprocessor:async e=>(this.updateMessageTracking(e),e.slice(this.messagesToSkip)),authTokenProvider:d});let e=[{role:`user`,content:[{type:`text`,text:t(`My name is Mario. How are you doing today?`)}]},{role:`assistant`,content:[{type:`text`,text:t(`Hello Mario! Nice to meet you. I'm doing well, thank you for asking! How are you doing today?`)}],api:`openai-codex-responses`,provider:`openai-codex`,model:`gpt-5.4-mini`,usage:{input:12,output:14,cacheRead:0,cacheWrite:0,cost:{cacheRead:0,cacheWrite:0,input:0,output:0,total:0}},stopReason:`stop`}];this.session.replaceMessages(e),this.agentInterface=new a,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!1,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.agentInterface.setInput(t(`What can you tell me about quantum computing?`)),this.unsubscribe=this.session.subscribe(e=>{if(e.type!==`state-update`)return;let t=e.state.messages;this.updateMessageTracking(t);for(let e=t.length-1;e>=0;e--){let n=t[e];if(n.role===`assistant`&&n.usage){let e=n.usage;this.currentTokens={input:e.input||0,output:e.output||0},this.currentTokens.input+this.currentTokens.output>this.maxContextTokens&&this.actualMessages.length>2&&(this.messagesToSkip=Math.min(this.messagesToSkip+2,t.length-2),this.updateMessageTracking(t));break}}})}updateMessageTracking(e){this.droppedMessages=e.slice(0,this.messagesToSkip),this.actualMessages=e.slice(this.messagesToSkip)}getMessageText(e){return typeof e.content==`string`?e.content:Array.isArray(e.content)?e.content.filter(e=>e.type===`text`).map(e=>e.text||``).join(` `):``}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){let e=this.currentTokens.input+this.currentTokens.output,n=Math.min(e/this.maxContextTokens*100,100);return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${t(`Send a few messages, then ask "What's my name?" to see how older messages are forgotten as the context fills.`)}
				</p>
				${s(i`
					${l(u(t(`Context Window`)))}
					${c(i`
						<div class="mb-2 flex items-baseline justify-between">
							<span class="text-3xl font-light">${e}</span>
							<span class="text-sm text-muted-foreground">/ ${this.maxContextTokens}</span>
						</div>
						<div class="w-full bg-muted rounded-full h-1 overflow-hidden">
							<div
								class="h-full transition-all duration-500 ease-out ${n>90?`bg-red-500`:n>70?`bg-amber-500`:`bg-emerald-500/80`}"
								style="width: ${n}%"
							></div>
						</div>
					`)}
				`)}
				${this.droppedMessages.length>0?s(i`
							${l(u(i`<div class="flex flex-row gap-2">
										${t(`Forgotten`)} ${o(String(this.droppedMessages.length),`secondary`,`ml-2`)}
									</div>`))}
							${c(i`${this.droppedMessages.map(e=>i`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e.role}</div>
											<div class="text-xs text-muted-foreground line-through opacity-60 mt-0.5">
												${this.getMessageText(e).substring(0,80)}${this.getMessageText(e).length>80?`...`:``}
											</div>
										</div>
									`)}`)}
						`):i``}
				${s(i`
					${l(u(i`${t(`In Context`)} ${o(String(this.droppedMessages.length),`secondary`,`ml-2`)}`))}
					${c(i`${this.actualMessages.length>0?this.actualMessages.map(e=>i`
										<div class="p-2 rounded-md bg-card/50 mb-1">
											<div class="text-[10px] uppercase text-muted-foreground">${e.role}</div>
											<div class="text-xs mt-0.5">
												${this.getMessageText(e).substring(0,80)}${this.getMessageText(e).length>80?`...`:``}
											</div>
										</div>
									`):i`<div class="text-sm text-muted-foreground">
									${t(`Messages will appear here as the conversation grows`)}
								</div>`}`)}
				`)}
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.()}};e([n()],m.prototype,`maxContextTokens`,void 0),e([n()],m.prototype,`droppedMessages`,void 0),e([n()],m.prototype,`actualMessages`,void 0),e([n()],m.prototype,`currentTokens`,void 0),m=e([r(`context-window-demo`)],m),document.body.innerHTML=`<context-window-demo></context-window-demo>`;export{m as ContextWindowDemo};