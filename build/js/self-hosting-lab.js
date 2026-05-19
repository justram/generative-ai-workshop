import { getCurrentLanguage, i18n } from "./ThemeToggle-zh-tw7.js?v=proper-i18n-1";

const SELF_HOSTING_LAB_EN = {
	"硬體採購前先估這三件事": "Estimate these three things before buying hardware",
	"這頁不是排行榜。先選一台常見機器，再調整模型、量化、上下文與同時使用人數，看「能放下」和「值得買」是不是同一件事。": "This page is not a ranking. Pick a common machine, then adjust model size, quantization, context, and concurrent users to see whether “it fits” and “it is worth buying” are the same thing.",
	"常見硬體選項": "Common hardware options",
	"約 US$5.5k-7.3k": "about US$5.5k-7.3k",
	"曾可選配到 US$14.1k": "previously configurable up to US$14.1k",
	"約 US$4.7k": "about US$4.7k",
	"約 US$2.3k-3.4k": "about US$2.3k-3.4k",
	"約 US$8k-10k+": "about US$8k-10k+",
	"M5 Max 可到 128GB unified memory；價格依螢幕尺寸、SSD 與客製化而變。": "M5 Max can be configured up to 128GB unified memory; price depends on display size, SSD, and configuration.",
	"把它當成特殊工作站，不是一般採購基準。": "Treat it as a special workstation, not a normal purchasing baseline.",
	"128GB coherent unified memory；定位接近個人 AI supercomputer。": "128GB coherent unified memory; positioned close to a personal AI supercomputer.",
	"許多機器可把部分記憶體切給 iGPU，常見說法是最高約 96GB VRAM 類配置。": "Many machines can reserve part of memory for the iGPU; a common claim is up to about a 96GB VRAM-like configuration.",
	"常被拿來和 RTX 5090 類消費卡比較；差價主要買 VRAM、ECC、驅動與保固。": "Often compared with RTX 5090-class consumer cards; the premium mostly buys VRAM, ECC, drivers, and warranty.",
	"粗估需求": "Estimated requirement",
	"可用空間": "Usable memory",
	"判斷": "Verdict",
	"模型權重 + 1 人上下文 + 執行餘裕": "Model weights + 1 user's context + runtime headroom",
	"模型權重": "Model weights",
	"上下文 / 每人": "Context / user",
	"使用者數": "User count",
	"執行餘裕": "Runtime headroom",
	"模型本體，MoE 也要放下全部專家權重。": "The model body. MoE still has to fit all expert weights.",
	"8k 對話或文件會保留的 KV cache。": "KV cache kept for an 8k conversation or document.",
	"1 個同時對話時，KV cache 會跟著放大。": "With 1 concurrent conversation, KV cache scales with it.",
	"框架、暫存、batch 與系統本身需要的空間。": "Space needed by the framework, temporary buffers, batching, and the OS itself.",
	"餘裕充足": "Plenty of headroom",
	"可以做較長上下文、較大 batch 或更多實驗，但仍要實測速度。": "Can support longer context, larger batches, or more experiments, but speed still needs testing.",
	"可以跑，餘裕有限": "Runs, but headroom is limited",
	"適合 demo 或單人測試；正式服務要降低上下文、縮小模型或減少併發。": "Fine for demos or solo testing; production service needs shorter context, a smaller model, or fewer concurrent users.",
	"會爆或嚴重換頁": "Will run out of memory or page badly",
	"這組設定不適合這台機器。先降量化、縮上下文、改小模型，或換雲端/API。": "This setup does not fit this machine. Lower precision, shorten context, use a smaller model, or switch to cloud/API.",
	"適合": "Good fit",
	"要小心": "Watch out",
	"帶著走的單人開發機。適合本機 demo、課堂、測小到中型模型，或把 GPT 工作流搬一部分到本機。": "Portable single-user development machine. Good for local demos, classrooms, small-to-mid model tests, or moving part of a GPT workflow locally.",
	"128GB 不是 128GB VRAM。系統、瀏覽器、IDE 和模型引擎都會吃 unified memory；長上下文或多人服務會很快卡住。": "128GB is not 128GB of VRAM. The OS, browser, IDE, and model runtime all consume unified memory; long context or multi-user service will get tight quickly.",
	"想在單機上放非常大的權重、長上下文或大批文件實驗。強項是容量與低功耗。": "Good for fitting very large weights, long context, or large document experiments on one machine. Its strength is capacity and low power.",
	"512GB 配置在 2026 年供貨很不穩，甚至曾從 Apple 官網選配項目消失。能放下不代表 tokens/sec 會像資料中心 GPU。": "The 512GB configuration has had unstable availability in 2026 and even disappeared from Apple configuration pages. Fitting the model does not mean data-center-GPU tokens/sec.",
	"想用 NVIDIA 軟體棧、測接近部署端的流程，並在桌上跑較大的模型原型。": "Good for using the NVIDIA software stack, testing deployment-like workflows, and prototyping larger local models on a desk.",
	"是 AI dev kit，不是萬能桌機。價格、供貨和 ARM/NVIDIA 軟體相容性都要先確認。": "It is an AI dev kit, not a universal desktop. Confirm price, availability, and ARM/NVIDIA software compatibility first.",
	"預算有限但想要 128GB 級共享記憶體的小型桌機。適合探索、教學和非 NVIDIA 路線。": "A small desktop path for limited budgets that still want 128GB-class shared memory. Good for exploration, teaching, and non-NVIDIA routes.",
	"ROCm / Vulkan / llama.cpp 支援要看工具；有些工作流仍然是 NVIDIA CUDA 最省事。": "ROCm / Vulkan / llama.cpp support depends on the tool; some workflows are still easiest on NVIDIA CUDA.",
	"需要 CUDA、生產級驅動、ECC VRAM、工作站穩定性與較高頻寬。適合正式 PoC 或小型服務。": "Good when you need CUDA, production drivers, ECC VRAM, workstation stability, and higher bandwidth. Suitable for formal PoCs or small services.",
	"這通常只是一張卡，還要主機板、電源、散熱、機殼與維運。買卡不等於買到服務。": "This is usually only a card; you still need motherboard, power, cooling, case, and operations. Buying a GPU is not buying a service.",
	"要跑的模型設定": "Model settings to test",
	"模型架構": "Model architecture",
	"Dense 看總參數；MoE 要分開看總權重與每 token 啟用參數。": "Dense models are judged by total parameters; MoE needs total weights and per-token active parameters separated.",
	"每個 token 都跑整個模型": "Every token runs through the whole model",
	"載入全部權重，但每個 token 只啟用一部分專家": "Loads all weights, but each token activates only some experts",
	"常見模型範例": "Common model examples",
	"點一個範例，看 dense 與 MoE 的記憶體取捨差在哪裡。": "Click a preset to see how dense and MoE memory tradeoffs differ.",
	"傳統小模型基準": "Traditional small-model baseline",
	"總參數 / 權重大小": "Total parameters / weight size",
	"模型大小": "Model size",
	"筆電實驗級": "Laptop experiment",
	"工作站級": "Workstation class",
	"伺服器級": "Server class",
	"資料中心級": "Data-center class",
	"總權重": "Total weights",
	"低啟用量": "Low activation",
	"中啟用量": "Medium activation",
	"MoE 可以每次只啟用部分專家，但整包權重仍然要放得下。": "MoE can activate only some experts per token, but the full weight package still has to fit.",
	"Dense 模型每個 token 幾乎都會用到整個模型。": "Dense models use almost the whole model for every token.",
	"小模型": "Small model",
	"大型權重": "Large weights",
	"每 token 啟用參數": "Active parameters per token",
	"這比較接近速度與單 token 計算量；但不代表總權重可以不用載入。": "This better approximates speed and per-token compute; it does not mean total weights need not be loaded.",
	"少量啟用": "Low activation",
	"大量啟用": "High activation",
	"量化位元": "Quantization bits",
	"量化不是連續旋鈕，而是常見格式選擇。越低越省記憶體，也越可能犧牲品質。": "Quantization is not a continuous knob; it is a format choice. Lower bits save memory and may sacrifice quality.",
	"極省，但品質風險最高": "Saves the most memory, with the highest quality risk",
	"極省記憶體": "Extreme memory saving",
	"省記憶體": "Memory saving",
	"折衷": "Compromise",
	"高精度": "High precision",
	"常見省記憶體選擇": "Common memory-saving choice",
	"品質與記憶體折衷": "Quality and memory compromise",
	"較完整，但最吃記憶體": "More complete, but uses the most memory",
	"上下文長度": "Context length",
	"上下文越長，每個同時對話都會多吃一份 KV cache。正式服務時，這通常比 demo 更可怕。": "Longer context adds KV cache for every concurrent conversation. In real service, this is often scarier than in a demo.",
	"token 是模型切文字的單位。頁數只是粗估；PDF、表格、程式碼、OCR 都會吃不一樣多。": "A token is the unit the model uses to split text. Page counts are only rough estimates; PDFs, tables, code, and OCR all consume tokens differently.",
	"1M token 是百萬級上下文，適合展示「能塞很多」和「成本也很高」的取捨。它不是萬能記憶體；找重點仍需要結構化流程。": "A 1M-token context demonstrates the tradeoff between fitting a lot and paying a lot. It is not magic memory; finding the important parts still needs structure.",
	"短文件": "Short document",
	"中短文件": "Short-to-medium document",
	"中型文件": "Medium document",
	"長文件": "Long document",
	"超長文件": "Very long document",
	"大型資料包": "Large data bundle",
	"巨量資料包": "Huge data bundle",
	"百萬級上下文": "Million-token context",
	"幾頁 PDF、幾篇新聞、短問答、單頁 OCR、單一程式片段": "A few PDF pages, a few news articles, a short Q&A, one OCR page, or one code snippet",
	"短報告、一章教材、幾頁合約或講義、小功能相關檔案": "A short report, one textbook chapter, a few contract or handout pages, or files for a small feature",
	"完整報告節選、幾章教材、多頁表格 OCR、小模組上下文": "Report excerpts, several textbook chapters, multi-page table OCR, or a small module context",
	"長報告、多文件節選、論文草稿與參考段落、跨檔案除錯": "Long reports, multi-document excerpts, paper drafts with references, and cross-file debugging",
	"短書章節、大型規格書、大量 OCR 文字、中型專案局部上下文": "Short book chapters, large specs, lots of OCR text, or partial context for a medium project",
	"一本短書、厚規格書、大量 OCR 結果、中型專案較大上下文": "A short book, thick spec, lots of OCR output, or larger context for a medium project",
	"多份長文件、長書稿參考材料、較大專案多模組上下文": "Multiple long documents, long-manuscript reference material, or multi-module context for a larger project",
	"大量文件或程式資料；能放很多，但更需要摘要、索引與驗證": "Lots of documents or code; it fits a lot, but needs summarization, indexing, and verification even more",
	"這不是固定頁數換算。PDF 排版、表格、程式碼、OCR 錯字與圖片說明都會改變實際 token 數。": "This is not a fixed page-count conversion. PDF layout, tables, code, OCR errors, and image captions all change the real token count.",
	"長報告加多份附件": "A long report plus several attachments",
	"短書章節或長篇草稿": "Short book chapters or a long draft",
	"大量掃描頁面節選": "Large scanned-page excerpts",
	"中型專案的局部上下文": "Partial context from a medium project",
	"大型規格書與附件": "A large spec and attachments",
	"短書或長篇報告草稿": "A short book or long report draft",
	"大量頁面抽取後的文字": "Text extracted from many pages",
	"中型專案的一大段上下文": "A large slice of a medium project",
	"多份長文件與附件": "Multiple long documents and attachments",
	"長書稿節選與參考材料": "Long-manuscript excerpts and references",
	"大量掃描文件抽取結果": "Extracted text from many scanned documents",
	"較大專案的多模組上下文": "Multi-module context from a larger project",
	"多本手冊或大量附件": "Multiple manuals or many attachments",
	"長篇書稿與大量參考": "A long manuscript and many references",
	"超大量文件抽取結果": "Very large document-extraction output",
	"大型專案的一部分，但仍不是整個世界": "Part of a large project, but still not the whole world",
	"同時使用人數": "Concurrent users",
	"不是帳號總數，而是同一時間真的在推論的對話數。多人使用會放大 KV cache 與延遲。": "Not total accounts; this is the number of conversations actually running inference at the same time. More users amplify KV cache and latency.",
	"單人 demo": "Solo demo",
	"小型服務": "Small service",
	"採購時不要只看容量": "Do not buy by capacity alone",
	"容量決定能不能放下": "Capacity decides whether it fits",
	"模型權重、上下文、多人使用都會吃記憶體。能放下只是第一關。": "Model weights, context, and multiple users all consume memory. Fitting is only the first gate.",
	"頻寬與軟體決定跑得順不順": "Bandwidth and software decide whether it runs smoothly",
	"CUDA、Metal、ROCm、MLX、llama.cpp、vLLM 支援不同。工具鏈不順，硬體規格再漂亮也會卡。": "CUDA, Metal, ROCm, MLX, llama.cpp, and vLLM differ in support. If the toolchain is rough, nice hardware specs still get stuck.",
	"價格不是總成本": "Price is not total cost",
	"工作站還要算電力、散熱、保固、備援、監控、更新與誰負責排錯。": "Workstations also need power, cooling, warranty, backup, monitoring, updates, and someone responsible for debugging.",
	"價格為 2026-05 公開美國零售或媒體整理的近似值，實際會因地區、供貨、SSD、稅金與教育/企業方案改變。": "Prices are approximate public US retail or media-reported figures as of 2026-05. Actual prices vary by region, availability, SSD, tax, and education/enterprise programs."
	,"自架適合度": "Self-hosting fit",
	"一次能放進模型的資料量": "How much material fits in one context",
	"資料": "Data",
	"用量": "Usage",
	"維運": "Operations",
	"品質": "Quality",
	"公開資料": "Public data",
	"一般內部文件": "Ordinary internal documents",
	"客戶或營運資料": "Customer or operations data",
	"機密資料": "Confidential data",
	"不能離開組織": "Cannot leave the organization",
	"沒有人維護": "No maintainer",
	"有人會跑工具": "Someone can run tools",
	"有工程支援": "Engineering support",
	"有平台經驗": "Platform experience",
	"有維運流程": "Operations process",
	"能用就好": "Good enough",
	"可人工修正": "Human can correct",
	"多數情境要穩": "Stable in most cases",
	"要接近 GPT": "Close to GPT",
	"錯不起": "Cannot afford mistakes",
	"越不能外流，越有本機或私有部署的理由。": "The less data can leave, the stronger the case for local or private deployment.",
	"資料限制不高時，先用 API 會比較快。": "When data restrictions are low, starting with an API is usually faster.",
	"固定且大量的工作，才比較可能攤平自架成本。": "Fixed, high-volume work is where self-hosting cost is more likely to amortize.",
	"用量還小時，硬體與維運通常比 token 帳單更貴。": "When usage is still small, hardware and operations usually cost more than the token bill.",
	"有人能更新、監控與排錯，自架才不會卡在第一週。": "Self-hosting only survives week one when someone can update, monitor, and debug it.",
	"維運能力不足時，模型能跑不代表服務能穩定交付。": "If operations capability is weak, a model that runs is not the same as a service that ships reliably.",
	"品質門檻越高，越要保留 GPT/API 作為基準或備援。": "The higher the quality bar, the more you should keep GPT/API as a baseline or fallback.",
	"品質需求較鬆時，可以先用小模型驗證流程。": "When quality requirements are looser, use a small model first to validate the workflow.",
	"分項記憶體用量": "Memory usage by component",
	"模型本體。模型越大、量化位元越高，這塊越大。": "The model itself. Larger models and higher quantization bits make this part bigger.",
	"各列顯示自己的變化幅度": "Each row shows its own change scale.",
	"估算結果": "Estimate",
	"粗估，實際依引擎與硬體而變": "Rough estimate; actual numbers vary by engine and hardware.",
	"總記憶體預算": "Total memory budget",
	"上下文越長仍會吃記憶體；MoE 的啟用參數不會讓 KV cache 消失。": "Longer context still consumes memory; MoE active parameters do not make KV cache disappear.",
	"上下文越長，推論時保留的中間狀態越多。": "The longer the context, the more intermediate state must be kept during inference.",
	"框架、暫存、batch 與系統本身都需要額外空間。": "Frameworks, temporary buffers, batching, and the OS itself all need extra space.",
	"怎麼判斷模型大小": "How to judge model size",
	"7B～14B": "7B-14B",
	"30B～32B": "30B-32B",
	"適合課堂、摘要、分類、簡單客服；容易在筆電上跑。": "Good for class demos, summarization, classification, and simple support; easy to run on a laptop.",
	"品質明顯提升，但硬體門檻上來；適合小團隊 PoC。": "Quality improves noticeably, but hardware requirements rise; good for small-team PoCs.",
	"不是不能跑，而是要開始像營運服務一樣管理成本與併發。": "It is not impossible to run, but you must manage cost and concurrency like an operational service.",
	"不要只看「能不能跑」。真正要確認的是：回應速度是否可接受、上下文是否夠用、答案品質是否能通過你的任務測試。": "Do not only ask whether it runs. Check response speed, context adequacy, and whether answer quality passes your task tests.",
	"偶爾": "Occasional",
	"固定大量": "Fixed high volume",
	"可外部處理": "Can use external services",
	"不能外流": "Cannot leave",
	"沒人維護": "No maintainer",
	"有流程": "Has process",
	"可人工修": "Human can correct",
	"可以認真評估自架": "Self-hosting is worth serious evaluation",
	"你已經有明確的資料、用量或控制需求。下一步不是先買 GPU，而是用一個小任務做可驗證的 PoC。": "You already have a clear data, volume, or control need. The next step is not buying a GPU first; it is a verifiable PoC on one small task.",
	"先做混合架構": "Start with a hybrid architecture",
	"把資料敏感或固定重複的工作放本機；高難度推理、低頻任務仍用 GPT/API 當基準。": "Move sensitive-data or fixed repetitive work locally; keep hard reasoning and low-frequency tasks on GPT/API as the baseline.",
	"先用 API 驗證需求": "Validate the need with an API first",
	"目前自架很容易變成維運負擔。先把任務、成本、速度和品質基準跑清楚。": "Right now, self-hosting can easily become an operations burden. First clarify the task, cost, speed, and quality baseline.",
	"自架適不適合你？": "Is self-hosting a fit for you?",
	"自架不是把 ChatGPT 搬回家。這裡先用四個條件判斷：資料能不能出去、用量夠不夠固定、誰能維護、品質門檻有多高。": "Self-hosting is not bringing ChatGPT home. Start with four questions: can the data leave, is usage fixed enough, who maintains it, and how high is the quality bar?",
	"你的情境": "Your situation",
	"每天大概會問幾次": "Roughly how many requests per day",
	"不用精準，重點是看它是偶爾使用，還是固定大量工作。": "It does not need to be precise; the point is whether usage is occasional or fixed high-volume work.",
	"資料能不能丟到外部服務": "Can the data go to an external service?",
	"公開資料、內部文件、客戶資料與機密資料，部署選擇會完全不同。": "Public data, internal documents, customer data, and confidential data lead to very different deployment choices.",
	"誰可以維護這套東西": "Who can maintain this system?",
	"自架之後，更新、監控、權限、安全與故障排除都要有人負責。": "After self-hosting, someone owns updates, monitoring, permissions, security, and incident response.",
	"答案品質需要多接近 GPT": "How close must answer quality be to GPT?",
	"品質門檻越高，越不能只看模型能不能啟動，要拿真實任務測。": "The higher the quality bar, the less you can rely on “it starts”; you need real task tests.",
	"目前判斷": "Current read",
	"這頁要帶走的判斷": "What to take away",
	"不是免費版 ChatGPT": "It is not free ChatGPT",
	"自架是把 token 帳單換成硬體、維運、更新、安全與品質風險。": "Self-hosting trades the token bill for hardware, operations, updates, security, and quality risk.",
	"先找穩定任務": "Find a stable task first",
	"先用 API 跑出穩定需求，再決定哪些固定工作值得搬到本機或私有雲。": "Use an API to prove stable demand first, then decide which fixed tasks are worth moving to local or private cloud.",
	"失敗時誰負責": "Who owns failures?",
	"不要只問能不能跑，也要問誰維護、怎麼更新、如何監控、答案錯了誰處理。": "Do not only ask whether it runs; ask who maintains it, how it updates, how it is monitored, and who handles wrong answers.",
	"實作示範路線": "Hands-on demo path",
	"起手式": "Starter command",
	"模型：要跑多大、需要多少記憶體": "Models: size, architecture, and memory budget",
	"軟體堆疊：模型之外還需要什麼": "Software stack: what else you need beyond the model",
	"軟體堆疊不是只有模型": "The software stack is not just the model",
	"模型只是權重檔。真正讓它能被使用的，是模型管理、推論引擎、API server、UI 與維運責任。": "A model is only a weight file. What makes it usable is model management, the inference engine, an API server, UI, and operational responsibility.",
	"選一種使用方式": "Choose a usage mode",
	"目前選擇": "Current choice",
	"適合情境": "Good fit",
	"每一層誰負責": "Who owns each layer",
	"實際流程": "Actual flow",
	"學習重點：不要只問「哪個工具能跑模型」。要問這個工具幫你包了哪些層，哪些層最後仍然要由你或團隊負責。": "Learning point: do not only ask which tool can run a model. Ask which layers the tool wraps for you, and which layers you or your team still own.",
	"個人本機服務": "Personal local service",
	"最快讓本機模型跑起來，通常同時處理下載、啟動與本機 API。": "The fastest way to get a local model running; usually handles download, startup, and a local API together.",
	"個人開發、課堂示範、小型 PoC": "Personal development, classroom demos, small PoCs",
	"選模型或貼模型名稱": "Choose a model or paste a model name",
	"Ollama 下載量化權重": "Ollama downloads quantized weights",
	"本機啟動推論服務": "Start a local inference service",
	"App 用 OpenAI-compatible API 連上去": "The app connects through an OpenAI-compatible API",
	"可用 Ollama CLI、第三方聊天 UI，或你自己的 app。": "Use the Ollama CLI, a third-party chat UI, or your own app.",
	"模型檔": "Model file",
	"Ollama 幫你管理模型名稱、下載與快取。": "Ollama manages model names, downloads, and cache for you.",
	"主要是個人機器上的版本、模型更新與記憶體限制。": "Mostly versioning, model updates, and memory limits on a personal machine.",
	"內建聊天介面，適合不用命令列也能試模型。": "Built-in chat UI, good for trying models without a command line.",
	"GUI 顯示模型與量化格式，降低下載門檻。": "The GUI shows models and quantization formats, lowering the download barrier.",
	"桌面 app 包好推論流程，適合單機互動。": "The desktop app wraps the inference flow, suitable for single-machine interaction.",
	"可開 OpenAI-compatible local server 給其他工具連。": "Can start an OpenAI-compatible local server for other tools to connect to.",
	"正式多人使用、權限、監控與併發不是它的主要強項。": "Production multi-user access, permissions, monitoring, and concurrency are not its main strengths.",
	"通常沒有給一般使用者的 UI，要由你的產品或內部工具提供。": "Usually no end-user UI; your product or internal tool must provide it.",
	"自行管理 Hugging Face 權重、量化格式與版本。": "Manage Hugging Face weights, quantization formats, and versions yourself.",
	"專注高吞吐與服務化，例如 batching、prefix cache、並行。": "Focused on high-throughput serving, such as batching, prefix cache, and parallelism.",
	"提供 OpenAI-compatible 或自家 API 給產品呼叫。": "Provides an OpenAI-compatible or custom API for the product to call.",
	"權限、監控、日誌、擴縮、失敗重啟與成本都要納入。": "Permissions, monitoring, logs, scaling, failure recovery, and cost must all be included.",
	"桌面 GUI": "Desktop GUI",
	"用圖形介面找模型、下載、聊天，也可以一鍵啟動本機 server。": "Use a graphical interface to find models, download them, chat, and start a local server with one click.",
	"非工程背景、模型試用、桌面 demo": "Non-engineering users, model trials, desktop demos",
	"用 GUI 搜尋或匯入模型": "Search or import models in the GUI",
	"下載合適的量化版本": "Download a suitable quantized version",
	"在內建聊天先試品質": "Try quality in the built-in chat first",
	"需要整合時啟動 local server": "Start a local server when integration is needed",
	"服務化推論": "Serving inference",
	"把模型當成服務部署，重點是吞吐、併發、batching、監控與權限。": "Deploy the model as a service, with focus on throughput, concurrency, batching, monitoring, and permissions.",
	"團隊服務、多人併發、正式環境": "Team services, concurrent users, production-like environments",
	"準備 GPU / 容器 / 權重": "Prepare GPU / container / weights",
	"啟動推論 server": "Start the inference server",
	"設定 batching、KV cache 與併發": "Configure batching, KV cache, and concurrency",
	"接上權限、監控、日誌與備援": "Connect permissions, monitoring, logs, and failover",
	"本機對話基準": "Local chat baseline",
	"產品串接測試": "Product integration test",
	"小型評測集": "Small evaluation set",
	"驗收清單": "Acceptance checklist",
	"這次要證明": "What this run should prove",
	"準備": "Prepare",
	"執行": "Run",
	"用 Ollama 或 LM Studio 開一個中小型模型，問同一組課堂題與工作題。": "Use Ollama or LM Studio to run a small-to-mid model, then ask the same classroom and work questions.",
	"紀錄": "Record",
	"留下延遲、記憶體、錯誤訊息與實際輸出，不只截一張成功畫面。": "Keep latency, memory, error messages, and actual outputs, not just a screenshot of success.",
	"HTTP 狀態與串流是否正常": "Whether HTTP status and streaming behave correctly",
	"模型名稱、錯誤訊息、timeout 是否可控": "Whether model names, error messages, and timeouts are controllable",
	"工具呼叫與 JSON 輸出是否和 GPT 行為相容": "Whether tool calls and JSON output are compatible with GPT behavior",
	"不要只看「有回應」": "Do not just check that it responds",
	"這頁不是在模擬模型輸出，而是整理你真的跑 Ollama、LM Studio 或本機 API 時要驗收的證據。成功畫面很便宜；可重複的證據比較有用。": "This page is not simulating model output; it organizes the evidence you should collect when really running Ollama, LM Studio, or a local API. A success screenshot is cheap; repeatable evidence is useful.",
	"1. 先跑對話": "1. First run chat",
	"證明模型能在本機推論。": "Prove the model can run inference locally.",
	"2. 再接產品": "2. Then connect the product",
	"證明 app 能呼叫本機服務。": "Prove the app can call the local service.",
	"3. 最後評測": "3. Finally evaluate",
	"證明品質符合你的任務。": "Prove quality fits your task."
};

