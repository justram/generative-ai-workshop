import {
  i as i2,
  o as o2
} from "../chunks/chunk-KUWO6TGG.js";
import {
  IP,
  Pi,
  VP,
  _r,
  bR,
  m,
  u,
  v,
  yt
} from "../chunks/chunk-UHFKU6VN.js";
import {
  Button,
  Diff,
  __decorate,
  b,
  e3 as e,
  i,
  i18n,
  iconCloseLine,
  iconCodeView,
  iconDownloadLine,
  iconEyeLine,
  n,
  n2,
  o,
  r,
  t2 as t
} from "../chunks/chunk-56RMHZX3.js";

// src/workshop-runtime/PreviewCodeToggle-BU28TKE5.js
var c = class extends i {
  constructor(...e2) {
    super(...e2), this.mode = `preview`;
  }
  createRenderRoot() {
    return this;
  }
  setMode(e2) {
    this.mode !== e2 && (this.mode = e2, this.dispatchEvent(
      new CustomEvent(`mode-change`, { detail: this.mode, bubbles: true })
    ));
  }
  render() {
    let e2 = this.mode === `preview`;
    return b`
			<div class="inline-flex items-center h-7 rounded-md overflow-hidden border border-border bg-muted/60">
				<button
					class="px-2 h-full flex items-center ${e2 ? `bg-card text-foreground` : `text-muted-foreground hover:text-accent-foreground`}"
					@click=${() => this.setMode(`preview`)}
					title="${i18n(`Preview`)}"
				>
					${iconEyeLine(`sm`)}
				</button>
				<button
					class="px-2 h-full flex items-center ${e2 ? `text-muted-foreground hover:text-accent-foreground` : `bg-card text-foreground`}"
					@click=${() => this.setMode(`code`)}
					title="${i18n(`Code`)}"
				>
					${iconCodeView(`sm`)}
				</button>
			</div>
		`;
  }
};
__decorate([n({ reflect: false })], c.prototype, `mode`, void 0), c = __decorate([t(`preview-code-toggle`)], c);

