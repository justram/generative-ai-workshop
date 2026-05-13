import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import{loadAttachment as a}from"./CodeBlock-SUyIenKs.js";import{AgentInterface as o}from"./app-C9nW8ndw.js";import{Badge as s,Card as c,CardContent as l,CardHeader as u,CardTitle as d}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as f}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as p}from"./agent-session-CtmWvP9t.js";let m=class extends f{constructor(){super(),this.headerTitle=t(`When You Upload Documents`),this.sectionId=`3.4`,this.currentAttachment=null,this.extractedText=``,this.loadingAttachment=!1,this.selectedFile=``,this.currentPreview=``,this.files=[{name:`attention.pdf`,displayName:t(`Attention Is All You Need`),prompt:t(`What's in row C in table 3?`),type:`pdf`,preview:`./img/3-4-attention.png`},{name:`madx.pdf`,displayName:t(`MAD-X Paper`),prompt:t(`Give me the performance and specification of IMAGEXPLORER`),type:`pdf`,preview:`./img/3-4-madx.png`},{name:`audi-slides.pptx`,displayName:t(`Audi Presentation`),prompt:t(`What partners and research projects are listed?`),type:`pptx`,preview:`./img/3-4-audi-slides.png`},{name:`Einnahmen-Ausgaben.xlsx`,displayName:t(`Income & Expenses`),prompt:t(`What is the sum of the Betrag column?`),type:`xlsx`,preview:`./img/3-4-income-expenses.png`},{name:`Spine-Editor-License-Agreement.docx`,displayName:t(`License Agreement`),prompt:t(`Is there anything bad in there for me as a licensee?`),type:`docx`}],this.session=new p,this.session.setSystemPrompt(`You are a helpful assistant that answers questions about documents.
When a user provides a document, analyze its content and answer their questions based on what's in the document.
If you cannot find the answer in the document, say so clearly.`),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!0,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`,this.unsubscribe=this.session.subscribe(e=>{if(e.type!==`state-update`)return;let n=[...e.state.messages].reverse().find(e=>e.role===`user`);if(n?.attachments&&n.attachments.length>0){let e=n.attachments[0];this.currentAttachment=e,this.extractedText=e.extractedText||t(`No text extracted`),this.files.find(t=>t.name===e.fileName)||(this.selectedFile=``,this.currentPreview=``)}})}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${t(`Pick a sample file or upload your own and compare the model answer to the source text.`)}
				</p>
				${c(i`
					${u(d(t(`Sample Files`)))}
					${l(i` <div class="flex flex-col gap-2">${this.files.map(e=>this.renderFileButton(e))}</div> `)}
				`)}
				${this.currentPreview?c(i`
							${u(d(t(`Original Content`)))}
							${l(i`
								<div class="h-64 overflow-y-auto bg-muted/40 rounded-md p-2">
									<img src="${this.currentPreview}" alt="${t(`Document preview`)}" class="w-full h-auto" />
								</div>
							`)}
						`):``}
				${c(i`
					${u(d(t(`Extracted Text`)))}
					${l(i`${this.loadingAttachment?i`<div class="text-sm text-muted-foreground">${t(`Loading file…`)}</div>`:this.extractedText&&this.currentAttachment?i`<div class="h-64 overflow-y-auto bg-muted/40 rounded-md p-3">
										<pre class="text-xs font-mono whitespace-pre-wrap">${this.extractedText}</pre>
									</div>`:i`<div class="text-sm text-muted-foreground">
										${t(`Select a file above or upload one via the chat input.`)}
									</div>`}`)}
				`)}
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}renderFileButton(e){let n=this.selectedFile===e.name;return i`
			<button
				class="w-full text-left p-3 rounded-md border transition-colors ${n?`bg-accent/40 border-accent`:`bg-card border-border hover:bg-accent/30`}"
				?disabled=${this.loadingAttachment}
				@click=${()=>this.loadFile(e)}
			>
				<div class="flex items-start gap-3">
					<div class="mt-0.5">${this.getFileGlyph(e.type)}</div>
					<div class="flex-1 min-w-0">
						<div class="text-sm font-medium">${e.displayName}</div>
						<div class="text-xs text-muted-foreground mt-0.5">${e.name}</div>
					</div>
					${n?s(t(`Selected`),`secondary`):i``}
				</div>
			</button>
		`}async loadFile(e){if(!this.loadingAttachment){this.session.clearMessages(),this.loadingAttachment=!0,this.selectedFile=e.name,this.currentPreview=e.preview||``;try{let n=await(await fetch(`./data/${e.name}`)).blob(),r=await a(n,e.name);this.currentAttachment=r,this.extractedText=r.extractedText||t(`No text extracted`),this.agentInterface.setInput(e.prompt,[r])}catch(n){console.error(`Failed to load`,e.name,n),this.extractedText=t(`Failed to load {name}`)(e.name)}finally{this.loadingAttachment=!1}}}getFileGlyph(e){let t=`w-5 h-5`;switch(e){case`pdf`:return i`<svg class="${t} text-red-500" fill="currentColor" viewBox="0 0 20 20">
					<path d="M4 4a2 2 0 00-2 2v8a2 2 0 002 2h12a2 2 0 002-2V6a2 2 0 00-2-2h-5L9 2H4z" />
				</svg>`;case`docx`:return i`<svg class="${t} text-blue-500" fill="currentColor" viewBox="0 0 20 20">
					<path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
					<path
						fill-rule="evenodd"
						d="M4 5a2 2 0 012-2 1 1 0 000 2H6a2 2 0 100 4h2a2 2 0 100-4h-.5a1 1 0 000-2H14a2 2 0 012 2v9a2 2 0 01-2 2H6a2 2 0 01-2-2V5z"
					/>
				</svg>`;case`xlsx`:return i`<svg class="${t} text-green-500" fill="currentColor" viewBox="0 0 20 20">
					<path
						fill-rule="evenodd"
						d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V7.414A2 2 0 0015.414 6L12 2.586A2 2 0 0010.586 2H6zm2 10a1 1 0 10-2 0v3a1 1 0 102 0v-3zm2-3a1 1 0 011 1v5a1 1 0 11-2 0v-5a1 1 0 011-1zm4-1a1 1 0 10-2 0v7a1 1 0 102 0V8z"
					/>
				</svg>`;case`pptx`:return i`<svg class="${t} text-orange-500" fill="currentColor" viewBox="0 0 20 20">
					<path fill-rule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" />
				</svg>`;default:return i`<svg class="${t} text-muted-foreground" fill="none" stroke="currentColor" viewBox="0 0 24 24">
					<path
						stroke-linecap="round"
						stroke-linejoin="round"
						stroke-width="1.5"
						d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414A1 1 0 0117 9v10a2 2 0 01-2 2z"
					/>
				</svg>`}}disconnectedCallback(){super.disconnectedCallback(),this.unsubscribe?.()}};e([n()],m.prototype,`currentAttachment`,void 0),e([n()],m.prototype,`extractedText`,void 0),e([n()],m.prototype,`loadingAttachment`,void 0),e([n()],m.prototype,`selectedFile`,void 0),e([n()],m.prototype,`currentPreview`,void 0),m=e([r(`document-upload-demo`)],m),document.body.innerHTML=`<document-upload-demo></document-upload-demo>`;export{m as DocumentUploadDemo};