import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import{loadAttachment as a}from"./CodeBlock-SUyIenKs.js";import{AgentInterface as o}from"./app-C9nW8ndw.js";import{Card as s,CardContent as c,CardHeader as l,CardTitle as u}from"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js";import{DemoBase as d}from"./DemoBase-7724hyNv.js";import"./proxy-client-DO8A5rUF.js";import{AgentSession as f}from"./agent-session-CtmWvP9t.js";let p=class extends d{constructor(){super(),this.headerTitle=t(`When You Upload Images`),this.sectionId=`3.6`,this.loadingImage=!1,this.selectedImage=``,this.selectedPrompt=``,this.imageTests=[{id:`counting`,name:t(`Object Counting`),file:`counting-circles.png`,prompts:[t(`How many circles are in this image?`),t(`How many red circles are there?`),t(`What's the total of blue and green circles?`)]},{id:`chart`,name:t(`Precise Chart Values`),file:`precise-chart.png`,prompts:[t(`What is the exact market share percentage for Product B?`),t(`Which product has exactly 44.7% market share?`),t(`What does the note at the bottom say about Product B?`)]},{id:`text`,name:t(`OCR Challenges`),file:`overlapping-text.png`,prompts:[t(`What is the verification code shown in red at the top left?`),t(`What is the wavy colorful text in the middle?`),t(`What are the room and time codes (R00M and T1M3)?`)]},{id:`spatial`,name:t(`Spatial Relationships`),file:`spatial-relations.png`,prompts:[t(`Which shape is to the left of B and above F?`),t(`What shape is directly between A and C?`),t(`List all shapes in the bottom row from left to right`),t(`If B was moved straight downwards, would it hit C?`)]},{id:`lines`,name:t(`Line Chart Tracking`),file:`crossing-lines.png`,prompts:[t(`In which month does Product Gamma first exceed Product Beta in sales?`),t(`What are the exact sales for Product Alpha in November?`),t(`Which product has the highest sales in August?`)]},{id:`grid`,name:t(`Grid Patterns`),file:`dot-grid.png`,prompts:[t(`How many dots are in the complete grid?`),t(`How many dots are missing from the pattern?`),t(`What shape do the missing dots form?`)]},{id:`table`,name:t(`Table Precision`),file:`similar-numbers-table.png`,prompts:[t(`What's the value in row 3, column C?`),t(`Which cell contains 47.83?`),t(`What's the sum of column B?`)]},{id:`paper`,name:t(`Academic Table`),file:`paper-table.png`,prompts:[t(`What's the accuracy for BERT on Task 3?`),t(`Which model has the highest score on Task 2?`),t(`What does the † symbol indicate?`)]},{id:`invoice`,name:t(`Scanned Invoice`),file:`invoice.png`,prompts:[t(`What's the invoice number?`),t(`What's the total amount due?`),t(`What's the tax rate applied?`),t(`What's the address of the company?`)]},{id:`schematic`,name:t(`Technical Diagram`),file:`schematic.png`,prompts:[t(`What component is connected to pin 7?`),t(`What's the value of R3?`),t(`Which pins are grounded?`)]},{id:`pcb`,name:t(`Circuit Board`),file:`pcb.png`,prompts:[t(`What's the label on the main IC?`),t(`How many capacitors are visible?`),t(`What's written near the USB connector?`)]}],this.session=new f,this.session.setSystemPrompt(t(`You are a helpful assistant analyzing images. Describe what you see accurately and answer questions based on the visual content.`)),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!0,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async loadImageWithPrompt(e,t){if(!this.loadingImage){this.selectedImage!==e.id&&this.session.clearMessages(),this.loadingImage=!0,this.selectedImage=e.id,this.selectedPrompt=t;try{if(this.session.state.messages.some(t=>t.role===`user`&&Array.isArray(t.attachments)&&t.attachments.some(t=>t?.type===`image`&&t?.fileName===e.file)))this.agentInterface.setInput(t);else{let n=await(await fetch(`/data/images/${e.file}`)).blob(),r=await a(n,e.file);this.agentInterface.setInput(t,[r])}}catch(t){console.error(`Failed to load image`,e.file,t)}finally{this.loadingImage=!1}}}renderContentPanel(){return i`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return i`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-4">
				<p class="text-sm text-muted-foreground">
					${t(`Pick an image prompt to test the model's vision. The image will be attached automatically.`)}
				</p>
				${this.imageTests.map(e=>s(i`
						${l(u(e.name))}
						${c(i`
							<div class="flex items-start gap-3 mb-2">
								<img
									src="/data/images/${e.file}"
									alt="${e.name}"
									class="w-16 h-16 object-cover rounded border border-border"
								/>
								<div class="text-xs text-muted-foreground">${e.file}</div>
							</div>
							<div class="flex flex-wrap gap-2">
								${e.prompts.map(t=>i`<button
											class="px-3 py-1.5 text-xs rounded-full border transition-all ${this.selectedImage===e.id&&this.selectedPrompt===t?`bg-primary text-primary-foreground border-primary`:`bg-card border-border hover:bg-accent/30`}"
											?disabled=${this.loadingImage}
											@click=${()=>this.loadImageWithPrompt(e,t)}
										>
											${t.substring(0,48)}${t.length>48?`…`:``}
										</button>`)}
							</div>
						`)}
					`))}
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};e([n()],p.prototype,`loadingImage`,void 0),e([n()],p.prototype,`selectedImage`,void 0),e([n()],p.prototype,`selectedPrompt`,void 0),p=e([r(`image-demo`)],p),document.body.innerHTML=`<image-demo></image-demo>`;export{p as ImageDemo};