class SelfHostingLab extends HTMLElement {
	t(text) {
		if (getCurrentLanguage() === "en") return SELF_HOSTING_LAB_EN[text] || i18n(text);
		return text;
	}

	localizeRenderedContent() {
		if (getCurrentLanguage() !== "en") return;
		const translate = value => {
			const trimmed = value.trim();
			if (!trimmed) return value;
			if (/^\d+ 人$/.test(trimmed)) {
				const count = Number(trimmed.replace(/\D/g, ""));
				return value.replace(trimmed, `${count} ${count === 1 ? "user" : "users"}`);
			}
			if (/^\d+ 次$/.test(trimmed)) return value.replace(trimmed, `${trimmed.replace(/\D/g, "")} times`);
			if (trimmed.startsWith("目前選到：")) {
				const selected = trimmed.replace("目前選到：", "");
				const translatedSelected = SELF_HOSTING_LAB_EN[selected] || i18n(selected);
				return value.replace(trimmed, `Selected: ${translatedSelected}`);
			}
			if (trimmed.includes(" · ")) {
				const translatedParts = trimmed.split(" · ").map(part => SELF_HOSTING_LAB_EN[part] || i18n(part));
				return value.replace(trimmed, translatedParts.join(" · "));
			}
			const translated = SELF_HOSTING_LAB_EN[trimmed] || i18n(trimmed);
			return translated === trimmed ? value : value.replace(trimmed, translated);
		};
		const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
		for (let node = walker.nextNode(); node; node = walker.nextNode()) node.nodeValue = translate(node.nodeValue);
		for (const element of this.querySelectorAll("[aria-label], [aria-valuetext], [title], [alt]")) {
			for (const attr of ["aria-label", "aria-valuetext", "title", "alt"]) {
				if (element.hasAttribute(attr)) element.setAttribute(attr, translate(element.getAttribute(attr)));
			}
		}
	}
	connectedCallback() {
		this.variant = this.getAttribute("variant") || "overview";
		this.state = {
			requests: 200,
			privacy: 2,
			tech: 1,
			quality: 2,
			architecture: "dense",
			params: 14,
			activeParams: 14,
			quant: 4,
			context: 8,
			users: 1,
			gpu: "m5max128",
			stack: "ollama",
			demo: "chat",
		};
		this.render();
	}

