import {
  Button,
  Diff,
  createRef,
  html,
  i$1 as LitElement,
  i18n,
  iconCloseLine,
  iconDownloadLine,
  ref,
  unsafeHTML,
} from "../mini-lit/index.js";
import "./CodeBlock.js";
import "./PreviewCodeToggle.js";
import { Badge } from "./UiPrimitives.js";
import { StringEnum, Type } from "./AgentRuntime.js";

function downloadButton({ content, filename, mimeType = "text/plain", title = i18n("Download") }) {
  return Button({
    variant: "ghost",
    size: "sm",
    title,
    onClick: () => {
      const blob = new Blob([content], { type: mimeType });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = filename;
      link.click();
      URL.revokeObjectURL(url);
    },
    children: html`${iconDownloadLine("sm")}`,
  });
}

function errorForMissingFile(filename, files) {
  if (!files.length) {
    return i18n("Error: File {filename} not found. No files have been created yet.")(filename);
  }
  return i18n("Error: File {filename} not found. Available files: {files}")(
    filename,
    files.join(", "),
  );
}

function fileType(filename = "") {
  const extension = filename.split(".").pop()?.toLowerCase();
  if (extension === "html") return "html";
  if (extension === "svg") return "svg";
  if (extension === "md" || extension === "markdown") return "markdown";
  return "text";
}

function languageFromFilename(filename = "") {
  const extension = filename.split(".").pop()?.toLowerCase() || "";
  return (
    {
      bash: "bash",
      c: "c",
      cpp: "cpp",
      cs: "csharp",
      css: "css",
      go: "go",
      html: "html",
      java: "java",
      js: "javascript",
      json: "json",
      jsx: "javascript",
      kt: "kotlin",
      md: "markdown",
      php: "php",
      py: "python",
      r: "r",
      rb: "ruby",
      rs: "rust",
      scss: "scss",
      sh: "bash",
      sql: "sql",
      svg: "xml",
      swift: "swift",
      ts: "typescript",
      tsx: "typescript",
      xml: "xml",
      yaml: "yaml",
      yml: "yaml",
    }[extension] || "text"
  );
}

class BaseArtifactElement extends LitElement {
  static properties = {
    content: { type: String },
    displayTitle: { type: String },
    filename: { type: String },
  };

  constructor() {
    super();
    this.content = "";
    this.displayTitle = "";
    this.filename = "";
  }

  createRenderRoot() {
    return this;
  }

  getHeaderButtons() {
    return html``;
  }
}

class HtmlArtifactElement extends BaseArtifactElement {
  static properties = {
    ...BaseArtifactElement.properties,
    attachments: { type: Array },
  };

  constructor() {
    super();
    this.attachments = [];
    this.logs = [];
    this.iframeRef = createRef();
  }

  updated(changedProperties) {
    if (changedProperties.has("content") || changedProperties.has("attachments")) {
      this.renderIframe();
    }
  }

  getLogs() {
    if (!this.logs.length) return i18n("No logs for {filename}")(this.filename);
    return this.logs.map((entry) => `[${entry.type}] ${entry.text}`).join("\n");
  }

  getHeaderButtons() {
    return html`
      <copy-button .text=${this.content} title=${i18n("Copy HTML")} .showText=${false}></copy-button>
      ${downloadButton({
        content: this.content,
        filename: this.filename,
        mimeType: "text/html",
        title: i18n("Download HTML"),
      })}
    `;
  }

  attachmentScript() {
    const safeAttachments = JSON.stringify(this.attachments || []);
    return `
<script>
window.attachments = ${safeAttachments};
window.listFiles = () => window.attachments.map(({id, fileName, mimeType, size}) => ({id, fileName, mimeType, size}));
window.readTextFile = (id) => {
  const file = window.attachments.find((entry) => entry.id === id);
  if (!file) throw new Error("Attachment not found: " + id);
  const binary = atob(file.content || "");
  const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
  return new TextDecoder().decode(bytes);
};
window.readBinaryFile = (id) => {
  const file = window.attachments.find((entry) => entry.id === id);
  if (!file) throw new Error("Attachment not found: " + id);
  const binary = atob(file.content || "");
  return Uint8Array.from(binary, (character) => character.charCodeAt(0));
};
for (const method of ["log", "warn", "error"]) {
  const original = console[method].bind(console);
  console[method] = (...args) => {
    original(...args);
    parent.postMessage({
      artifactId: ${JSON.stringify(this.filename)},
      type: "console",
      method,
      text: args.map((arg) => typeof arg === "string" ? arg : JSON.stringify(arg)).join(" ")
    }, "*");
  };
}
window.addEventListener("error", (event) => {
  parent.postMessage({
    artifactId: ${JSON.stringify(this.filename)},
    type: "console",
    method: "error",
    text: event.message
  }, "*");
});
window.addEventListener("load", () => {
  setTimeout(() => parent.postMessage({
    artifactId: ${JSON.stringify(this.filename)},
    type: "execution-complete"
  }, "*"), 50);
});
</script>`;
  }

