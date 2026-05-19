import{fc as e,i18n as t,x as n}from"./ThemeToggle-zh-tw7.js?v=proper-i18n-1";const r=e(({isOpen:e,onClose:r,children:i,width:a=`min(600px, 90vw)`,height:o=`auto`,className:s=``})=>e?n`
		<!-- Backdrop -->
		<div class="fixed inset-0 bg-black/50 z-40" @click=${e=>{e.target===e.currentTarget&&r?.()}}>
			<!-- Modal -->
			<div
				class="fixed z-50 bg-background rounded-lg shadow-xl flex flex-col border border-border ${s}"
				style="top: 50%; left: 50%; transform: translate(-50%, -50%); width: ${a}; height: ${o};"
				@click=${e=>e.stopPropagation()}
			>
				${i}

				<!-- Close button - absolutely positioned -->
				<button
					type="button"
					@click=${()=>r?.()}
					class="absolute top-4 right-4 rounded-sm text-muted-foreground opacity-70 transition-all hover:opacity-100 hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 focus:ring-offset-background disabled:pointer-events-none"
					aria-label="${t(`Close`)}"
				>
					<svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
						<path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
					</svg>
				</button>
			</div>
		</div>
	`:n``),i=e(({title:e,description:t,className:r=``})=>n`
		<div class="pr-8 ${r}">
			<h2 class="text-lg font-semibold text-foreground${t?` mb-2`:``}">${e}</h2>
			${t?n`<p class="text-sm text-muted-foreground">${t}</p>`:``}
		</div>
	`),a=e(({children:e,className:t=``})=>n` <div class="p-6 flex flex-col gap-4 ${t}">${e}</div> `),o=e(({children:e,className:t=``})=>n` <div class="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end ${t}">${e}</div> `);export{r as Dialog,a as DialogContent,o as DialogFooter,i as DialogHeader};