// src/workshop-runtime/artifacts-BhLRFxu0.js
function v2({
  content: t2,
  filename: n3,
  mimeType: r2 = `text/plain`,
  title: a = i18n(`Download`),
  showText: s = false
}) {
  return Button({
    variant: `ghost`,
    size: `sm`,
    onClick: () => {
      let e2 = new Blob([t2], { type: r2 }), i3 = URL.createObjectURL(e2), a2 = document.createElement(`a`);
      a2.href = i3, a2.download = n3, a2.click(), URL.revokeObjectURL(i3);
    },
    title: a,
    children: b` ${iconDownloadLine(`sm`)} ${s ? b`<span>${i18n(`Download`)}</span>` : ``} `
  });
}
var y = class extends i {
  constructor(...e2) {
    super(...e2), this.filename = ``, this.displayTitle = ``;
  }
  createRenderRoot() {
    return this;
  }
};
var b2 = class extends y {
  constructor(...e2) {
    super(...e2), this.filename = ``, this.displayTitle = ``, this.attachments = [], this._content = ``, this.logs = [], this.iframeContainerRef = e(), this.consoleLogsRef = e(), this.consoleButtonRef = e(), this.viewMode = `preview`, this.consoleOpen = false, this.handleMessage = (e3) => {
      e3.data.artifactId === this.filename && (e3.data.type === `console` ? this.addLog({
        type: e3.data.method === `error` ? `error` : `log`,
        text: e3.data.text
      }) : e3.data.type === `execution-complete` && (this.logs = e3.data.logs || [], this.updateConsoleButton(), this.iframe && (this.iframe.style.display = `none`, this.iframe.offsetHeight, this.iframe.style.display = ``)));
    };
  }
  setViewMode(e2) {
    this.viewMode = e2;
  }
  getHeaderButtons() {
    return b`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${(e2) => this.setViewMode(e2.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title="${i18n(`Copy HTML`)}" .showText=${false}></copy-button>
				${v2({ content: this._content, filename: this.filename, mimeType: `text/html`, title: i18n(`Download HTML`) })}
			</div>
		`;
  }
  set content(e2) {
    let t2 = this._content;
    this._content = e2, t2 !== e2 && requestAnimationFrame(async () => {
      this.requestUpdate(), await this.updateComplete, this.updateIframe(), requestAnimationFrame(() => {
        this.attachIframeToContainer();
      });
    });
  }
  get content() {
    return this._content;
  }
  connectedCallback() {
    super.connectedCallback(), window.addEventListener(`message`, this.handleMessage);
  }
  firstUpdated() {
    this._content && (this.updateIframe(), requestAnimationFrame(() => {
      this.attachIframeToContainer();
    }));
  }
  updated() {
    this.iframe && !this.iframe.parentElement && this.attachIframeToContainer();
  }
  disconnectedCallback() {
    super.disconnectedCallback(), window.removeEventListener(`message`, this.handleMessage), this.iframe?.remove();
  }
  addLog(e2) {
    if (this.logs.push(e2), this.updateConsoleButton(), this.consoleOpen && this.consoleLogsRef.value) {
      let t2 = document.createElement(`div`);
      t2.className = `text-xs font-mono ${e2.type === `error` ? `text-destructive` : `text-muted-foreground`}`, t2.textContent = `[${e2.type}] ${e2.text}`, this.consoleLogsRef.value.appendChild(t2);
    }
  }
  updateConsoleButton() {
    let e2 = this.consoleButtonRef.value;
    if (!e2) return;
    let t2 = this.logs.filter((e3) => e3.type === `error`).length;
    e2.innerHTML = `<span>${t2 > 0 ? `${i18n(`console`)} <span class="text-destructive">${i18n(`({count} errors)`)(t2)}</span>` : `${i18n(`console`)} ${i18n(`({count})`)(this.logs.length)}`}</span><span>${this.consoleOpen ? `\u25BC` : `\u25B6`}</span>`;
  }
  updateIframe() {
    if (this.iframe || this.createIframe(), this.iframe) {
      this.logs = [], this.consoleLogsRef.value && (this.consoleLogsRef.value.innerHTML = ``), this.updateConsoleButton();
      let e2 = `
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
			`, t2 = `
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
			`, n3 = this._content, r2 = `
				<style>
				/* Ensure html and body fill the iframe */
				html { height: 100%; }
				body { min-height: 100%; margin: 0; }
				</style>
			`;
      n3 = n3.match(/<head[^>]*>/i) ? n3.replace(/<head[^>]*>/i, (t3) => `${t3}${r2}${e2}`) : r2 + e2 + n3, n3.match(/<\/body>/i) ? n3 = n3.replace(/<\/body>/i, `${t2}</body>`) : n3 += t2, this.iframe.srcdoc = n3;
    }
  }
  createIframe() {
    this.iframe || (this.iframe = document.createElement(`iframe`), this.iframe.sandbox.add(`allow-scripts`), this.iframe.className = `w-full h-full border-0`, this.iframe.title = this.displayTitle || this.filename), this.attachIframeToContainer();
  }
  attachIframeToContainer() {
    !this.iframe || !this.iframeContainerRef.value || this.iframe.parentElement !== this.iframeContainerRef.value && this.iframeContainerRef.value.appendChild(this.iframe);
  }
  toggleConsole() {
    this.consoleOpen = !this.consoleOpen, this.requestUpdate(), this.consoleOpen && requestAnimationFrame(() => {
      this.consoleLogsRef.value && (this.consoleLogsRef.value.innerHTML = ``, this.logs.forEach((e2) => {
        let t2 = document.createElement(`div`);
        t2.className = `text-xs font-mono ${e2.type === `error` ? `text-destructive` : `text-muted-foreground`}`, t2.textContent = `[${e2.type}] ${e2.text}`, this.consoleLogsRef.value.appendChild(t2);
      }));
    });
  }
  getLogs() {
    return this.logs.length === 0 ? i18n(`No logs for {filename}`)(this.filename) : this.logs.map((e2) => `[${e2.type}] ${e2.text}`).join(`
`);
  }
  render() {
    return b`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-hidden relative">
					<!-- Preview container - always in DOM, just hidden when not active -->
					<div class="absolute inset-0 flex flex-col" style="display: ${this.viewMode === `preview` ? `flex` : `none`}">
						<div class="flex-1 relative" ${n2(this.iframeContainerRef)}></div>
						${this.logs.length > 0 ? b`
									<div class="border-t border-border">
										<button
											@click=${() => this.toggleConsole()}
											class="w-full px-3 py-1 text-xs text-left hover:bg-muted flex items-center justify-between"
											${n2(this.consoleButtonRef)}
										>
											<span
												>${i18n(`console`)}
												${this.logs.filter((e2) => e2.type === `error`).length > 0 ? b`<span class="text-destructive"
															>${i18n(`({count} errors)`)(this.logs.filter((e2) => e2.type === `error`).length)}</span
														>` : i18n(`({count})`)(this.logs.length)}</span
											>
											<span>${this.consoleOpen ? `\u25BC` : `\u25B6`}</span>
										</button>
										${this.consoleOpen ? b` <div class="max-h-48 overflow-y-auto bg-muted/50 p-2" ${n2(this.consoleLogsRef)}></div> ` : ``}
									</div>
								` : ``}
					</div>

					<!-- Code view - always in DOM, just hidden when not active -->
					<div class="absolute inset-0 overflow-auto bg-background" style="display: ${this.viewMode === `code` ? `block` : `none`}">
						<pre class="m-0 p-4 text-xs"><code class="hljs language-html">${o(_r.highlight(this._content, { language: `html` }).value)}</code></pre>
					</div>
				</div>
			</div>
		`;
  }
};
__decorate([n()], b2.prototype, `filename`, void 0), __decorate([n({ attribute: false })], b2.prototype, `displayTitle`, void 0), __decorate([n({ attribute: false })], b2.prototype, `attachments`, void 0), __decorate([r()], b2.prototype, `viewMode`, void 0), __decorate([r()], b2.prototype, `consoleOpen`, void 0), b2 = __decorate([t(`html-artifact`)], b2);
var x = class extends y {
  constructor(...e2) {
    super(...e2), this.filename = ``, this.displayTitle = ``, this._content = ``, this.viewMode = `preview`;
  }
  get content() {
    return this._content;
  }
  set content(e2) {
    this._content = e2, this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }
  setViewMode(e2) {
    this.viewMode = e2;
  }
  getHeaderButtons() {
    return b`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${(e2) => this.setViewMode(e2.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title=${i18n(`Copy Markdown`)} .showText=${false}></copy-button>
				${v2({ content: this._content, filename: this.filename, mimeType: `text/markdown`, title: i18n(`Download Markdown`) })}
			</div>
		`;
  }
  render() {
    return b`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode === `preview` ? b`<div class="p-4"><markdown-block .content=${this.content}></markdown-block></div>` : b`<pre class="m-0 p-4 text-xs whitespace-pre-wrap break-words"><code class="hljs language-markdown">${o(_r.highlight(this.content, { language: `markdown`, ignoreIllegals: true }).value)}</code></pre>`}
				</div>
			</div>
		`;
  }
};
__decorate([n()], x.prototype, `filename`, void 0), __decorate([n({ attribute: false })], x.prototype, `displayTitle`, void 0), __decorate([r()], x.prototype, `viewMode`, void 0), x = __decorate([t(`markdown-artifact`)], x);
var S = class extends y {
  constructor(...e2) {
    super(...e2), this.filename = ``, this.displayTitle = ``, this._content = ``, this.viewMode = `preview`;
  }
  get content() {
    return this._content;
  }
  set content(e2) {
    this._content = e2, this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }
  setViewMode(e2) {
    this.viewMode = e2;
  }
  getHeaderButtons() {
    return b`
			<div class="flex items-center gap-2">
				<preview-code-toggle
					.mode=${this.viewMode}
					@mode-change=${(e2) => this.setViewMode(e2.detail)}
				></preview-code-toggle>
				<copy-button .text=${this._content} title="${i18n(`Copy SVG`)}" .showText=${false}></copy-button>
				${v2({ content: this._content, filename: this.filename, mimeType: `image/svg+xml`, title: i18n(`Download SVG`) })}
			</div>
		`;
  }
  render() {
    return b`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${this.viewMode === `preview` ? b`<div class="h-full flex items-center justify-center">
								${o(this.content.replace(/<svg(\s|>)/i, (e2, t2) => `<svg class="w-full h-full"${t2}`))}
							</div>` : b`<pre class="m-0 p-4 text-xs"><code class="hljs language-xml">${o(_r.highlight(this.content, { language: `xml`, ignoreIllegals: true }).value)}</code></pre>`}
				</div>
			</div>
		`;
  }
};
__decorate([n()], S.prototype, `filename`, void 0), __decorate([n({ attribute: false })], S.prototype, `displayTitle`, void 0), __decorate([r()], S.prototype, `viewMode`, void 0), S = __decorate([t(`svg-artifact`)], S);
var C = `js.javascript.ts.typescript.jsx.tsx.py.python.java.c.cpp.cs.php.rb.ruby.go.rust.swift.kotlin.scala.dart.html.css.scss.sass.less.json.xml.yaml.yml.toml.sql.sh.bash.ps1.bat.r.matlab.julia.lua.perl.vue.svelte`.split(
  `.`
);
var w = class extends y {
  constructor(...e2) {
    super(...e2), this.filename = ``, this.displayTitle = ``, this._content = ``;
  }
  get content() {
    return this._content;
  }
  set content(e2) {
    this._content = e2, this.requestUpdate();
  }
  createRenderRoot() {
    return this;
  }
  isCode() {
    let e2 = this.filename.split(`.`).pop()?.toLowerCase() || ``;
    return C.includes(e2);
  }
  getLanguageFromExtension(e2) {
    return {
      js: `javascript`,
      ts: `typescript`,
      py: `python`,
      rb: `ruby`,
      yml: `yaml`,
      ps1: `powershell`,
      bat: `batch`
    }[e2] || e2;
  }
  getMimeType() {
    let e2 = this.filename.split(`.`).pop()?.toLowerCase() || ``;
    return e2 === `svg` ? `image/svg+xml` : e2 === `md` || e2 === `markdown` ? `text/markdown` : `text/plain`;
  }
  getHeaderButtons() {
    return b`
			<div class="flex items-center gap-1">
				<copy-button .text=${this.content} title="${i18n(`Copy`)}" .showText=${false}></copy-button>
				${v2({ content: this.content, filename: this.filename, mimeType: this.getMimeType(), title: i18n(`Download`) })}
			</div>
		`;
  }
  render() {
    let e2 = this.isCode(), t2 = this.filename.split(`.`).pop() || ``;
    return b`
			<div class="h-full flex flex-col">
				<div class="flex-1 overflow-auto">
					${e2 ? b`
								<pre class="m-0 p-4 text-xs"><code class="hljs language-${this.getLanguageFromExtension(t2.toLowerCase())}">${o(_r.highlight(this.content, { language: this.getLanguageFromExtension(t2.toLowerCase()), ignoreIllegals: true }).value)}</code></pre>
							` : b` <pre class="m-0 p-4 text-xs font-mono">${this.content}</pre> `}
				</div>
			</div>
		`;
  }
};
__decorate([n()], w.prototype, `filename`, void 0), __decorate([n({ attribute: false })], w.prototype, `displayTitle`, void 0), w = __decorate([t(`text-artifact`)], w);
var T = IP.Object({
  command: VP([`create`, `update`, `rewrite`, `get`, `delete`, `logs`], {
    description: `The operation to perform`
  }),
  filename: IP.String({
    description: `Filename including extension (e.g., 'index.html', 'script.js')`
  }),
  content: IP.Optional(IP.String({ description: `File content` })),
  old_str: IP.Optional(
    IP.String({ description: `String to replace (for update command)` })
  ),
  new_str: IP.Optional(
    IP.String({ description: `Replacement string (for update command)` })
  )
});
function E(e2) {
  return b`<div class="text-xs text-muted-foreground whitespace-pre-wrap font-mono">${e2}</div>`;
}
var D = class extends i {
  constructor(...e2) {
    super(...e2), this._artifacts = /* @__PURE__ */ new Map(), this._activeFilename = null, this.artifactElements = /* @__PURE__ */ new Map(), this.contentRef = e(), this.collapsed = false, this.overlay = false;
  }
  get artifacts() {
    return this._artifacts;
  }
  createRenderRoot() {
    return this;
  }
  connectedCallback() {
    super.connectedCallback(), this.style.display = `block`, requestAnimationFrame(() => {
      let e2 = this.contentRef.value;
      e2 && (!this._activeFilename && this._artifacts.size > 0 && (this._activeFilename = Array.from(this._artifacts.keys())[0]), this.artifactElements.forEach((t2, n3) => {
        t2.parentElement || e2.appendChild(t2), t2.style.display = n3 === this._activeFilename ? `block` : `none`;
      }));
    });
  }
  disconnectedCallback() {
    super.disconnectedCallback();
  }
  getFileType(e2) {
    let t2 = e2.split(`.`).pop()?.toLowerCase();
    return t2 === `html` ? `html` : t2 === `svg` ? `svg` : t2 === `md` || t2 === `markdown` ? `markdown` : `text`;
  }
  getLanguageFromFilename(e2) {
    return e2 && {
      js: `javascript`,
      jsx: `javascript`,
      ts: `typescript`,
      tsx: `typescript`,
      html: `html`,
      css: `css`,
      scss: `scss`,
      json: `json`,
      py: `python`,
      md: `markdown`,
      svg: `xml`,
      xml: `xml`,
      yaml: `yaml`,
      yml: `yaml`,
      sh: `bash`,
      bash: `bash`,
      sql: `sql`,
      java: `java`,
      c: `c`,
      cpp: `cpp`,
      cs: `csharp`,
      go: `go`,
      rs: `rust`,
      php: `php`,
      rb: `ruby`,
      swift: `swift`,
      kt: `kotlin`,
      r: `r`
    }[e2.split(`.`).pop()?.toLowerCase() || ``] || `text`;
  }
  getOrCreateArtifactElement(e2, t2, n3) {
    let r2 = this.artifactElements.get(e2);
    if (r2)
      r2.content = t2, r2.displayTitle = n3, r2 instanceof b2 && (r2.attachments = this.attachmentsProvider?.() || []);
    else {
      let i3 = this.getFileType(e2);
      i3 === `html` ? (r2 = new b2(), r2.attachments = this.attachmentsProvider?.() || []) : r2 = i3 === `svg` ? new S() : i3 === `markdown` ? new x() : new w(), r2.filename = e2, r2.displayTitle = n3, r2.content = t2, r2.style.display = `none`, r2.style.height = `100%`, this.artifactElements.set(e2, r2);
      let a = r2;
      requestAnimationFrame(() => {
        this.contentRef.value && !a.parentElement && this.contentRef.value.appendChild(a);
      });
    }
    return r2;
  }
  showArtifact(e2) {
    requestAnimationFrame(() => {
      this.artifactElements.forEach((t2, n3) => {
        this.contentRef.value && !t2.parentElement && this.contentRef.value.appendChild(t2), t2.style.display = n3 === e2 ? `block` : `none`;
      });
    }), this._activeFilename = e2, this.requestUpdate();
  }
  openArtifact(e2) {
    this._artifacts.has(e2) && (this.showArtifact(e2), this.onOpen?.());
  }
  get tool() {
    return {
      label: `Artifacts`,
      name: `artifacts`,
      description: `Creates and manages file artifacts. Each artifact is a file with a filename and content.

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
- Can embed raster images as base64 in SVG`,
      parameters: T,
      execute: async (e2, t2, n3) => ({
        output: await this.executeCommand(t2),
        details: void 0
      })
    };
  }
  renderParams(e2, t2) {
    if (t2 && !e2.command)
      return b`<div class="text-sm text-muted-foreground">${i18n(`Processing artifact...`)}</div>`;
    let n3 = i18n(`Processing`);
    if (e2.command)
      switch (e2.command) {
        case `create`:
          n3 = i18n(`Create`);
          break;
        case `update`:
          n3 = i18n(`Update`);
          break;
        case `rewrite`:
          n3 = i18n(`Rewrite`);
          break;
        case `get`:
          n3 = i18n(`Get`);
          break;
        case `delete`:
          n3 = i18n(`Delete`);
          break;
        case `logs`:
          n3 = i18n(`Get logs`);
          break;
        default:
          n3 = e2.command.charAt(0).toUpperCase() + e2.command.slice(1);
      }
    let r2 = e2.filename || ``;
    switch (e2.command) {
      case `create`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<div>
							<span class="font-medium">${i18n(`Create`)}</span>
							<span class="text-muted-foreground ml-1">${r2}</span>
						</div>
						${e2.content ? b`<code-block
									.code=${e2.content}
									language=${this.getLanguageFromFilename(e2.filename)}
									class="mt-2"
								></code-block>` : ``}
					</div>
				`;
      case `update`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<div>
							<span class="font-medium">${i18n(`Update`)}</span>
							<span class="text-muted-foreground ml-1">${r2}</span>
						</div>
						${e2.old_str !== void 0 && e2.new_str !== void 0 ? Diff({ oldText: e2.old_str, newText: e2.new_str, className: `mt-2` }) : ``}
					</div>
				`;
      case `rewrite`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<div>
							<span class="font-medium">${i18n(`Rewrite`)}</span>
							<span class="text-muted-foreground ml-1">${r2}</span>
						</div>
						${e2.content ? b`<code-block
									.code=${e2.content}
									language=${this.getLanguageFromFilename(e2.filename)}
									class="mt-2"
								></code-block>` : ``}
					</div>
				`;
      case `get`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<span class="font-medium">${i18n(`Get`)}</span>
						<span class="text-muted-foreground ml-1">${r2}</span>
					</div>
				`;
      case `delete`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<span class="font-medium">${i18n(`Delete`)}</span>
						<span class="text-muted-foreground ml-1">${r2}</span>
					</div>
				`;
      case `logs`:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<span class="font-medium">${i18n(`Get logs`)}</span>
						<span class="text-muted-foreground ml-1">${r2}</span>
					</div>
				`;
      default:
        return b`
					<div
						class="text-sm cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1"
						@click=${() => this.openArtifact(e2.filename)}
					>
						<span class="font-medium">${n3}</span>
						<span class="text-muted-foreground ml-1">${r2}</span>
					</div>
				`;
    }
  }
  renderResult(e2, t2) {
    let n3 = t2.output || i18n(`(no output)`);
    return b`
			<div class="cursor-pointer hover:bg-muted/50 rounded-sm px-2 py-1" @click=${() => this.openArtifact(e2.filename)}>
				${E(n3)}
			</div>
		`;
  }
  async reconstructFromMessages(e2) {
    let t2 = /* @__PURE__ */ new Map(), n3 = `artifacts`;
    for (let r3 of e2)
      if (r3.role === `assistant`)
        for (let e3 of r3.content)
          e3.type === `toolCall` && e3.name === n3 && t2.set(e3.id, e3);
    let r2 = [];
    for (let i4 of e2)
      if (i4.role === `toolResult` && i4.toolName === n3 && !i4.isError) {
        let e3 = i4.toolCallId, n4 = t2.get(e3);
        if (!n4) continue;
        let a = n4.arguments;
        if (a.command === `get` || a.command === `logs`) continue;
        r2.push(a);
      }
    let i3 = /* @__PURE__ */ new Map();
    for (let e3 of r2) {
      let t3 = e3.filename;
      switch (e3.command) {
        case `create`:
          e3.content && i3.set(t3, { filename: t3, content: e3.content });
          break;
        case `rewrite`:
          e3.content && i3.set(t3, { filename: t3, content: e3.content });
          break;
        case `update`: {
          let n4 = i3.get(t3);
          if (!n4) break;
          e3.old_str !== void 0 && e3.new_str !== void 0 && (n4.content = n4.content.replace(e3.old_str, e3.new_str), i3.set(t3, n4));
          break;
        }
        case `delete`:
          i3.delete(t3);
          break;
        case `get`:
        case `logs`:
          break;
      }
    }
    this._artifacts.clear(), this.artifactElements.forEach((e3) => {
      e3.remove();
    }), this.artifactElements.clear(), this._activeFilename = null, this._artifacts = new Map(this._artifacts);
    for (let [e3, { content: t3 }] of i3.entries()) {
      let n4 = { command: `create`, filename: e3, content: t3 };
      try {
        await this.createArtifact(n4, { skipWait: true, silent: true });
      } catch {
      }
    }
    !this._activeFilename && this._artifacts.size > 0 && this.showArtifact(Array.from(this._artifacts.keys())[0]), this.onArtifactsChange?.(), this.requestUpdate();
  }
  async executeCommand(e2, t2 = {}) {
    switch (e2.command) {
      case `create`:
        return await this.createArtifact(e2, t2);
      case `update`:
        return await this.updateArtifact(e2, t2);
      case `rewrite`:
        return await this.rewriteArtifact(e2, t2);
      case `get`:
        return this.getArtifact(e2);
      case `delete`:
        return this.deleteArtifact(e2);
      case `logs`:
        return this.getLogs(e2);
      default:
        return i18n(`Error: Unknown command {command}`)(e2.command);
    }
  }
  async waitForHtmlExecution(e2) {
    let t2 = this.artifactElements.get(e2);
    return t2 instanceof b2 ? new Promise((n3) => {
      let r2 = false, a = (o3) => {
        if (o3.data?.type === `execution-complete` && o3.data?.artifactId === e2 && !r2) {
          r2 = true, window.removeEventListener(`message`, a);
          let o4 = t2.getLogs();
          o4.includes(`[error]`) ? n3(
            i18n(`

Execution completed with errors:
{logs}`)(o4)
          ) : o4 === i18n(`No logs for {filename}`)(e2) ? n3(``) : n3(
            i18n(`

Execution logs:
{logs}`)(o4)
          );
        }
      };
      window.addEventListener(`message`, a), setTimeout(() => {
        if (!r2) {
          r2 = true, window.removeEventListener(`message`, a);
          let o3 = t2.getLogs();
          o3.includes(`[error]`) ? n3(
            i18n(`

Execution timed out with errors:
{logs}`)(o3)
          ) : o3 === i18n(`No logs for {filename}`)(e2) ? n3(``) : n3(
            i18n(`

Execution timed out. Partial logs:
{logs}`)(o3)
          );
        }
      }, 1500);
    }) : ``;
  }
  async createArtifact(e2, t2 = {}) {
    if (!e2.filename || !e2.content)
      return i18n(`Error: create command requires filename and content`);
    if (this._artifacts.has(e2.filename))
      return i18n(`Error: File {filename} already exists`)(e2.filename);
    let n3 = e2.filename, r2 = {
      filename: e2.filename,
      title: n3,
      content: e2.content,
      createdAt: /* @__PURE__ */ new Date(),
      updatedAt: /* @__PURE__ */ new Date()
    };
    this._artifacts.set(e2.filename, r2), this._artifacts = new Map(this._artifacts), this.getOrCreateArtifactElement(e2.filename, e2.content, n3), t2.silent || (this.showArtifact(e2.filename), this.onArtifactsChange?.(), this.requestUpdate());
    let a = i18n(`Created file {filename}`)(e2.filename);
    if (this.getFileType(e2.filename) === `html` && !t2.skipWait) {
      let t3 = await this.waitForHtmlExecution(e2.filename);
      a += t3;
    }
    return a;
  }
  async updateArtifact(e2, t2 = {}) {
    let n3 = this._artifacts.get(e2.filename);
    if (!n3) {
      let t3 = Array.from(this._artifacts.keys());
      return t3.length === 0 ? i18n(
        `Error: File {filename} not found. No files have been created yet.`
      )(e2.filename) : i18n(`Error: File {filename} not found. Available files: {files}`)(
        e2.filename,
        t3.join(`, `)
      );
    }
    if (!e2.old_str || e2.new_str === void 0)
      return i18n(`Error: update command requires old_str and new_str`);
    if (!n3.content.includes(e2.old_str))
      return i18n(`Error: String not found in file. Here is the full content:

{content}`)(n3.content);
    n3.content = n3.content.replace(e2.old_str, e2.new_str), n3.updatedAt = /* @__PURE__ */ new Date(), this._artifacts.set(e2.filename, n3), this.getOrCreateArtifactElement(e2.filename, n3.content, n3.title), t2.silent || (this.onArtifactsChange?.(), this.requestUpdate(), this.requestUpdate());
    let r2 = i18n(`Updated file {filename}`)(e2.filename);
    if (this.getFileType(e2.filename) === `html` && !t2.skipWait) {
      let t3 = await this.waitForHtmlExecution(e2.filename);
      r2 += t3;
    }
    return r2;
  }
  async rewriteArtifact(e2, t2 = {}) {
    let n3 = this._artifacts.get(e2.filename);
    if (!n3) {
      let t3 = Array.from(this._artifacts.keys());
      return t3.length === 0 ? i18n(
        `Error: File {filename} not found. No files have been created yet.`
      )(e2.filename) : i18n(`Error: File {filename} not found. Available files: {files}`)(
        e2.filename,
        t3.join(`, `)
      );
    }
    if (!e2.content) return i18n(`Error: rewrite command requires content`);
    n3.content = e2.content, n3.updatedAt = /* @__PURE__ */ new Date(), this._artifacts.set(e2.filename, n3), this.getOrCreateArtifactElement(e2.filename, n3.content, n3.title), t2.silent || this.onArtifactsChange?.();
    let r2 = i18n(`Rewrote file {filename}`)(e2.filename);
    if (this.getFileType(e2.filename) === `html` && !t2.skipWait) {
      let t3 = await this.waitForHtmlExecution(e2.filename);
      r2 += t3;
    }
    return r2;
  }
  getArtifact(e2) {
    let t2 = this._artifacts.get(e2.filename);
    if (!t2) {
      let t3 = Array.from(this._artifacts.keys());
      return t3.length === 0 ? i18n(
        `Error: File {filename} not found. No files have been created yet.`
      )(e2.filename) : i18n(`Error: File {filename} not found. Available files: {files}`)(
        e2.filename,
        t3.join(`, `)
      );
    }
    return t2.content;
  }
  deleteArtifact(e2) {
    if (!this._artifacts.get(e2.filename)) {
      let t3 = Array.from(this._artifacts.keys());
      return t3.length === 0 ? i18n(
        `Error: File {filename} not found. No files have been created yet.`
      )(e2.filename) : i18n(`Error: File {filename} not found. Available files: {files}`)(
        e2.filename,
        t3.join(`, `)
      );
    }
    this._artifacts.delete(e2.filename), this._artifacts = new Map(this._artifacts);
    let t2 = this.artifactElements.get(e2.filename);
    if (t2 && (t2.remove(), this.artifactElements.delete(e2.filename)), this._activeFilename === e2.filename) {
      let e3 = Array.from(this._artifacts.keys());
      e3.length > 0 ? this.showArtifact(e3[0]) : (this._activeFilename = null, this.requestUpdate());
    }
    return this.onArtifactsChange?.(), this.requestUpdate(), i18n(`Deleted file {filename}`)(e2.filename);
  }
  getLogs(e2) {
    let t2 = this.artifactElements.get(e2.filename);
    if (!t2) {
      let t3 = Array.from(this._artifacts.keys());
      return t3.length === 0 ? i18n(
        `Error: File {filename} not found. No files have been created yet.`
      )(e2.filename) : i18n(`Error: File {filename} not found. Available files: {files}`)(
        e2.filename,
        t3.join(`, `)
      );
    }
    return t2 instanceof b2 ? t2.getLogs() : i18n(
      `Error: File {filename} is not an HTML file. Logs are only available for HTML files.`
    )(e2.filename);
  }
  render() {
    let t2 = Array.from(this._artifacts.values()), n3 = t2.length > 0 && !this.collapsed;
    return b`
			<!-- Floating reopen pill when collapsed and artifacts exist -->
			${this.collapsed && t2.length > 0 ? b`
						<button
							class="absolute z-30 top-4 left-1/2 -translate-x-1/2"
							@click=${() => this.onOpen?.()}
							title=${i18n(`Show artifacts`)}
						>
							${u(b`
								<span class="inline-flex items-center gap-1">
									<span>${i18n(`Artifacts`)}</span>
									${t2.length > 1 ? b`<span
												class="text-[10px] leading-none bg-primary-foreground/20 text-primary-foreground rounded px-1 font-mono tabular-nums"
												>${t2.length}</span
											>` : ``}
								</span>
							`)}
						</button>
					` : ``}

			<!-- Panel container -->
			<div
				class="${n3 ? `` : `hidden`} ${this.overlay ? `fixed inset-0 z-40` : `relative`} h-full flex flex-col bg-card text-card-foreground border border-border overflow-hidden"
			>
				<!-- Tab bar (always shown when there are artifacts) -->
				<div class="flex items-center justify-between border-b border-border bg-muted/50">
					<div class="flex overflow-x-auto">
						${t2.map((e2) => {
      let t3 = e2.filename === this._activeFilename ? `border-primary text-primary` : `border-transparent text-muted-foreground hover:text-foreground`;
      return b`
								<button
									class="px-3 py-2 text-sm whitespace-nowrap border-b-2 ${t3}"
									@click=${() => this.showArtifact(e2.filename)}
								>
									<span class="font-mono text-sm">${e2.filename}</span>
								</button>
							`;
    })}
					</div>
					<div class="flex items-center gap-1 px-2">
						${(() => {
      let e2 = this._activeFilename ? this.artifactElements.get(this._activeFilename) : void 0;
      return e2 ? e2.getHeaderButtons() : ``;
    })()}
						${Button({ variant: `ghost`, size: `sm`, onClick: () => this.onClose?.(), title: i18n(`Close artifacts`), children: iconCloseLine(`sm`) })}
					</div>
				</div>

				<!-- Content area where artifact elements are added programmatically -->
				<div class="flex-1 overflow-hidden" ${n2(this.contentRef)}></div>
			</div>
		`;
  }
};
__decorate([r()], D.prototype, `_artifacts`, void 0), __decorate([r()], D.prototype, `_activeFilename`, void 0), __decorate([n({ attribute: false })], D.prototype, `attachmentsProvider`, void 0), __decorate([n({ attribute: false })], D.prototype, `onArtifactsChange`, void 0), __decorate([n({ attribute: false })], D.prototype, `onClose`, void 0), __decorate([n({ attribute: false })], D.prototype, `onOpen`, void 0), __decorate([n({ type: Boolean })], D.prototype, `collapsed`, void 0), __decorate([n({ type: Boolean })], D.prototype, `overlay`, void 0), D = __decorate([t(`artifacts-panel`)], D);

