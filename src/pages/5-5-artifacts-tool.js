import { __decorate, i18n, r, t$1, x } from "../mini-lit/index.js";
import "../workshop-runtime/CodeBlock.js";
import {
  AgentInterface,
  getModel,
  registerToolRenderer,
} from "../workshop-runtime/AgentRuntime.js";
import { Badge } from "../workshop-runtime/UiPrimitives.js";
import "../workshop-runtime/Dialog.js";
import "../workshop-runtime/Input.js";
import { getAuthToken } from "../workshop-runtime/AuthToken.js";
import "../mini-lit/index.js";
import "../mini-lit/index.js";
import { DemoBase } from "../workshop-runtime/DemoBase.js";
import { AgentSession } from "../workshop-runtime/AgentSession.js";
import "../workshop-runtime/PreviewCodeToggle.js";
import { ArtifactsPanel } from "../workshop-runtime/Artifacts.js";
import { streamSimpleProxy } from "../workshop-runtime/ProxyClient.js";
import { getSectionFiveContent } from "./section-5-content.js";

function extractJsonObject(text) {
  const fenced = text.match(/```(?:json)?\s*([\s\S]*?)```/i);
  const raw = fenced ? fenced[1] : text;
  const start = raw.indexOf(`{`);
  const end = raw.lastIndexOf(`}`);
  if (start === -1 || end === -1 || end <= start) throw new Error(`Planner did not return JSON`);
  return JSON.parse(raw.slice(start, end + 1));
}

function artifactActionLabel(command) {
  return (
    {
      create: `建立`,
      update: `更新`,
      rewrite: `重寫`,
      delete: `刪除`,
      get: `讀取`,
      logs: `查看紀錄`,
    }[command] ||
    command ||
    `處理`
  );
}

function artifactChangeSummary(args) {
  if (args.command === `create`) return `產生一份新產物，完整內容請看右側產物面板。`;
  if (args.command === `rewrite`)
    return `以新的完整內容覆寫同一份檔案，適合大幅改寫或避免精準字串比對失敗。`;
  if (args.command === `update`)
    return `用 old_str / new_str 做局部替換；old_str 必須逐字相同才會成功。`;
  if (args.command === `delete`) return `移除這份產物。`;
  return `執行 artifacts 工具操作。`;
}

