import {
  Button,
  __decorate,
  getCurrentLanguage,
  iconGlobalLine,
  i18n,
  setLanguage,
  state,
  t$1,
  x as html,
} from "./workshop-ui.js";
import { LitElement } from "lit";

let LanguageSelector = class LanguageSelector extends LitElement {
  constructor() {
    super();
    this.currentLanguage = getCurrentLanguage();
    this.isOpen = false;
    this.languages = [
      { code: "zh-TW", label: "ZH-TW" },
      { code: "en", label: "EN" },
    ];
    this.handleClickOutside = (event) => {
      if (!this.contains(event.target)) this.isOpen = false;
    };
  }

  createRenderRoot() {
    return this;
  }

  connectedCallback() {
    super.connectedCallback();
    document.addEventListener("click", this.handleClickOutside);
  }

  disconnectedCallback() {
    document.removeEventListener("click", this.handleClickOutside);
    super.disconnectedCallback();
  }

  selectLanguage(language) {
    if (language !== this.currentLanguage) setLanguage(language);
    this.isOpen = false;
  }

  render() {
    return html`
      <div class="relative">
        ${Button({
          variant: "ghost",
          size: "sm",
          onClick: () => {
            this.isOpen = !this.isOpen;
          },
          className: "gap-1.5",
          children: html`
            ${iconGlobalLine("sm")}
            <span class="text-xs font-medium">${this.currentLanguage.toUpperCase()}</span>
          `,
        })}
        ${this.isOpen
          ? html`
              <div
                class="absolute right-0 mt-1 py-1 bg-popover border border-border rounded-md shadow-lg min-w-[80px] z-50"
              >
                ${this.languages.map(
                  (language) => html`
                    <button
                      class="w-full px-3 py-1.5 text-sm text-left hover:bg-accent hover:text-accent-foreground transition-colors
                        ${language.code === this.currentLanguage
                        ? "bg-accent/50 text-accent-foreground font-medium"
                        : ""}"
                      @click=${() => this.selectLanguage(language.code)}
                    >
                      ${i18n(language.label)}
                    </button>
                  `,
                )}
              </div>
            `
          : ""}
      </div>
    `;
  }
};

__decorate([state()], LanguageSelector.prototype, "currentLanguage", void 0);
__decorate([state()], LanguageSelector.prototype, "isOpen", void 0);
LanguageSelector = __decorate([t$1("language-selector")], LanguageSelector);

export { LanguageSelector };
