import { getCurrentLanguage } from "../mini-lit/index.js";

const content = {
  en: {
    5: `## 5. Agents: Giving LLMs Tools

**Learning goals**

- Understand that an agent is a model plus permission to call tools.
- Separate what the model decides from what the app or local tool actually executes.
- Learn why tool contracts, permissions, progress UI, and human review matter.

Plain chat is limited to text prediction. Tool use changes the shape of the system: the model proposes an action, the app checks the action against a contract, and a local or remote tool performs the work.

That does not make the model automatically reliable. A model can choose the wrong tool, pass the wrong arguments, trust malicious content, or write a file you did not intend to change. The point of this section is to watch those handoffs happen instead of treating "agent" as magic.

**What to watch across section 5**

- The prompt that starts the task.
- The tool contract: accepted inputs and returned outputs.
- The process surface: planning, tool call, local execution, result, and review.
- The difference between a live tool result and a classroom fallback.

**Practical habit:** when a product says it has agents, ask which tools it can call, who granted permission, what gets logged, and where a human can stop the action.`,
    5.1: `## 5.1. Tool Invocation

**Learning goals**

- See that a model can produce tool calls, not only prose.
- Notice how unsafe instructions can turn a helpful assistant into an overpowered automation.
- Learn why write-capable tools need permission boundaries and confirmation.

In this demo, the assistant receives a deliberately unsafe system prompt and a small email inbox. The model is asked to plan tool calls. The local app then shows what would happen if those calls were trusted too easily.

The important lesson is the boundary: the model does not "send email" by itself. It proposes calls such as \`email_search\` or \`email_write\`. The application decides whether those calls are allowed, whether they need review, and what data the tool can access.

**What to watch**

- The model's planned tool calls appear in the process panel, not as normal chat.
- Read-only actions are less risky than write or send actions.
- A malicious email can try to act like an instruction.
- A safe product should stop before sensitive data is forwarded.

**Practical habit:** never give an agent broad write permissions just because the chat answer sounds reasonable. Treat tool calls like real actions.`,
    5.2: `## 5.2. Calculator Tool

**Learning goals**

- Separate language understanding from exact computation.
- See the \`calculate()\` contract: one expression in, one numeric result out.
- Learn to inspect the argument the model sends to the tool.

Large language models can explain arithmetic, but exact arithmetic is not their core job. The calculator tool is a tiny local function with a narrow contract: the model must turn the user request into a valid expression, and the local tool computes that expression deterministically.

The risky part moves from "can the model multiply?" to "did the model send the correct expression?" If the expression is wrong, the calculator will faithfully return the wrong answer.

**What to watch**

- The model produces a tool argument before the local calculator runs.
- The tool card shows the exact expression that was executed.
- The final answer should match the tool result, not the model's mental math.

**Practical habit:** when using tools, verify the arguments. A precise tool cannot rescue a misunderstood task.`,
    5.3: `## 5.3. Date and Time Tool

**Learning goals**

- See why a model does not inherently know "now."
- Watch the app ask a local time tool for the current date or timezone.
- Learn to make relative-time answers cite their time basis.

Questions such as "today," "this month," or "how many days until" are not fixed facts inside the model. They depend on the clock, timezone, and the moment the question is asked.

A date/time tool gives the model a trustworthy timestamp. The model still needs to use the right timezone and explain its basis so the answer can be checked later.

**What to watch**

- The prompt asks for a time-sensitive answer.
- The process panel shows the timezone sent to the local tool.
- The final answer should state the date or timezone it used.

**Practical habit:** for anything relative to time, make the system fetch time explicitly. Do not let the model guess the calendar.`,
    5.4: `## 5.4. Web Search Tool

**Learning goals**

- See why a model without search should admit it cannot verify current or obscure facts.
- Watch how a search-enabled workflow turns a question into a query, fetches sources, then answers from those sources.
- Learn to inspect source quality instead of treating every search snippet as verified truth.

A web search tool does not make the model magically know the internet. It gives the app a small capability: take a query string, fetch result titles, URLs, snippets, and a timestamp, then put those results back into the model context.

That handoff matters. The model can still choose a weak query. Search results can be stale, login-walled, duplicated, or only loosely related. A snippet can mention a person or company without proving the full claim you want to make.

In this demo, Matt is intentionally a narrow, realistic target. Without search, the model should say it cannot verify the public profile. With search, the useful question is not "did it produce a confident bio?" The useful question is: which claims are supported by Hugging Face, DBLP, LinkedIn snippets, or other public pages, and which claims should stay low confidence?

**What to watch**

- The model first rewrites the user question into a search query.
- The local search service returns source material, not final truth.
- The final answer should cite sources and mark low-confidence claims.
- If a result is only a snippet or behind a login wall, the answer should not overstate it.

**Practical habit:** for people, organizations, recent events, prices, policies, or anything niche, do not ask the model to "remember." Give it a search tool, then verify the sources.`,
    5.5: `## 5.5. Artifacts Tool

**Learning goals**

- See how an agent can create or modify a file-like artifact.
- Distinguish the model's plan from the local artifact operation.
- Learn why long generation needs visible progress and review.

An artifacts tool lets the model ask the app to create, update, rewrite, or delete a named file. The model supplies content or edit instructions; the local app owns the artifact state and shows the result.

This is powerful because the output becomes inspectable work, not only a chat message. It is also risky because a vague request can produce a big change. The UI should show the planning step, the local write step, and the final artifact clearly enough for a person to review.

**What to watch**

- The model first produces an artifact action.
- The process panel previews what is about to be written.
- The local app applies the change and keeps the artifact visible.
- If model planning fails, the classroom fallback is labeled honestly.

**Practical habit:** treat artifacts like drafts. Let the model help, but inspect the file before trusting or sharing it.`,
    5.6: `## 5.6. Model Context Protocol

**Learning goals**

- Understand how MCP differs from a one-off built-in tool.
- See the discovery step where a client learns what an external server offers.
- Learn why protocol boundaries and permissions matter.

MCP is a way for an AI client to talk to external tool servers through a shared protocol. Instead of hardcoding every tool inside the app, the client can ask a server what tools exist, inspect their contracts, then call a selected tool.

That extra layer is the point. MCP is not "just another calculator button." It introduces server ownership, tool discovery, transport, permission surfaces, and reuse across different clients.

**What to watch**

- The flow starts with discovery, not execution.
- Tool contracts come from the server.
- The client decides which tool call is allowed.
- The process trace separates protocol messages from the final user answer.

**Practical habit:** when using MCP, ask what server you are connecting to, what tools it declares, and which calls are allowed before the model touches your files or services.`,
    5.7: `## 5.7. Key Takeaways

**What changed in section 5**

- A model can propose actions, not only write answers.
- Tools have contracts: input shape, output shape, and limits.
- The application, not the model, executes tools and controls permission.
- Progress UI matters because students and users need to see the handoff.

**Risks to remember**

- Wrong arguments can make a precise tool return a wrong result.
- Untrusted content can try to steer an agent.
- Search results are evidence, not truth by themselves.
- File-writing tools need review before the output becomes real work.
- External tool servers add protocol and trust boundaries.

**Practical habit:** every useful agent has three parts to inspect: the model's plan, the tool's contract, and the app's permission policy.`,
  },
  "zh-TW": {
    5: `## 5. AI 代理人：讓大型語言模型使用工具

**本頁學習目標**

- 理解代理人不是魔法，而是「模型」加上「可呼叫的工具」。
- 分清楚模型負責決定什麼、app 或本機工具實際執行什麼。
- 知道為什麼工具合約、權限、進度畫面和人工確認都很重要。

純聊天只能產生文字。工具使用改變的是系統形狀：模型提出一個動作，app 檢查這個動作是否符合工具合約，然後由本機或外部工具執行。

這不代表模型突然變可靠。模型可能選錯工具、填錯參數、相信惡意內容，或改到你不想改的檔案。這一章的重點是把這些交接看清楚，而不是把「代理人」當成黑盒子。

**這一章要觀察什麼**

- 啟動任務的使用者提示。
- 工具合約：接受什麼輸入、回傳什麼輸出。
- 流程畫面：規劃、工具呼叫、本機執行、結果、檢查。
- 真實工具結果和課堂備援結果的差別。

**實務習慣：** 看到產品說它有 agent，不要只問聰不聰明。要問它能呼叫哪些工具、誰給的權限、哪裡有紀錄，以及人可以在哪一步停下來。`,
    5.1: `## 5.1. 工具呼叫

**本頁學習目標**

- 看見模型可以產生工具呼叫，而不只是回答文字。
- 觀察不安全的系統提示如何讓助理變成權限過大的自動化流程。
- 理解可寫入、可寄送、可外洩資料的工具為什麼需要權限邊界與確認。

這個 demo 會給助理一段刻意設計得不安全的系統提示，以及一個小型 email 收件匣。模型會先規劃工具呼叫，本機 app 再展示如果太相信這些呼叫會發生什麼事。

重點是邊界：模型本身不會「寄 email」。它提出像 \`email_search\` 或 \`email_write\` 這樣的呼叫。真正決定能不能執行、要不要確認、工具能讀到哪些資料的是應用程式。

**觀察重點**

- 模型規劃的工具呼叫會出現在流程面板，而不是一般聊天內容。
- 只讀動作的風險低於寫入或寄送動作。
- 惡意 email 可能試著假裝成指令。
- 安全的產品應該在敏感資料被轉寄前停下來。

**實務習慣：** 不要因為聊天回答看起來合理，就給代理人過大的寫入權限。工具呼叫就是實際動作。`,
    5.2: `## 5.2. 計算機工具

**本頁學習目標**

- 分清楚語言理解和精確計算是兩件事。
- 看懂 \`calculate()\` 的合約：輸入一個算式，輸出一個數值結果。
- 練習檢查模型送進工具的參數是否正確。

大型語言模型可以解釋算術，但精確計算不是它最可靠的部分。計算機工具是一個很窄的本機函式：模型要把使用者問題轉成合法算式，本機工具再用確定性的方式計算。

風險因此轉移了。問題不再只是「模型會不會乘法」，而是「模型送進工具的算式是不是對的」。如果算式錯了，計算機會很忠實地算出錯誤答案。

**觀察重點**

- 本機計算機執行前，模型會先產生工具參數。
- 工具卡片會顯示實際被執行的算式。
- 最後回答應該跟工具結果一致，而不是相信模型心算。

**實務習慣：** 使用工具時要看參數。精確工具救不了被誤解的任務。`,
    5.3: `## 5.3. 日期／時間工具

**本頁學習目標**

- 看見模型本身並不真的知道「現在」。
- 觀察 app 如何向本機時間工具取得目前日期與時區。
- 練習要求相對時間答案說清楚計算基準。

「今天」、「這個月底」、「還有幾天」這類問題不是模型內部固定存在的事實。答案取決於時鐘、時區，以及你問問題的當下。

日期／時間工具可以提供可信的時間戳。模型仍然要用對時區，並在回答中說清楚基準，這樣之後才檢查得了。

**觀察重點**

- 使用者提示會要求時間敏感的答案。
- 流程面板會顯示送給本機工具的時區。
- 最後回答應該說明使用的日期或時區。

**實務習慣：** 任何跟目前時間有關的任務，都應該明確取得時間。不要讓模型猜日曆。`,
    5.4: `## 5.4. 網路搜尋工具

**本頁學習目標**

- 看見沒有搜尋工具時，模型遇到即時資訊、小眾人物或公開履歷，應該承認無法查證。
- 觀察啟用搜尋後，系統如何把問題改寫成 query、取得來源，再把來源交給模型整理。
- 練習先檢查來源品質，而不是看到搜尋片段就當成事實。

網路搜尋工具不會讓模型突然「懂整個網路」。它只是讓 app 多了一個小能力：拿查詢字串去找網頁，回傳標題、網址、片段和查詢時間，再把這些結果放回模型上下文。

這個交接很重要。模型可能產生不好的 query；搜尋結果可能過期、被登入牆擋住、重複，或只和問題鬆散相關。搜尋片段提到某個人或公司，不代表它已經證明完整履歷。

這個 demo 故意用 Matt 當例子，因為小眾人物很適合示範「不要用猜的」。沒有搜尋時，模型應該說它無法查證公開資料。啟用搜尋後，重點也不是產生一段很有自信的介紹，而是檢查：哪些說法真的被 Hugging Face、DBLP、LinkedIn 片段或其他公開頁面支持？哪些只能標低信心？

**觀察重點**

- 模型先把自然語言問題改寫成搜尋 query。
- 本機搜尋服務回傳的是來源材料，不是最後真相。
- 最後回答應該附來源，並標出低信心說法。
- 如果來源只是搜尋片段或登入牆後面的頁面，回答不應該講得太滿。

**實務習慣：** 人物、組織、近期事件、價格、政策、冷門資訊，不要叫模型憑記憶回答。給它搜尋工具，然後回頭檢查來源。`,
    5.5: `## 5.5. 產物工具（Artifacts）

**本頁學習目標**

- 看見代理人如何建立或修改一個像檔案的產物。
- 分清楚模型的規劃和本機 artifact 操作。
- 理解長時間生成為什麼需要可讀的進度與人工檢查。

產物工具讓模型要求 app 建立、更新、重寫或刪除指定檔案。模型提供內容或修改指令；本機 app 負責保存 artifact 狀態並顯示結果。

這很有用，因為輸出不再只是聊天訊息，而是可以檢查的工作成果。它也有風險，因為模糊需求可能造成很大的修改。UI 應該清楚顯示規劃、本機寫入和最後產物，讓人可以檢查。

**觀察重點**

- 模型會先產生 artifact 動作。
- 流程面板會預覽即將寫入的內容。
- 本機 app 套用變更後，產物會留在畫面上供檢查。
- 如果模型規劃失敗，課堂備援會被明確標示。

**實務習慣：** 把 artifacts 當草稿。可以讓模型幫忙，但分享或採用前要看過檔案。`,
    5.6: `## 5.6. 模型上下文協定（MCP）

**本頁學習目標**

- 理解 MCP 和單一內建工具有什麼不同。
- 看見 client 先向外部 server 詢問有哪些工具的 discovery 步驟。
- 理解協定邊界和權限為什麼重要。

MCP 是讓 AI client 透過共同協定和外部工具 server 溝通的方法。app 不需要把每個工具都硬寫在內部；client 可以先詢問 server 有哪些工具、讀取工具合約，再呼叫被允許的工具。

這個額外層次就是重點。MCP 不是「另一顆計算機按鈕」。它多了 server 歸屬、工具發現、傳輸協定、權限表面，以及跨不同 client 重複使用的可能。

**觀察重點**

- 流程從 discovery 開始，而不是直接執行。
- 工具合約由 server 宣告。
- client 決定哪些工具呼叫可以被允許。
- 流程紀錄會把協定訊息和最後回答分開。

**實務習慣：** 使用 MCP 時，先問你連到哪個 server、它宣告哪些工具、哪些呼叫被允許，再讓模型碰你的檔案或服務。`,
    5.7: `## 5.7. 重點整理

**這一章改變了什麼**

- 模型可以提出動作，而不只是寫回答。
- 工具有合約：輸入格式、輸出格式和限制。
- 真正執行工具與控制權限的是應用程式，不是模型。
- 流程 UI 很重要，因為使用者需要看見模型和工具之間的交接。

**要記得的風險**

- 參數錯了，精確工具也會算出錯誤結果。
- 不可信內容可能試著操控代理人。
- 搜尋結果是證據材料，不是自動等於真相。
- 能寫檔的工具在產出變成正式工作前，需要人工檢查。
- 外部工具 server 會增加協定與信任邊界。

**實務習慣：** 每個有用的 agent 都要檢查三件事：模型的計畫、工具的合約、app 的權限政策。`,
  },
};

export function getSectionFiveContent(sectionId) {
  const language = getCurrentLanguage() === "en" ? "en" : "zh-TW";
  return content[language]?.[sectionId] ?? content.en[sectionId] ?? "";
}
