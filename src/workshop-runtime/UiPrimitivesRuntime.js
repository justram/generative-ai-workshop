import {
  __decorate as e,
  e as t,
  fc as n,
  i$1 as r,
  i18n as i,
  n as a,
  n$1 as o,
  t$1 as s,
  x as c,
} from "../mini-lit/index.js";
const l = n(
  ({ variant: e = `default`, className: t = ``, children: n }) =>
    c` <span class="${`inline-flex items-center justify-center rounded-md border px-2 py-0.5 text-xs font-medium w-fit whitespace-nowrap shrink-0 [&>svg]:size-3 gap-1 [&>svg]:pointer-events-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive transition-[color,box-shadow] overflow-hidden`} ${{ default: `border-transparent bg-primary text-primary-foreground hover:bg-primary/80`, secondary: `border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80`, destructive: `border-transparent bg-destructive text-destructive-foreground hover:bg-destructive/80`, outline: `border-input text-foreground` }[e]} ${t}"> ${n} </span> `,
);
function u(e, t = `default`, n = ``) {
  return typeof e == `object` && e && `children` in e
    ? l(e)
    : l({ children: e, variant: t, className: n });
}
let d = class extends r {
  constructor(...e) {
    (super(...e),
      (this.modes = [i(`Mode 1`), i(`Mode 2`)]),
      (this.selectedIndex = 0));
  }
  createRenderRoot() {
    return this;
  }
  setMode(e) {
    this.selectedIndex !== e &&
      e >= 0 &&
      e < this.modes.length &&
      ((this.selectedIndex = e),
      this.dispatchEvent(
        new CustomEvent(`mode-change`, {
          detail: { index: e, mode: this.modes[e] },
          bubbles: !0,
        }),
      ));
  }
  render() {
    return this.modes.length < 2
      ? c``
      : c`
			<div class="inline-flex items-center h-7 rounded-md overflow-hidden border border-border bg-muted/60">
				${this.modes.map(
          (e, t) => c`
						<button
							class="px-3 h-full flex items-center text-sm font-medium transition-colors
								${t === this.selectedIndex ? `bg-card text-foreground shadow-sm` : `text-muted-foreground hover:text-accent-foreground`}"
							@click=${() => this.setMode(t)}
							title="${e}"
						>
							${e}
						</button>
					`,
        )}
			</div>
		`;
  }
};
(e([o({ type: Array })], d.prototype, `modes`, void 0),
  e([o({ type: Number })], d.prototype, `selectedIndex`, void 0),
  (d = e([s(`mode-toggle`)], d)));
const f = n(
    ({ variant: e = `default`, className: t = ``, children: n }) =>
      c` <div class="${`relative w-full rounded-lg border p-4 [&>svg~*]:pl-7 [&>svg+div]:translate-y-[-3px] [&>svg]:absolute [&>svg]:left-4 [&>svg]:top-4 [&>svg]:text-foreground`} ${{ default: `bg-background text-foreground`, destructive: `border-destructive/50 text-destructive dark:border-destructive [&>svg]:text-destructive` }[e]} ${t}" role="alert">${n}</div> `,
  ),
  p = n(
    ({ className: e = ``, children: t }) =>
      c` <h5 class="mb-1 font-medium leading-none tracking-tight ${e}">${t}</h5> `,
  ),
  m = n(
    ({ className: e = ``, children: t }) =>
      c` <div class="text-sm [&_p]:leading-relaxed ${e}">${t}</div> `,
  );
