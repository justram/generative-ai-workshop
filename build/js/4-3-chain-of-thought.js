import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import{Badge as c,Card as l,CardContent as u,CardHeader as d,CardTitle as f}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as p}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as m}from"./agent-session-CtmWvP9t.js";let h=class extends p{constructor(){super(),this.headerTitle=n(`Step-by-Step & Chain of Thought`),this.sectionId=`4.3`,this.selectedExample=``,this.useCoT=!1,this.examples=[{id:`alice`,name:n(`Alice in Wonderland (AIW)`),withoutCoT:{systemPrompt:n(`You are a helpful assistant that answers questions concisely.`),prompt:n(`Alice has 3 brothers and she also has 6 sisters. How many sisters does Alice's brother have?`)},withCoT:{systemPrompt:n(`You are a helpful assistant that thinks through problems step-by-step.`),prompt:n(`Alice has 3 brothers and she also has 6 sisters. How many sisters does Alice's brother have? Think step-by-step.`)}},{id:`math`,name:n(`Math Problem`),withoutCoT:{systemPrompt:n(`You are a helpful assistant that answers questions concisely.`),prompt:n(`Is 17 x 24 = 408?`)},withCoT:{systemPrompt:n(`You are a helpful assistant that shows your work step-by-step.`),prompt:n(`Is 17 x 24 = 408? Think step-by-step and show your calculation.`)}},{id:`word-problem`,name:n(`Word Problem`),withoutCoT:{systemPrompt:n(`You are a helpful assistant that solves problems.`),prompt:n(`A train travels 120 km in 2 hours, then 180 km in 3 hours. What was its average speed for the entire journey?`)},withCoT:{systemPrompt:n(`You are a helpful assistant that breaks down problems systematically.`),prompt:`A train travels 120 km in 2 hours, then 180 km in 3 hours. What was its average speed for the entire journey?

Solve this step-by-step:
1. Calculate total distance
2. Calculate total time
3. Calculate average speed
4. Show your final answer`}},{id:`logic`,name:n(`Logic Puzzle`),withoutCoT:{systemPrompt:n(`You are a helpful assistant that solves puzzles.`),prompt:n(`Alice is taller than Bob. Charlie is shorter than Bob. Dana is taller than Alice. Who is the shortest?`)},withCoT:{systemPrompt:n(`You are a helpful assistant that reasons through problems logically.`),prompt:`Alice is taller than Bob. Charlie is shorter than Bob. Dana is taller than Alice. Who is the shortest?

Think through this step-by-step:
1. List all the relationships
2. Order the people from tallest to shortest
3. Identify who is the shortest`}}],this.session=new m,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!0,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runExample(e,t){this.selectedExample=e.id,this.useCoT=t;let n=t?e.withCoT:e.withoutCoT;this.session.setSystemPrompt(n.systemPrompt),this.session.clearMessages(),await this.agentInterface.sendMessage(n.prompt)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`Compare how models perform with and without step-by-step reasoning prompts.`)}
				</p>

				${this.examples.map(t=>l(a`
						${d(f(a`${t.name}
								${this.selectedExample===t.id?c(this.useCoT?n(`With CoT`):n(`No CoT`),`secondary`,`ml-2`):``}`))}
						${u(a`
							<div class="flex flex-col gap-2">
								<div class="text-sm text-muted-foreground p-2 bg-muted/50 rounded">${t.withoutCoT.prompt.split(`
`)[0]}</div>
								${e({variant:this.selectedExample===t.id&&!this.useCoT?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,!1),children:n(`Run without CoT`)})}
								${e({variant:this.selectedExample===t.id&&this.useCoT?`secondary`:`outline`,size:`sm`,onClick:()=>this.runExample(t,!0),children:n(`Run with CoT`)})}
							</div>
						`)}
					`))}
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],h.prototype,`selectedExample`,void 0),t([r()],h.prototype,`useCoT`,void 0),h=t([i(`chain-of-thought-demo`)],h),document.body.innerHTML=`<chain-of-thought-demo></chain-of-thought-demo>`;export{h as ChainOfThoughtDemo};