  renderIframe() {
    const iframe = this.iframeRef.value;
    if (!iframe) return;
    this.logs = [];
    iframe.srcdoc = `${this.attachmentScript()}\n${this.content || ""}`;
  }

  connectedCallback() {
    super.connectedCallback();
    this._messageHandler = (event) => {
      if (event.data?.artifactId !== this.filename) return;
      if (event.data.type === "console") {
        this.logs = [
          ...this.logs,
          { type: event.data.method === "error" ? "error" : "log", text: event.data.text },
        ];
      }
    };
    window.addEventListener("message", this._messageHandler);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    if (this._messageHandler) window.removeEventListener("message", this._messageHandler);
  }

  render() {
    return html`
      <iframe
        ${ref(this.iframeRef)}
        class="h-full w-full border-0 bg-white"
        sandbox="allow-scripts allow-modals"
        title=${this.filename}
      ></iframe>
    `;
  }
}

class MarkdownArtifactElement extends BaseArtifactElement {
  static properties = {
    ...BaseArtifactElement.properties,
    viewMode: { type: String },
  };

  constructor() {
    super();
    this.viewMode = "preview";
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  getHeaderButtons() {
    return html`
      <preview-code-toggle
        .mode=${this.viewMode}
        @mode-change=${(event) => this.setViewMode(event.detail)}
      ></preview-code-toggle>
      <copy-button
        .text=${this.content}
        title=${i18n("Copy Markdown")}
        .showText=${false}
      ></copy-button>
      ${downloadButton({
        content: this.content,
        filename: this.filename,
        mimeType: "text/markdown",
        title: i18n("Download Markdown"),
      })}
    `;
  }

  render() {
    return this.viewMode === "preview"
      ? html`<div class="h-full overflow-auto p-4">
          <markdown-block .content=${this.content}></markdown-block>
        </div>`
      : html`<div class="h-full overflow-auto">
          <code-block .code=${this.content} language="markdown"></code-block>
        </div>`;
  }
}

class SvgArtifactElement extends BaseArtifactElement {
  static properties = {
    ...BaseArtifactElement.properties,
    viewMode: { type: String },
  };

  constructor() {
    super();
    this.viewMode = "preview";
  }

  setViewMode(mode) {
    this.viewMode = mode;
  }

  getHeaderButtons() {
    return html`
      <preview-code-toggle
        .mode=${this.viewMode}
        @mode-change=${(event) => this.setViewMode(event.detail)}
      ></preview-code-toggle>
      <copy-button .text=${this.content} title=${i18n("Copy SVG")} .showText=${false}></copy-button>
      ${downloadButton({
        content: this.content,
        filename: this.filename,
        mimeType: "image/svg+xml",
        title: i18n("Download SVG"),
      })}
    `;
  }

  render() {
    return this.viewMode === "preview"
      ? html`<div class="grid h-full place-items-center overflow-auto bg-white p-4">
          ${unsafeHTML(this.content)}
        </div>`
      : html`<div class="h-full overflow-auto">
          <code-block .code=${this.content} language="xml"></code-block>
        </div>`;
  }
}

class TextArtifactElement extends BaseArtifactElement {
  getHeaderButtons() {
    return html`
      <copy-button .text=${this.content} title=${i18n("Copy")} .showText=${false}></copy-button>
      ${downloadButton({
        content: this.content,
        filename: this.filename,
        mimeType: "text/plain",
        title: i18n("Download"),
      })}
    `;
  }

  render() {
    return html`<div class="h-full overflow-auto">
      <code-block .code=${this.content} language=${languageFromFilename(this.filename)}></code-block>
    </div>`;
  }
}

const artifactParameters = Type.Object({
  command: StringEnum(["create", "update", "rewrite", "get", "delete", "logs"], {
    description: "The operation to perform",
  }),
  filename: Type.String({
    description: "Filename including extension, for example index.html or README.md",
  }),
  content: Type.Optional(Type.String({ description: "File content" })),
  old_str: Type.Optional(Type.String({ description: "String to replace for update command" })),
  new_str: Type.Optional(Type.String({ description: "Replacement string for update command" })),
});

export class ArtifactsPanel extends LitElement {
  static properties = {
    _activeFilename: { state: true },
    _artifacts: { state: true },
    collapsed: { type: Boolean },
    overlay: { type: Boolean },
  };

