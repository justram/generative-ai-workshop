import{__decorate as e,i$1 as t,i18n as n,iconCodeView as r,iconEyeLine as i,n$1 as a,t$1 as o,x as s}from"./ThemeToggle-zh-tw7.js";let c=class extends t{constructor(...e){super(...e),this.mode=`preview`}createRenderRoot(){return this}setMode(e){this.mode!==e&&(this.mode=e,this.dispatchEvent(new CustomEvent(`mode-change`,{detail:this.mode,bubbles:!0})))}render(){let e=this.mode===`preview`;return s`
			<div class="inline-flex items-center h-7 rounded-md overflow-hidden border border-border bg-muted/60">
				<button
					class="px-2 h-full flex items-center ${e?`bg-card text-foreground`:`text-muted-foreground hover:text-accent-foreground`}"
					@click=${()=>this.setMode(`preview`)}
					title="${n(`Preview`)}"
				>
					${i(`sm`)}
				</button>
				<button
					class="px-2 h-full flex items-center ${e?`text-muted-foreground hover:text-accent-foreground`:`bg-card text-foreground`}"
					@click=${()=>this.setMode(`code`)}
					title="${n(`Code`)}"
				>
					${r(`sm`)}
				</button>
			</div>
		`}};e([a({reflect:!1})],c.prototype,`mode`,void 0),c=e([o(`preview-code-toggle`)],c);