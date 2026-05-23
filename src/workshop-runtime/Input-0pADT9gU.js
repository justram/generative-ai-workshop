import { fc as e, i18n as t, n, x as r } from "../mini-lit/index.js";
const i = e(
  ({
    type: e = `text`,
    size: i = `md`,
    value: a = ``,
    placeholder: o = ``,
    label: s = ``,
    error: c = ``,
    disabled: l = !1,
    required: u = !1,
    name: d = ``,
    autocomplete: f = ``,
    min: p,
    max: m,
    step: h,
    inputRef: g,
    onInput: _,
    onChange: v,
    onKeyDown: y,
    onKeyUp: b,
    className: x = ``,
  }) => {
    let S = {
        sm: `h-8 px-3 py-1 text-sm`,
        md: `h-9 px-3 py-1 text-sm md:text-sm`,
        lg: `h-10 px-4 py-1 text-base`,
      },
      C = c
        ? `border-destructive aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40`
        : `border-input`;
    return r`
			<div class="flex flex-col gap-1.5 ${x}">
				${
          s
            ? r`
							<label class="text-sm font-medium text-foreground">
								${s} ${u ? r`<span class="text-destructive">${t(`*`)}</span>` : ``}
							</label>
						`
            : ``
        }
				<input
					type="${e}"
					class="${`flex w-full min-w-0 rounded-md border bg-transparent text-foreground shadow-xs transition-[color,box-shadow] outline-none file:inline-flex file:h-7 file:border-0 file:bg-transparent file:text-sm file:font-medium`} ${S[i]} ${`placeholder:text-muted-foreground selection:bg-primary selection:text-primary-foreground`} ${`focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px]`} ${`dark:bg-input/30`} ${C} ${`disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50`}"
					.value=${a}
					placeholder="${o}"
					?disabled=${l}
					?required=${u}
					?aria-invalid=${!!c}
					name="${d}"
					autocomplete="${f}"
					min="${p ?? ``}"
					max="${m ?? ``}"
					step="${h ?? ``}"
					@input=${(e) => {
            _?.(e);
          }}
					@change=${(e) => {
            v?.(e);
          }}
					@keydown=${y}
					@keyup=${b}
					${g ? n(g) : ``}
				/>
				${c ? r`<span class="text-sm text-destructive">${c}</span>` : ``}
			</div>
		`;
  },
);
export { i as Input };