  constructor() {
    super();
    this._artifacts = new Map();
    this._activeFilename = null;
    this.artifactElements = new Map();
    this.contentRef = createRef();
    this.collapsed = false;
    this.overlay = false;
    this.attachmentsProvider = null;
    this.onArtifactsChange = null;
    this.onClose = null;
    this.onOpen = null;
  }

  get artifacts() {
    return this._artifacts;
  }

  get tool() {
    return {
      label: "Artifacts",
      name: "artifacts",
      description: `Creates and manages file artifacts. Prefer updating existing files over creating new ones.

Commands:
- create: create a new file with filename and content.
- update: replace old_str with new_str in an existing file.
- rewrite: replace an existing file with complete content.
- get: return the full content of a file.
- delete: delete a file.
- logs: return console logs for an HTML artifact.`,
      parameters: artifactParameters,
      execute: async (_id, args) => ({ output: await this.executeCommand(args), details: undefined }),
    };
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    this.style.display = "block";
  }

  updated() {
    this.syncArtifactElements();
  }

  syncArtifactElements() {
    const container = this.contentRef.value;
    if (!container) return;
    if (!this._activeFilename && this._artifacts.size) {
      this._activeFilename = Array.from(this._artifacts.keys())[0];
    }
    for (const [filename, element] of this.artifactElements.entries()) {
      if (!element.parentElement) container.appendChild(element);
      element.style.display = filename === this._activeFilename ? "block" : "none";
    }
  }

  getFileType(filename) {
    return fileType(filename);
  }

  getLanguageFromFilename(filename) {
    return languageFromFilename(filename);
  }

  createArtifactElement(filename, content, title) {
    const type = fileType(filename);
    const element =
      type === "html"
        ? new HtmlArtifactElement()
        : type === "svg"
          ? new SvgArtifactElement()
          : type === "markdown"
            ? new MarkdownArtifactElement()
            : new TextArtifactElement();
    element.filename = filename;
    element.displayTitle = title || filename;
    element.content = content || "";
    element.style.display = "none";
    element.style.height = "100%";
    if (element instanceof HtmlArtifactElement) {
      element.attachments = this.attachmentsProvider?.() || [];
    }
    return element;
  }

  getOrCreateArtifactElement(filename, content, title) {
    let element = this.artifactElements.get(filename);
    if (!element) {
      element = this.createArtifactElement(filename, content, title);
      this.artifactElements.set(filename, element);
    } else {
      element.content = content || "";
      element.displayTitle = title || filename;
      if (element instanceof HtmlArtifactElement) {
        element.attachments = this.attachmentsProvider?.() || [];
      }
    }
    this.syncArtifactElements();
    return element;
  }

  showArtifact(filename) {
    this._activeFilename = filename;
    this.syncArtifactElements();
    this.requestUpdate();
  }

  openArtifact(filename) {
    if (!this._artifacts.has(filename)) return;
    this.showArtifact(filename);
    this.onOpen?.();
  }

  renderParams(args = {}, pending = false) {
    if (pending && !args.command) {
      return html`<div class="text-sm text-muted-foreground">
        ${i18n("Processing artifact...")}
      </div>`;
    }
    const action =
      {
        create: i18n("Create"),
        update: i18n("Update"),
        rewrite: i18n("Rewrite"),
        get: i18n("Get"),
        delete: i18n("Delete"),
        logs: i18n("Get logs"),
      }[args.command] || args.command || i18n("Processing");
    return html`
      <button
        class="w-full cursor-pointer rounded-sm px-2 py-1 text-left text-sm hover:bg-muted/50"
        @click=${() => this.openArtifact(args.filename)}
      >
        <span class="font-medium">${action}</span>
        <span class="ml-1 text-muted-foreground">${args.filename || ""}</span>
        ${args.command === "update" && args.old_str !== undefined && args.new_str !== undefined
          ? Diff({ oldText: args.old_str, newText: args.new_str, className: "mt-2" })
          : args.content
            ? html`<code-block
                class="mt-2"
                .code=${args.content}
                language=${languageFromFilename(args.filename)}
              ></code-block>`
            : ""}
      </button>
    `;
  }

