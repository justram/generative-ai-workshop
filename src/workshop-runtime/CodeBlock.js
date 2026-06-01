import {
  Button,
  createRef,
  html,
  i$1 as LitElement,
  i18n,
  iconAttachment2,
  iconBrainLine,
  iconCheckLine,
  iconCloseLine,
  iconFileCopy2Line,
  iconFileExcel2Line,
  iconFilePpt2Line,
  iconFileTextLine,
  iconFileWord2Line,
  iconImageLine,
  iconLoader4Line,
  iconSendPlane2Line,
  iconSquareFill,
  ref,
  unsafeHTML,
} from "../mini-lit/index.js";

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function getExtension(filename = "") {
  const match = filename.toLowerCase().match(/\.([^.?#/]+)$/);
  return match?.[1] || "";
}

function guessMimeType(filename = "", fallback = "application/octet-stream") {
  const extension = getExtension(filename);
  const common = {
    css: "text/css",
    csv: "text/csv",
    gif: "image/gif",
    html: "text/html",
    jpeg: "image/jpeg",
    jpg: "image/jpeg",
    js: "text/javascript",
    json: "application/json",
    md: "text/markdown",
    pdf: "application/pdf",
    png: "image/png",
    svg: "image/svg+xml",
    ts: "text/typescript",
    txt: "text/plain",
    webp: "image/webp",
    xml: "application/xml",
    yaml: "text/yaml",
    yml: "text/yaml",
  };
  return common[extension] || fallback;
}

function arrayBufferToBase64(buffer) {
  const bytes = new Uint8Array(buffer);
  const chunkSize = 0x8000;
  let binary = "";
  for (let offset = 0; offset < bytes.length; offset += chunkSize) {
    binary += String.fromCharCode(...bytes.subarray(offset, offset + chunkSize));
  }
  return btoa(binary);
}

function decodeBase64Text(base64) {
  try {
    const binary = atob(base64);
    const bytes = Uint8Array.from(binary, (character) => character.charCodeAt(0));
    return new TextDecoder().decode(bytes);
  } catch {
    return "";
  }
}

function isTextLike(mimeType, filename) {
  if (mimeType.startsWith("text/")) return true;
  return [
    "css",
    "csv",
    "html",
    "js",
    "json",
    "jsx",
    "md",
    "ts",
    "tsx",
    "txt",
    "xml",
    "yaml",
    "yml",
  ].includes(getExtension(filename));
}

export const es_default = {
  getLanguage(language) {
    return Boolean(language);
  },
  highlight(code) {
    return { value: escapeHtml(code) };
  },
  highlightAuto(code) {
    return { value: escapeHtml(code) };
  },
};

export async function loadAttachment(source, filename) {
  let buffer;
  let fileName = filename || i18n("document");
  let mimeType = "application/octet-stream";
  let size = 0;

  if (typeof source === "string") {
    const response = await fetch(source);
    if (!response.ok) {
      throw new Error(i18n("Failed to fetch {source}: {statusText}")(source, response.statusText));
    }
    buffer = await response.arrayBuffer();
    size = buffer.byteLength;
    fileName = filename || source.split("/").pop() || i18n("document");
    mimeType = response.headers.get("content-type") || guessMimeType(fileName);
  } else if (source instanceof File) {
    buffer = await source.arrayBuffer();
    size = source.size;
    fileName = filename || source.name;
    mimeType = source.type || guessMimeType(fileName);
  } else if (source instanceof Blob) {
    buffer = await source.arrayBuffer();
    size = source.size;
    mimeType = source.type || guessMimeType(fileName);
  } else if (source instanceof ArrayBuffer) {
    buffer = source;
    size = source.byteLength;
    mimeType = guessMimeType(fileName);
  } else {
    throw new Error(i18n("Invalid source type"));
  }

  mimeType = mimeType.split(";")[0] || guessMimeType(fileName);
  if (mimeType === "application/octet-stream") mimeType = guessMimeType(fileName, mimeType);

  const content = arrayBufferToBase64(buffer);
  const id = `${fileName}_${Date.now()}_${Math.random().toString(36).slice(2)}`;

  if (mimeType.startsWith("image/")) {
    return {
      id,
      type: "image",
      fileName,
      mimeType,
      size,
      content,
      preview: content,
    };
  }

  const attachment = {
    id,
    type: "document",
    fileName,
    mimeType,
    size,
    content,
  };

  if (isTextLike(mimeType, fileName)) {
    attachment.extractedText = new TextDecoder().decode(buffer);
  } else if (mimeType === "application/pdf" || getExtension(fileName) === "pdf") {
    attachment.mimeType = "application/pdf";
    attachment.extractedText = `<pdf filename="${fileName}">\n${i18n(
      "PDF text extraction is not available in this lightweight build. Use OCR/preprocessed examples or inspect the original attachment.",
    )}\n</pdf>`;
  } else {
    attachment.extractedText = "";
  }

  return attachment;
}

export function Select({
  value,
  placeholder = i18n("Select an option"),
  options = [],
  onChange,
  disabled = false,
  className = "",
  width = "180px",
  size = "md",
  variant = "default",
  fitContent = false,
}) {
  const flatOptions = options.flatMap((option) =>
    Array.isArray(option.options) ? option.options : [option],
  );
  const selected = flatOptions.find((option) => option.value === value);
  const sizes = {
    sm: "h-8 px-2 text-xs",
    md: "h-9 px-3 text-sm",
    lg: "h-10 px-4 text-base",
  };
  const variants = {
    default: "border-input bg-transparent hover:bg-accent/50",
    ghost: "border-transparent bg-transparent hover:bg-accent",
    outline: "border-input bg-transparent hover:bg-accent",
  };
  return html`
    <label class="relative inline-flex items-center">
      <span class="sr-only">${placeholder}</span>
      <select
        class="appearance-none rounded-md border text-foreground transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 ${sizes[
          size
        ] ?? sizes.md} ${variants[variant] ?? variants.default} ${className}"
        style="width: ${fitContent ? "auto" : width}; min-width: ${fitContent ? width : "0"};"
        ?disabled=${disabled}
        .value=${value ?? ""}
        @change=${(event) => onChange?.(event.currentTarget.value)}
      >
        ${selected ? "" : html`<option value="">${placeholder}</option>`}
        ${options.map((option) =>
          Array.isArray(option.options)
            ? html`
                <optgroup label=${option.label ?? ""}>
                  ${option.options.map(
                    (child) =>
                      html`<option value=${child.value} ?disabled=${child.disabled}>
                        ${child.label}
                      </option>`,
                  )}
                </optgroup>
              `
            : html`<option value=${option.value} ?disabled=${option.disabled}>
                ${option.label}
              </option>`,
        )}
      </select>
      <span class="pointer-events-none absolute right-2 text-muted-foreground">⌄</span>
    </label>
  `;
}

export class AttachmentOverlay extends LitElement {
  static properties = {
    attachment: { state: true },
    open: { state: true },
  };

  constructor() {
    super();
    this.attachment = null;
    this.open = false;
  }

  static open(attachment) {
    let overlay = document.querySelector("attachment-overlay");
    if (!overlay) {
      overlay = document.createElement("attachment-overlay");
      document.body.appendChild(overlay);
    }
    overlay.attachment = attachment;
    overlay.open = true;
  }

  createRenderRoot() {
    return this;
  }

  close() {
    this.open = false;
  }

  renderPreview() {
    if (!this.attachment) return html``;
    if (this.attachment.type === "image" || this.attachment.mimeType?.startsWith("image/")) {
      return html`
        <img
          src="data:${this.attachment.mimeType};base64,${this.attachment.content}"
          alt=${this.attachment.fileName}
          class="max-h-[70vh] max-w-full rounded-md bg-white object-contain p-2"
        />
      `;
    }
    const text = this.attachment.extractedText || decodeBase64Text(this.attachment.content);
    return html`
      <pre
        class="max-h-[70vh] overflow-auto whitespace-pre-wrap rounded-md border border-border bg-muted/40 p-4 text-sm text-foreground"
      >
${text || i18n("No text preview available.")}</pre
      >
    `;
  }

  render() {
    if (!this.open || !this.attachment) return html``;
    return html`
      <div
        class="fixed inset-0 z-[80] grid place-items-center bg-black/60 p-4"
        @click=${(event) => {
          if (event.target === event.currentTarget) this.close();
        }}
      >
        <div class="w-full max-w-4xl rounded-xl border border-border bg-card p-4 shadow-xl">
          <div class="mb-3 flex items-center justify-between gap-3">
            <div class="min-w-0">
              <div class="truncate text-sm font-semibold text-foreground">
                ${this.attachment.fileName}
              </div>
              <div class="text-xs text-muted-foreground">${this.attachment.mimeType}</div>
            </div>
            ${Button({
              variant: "ghost",
              size: "icon",
              title: i18n("Close"),
              onClick: () => this.close(),
              children: iconCloseLine("sm"),
            })}
          </div>
          ${this.renderPreview()}
        </div>
      </div>
    `;
  }
}

export class AttachmentTile extends LitElement {
  static properties = {
    attachment: { type: Object },
    showDelete: { type: Boolean },
    onDelete: { attribute: false },
  };

  constructor() {
    super();
    this.attachment = null;
    this.showDelete = false;
    this.onDelete = null;
  }

  createRenderRoot() {
    return this;
  }

  getIcon() {
    const mimeType = this.attachment?.mimeType || "";
    const fileName = this.attachment?.fileName || "";
    if (mimeType.startsWith("image/")) return iconImageLine("md");
    if (mimeType.includes("spreadsheet") || /\.(xlsx|xls|csv)$/i.test(fileName)) {
      return iconFileExcel2Line("md");
    }
    if (mimeType.includes("presentation") || /\.pptx$/i.test(fileName)) {
      return iconFilePpt2Line("md");
    }
    if (mimeType.includes("word") || /\.docx$/i.test(fileName)) return iconFileWord2Line("md");
    return iconFileTextLine("md");
  }

  render() {
    if (!this.attachment) return html``;
    const isImage =
      this.attachment.type === "image" || this.attachment.mimeType?.startsWith("image/");
    return html`
      <div class="relative inline-block max-h-16">
        <button
          type="button"
          class="group grid h-16 w-16 place-items-center overflow-hidden rounded-lg border border-input bg-muted text-muted-foreground transition hover:opacity-80"
          title=${this.attachment.fileName}
          @click=${() => AttachmentOverlay.open(this.attachment)}
        >
          ${isImage
            ? html`<img
                src="data:${this.attachment.mimeType};base64,${this.attachment.preview ||
                this.attachment.content}"
                alt=${this.attachment.fileName}
                class="h-full w-full object-cover"
              />`
            : html`<div class="flex min-w-0 flex-col items-center gap-1 p-1">
                ${this.getIcon()}
                <span class="w-full truncate text-[10px]">${this.attachment.fileName}</span>
              </div>`}
        </button>
        ${this.showDelete
          ? html`
              <button
                type="button"
                class="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full border border-input bg-background text-muted-foreground shadow-sm transition hover:bg-muted hover:text-foreground"
                title=${i18n("Remove")}
                @click=${(event) => {
                  event.stopPropagation();
                  this.onDelete?.();
                }}
              >
                ${iconCloseLine("xs")}
              </button>
            `
          : ""}
      </div>
    `;
  }
}

export class CopyButton extends LitElement {
  static properties = {
    text: { type: String },
    title: { type: String },
    showText: { type: Boolean },
    copied: { state: true },
  };

  constructor() {
    super();
    this.text = "";
    this.title = i18n("Copy");
    this.showText = true;
    this.copied = false;
  }

  createRenderRoot() {
    return this;
  }

  async copy() {
    try {
      await navigator.clipboard.writeText(this.text ?? "");
      this.copied = true;
      window.setTimeout(() => {
        this.copied = false;
      }, 1500);
    } catch (error) {
      console.error("Failed to copy:", error);
    }
  }

  render() {
    return Button({
      variant: "ghost",
      size: "sm",
      title: this.title,
      onClick: () => this.copy(),
      children: html`
        ${this.copied ? iconCheckLine("sm") : iconFileCopy2Line("sm")}
        ${this.showText ? html`<span>${this.copied ? i18n("Copied!") : this.title}</span>` : ""}
      `,
    });
  }
}

export class CodeBlock extends LitElement {
  static properties = {
    code: { type: String },
    language: { type: String },
  };

  constructor() {
    super();
    this.code = "";
    this.language = "";
  }

  createRenderRoot() {
    return this;
  }

  getDecodedCode() {
    try {
      return decodeURIComponent(escape(atob(this.code)));
    } catch {
      return this.code;
    }
  }

  render() {
    const code = this.getDecodedCode();
    const language = this.language || "plaintext";
    return html`
      <div class="overflow-hidden rounded-lg border border-border">
        <div class="flex items-center justify-between gap-3 px-3 py-1">
          <span class="truncate font-mono text-xs text-muted-foreground">${language}</span>
          <copy-button
            class="text-muted"
            .text=${code}
            title=${i18n("Copy code")}
            .showText=${true}
          ></copy-button>
        </div>
        <div class="max-h-96 overflow-auto">
          <pre
            class="m-0 px-4 pb-4 font-mono text-xs text-foreground"
          ><code class="language-${language}">${unsafeHTML(
            es_default.highlight(code).value,
          )}</code></pre>
        </div>
      </div>
    `;
  }
}

export class MessageEditor extends LitElement {
  static properties = {
    attachments: { type: Array },
    currentModel: { type: Object },
    isStreaming: { type: Boolean },
    processingFiles: { state: true },
    showAttachmentButton: { type: Boolean },
    showModelSelector: { type: Boolean },
    showThinking: { type: Boolean },
    showThinkingSelector: { type: Boolean },
    thinkingLevel: { type: String },
    value: { type: String },
  };

  constructor() {
    super();
    this.attachments = [];
    this.currentModel = null;
    this.isStreaming = false;
    this.processingFiles = false;
    this.showAttachmentButton = true;
    this.showModelSelector = true;
    this.showThinking = true;
    this.showThinkingSelector = true;
    this.thinkingLevel = "off";
    this.value = "";
    this.acceptedTypes =
      "image/*,application/pdf,.docx,.pptx,.xlsx,.xls,.txt,.md,.json,.xml,.html,.css,.js,.ts,.jsx,.tsx,.yml,.yaml";
    this.maxFiles = 10;
    this.maxFileSize = 20 * 1024 * 1024;
    this.textareaRef = createRef();
    this.fileInputRef = createRef();
  }

  createRenderRoot() {
    return this;
  }

  firstUpdated() {
    this.adjustTextareaHeight();
    this.textareaRef.value?.focus();
  }

  updated() {
    this.adjustTextareaHeight();
  }

  adjustTextareaHeight() {
    const textarea = this.textareaRef.value;
    if (!textarea) return;
    textarea.style.height = "auto";
    textarea.style.height = `${Math.min(textarea.scrollHeight, 200)}px`;
  }

  set value(next) {
    const oldValue = this._value || "";
    this._value = next || "";
    this.requestUpdate("value", oldValue);
  }

  get value() {
    return this._value || "";
  }

  async handleFilesSelected(files) {
    if (!files?.length) return;
    if (files.length + this.attachments.length > this.maxFiles) {
      alert(i18n("Maximum {max} files allowed")(this.maxFiles));
      return;
    }

    this.processingFiles = true;
    const nextAttachments = [];
    try {
      for (const file of files) {
        if (file.size > this.maxFileSize) {
          alert(
            i18n("{name} exceeds maximum size of {size}MB")(
              file.name,
              Math.round(this.maxFileSize / 1024 / 1024),
            ),
          );
          continue;
        }
        nextAttachments.push(await loadAttachment(file));
      }
      if (nextAttachments.length) {
        this.attachments = [...this.attachments, ...nextAttachments];
        this.onFilesChange?.(this.attachments);
      }
    } catch (error) {
      console.error("Failed to process attachment:", error);
      alert(i18n("Failed to process file: {error}")(String(error)));
    } finally {
      this.processingFiles = false;
    }
  }

  removeFile(id) {
    this.attachments = this.attachments.filter((attachment) => attachment.id !== id);
    this.onFilesChange?.(this.attachments);
  }

  clearFiles() {
    this.attachments = [];
    this.onFilesChange?.(this.attachments);
  }

  handleTextareaInput(event) {
    this.value = event.currentTarget.value;
    this.onInput?.(this.value);
  }

  handleKeyDown(event) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      if (
        !this.isStreaming &&
        !this.processingFiles &&
        (this.value.trim() || this.attachments.length)
      ) {
        this.handleSend();
      }
    } else if (event.key === "Escape" && this.isStreaming) {
      event.preventDefault();
      this.onAbort?.();
    }
  }

  handleSend() {
    this.onSend?.(this.value, this.attachments);
  }

  renderFileControl() {
    if (!this.showAttachmentButton) return html``;
    if (this.processingFiles) {
      return html`<div class="grid h-8 w-8 place-items-center text-muted-foreground">
        <span class="animate-spin">${iconLoader4Line("sm")}</span>
      </div>`;
    }
    return html`
      <input
        ${ref(this.fileInputRef)}
        class="sr-only"
        type="file"
        accept=${this.acceptedTypes}
        multiple
        @change=${(event) => {
          this.handleFilesSelected(Array.from(event.currentTarget.files || []));
          event.currentTarget.value = "";
        }}
      />
      ${Button({
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        title: i18n("Attach files"),
        onClick: () => this.fileInputRef.value?.click(),
        children: iconAttachment2("sm"),
      })}
    `;
  }

  renderThinkingControl() {
    const modelSupportsThinking = this.currentModel?.reasoning === true;
    if (!modelSupportsThinking || !(this.showThinking && this.showThinkingSelector)) return html``;
    return Select({
      value: this.thinkingLevel,
      placeholder: i18n("Off"),
      options: [
        { value: "off", label: i18n("Off"), icon: iconBrainLine("sm") },
        { value: "minimal", label: i18n("Minimal"), icon: iconBrainLine("sm") },
        { value: "low", label: i18n("Low"), icon: iconBrainLine("sm") },
        { value: "medium", label: i18n("Medium"), icon: iconBrainLine("sm") },
        { value: "high", label: i18n("High"), icon: iconBrainLine("sm") },
      ],
      onChange: (value) => this.onThinkingChange?.(value),
      width: "88px",
      size: "sm",
      variant: "ghost",
      fitContent: true,
    });
  }

  renderSendButton() {
    const canSend = this.value.trim() || this.attachments.length;
    if (this.isStreaming) {
      return Button({
        variant: "ghost",
        size: "icon",
        className: "h-8 w-8",
        title: i18n("Stop"),
        onClick: () => this.onAbort?.(),
        children: iconSquareFill("sm"),
      });
    }
    return Button({
      variant: "ghost",
      size: "icon",
      className: "h-8 w-8",
      title: i18n("Send"),
      disabled: this.processingFiles || !canSend,
      onClick: () => this.handleSend(),
      children: iconSendPlane2Line("sm"),
    });
  }

  render() {
    return html`
      <div class="rounded-xl border border-border bg-card shadow-sm">
        ${this.attachments.length
          ? html`<div class="flex flex-wrap gap-2 px-4 pt-3 pb-2">
              ${this.attachments.map(
                (attachment) => html`
                  <attachment-tile
                    .attachment=${attachment}
                    .showDelete=${true}
                    .onDelete=${() => this.removeFile(attachment.id)}
                  ></attachment-tile>
                `,
              )}
            </div>`
          : ""}
        <textarea
          ${ref(this.textareaRef)}
          class="w-full resize-none overflow-y-auto bg-transparent p-4 text-foreground outline-none placeholder:text-muted-foreground"
          placeholder=${i18n("Type a message...")}
          rows="1"
          style="max-height: 200px;"
          .value=${this.value}
          @input=${(event) => this.handleTextareaInput(event)}
          @keydown=${(event) => this.handleKeyDown(event)}
        ></textarea>
        <div class="flex items-center justify-between px-2 pb-2">
          <div class="flex items-center gap-2">
            ${this.renderFileControl()} ${this.renderThinkingControl()}
          </div>
          <div class="flex items-center gap-2">
            ${this.showModelSelector && this.currentModel
              ? Button({
                  variant: "ghost",
                  size: "sm",
                  className: "h-8 max-w-[180px] truncate text-xs",
                  onClick: () => this.onModelSelect?.(),
                  children: this.currentModel.id,
                })
              : ""}
            ${this.renderSendButton()}
          </div>
        </div>
      </div>
    `;
  }
}

const definitions = {
  "attachment-overlay": AttachmentOverlay,
  "attachment-tile": AttachmentTile,
  "code-block": CodeBlock,
  "copy-button": CopyButton,
  "message-editor": MessageEditor,
};

for (const [name, element] of Object.entries(definitions)) {
  if (!customElements.get(name)) customElements.define(name, element);
}