function h(e, t = `default`, n = ``) {
  return typeof e == `object` && e && `children` in e
    ? f(e)
    : f({ children: e, variant: t, className: n });
}
function g(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? p(e)
    : p({ children: e, className: t });
}
function _(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? m(e)
    : m({ children: e, className: t });
}
const v = n(
    ({ hoverable: e = !1, className: t = ``, children: n }) =>
      c` <div class="${`bg-card text-card-foreground flex flex-col gap-6 rounded-xl border border-border shadow-sm`} ${e ? `hover:shadow-md transition-shadow` : ``} py-6 ${t}">${n}</div> `,
  ),
  y = n(
    ({ className: e = ``, children: t }) => c`
		<div class="grid auto-rows-min grid-rows-[auto_auto] items-start gap-1.5 px-6 has-[ui-card-action]:grid-cols-[1fr_auto] ${e}">
			${t}
		</div>
	`,
  ),
  b = n(
    ({ className: e = ``, children: t }) =>
      c` <div class="col-start-2 row-span-2 row-start-1 self-start justify-self-end ${e}">${t}</div> `,
  ),
  x = n(
    ({ className: e = ``, children: t }) =>
      c` <h3 class="leading-none font-semibold ${e}">${t}</h3> `,
  ),
  S = n(
    ({ className: e = ``, children: t }) =>
      c` <div class="text-muted-foreground text-sm ${e}">${t}</div> `,
  ),
  C = n(
    ({ className: e = ``, children: t }) =>
      c` <div class="px-6 ${e}">${t}</div> `,
  ),
  w = n(
    ({ className: e = ``, children: t }) =>
      c` <div class="flex items-center px-6 ${e}">${t}</div> `,
  );