// src/pages/5-5-artifacts-tool.js
function extractJsonObject(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf(`{`);
  const end = raw.lastIndexOf(`}`);
  if (start === -1 || end === -1 || end <= start) throw new Error(`Planner did not return JSON`);
  return JSON.parse(raw.slice(start, end + 1));
}
function artifactActionLabel(command) {
  return {
    create: `\u5EFA\u7ACB`,
    update: `\u66F4\u65B0`,
    rewrite: `\u91CD\u5BEB`,
    delete: `\u522A\u9664`,
    get: `\u8B80\u53D6`,
    logs: `\u67E5\u770B\u7D00\u9304`
  }[command] || command || `\u8655\u7406`;
}
function artifactChangeSummary(args) {
  if (args.command === `create`) return `\u7522\u751F\u4E00\u4EFD\u65B0\u7522\u7269\uFF0C\u5B8C\u6574\u5167\u5BB9\u8ACB\u770B\u53F3\u5074\u7522\u7269\u9762\u677F\u3002`;
  if (args.command === `rewrite`)
    return `\u4EE5\u65B0\u7684\u5B8C\u6574\u5167\u5BB9\u8986\u5BEB\u540C\u4E00\u4EFD\u6A94\u6848\uFF0C\u9069\u5408\u5927\u5E45\u6539\u5BEB\u6216\u907F\u514D\u7CBE\u6E96\u5B57\u4E32\u6BD4\u5C0D\u5931\u6557\u3002`;
  if (args.command === `update`)
    return `\u7528 old_str / new_str \u505A\u5C40\u90E8\u66FF\u63DB\uFF1Bold_str \u5FC5\u9808\u9010\u5B57\u76F8\u540C\u624D\u6703\u6210\u529F\u3002`;
  if (args.command === `delete`) return `\u79FB\u9664\u9019\u4EFD\u7522\u7269\u3002`;
  return `\u57F7\u884C artifacts \u5DE5\u5177\u64CD\u4F5C\u3002`;
}
function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
function cleanErrorMessage(error) {
  return String(error?.message || error || `\u672A\u77E5\u932F\u8AA4`).replace(/[。．.]+$/u, ``);
}
function artifactFailureMessage(action, error) {
  const message = cleanErrorMessage(error);
  if (message.includes(`\u6A21\u578B\u898F\u5283\u8D85\u904E`)) {
    return `${action}\u5931\u6557\uFF1A\u6A21\u578B\u82B1\u592A\u4E45\u9084\u6C92\u7522\u751F artifacts \u5DE5\u5177\u6307\u4EE4\uFF0C\u9019\u6B21\u5DF2\u505C\u6B62\u3002\u8ACB\u518D\u8A66\u4E00\u6B21\uFF1B\u5982\u679C\u9023\u7E8C\u767C\u751F\uFF0C\u5148\u78BA\u8A8D ChatGPT \u9023\u7DDA\u6216\u7A0D\u5F8C\u91CD\u8A66\u3002`;
  }
  if (message.includes(`ChatGPT \u5C1A\u672A\u9023\u7DDA`)) {
    return `${action}\u5931\u6557\uFF1AChatGPT \u5C1A\u672A\u9023\u7DDA\u3002\u8ACB\u5148\u9EDE\u53F3\u4E0A\u89D2\u72C0\u614B\u71C8\u767B\u5165\u3002`;
  }
  if (message.includes(`Planner did not return JSON`)) {
    return `${action}\u5931\u6557\uFF1A\u6A21\u578B\u6C92\u6709\u56DE\u50B3\u53EF\u57F7\u884C\u7684\u5DE5\u5177\u53C3\u6578\u3002\u8ACB\u518D\u8A66\u4E00\u6B21\uFF0C\u8B93\u6A21\u578B\u91CD\u65B0\u898F\u5283\u3002`;
  }
  return `${action}\u5931\u6557\uFF1A${message}\u3002`;
}
function trimPlannerPreview(text) {
  const normalized = String(text || ``).replace(/\r/g, ``).trimStart();
  if (!normalized) return `\u7B49\u5F85\u6A21\u578B\u958B\u59CB\u8F38\u51FA\u5DE5\u5177\u53C3\u6578...`;
  return normalized.length > 1200 ? `...
${normalized.slice(-1200)}` : normalized;
}
function formatCommandPreview(command) {
  const preview = { ...command };
  if (typeof preview.content === `string`)
    preview.content = `\u5DF2\u7522\u751F ${preview.content.length} \u5B57\u5143\uFF0C\u5B8C\u6574\u5167\u5BB9\u6703\u4EA4\u7D66 artifacts()\u3002`;
  if (typeof preview.old_str === `string`)
    preview.old_str = `\u820A\u5B57\u4E32 ${preview.old_str.length} \u5B57\u5143`;
  if (typeof preview.new_str === `string`)
    preview.new_str = `\u65B0\u5B57\u4E32 ${preview.new_str.length} \u5B57\u5143`;
  return JSON.stringify(preview, null, 2);
}
function formatExpectedCreatePreview(filename) {
  return JSON.stringify(
    {
      command: `create`,
      filename,
      content: `\u6A21\u578B\u63A5\u4E0B\u4F86\u6703\u7522\u751F\u5B8C\u6574\u6A94\u6848\u5167\u5BB9\uFF0C\u5B8C\u6210\u5F8C\u4EA4\u7D66 artifacts() \u5BEB\u5165\u3002`
    },
    null,
    2
  );
}
function formatExpectedUpdatePreview(filename) {
  return JSON.stringify(
    {
      command: `update \u6216 rewrite`,
      filename,
      old_str: `\u82E5\u4F7F\u7528 update\uFF0C\u5FC5\u9808\u9010\u5B57\u7B26\u5408\u539F\u6A94\u5167\u5BB9\u3002`,
      new_str: `\u6A21\u578B\u8981\u5BEB\u56DE\u7684\u65B0\u5167\u5BB9\u3002\u82E5\u4FEE\u6539\u5E45\u5EA6\u5927\uFF0C\u6703\u6539\u7528 rewrite\u3002`
    },
    null,
    2
  );
}
var ArtifactsToolDemo = class extends m {
  constructor() {
    super();
    this.headerTitle = i18n(`\u7522\u7269\u5DE5\u5177\uFF08Artifacts\uFF09\uFF1A\u5EFA\u7ACB\u3001\u66F4\u65B0\u3001\u6AA2\u8996\u6A94\u6848`);
    document.title = i18n(`5.5 \u7522\u7269\u5DE5\u5177\uFF08Artifacts\uFF09`);
    this.sectionId = `5.5`;
    this.debugLog = [];
    this.hasArtifacts = false;
    this.showArtifacts = false;
    this.artifactCount = 0;
    this.runningExample = ``;
    this.selectedExample = ``;
    this.lastObservation = ``;
    this.isPlanning = false;
    this.processingPhase = ``;
    this.processingStage = ``;
    this.plannerPreview = ``;
    this.processStartedAt = 0;
    this.processFinishedAt = 0;
    this.processNow = 0;
    this.processTimer = null;
    this.streamTimeoutId = null;
    this.recoveredToolResults = /* @__PURE__ */ new Set();
    this.session = new o2({ authTokenProvider: v });
    this.session.setModel(Pi(`openai-codex`, `gpt-5.4-mini`));
    this.session.debugListener = (entry) => {
      this.debugLog = [...this.debugLog, entry];
    };
    this.session.subscribe(({ state }) => {
      this.handleSessionState(state);
    });
    this.session.setSystemPrompt(
      i18n(`\u4F60\u6B63\u5728\u6559\u5B78\u793A\u7BC4 artifacts \u5DE5\u5177\u3002\u7576\u4F7F\u7528\u8005\u8981\u6C42\u5EFA\u7ACB\u6216\u4FEE\u6539\u6587\u4EF6\u3001HTML\u3001SVG\u3001\u7A0B\u5F0F\u78BC\u6642\uFF0C\u8ACB\u52D9\u5FC5\u547C\u53EB artifacts \u5DE5\u5177\uFF0C\u4E0D\u8981\u53EA\u628A\u5B8C\u6574\u5167\u5BB9\u8CBC\u5728\u804A\u5929\u56DE\u8986\u88E1\u3002

\u5DE5\u5177\u4F7F\u7528\u539F\u5247\uFF1A
- \u5EFA\u7ACB\u65B0\u7522\u7269\u6642\u4F7F\u7528 command=create\uFF0C\u4E26\u9078\u4E00\u500B\u6E05\u695A\u7684\u6A94\u540D\u3002
- \u4FEE\u6539\u65E2\u6709\u7522\u7269\u6642\u512A\u5148\u4F7F\u7528 command=update\uFF1B\u82E5\u9700\u8981\u5927\u5E45\u6539\u5BEB\u624D\u4F7F\u7528 command=rewrite\u3002
- \u56DE\u8986\u8981\u7528\u7E41\u9AD4\u4E2D\u6587\uFF0C\u5148\u7C21\u77ED\u8AAA\u4F60\u547C\u53EB\u4E86\u54EA\u500B\u5DE5\u5177\u3001\u6539\u4E86\u54EA\u500B\u6A94\u6848\uFF0C\u518D\u63D0\u9192\u4F7F\u7528\u8005\u53BB\u7522\u7269\u9762\u677F\u6AA2\u67E5\u7D50\u679C\u3002
- \u4E0D\u8981\u5047\u88DD\u5DF2\u7D93\u9810\u89BD\u6210\u529F\uFF1B\u5982\u679C\u662F HTML\uFF0C\u53EF\u4EE5\u8ACB\u4F7F\u7528\u8005\u6AA2\u67E5\u9810\u89BD\u8207 console\u3002`)
    );
    this.session.setThinkingLevel(`off`);
    this.agentInterface = new bR();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.artifactsPanel = new D();
    this.artifactsPanel.style.width = `100%`;
    this.artifactsPanel.style.height = `100%`;
    this.artifactsPanel.renderParams = (args, pending) => this.renderCompactArtifactParams(args, pending);
    yt(`artifacts`, this.artifactsPanel);
    this.artifactsPanel.attachmentsProvider = () => this.session.state.messages.filter((message) => message.role === `user`).flatMap((message) => message.attachments || []);
    this.artifactsPanel.onArtifactsChange = () => {
      const count = this.artifactsPanel.artifacts?.size ?? 0;
      const increased = count > this.artifactCount;
      this.hasArtifacts = count > 0;
      this.artifactCount = count;
      if (this.hasArtifacts && increased) this.showArtifacts = true;
    };
    this.artifactsPanel.onClose = () => {
      this.showArtifacts = false;
    };
    this.artifactsPanel.onOpen = () => {
      this.showArtifacts = true;
    };
    this.session.setTools([this.artifactsPanel.tool]);
  }
  renderCompactArtifactParams(args, pending) {
    const filename = args?.filename || i18n(`\u5C1A\u672A\u6C7A\u5B9A\u6A94\u540D`);
    const action = artifactActionLabel(args?.command);
    const summary = pending ? `\u6A21\u578B\u6B63\u5728\u586B\u5DE5\u5177\u53C3\u6578...` : artifactChangeSummary(args || {});
    return b`
			<div class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
				<div class="flex items-center justify-between gap-3">
					<div class="font-medium text-foreground">Artifacts：${action}</div>
					<code class="text-xs text-muted-foreground truncate">${filename}</code>
				</div>
				<div class="mt-1 text-xs text-muted-foreground">${summary}</div>
			</div>
		`;
  }
  startProcessClock() {
    this.stopProcessClock();
    this.processStartedAt = Date.now();
    this.processFinishedAt = 0;
    this.processNow = this.processStartedAt;
    this.processTimer = window.setInterval(() => {
      this.processNow = Date.now();
    }, 500);
  }
  stopProcessClock() {
    if (this.processTimer) {
      window.clearInterval(this.processTimer);
      this.processTimer = null;
    }
    if (this.processStartedAt && !this.processFinishedAt) {
      this.processFinishedAt = Date.now();
      this.processNow = this.processFinishedAt;
    }
  }
  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.stopProcessClock();
  }
  formatElapsedTime(milliseconds) {
    const seconds = Math.max(0, milliseconds) / 1e3;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }
  getCompletedStepCount(steps) {
    return steps.filter((step) => step.status === `done`).length;
  }
  getProcessingSteps() {
    const phase = this.processingPhase || (this.isPlanning ? `planning` : this.session.state.isStreaming ? `streaming` : ``);
    const base = [
      {
        id: `planning`,
        label: i18n(`\u6A21\u578B\u7522\u751F\u5167\u5BB9\u8207\u5DE5\u5177\u6307\u4EE4`),
        description: i18n(`\u6C7A\u5B9A\u6A94\u6848\u540D\u7A31\u3001\u64CD\u4F5C\u65B9\u5F0F\uFF0C\u4E26\u7522\u751F\u8981\u4EA4\u7D66\u5DE5\u5177\u7684\u5167\u5BB9\u3002`)
      },
      {
        id: `tool`,
        label: i18n(`\u672C\u6A5F\u5DE5\u5177\u5BEB\u5165\u7522\u7269`),
        description: i18n(`artifacts() \u53EA\u7167\u6A21\u578B\u7D66\u7684 command\u3001filename\u3001content \u5BEB\u5165\u7522\u7269\u3002`)
      },
      {
        id: `inspect`,
        label: i18n(`\u6AA2\u67E5\u7522\u7269\u7D50\u679C`),
        description: i18n(`\u5B78\u751F\u8981\u78BA\u8A8D\u53F3\u5074\u7522\u7269\u662F\u5426\u771F\u7684\u5EFA\u7ACB\u3001\u66F4\u65B0\uFF0C\u4E14\u5167\u5BB9\u7B26\u5408\u4EFB\u52D9\u3002`)
      }
    ];
    if (phase === `streaming`) {
      return [
        {
          ...base[0],
          status: `active`,
          description: this.processingStage || i18n(`\u6A21\u578B\u6B63\u5728\u8B80\u4F60\u7684\u9700\u6C42\uFF0C\u53EF\u80FD\u6703\u7522\u751F artifacts \u5DE5\u5177\u547C\u53EB\u3002`)
        },
        { ...base[1], status: `waiting` },
        { ...base[2], status: `waiting` }
      ];
    }
    if (phase === `tool` || phase === `recovering`) {
      return [
        { ...base[0], status: `done` },
        {
          ...base[1],
          status: `active`,
          description: this.processingStage || (phase === `recovering` ? i18n(`update \u5931\u6557\u6642\uFF0C\u6539\u7528 rewrite \u4FEE\u5FA9\u540C\u4E00\u4EFD\u6A94\u6848\u3002`) : base[1].description)
        },
        { ...base[2], status: `waiting` }
      ];
    }
    if (phase === `done`) {
      return [
        { ...base[0], status: `done` },
        { ...base[1], status: `done` },
        {
          ...base[2],
          status: `done`,
          description: this.processingStage || base[2].description
        }
      ];
    }
    return [
      {
        ...base[0],
        status: `active`,
        description: this.processingStage || base[0].description
      },
      { ...base[1], status: `waiting` },
      { ...base[2], status: `waiting` }
    ];
  }
  renderProcessingMarker(status) {
    if (status === `done`) {
      return b`<span class="mt-progress-marker mt-progress-done" aria-hidden="true">✓</span>`;
    }
    if (status === `active`) {
      return b`<span class="mt-progress-marker mt-progress-active" aria-hidden="true"><span class="mt-progress-spinner"></span></span>`;
    }
    return b`<span class="mt-progress-marker mt-progress-waiting" aria-hidden="true">•</span>`;
  }
  renderPlannerPreview() {
    if (!this.plannerPreview) return ``;
    return b`
			<details class="mt-planner-preview">
				<summary class="mt-planner-preview-header">
						<span>${i18n(`\u5DE5\u5177\u53C3\u6578\u8349\u7A3F`)}</span>
					<span>JSON preview</span>
				</summary>
				<pre><code>${this.plannerPreview}</code></pre>
			</details>
		`;
  }
  renderProcessingCard() {
    const steps = this.getProcessingSteps();
    const completed = this.getCompletedStepCount(steps);
    const progress = Math.round(completed / steps.length * 100);
    const elapsedMilliseconds = Math.max(
      0,
      (this.processFinishedAt || this.processNow || Date.now()) - (this.processStartedAt || Date.now())
    );
    const isDone = this.processingPhase === `done`;
    return b`
			<style>
				@keyframes mt-artifact-spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes mt-artifact-sheen {
					0% { transform: translateX(-100%); opacity: 0; }
					20% { opacity: 0.45; }
					100% { transform: translateX(100%); opacity: 0; }
				}
				@keyframes mt-artifact-pulse {
					0%, 100% { box-shadow: 0 0 0 3px hsl(var(--primary) / 0.10); }
					50% { box-shadow: 0 0 0 6px hsl(var(--primary) / 0.18); }
				}
				@keyframes mt-artifact-pop {
					0% { transform: scale(0.82); }
					70% { transform: scale(1.08); }
					100% { transform: scale(1); }
				}
				@keyframes mt-artifact-activity {
					0% { transform: translateX(-70%); opacity: 0.25; }
					35% { opacity: 0.9; }
					100% { transform: translateX(170%); opacity: 0.25; }
				}
				.mt-progress-card {
					position: relative;
					overflow: hidden;
				}
				.mt-progress-card[data-running="true"]::before {
					content: "";
					position: absolute;
					inset: 0;
					background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.18), transparent);
					animation: mt-artifact-sheen 1.8s ease-in-out infinite;
					pointer-events: none;
				}
				.mt-progress-step {
					position: relative;
					display: flex;
					gap: 0.5rem;
					min-height: 3.25rem;
					padding: 0.38rem 0.45rem;
					border-radius: 0.65rem;
					transform: translateX(0);
					transition: opacity 260ms ease, transform 260ms ease, background-color 260ms ease;
				}
				.mt-progress-step-active {
					background: hsl(var(--primary) / 0.08);
					transform: translateX(2px);
				}
				.mt-progress-step-waiting {
					opacity: 0.58;
				}
				.mt-progress-copy {
					min-width: 0;
					transition: color 220ms ease, opacity 220ms ease;
				}
				.mt-progress-marker {
					width: 1.45rem;
					height: 1.45rem;
					border-radius: 999px;
					display: inline-grid;
					place-items: center;
					flex: 0 0 auto;
					font-size: 0.78rem;
					font-weight: 700;
					border: 1px solid hsl(var(--border));
					background: hsl(var(--card));
					transition: background-color 240ms ease, border-color 240ms ease, color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
				}
				.mt-progress-done {
					color: hsl(var(--primary-foreground));
					background: hsl(var(--primary));
					border-color: hsl(var(--primary));
					animation: mt-artifact-pop 240ms ease-out;
				}
				.mt-progress-active {
					color: hsl(var(--foreground));
					box-shadow: 0 0 0 3px hsl(var(--primary) / 0.14);
					animation: mt-artifact-pulse 1.5s ease-in-out infinite;
				}
				.mt-progress-waiting {
					color: transparent;
					background: hsl(var(--muted));
				}
				.mt-progress-spinner {
					width: 0.82rem;
					height: 0.82rem;
					border-radius: 999px;
					border: 2px solid transparent;
					border-top-color: currentColor;
					border-right-color: currentColor;
					animation: mt-artifact-spin 850ms linear infinite;
				}
				.mt-progress-activity {
					position: relative;
					height: 3px;
					margin-top: 0.45rem;
					overflow: hidden;
					border-radius: 999px;
					background: hsl(var(--primary) / 0.12);
				}
				.mt-progress-activity > span {
					position: absolute;
					inset: 0;
					width: 52%;
					border-radius: inherit;
					background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.75), transparent);
					animation: mt-artifact-activity 1.35s ease-in-out infinite;
				}
				.mt-planner-preview {
					margin-top: 0.55rem;
					overflow: hidden;
					border: 1px solid hsl(var(--border));
					border-radius: 0.55rem;
					background: hsl(var(--background) / 0.68);
				}
				.mt-planner-preview-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 0.5rem;
					border-bottom: 1px solid hsl(var(--border));
					padding: 0.35rem 0.55rem;
					color: hsl(var(--muted-foreground));
					font-size: 0.68rem;
					font-weight: 600;
					text-transform: uppercase;
					cursor: pointer;
				}
				.mt-planner-preview pre {
					max-height: 7.25rem;
					margin: 0;
					overflow: auto;
					padding: 0.55rem;
					white-space: pre-wrap;
					word-break: break-word;
					color: hsl(var(--foreground));
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
					font-size: 0.68rem;
					line-height: 1.45;
				}
			</style>
			<div class="mt-progress-card rounded-lg border ${isDone ? `border-border bg-muted/30` : `border-primary/30 bg-primary/5`} p-3 text-sm flex-shrink-0" data-running=${String(!isDone)} role="status" aria-live="polite" aria-busy=${String(!isDone)}>
				<div class="relative">
					<div class="flex items-center justify-between gap-3">
						<div>
								<div class="font-semibold text-foreground">${isDone ? i18n(`\u7522\u7269\u6D41\u7A0B\u5B8C\u6210`) : i18n(`\u7522\u7269\u6D41\u7A0B\u9032\u884C\u4E2D`)}</div>
								<div class="mt-1 text-[11px] text-muted-foreground">${completed}/${steps.length} ${i18n(`\u5B8C\u6210`)} · ${this.formatElapsedTime(elapsedMilliseconds)}</div>
						</div>
						<div class="text-[11px] uppercase tracking-wide text-muted-foreground">artifacts()</div>
					</div>
					<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
						<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${progress}%`}></div>
					</div>
					<div class="mt-3 space-y-2">
						${steps.map(
      (step) => b`
								<div class="mt-progress-step mt-progress-step-${step.status}">
									${this.renderProcessingMarker(step.status)}
									<div class="mt-progress-copy">
										<div class="text-xs font-medium text-foreground">${step.label}</div>
										<div class="text-[11px] leading-relaxed text-muted-foreground">${step.description}</div>
										${step.status === `active` ? b`<div class="mt-progress-activity" aria-hidden="true"><span></span></div>` : ``}
										${step.id === `planning` && (step.status === `active` || this.plannerPreview) ? this.renderPlannerPreview() : ``}
									</div>
								</div>
							`
    )}
					</div>
				</div>
			</div>
		`;
  }
  get examples() {
    return [
      {
        id: `handout`,
        title: i18n(`\u4E00\u9801\u5F0F\u5DE5\u4F5C\u574A\u8B1B\u7FA9`),
        description: i18n(`\u8ACB\u6A21\u578B\u5EFA\u7ACB\u53EF\u6539\u5BEB\u7684 Markdown \u8B1B\u7FA9`),
        filename: `tool-risk-handout.md`,
        prompt: i18n(
          `\u8ACB\u7528 artifacts \u5DE5\u5177\u5EFA\u7ACB\u4E00\u4EFD Markdown \u8B1B\u7FA9\uFF0C\u6A94\u540D\u7528 tool-risk-handout.md\u3002\u4E3B\u984C\u662F\u300CLLM \u5DE5\u5177\u547C\u53EB\u7684\u4E09\u500B\u98A8\u96AA\u300D\u3002\u8ACB\u5305\u542B\uFF1A\u4E00\u6BB5\u958B\u5834\u3001\u4E09\u500B\u98A8\u96AA\u3001\u6BCF\u500B\u98A8\u96AA\u4E00\u500B\u751F\u6D3B\u4F8B\u5B50\u3001\u4E09\u984C\u8AB2\u5F8C\u6AA2\u67E5\u984C\u3002`
        )
      },
      {
        id: `estimator`,
        title: i18n(`\u6210\u672C\u4F30\u7B97\u5C0F\u5DE5\u5177`),
        description: i18n(`\u8ACB\u6A21\u578B\u5EFA\u7ACB\u53EF\u9810\u89BD\u7684\u55AE\u6A94 HTML`),
        filename: `cost-estimator.html`,
        prompt: i18n(
          `\u8ACB\u7528 artifacts \u5DE5\u5177\u5EFA\u7ACB\u4E00\u500B\u55AE\u6A94 HTML \u5C0F\u5DE5\u5177\uFF0C\u6A94\u540D\u7528 cost-estimator.html\u3002\u529F\u80FD\uFF1A\u8F38\u5165 input tokens\u3001output tokens\u3001\u6BCF\u767E\u842C input \u50F9\u683C\u3001\u6BCF\u767E\u842C output \u50F9\u683C\uFF0C\u7ACB\u5373\u8A08\u7B97\u4F30\u8A08\u6210\u672C\u3002\u8ACB\u7528\u6DF1\u8272\u80CC\u666F\u3001\u6E05\u695A\u6A19\u7C64\u3001\u4E0D\u8981\u4F7F\u7528\u5916\u90E8\u5957\u4EF6\u3002`
        )
      },
      {
        id: `checklist`,
        title: i18n(`\u63D0\u793A\u6CE8\u5165\u6AA2\u67E5\u8868`),
        description: i18n(`\u8ACB\u6A21\u578B\u5EFA\u7ACB\u7522\u54C1\u5BE9\u67E5\u6587\u4EF6`),
        filename: `tool-safety-checklist.md`,
        prompt: i18n(
          `\u8ACB\u7528 artifacts \u5DE5\u5177\u5EFA\u7ACB\u4E00\u4EFD Markdown \u6AA2\u67E5\u8868\uFF0C\u6A94\u540D\u7528 tool-safety-checklist.md\u3002\u5C0D\u8C61\u662F\u7522\u54C1\u5718\u968A\uFF0C\u7528\u4F86\u5BE9\u67E5\u300C\u6709\u5DE5\u5177\u547C\u53EB\u7684 AI \u529F\u80FD\u300D\u3002\u8ACB\u5206\u6210\uFF1A\u5DE5\u5177\u6B0A\u9650\u3001\u8CC7\u6599\u4F86\u6E90\u3001\u5916\u9001\u8207\u5BEB\u5165\u3001\u5931\u6557\u56DE\u5FA9\u3001\u4E0A\u7DDA\u524D\u9A57\u6536\u3002`
        )
      },
      {
        id: `diagram`,
        title: i18n(`\u6559\u5B78\u7528 SVG \u5716\u89E3`),
        description: i18n(`\u8ACB\u6A21\u578B\u7522\u751F\u53EF\u9810\u89BD\u7684 SVG`),
        filename: `agent-loop.svg`,
        prompt: i18n(
          `\u8ACB\u7528 artifacts \u5DE5\u5177\u5EFA\u7ACB\u4E00\u5F35 SVG \u5716\u89E3\uFF0C\u6A94\u540D\u7528 agent-loop.svg\u3002\u5167\u5BB9\u8981\u8AAA\u660E AI \u4EE3\u7406\u4EBA\u7684\u5DE5\u5177\u5FAA\u74B0\uFF1A\u4F7F\u7528\u8005\u554F\u984C\u3001\u6A21\u578B\u5224\u65B7\u3001\u5DE5\u5177\u547C\u53EB\u3001\u5916\u90E8\u7A0B\u5F0F\u3001\u7D50\u679C\u56DE\u4E0A\u4E0B\u6587\u3002\u8ACB\u8B93\u6587\u5B57\u6E05\u695A\u53EF\u8B80\u3002`
        )
      },
      {
        id: `revision`,
        title: i18n(`\u9010\u6B65\u4FEE\u6539\u7DF4\u7FD2`),
        description: i18n(`\u6E2C\u8A66\u6A21\u578B\u662F\u5426\u66F4\u65B0\u65E2\u6709\u7522\u7269`),
        filename: `workshop-notes.md`,
        prompt: i18n(
          `\u8ACB\u7528 artifacts \u5DE5\u5177\u5EFA\u7ACB\u4E00\u500B Markdown \u6A94\u6848\uFF0C\u6A94\u540D\u53EB workshop-notes.md\u3002\u5167\u5BB9\u53EA\u8981\u4E09\u9EDE\uFF1A\u5DE5\u5177\u8B93\u6A21\u578B\u88DC\u4E0A\u5916\u90E8\u80FD\u529B\u3001\u5DE5\u5177\u7D50\u679C\u4ECD\u7136\u662F\u4E0D\u53EF\u4FE1\u4E0A\u4E0B\u6587\u3001\u9AD8\u98A8\u96AA\u52D5\u4F5C\u9700\u8981\u4EBA\u5DE5\u78BA\u8A8D\u3002\u5EFA\u7ACB\u5F8C\u5148\u505C\u4E0B\u4F86\uFF0C\u63A5\u8457\u6211\u6703\u8981\u6C42\u4F60\u4FEE\u6539\u540C\u4E00\u4EFD\u6A94\u6848\u3002`
        )
      }
    ];
  }
  resetArtifacts() {
    this.session.clearMessages();
    this.debugLog = [];
    this.hasArtifacts = false;
    this.showArtifacts = false;
    this.artifactCount = 0;
    this.runningExample = ``;
    this.selectedExample = ``;
    this.lastObservation = ``;
    this.isPlanning = false;
    this.processingPhase = ``;
    this.processingStage = ``;
    this.plannerPreview = ``;
    this.processStartedAt = 0;
    this.processFinishedAt = 0;
    this.processNow = 0;
    this.stopProcessClock();
    this.recoveredToolResults.clear();
    if (this.streamTimeoutId) clearTimeout(this.streamTimeoutId);
    this.streamTimeoutId = null;
    this.artifactsPanel.artifacts.clear();
    this.artifactsPanel.artifactElements.forEach((element) => element.remove());
    this.artifactsPanel.artifactElements.clear();
    this.artifactsPanel._activeFilename = null;
    this.artifactsPanel.requestUpdate();
  }
  async runExample(example) {
    if (this.session.state.isStreaming || this.isPlanning) return;
    this.resetArtifacts();
    this.selectedExample = example.id;
    this.runningExample = example.id;
    this.isPlanning = true;
    this.processingPhase = `planning`;
    this.processingStage = i18n(`\u6A21\u578B\u6B63\u5728\u628A\u4F60\u7684\u81EA\u7136\u8A9E\u8A00\u9700\u6C42\u8F49\u6210 artifacts() \u7684 create \u53C3\u6578\u3002`);
    this.plannerPreview = formatExpectedCreatePreview(example.filename);
    this.lastObservation = i18n(`\u6A21\u578B\u6B63\u5728\u898F\u5283 artifacts create \u6307\u4EE4...`);
    this.startProcessClock();
    const startedAt = performance.now();
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: example.prompt }],
      timestamp: Date.now()
    });
    const plannerPrompt = `\u4F60\u8981\u7522\u751F\u4E00\u500B artifacts \u5DE5\u5177\u6307\u4EE4\u4F86\u5EFA\u7ACB\u6A94\u6848\u3002\u53EA\u56DE\u50B3 JSON\uFF0C\u4E0D\u8981 markdown\uFF0C\u4E0D\u8981\u89E3\u91CB\u3002