	setState(patch) {
		const next = { ...this.state, ...patch };
		if (next.architecture === "dense") {
			next.activeParams = next.params;
		} else {
			next.activeParams = Math.max(1, Math.min(next.activeParams, next.params));
		}
		this.state = next;
		this.render();
	}

	card(title, body) {
		return `<div class="rounded-lg border border-border bg-card p-4">${title ? `<div class="mb-3 text-sm font-bold text-foreground">${title}</div>` : ""}${body}</div>`;
	}

	range(key, label, min, max, step, suffix = "", help = "") {
		const value = this.state[key];
		return `
			<label class="block rounded-lg border border-border bg-muted/20 p-3">
				<div class="mb-2 flex items-center justify-between gap-3 text-sm">
					<span class="font-semibold text-foreground">${label}</span>
					<span class="font-mono text-xs text-muted-foreground">${value}${suffix}</span>
				</div>
				<input data-key="${key}" type="range" min="${min}" max="${max}" step="${step}" value="${value}" class="w-full" />
				${help ? `<div class="mt-2 text-[11px] leading-5 text-muted-foreground">${help}</div>` : ""}
			</label>
		`;
	}

	choice(key, options) {
		return `<div class="grid gap-2">${options
			.map(
				option => `
					<button data-key="${key}" data-value="${option.value}" class="rounded-lg border px-3 py-2 text-left transition-colors ${
						String(this.state[key]) === String(option.value)
							? "border-primary bg-primary/15 text-foreground"
							: "border-border bg-muted/20 text-muted-foreground hover:bg-accent/30"
					}">
						<div class="text-sm font-bold">${option.label}</div>
						<div class="mt-1 text-xs leading-5">${option.help}</div>
					</button>
				`,
			)
			.join("")}</div>`;
	}

	render() {
		const content = {
			overview: this.renderOverview(),
			models: this.renderModels(),
			stack: this.renderStack(),
			hardware: this.renderHardware(),
			demos: this.renderDemos(),
		}[this.variant] || this.renderOverview();
		this.innerHTML = `<div class="space-y-4">${content}</div>`;
		this.localizeRenderedContent();
		this.querySelectorAll("input[type='range']").forEach(input => {
			input.addEventListener("input", event => {
				this.setState({ [event.currentTarget.dataset.key]: Number(event.currentTarget.value) });
			});
		});
		this.querySelectorAll("button[data-key]").forEach(button => {
			button.addEventListener("click", event => {
				const value = event.currentTarget.dataset.numeric === "true" ? Number(event.currentTarget.dataset.value) : event.currentTarget.dataset.value;
				this.setState({ [event.currentTarget.dataset.key]: value });
			});
		});
		this.querySelectorAll("button[data-preset]").forEach(button => {
			button.addEventListener("click", event => {
				const presets = {
					dense14: { architecture: "dense", params: 14, activeParams: 14, context: 8, quant: 4 },
					qwen36: { architecture: "moe", params: 35, activeParams: 3, context: 256, quant: 4 },
					gemma4: { architecture: "moe", params: 26, activeParams: 4, context: 128, quant: 4 },
					deepseekv4: { architecture: "moe", params: 284, activeParams: 13, context: 1024, quant: 4 },
				};
				this.setState(presets[event.currentTarget.dataset.preset] || {});
			});
		});
	}

	overviewLabel(key) {
		const labels = {
			privacy: ["公開資料", "一般內部文件", "客戶或營運資料", "機密資料", "不能離開組織"],
			tech: ["沒有人維護", "有人會跑工具", "有工程支援", "有平台經驗", "有維運流程"],
			quality: ["能用就好", "可人工修正", "多數情境要穩", "要接近 GPT", "錯不起"],
		}[key];
		return labels ? labels[this.state[key]] : "";
	}

	overviewFactorRows(usageScore, score) {
		const rows = [
			["資料", this.overviewLabel("privacy"), this.state.privacy >= 3 ? "越不能外流，越有本機或私有部署的理由。" : "資料限制不高時，先用 API 會比較快。"],
			["用量", `${this.state.requests} 次 / 天`, usageScore >= 3 ? "固定且大量的工作，才比較可能攤平自架成本。" : "用量還小時，硬體與維運通常比 token 帳單更貴。"],
			["維運", this.overviewLabel("tech"), this.state.tech >= 3 ? "有人能更新、監控與排錯，自架才不會卡在第一週。" : "維運能力不足時，模型能跑不代表服務能穩定交付。"],
			["品質", this.overviewLabel("quality"), this.state.quality >= 3 ? "品質門檻越高，越要保留 GPT/API 作為基準或備援。" : "品質需求較鬆時，可以先用小模型驗證流程。"],
		];
		const meter = Math.max(0, Math.min(100, Math.round((score / 10) * 100)));
		return `
			<div class="native-overview-meter" aria-label="自架適合度">
				<div class="native-overview-meter-fill" style="width:${meter}%"></div>
			</div>
			<div class="mt-3 divide-y divide-border">
				${rows
					.map(
						([label, value, note]) => `
							<div class="native-overview-factor">
								<div class="text-xs font-semibold text-foreground">${label}</div>
								<div>
									<div class="text-sm font-semibold text-foreground">${value}</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${note}</div>
								</div>
							</div>
						`,
					)
					.join("")}
			</div>
		`;
	}

	overviewRange(key, label, min, max, step, suffix = "", help = "") {
		const value = this.state[key];
		const semantic = this.overviewLabel(key);
		const progress = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
		const valueLabel = semantic || `${value}${suffix}`;
		const scaleLabels = {
			requests: ["偶爾", "固定大量"],
			privacy: ["可外部處理", "不能外流"],
			tech: ["沒人維護", "有流程"],
			quality: ["可人工修", "錯不起"],
		}[key] || ["低", "高"];
		return `
			<label class="native-overview-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">${label}</div>
						${help ? `<div class="mt-1 text-xs leading-5 text-muted-foreground">${help}</div>` : ""}
					</div>
					<div class="native-overview-value">${valueLabel}</div>
				</div>
				<div>
					<input
						data-key="${key}"
						type="range"
						min="${min}"
						max="${max}"
						step="${step}"
						value="${value}"
						aria-label="${label}"
						aria-valuetext="${valueLabel}"
						class="native-overview-slider"
						style="--range-progress:${progress}%"
					/>
					<div class="native-overview-scale" aria-hidden="true">
						<span>${scaleLabels[0]}</span>
						<span>${scaleLabels[1]}</span>
					</div>
				</div>
			</label>
		`;
	}

	modelSettingLabel(key) {
		if (key === "params") {
			if (this.state.architecture === "moe") return "總權重";
			if (this.state.params <= 14) return "筆電實驗級";
			if (this.state.params <= 35) return "工作站級";
			if (this.state.params <= 80) return "伺服器級";
			return "資料中心級";
		}
		if (key === "activeParams") {
			if (this.effectiveActiveParams() <= 4) return "低啟用量";
			if (this.effectiveActiveParams() <= 14) return "中啟用量";
			return "伺服器級";
		}
		if (key === "quant") {
			return {
				2: "極省記憶體",
				4: "省記憶體",
				8: "折衷",
				16: "高精度",
			}[this.state.quant] || `${this.state.quant}-bit`;
		}
		if (key === "context") {
			return this.contextGuide().label;
		}
		return "";
	}

	modelSettingRange(key, label, min, max, step, valueText, help, scaleLabels) {
		const value = this.state[key];
		const progress = Math.max(0, Math.min(100, Math.round(((value - min) / (max - min)) * 100)));
		const semantic = this.modelSettingLabel(key);
		const valueLabel = semantic ? `${valueText} · ${semantic}` : valueText;
		return `
			<label class="native-setting-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">${label}</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">${help}</div>
					</div>
					<div class="native-setting-value">${valueLabel}</div>
				</div>
				<div>
					<input
						data-key="${key}"
						type="range"
						min="${min}"
						max="${max}"
						step="${step}"
						value="${value}"
						aria-label="${label}"
						aria-valuetext="${valueLabel}"
						class="native-setting-slider"
						style="--range-progress:${progress}%"
					/>
					<div class="native-setting-scale" aria-hidden="true">
						<span>${scaleLabels[0]}</span>
						<span>${scaleLabels[1]}</span>
					</div>
				</div>
			</label>
		`;
	}

	modelArchitectureChoices() {
		const options = [
			["dense", "Dense", "每個 token 都跑整個模型"],
			["moe", "MoE", "載入全部權重，但每個 token 只啟用一部分專家"],
		];
		return `
			<div class="native-setting-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">模型架構</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">Dense 看總參數；MoE 要分開看總權重與每 token 啟用參數。</div>
					</div>
					<div class="native-setting-value">${this.state.architecture === "moe" ? "MoE · sparse" : "Dense"}</div>
				</div>
				<div class="native-architecture-grid" role="group" aria-label="模型架構">
					${options
						.map(
							([value, title, note]) => `
								<button
									type="button"
									data-key="architecture"
									data-value="${value}"
									class="native-architecture-option ${this.state.architecture === value ? "is-active" : ""}"
									aria-pressed="${this.state.architecture === value ? "true" : "false"}"
								>
									<span class="native-architecture-title">${title}</span>
									<span class="native-architecture-note">${note}</span>
								</button>
							`,
						)
						.join("")}
				</div>
			</div>
		`;
	}

	modelPresets() {
		const presets = [
			{ id: "dense14", label: "Dense 14B", note: "傳統小模型基準", patch: { architecture: "dense", params: 14, activeParams: 14, context: 8, quant: 4 } },
			{ id: "qwen36", label: "Qwen3.6 35B-A3B", note: "35B total / 3B active / 256k native", patch: { architecture: "moe", params: 35, activeParams: 3, context: 256, quant: 4 } },
			{ id: "gemma4", label: "Gemma 4 26B-A4B", note: "26B total / 4B active / 128k", patch: { architecture: "moe", params: 26, activeParams: 4, context: 128, quant: 4 } },
			{ id: "deepseekv4", label: "DeepSeek V4 Flash", note: "284B total / 13B active / 1M", patch: { architecture: "moe", params: 284, activeParams: 13, context: 1024, quant: 4 } },
		];
		const active = presets.find(preset =>
			preset.patch.architecture === this.state.architecture &&
			preset.patch.params === this.state.params &&
			preset.patch.activeParams === this.state.activeParams &&
			preset.patch.context === this.state.context &&
			preset.patch.quant === this.state.quant
		)?.id;
		return `
			<div class="native-setting-control">
				<div>
					<div class="text-sm font-semibold text-foreground">常見模型範例</div>
					<div class="mt-1 text-xs leading-5 text-muted-foreground">點一個範例，看 dense 與 MoE 的記憶體取捨差在哪裡。</div>
				</div>
				<div class="native-preset-grid">
					${presets
						.map(
							preset => `
								<button
									type="button"
									data-preset="${preset.id}"
									class="native-preset-option ${active === preset.id ? "is-active" : ""}"
									aria-pressed="${active === preset.id ? "true" : "false"}"
								>
									<span class="native-preset-title">${preset.label}</span>
									<span class="native-preset-note">${preset.note}</span>
								</button>
							`,
						)
						.join("")}
				</div>
			</div>
		`;
	}

	modelQuantChoices() {
		const options = [
			[2, "2-bit", "極省，但品質風險最高"],
			[4, "4-bit", "常見省記憶體選擇"],
			[8, "8-bit", "品質與記憶體折衷"],
			[16, "16-bit", "較完整，但最吃記憶體"],
		];
		return `
			<div class="native-setting-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">量化位元</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">量化不是連續旋鈕，而是常見格式選擇。越低越省記憶體，也越可能犧牲品質。</div>
					</div>
					<div class="native-setting-value">${this.state.quant}-bit · ${this.modelSettingLabel("quant")}</div>
				</div>
				<div class="native-quant-grid" role="group" aria-label="量化位元">
					${options
						.map(
							([value, title, note]) => `
								<button
									type="button"
									data-key="quant"
									data-value="${value}"
									data-numeric="true"
									class="native-quant-option ${this.state.quant === value ? "is-active" : ""}"
									aria-pressed="${this.state.quant === value ? "true" : "false"}"
								>
									<span class="native-quant-title">${title}</span>
									<span class="native-quant-note">${note}</span>
								</button>
							`,
						)
						.join("")}
				</div>
			</div>
		`;
	}

	contextValueText() {
		return this.state.context >= 1024 ? "1M" : `${this.state.context}k`;
	}

	effectiveActiveParams() {
		return this.state.architecture === "moe" ? Math.min(this.state.activeParams, this.state.params) : this.state.params;
	}

	renderOverview() {
		const usageScore = Math.min(4, Math.round(this.state.requests / 250));
		const score = this.state.privacy * 2 + this.state.tech + usageScore - this.state.quality;
		const recommendation =
			score >= 6
				? ["可以認真評估自架", "你已經有明確的資料、用量或控制需求。下一步不是先買 GPU，而是用一個小任務做可驗證的 PoC。"]
				: score >= 3
					? ["先做混合架構", "把資料敏感或固定重複的工作放本機；高難度推理、低頻任務仍用 GPT/API 當基準。"]
					: ["先用 API 驗證需求", "目前自架很容易變成維運負擔。先把任務、成本、速度和品質基準跑清楚。"];
		return `
			${this.card(
				"自架適不適合你？",
				`<div class="mb-3 text-sm leading-6 text-muted-foreground">
					自架不是把 ChatGPT 搬回家。這裡先用四個條件判斷：資料能不能出去、用量夠不夠固定、誰能維護、品質門檻有多高。
				</div>
				<div class="native-overview-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">你的情境</div>
						${this.overviewRange("requests", "每天大概會問幾次", 0, 2000, 50, " 次", "不用精準，重點是看它是偶爾使用，還是固定大量工作。")}
						${this.overviewRange("privacy", "資料能不能丟到外部服務", 0, 4, 1, "", "公開資料、內部文件、客戶資料與機密資料，部署選擇會完全不同。")}
						${this.overviewRange("tech", "誰可以維護這套東西", 0, 4, 1, "", "自架之後，更新、監控、權限、安全與故障排除都要有人負責。")}
						${this.overviewRange("quality", "答案品質需要多接近 GPT", 0, 4, 1, "", "品質門檻越高，越不能只看模型能不能啟動，要拿真實任務測。")}
					</div>
					<div class="rounded-lg border border-border bg-background/60 p-4">
						<div class="text-xs font-semibold text-muted-foreground">目前判斷</div>
						<div class="mt-2 text-xl font-semibold tracking-normal text-foreground">${recommendation[0]}</div>
						<div class="mt-2 text-sm leading-6 text-muted-foreground">${recommendation[1]}</div>
						<div class="mt-4">
							${this.overviewFactorRows(usageScore, score)}
						</div>
					</div>
				</div>`,
			)}
			${this.card(
				"這頁要帶走的判斷",
				`<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">不是免費版 ChatGPT</div>
						<div class="leading-6 text-muted-foreground">自架是把 token 帳單換成硬體、維運、更新、安全與品質風險。</div>
					</div>
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">先找穩定任務</div>
						<div class="leading-6 text-muted-foreground">先用 API 跑出穩定需求，再決定哪些固定工作值得搬到本機或私有雲。</div>
					</div>
					<div class="native-decision-row px-3 py-3">
						<div class="font-semibold text-foreground">失敗時誰負責</div>
						<div class="leading-6 text-muted-foreground">不要只問能不能跑，也要問誰維護、怎麼更新、如何監控、答案錯了誰處理。</div>
					</div>
				</div>`,
			)}
		`;
	}

	modelMemoryGb() {
		return Math.ceil(this.modelMemoryBreakdown().total);
	}

	modelMemoryBreakdown() {
		const bytesPerParam = this.state.quant === 16 ? 2 : this.state.quant === 8 ? 1 : this.state.quant === 4 ? 0.55 : 0.3;
		const weights = this.state.params * bytesPerParam;
		const activeParams = this.effectiveActiveParams();
		const kvParamProxy = this.state.architecture === "moe" ? Math.max(activeParams, Math.min(this.state.params, 14)) : this.state.params;
		const kv = this.state.context * (kvParamProxy <= 14 ? 0.25 : kvParamProxy <= 35 ? 0.45 : 0.8);
		const runtime = (weights + kv) * 0.25;
		return {
			weights,
			kv,
			runtime,
			activeParams,
			total: weights + kv + runtime,
		};
	}

	contextGuide() {
		const k = this.state.context;
		if (k <= 8) {
			return {
				label: "短文件",
				plain: "大概像幾頁 PDF、幾篇新聞，或一小段程式碼。適合短問答、短翻譯、單頁 OCR。",
				tasks: [
					["QA", "一小份文件內找答案"],
					["翻譯／寫作", "短文或一小節手冊"],
					["OCR", "單頁表格或收據"],
					["Coding", "一個小檔案片段"],
				],
			};
		}
		if (k <= 16) {
			return {
				label: "中短文件",
				plain: "大概像一份短報告、一章教材，或幾個程式檔。適合摘要、比對、翻譯一段文件。",
				tasks: [
					["QA", "短報告或單章教材"],
					["翻譯／寫作", "幾頁合約、講義或草稿"],
					["OCR", "少量掃描頁面"],
					["Coding", "小功能的相關檔案"],
				],
			};
		}
		if (k <= 32) {
			return {
				label: "中型文件",
				plain: "大概像一份較完整的 PDF 節選、幾章教材，或一組相關程式檔。適合多段 QA、摘要與改寫。",
				tasks: [
					["QA", "一份中型報告"],
					["翻譯／寫作", "較長文件，但仍要分段檢查"],
					["OCR", "多頁表格與段落"],
					["Coding", "一個小模組上下文"],
				],
			};
		}
		if (k <= 64) {
			return {
				label: "長文件",
				plain: "大概像長報告、大量 OCR 文字，或多個程式檔。仍不等於整本書或整個專案；任務越複雜越需要分段。",
				tasks: [
					["QA", "長報告或多文件節選"],
					["翻譯／寫作", "論文草稿與參考段落"],
					["OCR", "多頁財報或表格"],
					["Coding", "跨檔案除錯與重構"],
				],
			};
		}
		if (k <= 128) {
			return {
				label: "超長文件",
				plain: "大概像短書、大型規格書、大量 OCR 結果，或較多程式檔。看似很大，但完整書籍、完整專案、長期對話仍可能超出範圍。",
				tasks: [
					["QA", "長報告加多份附件"],
					["翻譯／寫作", "短書章節或長篇草稿"],
					["OCR", "大量掃描頁面節選"],
					["Coding", "中型專案的局部上下文"],
				],
			};
		}
		if (k <= 256) {
			return {
				label: "大型資料包",
				plain: "大概像一本短書、厚規格書、較多掃描頁 OCR，或一個中型專案的局部資料。上下文變大，記憶體也會明顯增加。",
				tasks: [
					["QA", "大型規格書與附件"],
					["翻譯／寫作", "短書或長篇報告草稿"],
					["OCR", "大量頁面抽取後的文字"],
					["Coding", "中型專案的一大段上下文"],
				],
			};
		}
		if (k <= 512) {
			return {
				label: "巨量資料包",
				plain: "可以放進非常多文字，但不代表模型會自動理解全部重點。越大的上下文越需要分段、索引、摘要與驗證策略。",
				tasks: [
					["QA", "多份長文件與附件"],
					["翻譯／寫作", "長書稿節選與參考材料"],
					["OCR", "大量掃描文件抽取結果"],
					["Coding", "較大專案的多模組上下文"],
				],
			};
		}
		return {
			label: "百萬級上下文",
			plain: "1M token 是百萬級上下文，適合展示「能塞很多」和「成本也很高」的取捨。它不是萬能記憶體；找重點仍需要結構化流程。",
			tasks: [
				["QA", "多本手冊或大量附件"],
				["翻譯／寫作", "長篇書稿與大量參考"],
				["OCR", "超大量文件抽取結果"],
				["Coding", "大型專案的一部分，但仍不是整個世界"],
			],
		};
	}

	contextScaleRows() {
		return [
			["8k", "短文件", "幾頁 PDF、幾篇新聞、短問答、單頁 OCR、單一程式片段"],
			["16k", "中短文件", "短報告、一章教材、幾頁合約或講義、小功能相關檔案"],
			["32k", "中型文件", "完整報告節選、幾章教材、多頁表格 OCR、小模組上下文"],
			["64k", "長文件", "長報告、多文件節選、論文草稿與參考段落、跨檔案除錯"],
			["128k", "超長文件", "短書章節、大型規格書、大量 OCR 文字、中型專案局部上下文"],
			["256k", "大型資料包", "一本短書、厚規格書、大量 OCR 結果、中型專案較大上下文"],
			["512k", "巨量資料包", "多份長文件、長書稿參考材料、較大專案多模組上下文"],
			["1M", "百萬級上下文", "大量文件或程式資料；能放很多，但更需要摘要、索引與驗證"],
		];
	}

	renderContextScale() {
		const selected =
			this.state.context <= 8
				? "8k"
				: this.state.context <= 16
					? "16k"
					: this.state.context <= 32
						? "32k"
						: this.state.context <= 64
							? "64k"
							: this.state.context <= 128
								? "128k"
								: this.state.context <= 256
									? "256k"
									: this.state.context <= 512
										? "512k"
										: "1M";
		return `
			<div>
				<div class="mb-1.5 text-[11px] font-semibold text-muted-foreground">token 大概能放多少資料</div>
				<div class="native-context-scale">
					${this.contextScaleRows()
						.map(
							([tokens, label, examples]) => `
								<div class="native-context-scale-row ${tokens === selected ? "is-active" : ""}">
									<div class="font-mono text-xs font-semibold text-foreground">${tokens}</div>
									<div>
										<div class="text-xs font-semibold text-foreground">${label}</div>
										<div class="mt-0.5 text-[11px] leading-4 text-muted-foreground">${examples}</div>
									</div>
								</div>
							`,
						)
						.join("")}
				</div>
				<div class="mt-1.5 text-[11px] leading-4 text-muted-foreground">這不是固定頁數換算。PDF 排版、表格、程式碼、OCR 錯字與圖片說明都會改變實際 token 數。</div>
			</div>
		`;
	}

	renderContextGuide() {
		const guide = this.contextGuide();
		return `
			<div class="rounded-md border border-border bg-muted/20 p-3">
				<div class="flex items-center justify-between gap-3">
					<div class="text-xs font-semibold text-foreground">目前選到：${guide.label}</div>
					<div class="font-mono text-xs text-muted-foreground">${this.state.context}k tokens</div>
				</div>
				<div class="mt-1 text-xs leading-5 text-muted-foreground">${guide.plain}</div>
			</div>
		`;
	}

	renderContextTaskCards() {
		const guide = this.contextGuide();
		return `
			<div class="native-context-grid">
				${guide.tasks
					.map(
						([task, fit]) => `
							<div class="rounded-md bg-background/70 px-2 py-1.5">
								<div class="text-[11px] font-semibold text-foreground">${task}</div>
								<div class="mt-0.5 text-[11px] leading-4 text-muted-foreground">${fit}</div>
							</div>
						`,
					)
					.join("")}
			</div>
		`;
	}

	memoryComponentScales() {
		const maxWeights = 300 * 2;
		const maxKv = 1024 * 0.8;
		return {
			weights: maxWeights,
			kv: maxKv,
			runtime: (maxWeights + maxKv) * 0.25,
		};
	}

	renderMemorySegment(label, value, scale, className, note) {
		const width = Math.min(100, Math.max(3, Math.round((value / scale) * 100)));
		return `
			<div class="native-memory-row">
				<div class="text-xs font-semibold text-foreground">${label}</div>
				<div>
					<div class="h-2 overflow-hidden rounded-full bg-muted">
						<div class="native-memory-fill ${className}" style="width:${width}%"></div>
					</div>
					<div class="mt-1 text-[11px] leading-4 text-muted-foreground">${note}</div>
				</div>
				<div class="text-right font-mono text-xs text-muted-foreground">${value.toFixed(1)} GB</div>
			</div>
		`;
	}

	renderModels() {
		const parts = this.modelMemoryBreakdown();
		const memory = Math.ceil(parts.total);
		const scales = this.memoryComponentScales();
		const fit =
			memory <= 8
				? ["一般 16GB 筆電也可實驗", "這種設定適合課堂、小型摘要、分類或先測流程。"]
				: memory <= 16
					? ["16GB VRAM / 32GB unified memory 較舒服", "可以做比較像樣的本機 demo，但長上下文或多人使用會吃緊。"]
					: memory <= 24
						? ["需要 24GB 等級 GPU 或高記憶體 Mac", "這已經接近個人工作站等級；不要把它當成普通筆電情境。"]
						: ["建議雲端或伺服器 GPU", "這種設定不是不能跑，而是要開始考慮部署、併發、監控與成本。"];
		return `
			${this.card(
				"模型記憶體預算",
				`<div class="mb-3 text-sm leading-6 text-muted-foreground">
					調整左側設定，觀察右側記憶體預算怎麼變。Dense 看總參數；MoE 要同時看總權重、啟用參數與上下文。
				</div>
				<div class="native-model-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">模型設定</div>
						<div class="grid divide-y divide-border">
							${this.modelArchitectureChoices()}
							${this.modelPresets()}
							${this.modelSettingRange("params", this.state.architecture === "moe" ? "總參數 / 權重大小" : "模型大小", 1, 300, 1, `${this.state.params}B`, this.state.architecture === "moe" ? "MoE 仍然要放得下全部專家權重；這影響下載大小、磁碟與常駐記憶體。" : "B 是 billion parameters。越大通常能力越強，也越吃記憶體。", ["小模型", "大型權重"])}
							${this.state.architecture === "moe" ? this.modelSettingRange("activeParams", "每 token 啟用參數", 1, Math.max(1, this.state.params), 1, `${this.effectiveActiveParams()}B`, "MoE 推論時每個 token 只跑部分專家；這比較接近單 token 計算量與速度感。", ["少量啟用", "大量啟用"]) : ""}
							${this.modelQuantChoices()}
							<div class="grid gap-2 px-3 py-3">
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-sm font-semibold text-foreground">一次能放進模型的資料量</div>
										<div class="mt-0.5 text-xs leading-5 text-muted-foreground">token 是模型切文字的單位。頁數只是粗估；PDF、表格、程式碼、OCR 都會吃不一樣多。</div>
									</div>
									<div class="native-setting-value">${this.contextValueText()} · ${this.contextGuide().label}</div>
								</div>
								<div>
									<input
										data-key="context"
										type="range"
										min="8"
										max="1024"
										step="8"
										value="${this.state.context}"
										aria-label="一次能放進模型的資料量"
										aria-valuetext="${this.contextValueText()} · ${this.contextGuide().label}"
										class="native-setting-slider"
										style="--range-progress:${Math.round(((this.state.context - 8) / 1016) * 100)}%"
									/>
									<div class="native-setting-scale" aria-hidden="true">
										<span>短文件</span>
										<span>1M</span>
									</div>
								</div>
								${this.renderContextScale()}
							</div>
						</div>
					</div>
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
							<div class="text-xs font-semibold text-muted-foreground">估算結果</div>
							<div class="text-xs text-muted-foreground">粗估，實際依引擎與硬體而變</div>
						</div>
						<div class="grid gap-4 p-3">
							<div>
								<div class="flex items-end justify-between gap-3">
									<div>
										<div class="text-xs text-muted-foreground">總記憶體預算</div>
										<div class="mt-1 text-3xl font-semibold tracking-normal text-foreground">${memory} GB</div>
										<div class="mt-1 text-xs leading-5 text-muted-foreground">${this.state.architecture === "moe" ? `MoE：${this.state.params}B 總權重，約 ${parts.activeParams}B 參數/每 token 啟用` : `Dense：${this.state.params}B 參數每 token 都會參與`}</div>
									</div>
									<div class="text-right">
										<div class="text-sm font-semibold text-foreground">${fit[0]}</div>
										<div class="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">${fit[1]}</div>
									</div>
								</div>
							</div>
							<div class="grid gap-3 border-t border-border pt-3">
								<div class="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
									<span>分項記憶體用量</span>
									<span>各列顯示自己的變化幅度</span>
								</div>
								${this.renderMemorySegment("模型權重", parts.weights, scales.weights, "native-memory-fill-weights", "模型本體。模型越大、量化位元越高，這塊越大。")}
								${this.renderMemorySegment("KV cache", parts.kv, scales.kv, "native-memory-fill-kv", this.state.architecture === "moe" ? "上下文越長仍會吃記憶體；MoE 的啟用參數不會讓 KV cache 消失。" : "上下文越長，推論時保留的中間狀態越多。")}
								${this.renderMemorySegment("執行餘裕", parts.runtime, scales.runtime, "native-memory-fill-runtime", "框架、暫存、batch 與系統本身都需要額外空間。")}
							</div>
						</div>
					</div>
				</div>`,
			)}
			${this.card(
				"怎麼判斷模型大小",
				`<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="grid gap-2 border-b border-border px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">7B～14B</div>
						<div class="leading-6 text-muted-foreground">適合課堂、摘要、分類、簡單客服；容易在筆電上跑。</div>
					</div>
					<div class="grid gap-2 border-b border-border px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">30B～32B</div>
						<div class="leading-6 text-muted-foreground">品質明顯提升，但硬體門檻上來；適合小團隊 PoC。</div>
					</div>
					<div class="grid gap-2 px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">70B+</div>
						<div class="leading-6 text-muted-foreground">不是不能跑，而是要開始像營運服務一樣管理成本與併發。</div>
					</div>
				</div>
				<div class="mt-3 text-xs leading-5 text-muted-foreground">
					不要只看「能不能跑」。真正要確認的是：回應速度是否可接受、上下文是否夠用、答案品質是否能通過你的任務測試。
				</div>`,
			)}
		`;
	}

	renderStack() {
		const stacks = {
			ollama: {
				label: "Ollama",
				value: "個人本機服務",
				help: "最快讓本機模型跑起來，通常同時處理下載、啟動與本機 API。",
				best: "個人開發、課堂示範、小型 PoC",
				flow: ["選模型或貼模型名稱", "Ollama 下載量化權重", "本機啟動推論服務", "App 用 OpenAI-compatible API 連上去"],
				layers: [
					["UI", "可用 Ollama CLI、第三方聊天 UI，或你自己的 app。", "可替換"],
					["模型檔", "Ollama 幫你管理模型名稱、下載與快取。", "內建"],
					["推論引擎", "本機 llama.cpp 系列路徑，適合單機與低併發。", "內建"],
					["API Server", "本機 HTTP API；很多 app 只要改 baseURL 就能接。", "內建"],
					["維運", "主要是個人機器上的版本、模型更新與記憶體限制。", "你負責"],
				],
			},
			lmstudio: {
				label: "LM Studio",
				value: "桌面 GUI",
				help: "用圖形介面找模型、下載、聊天，也可以一鍵啟動本機 server。",
				best: "非工程背景、模型試用、桌面 demo",
				flow: ["用 GUI 搜尋或匯入模型", "下載合適的量化版本", "在內建聊天先試品質", "需要整合時啟動 local server"],
				layers: [
					["UI", "內建聊天介面，適合不用命令列也能試模型。", "內建"],
					["模型檔", "GUI 顯示模型與量化格式，降低下載門檻。", "內建"],
					["推論引擎", "桌面 app 包好推論流程，適合單機互動。", "內建"],
					["API Server", "可開 OpenAI-compatible local server 給其他工具連。", "可開啟"],
					["維運", "正式多人使用、權限、監控與併發不是它的主要強項。", "有限"],
				],
			},
			vllm: {
				label: "vLLM / SGLang",
				value: "服務化推論",
				help: "把模型當成服務部署，重點是吞吐、併發、batching、監控與權限。",
				best: "團隊服務、多人併發、正式環境",
				flow: ["準備 GPU / 容器 / 權重", "啟動推論 server", "設定 batching、KV cache 與併發", "接上權限、監控、日誌與備援"],
				layers: [
					["UI", "通常沒有給一般使用者的 UI，要由你的產品或內部工具提供。", "你負責"],
					["模型檔", "自行管理 Hugging Face 權重、量化格式與版本。", "你負責"],
					["推論引擎", "專注高吞吐與服務化，例如 batching、prefix cache、並行。", "核心"],
					["API Server", "提供 OpenAI-compatible 或自家 API 給產品呼叫。", "核心"],
					["維運", "權限、監控、日誌、擴縮、失敗重啟與成本都要納入。", "你負責"],
				],
			},
		};
		const current = stacks[this.state.stack];
		return `
			${this.card(
				"軟體堆疊不是只有模型",
				`<div class="mb-3 text-sm leading-6 text-muted-foreground">
					模型只是權重檔。真正讓它能被使用的，是模型管理、推論引擎、API server、UI 與維運責任。
				</div>
				<div class="native-stack-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">選一種使用方式</div>
						<div class="native-stack-option-grid p-3">
							${Object.entries(stacks)
								.map(
									([value, stack]) => `
										<button
											type="button"
											data-key="stack"
											data-value="${value}"
											class="native-stack-option ${this.state.stack === value ? "is-active" : ""}"
											aria-pressed="${this.state.stack === value ? "true" : "false"}"
										>
											<span class="native-preset-title">${stack.label}</span>
											<span class="native-preset-note">${stack.help}</span>
										</button>
									`,
								)
								.join("")}
						</div>
					</div>
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">目前選擇</div>
								<div class="mt-1 text-lg font-semibold tracking-normal text-foreground">${current.label}</div>
							</div>
							<div class="native-setting-value">${current.value}</div>
						</div>
						<div class="grid gap-4 p-3">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">適合情境</div>
								<div class="mt-1 text-sm leading-6 text-foreground">${current.best}</div>
							</div>
							<div class="border-t border-border pt-3">
								<div class="mb-2 text-xs font-semibold text-muted-foreground">每一層誰負責</div>
								<div>
									${current.layers
										.map(
											([layer, note, owner]) => `
												<div class="native-stack-layer">
													<div class="text-xs font-semibold text-foreground">${layer}</div>
													<div class="text-xs leading-5 text-muted-foreground">${note}</div>
													<div><span class="native-stack-badge">${owner}</span></div>
												</div>
											`,
										)
										.join("")}
								</div>
							</div>
							<div class="border-t border-border pt-3">
								<div class="mb-2 text-xs font-semibold text-muted-foreground">實際流程</div>
								<div class="native-stack-flow">
									${current.flow
										.map(
											(step, index) => `
												<div class="grid grid-cols-[1.75rem_1fr] items-start gap-2 rounded-md bg-muted/20 px-2 py-2 text-xs">
													<span class="grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-semibold text-muted-foreground">${index + 1}</span>
													<span class="leading-5 text-foreground">${step}</span>
												</div>
											`,
										)
										.join("")}
								</div>
							</div>
							<div class="rounded-md border border-border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
								學習重點：不要只問「哪個工具能跑模型」。要問這個工具幫你包了哪些層，哪些層最後仍然要由你或團隊負責。
							</div>
						</div>
					</div>
				</div>`,
			)}
		`;
	}

	renderHardware() {
		const options = {
			m5max128: {
				label: "MacBook Pro M5 Max",
				short: "Apple Silicon 128GB",
				price: "約 US$5.5k-7.3k",
				memory: 128,
				usable: 96,
				type: "unified memory",
				best: "帶著走的單人開發機。適合本機 demo、課堂、測小到中型模型，或把 GPT 工作流搬一部分到本機。",
				watch: "128GB 不是 128GB VRAM。系統、瀏覽器、IDE 和模型引擎都會吃 unified memory；長上下文或多人服務會很快卡住。",
				note: "M5 Max 可到 128GB unified memory；價格依螢幕尺寸、SSD 與客製化而變。",
			},
			studio512: {
				label: "Mac Studio M3 Ultra",
				short: "512GB unified",
				price: "曾可選配到 US$14.1k",
				memory: 512,
				usable: 430,
				type: "unified memory",
				best: "想在單機上放非常大的權重、長上下文或大批文件實驗。強項是容量與低功耗。",
				watch: "512GB 配置在 2026 年供貨很不穩，甚至曾從 Apple 官網選配項目消失。能放下不代表 tokens/sec 會像資料中心 GPU。",
				note: "把它當成特殊工作站，不是一般採購基準。",
			},
			dgxSpark: {
				label: "NVIDIA DGX Spark",
				short: "GB10 128GB",
				price: "約 US$4.7k",
				memory: 128,
				usable: 108,
				type: "coherent unified memory",
				best: "想用 NVIDIA 軟體棧、測接近部署端的流程，並在桌上跑較大的模型原型。",
				watch: "是 AI dev kit，不是萬能桌機。價格、供貨和 ARM/NVIDIA 軟體相容性都要先確認。",
				note: "128GB coherent unified memory；定位接近個人 AI supercomputer。",
			},
			strixHalo: {
				label: "AMD Strix Halo",
				short: "Ryzen AI Max+ 395",
				price: "約 US$2.3k-3.4k",
				memory: 128,
				usable: 88,
				type: "shared LPDDR5X",
				best: "預算有限但想要 128GB 級共享記憶體的小型桌機。適合探索、教學和非 NVIDIA 路線。",
				watch: "ROCm / Vulkan / llama.cpp 支援要看工具；有些工作流仍然是 NVIDIA CUDA 最省事。",
				note: "許多機器可把部分記憶體切給 iGPU，常見說法是最高約 96GB VRAM 類配置。",
			},
			rtxPro6000: {
				label: "RTX PRO 6000 Blackwell",
				short: "96GB GDDR7 ECC",
				price: "約 US$8k-10k+",
				memory: 96,
				usable: 90,
				type: "dedicated VRAM",
				best: "需要 CUDA、生產級驅動、ECC VRAM、工作站穩定性與較高頻寬。適合正式 PoC 或小型服務。",
				watch: "這通常只是一張卡，還要主機板、電源、散熱、機殼與維運。買卡不等於買到服務。",
				note: "常被拿來和 RTX 5090 類消費卡比較；差價主要買 VRAM、ECC、驅動與保固。",
			},
		};
		const selected = options[this.state.gpu] || options.m5max128;
		const parts = this.modelMemoryBreakdown();
		const userCount = Math.max(1, this.state.users);
		const projected = Math.ceil(parts.weights + parts.kv * userCount + parts.runtime);
		const headroom = selected.usable - projected;
		const fit =
			headroom >= 32
				? ["餘裕充足", "可以做較長上下文、較大 batch 或更多實驗，但仍要實測速度。", "text-emerald-600"]
				: headroom >= 0
					? ["可以跑，餘裕有限", "適合 demo 或單人測試；正式服務要降低上下文、縮小模型或減少併發。", "text-amber-600"]
					: ["會爆或嚴重換頁", "這組設定不適合這台機器。先降量化、縮上下文、改小模型，或換雲端/API。", "text-red-600"];
		const memoryRows = [
			["模型權重", parts.weights, "模型本體，MoE 也要放下全部專家權重。"],
			["上下文 / 每人", parts.kv, `${this.contextValueText()} 對話或文件會保留的 KV cache。`],
			["使用者數", parts.kv * userCount, `${userCount} 個同時對話時，KV cache 會跟著放大。`],
			["執行餘裕", parts.runtime, "框架、暫存、batch 與系統本身需要的空間。"],
		];
		const maxBar = Math.max(selected.usable, projected, 1);
		return `
			${this.card(
				"硬體採購前先估這三件事",
				`<div class="mb-4 text-sm leading-6 text-muted-foreground">
					這頁不是排行榜。先選一台常見機器，再調整模型、量化、上下文與同時使用人數，看「能放下」和「值得買」是不是同一件事。
				</div>
				<div class="native-hardware-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">常見硬體選項</div>
						<div class="native-hardware-option-grid p-3">
							${Object.entries(options)
								.map(
									([value, option]) => `
										<button
											type="button"
											data-key="gpu"
											data-value="${value}"
											class="native-hardware-option ${this.state.gpu === value ? "is-active" : ""}"
											aria-pressed="${this.state.gpu === value ? "true" : "false"}"
										>
											<span class="native-hardware-option-title">${option.label}</span>
											<span class="native-hardware-option-meta">${option.short} · ${option.price}</span>
										</button>
									`,
								)
								.join("")}
						</div>
					</div>
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="grid divide-y divide-border">
							<div class="p-4">
								<div class="flex flex-wrap items-start justify-between gap-3">
									<div>
										<div class="text-lg font-semibold text-foreground">${selected.label}</div>
										<div class="mt-1 text-sm leading-6 text-muted-foreground">${selected.note}</div>
									</div>
									<div class="grid gap-1 text-right">
										<div class="native-setting-value">${selected.price}</div>
										<div class="text-xs text-muted-foreground">${selected.memory}GB · ${selected.type}</div>
									</div>
								</div>
							</div>
							<div class="native-hardware-summary">
								<div>
									<div class="text-xs font-semibold text-muted-foreground">粗估需求</div>
									<div class="mt-1 text-3xl font-semibold text-foreground">${projected} GB</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">模型權重 + ${userCount} 人上下文 + 執行餘裕</div>
								</div>
								<div>
									<div class="text-xs font-semibold text-muted-foreground">可用空間</div>
									<div class="mt-1 text-3xl font-semibold text-foreground">${selected.usable} GB</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">扣掉系統、桌面 app、框架與保守餘裕後的估算</div>
								</div>
								<div>
									<div class="text-xs font-semibold text-muted-foreground">判斷</div>
									<div class="mt-1 text-lg font-semibold ${fit[2]}">${fit[0]}</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${fit[1]}</div>
								</div>
							</div>
							<div class="grid gap-3 p-4">
								<div class="text-xs font-semibold text-muted-foreground">記憶體用在哪裡</div>
								${memoryRows
									.map(([label, value, note]) => {
										const width = Math.max(3, Math.min(100, Math.round((value / maxBar) * 100)));
										return `
											<div class="native-hardware-meter-row">
												<div class="text-xs font-semibold text-foreground">${label}</div>
												<div>
													<div class="native-hardware-meter">
														<div class="native-hardware-meter-fill" style="width:${width}%"></div>
													</div>
													<div class="mt-1 text-[11px] leading-4 text-muted-foreground">${note}</div>
												</div>
												<div class="native-model-value text-xs text-muted-foreground">${Math.ceil(value)} GB</div>
											</div>
										`;
									})
									.join("")}
							</div>
							<div class="grid gap-3 p-4 md:grid-cols-2">
								<div class="rounded-md bg-muted/20 p-3">
									<div class="text-xs font-semibold text-foreground">適合</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${selected.best}</div>
								</div>
								<div class="rounded-md bg-muted/20 p-3">
									<div class="text-xs font-semibold text-foreground">要小心</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${selected.watch}</div>
								</div>
							</div>
						</div>
					</div>
				</div>`,
			)}
			${this.card(
				"要跑的模型設定",
				`<div class="overflow-hidden rounded-lg border border-border bg-background/60">
					<div class="grid divide-y divide-border">
						${this.modelArchitectureChoices()}
						${this.modelPresets()}
						${this.modelSettingRange("params", this.state.architecture === "moe" ? "總參數 / 權重大小" : "模型大小", 1, 300, 1, `${this.state.params}B`, this.state.architecture === "moe" ? "MoE 可以每次只啟用部分專家，但整包權重仍然要放得下。" : "Dense 模型每個 token 幾乎都會用到整個模型。", ["小模型", "大型權重"])}
						${this.state.architecture === "moe" ? this.modelSettingRange("activeParams", "每 token 啟用參數", 1, Math.max(1, this.state.params), 1, `${this.effectiveActiveParams()}B`, "這比較接近速度與單 token 計算量；但不代表總權重可以不用載入。", ["少量啟用", "大量啟用"]) : ""}
						${this.modelQuantChoices()}
						${this.modelSettingRange("context", "上下文長度", 8, 1024, 8, this.contextValueText(), "上下文越長，每個同時對話都會多吃一份 KV cache。正式服務時，這通常比 demo 更可怕。", ["短文件", "1M"])}
						${this.modelSettingRange("users", "同時使用人數", 1, 16, 1, `${this.state.users} 人`, "不是帳號總數，而是同一時間真的在推論的對話數。多人使用會放大 KV cache 與延遲。", ["單人 demo", "小型服務"])}
					</div>
				</div>`,
			)}
			${this.card(
				"採購時不要只看容量",
				`<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">容量決定能不能放下</div>
						<div class="leading-6 text-muted-foreground">模型權重、上下文、多人使用都會吃記憶體。能放下只是第一關。</div>
					</div>
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">頻寬與軟體決定跑得順不順</div>
						<div class="leading-6 text-muted-foreground">CUDA、Metal、ROCm、MLX、llama.cpp、vLLM 支援不同。工具鏈不順，硬體規格再漂亮也會卡。</div>
					</div>
					<div class="native-decision-row px-3 py-3">
						<div class="font-semibold text-foreground">價格不是總成本</div>
						<div class="leading-6 text-muted-foreground">工作站還要算電力、散熱、保固、備援、監控、更新與誰負責排錯。</div>
					</div>
				</div>
				<div class="mt-3 text-xs leading-5 text-muted-foreground">
					價格為 2026-05 公開美國零售或媒體整理的近似值，實際會因地區、供貨、SSD、稅金與教育/企業方案改變。
				</div>`,
			)}
		`;
	}

	renderDemos() {
		const demos = {
			chat: {
				title: "本機對話基準",
				intent: "先確認模型真的能在自己的電腦上回應，而且速度與記憶體不是只在展示影片裡好看。",
				action: "用 Ollama 或 LM Studio 開一個中小型模型，問同一組課堂題與工作題。",
				command: "ollama run qwen3:8b",
				evidence: ["第一次回應要等多久", "連續追問三輪後是否還穩", "CPU/GPU/記憶體是否逼近上限"],
				decision: "能順跑簡單聊天不代表能處理長文件或正式服務；它只證明「本機推論這條路打得開」。",
				pitfall: "回答流暢但事實不穩、長上下文變慢、筆電風扇與耗電讓課堂 demo 很快失控。",
			},
			api: {
				title: "產品串接測試",
				intent: "確認本機模型能不能被現有 app 當成 OpenAI-compatible API 使用，而不是只能在聊天視窗裡玩。",
				action: "把 app 的 base URL 指到本機服務，送出一個會串流回覆的簡短任務。",
				command: "curl http://localhost:11434/v1/chat/completions",
				evidence: ["HTTP 狀態與串流是否正常", "模型名稱、錯誤訊息、timeout 是否可控", "工具呼叫與 JSON 輸出是否和 GPT 行為相容"],
				decision: "API 打得通只是第一步；真正要看的是產品現有流程是否需要改 prompt、schema 或重試策略。",
				pitfall: "很多服務宣稱相容，但 function calling、structured output、streaming 細節會和 GPT 不同。",
			},
			eval: {
				title: "小型評測集",
				intent: "不要憑感覺說某個模型夠用。拿自己的真實任務做小型評測，才知道它會在哪裡失手。",
				action: "準備 20 題常見任務，讓 GPT 與本機模型跑同一份題目，逐題標成通過、部分通過、失敗。",
				command: "20 題真實任務：摘要、文件問答、表格抽取、翻譯、改寫",
				evidence: ["每題的通過/部分通過/失敗", "失敗原因是否集中在同一類任務", "錯誤能不能靠提示或流程補救"],
				decision: "如果失敗集中在低風險、可人工修正的工作，本機模型可能值得；如果錯在關鍵判斷，就要保留 GPT 或人工審核。",
				pitfall: "平均分數會遮住高風險失敗；一題財務單位看錯，可能比十題文案寫得順更重要。",
			},
		};
		const demo = demos[this.state.demo];
		const options = [
			{ value: "chat", label: "1. 先跑對話", help: "證明模型能在本機推論。" },
			{ value: "api", label: "2. 再接產品", help: "證明 app 能呼叫本機服務。" },
			{ value: "eval", label: "3. 最後評測", help: "證明品質符合你的任務。" },
		];
		const steps = [
			["準備", "選模型、啟動服務、記下硬體條件。"],
			["執行", demo.action],
			["紀錄", "留下延遲、記憶體、錯誤訊息與實際輸出，不只截一張成功畫面。"],
			["判斷", demo.decision],
		];
		return `
			<section class="native-demo-panel">
				<div class="native-demo-hero">
					<div>
						<div class="text-xs font-semibold text-muted-foreground">6.4 實作示範</div>
						<h2 class="mt-1 text-xl font-bold text-foreground">不要只看「有回應」</h2>
						<p class="mt-2 text-sm leading-6 text-muted-foreground">
							這頁不是在模擬模型輸出，而是整理你真的跑 Ollama、LM Studio 或本機 API 時要驗收的證據。成功畫面很便宜；可重複的證據比較有用。
						</p>
					</div>
					<div class="native-demo-receipt">
						<div class="text-xs font-semibold text-muted-foreground">這次要證明</div>
						<div class="mt-1 text-sm font-semibold text-foreground">${demo.title}</div>
					</div>
				</div>
				<div class="native-demo-layout">
					<div class="native-demo-picker" role="group" aria-label="實作示範路線">
						${options
							.map(
								option => `
									<button
										data-key="demo"
										data-value="${option.value}"
										class="native-demo-option ${this.state.demo === option.value ? "is-active" : ""}"
									>
										<span class="native-demo-option-title">${option.label}</span>
										<span class="native-demo-option-note">${option.help}</span>
									</button>
								`,
							)
							.join("")}
					</div>
					<div class="native-demo-detail">
						<div class="native-demo-detail-header">
							<div>
								<div class="text-lg font-bold text-foreground">${demo.title}</div>
								<div class="mt-1 text-sm leading-6 text-muted-foreground">${demo.intent}</div>
							</div>
							<div class="native-demo-status">驗收清單</div>
						</div>
						<div class="native-demo-command" aria-label="起手式">${demo.command}</div>
						<div class="native-demo-process">
							${steps
								.map(
									([label, text], index) => `
										<div class="native-demo-step">
											<div class="native-demo-step-index">${index + 1}</div>
											<div>
												<div class="text-sm font-semibold text-foreground">${label}</div>
												<div class="mt-1 text-xs leading-5 text-muted-foreground">${text}</div>
											</div>
										</div>
									`,
								)
								.join("")}
						</div>
						<div class="native-demo-evidence-grid">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">要留下的證據</div>
								<ul class="mt-2 grid gap-2 text-sm leading-6 text-foreground">
									${demo.evidence.map(item => `<li>${item}</li>`).join("")}
								</ul>
							</div>
							<div>
								<div class="text-xs font-semibold text-muted-foreground">常見誤判</div>
								<p class="mt-2 text-sm leading-6 text-foreground">${demo.pitfall}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		`;
	}
}

customElements.define("self-hosting-lab", SelfHostingLab);
