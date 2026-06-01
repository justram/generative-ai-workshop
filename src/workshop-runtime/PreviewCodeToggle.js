import {
  i$1 as LitElement,
  customElement,
  html,
  i18n,
  iconCodeView,
  iconEyeLine,
  property,
} from "../mini-lit/index.js";

@customElement("preview-code-toggle")
export class PreviewCodeToggle extends LitElement {
  @property({ reflect: false })
  mode = "preview";

  createRenderRoot() {
    return this;
  }

  setMode(mode) {
    if (this.mode === mode) return;
    this.mode = mode;
    this.dispatchEvent(new CustomEvent("mode-change", { detail: mode, bubbles: true }));
  }

  render() {
    const preview = this.mode === "preview";
    return html`
      <div
        class="inline-flex h-7 items-center overflow-hidden rounded-md border border-border bg-muted/60"
      >
        <button
          class="flex h-full items-center px-2 ${preview
            ? "bg-card text-foreground"
            : "text-muted-foreground hover:text-accent-foreground"}"
          title="${i18n("Preview")}"
          @click=${() => this.setMode("preview")}
        >
          ${iconEyeLine("sm")}
        </button>
        <button
          class="flex h-full items-center px-2 ${preview
            ? "text-muted-foreground hover:text-accent-foreground"
            : "bg-card text-foreground"}"
          title="${i18n("Code")}"
          @click=${() => this.setMode("code")}
        >
          ${iconCodeView("sm")}
        </button>
      </div>
    `;
  }
}
