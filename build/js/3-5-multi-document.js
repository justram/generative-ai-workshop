import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import{loadAttachment as a}from"./CodeBlock-SUyIenKs.js";import{AgentInterface as o}from"./app-C9nW8ndw.js";import{Badge as s,Card as c,CardContent as l,CardHeader as u,CardTitle as d}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as f}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as p}from"./agent-session-CtmWvP9t.js";let m=class extends f{constructor(){super(),this.headerTitle=`When You Upload Multiple Documents`,this.sectionId=`3.5`,this.loadingChallenge=!1,this.selectedChallenge=``,this.challenges=[],this.session=new p,this.session.setSystemPrompt(t(`You are a helpful assistant analyzing research papers. Read the papers carefully and answer questions about them based on the content provided.`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!0,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.loadChallenges()}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${t(`Pick a challenge, load its papers, and ask the model to pick the best answer. Examples from`)}
					<a href="https://longbench2.github.io/" target="_blank" class="text-primary hover:underline">LongBench</a>.
				</p>
				${c(i`
					${u(d(t(`Challenges`)))}
					${l(i` <div class="flex flex-col gap-2">${this.challenges.map(e=>this.renderChallengeButton(e))}</div> `)}
				`)}
				${c(i` ${u(d(t(`Correct Answer`)))} ${l(i`${this.renderCorrectAnswer()}`)} `)}
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}renderChallengeButton(e){let n=this.selectedChallenge===e.name;return i`
			<button
				class="w-full text-left p-3 rounded-md border transition-colors ${n?`bg-accent/40 border-accent`:`bg-card border-border hover:bg-accent/30`}"
				?disabled=${this.loadingChallenge}
				@click=${()=>this.loadChallenge(e)}
			>
				<div class="flex items-start gap-3">
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium">${e.displayName}</div>
						<div class="text-xs text-muted-foreground mt-0.5">
							${e.files.length} files • ${e.files.map(e=>e.replace(`.txt`,``)).join(`, `)}
						</div>
					</div>
					${n?s(t(`Selected`),`secondary`):i``}
				</div>
			</button>
		`}renderCorrectAnswer(){if(!this.selectedChallenge)return i`<div class="text-sm text-muted-foreground">${t(`Select a challenge to see the gold answer.`)}</div>`;let e=this.challenges.find(e=>e.name===this.selectedChallenge);return e?i`
			<div class="text-sm font-medium mb-2">${e.question}</div>
			<div class="space-y-2">
				${Object.entries(e.choices).map(([t,n])=>{let r=t===e.answer;return i`<div
						class="text-xs p-2 rounded ${r?`bg-green-100 dark:bg-green-500/10 border border-green-500 text-green-700 dark:text-green-400`:`text-muted-foreground`}"
					>
						<strong>${t})</strong> ${n} ${r?i`<span class="ml-2 font-medium">✓</span>`:``}
					</div>`})}
			</div>
		`:i``}async loadChallenges(){try{let[e,n]=await Promise.all([fetch(`/data/multidoc-1-question.json`),fetch(`/data/multidoc-2-question.json`)]),r=await e.json(),i=await n.json();this.challenges=[{name:`clip-typographic`,displayName:t(`CLIP & Typographic Attacks`),files:[`defense-prefix.txt`,`disentangling-clip.txt`],question:r.question,choices:{A:r.choice_A,B:r.choice_B,C:r.choice_C,D:r.choice_D},answer:r.answer},{name:`android-benchmarks`,displayName:t(`Android World vs AITW`),files:[`android-in-the-wild.txt`,`android-world.txt`],question:i.question,choices:{A:i.choice_A,B:i.choice_B,C:i.choice_C,D:i.choice_D},answer:i.answer}]}catch(e){console.error(`Failed to load challenges`,e)}}async loadChallenge(e){if(!this.loadingChallenge){this.loadingChallenge=!0,this.selectedChallenge=e.name;try{let n=[];for(let t of e.files){let e=await(await fetch(`/data/${t}`)).blob(),r=await a(e,t);n.push(r)}this.session.clearMessages();let r=`${e.question}\n\nA) ${e.choices.A}\nB) ${e.choices.B}\nC) ${e.choices.C}\nD) ${e.choices.D}\n\n${t(`Please analyze the papers carefully and select the best answer. End your response with "The answer is [LETTER]".`)}`;this.agentInterface.setInput(r,n)}catch(t){console.error(`Failed to load challenge`,e.name,t)}finally{this.loadingChallenge=!1}}}};e([n()],m.prototype,`loadingChallenge`,void 0),e([n()],m.prototype,`selectedChallenge`,void 0),e([n()],m.prototype,`challenges`,void 0),m=e([r(`multi-document-demo`)],m),document.body.innerHTML=`<multi-document-demo></multi-document-demo>`;export{m as MultiDocumentDemo};