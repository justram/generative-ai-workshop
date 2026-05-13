import{Button as e,__decorate as t,e as n,i$1 as r,i18n as i,iconCloseLine as a,iconDownloadLine as o,n as s,n$1 as c,o as l,r as u,t$1 as d,x as f}from"./ThemeToggle-zh-tw7.js";import{es_default as p}from"./CodeBlock-SUyIenKs.js";import{StringEnum as m,Type as h}from"./app-C9nW8ndw.js";import{Badge as g}from"./Textarea-DCZnYrSo.js";import{Diff as _}from"./mini-zh-tw7.js";function v({content:t,filename:n,mimeType:r=`text/plain`,title:a=i(`Download`),showText:s=!1}){return e({variant:`ghost`,size:`sm`,onClick:()=>{let e=new Blob([t],{type:r}),i=URL.createObjectURL(e),a=document.createElement(`a`);a.href=i,a.download=n,a.click(),URL.revokeObjectURL(i)},title:a,children:f` ${o(`sm`)} ${s?f`<span>${i(`Download`)}</span>`:``} `})}var y=class extends r{constructor(...e){super(...e),this.filename=``,this.displayTitle=``}createRenderRoot(){return this}};let b=class extends y{constructor(...e){super(...e),this.filename=``,this.displayTitle=``,this.attachments=[],this._content=``,this.logs=[],this.iframeContainerRef=n(),this.consoleLogsRef=n(),this.consoleButtonRef=n(),this.viewMode=`preview`,this.consoleOpen=!1,this.handleMessage=e=>{e.data.artifactId===this.filename&&(e.data.type===`console`?this.addLog({type:e.data.method===`error`?`error`:`log`,text:e.data.text}):e.data.type===`execution-complete`&&(this.logs=e.data.logs||[],this.updateConsoleButton(),this.iframe&&(this.iframe.style.display=`none`,this.iframe.offsetHeight,this.iframe.style.display=``)))}}setViewMode(e){this.viewMode=e}getHeaderButtons(){return f`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${e=>this.setViewMode(e.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title="${i(`Copy HTML`)}" .showText=${!1}></copy-button>
				${v({content:this._content,filename:this.filename,mimeType:`text/html`,title:i(`Download HTML`)})}
			</div>
		`}set content(e){let t=this._content;this._content=e,t!==e&&requestAnimationFrame(async()=>{this.requestUpdate(),await this.updateComplete,this.updateIframe(),requestAnimationFrame(()=>{this.attachIframeToContainer()})})}get content(){return this._content}connectedCallback(){super.connectedCallback(),window.addEventListener(`message`,this.handleMessage)}firstUpdated(){this._content&&(this.updateIframe(),requestAnimationFrame(()=>{this.attachIframeToContainer()}))}updated(){this.iframe&&!this.iframe.parentElement&&this.attachIframeToContainer()}disconnectedCallback(){super.disconnectedCallback(),window.removeEventListener(`message`,this.handleMessage),this.iframe?.remove()}addLog(e){if(this.logs.push(e),this.updateConsoleButton(),this.consoleOpen&&this.consoleLogsRef.value){let t=document.createElement(`div`);t.className=`text-xs font-mono ${e.type===`error`?`text-destructive`:`text-muted-foreground`}`,t.textContent=`[${e.type}] ${e.text}`,this.consoleLogsRef.value.appendChild(t)}}updateConsoleButton(){let e=this.consoleButtonRef.value;if(!e)return;let t=this.logs.filter(e=>e.type===`error`).length;e.innerHTML=`<span>${t>0?`${i(`console`)} <span class="text-destructive">${i(`({count} errors)`)(t)}</span>`:`${i(`console`)} ${i(`({count})`)(this.logs.length)}`}</span><span>${this.consoleOpen?`▼`:`▶`}</span>`}updateIframe(){if(this.iframe||this.createIframe(),this.iframe){this.logs=[],this.consoleLogsRef.value&&(this.consoleLogsRef.value.innerHTML=``),this.updateConsoleButton();let e=`
				<script>
				(function() {
					window.__artifactLogs = [];
					const originalConsole = { log: console.log, error: console.error, warn: console.warn, info: console.info };

					['log', 'error', 'warn', 'info'].forEach(method => {
						console[method] = function(...args) {
							const text = args.map(arg => {
								try { return typeof arg === 'object' ? JSON.stringify(arg) : String(arg); }
								catch { return String(arg); }
							}).join(' ');
							window.__artifactLogs.push({ type: method === 'error' ? 'error' : 'log', text });
							window.parent.postMessage({
								type: 'console',
								method,
								text,
								artifactId: '${this.filename}'
							}, '*');
							originalConsole[method].apply(console, args);
						};
					});

					window.addEventListener('error', (e) => {
						const text = e.message + ' at line ' + e.lineno + ':' + e.colno;
						window.__artifactLogs.push({ type: 'error', text });
						window.parent.postMessage({
							type: 'console',
							method: 'error',
							text,
							artifactId: '${this.filename}'
						}, '*');
					});

					// Capture unhandled promise rejections
					window.addEventListener('unhandledrejection', (e) => {
						const text = 'Unhandled promise rejection: ' + (e.reason?.message || e.reason || 'Unknown error');
						window.__artifactLogs.push({ type: 'error', text });
						window.parent.postMessage({
							type: 'console',
							method: 'error',
							text,
							artifactId: '${this.filename}'
						}, '*');
					});

					// Note: Network errors (404s) for ES module imports cannot be caught
					// due to browser security restrictions. These will only appear in the
					// parent window's console, not in the artifact's logs.

					// Attachment helpers
					window.attachments = ${JSON.stringify(this.attachments)};
					window.listFiles = function() {
						return (window.attachments || []).map(a => ({ id: a.id, fileName: a.fileName, mimeType: a.mimeType, size: a.size }));
					};
					window.readTextFile = function(attachmentId) {
						const a = (window.attachments || []).find(x => x.id === attachmentId);
						if (!a) throw new Error('Attachment not found: ' + attachmentId);
						if (a.extractedText) return a.extractedText;
						try { return atob(a.content); } catch { throw new Error('Failed to decode text content for: ' + attachmentId); }
					};
					window.readBinaryFile = function(attachmentId) {
						const a = (window.attachments || []).find(x => x.id === attachmentId);
						if (!a) throw new Error('Attachment not found: ' + attachmentId);
						const bin = atob(a.content);
						const bytes = new Uint8Array(bin.length);
						for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
						return bytes;
					};
				})();
				<\/script>
			`,t=`
				<script>
				(function() {
					const sendCompletion = function() {
						window.parent.postMessage({
							type: 'execution-complete',
							logs: window.__artifactLogs || [],
							artifactId: '${this.filename}'
						}, '*');
					};

					// Send completion when DOM is ready and all scripts have executed
					if (document.readyState === 'complete' || document.readyState === 'interactive') {
						// DOM is already ready, wait for next tick to ensure all scripts have run
						setTimeout(sendCompletion, 0);
					} else {
						window.addEventListener('DOMContentLoaded', function() {
							// Wait for next tick after DOMContentLoaded to ensure user scripts have run
							setTimeout(sendCompletion, 0);
						});
					}
				})();
				<\/script>
			`,n=this._content,r=`
				<style>
				/* Ensure html and body fill the iframe */
				html { height: 100%; }
				body { min-height: 100%; margin: 0; }
				</style>
			`;n=n.match(/<head[^>]*>/i)?n.replace(/<head[^>]*>/i,t=>`${t}${r}${e}`):r+e+n,n.match(/<\/body>/i)?n=n.replace(/<\/body>/i,`${t}</body>`):n+=t,this.iframe.srcdoc=n}}createIframe(){this.iframe||(this.iframe=document.createElement(`iframe`),this.iframe.sandbox.add(`allow-scripts`),this.iframe.className=`w-full h-full border-0`,this.iframe.title=this.displayTitle||this.filename),this.attachIframeToContainer()}attachIframeToContainer(){!this.iframe||!this.iframeContainerRef.value||this.iframe.parentElement!==this.iframeContainerRef.value&&this.iframeContainerRef.value.appendChild(this.iframe)}toggleConsole(){this.consoleOpen=!this.consoleOpen,this.requestUpdate(),this.consoleOpen&&requestAnimationFrame(()=>{this.consoleLogsRef.value&&(this.consoleLogsRef.value.innerHTML=``,this.logs.forEach(e=>{let t=document.createElement(`div`);t.className=`text-xs font-mono ${e.type===`error`?`text-destructive`:`text-muted-foreground`}`,t.textContent=`[${e.type}] ${e.text}`,this.consoleLogsRef.value.appendChild(t)}))})}getLogs(){return this.logs.length===0?i(`No logs for {filename}`)(this.filename):this.logs.map(e=>`[${e.type}] ${e.text}`).join(`
`)}render(){return f`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-hidden relative">
					<!-- Preview container - always in DOM, just hidden when not active -->
					<div class="absolute inset-0 flex flex-col" style="display: ${this.viewMode===`preview`?`flex`:`none`}">
						<div class="flex-1 relative" ${s(this.iframeContainerRef)}></div>
						${this.logs.length>0?f`
									<div class="border-t border-border">
										<button
											@click=${()=>this.toggleConsole()}
											class="w-full px-3 py-1 text-xs text-left hover:bg-muted flex items-center justify-between"
											${s(this.consoleButtonRef)}
										>
											<span
												>${i(`console`)}
												${this.logs.filter(e=>e.type===`error`).length>0?f`<span class="text-destructive"
															>${i(`({count} errors)`)(this.logs.filter(e=>e.type===`error`).length)}</span
														>`:i(`({count})`)(this.logs.length)}</span
											>
											<span>${this.consoleOpen?`▼`:`▶`}</span>
										</button>
										${this.consoleOpen?f` <div class="max-h-48 overflow-y-auto bg-muted/50 p-2" ${s(this.consoleLogsRef)}></div> `:``}
									</div>
								`:``}
					</div>

					<!-- Code view - always in DOM, just hidden when not active -->
					<div class="absolute inset-0 overflow-auto bg-background" style="display: ${this.viewMode===`code`?`block`:`none`}">
						<pre class="m-0 p-4 text-xs"><code class="hljs language-html">${l(p.highlight(this._content,{language:`html`}).value)}</code></pre>
					</div>
				</div>
			</div>
		`}};t([c()],b.prototype,`filename`,void 0),t([c({attribute:!1})],b.prototype,`displayTitle`,void 0),t([c({attribute:!1})],b.prototype,`attachments`,void 0),t([u()],b.prototype,`viewMode`,void 0),t([u()],b.prototype,`consoleOpen`,void 0),b=t([d(`html-artifact`)],b);let x=class extends y{constructor(...e){super(...e),this.filename=``,this.displayTitle=``,this._content=``,this.viewMode=`preview`}get content(){return this._content}set content(e){this._content=e,this.requestUpdate()}createRenderRoot(){return this}setViewMode(e){this.viewMode=e}getHeaderButtons(){return f`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${e=>this.setViewMode(e.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title=${i(`Copy Markdown`)} .showText=${!1}></copy-button>
				${v({content:this._content,filename:this.filename,mimeType:`text/markdown`,title:i(`Download Markdown`)})}
			</div>
		`}render(){return f`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode===`preview`?f`<div class="p-4"><markdown-block .content=${this.content}></markdown-block></div>`:f`<pre class="m-0 p-4 text-xs whitespace-pre-wrap break-words"><code class="hljs language-markdown">${l(p.highlight(this.content,{language:`markdown`,ignoreIllegals:!0}).value)}</code></pre>`}
				</div>
			</div>
		`}};t([c()],x.prototype,`filename`,void 0),t([c({attribute:!1})],x.prototype,`displayTitle`,void 0),t([u()],x.prototype,`viewMode`,void 0),x=t([d(`markdown-artifact`)],x);let S=class extends y{constructor(...e){super(...e),this.filename=``,this.displayTitle=``,this._content=``,this.viewMode=`preview`}get content(){return this._content}set content(e){this._content=e,this.requestUpdate()}createRenderRoot(){return this}setViewMode(e){this.viewMode=e}getHeaderButtons(){return f`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${e=>this.setViewMode(e.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title="${i(`Copy SVG`)}" .showText=${!1}></copy-button>
				${v({content:this._content,filename:this.filename,mimeType:`image/svg+xml`,title:i(`Download SVG`)})}
			</div>
		`}render(){return f`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode===`preview`?f`<div class="h-full flex items-center justify-center">
								${l(this.content.replace(/<svg(\s|>)/i,(e,t)=>`<svg class="w-full h-full"${t}`))}
							</div>`:f`<pre class="m-0 p-4 text-xs"><code class="hljs language-xml">${l(p.highlight(this.content,{language:`xml`,ignoreIllegals:!0}).value)}</code></pre>`}
				</div>
			</div>
		`}};t([c()],S.prototype,`filename`,void 0),t([c({attribute:!1})],S.prototype,`displayTitle`,void 0),t([u()],S.prototype,`viewMode`,void 0),S=t([d(`svg-artifact`)],S);const C=`js.javascript.ts.typescript.jsx.tsx.py.python.java.c.cpp.cs.php.rb.ruby.go.rust.swift.kotlin.scala.dart.html.css.scss.sass.less.json.xml.yaml.yml.toml.sql.sh.bash.ps1.bat.r.matlab.julia.lua.perl.vue.svelte`.split(`.`);let w=class extends y{constructor(...e){super(...e),this.filename=``,this.displayTitle=``,this._content=``}get content(){return this._content}set content(e){this._content=e,this.requestUpdate()}createRenderRoot(){return this}isCode(){let e=this.filename.split(`.`).pop()?.toLowerCase()||``;return C.includes(e)}getLanguageFromExtension(e){return{js:`javascript`,ts:`typescript`,py:`python`,rb:`ruby`,yml:`yaml`,ps1:`powershell`,bat:`batch`}[e]||e}getMimeType(){let e=this.filename.split(`.`).pop()?.toLowerCase()||``;return e===`svg`?`image/svg+xml`:e===`md`||e===`markdown`?`text/markdown`:`text/plain`}getHeaderButtons(){return f`
			<div class="flex items-center gap-1">
				<copy-button .text=${this.content} title="${i(`Copy`)}" .showText=${!1}></copy-button>
				${v({content:this.content,filename:this.filename,mimeType:this.getMimeType(),title:i(`Download`)})}
			</div>
		`}render(){let e=this.isCode(),t=this.filename.split(`.`).pop()||``;return f`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${e?f`
								<pre class="m-0 p-4 text-xs"><code class="hljs language-${this.getLanguageFromExtension(t.toLowerCase())}">${l(p.highlight(this.content,{language:this.getLanguageFromExtension(t.toLowerCase()),ignoreIllegals:!0}).value)}</code></pre>
							`:f` <pre class="m-0 p-4 text-xs font-mono">${this.content}</pre> `}
				</div>
			</div>
		`}};t([c()],w.prototype,`filename`,void 0),t([c({attribute:!1})],w.prototype,`displayTitle`,void 0),w=t([d(`text-artifact`)],w);const T=h.Object({command:m([`create`,`update`,`rewrite`,`get`,`delete`,`logs`],{description:`The operation to perform`}),filename:h.String({description:`Filename including extension (e.g., 'index.html', 'script.js')`}),content:h.Optional(h.String({description:`File content`})),old_str:h.Optional(h.String({description:`String to replace (for update command)`})),new_str:h.Optional(h.String({description:`Replacement string (for update command)`}))});function E(e){return f`<div class="text-xs text-muted-foreground whitespace-pre-wrap font-mono">${e}</div>`}let D=class extends r{constructor(...e){super(...e),this._artifacts=new Map,this._activeFilename=null,this.artifactElements=new Map,this.contentRef=n(),this.collapsed=!1,this.overlay=!1}get artifacts(){return this._artifacts}createRenderRoot(){return this}connectedCallback(){super.connectedCallback(),this.style.display=`block`,requestAnimationFrame(()=>{let e=this.contentRef.value;e&&(!this._activeFilename&&this._artifacts.size>0&&(this._activeFilename=Array.from(this._artifacts.keys())[0]),this.artifactElements.forEach((t,n)=>{t.parentElement||e.appendChild(t),t.style.display=n===this._activeFilename?`block`:`none`}))})}disconnectedCallback(){super.disconnectedCallback()}getFileType(e){let t=e.split(`.`).pop()?.toLowerCase();return t===`html`?`html`:t===`svg`?`svg`:t===`md`||t===`markdown`?`markdown`:`text`}getLanguageFromFilename(e){return e&&{js:`javascript`,jsx:`javascript`,ts:`typescript`,tsx:`typescript`,html:`html`,css:`css`,scss:`scss`,json:`json`,py:`python`,md:`markdown`,svg:`xml`,xml:`xml`,yaml:`yaml`,yml:`yaml`,sh:`bash`,bash:`bash`,sql:`sql`,java:`java`,c:`c`,cpp:`cpp`,cs:`csharp`,go:`go`,rs:`rust`,php:`php`,rb:`ruby`,swift:`swift`,kt:`kotlin`,r:`r`}[e.split(`.`).pop()?.toLowerCase()||``]||`text`}getOrCreateArtifactElement(e,t,n){let r=this.artifactElements.get(e);if(r)r.content=t,r.displayTitle=n,r instanceof b&&(r.attachments=this.attachmentsProvider?.()||[]);else{let i=this.getFileType(e);i===`html`?(r=new b,r.attachments=this.attachmentsProvider?.()||[]):r=i===`svg`?new S:i===`markdown`?new x:new w,r.filename=e,r.displayTitle=n,r.content=t,r.style.display=`none`,r.style.height=`100%`,this.artifactElements.set(e,r);let a=r;requestAnimationFrame(()=>{this.contentRef.value&&!a.parentElement&&this.contentRef.value.appendChild(a)})}return r}showArtifact(e){requestAnimationFrame(()=>{this.artifactElements.forEach((t,n)=>{this.contentRef.value&&!t.parentElement&&this.contentRef.value.appendChild(t),t.style.display=n===e?`block`:`none`})}),this._activeFilename=e,this.requestUpdate()}openArtifact(e){this._artifacts.has(e)&&(this.showArtifact(e),this.onOpen?.())}get tool(){return{label:`Artifacts`,name:`artifacts`,description:`Creates and manages file artifacts. Each artifact is a file with a filename and content.

IMPORTANT: Always prefer updating existing files over creating new ones. Check available files first.

Commands:
1. create: Create a new file
   - filename: Name with extension (required, e.g., 'index.html', 'script.js', 'README.md')
   - title: Display name for the tab (optional, defaults to filename)
   - content: File content (required)

2. update: Update part of an existing file
   - filename: File to update (required)
   - old_str: Exact string to replace (required)
   - new_str: Replacement string (required)

3. rewrite: Completely replace a file's content
   - filename: File to rewrite (required)
   - content: New content (required)
   - title: Optionally update display title

4. get: Retrieve the full content of a file
   - filename: File to retrieve (required)
   - Returns the complete file content

5. delete: Delete a file
   - filename: File to delete (required)

6. logs: Get console logs and errors (HTML files only)
   - filename: HTML file to get logs for (required)
   - Returns all console output and runtime errors

For text/html artifacts with attachments:
- HTML artifacts automatically have access to user attachments via JavaScript
- Available global functions in HTML artifacts:
  * listFiles() - Returns array of {id, fileName, mimeType, size} for all attachments
  * readTextFile(attachmentId) - Returns text content of attachment (for CSV, JSON, text files)
  * readBinaryFile(attachmentId) - Returns Uint8Array of binary data (for images, Excel, etc.)
- Example HTML artifact that processes a CSV attachment:
  <script>
    // List available files
    const files = listFiles();
    console.log('Available files:', files);

    // Find CSV file
    const csvFile = files.find(f => f.mimeType === 'text/csv');
    if (csvFile) {
      const csvContent = readTextFile(csvFile.id);
      // Process CSV data...
    }

    // Display image
    const imageFile = files.find(f => f.mimeType.startsWith('image/'));
    if (imageFile) {
      const bytes = readBinaryFile(imageFile.id);
      const blob = new Blob([bytes], {type: imageFile.mimeType});
      const url = URL.createObjectURL(blob);
      document.body.innerHTML = '<img src="' + url + '">';
    }
  <\/script>

For text/html artifacts:
- Must be a single self-contained file
- External scripts: Use CDNs like https://esm.sh, https://unpkg.com, or https://cdnjs.cloudflare.com
- Preferred: Use https://esm.sh for npm packages (e.g., https://esm.sh/three for Three.js)
- For ES modules, use: <script type="module">import * as THREE from 'https://esm.sh/three';<\/script>
- For Three.js specifically: import from 'https://esm.sh/three' or 'https://esm.sh/three@0.160.0'
- For addons: import from 'https://esm.sh/three/examples/jsm/controls/OrbitControls.js'
- No localStorage/sessionStorage - use in-memory variables only
- CSS should be included inline
- CRITICAL REMINDER FOR HTML ARTIFACTS:
	- ALWAYS set a background color inline in <style> or directly on body element
	- Failure to set a background color is a COMPLIANCE ERROR
	- Background color MUST be explicitly defined to ensure visibility and proper rendering
- Can embed base64 images directly in img tags
- Ensure the layout is responsive as the iframe might be resized
- Note: Network errors (404s) for external scripts may not be captured in logs due to browser security

For application/vnd.ant.code artifacts:
- Include the language parameter for syntax highlighting
- Supports all major programming languages

For text/markdown:
- Standard markdown syntax
- Will be rendered with full formatting
- Can include base64 images using markdown syntax

For image/svg+xml:
- Complete SVG markup
- Will be rendered inline
- Can embed raster images as base64 in SVG`,parameters:T,execute:async(e,t,n)=>({output:await this.executeCommand(t),details:void 0})}}renderParams(e,t){if(t&&!e.command)return f`<div class="text-sm text-muted-foreground">${i(`Processing artifact...`)}</div>`;let n=i(`Processing`);if(e.command)switch(e.command){case`create`:n=i(`Create`);break;case`update`:n=i(`Update`);break;case`rewrite`:n=i(`Rewrite`);break;case`get`:n=i(`Get`);break;case`delete`:n=i(`Delete`);break;case`logs`:n=i(`Get logs`);break;default:n=e.command.charAt(0).toUpperCase()+e.command.slice(1)}let r=e.filename||``;switch(e.command){case`create`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<div>
							<span class="font-medium">${i(`Create`)}</span>
							<span class="text-muted-foreground ml-1">${r}</span>
						</div>
						${e.content?f`<code-block
									.code=${e.content}
									language=${this.getLanguageFromFilename(e.filename)}
									class="mt-2"
								></code-block>`:``}
					</div>
				`;case`update`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<div>
							<span class="font-medium">${i(`Update`)}</span>
							<span class="text-muted-foreground ml-1">${r}</span>
						</div>
						${e.old_str!==void 0&&e.new_str!==void 0?_({oldText:e.old_str,newText:e.new_str,className:`mt-2`}):``}
					</div>
				`;case`rewrite`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<div>
							<span class="font-medium">${i(`Rewrite`)}</span>
							<span class="text-muted-foreground ml-1">${r}</span>
						</div>
						${e.content?f`<code-block
									.code=${e.content}
									language=${this.getLanguageFromFilename(e.filename)}
									class="mt-2"
								></code-block>`:``}
					</div>
				`;case`get`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<span class="font-medium">${i(`Get`)}</span>
						<span class="text-muted-foreground ml-1">${r}</span>
					</div>
				`;case`delete`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<span class="font-medium">${i(`Delete`)}</span>
						<span class="text-muted-foreground ml-1">${r}</span>
					</div>
				`;case`logs`:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<span class="font-medium">${i(`Get logs`)}</span>
						<span class="text-muted-foreground ml-1">${r}</span>
					</div>
				`;default:return f`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${()=>this.openArtifact(e.filename)}
					>
						<span class="font-medium">${n}</span>
						<span class="text-muted-foreground ml-1">${r}</span>
					</div>
				`}}renderResult(e,t){let n=t.output||i(`(no output)`);return f`
			<div class="cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1" @click=${()=>this.openArtifact(e.filename)}>
				${E(n)}
			</div>
		`}async reconstructFromMessages(e){let t=new Map,n=`artifacts`;for(let r of e)if(r.role===`assistant`)for(let e of r.content)e.type===`toolCall`&&e.name===n&&t.set(e.id,e);let r=[];for(let i of e)if(i.role===`toolResult`&&i.toolName===n&&!i.isError){let e=i.toolCallId,n=t.get(e);if(!n)continue;let a=n.arguments;if(a.command===`get`||a.command===`logs`)continue;r.push(a)}let i=new Map;for(let e of r){let t=e.filename;switch(e.command){case`create`:e.content&&i.set(t,{filename:t,content:e.content});break;case`rewrite`:e.content&&i.set(t,{filename:t,content:e.content});break;case`update`:{let n=i.get(t);if(!n)break;e.old_str!==void 0&&e.new_str!==void 0&&(n.content=n.content.replace(e.old_str,e.new_str),i.set(t,n));break}case`delete`:i.delete(t);break;case`get`:case`logs`:break}}this._artifacts.clear(),this.artifactElements.forEach(e=>{e.remove()}),this.artifactElements.clear(),this._activeFilename=null,this._artifacts=new Map(this._artifacts);for(let[e,{content:t}]of i.entries()){let n={command:`create`,filename:e,content:t};try{await this.createArtifact(n,{skipWait:!0,silent:!0})}catch{}}!this._activeFilename&&this._artifacts.size>0&&this.showArtifact(Array.from(this._artifacts.keys())[0]),this.onArtifactsChange?.(),this.requestUpdate()}async executeCommand(e,t={}){switch(e.command){case`create`:return await this.createArtifact(e,t);case`update`:return await this.updateArtifact(e,t);case`rewrite`:return await this.rewriteArtifact(e,t);case`get`:return this.getArtifact(e);case`delete`:return this.deleteArtifact(e);case`logs`:return this.getLogs(e);default:return i(`Error: Unknown command {command}`)(e.command)}}async waitForHtmlExecution(e){let t=this.artifactElements.get(e);return t instanceof b?new Promise(n=>{let r=!1,a=o=>{if(o.data?.type===`execution-complete`&&o.data?.artifactId===e&&!r){r=!0,window.removeEventListener(`message`,a);let o=t.getLogs();o.includes(`[error]`)?n(i(`

Execution completed with errors:
{logs}`)(o)):o===i(`No logs for {filename}`)(e)?n(``):n(i(`

Execution logs:
{logs}`)(o))}};window.addEventListener(`message`,a),setTimeout(()=>{if(!r){r=!0,window.removeEventListener(`message`,a);let o=t.getLogs();o.includes(`[error]`)?n(i(`

Execution timed out with errors:
{logs}`)(o)):o===i(`No logs for {filename}`)(e)?n(``):n(i(`

Execution timed out. Partial logs:
{logs}`)(o))}},1500)}):``}async createArtifact(e,t={}){if(!e.filename||!e.content)return i(`Error: create command requires filename and content`);if(this._artifacts.has(e.filename))return i(`Error: File {filename} already exists`)(e.filename);let n=e.filename,r={filename:e.filename,title:n,content:e.content,createdAt:new Date,updatedAt:new Date};this._artifacts.set(e.filename,r),this._artifacts=new Map(this._artifacts),this.getOrCreateArtifactElement(e.filename,e.content,n),t.silent||(this.showArtifact(e.filename),this.onArtifactsChange?.(),this.requestUpdate());let a=i(`Created file {filename}`)(e.filename);if(this.getFileType(e.filename)===`html`&&!t.skipWait){let t=await this.waitForHtmlExecution(e.filename);a+=t}return a}async updateArtifact(e,t={}){let n=this._artifacts.get(e.filename);if(!n){let t=Array.from(this._artifacts.keys());return t.length===0?i(`Error: File {filename} not found. No files have been created yet.`)(e.filename):i(`Error: File {filename} not found. Available files: {files}`)(e.filename,t.join(`, `))}if(!e.old_str||e.new_str===void 0)return i(`Error: update command requires old_str and new_str`);if(!n.content.includes(e.old_str))return i(`Error: String not found in file. Here is the full content:

{content}`)(n.content);n.content=n.content.replace(e.old_str,e.new_str),n.updatedAt=new Date,this._artifacts.set(e.filename,n),this.getOrCreateArtifactElement(e.filename,n.content,n.title),t.silent||(this.onArtifactsChange?.(),this.requestUpdate(),this.requestUpdate());let r=i(`Updated file {filename}`)(e.filename);if(this.getFileType(e.filename)===`html`&&!t.skipWait){let t=await this.waitForHtmlExecution(e.filename);r+=t}return r}async rewriteArtifact(e,t={}){let n=this._artifacts.get(e.filename);if(!n){let t=Array.from(this._artifacts.keys());return t.length===0?i(`Error: File {filename} not found. No files have been created yet.`)(e.filename):i(`Error: File {filename} not found. Available files: {files}`)(e.filename,t.join(`, `))}if(!e.content)return i(`Error: rewrite command requires content`);n.content=e.content,n.updatedAt=new Date,this._artifacts.set(e.filename,n),this.getOrCreateArtifactElement(e.filename,n.content,n.title),t.silent||this.onArtifactsChange?.();let r=i(`Rewrote file {filename}`)(e.filename);if(this.getFileType(e.filename)===`html`&&!t.skipWait){let t=await this.waitForHtmlExecution(e.filename);r+=t}return r}getArtifact(e){let t=this._artifacts.get(e.filename);if(!t){let t=Array.from(this._artifacts.keys());return t.length===0?i(`Error: File {filename} not found. No files have been created yet.`)(e.filename):i(`Error: File {filename} not found. Available files: {files}`)(e.filename,t.join(`, `))}return t.content}deleteArtifact(e){if(!this._artifacts.get(e.filename)){let t=Array.from(this._artifacts.keys());return t.length===0?i(`Error: File {filename} not found. No files have been created yet.`)(e.filename):i(`Error: File {filename} not found. Available files: {files}`)(e.filename,t.join(`, `))}this._artifacts.delete(e.filename),this._artifacts=new Map(this._artifacts);let t=this.artifactElements.get(e.filename);if(t&&(t.remove(),this.artifactElements.delete(e.filename)),this._activeFilename===e.filename){let e=Array.from(this._artifacts.keys());e.length>0?this.showArtifact(e[0]):(this._activeFilename=null,this.requestUpdate())}return this.onArtifactsChange?.(),this.requestUpdate(),i(`Deleted file {filename}`)(e.filename)}getLogs(e){let t=this.artifactElements.get(e.filename);if(!t){let t=Array.from(this._artifacts.keys());return t.length===0?i(`Error: File {filename} not found. No files have been created yet.`)(e.filename):i(`Error: File {filename} not found. Available files: {files}`)(e.filename,t.join(`, `))}return t instanceof b?t.getLogs():i(`Error: File {filename} is not an HTML file. Logs are only available for HTML files.`)(e.filename)}render(){let t=Array.from(this._artifacts.values()),n=t.length>0&&!this.collapsed;return f`
			<!-- Floating reopen pill when collapsed and artifacts exist -->
			${this.collapsed&&t.length>0?f`
						<button
							class="absolute z-30 top-4 left-1/2 -translate-x-1/2"
							@click=${()=>this.onOpen?.()}
							title=${i(`Show artifacts`)}
						>
							${g(f`
								<span class="inline-flex items-center gap-1">
									<span>${i(`Artifacts`)}</span>
									${t.length>1?f`<span
												class="text-[10px] leading-none bg-primary-foreground/20 text-primary-foreground rounded px-1 font-mono tabular-nums"
												>${t.length}</span
											>`:``}
								</span>
							`)}
						</button>
					`:``}

			<!-- Panel container -->
			<div
				class="${n?``:`hidden`} ${this.overlay?`fixed inset-0 z-40`:`relative`} h-full flex flex-col bg-card text-card-foreground border border-border overflow-hidden"
			>
				<!-- Tab bar (always shown when there are artifacts) -->
				<div class="flex items-center justify-between border-b border-border bg-muted/50">
					<div class="flex overflow-x-auto">
						${t.map(e=>{let t=e.filename===this._activeFilename?`border-primary text-primary`:`border-transparent text-muted-foreground hover:text-foreground`;return f`
								<button
									class="px-3 py-2 text-sm whitespace-nowrap border-b-2 ${t}"
									@click=${()=>this.showArtifact(e.filename)}
								>
									<span class="font-mono text-sm">${e.filename}</span>
								</button>
							`})}
					</div>
					<div class="flex items-center gap-1 px-2">
						${(()=>{let e=this._activeFilename?this.artifactElements.get(this._activeFilename):void 0;return e?e.getHeaderButtons():``})()}
						${e({variant:`ghost`,size:`sm`,onClick:()=>this.onClose?.(),title:i(`Close artifacts`),children:a(`sm`)})}
					</div>
				</div>

				<!-- Content area where artifact elements are added programmatically -->
				<div class="flex-1 overflow-hidden" ${s(this.contentRef)}></div>
			</div>
		`}};t([u()],D.prototype,`_artifacts`,void 0),t([u()],D.prototype,`_activeFilename`,void 0),t([c({attribute:!1})],D.prototype,`attachmentsProvider`,void 0),t([c({attribute:!1})],D.prototype,`onArtifactsChange`,void 0),t([c({attribute:!1})],D.prototype,`onClose`,void 0),t([c({attribute:!1})],D.prototype,`onOpen`,void 0),t([c({type:Boolean})],D.prototype,`collapsed`,void 0),t([c({type:Boolean})],D.prototype,`overlay`,void 0),D=t([d(`artifacts-panel`)],D);export{D as ArtifactsPanel};