function wait(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function cleanErrorMessage(error) {
  return String(error?.message || error || `未知錯誤`).replace(/[。．.]+$/u, ``);
}

function artifactFailureMessage(action, error) {
  const message = cleanErrorMessage(error);
  if (message.includes(`模型規劃超過`)) {
    return `${action}失敗：模型花太久還沒產生 artifacts 工具指令，這次已停止。請再試一次；如果連續發生，先確認 ChatGPT 連線或稍後重試。`;
  }
  if (message.includes(`ChatGPT 尚未連線`)) {
    return `${action}失敗：ChatGPT 尚未連線。請先點右上角狀態燈登入。`;
  }
  if (message.includes(`Planner did not return JSON`)) {
    return `${action}失敗：模型沒有回傳可執行的工具參數。請再試一次，讓模型重新規劃。`;
  }
  return `${action}失敗：${message}。`;
}

function trimPlannerPreview(text) {
  const normalized = String(text || ``)
    .replace(/\r/g, ``)
    .trimStart();
  if (!normalized) return `等待模型開始輸出工具參數...`;
  return normalized.length > 1200 ? `...\n${normalized.slice(-1200)}` : normalized;
}

function formatCommandPreview(command) {
  const preview = { ...command };
  if (typeof preview.content === `string`)
    preview.content = `已產生 ${preview.content.length} 字元，完整內容會交給 artifacts()。`;
  if (typeof preview.old_str === `string`)
    preview.old_str = `舊字串 ${preview.old_str.length} 字元`;
  if (typeof preview.new_str === `string`)
    preview.new_str = `新字串 ${preview.new_str.length} 字元`;
  return JSON.stringify(preview, null, 2);
}

function formatExpectedCreatePreview(filename) {
  return JSON.stringify(
    {
      command: `create`,
      filename,
      content: `模型接下來會產生完整檔案內容，完成後交給 artifacts() 寫入。`,
    },
    null,
    2,
  );
}

function formatExpectedUpdatePreview(filename) {
  return JSON.stringify(
    {
      command: `update 或 rewrite`,
      filename,
      old_str: `若使用 update，必須逐字符合原檔內容。`,
      new_str: `模型要寫回的新內容。若修改幅度大，會改用 rewrite。`,
    },
    null,
    2,
  );
}

let ArtifactsToolDemo = class extends DemoBase {
  constructor() {
    super();
    this.headerTitle = i18n(`產物工具（Artifacts）：建立、更新、檢視檔案`);
    document.title = i18n(`5.5 產物工具（Artifacts）`);
    this.sectionId = `5.5`;
    this.debugLog = [];
    this.hasArtifacts = false;
    this.showArtifacts = false;
    this.artifactCount = 0;
    this.runningExample = ``;
    this.selectedExample = ``;
    this.lastObservation = ``;
    this.isPlanning = false;
    this.processingPhase = ``;
    this.processingStage = ``;
    this.plannerPreview = ``;
    this.processStartedAt = 0;
    this.processFinishedAt = 0;
    this.processNow = 0;
    this.processTimer = null;
    this.streamTimeoutId = null;
    this.recoveredToolResults = new Set();
    this.session = new AgentSession({ authTokenProvider: getAuthToken });
    this.session.setModel(getModel(`openai-codex`, `gpt-5.4-mini`));
    this.session.debugListener = (entry) => {
      this.debugLog = [...this.debugLog, entry];
    };
    this.session.subscribe(({ state }) => {
      this.handleSessionState(state);
    });
    this.session.setSystemPrompt(
      i18n(`你正在教學示範 artifacts 工具。當使用者要求建立或修改文件、HTML、SVG、程式碼時，請務必呼叫 artifacts 工具，不要只把完整內容貼在聊天回覆裡。

工具使用原則：
- 建立新產物時使用 command=create，並選一個清楚的檔名。
- 修改既有產物時優先使用 command=update；若需要大幅改寫才使用 command=rewrite。
- 回覆要用繁體中文，先簡短說你呼叫了哪個工具、改了哪個檔案，再提醒使用者去產物面板檢查結果。
- 不要假裝已經預覽成功；如果是 HTML，可以請使用者檢查預覽與 console。`),
    );
    this.session.setThinkingLevel(`off`);
    this.agentInterface = new AgentInterface();
    this.agentInterface.session = this.session;
    this.agentInterface.enableAttachments = true;
    this.agentInterface.enableModelSelector = true;
    this.agentInterface.enableThinking = false;
    this.agentInterface.style.width = `100%`;
    this.agentInterface.style.height = `100%`;
    this.artifactsPanel = new ArtifactsPanel();
    this.artifactsPanel.style.width = `100%`;
    this.artifactsPanel.style.height = `100%`;
    this.artifactsPanel.renderParams = (args, pending) =>
      this.renderCompactArtifactParams(args, pending);
    registerToolRenderer(`artifacts`, this.artifactsPanel);
    this.artifactsPanel.attachmentsProvider = () =>
      this.session.state.messages
        .filter((message) => message.role === `user`)
        .flatMap((message) => message.attachments || []);
    this.artifactsPanel.onArtifactsChange = () => {
      const count = this.artifactsPanel.artifacts?.size ?? 0;
      const increased = count > this.artifactCount;
      this.hasArtifacts = count > 0;
      this.artifactCount = count;
      if (this.hasArtifacts && increased) this.showArtifacts = true;
    };
    this.artifactsPanel.onClose = () => {
      this.showArtifacts = false;
    };
    this.artifactsPanel.onOpen = () => {
      this.showArtifacts = true;
    };
    this.session.setTools([this.artifactsPanel.tool]);
  }

  get sectionContent() {
    return getSectionFiveContent(`5.5`);
  }

  renderCompactArtifactParams(args, pending) {
    const filename = args?.filename || i18n(`尚未決定檔名`);
    const action = artifactActionLabel(args?.command);
    const summary = pending ? `模型正在填工具參數...` : artifactChangeSummary(args || {});
    return x`
			<div class="rounded-md border border-border bg-muted/30 px-3 py-2 text-sm">
				<div class="flex items-center justify-between gap-3">
					<div class="font-medium text-foreground">Artifacts：${action}</div>
					<code class="text-xs text-muted-foreground truncate">${filename}</code>
				</div>
				<div class="mt-1 text-xs text-muted-foreground">${summary}</div>
			</div>
		`;
  }

  startProcessClock() {
    this.stopProcessClock();
    this.processStartedAt = Date.now();
    this.processFinishedAt = 0;
    this.processNow = this.processStartedAt;
    this.processTimer = window.setInterval(() => {
      this.processNow = Date.now();
    }, 500);
  }

  stopProcessClock() {
    if (this.processTimer) {
      window.clearInterval(this.processTimer);
      this.processTimer = null;
    }
    if (this.processStartedAt && !this.processFinishedAt) {
      this.processFinishedAt = Date.now();
      this.processNow = this.processFinishedAt;
    }
  }

  disconnectedCallback() {
    super.disconnectedCallback?.();
    this.stopProcessClock();
  }

  formatElapsedTime(milliseconds) {
    const seconds = Math.max(0, milliseconds) / 1000;
    if (seconds < 60) return `${seconds.toFixed(1)}s`;
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.round(seconds % 60);
    return `${minutes}m ${remainingSeconds}s`;
  }

  getCompletedStepCount(steps) {
    return steps.filter((step) => step.status === `done`).length;
  }

  getProcessingSteps() {
    const phase =
      this.processingPhase ||
      (this.isPlanning ? `planning` : this.session.state.isStreaming ? `streaming` : ``);
    const base = [
      {
        id: `planning`,
        label: i18n(`模型產生內容與工具指令`),
        description: i18n(`決定檔案名稱、操作方式，並產生要交給工具的內容。`),
      },
      {
        id: `tool`,
        label: i18n(`本機工具寫入產物`),
        description: i18n(`artifacts() 只照模型給的 command、filename、content 寫入產物。`),
      },
      {
        id: `inspect`,
        label: i18n(`檢查產物結果`),
        description: i18n(`學生要確認右側產物是否真的建立、更新，且內容符合任務。`),
      },
    ];
    if (phase === `streaming`) {
      return [
        {
          ...base[0],
          status: `active`,
          description:
            this.processingStage || i18n(`模型正在讀你的需求，可能會產生 artifacts 工具呼叫。`),
        },
        { ...base[1], status: `waiting` },
        { ...base[2], status: `waiting` },
      ];
    }
    if (phase === `tool` || phase === `recovering`) {
      return [
        { ...base[0], status: `done` },
        {
          ...base[1],
          status: `active`,
          description:
            this.processingStage ||
            (phase === `recovering`
              ? i18n(`update 失敗時，改用 rewrite 修復同一份檔案。`)
              : base[1].description),
        },
        { ...base[2], status: `waiting` },
      ];
    }
    if (phase === `done`) {
      return [
        { ...base[0], status: `done` },
        { ...base[1], status: `done` },
        {
          ...base[2],
          status: `done`,
          description: this.processingStage || base[2].description,
        },
      ];
    }
    return [
      {
        ...base[0],
        status: `active`,
        description: this.processingStage || base[0].description,
      },
      { ...base[1], status: `waiting` },
      { ...base[2], status: `waiting` },
    ];
  }

  renderProcessingMarker(status) {
    if (status === `done`) {
      return x`<span class="mt-progress-marker mt-progress-done" aria-hidden="true">✓</span>`;
    }
    if (status === `active`) {
      return x`<span class="mt-progress-marker mt-progress-active" aria-hidden="true"><span class="mt-progress-spinner"></span></span>`;
    }
    return x`<span class="mt-progress-marker mt-progress-waiting" aria-hidden="true">•</span>`;
  }

  renderPlannerPreview() {
    if (!this.plannerPreview) return ``;
    return x`
			<details class="mt-planner-preview">
				<summary class="mt-planner-preview-header">
						<span>${i18n(`工具參數草稿`)}</span>
					<span>JSON preview</span>
				</summary>
				<pre><code>${this.plannerPreview}</code></pre>
			</details>
		`;
  }

  renderProcessingCard() {
    const steps = this.getProcessingSteps();
    const completed = this.getCompletedStepCount(steps);
    const progress = Math.round((completed / steps.length) * 100);
    const elapsedMilliseconds = Math.max(
      0,
      (this.processFinishedAt || this.processNow || Date.now()) -
        (this.processStartedAt || Date.now()),
    );
    const isDone = this.processingPhase === `done`;
    return x`
			<style>
				@keyframes mt-artifact-spin {
					from { transform: rotate(0deg); }
					to { transform: rotate(360deg); }
				}
				@keyframes mt-artifact-sheen {
					0% { transform: translateX(-100%); opacity: 0; }
					20% { opacity: 0.45; }
					100% { transform: translateX(100%); opacity: 0; }
				}
				@keyframes mt-artifact-pulse {
					0%, 100% { box-shadow: 0 0 0 3px hsl(var(--primary) / 0.10); }
					50% { box-shadow: 0 0 0 6px hsl(var(--primary) / 0.18); }
				}
				@keyframes mt-artifact-pop {
					0% { transform: scale(0.82); }
					70% { transform: scale(1.08); }
					100% { transform: scale(1); }
				}
				@keyframes mt-artifact-activity {
					0% { transform: translateX(-70%); opacity: 0.25; }
					35% { opacity: 0.9; }
					100% { transform: translateX(170%); opacity: 0.25; }
				}
				.mt-progress-card {
					position: relative;
					overflow: hidden;
				}
				.mt-progress-card[data-running="true"]::before {
					content: "";
					position: absolute;
					inset: 0;
					background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.18), transparent);
					animation: mt-artifact-sheen 1.8s ease-in-out infinite;
					pointer-events: none;
				}
				.mt-progress-step {
					position: relative;
					display: flex;
					gap: 0.5rem;
					min-height: 3.25rem;
					padding: 0.38rem 0.45rem;
					border-radius: 0.65rem;
					transform: translateX(0);
					transition: opacity 260ms ease, transform 260ms ease, background-color 260ms ease;
				}
				.mt-progress-step-active {
					background: hsl(var(--primary) / 0.08);
					transform: translateX(2px);
				}
				.mt-progress-step-waiting {
					opacity: 0.58;
				}
				.mt-progress-copy {
					min-width: 0;
					transition: color 220ms ease, opacity 220ms ease;
				}
				.mt-progress-marker {
					width: 1.45rem;
					height: 1.45rem;
					border-radius: 999px;
					display: inline-grid;
					place-items: center;
					flex: 0 0 auto;
					font-size: 0.78rem;
					font-weight: 700;
					border: 1px solid hsl(var(--border));
					background: hsl(var(--card));
					transition: background-color 240ms ease, border-color 240ms ease, color 240ms ease, box-shadow 240ms ease, transform 240ms ease;
				}
				.mt-progress-done {
					color: hsl(var(--primary-foreground));
					background: hsl(var(--primary));
					border-color: hsl(var(--primary));
					animation: mt-artifact-pop 240ms ease-out;
				}
				.mt-progress-active {
					color: hsl(var(--foreground));
					box-shadow: 0 0 0 3px hsl(var(--primary) / 0.14);
					animation: mt-artifact-pulse 1.5s ease-in-out infinite;
				}
				.mt-progress-waiting {
					color: transparent;
					background: hsl(var(--muted));
				}
				.mt-progress-spinner {
					width: 0.82rem;
					height: 0.82rem;
					border-radius: 999px;
					border: 2px solid transparent;
					border-top-color: currentColor;
					border-right-color: currentColor;
					animation: mt-artifact-spin 850ms linear infinite;
				}
				.mt-progress-activity {
					position: relative;
					height: 3px;
					margin-top: 0.45rem;
					overflow: hidden;
					border-radius: 999px;
					background: hsl(var(--primary) / 0.12);
				}
				.mt-progress-activity > span {
					position: absolute;
					inset: 0;
					width: 52%;
					border-radius: inherit;
					background: linear-gradient(90deg, transparent, hsl(var(--primary) / 0.75), transparent);
					animation: mt-artifact-activity 1.35s ease-in-out infinite;
				}
				.mt-planner-preview {
					margin-top: 0.55rem;
					overflow: hidden;
					border: 1px solid hsl(var(--border));
					border-radius: 0.55rem;
					background: hsl(var(--background) / 0.68);
				}
				.mt-planner-preview-header {
					display: flex;
					align-items: center;
					justify-content: space-between;
					gap: 0.5rem;
					border-bottom: 1px solid hsl(var(--border));
					padding: 0.35rem 0.55rem;
					color: hsl(var(--muted-foreground));
					font-size: 0.68rem;
					font-weight: 600;
					text-transform: uppercase;
					cursor: pointer;
				}
				.mt-planner-preview pre {
					max-height: 7.25rem;
					margin: 0;
					overflow: auto;
					padding: 0.55rem;
					white-space: pre-wrap;
					word-break: break-word;
					color: hsl(var(--foreground));
					font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace;
					font-size: 0.68rem;
					line-height: 1.45;
				}
			</style>
			<div class="mt-progress-card rounded-lg border ${isDone ? `border-border bg-muted/30` : `border-primary/30 bg-primary/5`} p-3 text-sm flex-shrink-0" data-running=${String(!isDone)} role="status" aria-live="polite" aria-busy=${String(!isDone)}>
				<div class="relative">
					<div class="flex items-center justify-between gap-3">
						<div>
								<div class="font-semibold text-foreground">${isDone ? i18n(`產物流程完成`) : i18n(`產物流程進行中`)}</div>
								<div class="mt-1 text-[11px] text-muted-foreground">${completed}/${steps.length} ${i18n(`完成`)} · ${this.formatElapsedTime(elapsedMilliseconds)}</div>
						</div>
						<div class="text-[11px] uppercase tracking-wide text-muted-foreground">artifacts()</div>
					</div>
					<div class="mt-3 h-1.5 overflow-hidden rounded-full bg-muted">
						<div class="h-full rounded-full bg-primary transition-[width] duration-300" style=${`width:${progress}%`}></div>
					</div>
					<div class="mt-3 space-y-2">
						${steps.map(
              (step) => x`
								<div class="mt-progress-step mt-progress-step-${step.status}">
									${this.renderProcessingMarker(step.status)}
									<div class="mt-progress-copy">
										<div class="text-xs font-medium text-foreground">${step.label}</div>
										<div class="text-[11px] leading-relaxed text-muted-foreground">${step.description}</div>
										${step.status === `active` ? x`<div class="mt-progress-activity" aria-hidden="true"><span></span></div>` : ``}
										${step.id === `planning` && (step.status === `active` || this.plannerPreview) ? this.renderPlannerPreview() : ``}
									</div>
								</div>
							`,
            )}
					</div>
				</div>
			</div>
		`;
  }

  get examples() {
    return [
      {
        id: `handout`,
        title: i18n(`一頁式工作坊講義`),
        description: i18n(`請模型建立可改寫的 Markdown 講義`),
        filename: `tool-risk-handout.md`,
        prompt: i18n(
          `請用 artifacts 工具建立一份 Markdown 講義，檔名用 tool-risk-handout.md。主題是「LLM 工具呼叫的三個風險」。請包含：一段開場、三個風險、每個風險一個生活例子、三題課後檢查題。`,
        ),
      },
      {
        id: `estimator`,
        title: i18n(`成本估算小工具`),
        description: i18n(`請模型建立可預覽的單檔 HTML`),
        filename: `cost-estimator.html`,
        prompt: i18n(
          `請用 artifacts 工具建立一個單檔 HTML 小工具，檔名用 cost-estimator.html。功能：輸入 input tokens、output tokens、每百萬 input 價格、每百萬 output 價格，立即計算估計成本。請用深色背景、清楚標籤、不要使用外部套件。`,
        ),
      },
      {
        id: `checklist`,
        title: i18n(`提示注入檢查表`),
        description: i18n(`請模型建立產品審查文件`),
        filename: `tool-safety-checklist.md`,
        prompt: i18n(
          `請用 artifacts 工具建立一份 Markdown 檢查表，檔名用 tool-safety-checklist.md。對象是產品團隊，用來審查「有工具呼叫的 AI 功能」。請分成：工具權限、資料來源、外送與寫入、失敗回復、上線前驗收。`,
        ),
      },
      {
        id: `diagram`,
        title: i18n(`教學用 SVG 圖解`),
        description: i18n(`請模型產生可預覽的 SVG`),
        filename: `agent-loop.svg`,
        prompt: i18n(
          `請用 artifacts 工具建立一張 SVG 圖解，檔名用 agent-loop.svg。內容要說明 AI 代理人的工具循環：使用者問題、模型判斷、工具呼叫、外部程式、結果回上下文。請讓文字清楚可讀。`,
        ),
      },
      {
        id: `revision`,
        title: i18n(`逐步修改練習`),
        description: i18n(`測試模型是否更新既有產物`),
        filename: `workshop-notes.md`,
        prompt: i18n(
          `請用 artifacts 工具建立一個 Markdown 檔案，檔名叫 workshop-notes.md。內容只要三點：工具讓模型補上外部能力、工具結果仍然是不可信上下文、高風險動作需要人工確認。建立後先停下來，接著我會要求你修改同一份檔案。`,
        ),
      },
    ];
  }

  resetArtifacts() {
    this.session.clearMessages();
    this.debugLog = [];
    this.hasArtifacts = false;
    this.showArtifacts = false;
    this.artifactCount = 0;
    this.runningExample = ``;
    this.selectedExample = ``;
    this.lastObservation = ``;
    this.isPlanning = false;
    this.processingPhase = ``;
    this.processingStage = ``;
    this.plannerPreview = ``;
    this.processStartedAt = 0;
    this.processFinishedAt = 0;
    this.processNow = 0;
    this.stopProcessClock();
    this.recoveredToolResults.clear();
    if (this.streamTimeoutId) clearTimeout(this.streamTimeoutId);
    this.streamTimeoutId = null;
    this.artifactsPanel.artifacts.clear();
    this.artifactsPanel.artifactElements.forEach((element) => element.remove());
    this.artifactsPanel.artifactElements.clear();
    this.artifactsPanel._activeFilename = null;
    this.artifactsPanel.requestUpdate();
  }

  async runExample(example) {
    if (this.session.state.isStreaming || this.isPlanning) return;
    this.resetArtifacts();
    this.selectedExample = example.id;
    this.runningExample = example.id;
    this.isPlanning = true;
    this.processingPhase = `planning`;
    this.processingStage = i18n(`模型正在把你的自然語言需求轉成 artifacts() 的 create 參數。`);
    this.plannerPreview = formatExpectedCreatePreview(example.filename);
    this.lastObservation = i18n(`模型正在規劃 artifacts create 指令...`);
    this.startProcessClock();
    const startedAt = performance.now();
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: example.prompt }],
      timestamp: Date.now(),
    });
    const plannerPrompt = `你要產生一個 artifacts 工具指令來建立檔案。只回傳 JSON，不要 markdown，不要解釋。

限制：
- 必須使用 command=create
- filename 必須是：${example.filename}
- content 必須是完整檔案內容
- JSON 欄位只能使用 command、filename、content
- 如果是 HTML，必須是單檔 HTML，CSS/JS 都內嵌，不要使用外部套件。
- 如果是 Markdown，請用繁體中文，內容要短而清楚，適合課堂現場閱讀。

使用者要求：
${example.prompt}`;
    try {
      const command = await this.planArtifactCommand(plannerPrompt, startedAt);
      command.command = `create`;
      command.filename = example.filename;
      this.plannerPreview = formatCommandPreview(command);
      this.processingPhase = `tool`;
      this.processingStage = i18n(
        `模型已交出工具參數；本機 artifacts() 準備建立 ${example.filename}。`,
      );
      await wait(1400);
      this.processingStage = i18n(`本機 artifacts() 正在把內容寫進 ${example.filename}。`);
      const output = await this.appendAndExecuteToolCall({
        command,
        text: i18n(
          `我會建立 \`${example.filename}\`。下面是模型規劃出的 artifacts 工具呼叫，接著由本機工具執行。`,
        ),
        toolCallPrefix: `artifact-create`,
      });
      await wait(900);
      this.hasArtifacts = this.artifactsPanel.artifacts.size > 0;
      this.showArtifacts = this.hasArtifacts;
      this.artifactCount = this.artifactsPanel.artifacts.size;
      this.lastObservation = output.startsWith(`Error:`)
        ? i18n(`建立失敗：工具拒絕了模型的參數。請檢查工具呼叫。`)
        : i18n(`已建立 ${this.artifactCount} 份產物。請檢查產物面板，再要求模型修改同一份檔案。`);
      this.processingPhase = `done`;
      this.processingStage = output.startsWith(`Error:`)
        ? i18n(`工具回報失敗，請看聊天區錯誤訊息。`)
        : i18n(`產物已出現在右側面板，現在輪到人檢查它是否符合任務。`);
      this.stopProcessClock();
    } catch (error) {
      const message = artifactFailureMessage(`建立`, error);
      this.session.appendMessage({
        role: `assistant`,
        content: [{ type: `text`, text: message }],
        timestamp: Date.now(),
      });
      this.lastObservation = message;
      this.processingPhase = ``;
      this.processingStage = ``;
      this.stopProcessClock();
    } finally {
      this.runningExample = ``;
      this.isPlanning = false;
    }
  }

  async refineCurrentArtifact() {
    if (this.session.state.isStreaming || this.isPlanning) return;
    const filename =
      this.artifactsPanel._activeFilename || Array.from(this.artifactsPanel.artifacts.keys())[0];
    if (!filename) return;
    const artifact = this.artifactsPanel.artifacts.get(filename);
    if (!artifact) return;
    const userPrompt = `請修改目前的產物 ${filename}。請不要建立新檔，請用 artifacts 工具更新同一份檔案。修改內容：加入一段「課堂驗收」區塊，提醒學生檢查這份產物是否符合任務、是否能預覽、是否需要人工確認。`;
    this.isPlanning = true;
    this.processingPhase = `planning`;
    this.processingStage = `模型正在讀目前產物，規劃要 update 還是 rewrite。`;
    this.plannerPreview = formatExpectedUpdatePreview(filename);
    this.lastObservation = `模型正在規劃 ${filename} 的 artifacts 更新指令...`;
    this.startProcessClock();
    const startedAt = performance.now();
    this.session.appendMessage({
      role: `user`,
      content: [{ type: `text`, text: userPrompt }],
      timestamp: Date.now(),
    });
    const plannerPrompt = `你要產生一個 artifacts 工具指令來修改既有檔案。只回傳 JSON，不要 markdown，不要解釋。

限制：
- 必須修改同一個檔案：${filename}
- 不可以使用 command=create
- 若檔案是 HTML，優先用 command=update，把一段「課堂驗收」區塊插入 </main> 前面。
- 若檔案是 Markdown，使用 command=rewrite，content 必須是完整原文加上「課堂驗收」區塊。
- JSON 欄位只能使用 command、filename、old_str、new_str；必要時可用 command=rewrite、filename、content。

目前檔案內容：

${artifact.content.slice(0, 18000)}

使用者要求：
${userPrompt}`;
    try {
      const command = await this.planArtifactCommand(plannerPrompt, startedAt);
      if (command.command === `create`) throw new Error(`Planner tried to create a new file`);
      command.filename = filename;
      this.plannerPreview = formatCommandPreview(command);
      this.processingPhase = `tool`;
      this.processingStage = `模型已交出工具參數；本機 artifacts() 準備更新 ${filename}。`;
      await wait(1400);
      this.processingStage = `本機 artifacts() 正在把修改寫回 ${filename}。`;
      const output = await this.appendAndExecuteToolCall({
        command,
        text: `我會更新同一份產物 \`${filename}\`，而不是建立新檔。下面是模型規劃出的 artifacts 工具呼叫。`,
        toolCallPrefix: `artifact-update`,
      });
      await wait(900);
      let finalOutput = output;
      if (output.startsWith(`Error:`) || output.includes(`String not found in file`)) {
        this.processingPhase = `recovering`;
        this.processingStage = `update 找不到逐字相同的 old_str，改用 rewrite 保留原檔再附加新段落。`;
        await wait(1400);
        const recoveredContent = `${artifact.content.trimEnd()}

## 課堂驗收

- 檢查這份產物是否符合任務要求。
- 確認內容是否能正常預覽。
- 若有不確定或高風險內容，請進行人工確認。
`;
        finalOutput = await this.appendAndExecuteToolCall({
          command: { command: `rewrite`, filename, content: recoveredContent },
          text: `剛剛的 update 失敗，因為 old_str 必須和檔案內容逐字相同。這次改用 rewrite 更新同一份檔案，保留原文並附加「課堂驗收」。`,
          toolCallPrefix: `artifact-recover`,
        });
        await wait(900);
      }
      this.hasArtifacts = true;
      this.showArtifacts = true;
      this.artifactCount = this.artifactsPanel.artifacts.size;
      this.lastObservation = finalOutput.startsWith(`Error:`)
        ? `修改失敗：工具拒絕了模型的參數。這也是本頁要看的風險。`
        : `修改完成。產物數量仍是 ${this.artifactCount}，代表這次重點是更新同一份檔案。`;
      this.processingPhase = `done`;
      this.processingStage = finalOutput.startsWith(`Error:`)
        ? `工具回報失敗，請看聊天區錯誤訊息。`
        : `同一份產物已更新，請檢查右側內容是否真的改了。`;
      this.stopProcessClock();
    } catch (error) {
      const message = artifactFailureMessage(`修改`, error);
      this.session.appendMessage({
        role: `assistant`,
        content: [{ type: `text`, text: message }],
        timestamp: Date.now(),
      });
      this.lastObservation = message;
      this.processingPhase = ``;
      this.processingStage = ``;
      this.stopProcessClock();
    } finally {
      this.isPlanning = false;
      this.plannerPreview = ``;
    }
  }

  async planArtifactCommand(plannerPrompt, startedAt) {
    const authToken = await getAuthToken();
    if (!authToken) throw new Error(`ChatGPT 尚未連線`);
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 90000);
    const context = {
      systemPrompt: `你是 artifacts 工具指令規劃器。只輸出有效 JSON。`,
      messages: [{ role: `user`, content: [{ type: `text`, text: plannerPrompt }] }],
    };
    let plannerText = ``;
    try {
      for await (const event of streamSimpleProxy(this.session.state.model, context, {
        authToken,
        maxTokens: 2200,
        signal: controller.signal,
      })) {
        if (event.type === `text_delta`) {
          plannerText += event.delta;
          this.plannerPreview = trimPlannerPreview(plannerText);
        }
        if (event.type === `done`) {
          plannerText =
            event.message.content
              .filter((part) => part.type === `text`)
              .map((part) => part.text)
              .join(`\n`) || plannerText;
          this.plannerPreview = trimPlannerPreview(plannerText);
        }
        if (event.type === `error`) throw new Error(event.error?.errorMessage || `Planner failed`);
      }
    } catch (error) {
      if (controller.signal.aborted) throw new Error(`模型規劃超過 90 秒，已停止這次操作`);
      throw error;
    } finally {
      clearTimeout(timeout);
    }
    this.debugLog = [
      ...this.debugLog,
      {
        timestamp: new Date().toISOString(),
        totalTime: performance.now() - startedAt,
        request: {
          provider: this.session.state.model.provider,
          model: this.session.state.model.id,
          context: {
            systemPrompt: context.systemPrompt,
            messages: context.messages,
          },
        },
        response: { role: `assistant`, content: plannerText },
      },
    ];
    return extractJsonObject(plannerText);
  }

  handleSessionState(state) {
    if (state.isStreaming) {
      if (!this.isPlanning) {
        this.processingPhase = `streaming`;
        this.processingStage = `模型正在處理你的修改需求；如果需要改檔，下一步會呼叫 artifacts()。`;
      }
      if (!this.streamTimeoutId) {
        this.streamTimeoutId = setTimeout(() => {
          if (!this.session.state.isStreaming) return;
          this.session.abort();
          this.processingPhase = ``;
          this.processingStage = ``;
          this.lastObservation = `模型處理超過 60 秒，已停止這次回合。請把修改需求拆成單一步驟，或使用左側「修改目前產物」。`;
          setTimeout(() => {
            if (this.session.state.isStreaming) return;
            this.session.appendMessage({
              role: `assistant`,
              content: [
                {
                  type: `text`,
                  text: `這次 artifact 修改花太久，已自動停止。建議一次只改一件事，例如「只把開場改得更口語」或「只新增課堂驗收」。`,
                },
              ],
              timestamp: Date.now(),
            });
          }, 250);
        }, 60000);
      }
    } else {
      if (this.streamTimeoutId) clearTimeout(this.streamTimeoutId);
      this.streamTimeoutId = null;
      if (!this.isPlanning && this.processingPhase === `streaming`) {
        this.processingPhase = ``;
        this.processingStage = ``;
      }
      this.recoverFailedUpdateIfPossible(state.messages);
    }
  }

  async recoverFailedUpdateIfPossible(messages) {
    const failed = [...messages]
      .reverse()
      .find(
        (message) =>
          message.role === `toolResult` &&
          message.toolName === `artifacts` &&
          message.isError &&
          !this.recoveredToolResults.has(message.toolCallId) &&
          String(message.output || ``).includes(`String not found in file`),
      );
    if (!failed) return;
    const toolCall = messages
      .flatMap((message) => (message.role === `assistant` ? message.content || [] : []))
      .find(
        (part) =>
          part.type === `toolCall` && part.id === failed.toolCallId && part.name === `artifacts`,
      );
    if (
      !toolCall ||
      toolCall.arguments?.command !== `update` ||
      !toolCall.arguments?.filename ||
      toolCall.arguments?.new_str === void 0
    )
      return;
    this.recoveredToolResults.add(failed.toolCallId);
    const filename = toolCall.arguments.filename;
    this.processingPhase = `recovering`;
    this.processingStage = `工具回報 old_str 不吻合，正在用 rewrite 修復 ${filename}。`;
    this.lastObservation = `update 找不到完全相同的舊字串，改用 rewrite 修復同一份檔案。`;
    const output = await this.appendAndExecuteToolCall({
      command: {
        command: `rewrite`,
        filename,
        content: toolCall.arguments.new_str,
      },
      text: `剛剛的 update 失敗，因為 old_str 必須和檔案內容逐字相同。這次改用 rewrite，把模型想要的新內容寫回同一份檔案。`,
      toolCallPrefix: `artifact-auto-recover`,
    });
    this.hasArtifacts = this.artifactsPanel.artifacts.size > 0;
    this.showArtifacts = this.hasArtifacts;
    this.artifactCount = this.artifactsPanel.artifacts.size;
    this.lastObservation = output.startsWith(`Error:`)
      ? `自動修復失敗：${output.replace(/^Error:\s*/, ``)}`
      : `已用 rewrite 修復。產物數量仍是 ${this.artifactCount}，同一份檔案已更新。`;
    this.processingPhase = ``;
    this.processingStage = ``;
  }

  async appendAndExecuteToolCall({ command, text, toolCallPrefix }) {
    const toolCallId = `${toolCallPrefix}-${Date.now()}`;
    this.session.appendMessage({
      role: `assistant`,
      content: [
        { type: `text`, text },
        {
          type: `toolCall`,
          id: toolCallId,
          name: `artifacts`,
          arguments: command,
        },
      ],
      api: this.session.state.model.api,
      provider: this.session.state.model.provider,
      model: this.session.state.model.id,
      usage: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
      },
      stopReason: `stop`,
      timestamp: Date.now(),
    });
    const output = await this.artifactsPanel.executeCommand(command);
    this.session.appendMessage({
      role: `toolResult`,
      toolCallId,
      toolName: `artifacts`,
      output,
      details: {},
      isError: output.startsWith(`Error:`),
      timestamp: Date.now(),
    });
    return output;
  }

  renderContentPanel() {
    this.artifactsPanel.collapsed = false;
    this.artifactsPanel.overlay = false;
    const isMobile = window.innerWidth < 1024;
    let chatWidth = `100%`;
    let artifactWidth = `0%`;
    if (this.hasArtifacts) {
      if (isMobile) {
        chatWidth = this.showArtifacts ? `0%` : `100%`;
        artifactWidth = this.showArtifacts ? `100%` : `0%`;
      } else {
        chatWidth = this.showArtifacts ? `50%` : `100%`;
        artifactWidth = this.showArtifacts ? `50%` : `0%`;
      }
    }
    return x`
			<div class="relative w-full h-full overflow-hidden flex">
				<div class="h-full pb-2" style="width: ${chatWidth};">${this.agentInterface}</div>
				<div class="h-full" style="width: ${artifactWidth};">${this.artifactsPanel}</div>
				${
          this.hasArtifacts && !this.showArtifacts
            ? x`<button class="absolute top-4 left-1/2 -translate-x-1/2 z-30" @click=${() => (this.showArtifacts = true)} title=${i18n(`顯示產物`)}>
							${Badge(x`<span class="inline-flex items-center gap-1"><span>${i18n(`產物`)}</span></span>`)}
						</button>`
            : ``
        }
			</div>
		`;
  }

  renderLeftDemoPanel() {
    const isBusy = this.session.state.isStreaming || this.isPlanning;
    return x`
			<div class="h-full flex flex-col p-3 gap-3 overflow-hidden">
				<p class="text-sm text-muted-foreground flex-shrink-0">
					${i18n(`讓模型真的呼叫 artifacts 工具來建立或修改文件、程式碼、網頁。重點不是「模型會寫」，而是看清楚聊天、工具呼叫與產物面板如何接在一起。`)}
				</p>
				<div class="rounded-lg border border-border bg-card/40 p-3 text-sm flex-shrink-0">
					<div class="font-semibold text-foreground mb-2">${i18n(`artifacts() 工具合約`)}</div>
					<div class="space-y-1 text-muted-foreground">
						<div><span class="text-foreground">${i18n(`輸入：`)}</span> ${i18n(`command 與 filename，加上 content 或要替換的文字。`)}</div>
						<div><span class="text-foreground">${i18n(`輸出：`)}</span> ${i18n(`建立、更新、刪除或讀取一份產物後的結果。`)}</div>
						<div><span class="text-foreground">${i18n(`邊界：`)}</span> ${i18n(`工具只會照模型提供的參數改檔案；內容品質、HTML 能不能正常預覽，仍然需要人檢查。`)}</div>
					</div>
				</div>
				${
          this.hasArtifacts
            ? x`<button ?disabled=${isBusy} @click=${() => this.refineCurrentArtifact()} class="w-full text-left p-3 rounded-md border border-primary/40 bg-primary/10 hover:bg-primary/15 disabled:opacity-50 transition-colors flex-shrink-0">
							<div class="text-sm font-medium text-foreground">${i18n(`Modify current artifact`)}</div>
							<div class="text-xs text-muted-foreground mt-1">${i18n(`要求模型更新同一份檔案，而不是建立新檔。`)}</div>
						</button>`
            : ``
        }
				${
          this.lastObservation
            ? x`<div class="rounded-md border border-border bg-muted/30 px-3 py-2 text-xs text-muted-foreground flex-shrink-0">${this.lastObservation}</div>`
            : ``
        }
				${isBusy || this.processingPhase ? this.renderProcessingCard() : ``}
				<div class="space-y-2 flex-shrink-0">
					${this.examples.map(
            (example) => x`
							<button ?disabled=${isBusy} @click=${() => this.runExample(example)} class="w-full text-left p-3 rounded-md border ${this.selectedExample === example.id ? `border-primary/60 bg-primary/10` : `border-border`} hover:bg-muted/50 disabled:opacity-50 transition-colors">
						<div class="text-sm font-medium text-foreground">${example.title}${this.runningExample === example.id ? i18n(`（執行中）`) : ``}</div>
								<div class="text-xs text-muted-foreground mt-1">${example.description}</div>
							</button>
						`,
          )}
				</div>
				<div class="flex-1 overflow-hidden">
					<div class="h-full overflow-y-auto rounded-md border border-border bg-muted/20 p-3 text-xs text-muted-foreground">
						<div class="font-medium text-foreground mb-2">${i18n(`檢查重點`)}</div>
						<ol class="list-decimal pl-4 space-y-1">
							<li>${i18n(`先看聊天裡的工具卡：模型想建立、更新，還是重寫？`)}</li>
							<li>${i18n(`再看產物面板：內容是否真的改變？`)}</li>
							<li>${i18n(`最後檢查結果：能預覽、讀得懂，而且沒有覆寫錯檔案。`)}</li>
						</ol>
					</div>
				</div>
			</div>
		`;
  }

  renderRightDemoPanel() {
    return x`<div class="flex-1 p-6 overflow-y-auto min-h-0">
			<markdown-block .content=${this.sectionContent ?? ``} .escapeHtml=${false}></markdown-block>
		</div>`;
  }
};

__decorate([r()], ArtifactsToolDemo.prototype, `debugLog`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `hasArtifacts`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `showArtifacts`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `artifactCount`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `runningExample`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `selectedExample`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `lastObservation`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `isPlanning`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processingPhase`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processingStage`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `plannerPreview`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processStartedAt`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processFinishedAt`, void 0);
__decorate([r()], ArtifactsToolDemo.prototype, `processNow`, void 0);
ArtifactsToolDemo = __decorate([t$1(`artifacts-tool-demo`)], ArtifactsToolDemo);
document.body.innerHTML = `<artifacts-tool-demo></artifacts-tool-demo>`;
export { ArtifactsToolDemo };
