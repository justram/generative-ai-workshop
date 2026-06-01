import {
  Badge,
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
  Textarea as MiniTextarea,
  createRef,
  fc,
  html,
  i$1 as LitElement,
  i18n,
  ref,
} from "../mini-lit/index.js";

const alertStyles = {
  default: "bg-background text-foreground",
  destructive:
    "border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive",
};

const AlertComponent = fc(
  ({ variant = "default", className = "", children }) => html`
    <div
      class="relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground ${alertStyles[
        variant
      ]} ${className}"
      role="alert"
    >
      ${children}
    </div>
  `,
);

export const Alert = (childrenOrProps, variant = "default", className = "") =>
  childrenOrProps && typeof childrenOrProps === "object" && "children" in childrenOrProps
    ? AlertComponent(childrenOrProps)
    : AlertComponent({ children: childrenOrProps, variant, className });

const AlertTitleComponent = fc(
  ({ className = "", children }) => html`
    <h5 class="mb-1 font-medium leading-none tracking-tight ${className}">${children}</h5>
  `,
);

export const AlertTitle = (childrenOrProps, className = "") =>
  childrenOrProps && typeof childrenOrProps === "object" && "children" in childrenOrProps
    ? AlertTitleComponent(childrenOrProps)
    : AlertTitleComponent({ children: childrenOrProps, className });

const AlertDescriptionComponent = fc(
  ({ className = "", children }) => html`
    <div class="text-sm [&_p]:leading-relaxed ${className}">${children}</div>
  `,
);

export const AlertDescription = (childrenOrProps, className = "") =>
  childrenOrProps && typeof childrenOrProps === "object" && "children" in childrenOrProps
    ? AlertDescriptionComponent(childrenOrProps)
    : AlertDescriptionComponent({ children: childrenOrProps, className });

export class ModeToggle extends LitElement {
  static properties = {
    modes: { type: Array },
    selectedIndex: { type: Number },
  };

  constructor() {
    super();
    this.modes = [i18n("Mode 1"), i18n("Mode 2")];
    this.selectedIndex = 0;
  }

  createRenderRoot() {
    return this;
  }

  setMode(index) {
    if (index === this.selectedIndex || index < 0 || index >= this.modes.length) return;
    this.selectedIndex = index;
    this.dispatchEvent(
      new CustomEvent("mode-change", {
        detail: { index, mode: this.modes[index] },
        bubbles: true,
      }),
    );
  }

  render() {
    if (this.modes.length < 2) return html``;
    return html`
      <div
        class="inline-flex h-7 items-center overflow-hidden rounded-md border border-border bg-muted/60"
      >
        ${this.modes.map(
          (mode, index) => html`
            <button
              class="flex h-full items-center px-3 text-sm font-medium transition-colors ${index ===
              this.selectedIndex
                ? "bg-card text-foreground shadow-sm"
                : "text-muted-foreground hover:text-accent-foreground"}"
              title="${mode}"
              @click=${() => this.setMode(index)}
            >
              ${mode}
            </button>
          `,
        )}
      </div>
    `;
  }
}

if (!customElements.get("mode-toggle")) {
  customElements.define("mode-toggle", ModeToggle);
}

export const Checkbox = (
  checkedOrProps = false,
  onChange,
  label = "",
  disabled = false,
  className = "",
) => {
  const props =
    checkedOrProps && typeof checkedOrProps === "object"
      ? checkedOrProps
      : { checked: checkedOrProps, onChange, label, disabled, className };
  const inputRef = createRef();
  const id = props.id || (props.label ? `checkbox-${Math.random().toString(36).slice(2, 11)}` : "");
  const handleChange = (event) => props.onChange?.(event.target.checked);

  if (inputRef.value) inputRef.value.indeterminate = props.indeterminate ?? false;

  return html`
    <div class="flex items-center space-x-2 ${props.className ?? ""}">
      <input
        ${ref(inputRef)}
        type="checkbox"
        id="${id}"
        class="peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
        .checked=${props.checked ?? false}
        ?disabled=${props.disabled ?? false}
        name="${props.name ?? ""}"
        value="${props.value ?? ""}"
        data-state="${props.checked ? "checked" : "unchecked"}"
        @change=${handleChange}
      />
      ${props.label
        ? html`
            <label
              for="${id}"
              class="cursor-pointer select-none text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
              ${props.label}
            </label>
          `
        : ""}
    </div>
  `;
};

