import{__decorate as e,i18n as t,t$1 as n,x as r}from"./ThemeToggle-zh-tw7.js";import"./MarkdownBlock-CNBIWDl3.js";import{DemoBase as i}from"./DemoBase-7724hyNv.js";let a=class extends i{constructor(...e){super(...e),this.headerTitle=t(`5.3 RAG in Action`),this.sectionId=`5.3`}renderContentPanel(){return r`
			<div class="w-full h-full flex">
					<!-- Left iframe - Spinebot forum -->
					<div class="w-1/2 h-full border-r border-border">
						<iframe
							src="https://esotericsoftware.com/forum/u/Spinebot"
							class="w-full h-full border-0"
							title="${t(`Spinebot Forum Profile`)}"
						></iframe>
					</div>

					<!-- Right iframe - Doxie answer -->
					<div class="w-1/2 h-full">
						<iframe
							src="https://doxietwo.mariozechner.at/admin"
							class="w-full h-full border-0"
							title="${t(`Doxie RAG Answer`)}"
						></iframe>
					</div>
				</div>
			</div>
		`}};a=e([n(`demo-5-3`)],a),document.body.innerHTML=`<demo-5-3></demo-5-3>`;export{a as Demo53};