  renderResult(args = {}, result = {}) {
    return html`
      <button
        class="w-full cursor-pointer rounded-sm px-2 py-1 text-left hover:bg-muted/50"
        @click=${() => this.openArtifact(args.filename)}
      >
        <div class="whitespace-pre-wrap font-mono text-xs text-muted-foreground">
          ${result.output || i18n("(no output)")}
        </div>
      </button>
    `;
  }

  async reconstructFromMessages(messages) {
    const calls = new Map();
    for (const message of messages) {
      if (message.role !== "assistant") continue;
      for (const part of message.content || []) {
        if (part.type === "toolCall" && part.name === "artifacts") calls.set(part.id, part);
      }
    }
    this._artifacts.clear();
    this.artifactElements.forEach((element) => element.remove());
    this.artifactElements.clear();
    this._activeFilename = null;
    for (const message of messages) {
      if (message.role !== "toolResult" || message.toolName !== "artifacts" || message.isError) {
        continue;
      }
      const call = calls.get(message.toolCallId);
      if (!call || ["get", "logs"].includes(call.arguments?.command)) continue;
      await this.executeCommand(call.arguments, { silent: true, skipWait: true });
    }
    if (this._artifacts.size) this.showArtifact(Array.from(this._artifacts.keys())[0]);
    this.onArtifactsChange?.();
  }

  async executeCommand(args = {}, options = {}) {
    switch (args.command) {
      case "create":
        return this.createArtifact(args, options);
      case "update":
        return this.updateArtifact(args, options);
      case "rewrite":
        return this.rewriteArtifact(args, options);
      case "get":
        return this.getArtifact(args);
      case "delete":
        return this.deleteArtifact(args);
      case "logs":
        return this.getLogs(args);
      default:
        return i18n("Error: Unknown command {command}")(args.command);
    }
  }

  async waitForHtmlExecution(filename) {
    const element = this.artifactElements.get(filename);
    if (!(element instanceof HtmlArtifactElement)) return "";
    return new Promise((resolve) => {
      let done = false;
      const finish = (prefix = "") => {
        if (done) return;
        done = true;
        window.removeEventListener("message", onMessage);
        const logs = element.getLogs();
        const empty = logs === i18n("No logs for {filename}")(filename);
        resolve(empty ? "" : `${prefix}\n${logs}`);
      };
      const onMessage = (event) => {
        if (event.data?.type === "execution-complete" && event.data?.artifactId === filename) {
          finish(i18n("Execution logs:"));
        }
      };
      window.addEventListener("message", onMessage);
      window.setTimeout(() => finish(i18n("Execution timed out. Partial logs:")), 1500);
    });
  }

