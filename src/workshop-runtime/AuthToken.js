import {
  Button,
  i$1 as LitElement,
  createRef,
  customElement,
  html,
  i18n,
} from "../mini-lit/index.js";
import { Dialog, DialogContent, DialogFooter, DialogHeader } from "./Dialog.js";
import { Input } from "./Input.js";

export class DialogBase extends LitElement {
  constructor() {
    super();
    this.modalWidth = "min(600px, 90vw)";
    this.modalHeight = "min(600px, 80vh)";
  }

  createRenderRoot() {
    return this;
  }

  open() {
    this.previousFocus = document.activeElement;
    document.body.appendChild(this);
    this.boundHandleKeyDown = (event) => {
      if (event.key === "Escape") this.close();
    };
    window.addEventListener("keydown", this.boundHandleKeyDown);
  }

  close() {
    if (this.boundHandleKeyDown) {
      window.removeEventListener("keydown", this.boundHandleKeyDown);
    }
    this.remove();
    if (this.previousFocus?.focus) {
      requestAnimationFrame(() => this.previousFocus?.focus());
    }
  }

  render() {
    return Dialog({
      isOpen: true,
      onClose: () => this.close(),
      width: this.modalWidth,
      height: this.modalHeight,
      children: this.renderContent(),
    });
  }
}

@customElement("prompt-dialog")
export class PromptDialog extends DialogBase {
  constructor() {
    super();
    this.headerTitle = "";
    this.message = "";
    this.defaultValue = "";
    this.isPassword = false;
    this.inputValue = "";
    this.inputRef = createRef();
    this.modalWidth = "min(400px, 90vw)";
    this.modalHeight = "auto";
  }

  static async ask(headerTitle, message, defaultValue = "", isPassword = false) {
    const dialog = new PromptDialog();
    dialog.headerTitle = headerTitle;
    dialog.message = message;
    dialog.defaultValue = defaultValue;
    dialog.isPassword = isPassword;
    dialog.inputValue = defaultValue;
    return new Promise((resolve) => {
      dialog.resolvePromise = resolve;
      dialog.open();
    });
  }

  firstUpdated(changedProperties) {
    super.firstUpdated(changedProperties);
    this.inputRef.value?.focus();
  }

  handleConfirm() {
    this.resolvePromise?.(this.inputValue);
    this.close();
  }

  handleCancel() {
    this.resolvePromise?.(null);
    this.close();
  }

  renderContent() {
    return DialogContent({
      children: html`
        ${DialogHeader({
          title: this.headerTitle || i18n("Input Required"),
          description: this.message,
        })}
        ${Input({
          type: this.isPassword ? "password" : "text",
          value: this.inputValue,
          className: "w-full",
          inputRef: this.inputRef,
          onInput: (event) => {
            this.inputValue = event.target.value;
          },
          onKeyDown: (event) => {
            if (event.key === "Enter") this.handleConfirm();
            if (event.key === "Escape") this.handleCancel();
          },
        })}
        ${DialogFooter({
          children: html`
            ${Button({
              variant: "outline",
              onClick: () => this.handleCancel(),
              children: i18n("Cancel"),
            })}
            ${Button({
              variant: "default",
              onClick: () => this.handleConfirm(),
              children: i18n("Confirm"),
            })}
          `,
        })}
      `,
    });
  }
}

export async function getAuthToken() {
  return "local-pi";
}

export async function clearAuthToken() {
  localStorage.removeItem("auth-token");
}
