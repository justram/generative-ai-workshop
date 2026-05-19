import{Button as e,__decorate as t,i18n as n,r,t$1 as i,x as a}from"./ThemeToggle-zh-tw7.js?v=proper-i18n-1";import"./CodeBlock-SUyIenKs.js?v=msg-placeholder-1";import{AgentInterface as o,getModel as s}from"./app-C9nW8ndw.js";import"./Textarea-DCZnYrSo.js";import"./Dialog-C7MHz9Dg.js";import"./Input-0pADT9gU.js";import"./auth-token-Dkh_JH49.js";import"./MarkdownBlock-CNBIWDl3.js";import"./mini-zh-tw7.js?v=proper-i18n-1";import{DemoBase as c}from"./DemoBase-7724hyNv.js?v=section4-polish1";import"./proxy-client-DO8A5rUF.js";import{AgentSession as l}from"./agent-session-CtmWvP9t.js";import{COMPANY_NAME as u,PRODUCT_NAME as d}from"./demo-company-config-DwX2XOme.js";let f=class extends c{constructor(){super(),this.headerTitle=n(`自然語言處理任務`),this.sectionId=`4.5`,this.selectedTask=``,this.defaultText=`${u} 宣布最新一季大幅成長。公司表示，旗艦產品 ${d} 的客戶採用率增加了 35%。執行長在季度財報會議上表示：「我們對這些成果非常滿意。」隨著新合作夥伴推動進一步擴張，這股正向動能預計會延續到第四季。`,this.nlpTasks=[{id:`translate`,name:n(`翻譯`),prompt:n(`翻譯成德文：`),sampleInput:this.defaultText},{id:`summarize`,name:n(`摘要`),prompt:n(`用一句話摘要：`),sampleInput:this.defaultText},{id:`paraphrase`,name:n(`改寫`),prompt:n(`改寫這段文字（保留意思，但換一種說法）：`),sampleInput:n(`Our staff members have diverse professional backgrounds and bring unique perspectives to the team.`)},{id:`improve`,name:n(`潤飾文風`),prompt:n(`改善寫作風格（讓它更專業、更精煉）：`),sampleInput:n(`The meeting was ok i guess. We talked about the new project and stuff. People seemed interested but who knows. We should probably meet again next week or something to figure out the details.`)},{id:`ner`,name:n(`命名實體辨識`),prompt:`請從這段文字抽出所有實體並分類：
- 人物（若有職稱也列出）
- 公司
- 產品
- 地點
- 百分比／數字
- 日期／時間

文字：`,sampleInput:this.defaultText},{id:`sentiment`,name:n(`情緒分析`),prompt:n(`分析這段文字的情緒。請用 -1（非常負面）到 1（非常正面）評分，並說明原因：`),sampleInput:n(`這次軟體更新根本是災難。功能都不照預期運作，介面很混亂，還一直當掉。我們浪費了好幾個小時，對專業工具來說完全不能接受。`)},{id:`classify`,name:n(`文字分類`),prompt:`請把這則客戶回饋分類到以下其中一類：
- 錯誤回報
- 功能需求
- 抱怨
- 稱讚
- 問題

Feedback:`,sampleInput:n(`當我嘗試儲存超過 100MB 的檔案時，匯出功能無法運作。它會卡住，最後逾時。這阻礙了我們的部署。`)},{id:`keywords`,name:n(`關鍵字抽取`),prompt:n(`請從這段文字抽出 5 個最重要的關鍵字或片語：`),sampleInput:this.defaultText},{id:`simplify`,name:n(`簡化說明`),prompt:n(`請用 10 歲小孩也聽得懂的方式解釋這段文字：`),sampleInput:n(`量子運算利用疊加與糾纏等量子力學現象，執行傳統電腦難以處理的計算。`)},{id:`formal`,name:n(`正式化`),prompt:n(`請改寫成正式的學術語氣：`),sampleInput:n(`嗨！想跟你說我們在研究裡發現了一些很酷的東西。簡單說，材料加熱後會變得更強。很有趣吧？`)},{id:`bullets`,name:n(`條列重點`),prompt:n(`請把這段文字整理成清楚的條列重點：`),sampleInput:this.defaultText}],this.session=new l,this.session.setModel(s(`openai-codex`,`gpt-5.4-mini`)),this.session.setSystemPrompt(`你是一位專門處理自然語言任務的助理。請精確完成每個任務，並保持正確性與適當格式。`),this.agentInterface=new o,this.agentInterface.session=this.session,this.agentInterface.enableAttachments=!1,this.agentInterface.enableModelSelector=!0,this.agentInterface.enableThinking=!1,this.agentInterface.style.width=`100%`,this.agentInterface.style.height=`100%`}async runTask(e){this.selectedTask=e.id;let t=e.sampleInput.trim();this.session.clearMessages(),await this.agentInterface.sendMessage(`${e.prompt}\n\n${t}`)}renderContentPanel(){return a`<div class="w-full h-full p-4 pb-4">${this.agentInterface}</div>`}renderLeftDemoPanel(){return a`
			<div class="p-3 h-full overflow-y-auto flex flex-col gap-3">
				<p class="text-sm text-muted-foreground">
					${n(`看看 LLM 不經額外訓練時，能如何處理常見自然語言任務。`)}
				</p>

				<div class="space-y-2">
					${this.nlpTasks.map(t=>a`
							<div class="flex items-center justify-between p-2 rounded-md border border-border hover:bg-muted/50 transition-colors">
								<div class="flex-1 min-w-0 mr-2">
									<div class="font-medium text-sm text-foreground">${t.name}</div>
									<div class="text-xs text-muted-foreground truncate">
										${t.prompt.substring(0,50)}${t.prompt.length>50?`...`:``}
									</div>
								</div>
								${e({variant:this.selectedTask===t.id?`secondary`:`outline`,size:`sm`,onClick:()=>this.runTask(t),children:n(`執行`)})}
							</div>
						`)}
				</div>
			</div>
		`}renderRightDemoPanel(){return a`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent??``} .escapeHtml=${!1}></markdown-block>
		</div>`}};t([r()],f.prototype,`selectedTask`,void 0),f=t([i(`nlp-tasks-demo`)],f),document.body.innerHTML=`<nlp-tasks-demo></nlp-tasks-demo>`;export{f as NLPTasksDemo};