export const Label = (childrenOrProps, htmlFor = "", required = false, className = "") => {
  const props =
    childrenOrProps && typeof childrenOrProps === "object" && "children" in childrenOrProps
      ? childrenOrProps
      : { children: childrenOrProps, htmlFor, required, className };
  return html`
    <label
      for="${props.htmlFor ?? ""}"
      class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 ${props.className ??
      ""}"
    >
      ${props.children} ${props.required ? html`<span class="ml-1 text-destructive">*</span>` : ""}
    </label>
  `;
};

export const Progress = (valueOrProps = 0, max = 100, className = "") => {
  const props =
    valueOrProps && typeof valueOrProps === "object"
      ? valueOrProps
      : { value: valueOrProps, max, className };
  const bounded = Math.min(Math.max(0, ((props.value ?? 0) / (props.max ?? 100)) * 100), 100);
  return html`
    <div
      role="progressbar"
      aria-valuemin="0"
      aria-valuemax="${props.max ?? 100}"
      aria-valuenow="${props.value ?? 0}"
      class="relative h-2 w-full overflow-hidden rounded-full bg-secondary ${props.className ?? ""}"
    >
      <div
        class="h-full w-full flex-1 bg-primary transition-all ${props.indicatorClassName ?? ""}"
        style="transform: translateX(-${100 - bounded}%)"
      ></div>
    </div>
  `;
};

export const Separator = (orientationOrProps = "horizontal", className = "") => {
  const props =
    orientationOrProps && typeof orientationOrProps === "object"
      ? orientationOrProps
      : { orientation: orientationOrProps, className };
  const orientation = props.orientation ?? "horizontal";
  const decorative = props.decorative ?? true;
  return html`
    <div
      role="${decorative ? "none" : "separator"}"
      aria-orientation="${decorative ? undefined : orientation}"
      class="shrink-0 bg-border ${orientation === "horizontal"
        ? "h-[1px] w-full"
        : "h-full w-[1px]"} ${props.className ?? ""}"
    ></div>
  `;
};

export const Switch = (
  checkedOrProps = false,
  onChange,
  label = "",
  disabled = false,
  className = "",
) => {
  const props =
    checkedOrProps && typeof checkedOrProps === "object"
      ? checkedOrProps
      : { checked: checkedOrProps, onChange, label, disabled, className };
  const id = props.id || (props.label ? `switch-${Math.random().toString(36).slice(2, 11)}` : "");
  const toggle = () => {
    if (!props.disabled) props.onChange?.(!(props.checked ?? false));
  };

  return html`
    <div class="flex items-center space-x-2 ${props.className ?? ""}">
      <button
        type="button"
        role="switch"
        id="${id}"
        aria-checked="${props.checked ?? false}"
        data-state="${props.checked ? "checked" : "unchecked"}"
        ?disabled=${props.disabled ?? false}
        class="peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-primary data-[state=unchecked]:bg-input"
        @click=${toggle}
      >
        <span
          data-state="${props.checked ? "checked" : "unchecked"}"
          class="pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0"
        ></span>
      </button>
      ${props.label
        ? html`
            <label
              for="${id}"
              class="cursor-pointer select-none text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              @click=${toggle}
            >
              ${props.label}
            </label>
          `
        : ""}
      ${props.name
        ? html`<input type="hidden" name="${props.name}" .value=${props.checked ? "on" : "off"} />`
        : ""}
    </div>
  `;
};

export const Textarea = (
  valueOrProps = "",
  placeholder = "",
  onInput,
  rows = 4,
  className = "",
) => {
  const props =
    valueOrProps &&
    typeof valueOrProps === "object" &&
    ("value" in valueOrProps || "children" in valueOrProps)
      ? valueOrProps
      : { value: valueOrProps, placeholder, onInput, rows, className };
  return MiniTextarea(props);
};

export { Badge, Card, CardAction, CardContent, CardDescription, CardFooter, CardHeader, CardTitle };