function T(e, t = !1, n = ``) {
  return typeof e == `object` && e && `children` in e
    ? v(e)
    : v({ children: e, hoverable: t, className: n });
}
function E(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? y(e)
    : y({ children: e, className: t });
}
function D(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? b(e)
    : b({ children: e, className: t });
}
function O(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? x(e)
    : x({ children: e, className: t });
}
function k(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? S(e)
    : S({ children: e, className: t });
}
function A(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? C(e)
    : C({ children: e, className: t });
}
function j(e, t = ``) {
  return typeof e == `object` && e && `children` in e
    ? w(e)
    : w({ children: e, className: t });
}
const M = n(
  ({
    checked: e = !1,
    indeterminate: n = !1,
    disabled: r = !1,
    label: i = ``,
    name: o = ``,
    value: s = ``,
    id: l = ``,
    onChange: u,
    className: d = ``,
  }) => {
    let f = t(),
      p = l || (i ? `checkbox-${Math.random().toString(36).substr(2, 9)}` : ``),
      m = (e) => {
        let t = e.target;
        u?.(t.checked);
      };
    return (
      f.value && (f.value.indeterminate = n),
      c`
			<div class="flex space-x-2 items-center ${d}">
				<input
					${a(f)}
					type="checkbox"
					id="${p}"
					class="${`peer h-4 w-4 shrink-0 rounded-sm border border-primary ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`} ${`data-[state=checked]:bg-primary data-[state=checked]:text-primary-foreground`}"
					.checked=${e}
					?disabled=${r}
					name="${o}"
					value="${s}"
					data-state="${e ? `checked` : `unchecked`}"
					@change=${m}
				/>
				${
          i
            ? c`
							<label
								for="${p}"
								class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
							>
								${i}
							</label>
						`
            : ``
        }
			</div>
		`
    );
  },
);
function N(e = !1, t, n = ``, r = !1, i = ``) {
  return M(
    typeof e == `object` && e
      ? e
      : { checked: e, onChange: t, label: n, disabled: r, className: i },
  );
}
const P = n(
  ({ htmlFor: e = ``, required: t = !1, className: n = ``, children: r }) => c`
		<label for="${e}" class="${`text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70`} ${n}">
			${r} ${t ? c`<span class="text-destructive ml-1">${i(`*`)}</span>` : ``}
		</label>
	`,
);
function F(e, t = ``, n = !1, r = ``) {
  return typeof e == `object` && e && `children` in e
    ? P(e)
    : P({ children: e, htmlFor: t, required: n, className: r });
}
const I = n(
  ({
    value: e = 0,
    max: t = 100,
    indicatorClassName: n = ``,
    className: r = ``,
  }) => {
    let i = Math.min(Math.max(0, (e / t) * 100), 100);
    return c`
		<div role="progressbar" aria-valuemin="0" aria-valuemax="${t}" aria-valuenow="${e}" class="${`relative h-2 w-full overflow-hidden rounded-full bg-secondary`} ${r}">
			<div class="${`h-full w-full flex-1 bg-primary transition-all`} ${n}" style="transform: translateX(-${100 - i}%)"></div>
		</div>
	`;
  },
);
function L(e = 0, t = 100, n = ``) {
  return I(typeof e == `object` && e ? e : { value: e, max: t, className: n });
}
const R = n(
  ({
    orientation: e = `horizontal`,
    decorative: t = !0,
    className: n = ``,
  }) => c`
		<div
			role="${t ? `none` : `separator`}"
			aria-orientation="${t ? void 0 : e}"
			class="${`shrink-0 bg-border`} ${e === `horizontal` ? `h-[1px] w-full` : `h-full w-[1px]`} ${n}"
		></div>
	`,
);
function z(e = `horizontal`, t = ``) {
  return R(typeof e == `object` && e ? e : { orientation: e, className: t });
}
const B = n(
  ({
    checked: e = !1,
    disabled: t = !1,
    label: n = ``,
    name: r = ``,
    id: i = ``,
    onChange: a,
    className: o = ``,
  }) => {
    let s = i || (n ? `switch-${Math.random().toString(36).substr(2, 9)}` : ``),
      l = () => {
        t || a?.(!e);
      };
    return c`
		<div class="flex items-center space-x-2 ${o}">
			<button
				type="button"
				role="switch"
				id="${s}"
				aria-checked="${e}"
				data-state="${e ? `checked` : `unchecked`}"
				?disabled=${t}
				class="${`peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:cursor-not-allowed disabled:opacity-50`} ${`data-[state=checked]:bg-primary data-[state=unchecked]:bg-input`}"
				@click=${l}
			>
				<span data-state="${e ? `checked` : `unchecked`}" class="${`pointer-events-none block h-5 w-5 rounded-full bg-background shadow-lg ring-0 transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0`}"></span>
			</button>
			${
        n
          ? c`
						<label
							for="${s}"
							class="text-sm font-medium leading-none text-foreground peer-disabled:cursor-not-allowed peer-disabled:opacity-70 cursor-pointer select-none"
							@click=${l}
						>
							${n}
						</label>
					`
          : ``
      }
			${r ? c` <input type="hidden" name="${r}" .value=${e ? `on` : `off`} /> ` : ``}
		</div>
	`;
  },
);
function V(e = !1, t, n = ``, r = !1, i = ``) {
  return B(
    typeof e == `object` && e
      ? e
      : { checked: e, onChange: t, label: n, disabled: r, className: i },
  );
}
const H = n(
  ({
    value: e = ``,
    placeholder: t = ``,
    label: n = ``,
    error: r = ``,
    disabled: a = !1,
    required: o = !1,
    name: s = ``,
    rows: l = 4,
    cols: u,
    maxLength: d,
    resize: f = `vertical`,
    onInput: p,
    onChange: m,
    className: h = ``,
  }) => {
    let g = {
        none: `resize-none`,
        both: `resize`,
        horizontal: `resize-x`,
        vertical: `resize-y`,
      },
      _ = r ? `border-destructive` : ``;
    return c`
			<div class="flex flex-col gap-1.5 ${h}">
				${
          n
            ? c`
							<label class="text-sm font-medium text-foreground">
								${n} ${o ? c`<span class="text-destructive">${i(`*`)}</span>` : ``}
							</label>
						`
            : ``
        }
				<textarea
					class="${`flex min-h-[80px] w-full rounded-md border border-input bg-background px-3 py-2 text-sm text-foreground ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50`} ${g[f]} ${_}"
					.value=${e}
					placeholder="${t}"
					?disabled=${a}
					?required=${o}
					?aria-invalid=${!!r}
					name="${s}"
					rows="${l}"
					cols="${u ?? ``}"
					maxlength="${d ?? ``}"
					@input=${p}
					@change=${m}
				></textarea>
				${r ? c`<span class="text-sm text-destructive">${r}</span>` : ``}
			</div>
		`;
  },
);
function U(e = ``, t = ``, n, r = 4, i = ``) {
  return typeof e == `object` && e && (`value` in e || `children` in e)
    ? H(e)
    : H({ value: e, placeholder: t, onInput: n, rows: r, className: i });
}
export {
  h as Alert,
  _ as AlertDescription,
  g as AlertTitle,
  u as Badge,
  T as Card,
  D as CardAction,
  A as CardContent,
  k as CardDescription,
  j as CardFooter,
  E as CardHeader,
  O as CardTitle,
  N as Checkbox,
  F as Label,
  d as ModeToggle,
  L as Progress,
  z as Separator,
  V as Switch,
  U as Textarea,
};
