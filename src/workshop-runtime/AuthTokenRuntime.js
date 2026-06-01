import {
  Button as e,
  __decorate as t,
  e as n,
  i$1 as r,
  i18n as i,
  n$1 as a,
  r as o,
  t$1 as s,
  x as c,
} from "../mini-lit/index.js";
import {
  Dialog as l,
  DialogContent as u,
  DialogFooter as d,
  DialogHeader as f,
} from "./DialogRuntime.js";
import { Input as p } from "./InputRuntime.js";
var m = class extends r {
    constructor(...e) {
      (super(...e),
        (this.modalWidth = `min(600px, 90vw)`),
        (this.modalHeight = `min(600px, 80vh)`));
    }
    createRenderRoot() {
      return this;
    }
    open() {
      ((this.previousFocus = document.activeElement),
        document.body.appendChild(this),
        (this.boundHandleKeyDown = (e) => {
          e.key === `Escape` && this.close();
        }),
        window.addEventListener(`keydown`, this.boundHandleKeyDown));
    }
    close() {
      (this.boundHandleKeyDown &&
        window.removeEventListener(`keydown`, this.boundHandleKeyDown),
        this.remove(),
        this.previousFocus?.focus &&
          requestAnimationFrame(() => {
            this.previousFocus?.focus();
          }));
    }
    render() {
      return l({
        isOpen: !0,
        onClose: () => this.close(),
        width: this.modalWidth,
        height: this.modalHeight,
        children: this.renderContent(),
      });
    }
  },
  h;
let g = (h = class extends m {
  constructor(...e) {
    (super(...e),
      (this.headerTitle = ``),
      (this.message = ``),
      (this.defaultValue = ``),
      (this.isPassword = !1),
      (this.inputValue = ``),
      (this.inputRef = n()),
      (this.modalWidth = `min(400px, 90vw)`),
      (this.modalHeight = `auto`));
  }
  static async ask(e, t, n = ``, r = !1) {
    let i = new h();
    return (
      (i.headerTitle = e),
      (i.message = t),
      (i.defaultValue = n),
      (i.isPassword = r),
      (i.inputValue = n),
      new Promise((e) => {
        ((i.resolvePromise = e), i.open());
      })
    );
  }
  firstUpdated(e) {
    (super.firstUpdated(e), this.inputRef.value?.focus());
  }
  handleConfirm() {
    (this.resolvePromise?.(this.inputValue), this.close());
  }
  handleCancel() {
    (this.resolvePromise?.(null), this.close());
  }
  renderContent() {
    return u({
      children: c`
				${f({ title: this.headerTitle || i(`Input Required`), description: this.message })}
				${p({
          type: this.isPassword ? `password` : `text`,
          value: this.inputValue,
          className: `w-full`,
          inputRef: this.inputRef,
          onInput: (e) => {
            this.inputValue = e.target.value;
          },
          onKeyDown: (e) => {
            (e.key === `Enter` && this.handleConfirm(),
              e.key === `Escape` && this.handleCancel());
          },
        })}
				${d({
          children: c`
						${e({ variant: `outline`, onClick: () => this.handleCancel(), children: i(`Cancel`) })}
						${e({ variant: `default`, onClick: () => this.handleConfirm(), children: i(`Confirm`) })}
					`,
        })}
			`,
    });
  }
});
(t([a()], g.prototype, `headerTitle`, void 0),
  t([a()], g.prototype, `message`, void 0),
  t([a()], g.prototype, `defaultValue`, void 0),
  t([a()], g.prototype, `isPassword`, void 0),
  t([o()], g.prototype, `inputValue`, void 0),
  (g = h = t([s(`prompt-dialog`)], g)));
var _ = g;
async function v() {
  return `local-pi`;
}
async function y() {
  localStorage.removeItem(`auth-token`);
}
export {
  m as DialogBase,
  g as PromptDialog,
  y as clearAuthToken,
  v as getAuthToken,
};
