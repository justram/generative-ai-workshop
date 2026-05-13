import{__decorate as e,i18n as t,r as n,t$1 as r,x as i}from"./ThemeToggle-zh-tw7.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import{getAuthToken as a}from"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import{DemoBase as o}from"./DemoBase-7724hyNv.js";import"./ScatterPlot-tq0VEfVH.js";let s=class extends o{constructor(){super(),this.headerTitle=t(`5.1 Understanding Embeddings`),this.sectionId=`5.1`,this.movies=[],this.plotPoints=[],this.loading=!0,this.error=null,this.selectedMovieIndex=null,this.queryText=``,this.embedding=!1,this.embedError=null,this.queryVector2d=void 0,this.queryEmbedding=void 0,this.topMatches=[],this.loadEmbeddings()}async loadEmbeddings(){try{let e=await fetch(`/data/movies/movies.json`);if(!e.ok)throw Error(`Failed to load movies`);this.movies=await e.json();let t=await fetch(`/data/movies/embeddings.jsonl`);if(!t.ok)throw Error(`Failed to load embeddings`);let n=(await t.text()).split(`
`).filter(e=>e.trim()).map(e=>JSON.parse(e)),r=await fetch(`/data/movies/embeddings-2d.jsonl`);if(!r.ok)throw Error(`Failed to load 2D projections`);let i=(await r.text()).split(`
`).filter(e=>e.trim()).map(e=>JSON.parse(e));this.movies.forEach((e,t)=>{e.embedding=n[t],e.position2d=i[t]}),this.updatePlotPoints(),this.loading=!1}catch(e){this.error=e instanceof Error?e.message:`Failed to load data`,this.loading=!1}}updatePlotPoints(e){if(this.movies.length===0)return;let t=this.movies.map(e=>e.position2d),n=e?[...t,e]:t,r=1/0,i=-1/0,a=1/0,o=-1/0;for(let e of n)r=Math.min(r,e[0]),i=Math.max(i,e[0]),a=Math.min(a,e[1]),o=Math.max(o,e[1]);let s=i-r||1,c=o-a||1,l=document.documentElement.classList.contains(`dark`),u=this.movies.map((e,t)=>{let n=e.position2d,i=this.selectedMovieIndex===t,o=this.topMatches.some(t=>t.title===e.title),u=l?`hsl(250, 70%, 65%)`:`hsl(250, 70%, 45%)`;return i?u=l?`hsl(120, 60%, 60%)`:`hsl(120, 60%, 40%)`:o&&(u=`hsl(200, 100%, 50%)`),{x:(n[0]-r)/s*100,y:(n[1]-a)/c*100,text:e.title,color:u,isQuery:!1,isSelected:i,id:t.toString()}});e&&u.push({x:(e[0]-r)/s*100,y:(e[1]-a)/c*100,text:`Your Query\n"${this.queryText}"`,color:`hsl(350, 80%, 55%)`,isQuery:!0,isSelected:!1,id:`query`}),this.plotPoints=u}cosineSimilarity(e,t){let n=0,r=0,i=0;for(let a=0;a<e.length;a++)n+=e[a]*t[a],r+=e[a]*e[a],i+=t[a]*t[a];return n/(Math.sqrt(r)*Math.sqrt(i))}async embedQuery(){if(this.queryText.trim()){this.embedding=!0,this.embedError=null,this.topMatches=[];try{let e=await a();if(!e)throw Error(`No authentication token available`);let t=await fetch(`/api/embed`,{method:`POST`,headers:{"Content-Type":`application/json`,Authorization:`Bearer ${e}`},body:JSON.stringify({text:this.queryText})});if(!t.ok){let e=await t.json();throw Error(e.error||`Failed to embed query`)}this.queryEmbedding=(await t.json()).embedding;let n=this.movies.map((e,t)=>({title:e.title,index:t,similarity:this.cosineSimilarity(this.queryEmbedding,e.embedding)}));n.sort((e,t)=>t.similarity-e.similarity),this.topMatches=n.slice(0,3).map(e=>({title:e.title,similarity:e.similarity}));let r=n.slice(0,3),i=0,o=0;for(let e of r)i+=this.movies[e.index].position2d[0],o+=this.movies[e.index].position2d[1];this.queryVector2d=[i/3,o/3],this.updatePlotPoints(this.queryVector2d)}catch(e){this.embedError=e instanceof Error?e.message:`Failed to embed query`}finally{this.embedding=!1}}}handleQueryInput(e){this.queryText=e.target.value}handleQuerySubmit(e){e.preventDefault(),this.embedQuery()}clearQuery(){this.queryText=``,this.embedError=null,this.queryVector2d=void 0,this.queryEmbedding=void 0,this.topMatches=[],this.updatePlotPoints()}updatePointSelection(){let e=document.documentElement.classList.contains(`dark`);this.plotPoints=this.plotPoints.map(t=>{let n=t.id===this.selectedMovieIndex?.toString(),r=!t.isQuery&&this.topMatches.some(e=>e.title===t.text),i=t.color;return t.isQuery||(i=n?e?`hsl(120, 60%, 60%)`:`hsl(120, 60%, 40%)`:r?`hsl(200, 100%, 50%)`:e?`hsl(250, 70%, 65%)`:`hsl(250, 70%, 45%)`),{...t,color:i,isSelected:n}})}handlePointClick(e){e.isQuery||(this.selectedMovieIndex=parseInt(e.id,10),this.updatePointSelection())}handleMovieClick(e){this.selectedMovieIndex=e,this.updatePointSelection()}renderLeftDemoPanel(){return this.loading?i`
				<div class="flex items-center justify-center h-full">
					<div class="text-center text-muted-foreground">
						<div class="text-sm mb-2">${t(`Embedding movies...`)}</div>
						<div class="text-xs">${t(`This may take a moment`)}</div>
					</div>
				</div>
			`:this.error?i`
				<div class="flex items-center justify-center h-full">
					<div class="text-center text-destructive">
						<div class="text-sm mb-2">${t(`Error loading embeddings`)}</div>
						<div class="text-xs">${this.error}</div>
					</div>
				</div>
			`:i`
			<div class="flex flex-col h-full overflow-hidden">
				<div class="p-4 border-b border-border shrink-0">
					<h3 class="text-sm font-semibold mb-2">${t(`Movie Database`)}</h3>
					<p class="text-xs text-muted-foreground">${t(`Click a movie to highlight it in the visualization`)}</p>
				</div>

				<div class="flex-1 overflow-y-auto p-4 space-y-2">
					${this.movies.map((e,t)=>i`
							<button
								@click=${()=>this.handleMovieClick(t)}
								class="w-full text-left p-3 rounded-md border transition-colors ${this.selectedMovieIndex===t?`border-primary bg-primary/10`:`border-border hover:border-primary/50 hover:bg-muted/50`}"
							>
								<div class="font-medium text-sm mb-1">${e.title}</div>
								<div class="text-xs text-muted-foreground">${e.description}</div>
							</button>
						`)}
				</div>

				<div class="p-4 border-t border-border shrink-0 space-y-3">
					<div>
						<h3 class="text-sm font-semibold mb-2">${t(`Try Your Own Query`)}</h3>
						<p class="text-xs text-muted-foreground mb-3">
							${t(`Type a movie description or theme and see where it lands in the space`)}
						</p>
						<form @submit=${this.handleQuerySubmit} class="space-y-2">
							<input
								type="text"
								.value=${this.queryText}
								@input=${this.handleQueryInput}
								placeholder="${t(`e.g., 'space adventure' or 'serial killer'`)}"
								class="w-full px-3 py-2 text-sm border border-input bg-background rounded-md focus:outline-none focus:ring-2 focus:ring-ring"
								?disabled=${this.embedding}
							/>
							<div class="flex gap-2">
								<button
									type="submit"
									?disabled=${this.embedding||!this.queryText.trim()}
									class="flex-1 px-3 py-2 text-sm bg-primary text-primary-foreground rounded-md hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
								>
									${this.embedding?t(`Embedding...`):t(`Embed Query`)}
								</button>
								${this.queryVector2d?i`
											<button
												type="button"
												@click=${this.clearQuery}
												class="px-3 py-2 text-sm bg-secondary text-secondary-foreground rounded-md hover:bg-secondary/90"
											>
												${t(`Clear`)}
											</button>
										`:``}
							</div>
						</form>
						${this.embedError?i` <div class="text-xs text-destructive mt-2">${this.embedError}</div> `:``}
					</div>

					${this.topMatches.length>0?i`
								<div class="pt-3 border-t border-border">
									<h4 class="text-sm font-semibold mb-2">${t(`Top 3 Matches`)}</h4>
									<div class="space-y-1">
										${this.topMatches.map(e=>i`
												<div class="text-xs">
													<span class="font-medium">${e.title}</span>
													<span class="text-muted-foreground ml-2">${(e.similarity*100).toFixed(1)}% similar</span>
												</div>
											`)}
									</div>
								</div>
							`:``}
				</div>
			</div>
		`}renderContentPanel(){return this.loading?i`
				<div class="w-full h-full flex items-center justify-center">
					<div class="text-center text-muted-foreground">
						<div class="text-lg mb-2">${t(`Loading embedding visualization...`)}</div>
						<div class="text-sm">${t(`This may take a moment`)}</div>
					</div>
				</div>
			`:this.error?i`
				<div class="w-full h-full flex items-center justify-center">
					<div class="text-center text-destructive">
						<div class="text-lg mb-2">${t(`Error loading visualization`)}</div>
						<div class="text-sm">${this.error}</div>
					</div>
				</div>
			`:i`
			<div class="w-full h-full flex flex-col overflow-hidden">
				<div class="p-4 border-b border-border bg-muted/30 shrink-0">
					<p class="text-sm text-muted-foreground">
						${t(`Each dot represents a movie. Similar movies cluster together in this 2D projection of the high-dimensional embedding space.`)}
						${this.queryVector2d?i`<span class="text-destructive font-medium ml-2">${t(`Your query appears in red.`)}</span>`:``}
					</p>
				</div>
				<div class="flex-1 h-full relative">
					<scatter-plot .points=${this.plotPoints} .onPointClick=${e=>this.handlePointClick(e)}></scatter-plot>
				</div>
			</div>
		`}renderRightDemoPanel(){return i`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};e([n()],s.prototype,`movies`,void 0),e([n()],s.prototype,`plotPoints`,void 0),e([n()],s.prototype,`loading`,void 0),e([n()],s.prototype,`error`,void 0),e([n()],s.prototype,`selectedMovieIndex`,void 0),e([n()],s.prototype,`queryText`,void 0),e([n()],s.prototype,`embedding`,void 0),e([n()],s.prototype,`embedError`,void 0),e([n()],s.prototype,`queryVector2d`,void 0),e([n()],s.prototype,`queryEmbedding`,void 0),e([n()],s.prototype,`topMatches`,void 0),s=e([r(`demo-5-1`)],s),document.body.innerHTML=`<demo-5-1></demo-5-1>`;export{s as Demo51};