\u9650\u5236\uFF1A
- \u5FC5\u9808\u4F7F\u7528 command=create
- filename \u5FC5\u9808\u662F\uFF1A${example.filename}
- content \u5FC5\u9808\u662F\u5B8C\u6574\u6A94\u6848\u5167\u5BB9
- JSON \u6B04\u4F4D\u53EA\u80FD\u4F7F\u7528 command\u3001filename\u3001content
- \u5982\u679C\u662F HTML\uFF0C\u5FC5\u9808\u662F\u55AE\u6A94 HTML\uFF0CCSS/JS \u90FD\u5167\u5D4C\uFF0C\u4E0D\u8981\u4F7F\u7528\u5916\u90E8\u5957\u4EF6\u3002
- \u5982\u679C\u662F Markdown\uFF0C\u8ACB\u7528\u7E41\u9AD4\u4E2D\u6587\uFF0C\u5167\u5BB9\u8981\u77ED\u800C\u6E05\u695A\uFF0C\u9069\u5408\u8AB2\u5802\u73FE\u5834\u95B1\u8B80\u3002

\u4F7F\u7528\u8005\u8981\u6C42\uFF1A
${example.prompt}`;
    try {
      const command = await this.planArtifactCommand(plannerPrompt, startedAt);
      command.command = `create`;
      command.filename = example.filename;
      this.plannerPreview = formatCommandPreview(command);
      this.processingPhase = `tool`;
      this.processingStage = i18n(
        `\u6A21\u578B\u5DF2\u4EA4\u51FA\u5DE5\u5177\u53C3\u6578\uFF1B\u672C\u6A5F artifacts() \u6E96\u5099\u5EFA\u7ACB ${example.filename}\u3002`
      );
      await wait(1400);
      this.processingStage = i18n(`\u672C\u6A5F artifacts() \u6B63\u5728\u628A\u5167\u5BB9\u5BEB\u9032 ${example.filename}\u3002`);
      const output = await this.appendAndExecuteToolCall({
        command,
        text: i18n(
          `\u6211\u6703\u5EFA\u7ACB \`${example.filename}\`\u3002\u4E0B\u9762\u662F\u6A21\u578B\u898F\u5283\u51FA\u7684 artifacts \u5DE5\u5177\u547C\u53EB\uFF0C\u63A5\u8457\u7531\u672C\u6A5F\u5DE5\u5177\u57F7\u884C\u3002`
        ),
        toolCallPrefix: `artifact-create`
      });
      await wait(900);
      this.hasArtifacts = this.artifactsPanel.artifacts.size > 0;
      this.showArtifacts = this.hasArtifacts;
      this.artifactCount = this.artifactsPanel.artifacts.size;
      this.lastObservation = output.startsWith(`Error:`) ? i18n(`\u5EFA\u7ACB\u5931\u6557\uFF1A\u5DE5\u5177\u62D2\u7D55\u4E86\u6A21\u578B\u7684\u53C3\u6578\u3002\u8ACB\u6AA2\u67E5\u5DE5\u5177\u547C\u53EB\u3002`) : i18n(`\u5DF2\u5EFA\u7ACB ${this.artifactCount} \u4EFD\u7522\u7269\u3002\u8ACB\u6AA2\u67E5\u7522\u7269\u9762\u677F\uFF0C\u518D\u8981\u6C42\u6A21\u578B\u4FEE\u6539\u540C\u4E00\u4EFD\u6A94\u6848\u3002`);
      this.processingPhase = `done`;
      this.processingStage = output.startsWith(`Error:`) ? i18n(`\u5DE5\u5177\u56DE\u5831\u5931\u6557\uFF0C\u8ACB\u770B\u804A\u5929\u5340\u932F\u8AA4\u8A0A\u606F\u3002`) : i18n(`\u7522\u7269\u5DF2\u51FA\u73FE\u5728\u53F3\u5074\u9762\u677F\uFF0C\u73FE\u5728\u8F2A\u5230\u4EBA\u6AA2\u67E5\u5B83\u662F\u5426\u7B26\u5408\u4EFB\u52D9\u3002`);
      this.stopProcessClock();
    } catch (error) {
      const message = artifactFailureMessage(`\u5EFA\u7ACB`, error);
      this.session.appendMessage({
        role: `assistant`,
        content: [{ type: `text`, text: message }],
        timestamp: Date.now()
      });
      this.lastObservation = message;
      this.processingPhase = ``;
      this.processingStage = ``;
      this.stopProcessClock();
    } finally {
      this.runningExample = ``;
      this.isPlanning = false;
    }
  }
  async refineCurrentArtifact() {
    if (this.session.state.isStreaming || this.isPlanning) return;
    const filename = this.artifactsPanel._activeFilename || Array.from(this.artifactsPanel.artifacts.keys())[0];
    if (!filename) return;
    const artifact = this.artifactsPanel.artifacts.get(filename);
    if (!artifact) return;
    const userPrompt = `\u8ACB\u4FEE\u6539\u76EE\u524D\u7684\u7522\u7269 ${filename}\u3002\u8ACB\u4E0D\u8981\u5EFA\u7ACB\u65B0\u6A94\uFF0C\u8ACB\u7528 artifacts \u5DE5\u5177\u66F4\u65B0\u540C\u4E00\u4EFD\u6A94\u6848\u3002\u4FEE\u6539\u5167\u5BB9\uFF1A\u52A0\u5165\u4E00\u6BB5\u300C\u8AB2\u5802\u9A57\u6536\u300D\u5340\u584A\uFF0C\u63D0\u9192\u5B78\u751F\u6AA2\u67E5\u9019\u4EFD\u7522\u7269\u662F\u5426\u7B26\u5408\u4EFB\u52D9\u3001\u662F\u5426\u80FD\u9810\u89BD\u3001\u662F\u5426\u9700\u8981\u4EBA\u5DE5\u78BA\u8A8D\u3002`;
    this.isPlanning = true;
    this.processingPhase = `planning`;
    this.processingStage = `\u6A21\u578B\u6B63\u5728\u8B80\u76EE\u524D\u7522\u7269\uFF0C\u898F\u5283\u8981 update \u9084\u662F rewrite\u3002`;
    this.plannerPreview = formatExpectedUpdatePreview(filename);
    this.lastObservation = `\u6A21\u578B\u6B63\u5728\u898F\u5283 ${filename} \u7684 artifacts \u66F4\u65B0\u6307\u4EE4...`;
    this.startProcessClock();
    const startedAt = performance.now();
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: userPrompt }],
      timestamp: Date.now()
    });
    const plannerPrompt = `\u4F60\u8981\u7522\u751F\u4E00\u500B artifacts \u5DE5\u5177\u6307\u4EE4\u4F86\u4FEE\u6539\u65E2\u6709\u6A94\u6848\u3002\u53EA\u56DE\u50B3 JSON\uFF0C\u4E0D\u8981 markdown\uFF0C\u4E0D\u8981\u89E3\u91CB\u3002

\u9650\u5236\uFF1A
- \u5FC5\u9808\u4FEE\u6539\u540C\u4E00\u500B\u6A94\u6848\uFF1A${filename}
- \u4E0D\u53EF\u4EE5\u4F7F\u7528 command=create
- \u82E5\u6A94\u6848\u662F HTML\uFF0C\u512A\u5148\u7528 command=update\uFF0C\u628A\u4E00\u6BB5\u300C\u8AB2\u5802\u9A57\u6536\u300D\u5340\u584A\u63D2\u5165 </main> \u524D\u9762\u3002
- \u82E5\u6A94\u6848\u662F Markdown\uFF0C\u4F7F\u7528 command=rewrite\uFF0Ccontent \u5FC5\u9808\u662F\u5B8C\u6574\u539F\u6587\u52A0\u4E0A\u300C\u8AB2\u5802\u9A57\u6536\u300D\u5340\u584A\u3002
- JSON \u6B04\u4F4D\u53EA\u80FD\u4F7F\u7528 command\u3001filename\u3001old_str\u3001new_str\uFF1B\u5FC5\u8981\u6642\u53EF\u7528 command=rewrite\u3001filename\u3001content\u3002

\u76EE\u524D\u6A94\u6848\u5167\u5BB9\uFF1A

${artifact.content.slice(0, 18e3)}

\u4F7F\u7528\u8005\u8981\u6C42\uFF1A
${userPrompt}`;
    try {
      const command = await this.planArtifactCommand(plannerPrompt, startedAt);
      if (command.command === `create`) throw new Error(`Planner tried to create a new file`);
      command.filename = filename;
      this.plannerPreview = formatCommandPreview(command);
      this.processingPhase = `tool`;
      this.processingStage = `\u6A21\u578B\u5DF2\u4EA4\u51FA\u5DE5\u5177\u53C3\u6578\uFF1B\u672C\u6A5F artifacts() \u6E96\u5099\u66F4\u65B0 ${filename}\u3002`;
      await wait(1400);
      this.processingStage = `\u672C\u6A5F artifacts() \u6B63\u5728\u628A\u4FEE\u6539\u5BEB\u56DE ${filename}\u3002`;
      const output = await this.appendAndExecuteToolCall({
        command,
        text: `\u6211\u6703\u66F4\u65B0\u540C\u4E00\u4EFD\u7522\u7269 \`${filename}\`\uFF0C\u800C\u4E0D\u662F\u5EFA\u7ACB\u65B0\u6A94\u3002\u4E0B\u9762\u662F\u6A21\u578B\u898F\u5283\u51FA\u7684 artifacts \u5DE5\u5177\u547C\u53EB\u3002`,
        toolCallPrefix: `artifact-update`
      });
      await wait(900);
      let finalOutput = output;
      if (output.startsWith(`Error:`) || output.includes(`String not found in file`)) {
        this.processingPhase = `recovering`;
        this.processingStage = `update \u627E\u4E0D\u5230\u9010\u5B57\u76F8\u540C\u7684 old_str\uFF0C\u6539\u7528 rewrite \u4FDD\u7559\u539F\u6A94\u518D\u9644\u52A0\u65B0\u6BB5\u843D\u3002`;
        await wait(1400);
        const recoveredContent = `${artifact.content.trimEnd()}

## \u8AB2\u5802\u9A57\u6536

- \u6AA2\u67E5\u9019\u4EFD\u7522\u7269\u662F\u5426\u7B26\u5408\u4EFB\u52D9\u8981\u6C42\u3002
- \u78BA\u8A8D\u5167\u5BB9\u662F\u5426\u80FD\u6B63\u5E38\u9810\u89BD\u3002
- \u82E5\u6709\u4E0D\u78BA\u5B9A\u6216\u9AD8\u98A8\u96AA\u5167\u5BB9\uFF0C\u8ACB\u9032\u884C\u4EBA\u5DE5\u78BA\u8A8D\u3002
`;
        finalOutput = await this.appendAndExecuteToolCall({
          command: { command: `rewrite`, filename, content: recoveredContent },
          text: `\u525B\u525B\u7684 update \u5931\u6557\uFF0C\u56E0\u70BA old_str \u5FC5\u9808\u548C\u6A94\u6848\u5167\u5BB9\u9010\u5B57\u76F8\u540C\u3002\u9019\u6B21\u6539\u7528 rewrite \u66F4\u65B0\u540C\u4E00\u4EFD\u6A94\u6848\uFF0C\u4FDD\u7559\u539F\u6587\u4E26\u9644\u52A0\u300C\u8AB2\u5802\u9A57\u6536\u300D\u3002`,
          toolCallPrefix: `artifact-recover`
        });
        await wait(900);
      }
      this.hasArtifacts = true;
      this.showArtifacts = true;
      this.artifactCount = this.artifactsPanel.artifacts.size;
      this.lastObservation = finalOutput.startsWith(`Error:`) ? `\u4FEE\u6539\u5931\u6557\uFF1A\u5DE5\u5177\u62D2\u7D55\u4E86\u6A21\u578B\u7684\u53C3\u6578\u3002\u9019\u4E5F\u662F\u672C\u9801\u8981\u770B\u7684\u98A8\u96AA\u3002` : `\u4FEE\u6539\u5B8C\u6210\u3002\u7522\u7269\u6578\u91CF\u4ECD\u662F ${this.artifactCount}\uFF0C\u4EE3\u8868\u9019\u6B21\u91CD\u9EDE\u662F\u66F4\u65B0\u540C\u4E00\u4EFD\u6A94\u6848\u3002`;
      this.processingPhase = `done`;
      this.processingStage = finalOutput.startsWith(`Error:`) ? `\u5DE5\u5177\u56DE\u5831\u5931\u6557\uFF0C\u8ACB\u770B\u804A\u5929\u5340\u932F\u8AA4\u8A0A\u606F\u3002` : `\u540C\u4E00\u4EFD\u7522\u7269\u5DF2\u66F4\u65B0\uFF0C\u8ACB\u6AA2\u67E5\u53F3\u5074\u5167\u5BB9\u662F\u5426\u771F\u7684\u6539\u4E86\u3002`;
      this.stopProcessClock();
    } catch (error) {
      const message = artifactFailureMessage(`\u4FEE\u6539`, error);
      this.session.appendMessage({
        role: `assistant`,
        content: [{ type: `text`, text: message }],
        timestamp: Date.now()
      });
      this.lastObservation = message;
      this.processingPhase = ``;
      this.processingStage = ``;
      this.stopProcessClock();
    } finally {
      this.isPlanning = false;
      this.plannerPreview = ``;
    }
  }
  async planArtifactCommand(plannerPrompt, startedAt) {
    const authToken = await v();
    if (!authToken) throw new Error(`ChatGPT \u5C1A\u672A\u9023\u7DDA`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 9e4);
    const context = {
      systemPrompt: `\u4F60\u662F artifacts \u5DE5\u5177\u6307\u4EE4\u898F\u5283\u5668\u3002\u53EA\u8F38\u51FA\u6709\u6548 JSON\u3002`,
      messages: [{ role: `user`, content: [{ type: `text`, text: plannerPrompt }] }]
    };
    let plannerText = ``;
    try {
      for await (const event of i2(this.session.state.model, context, {
        authToken,
        maxTokens: 2200,
        signal: controller.signal
      })) {
        if (event.type === `text_delta`) {
          plannerText += event.delta;
          this.plannerPreview = trimPlannerPreview(plannerText);
        }
        if (event.type === `done`) {
          plannerText = event.message.content.filter((part) => part.type === `text`).map((part) => part.text).join(`
`) || plannerText;
          this.plannerPreview = trimPlannerPreview(plannerText);
        }
        if (event.type === `error`) throw new Error(event.error?.errorMessage || `Planner failed`);
      }
    } catch (error) {
      if (controller.signal.aborted) throw new Error(`\u6A21\u578B\u898F\u5283\u8D85\u904E 90 \u79D2\uFF0C\u5DF2\u505C\u6B62\u9019\u6B21\u64CD\u4F5C`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
    this.debugLog = [
      ...this.debugLog,
      {
        timestamp: (/* @__PURE__ */ new Date()).toISOString(),
        totalTime: performance.now() - startedAt,
        request: {
          provider: this.session.state.model.provider,
          model: this.session.state.model.id,
          context: {
            systemPrompt: context.systemPrompt,
            messages: context.messages
          }
        },
        response: { role: `assistant`, content: plannerText }
      }
    ];
    return extractJsonObject(plannerText);
  }
  handleSessionState(state) {
    if (state.isStreaming) {
      if (!this.isPlanning) {
        this.processingPhase = `streaming`;
        this.processingStage = `\u6A21\u578B\u6B63\u5728\u8655\u7406\u4F60\u7684\u4FEE\u6539\u9700\u6C42\uFF1B\u5982\u679C\u9700\u8981\u6539\u6A94\uFF0C\u4E0B\u4E00\u6B65\u6703\u547C\u53EB artifacts()\u3002`;
      }
      if (!this.streamTimeoutId) {
        this.streamTimeoutId = setTimeout(() => {
          if (!this.session.state.isStreaming) return;
          this.session.abort();
          this.processingPhase = ``;
          this.processingStage = ``;
          this.lastObservation = `\u6A21\u578B\u8655\u7406\u8D85\u904E 60 \u79D2\uFF0C\u5DF2\u505C\u6B62\u9019\u6B21\u56DE\u5408\u3002\u8ACB\u628A\u4FEE\u6539\u9700\u6C42\u62C6\u6210\u55AE\u4E00\u6B65\u9A5F\uFF0C\u6216\u4F7F\u7528\u5DE6\u5074\u300C\u4FEE\u6539\u76EE\u524D\u7522\u7269\u300D\u3002`;
          setTimeout(() => {
            if (this.session.state.isStreaming) return;
            this.session.appendMessage({
              role: `assistant`,
              content: [
                {
                  type: `text`,
                  text: `\u9019\u6B21 artifact \u4FEE\u6539\u82B1\u592A\u4E45\uFF0C\u5DF2\u81EA\u52D5\u505C\u6B62\u3002\u5EFA\u8B70\u4E00\u6B21\u53EA\u6539\u4E00\u4EF6\u4E8B\uFF0C\u4F8B\u5982\u300C\u53EA\u628A\u958B\u5834\u6539\u5F97\u66F4\u53E3\u8A9E\u300D\u6216\u300C\u53EA\u65B0\u589E\u8AB2\u5802\u9A57\u6536\u300D\u3002`
                }
              ],
              timestamp: Date.now()
            });
          }, 250);
        }, 6e4);
      }
    } else {
      if (this.streamTimeoutId) clearTimeout(this.streamTimeoutId);
      this.streamTimeoutId = null;
      if (!this.isPlanning && this.processingPhase === `streaming`) {
        this.processingPhase = ``;
        this.processingStage = ``;
      }
      this.recoverFailedUpdateIfPossible(state.messages);
    }
  }
  async recoverFailedUpdateIfPossible(messages) {
    const failed = [...messages].reverse().find(
      (message) => message.role === `toolResult` && message.toolName === `artifacts` && message.isError && !this.recoveredToolResults.has(message.toolCallId) && String(message.output || ``).includes(`String not found in file`)
    );
    if (!failed) return;
    const toolCall = messages.flatMap((message) => message.role === `assistant` ? message.content || [] : []).find(
      (part) => part.type === `toolCall` && part.id === failed.toolCallId && part.name === `artifacts`
    );
    if (!toolCall || toolCall.arguments?.command !== `update` || !toolCall.arguments?.filename || toolCall.arguments?.new_str === void 0)
      return;
    this.recoveredToolResults.add(failed.toolCallId);
    const filename = toolCall.arguments.filename;
    this.processingPhase = `recovering`;
    this.processingStage = `\u5DE5\u5177\u56DE\u5831 old_str \u4E0D\u543B\u5408\uFF0C\u6B63\u5728\u7528 rewrite \u4FEE\u5FA9 ${filename}\u3002`;
    this.lastObservation = `update \u627E\u4E0D\u5230\u5B8C\u5168\u76F8\u540C\u7684\u820A\u5B57\u4E32\uFF0C\u6539\u7528 rewrite \u4FEE\u5FA9\u540C\u4E00\u4EFD\u6A94\u6848\u3002`;
    const output = await this.appendAndExecuteToolCall({
      command: {
        command: `rewrite`,
        filename,
        content: toolCall.arguments.new_str
      },
      text: `\u525B\u525B\u7684 update \u5931\u6557\uFF0C\u56E0\u70BA old_str \u5FC5\u9808\u548C\u6A94\u6848\u5167\u5BB9\u9010\u5B57\u76F8\u540C\u3002\u9019\u6B21\u6539\u7528 rewrite\uFF0C\u628A\u6A21\u578B\u60F3\u8981\u7684\u65B0\u5167\u5BB9\u5BEB\u56DE\u540C\u4E00\u4EFD\u6A94\u6848\u3002`,
      toolCallPrefix: `artifact-auto-recover`
    });
    this.hasArtifacts = this.artifactsPanel.artifacts.size > 0;
    this.showArtifacts = this.hasArtifacts;
    this.artifactCount = this.artifactsPanel.artifacts.size;
    this.lastObservation = output.startsWith(`Error:`) ? `\u81EA\u52D5\u4FEE\u5FA9\u5931\u6557\uFF1A${output.replace(/^Error:\s*/, ``)}` : `\u5DF2\u7528 rewrite \u4FEE\u5FA9\u3002\u7522\u7269\u6578\u91CF\u4ECD\u662F ${this.artifactCount}\uFF0C\u540C\u4E00\u4EFD\u6A94\u6848\u5DF2\u66F4\u65B0\u3002`;
    this.processingPhase = ``;
    this.processingStage = ``;
  }
  async appendAndExecuteToolCall({ command, text, toolCallPrefix }) {
    const toolCallId = `${toolCallPrefix}-${Date.now()}`;
    this.session.appendMessage({
      role: `assistant`,
      content: [
        { type: `text`, text },
        {
          type: `toolCall`,
          id: toolCallId,
          name: `artifacts`,
          arguments: command
        }
      ],
      api: this.session.state.model.api,
      provider: this.session.state.model.provider,
      model: this.session.state.model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 }
      },
      stopReason: `stop`,
      timestamp: Date.now()
    });
    const output = await this.artifactsPanel.executeCommand(command);
    this.session.appendMessage({
      role: `toolResult`,
      toolCallId,
      toolName: `artifacts`,
      output,
      details: {},
      isError: output.startsWith(`Error:`),
      timestamp: Date.now()
    });
    return output;
  }
  renderContentPanel() {
    this.artifactsPanel.collapsed = false;
    this.artifactsPanel.overlay = false;
    const isMobile = window.innerWidth < 1024;
    let chatWidth = `100%`;
    let artifactWidth = `0%`;
    if (this.hasArtifacts) {
      if (isMobile) {
        chatWidth = this.showArtifacts ? `0%` : `100%`;
        artifactWidth = this.showArtifacts ? `100%` : `0%`;
      } else {
        chatWidth = this.showArtifacts ? `50%` : `100%`;
        artifactWidth = this.showArtifacts ? `50%` : `0%`;
      }
    }
    return b`
			<div class="relative w-full h-full overflow-hidden flex">
				<div class="h-full pb-2" style="width: ${chatWidth};">${this.agentInterface}</div>
				<div class="h-full" style="width: ${artifactWidth};">${this.artifactsPanel}</div>
				${this.hasArtifacts && !this.showArtifacts ? b`<button class="absolute top-4 left-1/2 -translate-x-1/2 z-30" @click=${() => this.showArtifacts = true} title=${i18n(`\u986F\u793A\u7522\u7269`)}>
							${u(b`<span class="inline-flex items-center gap-1"><span>${i18n(`\u7522\u7269`)}</span></span>`)}
						</button>` : ``}
			</div>
		`;
  }
  renderLeftDemoPanel() {
    const isBusy = this.session.state.isStreaming || this.isPlanning;
    return b`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${i18n(`Let the model really call the artifacts tool to create and modify documents, code, or webpages. The point is not that \u201Cthe model can write\u201D; it is how chat, tool calls, and the artifact panel connect.`)}
				</p>
				<div class="rounded-lg border border-border bg-card/40 p-3 text-sm flex-shrink-0">
					<div class="font-semibold text-foreground mb-2">${i18n(`artifacts() tool contract`)}</div>
					<div class="space-y-1 text-muted-foreground">
						<div><span class="text-foreground">${i18n(`Input:`)}</span> ${i18n(`command and filename, plus content or replacement text.`)}</div>
						<div><span class="text-foreground">${i18n(`Output:`)}</span> ${i18n(`the result of creating, updating, deleting, or reading one artifact.`)}</div>
						<div><span class="text-foreground">${i18n(`Boundary:`)}</span> ${i18n(`the tool only changes files using the parameters the model provides; people still need to inspect content quality and whether the HTML works.`)}</div>
					</div>
				</div>
				${this.hasArtifacts ? b`<button ?disabled=${isBusy} @click=${() => this.refineCurrentArtifact()} class="w-full text-left p-3 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/15 disabled:opacity-50 transition-colors flex-shrink-0">
							<div class="text-sm font-medium text-foreground">${i18n(`Modify current artifact`)}</div>
							<div class="text-xs text-muted-foreground mt-1">${i18n(`Ask the model to update the same file instead of creating a new one.`)}</div>
						</button>` : ``}
				${this.lastObservation ? b`<div class="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex-shrink-0">${this.lastObservation}</div>` : ``}
				${isBusy || this.processingPhase ? this.renderProcessingCard() : ``}
				<div class="space-y-2 flex-shrink-0">
					${this.examples.map(
      (example) => b`
							<button ?disabled=${isBusy} @click=${() => this.runExample(example)} class="w-full text-left p-3 rounded-md border ${this.selectedExample === example.id ? `border-primary/60 bg-primary/10` : `border-border`} hover:bg-muted/50 disabled:opacity-50 transition-colors">
						<div class="text-sm font-medium text-foreground">${example.title}${this.runningExample === example.id ? i18n(`\uFF08\u57F7\u884C\u4E2D\uFF09`) : ``}</div>
								<div class="text-xs text-muted-foreground mt-1">${example.description}</div>
							</button>
						`
    )}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto rounded-md border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
						<div class="font-medium text-foreground mb-2">${i18n(`What to inspect`)}</div>
						<ol class="list-decimal pl-4 space-y-1">
							<li>${i18n(`First inspect the tool card in chat: does the model want to create, update, or rewrite?`)}</li>
							<li>${i18n(`Then inspect the artifact panel: did the content actually change?`)}</li>
							<li>${i18n(`Finally check the result: previewable, readable, and no wrong file was overwritten.`)}</li>
						</ol>
					</div>
				</div>
			</div>
		`;
  }
  renderRightDemoPanel() {
    return b`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};
__decorate([r()], ArtifactsToolDemo.prototype, `debugLog`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `hasArtifacts`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `showArtifacts`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `artifactCount`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `runningExample`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `selectedExample`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `lastObservation`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `isPlanning`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processingPhase`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processingStage`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `plannerPreview`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processStartedAt`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processFinishedAt`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processNow`, void 0);
ArtifactsToolDemo = __decorate([t(`artifacts-tool-demo`)], ArtifactsToolDemo);
document.body.innerHTML = `<artifacts-tool-demo></artifacts-tool-demo>`;
export {
  ArtifactsToolDemo
};
//# sourceMappingURL=5-5-artifacts-tool.js.map
