import {
  __decorate as e,
  getCurrentLanguage,
  i18n as t,
  t$1 as n,
  x as r,
} from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import "../workshop-runtime/AgentRuntime.js";
import "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase as i } from "../workshop-runtime/DemoBase.js";
const sectionContent = {
  en: `## 7. Where to Go from Here

You do not need to memorize every model name. Names, prices, and leaderboards move quickly. What lasts longer is the judgment you practiced in this workshop: context, grounding, tools, cost, permissions, evaluation, and verification.

Use this page as a map for what to try next.

### Major platforms to try

- **OpenAI ChatGPT**: [chat.openai.com](https://chat.openai.com)
  - Try normal chat, file upload, image input, Canvas, and custom GPTs.
  - Compare fast models and stronger reasoning models on the same task.
- **Anthropic Claude**: [claude.ai](https://claude.ai)
  - Try Artifacts for writing or code co-creation.
  - Try Projects when you want a persistent knowledge base.
- **Google Gemini**: [gemini.google.com](https://gemini.google.com)
  - Useful if your work already lives in Google Workspace.
  - AI Studio is worth exploring if you build prototypes.
- **Microsoft Copilot**: [copilot.microsoft.com](https://copilot.microsoft.com)
  - Most relevant when your workplace runs Microsoft 365.
  - Evaluate it inside Word, Excel, PowerPoint, Outlook, and Teams workflows.
- **Perplexity**: [perplexity.ai](https://perplexity.ai)
  - Search-oriented product. Good for comparing citation behavior and source quality.

### Desktop and mobile apps

- **ChatGPT desktop/mobile**: [openai.com/chatgpt/download](https://openai.com/chatgpt/download)
  - Good baseline for everyday personal workflows.
- **Claude Desktop**: [claude.ai/download](https://claude.ai/download)
  - Useful if you want to explore MCP-enabled desktop workflows.
- **Perplexity mobile/desktop**: [perplexity.ai](https://perplexity.ai)
  - Useful for quick source-backed research, but still verify sources.
- **Microsoft Copilot app**: [microsoft.com/microsoft-copilot](https://www.microsoft.com/en-us/microsoft-copilot)
  - Most useful when paired with your organization account and files.

### Developer tools and APIs

- **Codex**: [github.com/openai/openai-codex](https://github.com/openai/openai-codex)
  - CLI coding agent. Good for learning how agent workflows expose plans, patches, and tests.
- **Claude Code**: [docs.anthropic.com/claude-code](https://docs.anthropic.com/en/docs/claude-code)
  - CLI coding assistant with strong repository workflows.
- **Cursor**: [cursor.sh](https://cursor.sh)
  - AI-first code editor based on VS Code.
- **OpenRouter**: [openrouter.ai](https://openrouter.ai)
  - One API surface for trying many model providers.
- **Vercel AI SDK**: [sdk.vercel.ai](https://sdk.vercel.ai)
  - Practical SDK for building chat and agent prototypes.
- **Hugging Face**: [huggingface.co](https://huggingface.co)
  - Model and dataset hub. Always read the model card, license, and intended use.

### Self-hosting and local inference

- **Ollama**: [ollama.com](https://ollama.com)
  - Fastest way to try local models from the command line.
- **LM Studio**: [lmstudio.ai](https://lmstudio.ai)
  - Desktop app for downloading, testing, and serving local models.
- **llama.cpp**: [github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)
  - Core local inference project behind many quantized workflows.
- **vLLM**: [vllm.ai](https://vllm.ai)
  - Production-oriented serving engine when throughput matters.
- **SGLang**: [github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
  - Serving/runtime project for efficient structured generation and agent workloads.

### Learn more

- **DeepLearning.AI**: [deeplearning.ai](https://www.deeplearning.ai)
  - Beginner-friendly AI and LLM courses.
- **OpenAI docs**: [platform.openai.com/docs](https://platform.openai.com/docs)
  - Official API, model, prompting, tool, and pricing documentation.
- **Anthropic prompt engineering docs**: [docs.claude.com](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
  - Clear guide to prompts, examples, and evaluation.
- **Prompt Engineering Guide**: [promptingguide.ai](https://www.promptingguide.ai)
  - Broad survey of prompting patterns.
- **Simon Willison's blog**: [simonwillison.net](https://simonwillison.net)
  - Excellent practical writing on LLMs, tools, security, and evals.
- **Andrej Karpathy's YouTube**: [youtube.com/@AndrejKarpathy](https://youtube.com/@AndrejKarpathy)
  - Strong fundamentals for neural networks and language models.

### Practice after the workshop

- Take five real tasks from your own work and write them as repeatable test cases.
- Run the same task on at least two models. Compare quality, speed, cost, and failure modes.
- Save prompts that work, but also save examples that failed and why.
- For document tasks, keep the source, extracted text, prompt, answer, and reference answer together.
- For tool or agent tasks, record the tool arguments and the final result. Do not only save the final answer.

### Security and governance resources

- **OWASP GenAI**: [genai.owasp.org](https://genai.owasp.org)
  - Practical AI security resources.
- **OWASP LLM Top 10**: [owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications)
  - Common risk categories for LLM applications.
- **Prompt injection examples**: [github.com/jthack/PIPE](https://github.com/jthack/PIPE)
  - Examples of prompt injection patterns.
- **Simon Willison on LLM security**: [simonwillison.net/series/llm-security](https://simonwillison.net/series/llm-security)
  - Practical essays on prompt injection and tool risk.

### Stay updated without getting dragged around

- Follow provider changelogs, not just launch videos.
- Re-check pricing, context windows, and model availability before a real deployment.
- Join communities such as [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA), [r/OpenAI](https://reddit.com/r/OpenAI), and [Hugging Face discussions](https://huggingface.co).
- Treat every benchmark as a hint, not a decision. Your own task set matters more.

**Key takeaway:** The field changes quickly. The goal is not to chase every new model. The goal is to build a habit: test the claim, inspect the context, verify the source, measure the cost, and decide whether the workflow is reliable enough for the job.`,
  "zh-TW": `## 7. 接下來可以往哪裡走

學完這套工作坊後，不需要記住每個模型名稱。模型名稱、價格、排行榜都會變。比較值得帶走的是一套判斷方式：上下文、grounding、工具、成本、權限、評測與驗證。

這一頁不是「必裝清單」，比較像一張地圖。你可以從自己的工作情境出發，挑幾個方向試。

### 主要平台可以怎麼試

- **OpenAI ChatGPT**：[chat.openai.com](https://chat.openai.com)
  - 試一般聊天、文件上傳、圖片輸入、Canvas、自訂 GPT。
  - 用同一個任務比較快模型與 reasoning 模型，不要只看模型名稱。
- **Anthropic Claude**：[claude.ai](https://claude.ai)
  - 試 Artifacts，觀察模型如何和你一起寫文件或程式。
  - 試 Projects，感受「有一包長期資料」和一般聊天有什麼差別。
- **Google Gemini**：[gemini.google.com](https://gemini.google.com)
  - 如果你的資料平常就在 Google Workspace，值得測實際整合效果。
  - AI Studio 適合做原型與 API 測試。
- **Microsoft Copilot**：[copilot.microsoft.com](https://copilot.microsoft.com)
  - 如果公司使用 Microsoft 365，請直接拿 Word、Excel、PowerPoint、Outlook、Teams 的真實流程測。
  - 不要只問它會不會聊天，要看它能不能進入你原本的工作流。
- **Perplexity**：[perplexity.ai](https://perplexity.ai)
  - 偏搜尋與引用來源。適合練習比較「看起來有來源」和「來源真的支持結論」的差別。

### 桌面與手機 App

- **ChatGPT desktop/mobile**：[openai.com/chatgpt/download](https://openai.com/chatgpt/download)
  - 當作日常工作流的基準線。先知道一般使用者實際會拿到什麼體驗。
- **Claude Desktop**：[claude.ai/download](https://claude.ai/download)
  - 想理解 MCP 或桌面端工具整合時，可以拿來觀察。
- **Perplexity mobile/desktop**：[perplexity.ai](https://perplexity.ai)
  - 適合快速查資料，但仍然要點開來源確認。
- **Microsoft Copilot app**：[microsoft.com/microsoft-copilot](https://www.microsoft.com/en-us/microsoft-copilot)
  - 最有價值的情境通常是搭配組織帳號與內部文件，而不是單獨聊天。

### 開發工具與 API

- **Codex**：[github.com/openai/openai-codex](https://github.com/openai/openai-codex)
  - CLI coding agent。可以觀察 AI 代理人如何提出計畫、修改檔案、跑測試。
- **Claude Code**：[docs.anthropic.com/claude-code](https://docs.anthropic.com/en/docs/claude-code)
  - 另一個成熟的 CLI coding assistant，適合比較 repo 工作流。
- **Cursor**：[cursor.sh](https://cursor.sh)
  - 以 VS Code 為基礎的 AI-first 編輯器。
- **OpenRouter**：[openrouter.ai](https://openrouter.ai)
  - 想快速比較不同模型供應商時，可以用同一個 API 介面試。
- **Vercel AI SDK**：[sdk.vercel.ai](https://sdk.vercel.ai)
  - 做聊天介面、串流、工具呼叫原型時很實用。
- **Hugging Face**：[huggingface.co](https://huggingface.co)
  - 模型與資料集集散地。下載前請看 model card、授權、用途限制與社群回饋。

### 自行架設與本機推論

- **Ollama**：[ollama.com](https://ollama.com)
  - 最快開始跑本機模型的方式之一，適合先試手感。
- **LM Studio**：[lmstudio.ai](https://lmstudio.ai)
  - 桌面 App，可以下載、測試、啟動本機 API server。
- **llama.cpp**：[github.com/ggml-org/llama.cpp](https://github.com/ggml-org/llama.cpp)
  - 很多量化與本機推論工作流背後的重要專案。
- **vLLM**：[vllm.ai](https://vllm.ai)
  - 如果你在意多人使用、吞吐量與 server 端部署，可以研究。
- **SGLang**：[github.com/sgl-project/sglang](https://github.com/sgl-project/sglang)
  - 針對 structured generation、agent workload 與高效率 serving 的 runtime。

### 繼續學習

- **DeepLearning.AI**：[deeplearning.ai](https://www.deeplearning.ai)
  - 適合補 AI 與 LLM 的入門課程。
- **OpenAI 官方文件**：[platform.openai.com/docs](https://platform.openai.com/docs)
  - API、模型、prompting、工具與價格都要以官方文件為準。
- **Anthropic prompt engineering docs**：[docs.claude.com](https://docs.claude.com/en/docs/build-with-claude/prompt-engineering/overview)
  - 對提示、範例與評測寫得很清楚。
- **Prompt Engineering Guide**：[promptingguide.ai](https://www.promptingguide.ai)
  - 適合快速瀏覽各種提示模式。
- **Simon Willison's blog**：[simonwillison.net](https://simonwillison.net)
  - 很多 LLM、工具、安全與 eval 的務實文章。
- **Andrej Karpathy's YouTube**：[youtube.com/@AndrejKarpathy](https://youtube.com/@AndrejKarpathy)
  - 想補神經網路與語言模型基礎，很值得看。

### 工作坊後可以怎麼練

- 拿自己工作裡五個真實任務，整理成可重複測試的題目。
- 同一題至少跑兩個模型，比較品質、速度、成本與失敗模式。
- 不只保存好 prompt，也保存失敗案例：哪裡錯、為什麼錯、怎麼檢查。
- 文件任務請把原始文件、抽出的文字、prompt、模型回答、參考答案放在一起。
- 工具或 agent 任務請記錄工具參數與工具結果，不要只保存最後回答。

### 安全與治理資源

- **OWASP GenAI**：[genai.owasp.org](https://genai.owasp.org)
  - AI 安全的實務資源。
- **OWASP LLM Top 10**：[owasp.org/www-project-top-10-for-large-language-model-applications](https://owasp.org/www-project-top-10-for-large-language-model-applications)
  - LLM 應用常見風險分類。
- **Prompt injection examples**：[github.com/jthack/PIPE](https://github.com/jthack/PIPE)
  - 可以看提示注入有哪些常見模式。
- **Simon Willison on LLM security**：[simonwillison.net/series/llm-security](https://simonwillison.net/series/llm-security)
  - 對 prompt injection、工具風險與產品安全有很多清楚案例。

### 追新，但不要被追著跑

- 看供應商 changelog，不要只看發表影片。
- 真正部署前，重新確認價格、上下文長度、模型可用性與限制。
- 可以追蹤 [r/LocalLLaMA](https://reddit.com/r/LocalLLaMA)、[r/OpenAI](https://reddit.com/r/OpenAI)、Hugging Face discussions 等社群，但不要把社群熱度當成採用理由。
- 所有 benchmark 都只是線索，不是決策本身。你的真實任務集比較重要。

**最後帶走一句話：** 這個領域會一直變。重點不是追每一個新模型，而是養成一個習慣：看見宣稱時會測、看見回答時會查來源、看見工具時會檢查權限、看見成本時會估算，最後再判斷這個工作流是否可靠到足以放進真實工作。`,
};
let a = class extends i {
  constructor(...e) {
    (super(...e),
      (this.headerTitle = t(`接下來可以往哪裡走`)),
      (this.sectionId = `7`),
      (this.sectionMode = `subtree`));
  }
  get sectionContent() {
    return sectionContent[getCurrentLanguage()] ?? sectionContent.en;
  }
  renderContentPanel() {
    return r`
			<div class="flex-1 overflow-y-auto h-full">
				<div class="max-w-4xl mx-auto p-6">
					<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${!1}></markdown-block>
				</div>
			</div>
		`;
  }
};
a = e([n(`where-to-go-demo`)], a);
const o = document.createElement(`where-to-go-demo`);
document.body.appendChild(o);
export { a as WhereToGoDemo };
