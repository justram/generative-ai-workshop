import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./CodeBlock-SUyIenKs.js";import{AgentInterface as a,getModel as o,registerToolRenderer as s}from"./app-C9nW8ndw.js";import{Badge as c}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as l}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as u}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as d}from"./agent-session-CtmWvP9t.js";import"./PreviewCodeToggle-BU28TKE5.js";import{ArtifactsPanel as f}from"./artifacts-BhLRFxu0.js";let p=class extends u{constructor(){super(),this.headerTitle=t(`Artifacts Tool - Create, Update, View Files`),this.sectionId=`6.5`,this.debugLog=[],this.hasArtifacts=!1,this.showArtifacts=!1,this.artifactCount=0,this.session=new d({authTokenProvider:l,debugListener:e=>{this.debugLog=[...this.debugLog,e]}}),this.session.setModel(o(`anthropic`,`claude-sonnet-4-20250514`)),this.session.setSystemPrompt(t(`You can create and manage artifacts (files). Prefer updating existing files over creating new ones. Include artifacts with clear names and content.`)),this.session.setThinkingLevel(`off`),this.agentInterface=new a,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!0,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!0,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.artifactsPanel=new f,this.artifactsPanel.style.width=`100%`,this.artifactsPanel.style.height=`100%`,s(`artifacts`,this.artifactsPanel),this.artifactsPanel.attachmentsProvider=()=>this.session.state.messages.filter(e=>e.role===`user`).flatMap(e=>e.attachments||[]),this.artifactsPanel.onArtifactsChange=()=>{let e=this.artifactsPanel.artifacts?.size??0,t=e>this.artifactCount;this.hasArtifacts=e>0,this.artifactCount=e,this.hasArtifacts&&t&&(this.showArtifacts=!0)},this.artifactsPanel.onClose=()=>{this.showArtifacts=!1},this.artifactsPanel.onOpen=()=>{this.showArtifacts=!0};let e=[this.artifactsPanel.tool];this.session.setTools(e)}async seedPrompt(e){await this.agentInterface.sendMessage(e)}renderContentPanel(){this.artifactsPanel&&(this.artifactsPanel.collapsed=!1,this.artifactsPanel.overlay=!1);let e=window.innerWidth<1024,n=`100%`,r=`0%`;return this.hasArtifacts&&(e?(n=this.showArtifacts?`0%`:`100%`,r=this.showArtifacts?`100%`:`0%`):(n=this.showArtifacts?`50%`:`100%`,r=this.showArtifacts?`50%`:`0%`)),i`
			<div class="relative w-full h-full overflow-hidden flex">
				<!-- Chat interface -->
				<div class="h-full pb-2" style="width: ${n};">${this.agentInterface}</div>

				<!-- Artifacts panel -->
				<div class="h-full" style="width: ${r};">${this.artifactsPanel}</div>

				<!-- Artifacts badge when collapsed -->
				${this.hasArtifacts&&!this.showArtifacts?i`
							<button
								class="absolute top-4 left-1/2 -translate-x-1/2 z-30"
								@click=${()=>{this.showArtifacts=!0}}
								title=${t(`Show artifacts`)}
							>
								${c(i`
									<span class="inline-flex items-center gap-1">
										<span>${t(`Artifacts`)}</span>
										${this.artifactsPanel?.artifacts?.size&&this.artifactsPanel.artifacts.size>1?i`<span
													class="text-[10px] leading-none bg-primary-foreground/20 text-primary-foreground rounded px-1 font-mono tabular-nums"
													>${this.artifactsPanel.artifacts.size}</span
												>`:``}
									</span>
								`)}
							</button>
						`:``}
			</div>
		`}renderLeftDemoPanel(){let e=[{title:t(`3D Scene with Three.js`),description:t(`Create an interactive 3D scene`),prompt:`Generate a 3D scene using three.js. Be creative.

Use the artifacts tool to create this as an HTML artifact with embedded JavaScript.`},{title:t(`Python Fibonacci Generator`),description:t(`Generate a Python function with examples`),prompt:`Create a Python function that:
- Generates fibonacci numbers
- Handles edge cases
- Includes example usage
- Has proper documentation

Use the artifacts tool to create this as a Python code artifact.`},{title:t(`Markdown Documentation`),description:t(`Create a guide about using artifacts`),prompt:`Create a markdown document explaining:
- What artifacts are
- How to use them effectively
- Examples of good use cases
- Tips and best practices

Use the artifacts tool to create this as a markdown artifact.`},{title:t(`Company Landing Page`),description:t(`Generate a modern landing page`),prompt:`Generate a landing page for TechCorp.

Company information: TechCorp is a leading technology consulting firm specializing in AI, cloud solutions, and digital transformation.

Create a modern, professional landing page with:
- Hero section with company name and tagline
- About section with company information
- Clean, modern design
- Responsive layout

Use the artifacts tool to create this as an HTML artifact.`},{title:t(`SVG Pelican on Bike`),description:t(`Generate colorful SVG artwork`),prompt:`Draw a pelican riding a bike using SVG shapes:
- Use circles, rectangles, and paths
- Make it colorful with different fills
- Add some gradient effects if possible
- 400x400 viewbox size

Use the artifacts tool to create this as an SVG artifact.`}];return i`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${t(`Create and iteratively edit documents with the LLM. Click an example, then ask for changes.`)}
				</p>

				<div class="space-y-2 flex-shrink-0">
					${e.map(e=>i`
							<button
								@click=${()=>this.seedPrompt(e.prompt)}
								class="w-full text-left p-3 rounded-md border border-border hover:bg-muted/50 transition-colors"
							>
								<div class="text-sm font-medium text-foreground">${e.title}</div>
								<div class="text-xs text-muted-foreground mt-1">${e.description}</div>
							</button>
						`)}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto">
						<debug-view .debugLog=${this.debugLog}></debug-view>
					</div>
				</div>
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};e([n()],p.prototype,`debugLog`,void 0),e([n()],p.prototype,`hasArtifacts`,void 0),e([n()],p.prototype,`showArtifacts`,void 0),e([n()],p.prototype,`artifactCount`,void 0),p=e([r(`artifacts-tool-demo`)],p),document.body.innerHTML=`<artifacts-tool-demo></artifacts-tool-demo>`;export{p as ArtifactsToolDemo};