  async createArtifact(args, options = {}) {
    if (!args.filename || !args.content) {
      return i18n("Error: create command requires filename and content");
    }
    if (this._artifacts.has(args.filename)) {
      return i18n("Error: File {filename} already exists")(args.filename);
    }
    const artifact = {
      filename: args.filename,
      title: args.title || args.filename,
      content: args.content,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    this._artifacts.set(args.filename, artifact);
    this._artifacts = new Map(this._artifacts);
    this.getOrCreateArtifactElement(args.filename, args.content, artifact.title);
    if (!options.silent) {
      this.showArtifact(args.filename);
      this.onArtifactsChange?.();
      this.requestUpdate();
    }
    let output = i18n("Created file {filename}")(args.filename);
    if (fileType(args.filename) === "html" && !options.skipWait) {
      output += await this.waitForHtmlExecution(args.filename);
    }
    return output;
  }

  async updateArtifact(args, options = {}) {
    const artifact = this._artifacts.get(args.filename);
    if (!artifact) return errorForMissingFile(args.filename, Array.from(this._artifacts.keys()));
    if (!args.old_str || args.new_str === undefined) {
      return i18n("Error: update command requires old_str and new_str");
    }
    if (!artifact.content.includes(args.old_str)) {
      return i18n("Error: String not found in file. Here is the full content:\n\n{content}")(
        artifact.content,
      );
    }
    artifact.content = artifact.content.replace(args.old_str, args.new_str);
    artifact.updatedAt = new Date();
    this._artifacts.set(args.filename, artifact);
    this._artifacts = new Map(this._artifacts);
    this.getOrCreateArtifactElement(args.filename, artifact.content, artifact.title);
    if (!options.silent) {
      this.onArtifactsChange?.();
      this.requestUpdate();
    }
    let output = i18n("Updated file {filename}")(args.filename);
    if (fileType(args.filename) === "html" && !options.skipWait) {
      output += await this.waitForHtmlExecution(args.filename);
    }
    return output;
  }

  async rewriteArtifact(args, options = {}) {
    const artifact = this._artifacts.get(args.filename);
    if (!artifact) return errorForMissingFile(args.filename, Array.from(this._artifacts.keys()));
    if (!args.content) return i18n("Error: rewrite command requires content");
    artifact.content = args.content;
    artifact.updatedAt = new Date();
    this._artifacts.set(args.filename, artifact);
    this._artifacts = new Map(this._artifacts);
    this.getOrCreateArtifactElement(args.filename, artifact.content, artifact.title);
    if (!options.silent) {
      this.onArtifactsChange?.();
      this.requestUpdate();
    }
    let output = i18n("Rewrote file {filename}")(args.filename);
    if (fileType(args.filename) === "html" && !options.skipWait) {
      output += await this.waitForHtmlExecution(args.filename);
    }
    return output;
  }

  getArtifact(args) {
    const artifact = this._artifacts.get(args.filename);
    if (!artifact) return errorForMissingFile(args.filename, Array.from(this._artifacts.keys()));
    return artifact.content;
  }

  deleteArtifact(args) {
    if (!this._artifacts.has(args.filename)) {
      return errorForMissingFile(args.filename, Array.from(this._artifacts.keys()));
    }
    this._artifacts.delete(args.filename);
    this._artifacts = new Map(this._artifacts);
    const element = this.artifactElements.get(args.filename);
    if (element) element.remove();
    this.artifactElements.delete(args.filename);
    if (this._activeFilename === args.filename) {
      const filenames = Array.from(this._artifacts.keys());
      this._activeFilename = filenames[0] || null;
      if (this._activeFilename) this.showArtifact(this._activeFilename);
    }
    this.onArtifactsChange?.();
    this.requestUpdate();
    return i18n("Deleted file {filename}")(args.filename);
  }

  getLogs(args) {
    const element = this.artifactElements.get(args.filename);
    if (!element) return errorForMissingFile(args.filename, Array.from(this._artifacts.keys()));
    if (!(element instanceof HtmlArtifactElement)) {
      return i18n("Error: File {filename} is not an HTML file. Logs are only available for HTML files.")(
        args.filename,
      );
    }
    return element.getLogs();
  }

  render() {
    const artifacts = Array.from(this._artifacts.values());
    const isVisible = artifacts.length > 0 && !this.collapsed;
    return html`
      ${this.collapsed && artifacts.length
        ? html`
            <button
              class="absolute top-4 left-1/2 z-30 -translate-x-1/2"
              title=${i18n("Show artifacts")}
              @click=${() => this.onOpen?.()}
            >
              ${Badge(html`<span>${i18n("Artifacts")}</span>`)}
            </button>
          `
        : ""}
      <div
        class="${isVisible ? "" : "hidden"} ${this.overlay
          ? "fixed inset-0 z-40"
          : "relative"} flex h-full flex-col overflow-hidden border border-border bg-card text-card-foreground"
      >
        <div class="flex items-center justify-between border-b border-border bg-muted/50">
          <div class="flex overflow-x-auto">
            ${artifacts.map((artifact) => {
              const active = artifact.filename === this._activeFilename;
              return html`
                <button
                  class="whitespace-nowrap border-b-2 px-3 py-2 text-sm ${active
                    ? "border-primary text-primary"
                    : "border-transparent text-muted-foreground hover:text-foreground"}"
                  @click=${() => this.showArtifact(artifact.filename)}
                >
                  <span class="font-mono text-sm">${artifact.filename}</span>
                </button>
              `;
            })}
          </div>
          <div class="flex items-center gap-1 px-2">
            ${this._activeFilename
              ? this.artifactElements.get(this._activeFilename)?.getHeaderButtons()
              : ""}
            ${Button({
              variant: "ghost",
              size: "sm",
              title: i18n("Close artifacts"),
              onClick: () => this.onClose?.(),
              children: iconCloseLine("sm"),
            })}
          </div>
        </div>
        <div class="min-h-0 flex-1 overflow-hidden" ${ref(this.contentRef)}></div>
      </div>
    `;
  }
}

const definitions = {
  "artifacts-panel": ArtifactsPanel,
  "html-artifact": HtmlArtifactElement,
  "markdown-artifact": MarkdownArtifactElement,
  "svg-artifact": SvgArtifactElement,
  "text-artifact": TextArtifactElement,
};

for (const [name, element] of Object.entries(definitions)) {
  if (!customElements.get(name)) customElements.define(name, element);
}
