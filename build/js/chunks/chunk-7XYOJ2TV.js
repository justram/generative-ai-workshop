import {
  getCurrentLanguage,
  i18n
} from "./chunk-4L3FZKEY.js";

// src/workshop-runtime/self-hosting-lab.js
var SELF_HOSTING_LAB_EN = {
  \u786C\u9AD4\u63A1\u8CFC\u524D\u5148\u4F30\u9019\u4E09\u4EF6\u4E8B: "Estimate these three things before buying hardware",
  "\u9019\u9801\u4E0D\u662F\u6392\u884C\u699C\u3002\u5148\u9078\u4E00\u53F0\u5E38\u898B\u6A5F\u5668\uFF0C\u518D\u8ABF\u6574\u6A21\u578B\u3001\u91CF\u5316\u3001\u4E0A\u4E0B\u6587\u8207\u540C\u6642\u4F7F\u7528\u4EBA\u6578\uFF0C\u770B\u300C\u80FD\u653E\u4E0B\u300D\u548C\u300C\u503C\u5F97\u8CB7\u300D\u662F\u4E0D\u662F\u540C\u4E00\u4EF6\u4E8B\u3002": "This page is not a ranking. Pick a common machine, then adjust model size, quantization, context, and concurrent users to see whether \u201Cit fits\u201D and \u201Cit is worth buying\u201D are the same thing.",
  \u5E38\u898B\u786C\u9AD4\u9078\u9805: "Common hardware options",
  "\u7D04 US$5.5k-7.3k": "about US$5.5k-7.3k",
  "\u66FE\u53EF\u9078\u914D\u5230 US$14.1k": "previously configurable up to US$14.1k",
  "\u7D04 US$4.7k": "about US$4.7k",
  "\u7D04 US$2.3k-3.4k": "about US$2.3k-3.4k",
  "\u7D04 US$8k-10k+": "about US$8k-10k+",
  "M5 Max \u53EF\u5230 128GB unified memory\uFF1B\u50F9\u683C\u4F9D\u87A2\u5E55\u5C3A\u5BF8\u3001SSD \u8207\u5BA2\u88FD\u5316\u800C\u8B8A\u3002": "M5 Max can be configured up to 128GB unified memory; price depends on display size, SSD, and configuration.",
  "\u628A\u5B83\u7576\u6210\u7279\u6B8A\u5DE5\u4F5C\u7AD9\uFF0C\u4E0D\u662F\u4E00\u822C\u63A1\u8CFC\u57FA\u6E96\u3002": "Treat it as a special workstation, not a normal purchasing baseline.",
  "128GB coherent unified memory\uFF1B\u5B9A\u4F4D\u63A5\u8FD1\u500B\u4EBA AI supercomputer\u3002": "128GB coherent unified memory; positioned close to a personal AI supercomputer.",
  "\u8A31\u591A\u6A5F\u5668\u53EF\u628A\u90E8\u5206\u8A18\u61B6\u9AD4\u5207\u7D66 iGPU\uFF0C\u5E38\u898B\u8AAA\u6CD5\u662F\u6700\u9AD8\u7D04 96GB VRAM \u985E\u914D\u7F6E\u3002": "Many machines can reserve part of memory for the iGPU; a common claim is up to about a 96GB VRAM-like configuration.",
  "\u5E38\u88AB\u62FF\u4F86\u548C RTX 5090 \u985E\u6D88\u8CBB\u5361\u6BD4\u8F03\uFF1B\u5DEE\u50F9\u4E3B\u8981\u8CB7 VRAM\u3001ECC\u3001\u9A45\u52D5\u8207\u4FDD\u56FA\u3002": "Often compared with RTX 5090-class consumer cards; the premium mostly buys VRAM, ECC, drivers, and warranty.",
  \u7C97\u4F30\u9700\u6C42: "Estimated requirement",
  \u53EF\u7528\u7A7A\u9593: "Usable memory",
  "\u6263\u6389\u7CFB\u7D71\u3001\u684C\u9762 app\u3001\u6846\u67B6\u8207\u4FDD\u5B88\u9918\u88D5\u5F8C\u7684\u4F30\u7B97": "Estimated after reserving memory for the OS, desktop apps, runtime framework, and safety margin",
  \u5224\u65B7: "Verdict",
  "\u6A21\u578B\u6B0A\u91CD + 1 \u4EBA\u4E0A\u4E0B\u6587 + \u57F7\u884C\u9918\u88D5": "Model weights + 1 user's context + runtime headroom",
  \u6A21\u578B\u6B0A\u91CD: "Model weights",
  "\u4E0A\u4E0B\u6587 / \u6BCF\u4EBA": "Context / user",
  \u4F7F\u7528\u8005\u6578: "User count",
  \u57F7\u884C\u9918\u88D5: "Runtime headroom",
  \u8A18\u61B6\u9AD4\u7528\u5728\u54EA\u88E1: "Where the memory goes",
  "\u6A21\u578B\u672C\u9AD4\uFF0CMoE \u4E5F\u8981\u653E\u4E0B\u5168\u90E8\u5C08\u5BB6\u6B0A\u91CD\u3002": "The model body. MoE still has to fit all expert weights.",
  "8k \u5C0D\u8A71\u6216\u6587\u4EF6\u6703\u4FDD\u7559\u7684 KV cache\u3002": "KV cache kept for an 8k conversation or document.",
  "1 \u500B\u540C\u6642\u5C0D\u8A71\u6642\uFF0CKV cache \u6703\u8DDF\u8457\u653E\u5927\u3002": "With 1 concurrent conversation, KV cache scales with it.",
  "\u6846\u67B6\u3001\u66AB\u5B58\u3001batch \u8207\u7CFB\u7D71\u672C\u8EAB\u9700\u8981\u7684\u7A7A\u9593\u3002": "Space needed by the framework, temporary buffers, batching, and the OS itself.",
  \u9918\u88D5\u5145\u8DB3: "Plenty of headroom",
  "\u53EF\u4EE5\u505A\u8F03\u9577\u4E0A\u4E0B\u6587\u3001\u8F03\u5927 batch \u6216\u66F4\u591A\u5BE6\u9A57\uFF0C\u4F46\u4ECD\u8981\u5BE6\u6E2C\u901F\u5EA6\u3002": "Can support longer context, larger batches, or more experiments, but speed still needs testing.",
  "\u53EF\u4EE5\u8DD1\uFF0C\u9918\u88D5\u6709\u9650": "Runs, but headroom is limited",
  "\u9069\u5408 demo \u6216\u55AE\u4EBA\u6E2C\u8A66\uFF1B\u6B63\u5F0F\u670D\u52D9\u8981\u964D\u4F4E\u4E0A\u4E0B\u6587\u3001\u7E2E\u5C0F\u6A21\u578B\u6216\u6E1B\u5C11\u4F75\u767C\u3002": "Fine for demos or solo testing; production service needs shorter context, a smaller model, or fewer concurrent users.",
  \u6703\u7206\u6216\u56B4\u91CD\u63DB\u9801: "Will run out of memory or page badly",
  "\u9019\u7D44\u8A2D\u5B9A\u4E0D\u9069\u5408\u9019\u53F0\u6A5F\u5668\u3002\u5148\u964D\u91CF\u5316\u3001\u7E2E\u4E0A\u4E0B\u6587\u3001\u6539\u5C0F\u6A21\u578B\uFF0C\u6216\u63DB\u96F2\u7AEF/API\u3002": "This setup does not fit this machine. Lower precision, shorten context, use a smaller model, or switch to cloud/API.",
  \u9069\u5408: "Good fit",
  \u8981\u5C0F\u5FC3: "Watch out",
  "\u5E36\u8457\u8D70\u7684\u55AE\u4EBA\u958B\u767C\u6A5F\u3002\u9069\u5408\u672C\u6A5F demo\u3001\u8AB2\u5802\u3001\u6E2C\u5C0F\u5230\u4E2D\u578B\u6A21\u578B\uFF0C\u6216\u628A GPT \u5DE5\u4F5C\u6D41\u642C\u4E00\u90E8\u5206\u5230\u672C\u6A5F\u3002": "Portable single-user development machine. Good for local demos, classrooms, small-to-mid model tests, or moving part of a GPT workflow locally.",
  "128GB \u4E0D\u662F 128GB VRAM\u3002\u7CFB\u7D71\u3001\u700F\u89BD\u5668\u3001IDE \u548C\u6A21\u578B\u5F15\u64CE\u90FD\u6703\u5403 unified memory\uFF1B\u9577\u4E0A\u4E0B\u6587\u6216\u591A\u4EBA\u670D\u52D9\u6703\u5F88\u5FEB\u5361\u4F4F\u3002": "128GB is not 128GB of VRAM. The OS, browser, IDE, and model runtime all consume unified memory; long context or multi-user service will get tight quickly.",
  "\u60F3\u5728\u55AE\u6A5F\u4E0A\u653E\u975E\u5E38\u5927\u7684\u6B0A\u91CD\u3001\u9577\u4E0A\u4E0B\u6587\u6216\u5927\u6279\u6587\u4EF6\u5BE6\u9A57\u3002\u5F37\u9805\u662F\u5BB9\u91CF\u8207\u4F4E\u529F\u8017\u3002": "Good for fitting very large weights, long context, or large document experiments on one machine. Its strength is capacity and low power.",
  "512GB \u914D\u7F6E\u5728 2026 \u5E74\u4F9B\u8CA8\u5F88\u4E0D\u7A69\uFF0C\u751A\u81F3\u66FE\u5F9E Apple \u5B98\u7DB2\u9078\u914D\u9805\u76EE\u6D88\u5931\u3002\u80FD\u653E\u4E0B\u4E0D\u4EE3\u8868 tokens/sec \u6703\u50CF\u8CC7\u6599\u4E2D\u5FC3 GPU\u3002": "The 512GB configuration has had unstable availability in 2026 and even disappeared from Apple configuration pages. Fitting the model does not mean data-center-GPU tokens/sec.",
  "\u60F3\u7528 NVIDIA \u8EDF\u9AD4\u68E7\u3001\u6E2C\u63A5\u8FD1\u90E8\u7F72\u7AEF\u7684\u6D41\u7A0B\uFF0C\u4E26\u5728\u684C\u4E0A\u8DD1\u8F03\u5927\u7684\u6A21\u578B\u539F\u578B\u3002": "Good for using the NVIDIA software stack, testing deployment-like workflows, and prototyping larger local models on a desk.",
  "\u662F AI dev kit\uFF0C\u4E0D\u662F\u842C\u80FD\u684C\u6A5F\u3002\u50F9\u683C\u3001\u4F9B\u8CA8\u548C ARM/NVIDIA \u8EDF\u9AD4\u76F8\u5BB9\u6027\u90FD\u8981\u5148\u78BA\u8A8D\u3002": "It is an AI dev kit, not a universal desktop. Confirm price, availability, and ARM/NVIDIA software compatibility first.",
  "\u9810\u7B97\u6709\u9650\u4F46\u60F3\u8981 128GB \u7D1A\u5171\u4EAB\u8A18\u61B6\u9AD4\u7684\u5C0F\u578B\u684C\u6A5F\u3002\u9069\u5408\u63A2\u7D22\u3001\u6559\u5B78\u548C\u975E NVIDIA \u8DEF\u7DDA\u3002": "A small desktop path for limited budgets that still want 128GB-class shared memory. Good for exploration, teaching, and non-NVIDIA routes.",
  "ROCm / Vulkan / llama.cpp \u652F\u63F4\u8981\u770B\u5DE5\u5177\uFF1B\u6709\u4E9B\u5DE5\u4F5C\u6D41\u4ECD\u7136\u662F NVIDIA CUDA \u6700\u7701\u4E8B\u3002": "ROCm / Vulkan / llama.cpp support depends on the tool; some workflows are still easiest on NVIDIA CUDA.",
  "\u9700\u8981 CUDA\u3001\u751F\u7522\u7D1A\u9A45\u52D5\u3001ECC VRAM\u3001\u5DE5\u4F5C\u7AD9\u7A69\u5B9A\u6027\u8207\u8F03\u9AD8\u983B\u5BEC\u3002\u9069\u5408\u6B63\u5F0F PoC \u6216\u5C0F\u578B\u670D\u52D9\u3002": "Good when you need CUDA, production drivers, ECC VRAM, workstation stability, and higher bandwidth. Suitable for formal PoCs or small services.",
  "\u9019\u901A\u5E38\u53EA\u662F\u4E00\u5F35\u5361\uFF0C\u9084\u8981\u4E3B\u6A5F\u677F\u3001\u96FB\u6E90\u3001\u6563\u71B1\u3001\u6A5F\u6BBC\u8207\u7DAD\u904B\u3002\u8CB7\u5361\u4E0D\u7B49\u65BC\u8CB7\u5230\u670D\u52D9\u3002": "This is usually only a card; you still need motherboard, power, cooling, case, and operations. Buying a GPU is not buying a service.",
  \u8981\u8DD1\u7684\u6A21\u578B\u8A2D\u5B9A: "Model settings to test",
  \u6A21\u578B\u67B6\u69CB: "Model architecture",
  "Dense \u770B\u7E3D\u53C3\u6578\uFF1BMoE \u8981\u5206\u958B\u770B\u7E3D\u6B0A\u91CD\u8207\u6BCF token \u555F\u7528\u53C3\u6578\u3002": "Dense models are judged by total parameters; MoE needs total weights and per-token active parameters separated.",
  "\u6BCF\u500B token \u90FD\u8DD1\u6574\u500B\u6A21\u578B": "Every token runs through the whole model",
  "\u8F09\u5165\u5168\u90E8\u6B0A\u91CD\uFF0C\u4F46\u6BCF\u500B token \u53EA\u555F\u7528\u4E00\u90E8\u5206\u5C08\u5BB6": "Loads all weights, but each token activates only some experts",
  \u5E38\u898B\u6A21\u578B\u7BC4\u4F8B: "Common model examples",
  "\u9EDE\u4E00\u500B\u7BC4\u4F8B\uFF0C\u770B dense \u8207 MoE \u7684\u8A18\u61B6\u9AD4\u53D6\u6368\u5DEE\u5728\u54EA\u88E1\u3002": "Click a preset to see how dense and MoE memory tradeoffs differ.",
  \u50B3\u7D71\u5C0F\u6A21\u578B\u57FA\u6E96: "Traditional small-model baseline",
  "\u7E3D\u53C3\u6578 / \u6B0A\u91CD\u5927\u5C0F": "Total parameters / weight size",
  \u6A21\u578B\u5927\u5C0F: "Model size",
  \u7B46\u96FB\u5BE6\u9A57\u7D1A: "Laptop experiment",
  \u5DE5\u4F5C\u7AD9\u7D1A: "Workstation class",
  \u4F3A\u670D\u5668\u7D1A: "Server class",
  \u8CC7\u6599\u4E2D\u5FC3\u7D1A: "Data-center class",
  \u7E3D\u6B0A\u91CD: "Total weights",
  \u4F4E\u555F\u7528\u91CF: "Low activation",
  \u4E2D\u555F\u7528\u91CF: "Medium activation",
  "MoE \u53EF\u4EE5\u6BCF\u6B21\u53EA\u555F\u7528\u90E8\u5206\u5C08\u5BB6\uFF0C\u4F46\u6574\u5305\u6B0A\u91CD\u4ECD\u7136\u8981\u653E\u5F97\u4E0B\u3002": "MoE can activate only some experts per token, but the full weight package still has to fit.",
  "Dense \u6A21\u578B\u6BCF\u500B token \u5E7E\u4E4E\u90FD\u6703\u7528\u5230\u6574\u500B\u6A21\u578B\u3002": "Dense models use almost the whole model for every token.",
  \u5C0F\u6A21\u578B: "Small model",
  \u5927\u578B\u6B0A\u91CD: "Large weights",
  "\u6BCF token \u555F\u7528\u53C3\u6578": "Active parameters per token",
  "\u9019\u6BD4\u8F03\u63A5\u8FD1\u901F\u5EA6\u8207\u55AE token \u8A08\u7B97\u91CF\uFF1B\u4F46\u4E0D\u4EE3\u8868\u7E3D\u6B0A\u91CD\u53EF\u4EE5\u4E0D\u7528\u8F09\u5165\u3002": "This better approximates speed and per-token compute; it does not mean total weights need not be loaded.",
  \u5C11\u91CF\u555F\u7528: "Low activation",
  \u5927\u91CF\u555F\u7528: "High activation",
  \u91CF\u5316\u4F4D\u5143: "Quantization bits",
  "\u91CF\u5316\u4E0D\u662F\u9023\u7E8C\u65CB\u9215\uFF0C\u800C\u662F\u5E38\u898B\u683C\u5F0F\u9078\u64C7\u3002\u8D8A\u4F4E\u8D8A\u7701\u8A18\u61B6\u9AD4\uFF0C\u4E5F\u8D8A\u53EF\u80FD\u72A7\u7272\u54C1\u8CEA\u3002": "Quantization is not a continuous knob; it is a format choice. Lower bits save memory and may sacrifice quality.",
  "\u6975\u7701\uFF0C\u4F46\u54C1\u8CEA\u98A8\u96AA\u6700\u9AD8": "Saves the most memory, with the highest quality risk",
  \u6975\u7701\u8A18\u61B6\u9AD4: "Extreme memory saving",
  \u7701\u8A18\u61B6\u9AD4: "Memory saving",
  \u6298\u8877: "Compromise",
  \u9AD8\u7CBE\u5EA6: "High precision",
  \u5E38\u898B\u7701\u8A18\u61B6\u9AD4\u9078\u64C7: "Common memory-saving choice",
  \u54C1\u8CEA\u8207\u8A18\u61B6\u9AD4\u6298\u8877: "Quality and memory compromise",
  "\u8F03\u5B8C\u6574\uFF0C\u4F46\u6700\u5403\u8A18\u61B6\u9AD4": "More complete, but uses the most memory",
  \u4E0A\u4E0B\u6587\u9577\u5EA6: "Context length",
  "\u4E0A\u4E0B\u6587\u8D8A\u9577\uFF0C\u6BCF\u500B\u540C\u6642\u5C0D\u8A71\u90FD\u6703\u591A\u5403\u4E00\u4EFD KV cache\u3002\u6B63\u5F0F\u670D\u52D9\u6642\uFF0C\u9019\u901A\u5E38\u6BD4 demo \u66F4\u53EF\u6015\u3002": "Longer context adds KV cache for every concurrent conversation. In real service, this is often scarier than in a demo.",
  "token \u662F\u6A21\u578B\u5207\u6587\u5B57\u7684\u55AE\u4F4D\u3002\u9801\u6578\u53EA\u662F\u7C97\u4F30\uFF1BPDF\u3001\u8868\u683C\u3001\u7A0B\u5F0F\u78BC\u3001OCR \u90FD\u6703\u5403\u4E0D\u4E00\u6A23\u591A\u3002": "A token is the unit the model uses to split text. Page counts are only rough estimates; PDFs, tables, code, and OCR all consume tokens differently.",
  "1M token \u662F\u767E\u842C\u7D1A\u4E0A\u4E0B\u6587\uFF0C\u9069\u5408\u5C55\u793A\u300C\u80FD\u585E\u5F88\u591A\u300D\u548C\u300C\u6210\u672C\u4E5F\u5F88\u9AD8\u300D\u7684\u53D6\u6368\u3002\u5B83\u4E0D\u662F\u842C\u80FD\u8A18\u61B6\u9AD4\uFF1B\u627E\u91CD\u9EDE\u4ECD\u9700\u8981\u7D50\u69CB\u5316\u6D41\u7A0B\u3002": "A 1M-token context demonstrates the tradeoff between fitting a lot and paying a lot. It is not magic memory; finding the important parts still needs structure.",
  \u77ED\u6587\u4EF6: "Short document",
  \u4E2D\u77ED\u6587\u4EF6: "Short-to-medium document",
  \u4E2D\u578B\u6587\u4EF6: "Medium document",
  \u9577\u6587\u4EF6: "Long document",
  \u8D85\u9577\u6587\u4EF6: "Very long document",
  \u5927\u578B\u8CC7\u6599\u5305: "Large data bundle",
  \u5DE8\u91CF\u8CC7\u6599\u5305: "Huge data bundle",
  \u767E\u842C\u7D1A\u4E0A\u4E0B\u6587: "Million-token context",
  "\u5E7E\u9801 PDF\u3001\u5E7E\u7BC7\u65B0\u805E\u3001\u77ED\u554F\u7B54\u3001\u55AE\u9801 OCR\u3001\u55AE\u4E00\u7A0B\u5F0F\u7247\u6BB5": "A few PDF pages, a few news articles, a short Q&A, one OCR page, or one code snippet",
  "\u77ED\u5831\u544A\u3001\u4E00\u7AE0\u6559\u6750\u3001\u5E7E\u9801\u5408\u7D04\u6216\u8B1B\u7FA9\u3001\u5C0F\u529F\u80FD\u76F8\u95DC\u6A94\u6848": "A short report, one textbook chapter, a few contract or handout pages, or files for a small feature",
  "\u5B8C\u6574\u5831\u544A\u7BC0\u9078\u3001\u5E7E\u7AE0\u6559\u6750\u3001\u591A\u9801\u8868\u683C OCR\u3001\u5C0F\u6A21\u7D44\u4E0A\u4E0B\u6587": "Report excerpts, several textbook chapters, multi-page table OCR, or a small module context",
  "\u9577\u5831\u544A\u3001\u591A\u6587\u4EF6\u7BC0\u9078\u3001\u8AD6\u6587\u8349\u7A3F\u8207\u53C3\u8003\u6BB5\u843D\u3001\u8DE8\u6A94\u6848\u9664\u932F": "Long reports, multi-document excerpts, paper drafts with references, and cross-file debugging",
  "\u77ED\u66F8\u7AE0\u7BC0\u3001\u5927\u578B\u898F\u683C\u66F8\u3001\u5927\u91CF OCR \u6587\u5B57\u3001\u4E2D\u578B\u5C08\u6848\u5C40\u90E8\u4E0A\u4E0B\u6587": "Short book chapters, large specs, lots of OCR text, or partial context for a medium project",
  "\u4E00\u672C\u77ED\u66F8\u3001\u539A\u898F\u683C\u66F8\u3001\u5927\u91CF OCR \u7D50\u679C\u3001\u4E2D\u578B\u5C08\u6848\u8F03\u5927\u4E0A\u4E0B\u6587": "A short book, thick spec, lots of OCR output, or larger context for a medium project",
  "\u591A\u4EFD\u9577\u6587\u4EF6\u3001\u9577\u66F8\u7A3F\u53C3\u8003\u6750\u6599\u3001\u8F03\u5927\u5C08\u6848\u591A\u6A21\u7D44\u4E0A\u4E0B\u6587": "Multiple long documents, long-manuscript reference material, or multi-module context for a larger project",
  "\u5927\u91CF\u6587\u4EF6\u6216\u7A0B\u5F0F\u8CC7\u6599\uFF1B\u80FD\u653E\u5F88\u591A\uFF0C\u4F46\u66F4\u9700\u8981\u6458\u8981\u3001\u7D22\u5F15\u8207\u9A57\u8B49": "Lots of documents or code; it fits a lot, but needs summarization, indexing, and verification even more",
  "\u9019\u4E0D\u662F\u56FA\u5B9A\u9801\u6578\u63DB\u7B97\u3002PDF \u6392\u7248\u3001\u8868\u683C\u3001\u7A0B\u5F0F\u78BC\u3001OCR \u932F\u5B57\u8207\u5716\u7247\u8AAA\u660E\u90FD\u6703\u6539\u8B8A\u5BE6\u969B token \u6578\u3002": "This is not a fixed page-count conversion. PDF layout, tables, code, OCR errors, and image captions all change the real token count.",
  \u9577\u5831\u544A\u52A0\u591A\u4EFD\u9644\u4EF6: "A long report plus several attachments",
  \u77ED\u66F8\u7AE0\u7BC0\u6216\u9577\u7BC7\u8349\u7A3F: "Short book chapters or a long draft",
  \u5927\u91CF\u6383\u63CF\u9801\u9762\u7BC0\u9078: "Large scanned-page excerpts",
  \u4E2D\u578B\u5C08\u6848\u7684\u5C40\u90E8\u4E0A\u4E0B\u6587: "Partial context from a medium project",
  \u5927\u578B\u898F\u683C\u66F8\u8207\u9644\u4EF6: "A large spec and attachments",
  \u77ED\u66F8\u6216\u9577\u7BC7\u5831\u544A\u8349\u7A3F: "A short book or long report draft",
  \u5927\u91CF\u9801\u9762\u62BD\u53D6\u5F8C\u7684\u6587\u5B57: "Text extracted from many pages",
  \u4E2D\u578B\u5C08\u6848\u7684\u4E00\u5927\u6BB5\u4E0A\u4E0B\u6587: "A large slice of a medium project",
  \u591A\u4EFD\u9577\u6587\u4EF6\u8207\u9644\u4EF6: "Multiple long documents and attachments",
  \u9577\u66F8\u7A3F\u7BC0\u9078\u8207\u53C3\u8003\u6750\u6599: "Long-manuscript excerpts and references",
  \u5927\u91CF\u6383\u63CF\u6587\u4EF6\u62BD\u53D6\u7D50\u679C: "Extracted text from many scanned documents",
  \u8F03\u5927\u5C08\u6848\u7684\u591A\u6A21\u7D44\u4E0A\u4E0B\u6587: "Multi-module context from a larger project",
  \u591A\u672C\u624B\u518A\u6216\u5927\u91CF\u9644\u4EF6: "Multiple manuals or many attachments",
  \u9577\u7BC7\u66F8\u7A3F\u8207\u5927\u91CF\u53C3\u8003: "A long manuscript and many references",
  \u8D85\u5927\u91CF\u6587\u4EF6\u62BD\u53D6\u7D50\u679C: "Very large document-extraction output",
  "\u5927\u578B\u5C08\u6848\u7684\u4E00\u90E8\u5206\uFF0C\u4F46\u4ECD\u4E0D\u662F\u6574\u500B\u4E16\u754C": "Part of a large project, but still not the whole world",
  \u540C\u6642\u4F7F\u7528\u4EBA\u6578: "Concurrent users",
  "\u4E0D\u662F\u5E33\u865F\u7E3D\u6578\uFF0C\u800C\u662F\u540C\u4E00\u6642\u9593\u771F\u7684\u5728\u63A8\u8AD6\u7684\u5C0D\u8A71\u6578\u3002\u591A\u4EBA\u4F7F\u7528\u6703\u653E\u5927 KV cache \u8207\u5EF6\u9072\u3002": "Not total accounts; this is the number of conversations actually running inference at the same time. More users amplify KV cache and latency.",
  "\u55AE\u4EBA demo": "Solo demo",
  \u5C0F\u578B\u670D\u52D9: "Small service",
  \u63A1\u8CFC\u6642\u4E0D\u8981\u53EA\u770B\u5BB9\u91CF: "Do not buy by capacity alone",
  \u5BB9\u91CF\u6C7A\u5B9A\u80FD\u4E0D\u80FD\u653E\u4E0B: "Capacity decides whether it fits",
  "\u6A21\u578B\u6B0A\u91CD\u3001\u4E0A\u4E0B\u6587\u3001\u591A\u4EBA\u4F7F\u7528\u90FD\u6703\u5403\u8A18\u61B6\u9AD4\u3002\u80FD\u653E\u4E0B\u53EA\u662F\u7B2C\u4E00\u95DC\u3002": "Model weights, context, and multiple users all consume memory. Fitting is only the first gate.",
  \u983B\u5BEC\u8207\u8EDF\u9AD4\u6C7A\u5B9A\u8DD1\u5F97\u9806\u4E0D\u9806: "Bandwidth and software decide whether it runs smoothly",
  "CUDA\u3001Metal\u3001ROCm\u3001MLX\u3001llama.cpp\u3001vLLM \u652F\u63F4\u4E0D\u540C\u3002\u5DE5\u5177\u93C8\u4E0D\u9806\uFF0C\u786C\u9AD4\u898F\u683C\u518D\u6F02\u4EAE\u4E5F\u6703\u5361\u3002": "CUDA, Metal, ROCm, MLX, llama.cpp, and vLLM differ in support. If the toolchain is rough, nice hardware specs still get stuck.",
  \u50F9\u683C\u4E0D\u662F\u7E3D\u6210\u672C: "Price is not total cost",
  "\u5DE5\u4F5C\u7AD9\u9084\u8981\u7B97\u96FB\u529B\u3001\u6563\u71B1\u3001\u4FDD\u56FA\u3001\u5099\u63F4\u3001\u76E3\u63A7\u3001\u66F4\u65B0\u8207\u8AB0\u8CA0\u8CAC\u6392\u932F\u3002": "Workstations also need power, cooling, warranty, backup, monitoring, updates, and someone responsible for debugging.",
  "\u50F9\u683C\u70BA 2026-05 \u516C\u958B\u7F8E\u570B\u96F6\u552E\u6216\u5A92\u9AD4\u6574\u7406\u7684\u8FD1\u4F3C\u503C\uFF0C\u5BE6\u969B\u6703\u56E0\u5730\u5340\u3001\u4F9B\u8CA8\u3001SSD\u3001\u7A05\u91D1\u8207\u6559\u80B2/\u4F01\u696D\u65B9\u6848\u6539\u8B8A\u3002": "Prices are approximate public US retail or media-reported figures as of 2026-05. Actual prices vary by region, availability, SSD, tax, and education/enterprise programs.",
  \u81EA\u67B6\u9069\u5408\u5EA6: "Self-hosting fit",
  \u4E00\u6B21\u80FD\u653E\u9032\u6A21\u578B\u7684\u8CC7\u6599\u91CF: "How much material fits in one context",
  \u8CC7\u6599: "Data",
  \u7528\u91CF: "Usage",
  \u7DAD\u904B: "Operations",
  \u54C1\u8CEA: "Quality",
  \u516C\u958B\u8CC7\u6599: "Public data",
  \u4E00\u822C\u5167\u90E8\u6587\u4EF6: "Ordinary internal documents",
  \u5BA2\u6236\u6216\u71DF\u904B\u8CC7\u6599: "Customer or operations data",
  \u6A5F\u5BC6\u8CC7\u6599: "Confidential data",
  \u4E0D\u80FD\u96E2\u958B\u7D44\u7E54: "Cannot leave the organization",
  \u6C92\u6709\u4EBA\u7DAD\u8B77: "No maintainer",
  \u6709\u4EBA\u6703\u8DD1\u5DE5\u5177: "Someone can run tools",
  \u6709\u5DE5\u7A0B\u652F\u63F4: "Engineering support",
  \u6709\u5E73\u53F0\u7D93\u9A57: "Platform experience",
  \u6709\u7DAD\u904B\u6D41\u7A0B: "Operations process",
  \u80FD\u7528\u5C31\u597D: "Good enough",
  \u53EF\u4EBA\u5DE5\u4FEE\u6B63: "Human can correct",
  \u591A\u6578\u60C5\u5883\u8981\u7A69: "Stable in most cases",
  "\u8981\u63A5\u8FD1 GPT": "Close to GPT",
  \u932F\u4E0D\u8D77: "Cannot afford mistakes",
  "\u8D8A\u4E0D\u80FD\u5916\u6D41\uFF0C\u8D8A\u6709\u672C\u6A5F\u6216\u79C1\u6709\u90E8\u7F72\u7684\u7406\u7531\u3002": "The less data can leave, the stronger the case for local or private deployment.",
  "\u8CC7\u6599\u9650\u5236\u4E0D\u9AD8\u6642\uFF0C\u5148\u7528 API \u6703\u6BD4\u8F03\u5FEB\u3002": "When data restrictions are low, starting with an API is usually faster.",
  "\u56FA\u5B9A\u4E14\u5927\u91CF\u7684\u5DE5\u4F5C\uFF0C\u624D\u6BD4\u8F03\u53EF\u80FD\u6524\u5E73\u81EA\u67B6\u6210\u672C\u3002": "Fixed, high-volume work is where self-hosting cost is more likely to amortize.",
  "\u7528\u91CF\u9084\u5C0F\u6642\uFF0C\u786C\u9AD4\u8207\u7DAD\u904B\u901A\u5E38\u6BD4 token \u5E33\u55AE\u66F4\u8CB4\u3002": "When usage is still small, hardware and operations usually cost more than the token bill.",
  "\u6709\u4EBA\u80FD\u66F4\u65B0\u3001\u76E3\u63A7\u8207\u6392\u932F\uFF0C\u81EA\u67B6\u624D\u4E0D\u6703\u5361\u5728\u7B2C\u4E00\u9031\u3002": "Self-hosting only survives week one when someone can update, monitor, and debug it.",
  "\u7DAD\u904B\u80FD\u529B\u4E0D\u8DB3\u6642\uFF0C\u6A21\u578B\u80FD\u8DD1\u4E0D\u4EE3\u8868\u670D\u52D9\u80FD\u7A69\u5B9A\u4EA4\u4ED8\u3002": "If operations capability is weak, a model that runs is not the same as a service that ships reliably.",
  "\u54C1\u8CEA\u9580\u6ABB\u8D8A\u9AD8\uFF0C\u8D8A\u8981\u4FDD\u7559 GPT/API \u4F5C\u70BA\u57FA\u6E96\u6216\u5099\u63F4\u3002": "The higher the quality bar, the more you should keep GPT/API as a baseline or fallback.",
  "\u54C1\u8CEA\u9700\u6C42\u8F03\u9B06\u6642\uFF0C\u53EF\u4EE5\u5148\u7528\u5C0F\u6A21\u578B\u9A57\u8B49\u6D41\u7A0B\u3002": "When quality requirements are looser, use a small model first to validate the workflow.",
  \u5206\u9805\u8A18\u61B6\u9AD4\u7528\u91CF: "Memory usage by component",
  "\u6A21\u578B\u672C\u9AD4\u3002\u6A21\u578B\u8D8A\u5927\u3001\u91CF\u5316\u4F4D\u5143\u8D8A\u9AD8\uFF0C\u9019\u584A\u8D8A\u5927\u3002": "The model itself. Larger models and higher quantization bits make this part bigger.",
  \u5404\u5217\u986F\u793A\u81EA\u5DF1\u7684\u8B8A\u5316\u5E45\u5EA6: "Each row shows its own change scale.",
  \u4F30\u7B97\u7D50\u679C: "Estimate",
  "\u7C97\u4F30\uFF0C\u5BE6\u969B\u4F9D\u5F15\u64CE\u8207\u786C\u9AD4\u800C\u8B8A": "Rough estimate; actual numbers vary by engine and hardware.",
  \u7E3D\u8A18\u61B6\u9AD4\u9810\u7B97: "Total memory budget",
  "\u4E0A\u4E0B\u6587\u8D8A\u9577\u4ECD\u6703\u5403\u8A18\u61B6\u9AD4\uFF1BMoE \u7684\u555F\u7528\u53C3\u6578\u4E0D\u6703\u8B93 KV cache \u6D88\u5931\u3002": "Longer context still consumes memory; MoE active parameters do not make KV cache disappear.",
  "\u4E0A\u4E0B\u6587\u8D8A\u9577\uFF0C\u63A8\u8AD6\u6642\u4FDD\u7559\u7684\u4E2D\u9593\u72C0\u614B\u8D8A\u591A\u3002": "The longer the context, the more intermediate state must be kept during inference.",
  "\u6846\u67B6\u3001\u66AB\u5B58\u3001batch \u8207\u7CFB\u7D71\u672C\u8EAB\u90FD\u9700\u8981\u984D\u5916\u7A7A\u9593\u3002": "Frameworks, temporary buffers, batching, and the OS itself all need extra space.",
  \u600E\u9EBC\u5224\u65B7\u6A21\u578B\u5927\u5C0F: "How to judge model size",
  "7B\uFF5E14B": "7B-14B",
  "30B\uFF5E32B": "30B-32B",
  "\u9069\u5408\u8AB2\u5802\u3001\u6458\u8981\u3001\u5206\u985E\u3001\u7C21\u55AE\u5BA2\u670D\uFF1B\u5BB9\u6613\u5728\u7B46\u96FB\u4E0A\u8DD1\u3002": "Good for class demos, summarization, classification, and simple support; easy to run on a laptop.",
  "\u54C1\u8CEA\u660E\u986F\u63D0\u5347\uFF0C\u4F46\u786C\u9AD4\u9580\u6ABB\u4E0A\u4F86\uFF1B\u9069\u5408\u5C0F\u5718\u968A PoC\u3002": "Quality improves noticeably, but hardware requirements rise; good for small-team PoCs.",
  "\u4E0D\u662F\u4E0D\u80FD\u8DD1\uFF0C\u800C\u662F\u8981\u958B\u59CB\u50CF\u71DF\u904B\u670D\u52D9\u4E00\u6A23\u7BA1\u7406\u6210\u672C\u8207\u4F75\u767C\u3002": "It is not impossible to run, but you must manage cost and concurrency like an operational service.",
  "\u4E0D\u8981\u53EA\u770B\u300C\u80FD\u4E0D\u80FD\u8DD1\u300D\u3002\u771F\u6B63\u8981\u78BA\u8A8D\u7684\u662F\uFF1A\u56DE\u61C9\u901F\u5EA6\u662F\u5426\u53EF\u63A5\u53D7\u3001\u4E0A\u4E0B\u6587\u662F\u5426\u5920\u7528\u3001\u7B54\u6848\u54C1\u8CEA\u662F\u5426\u80FD\u901A\u904E\u4F60\u7684\u4EFB\u52D9\u6E2C\u8A66\u3002": "Do not only ask whether it runs. Check response speed, context adequacy, and whether answer quality passes your task tests.",
  \u5076\u723E: "Occasional",
  \u56FA\u5B9A\u5927\u91CF: "Fixed high volume",
  \u53EF\u5916\u90E8\u8655\u7406: "Can use external services",
  \u4E0D\u80FD\u5916\u6D41: "Cannot leave",
  \u6C92\u4EBA\u7DAD\u8B77: "No maintainer",
  \u6709\u6D41\u7A0B: "Has process",
  \u53EF\u4EBA\u5DE5\u4FEE: "Human can correct",
  \u53EF\u4EE5\u8A8D\u771F\u8A55\u4F30\u81EA\u67B6: "Self-hosting is worth serious evaluation",
  "\u4F60\u5DF2\u7D93\u6709\u660E\u78BA\u7684\u8CC7\u6599\u3001\u7528\u91CF\u6216\u63A7\u5236\u9700\u6C42\u3002\u4E0B\u4E00\u6B65\u4E0D\u662F\u5148\u8CB7 GPU\uFF0C\u800C\u662F\u7528\u4E00\u500B\u5C0F\u4EFB\u52D9\u505A\u53EF\u9A57\u8B49\u7684 PoC\u3002": "You already have a clear data, volume, or control need. The next step is not buying a GPU first; it is a verifiable PoC on one small task.",
  \u5148\u505A\u6DF7\u5408\u67B6\u69CB: "Start with a hybrid architecture",
  "\u628A\u8CC7\u6599\u654F\u611F\u6216\u56FA\u5B9A\u91CD\u8907\u7684\u5DE5\u4F5C\u653E\u672C\u6A5F\uFF1B\u9AD8\u96E3\u5EA6\u63A8\u7406\u3001\u4F4E\u983B\u4EFB\u52D9\u4ECD\u7528 GPT/API \u7576\u57FA\u6E96\u3002": "Move sensitive-data or fixed repetitive work locally; keep hard reasoning and low-frequency tasks on GPT/API as the baseline.",
  "\u5148\u7528 API \u9A57\u8B49\u9700\u6C42": "Validate the need with an API first",
  "\u76EE\u524D\u81EA\u67B6\u5F88\u5BB9\u6613\u8B8A\u6210\u7DAD\u904B\u8CA0\u64D4\u3002\u5148\u628A\u4EFB\u52D9\u3001\u6210\u672C\u3001\u901F\u5EA6\u548C\u54C1\u8CEA\u57FA\u6E96\u8DD1\u6E05\u695A\u3002": "Right now, self-hosting can easily become an operations burden. First clarify the task, cost, speed, and quality baseline.",
  "\u81EA\u67B6\u9069\u4E0D\u9069\u5408\u4F60\uFF1F": "Is self-hosting a fit for you?",
  "\u81EA\u67B6\u4E0D\u662F\u628A ChatGPT \u642C\u56DE\u5BB6\u3002\u9019\u88E1\u5148\u7528\u56DB\u500B\u689D\u4EF6\u5224\u65B7\uFF1A\u8CC7\u6599\u80FD\u4E0D\u80FD\u51FA\u53BB\u3001\u7528\u91CF\u5920\u4E0D\u5920\u56FA\u5B9A\u3001\u8AB0\u80FD\u7DAD\u8B77\u3001\u54C1\u8CEA\u9580\u6ABB\u6709\u591A\u9AD8\u3002": "Self-hosting is not bringing ChatGPT home. Start with four questions: can the data leave, is usage fixed enough, who maintains it, and how high is the quality bar?",
  \u4F60\u7684\u60C5\u5883: "Your situation",
  \u6BCF\u5929\u5927\u6982\u6703\u554F\u5E7E\u6B21: "Roughly how many requests per day",
  "\u4E0D\u7528\u7CBE\u6E96\uFF0C\u91CD\u9EDE\u662F\u770B\u5B83\u662F\u5076\u723E\u4F7F\u7528\uFF0C\u9084\u662F\u56FA\u5B9A\u5927\u91CF\u5DE5\u4F5C\u3002": "It does not need to be precise; the point is whether usage is occasional or fixed high-volume work.",
  \u8CC7\u6599\u80FD\u4E0D\u80FD\u4E1F\u5230\u5916\u90E8\u670D\u52D9: "Can the data go to an external service?",
  "\u516C\u958B\u8CC7\u6599\u3001\u5167\u90E8\u6587\u4EF6\u3001\u5BA2\u6236\u8CC7\u6599\u8207\u6A5F\u5BC6\u8CC7\u6599\uFF0C\u90E8\u7F72\u9078\u64C7\u6703\u5B8C\u5168\u4E0D\u540C\u3002": "Public data, internal documents, customer data, and confidential data lead to very different deployment choices.",
  \u8AB0\u53EF\u4EE5\u7DAD\u8B77\u9019\u5957\u6771\u897F: "Who can maintain this system?",
  "\u81EA\u67B6\u4E4B\u5F8C\uFF0C\u66F4\u65B0\u3001\u76E3\u63A7\u3001\u6B0A\u9650\u3001\u5B89\u5168\u8207\u6545\u969C\u6392\u9664\u90FD\u8981\u6709\u4EBA\u8CA0\u8CAC\u3002": "After self-hosting, someone owns updates, monitoring, permissions, security, and incident response.",
  "\u7B54\u6848\u54C1\u8CEA\u9700\u8981\u591A\u63A5\u8FD1 GPT": "How close must answer quality be to GPT?",
  "\u54C1\u8CEA\u9580\u6ABB\u8D8A\u9AD8\uFF0C\u8D8A\u4E0D\u80FD\u53EA\u770B\u6A21\u578B\u80FD\u4E0D\u80FD\u555F\u52D5\uFF0C\u8981\u62FF\u771F\u5BE6\u4EFB\u52D9\u6E2C\u3002": "The higher the quality bar, the less you can rely on \u201Cit starts\u201D; you need real task tests.",
  \u76EE\u524D\u5224\u65B7: "Current read",
  \u9019\u9801\u8981\u5E36\u8D70\u7684\u5224\u65B7: "What to take away",
  "\u4E0D\u662F\u514D\u8CBB\u7248 ChatGPT": "It is not free ChatGPT",
  "\u81EA\u67B6\u662F\u628A token \u5E33\u55AE\u63DB\u6210\u786C\u9AD4\u3001\u7DAD\u904B\u3001\u66F4\u65B0\u3001\u5B89\u5168\u8207\u54C1\u8CEA\u98A8\u96AA\u3002": "Self-hosting trades the token bill for hardware, operations, updates, security, and quality risk.",
  \u5148\u627E\u7A69\u5B9A\u4EFB\u52D9: "Find a stable task first",
  "\u5148\u7528 API \u8DD1\u51FA\u7A69\u5B9A\u9700\u6C42\uFF0C\u518D\u6C7A\u5B9A\u54EA\u4E9B\u56FA\u5B9A\u5DE5\u4F5C\u503C\u5F97\u642C\u5230\u672C\u6A5F\u6216\u79C1\u6709\u96F2\u3002": "Use an API to prove stable demand first, then decide which fixed tasks are worth moving to local or private cloud.",
  \u5931\u6557\u6642\u8AB0\u8CA0\u8CAC: "Who owns failures?",
  "\u4E0D\u8981\u53EA\u554F\u80FD\u4E0D\u80FD\u8DD1\uFF0C\u4E5F\u8981\u554F\u8AB0\u7DAD\u8B77\u3001\u600E\u9EBC\u66F4\u65B0\u3001\u5982\u4F55\u76E3\u63A7\u3001\u7B54\u6848\u932F\u4E86\u8AB0\u8655\u7406\u3002": "Do not only ask whether it runs; ask who maintains it, how it updates, how it is monitored, and who handles wrong answers.",
  \u5BE6\u4F5C\u793A\u7BC4\u8DEF\u7DDA: "Hands-on demo path",
  \u8D77\u624B\u5F0F: "Starter command",
  "\u6A21\u578B\uFF1A\u8981\u8DD1\u591A\u5927\u3001\u9700\u8981\u591A\u5C11\u8A18\u61B6\u9AD4": "Models: size, architecture, and memory budget",
  "\u8EDF\u9AD4\u5806\u758A\uFF1A\u6A21\u578B\u4E4B\u5916\u9084\u9700\u8981\u4EC0\u9EBC": "Software stack: what else you need beyond the model",
  \u8EDF\u9AD4\u5806\u758A\u4E0D\u662F\u53EA\u6709\u6A21\u578B: "The software stack is not just the model",
  "\u6A21\u578B\u53EA\u662F\u6B0A\u91CD\u6A94\u3002\u771F\u6B63\u8B93\u5B83\u80FD\u88AB\u4F7F\u7528\u7684\uFF0C\u662F\u6A21\u578B\u7BA1\u7406\u3001\u63A8\u8AD6\u5F15\u64CE\u3001API server\u3001UI \u8207\u7DAD\u904B\u8CAC\u4EFB\u3002": "A model is only a weight file. What makes it usable is model management, the inference engine, an API server, UI, and operational responsibility.",
  \u9078\u4E00\u7A2E\u4F7F\u7528\u65B9\u5F0F: "Choose a usage mode",
  \u76EE\u524D\u9078\u64C7: "Current choice",
  \u9069\u5408\u60C5\u5883: "Good fit",
  \u6BCF\u4E00\u5C64\u8AB0\u8CA0\u8CAC: "Who owns each layer",
  \u5BE6\u969B\u6D41\u7A0B: "Actual flow",
  "\u5B78\u7FD2\u91CD\u9EDE\uFF1A\u4E0D\u8981\u53EA\u554F\u300C\u54EA\u500B\u5DE5\u5177\u80FD\u8DD1\u6A21\u578B\u300D\u3002\u8981\u554F\u9019\u500B\u5DE5\u5177\u5E6B\u4F60\u5305\u4E86\u54EA\u4E9B\u5C64\uFF0C\u54EA\u4E9B\u5C64\u6700\u5F8C\u4ECD\u7136\u8981\u7531\u4F60\u6216\u5718\u968A\u8CA0\u8CAC\u3002": "Learning point: do not only ask which tool can run a model. Ask which layers the tool wraps for you, and which layers you or your team still own.",
  \u500B\u4EBA\u672C\u6A5F\u670D\u52D9: "Personal local service",
  "\u6700\u5FEB\u8B93\u672C\u6A5F\u6A21\u578B\u8DD1\u8D77\u4F86\uFF0C\u901A\u5E38\u540C\u6642\u8655\u7406\u4E0B\u8F09\u3001\u555F\u52D5\u8207\u672C\u6A5F API\u3002": "The fastest way to get a local model running; usually handles download, startup, and a local API together.",
  "\u500B\u4EBA\u958B\u767C\u3001\u8AB2\u5802\u793A\u7BC4\u3001\u5C0F\u578B PoC": "Personal development, classroom demos, small PoCs",
  \u9078\u6A21\u578B\u6216\u8CBC\u6A21\u578B\u540D\u7A31: "Choose a model or paste a model name",
  "Ollama \u4E0B\u8F09\u91CF\u5316\u6B0A\u91CD": "Ollama downloads quantized weights",
  \u672C\u6A5F\u555F\u52D5\u63A8\u8AD6\u670D\u52D9: "Start a local inference service",
  "App \u7528 OpenAI-compatible API \u9023\u4E0A\u53BB": "The app connects through an OpenAI-compatible API",
  "\u53EF\u7528 Ollama CLI\u3001\u7B2C\u4E09\u65B9\u804A\u5929 UI\uFF0C\u6216\u4F60\u81EA\u5DF1\u7684 app\u3002": "Use the Ollama CLI, a third-party chat UI, or your own app.",
  \u6A21\u578B\u6A94: "Model file",
  "Ollama \u5E6B\u4F60\u7BA1\u7406\u6A21\u578B\u540D\u7A31\u3001\u4E0B\u8F09\u8207\u5FEB\u53D6\u3002": "Ollama manages model names, downloads, and cache for you.",
  "\u4E3B\u8981\u662F\u500B\u4EBA\u6A5F\u5668\u4E0A\u7684\u7248\u672C\u3001\u6A21\u578B\u66F4\u65B0\u8207\u8A18\u61B6\u9AD4\u9650\u5236\u3002": "Mostly versioning, model updates, and memory limits on a personal machine.",
  "\u5167\u5EFA\u804A\u5929\u4ECB\u9762\uFF0C\u9069\u5408\u4E0D\u7528\u547D\u4EE4\u5217\u4E5F\u80FD\u8A66\u6A21\u578B\u3002": "Built-in chat UI, good for trying models without a command line.",
  "GUI \u986F\u793A\u6A21\u578B\u8207\u91CF\u5316\u683C\u5F0F\uFF0C\u964D\u4F4E\u4E0B\u8F09\u9580\u6ABB\u3002": "The GUI shows models and quantization formats, lowering the download barrier.",
  "\u684C\u9762 app \u5305\u597D\u63A8\u8AD6\u6D41\u7A0B\uFF0C\u9069\u5408\u55AE\u6A5F\u4E92\u52D5\u3002": "The desktop app wraps the inference flow, suitable for single-machine interaction.",
  "\u53EF\u958B OpenAI-compatible local server \u7D66\u5176\u4ED6\u5DE5\u5177\u9023\u3002": "Can start an OpenAI-compatible local server for other tools to connect to.",
  "\u6B63\u5F0F\u591A\u4EBA\u4F7F\u7528\u3001\u6B0A\u9650\u3001\u76E3\u63A7\u8207\u4F75\u767C\u4E0D\u662F\u5B83\u7684\u4E3B\u8981\u5F37\u9805\u3002": "Production multi-user access, permissions, monitoring, and concurrency are not its main strengths.",
  "\u901A\u5E38\u6C92\u6709\u7D66\u4E00\u822C\u4F7F\u7528\u8005\u7684 UI\uFF0C\u8981\u7531\u4F60\u7684\u7522\u54C1\u6216\u5167\u90E8\u5DE5\u5177\u63D0\u4F9B\u3002": "Usually no end-user UI; your product or internal tool must provide it.",
  "\u81EA\u884C\u7BA1\u7406 Hugging Face \u6B0A\u91CD\u3001\u91CF\u5316\u683C\u5F0F\u8207\u7248\u672C\u3002": "Manage Hugging Face weights, quantization formats, and versions yourself.",
  "\u5C08\u6CE8\u9AD8\u541E\u5410\u8207\u670D\u52D9\u5316\uFF0C\u4F8B\u5982 batching\u3001prefix cache\u3001\u4E26\u884C\u3002": "Focused on high-throughput serving, such as batching, prefix cache, and parallelism.",
  "\u63D0\u4F9B OpenAI-compatible \u6216\u81EA\u5BB6 API \u7D66\u7522\u54C1\u547C\u53EB\u3002": "Provides an OpenAI-compatible or custom API for the product to call.",
  "\u6B0A\u9650\u3001\u76E3\u63A7\u3001\u65E5\u8A8C\u3001\u64F4\u7E2E\u3001\u5931\u6557\u91CD\u555F\u8207\u6210\u672C\u90FD\u8981\u7D0D\u5165\u3002": "Permissions, monitoring, logs, scaling, failure recovery, and cost must all be included.",
  "\u684C\u9762 GUI": "Desktop GUI",
  "\u7528\u5716\u5F62\u4ECB\u9762\u627E\u6A21\u578B\u3001\u4E0B\u8F09\u3001\u804A\u5929\uFF0C\u4E5F\u53EF\u4EE5\u4E00\u9375\u555F\u52D5\u672C\u6A5F server\u3002": "Use a graphical interface to find models, download them, chat, and start a local server with one click.",
  "\u975E\u5DE5\u7A0B\u80CC\u666F\u3001\u6A21\u578B\u8A66\u7528\u3001\u684C\u9762 demo": "Non-engineering users, model trials, desktop demos",
  "\u7528 GUI \u641C\u5C0B\u6216\u532F\u5165\u6A21\u578B": "Search or import models in the GUI",
  \u4E0B\u8F09\u5408\u9069\u7684\u91CF\u5316\u7248\u672C: "Download a suitable quantized version",
  \u5728\u5167\u5EFA\u804A\u5929\u5148\u8A66\u54C1\u8CEA: "Try quality in the built-in chat first",
  "\u9700\u8981\u6574\u5408\u6642\u555F\u52D5 local server": "Start a local server when integration is needed",
  \u670D\u52D9\u5316\u63A8\u8AD6: "Serving inference",
  "\u628A\u6A21\u578B\u7576\u6210\u670D\u52D9\u90E8\u7F72\uFF0C\u91CD\u9EDE\u662F\u541E\u5410\u3001\u4F75\u767C\u3001batching\u3001\u76E3\u63A7\u8207\u6B0A\u9650\u3002": "Deploy the model as a service, with focus on throughput, concurrency, batching, monitoring, and permissions.",
  "\u5718\u968A\u670D\u52D9\u3001\u591A\u4EBA\u4F75\u767C\u3001\u6B63\u5F0F\u74B0\u5883": "Team services, concurrent users, production-like environments",
  "\u6E96\u5099 GPU / \u5BB9\u5668 / \u6B0A\u91CD": "Prepare GPU / container / weights",
  "\u555F\u52D5\u63A8\u8AD6 server": "Start the inference server",
  "\u8A2D\u5B9A batching\u3001KV cache \u8207\u4F75\u767C": "Configure batching, KV cache, and concurrency",
  "\u63A5\u4E0A\u6B0A\u9650\u3001\u76E3\u63A7\u3001\u65E5\u8A8C\u8207\u5099\u63F4": "Connect permissions, monitoring, logs, and failover",
  \u672C\u6A5F\u5C0D\u8A71\u57FA\u6E96: "Local chat baseline",
  \u7522\u54C1\u4E32\u63A5\u6E2C\u8A66: "Product integration test",
  \u5C0F\u578B\u8A55\u6E2C\u96C6: "Small evaluation set",
  \u9A57\u6536\u6E05\u55AE: "Acceptance checklist",
  \u9019\u6B21\u8981\u8B49\u660E: "What this run should prove",
  \u6E96\u5099: "Prepare",
  \u57F7\u884C: "Run",
  "\u7528 Ollama \u6216 LM Studio \u958B\u4E00\u500B\u4E2D\u5C0F\u578B\u6A21\u578B\uFF0C\u554F\u540C\u4E00\u7D44\u8AB2\u5802\u984C\u8207\u5DE5\u4F5C\u984C\u3002": "Use Ollama or LM Studio to run a small-to-mid model, then ask the same classroom and work questions.",
  \u7D00\u9304: "Record",
  "\u7559\u4E0B\u5EF6\u9072\u3001\u8A18\u61B6\u9AD4\u3001\u932F\u8AA4\u8A0A\u606F\u8207\u5BE6\u969B\u8F38\u51FA\uFF0C\u4E0D\u53EA\u622A\u4E00\u5F35\u6210\u529F\u756B\u9762\u3002": "Keep latency, memory, error messages, and actual outputs, not just a screenshot of success.",
  "HTTP \u72C0\u614B\u8207\u4E32\u6D41\u662F\u5426\u6B63\u5E38": "Whether HTTP status and streaming behave correctly",
  "\u6A21\u578B\u540D\u7A31\u3001\u932F\u8AA4\u8A0A\u606F\u3001timeout \u662F\u5426\u53EF\u63A7": "Whether model names, error messages, and timeouts are controllable",
  "\u5DE5\u5177\u547C\u53EB\u8207 JSON \u8F38\u51FA\u662F\u5426\u548C GPT \u884C\u70BA\u76F8\u5BB9": "Whether tool calls and JSON output are compatible with GPT behavior",
  "\u4E0D\u8981\u53EA\u770B\u300C\u6709\u56DE\u61C9\u300D": "Do not just check that it responds",
  "\u9019\u9801\u4E0D\u662F\u5728\u6A21\u64EC\u6A21\u578B\u8F38\u51FA\uFF0C\u800C\u662F\u6574\u7406\u4F60\u771F\u7684\u8DD1 Ollama\u3001LM Studio \u6216\u672C\u6A5F API \u6642\u8981\u9A57\u6536\u7684\u8B49\u64DA\u3002\u6210\u529F\u756B\u9762\u5F88\u4FBF\u5B9C\uFF1B\u53EF\u91CD\u8907\u7684\u8B49\u64DA\u6BD4\u8F03\u6709\u7528\u3002": "This page is not simulating model output; it organizes the evidence you should collect when really running Ollama, LM Studio, or a local API. A success screenshot is cheap; repeatable evidence is useful.",
  "1. \u5148\u8DD1\u5C0D\u8A71": "1. First run chat",
  "\u8B49\u660E\u6A21\u578B\u80FD\u5728\u672C\u6A5F\u63A8\u8AD6\u3002": "Prove the model can run inference locally.",
  "2. \u518D\u63A5\u7522\u54C1": "2. Then connect the product",
  "\u8B49\u660E app \u80FD\u547C\u53EB\u672C\u6A5F\u670D\u52D9\u3002": "Prove the app can call the local service.",
  "3. \u6700\u5F8C\u8A55\u6E2C": "3. Finally evaluate",
  "\u8B49\u660E\u54C1\u8CEA\u7B26\u5408\u4F60\u7684\u4EFB\u52D9\u3002": "Prove quality fits your task.",
  "200 \u6B21 / \u5929": "200 times / day",
  \u6A21\u578B\u8A18\u61B6\u9AD4\u9810\u7B97: "Model memory budget",
  "\u8ABF\u6574\u5DE6\u5074\u8A2D\u5B9A\uFF0C\u89C0\u5BDF\u53F3\u5074\u8A18\u61B6\u9AD4\u9810\u7B97\u600E\u9EBC\u8B8A\u3002Dense \u770B\u7E3D\u53C3\u6578\uFF1BMoE \u8981\u540C\u6642\u770B\u7E3D\u6B0A\u91CD\u3001\u555F\u7528\u53C3\u6578\u8207\u4E0A\u4E0B\u6587\u3002": "Adjust the settings on the left and watch how the memory budget changes. Dense models depend on total parameters; MoE needs total weights, active parameters, and context considered separately.",
  \u6A21\u578B\u8A2D\u5B9A: "Model settings",
  "B \u662F billion parameters\u3002\u8D8A\u5927\u901A\u5E38\u80FD\u529B\u8D8A\u5F37\uFF0C\u4E5F\u8D8A\u5403\u8A18\u61B6\u9AD4\u3002": "B means billion parameters. Larger usually means stronger, and also more memory-hungry.",
  "token \u5927\u6982\u80FD\u653E\u591A\u5C11\u8CC7\u6599": "Roughly how much data tokens can hold",
  "16GB VRAM / 32GB unified memory \u8F03\u8212\u670D": "16GB VRAM / 32GB unified memory is more comfortable",
  "\u53EF\u4EE5\u505A\u6BD4\u8F03\u50CF\u6A23\u7684\u672C\u6A5F demo\uFF0C\u4F46\u9577\u4E0A\u4E0B\u6587\u6216\u591A\u4EBA\u4F7F\u7528\u6703\u5403\u7DCA\u3002": "Good enough for a more realistic local demo, but long context or multiple users will get tight.",
  \u53EF\u66FF\u63DB: "Replaceable",
  \u5167\u5EFA: "Built in",
  \u4F60\u8CA0\u8CAC: "You manage it",
  \u63A8\u8AD6\u5F15\u64CE: "Inference engine",
  "\u672C\u6A5F llama.cpp \u7CFB\u5217\u8DEF\u5F91\uFF0C\u9069\u5408\u55AE\u6A5F\u8207\u4F4E\u4F75\u767C\u3002": "A local llama.cpp-family path, suitable for single-machine and low-concurrency use.",
  "\u672C\u6A5F HTTP API\uFF1B\u5F88\u591A app \u53EA\u8981\u6539 baseURL \u5C31\u80FD\u63A5\u3002": "A local HTTP API; many apps can connect by changing only the baseURL.",
  "6.4 \u5BE6\u4F5C\u793A\u7BC4": "6.4 Practical validation",
  "\u5148\u78BA\u8A8D\u6A21\u578B\u771F\u7684\u80FD\u5728\u81EA\u5DF1\u7684\u96FB\u8166\u4E0A\u56DE\u61C9\uFF0C\u800C\u4E14\u901F\u5EA6\u8207\u8A18\u61B6\u9AD4\u4E0D\u662F\u53EA\u5728\u5C55\u793A\u5F71\u7247\u88E1\u597D\u770B\u3002": "First verify that the model can really respond on your own computer, and that speed and memory look good outside a demo video.",
  "\u9078\u6A21\u578B\u3001\u555F\u52D5\u670D\u52D9\u3001\u8A18\u4E0B\u786C\u9AD4\u689D\u4EF6\u3002": "Choose a model, start the service, and record hardware conditions.",
  "\u80FD\u9806\u8DD1\u7C21\u55AE\u804A\u5929\u4E0D\u4EE3\u8868\u80FD\u8655\u7406\u9577\u6587\u4EF6\u6216\u6B63\u5F0F\u670D\u52D9\uFF1B\u5B83\u53EA\u8B49\u660E\u300C\u672C\u6A5F\u63A8\u8AD6\u9019\u689D\u8DEF\u6253\u5F97\u958B\u300D\u3002": "Smooth simple chat does not prove it can handle long documents or production service; it only proves the local-inference path opens.",
  \u8981\u7559\u4E0B\u7684\u8B49\u64DA: "Evidence to keep",
  \u7B2C\u4E00\u6B21\u56DE\u61C9\u8981\u7B49\u591A\u4E45: "How long the first response takes",
  \u9023\u7E8C\u8FFD\u554F\u4E09\u8F2A\u5F8C\u662F\u5426\u9084\u7A69: "Whether it stays stable after three follow-up turns",
  "CPU/GPU/\u8A18\u61B6\u9AD4\u662F\u5426\u903C\u8FD1\u4E0A\u9650": "Whether CPU/GPU/memory approach their limits",
  \u5E38\u898B\u8AA4\u5224: "Common misread",
  "\u56DE\u7B54\u6D41\u66A2\u4F46\u4E8B\u5BE6\u4E0D\u7A69\u3001\u9577\u4E0A\u4E0B\u6587\u8B8A\u6162\u3001\u7B46\u96FB\u98A8\u6247\u8207\u8017\u96FB\u8B93\u8AB2\u5802 demo \u5F88\u5FEB\u5931\u63A7\u3002": "Fluent answers can still be factually unstable; long context slows down; laptop fan noise and power draw can quickly derail a classroom demo."
};
var SelfHostingLab = class extends HTMLElement {
  t(text) {
    if (getCurrentLanguage() === "en")
      return SELF_HOSTING_LAB_EN[text] || i18n(text);
    return text;
  }
  localizeRenderedContent() {
    if (getCurrentLanguage() !== "en") return;
    const translate = (value) => {
      const trimmed = value.trim();
      if (!trimmed) return value;
      if (/^\d+ 人$/.test(trimmed)) {
        const count = Number(trimmed.replace(/\D/g, ""));
        return value.replace(
          trimmed,
          `${count} ${count === 1 ? "user" : "users"}`
        );
      }
      if (/^\d+ 次$/.test(trimmed))
        return value.replace(trimmed, `${trimmed.replace(/\D/g, "")} times`);
      if (/^\d+ 次 \/ 天$/.test(trimmed))
        return value.replace(trimmed, `${trimmed.replace(/\D/g, "")} times / day`);
      if (trimmed.startsWith("Dense\uFF1A"))
        return value.replace(
          trimmed,
          trimmed.replace("Dense\uFF1A", "Dense: ").replace(" \u53C3\u6578\u6BCF token \u90FD\u6703\u53C3\u8207", " parameters participate for every token")
        );
      if (trimmed.startsWith("MoE\uFF1A"))
        return value.replace(
          trimmed,
          trimmed.replace("MoE\uFF1A", "MoE: ").replace(" \u7E3D\u6B0A\u91CD\uFF0C\u7D04 ", " total weights, about ").replace(" \u53C3\u6578/\u6BCF token \u555F\u7528", " active parameters per token")
        );
      if (trimmed.startsWith("\u76EE\u524D\u9078\u5230\uFF1A")) {
        const selected = trimmed.replace("\u76EE\u524D\u9078\u5230\uFF1A", "");
        const translatedSelected = SELF_HOSTING_LAB_EN[selected] || i18n(selected);
        return value.replace(trimmed, `Selected: ${translatedSelected}`);
      }
      if (trimmed.includes(" \xB7 ")) {
        const translatedParts = trimmed.split(" \xB7 ").map((part) => SELF_HOSTING_LAB_EN[part] || i18n(part));
        return value.replace(trimmed, translatedParts.join(" \xB7 "));
      }
      const translated = SELF_HOSTING_LAB_EN[trimmed] || i18n(trimmed);
      return translated === trimmed ? value : value.replace(trimmed, translated);
    };
    const walker = document.createTreeWalker(this, NodeFilter.SHOW_TEXT);
    for (let node = walker.nextNode(); node; node = walker.nextNode())
      node.nodeValue = translate(node.nodeValue);
    for (const element of this.querySelectorAll(
      "[aria-label], [aria-valuetext], [title], [alt]"
    )) {
      for (const attr of ["aria-label", "aria-valuetext", "title", "alt"]) {
        if (element.hasAttribute(attr))
          element.setAttribute(attr, translate(element.getAttribute(attr)));
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
      demo: "chat"
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
    return `<div class="grid gap-2">${options.map(
      (option) => `
					<button data-key="${key}" data-value="${option.value}" class="rounded-lg border px-3 py-2 text-left transition-colors ${String(this.state[key]) === String(option.value) ? "border-primary bg-primary/15 text-foreground" : "border-border bg-muted/20 text-muted-foreground hover:bg-accent/30"}">
						<div class="text-sm font-bold">${option.label}</div>
						<div class="mt-1 text-xs leading-5">${option.help}</div>
					</button>
				`
    ).join("")}</div>`;
  }
  render() {
    const content = {
      overview: this.renderOverview(),
      models: this.renderModels(),
      stack: this.renderStack(),
      hardware: this.renderHardware(),
      demos: this.renderDemos()
    }[this.variant] || this.renderOverview();
    this.innerHTML = `<div class="space-y-4">${content}</div>`;
    this.localizeRenderedContent();
    this.querySelectorAll("input[type='range']").forEach((input) => {
      input.addEventListener("input", (event) => {
        this.setState({
          [event.currentTarget.dataset.key]: Number(event.currentTarget.value)
        });
      });
    });
    this.querySelectorAll("button[data-key]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const value = event.currentTarget.dataset.numeric === "true" ? Number(event.currentTarget.dataset.value) : event.currentTarget.dataset.value;
        this.setState({ [event.currentTarget.dataset.key]: value });
      });
    });
    this.querySelectorAll("button[data-preset]").forEach((button) => {
      button.addEventListener("click", (event) => {
        const presets = {
          dense14: {
            architecture: "dense",
            params: 14,
            activeParams: 14,
            context: 8,
            quant: 4
          },
          qwen36: {
            architecture: "moe",
            params: 35,
            activeParams: 3,
            context: 256,
            quant: 4
          },
          gemma4: {
            architecture: "moe",
            params: 26,
            activeParams: 4,
            context: 128,
            quant: 4
          },
          deepseekv4: {
            architecture: "moe",
            params: 284,
            activeParams: 13,
            context: 1024,
            quant: 4
          }
        };
        this.setState(presets[event.currentTarget.dataset.preset] || {});
      });
    });
  }
  overviewLabel(key) {
    const labels = {
      privacy: [
        "\u516C\u958B\u8CC7\u6599",
        "\u4E00\u822C\u5167\u90E8\u6587\u4EF6",
        "\u5BA2\u6236\u6216\u71DF\u904B\u8CC7\u6599",
        "\u6A5F\u5BC6\u8CC7\u6599",
        "\u4E0D\u80FD\u96E2\u958B\u7D44\u7E54"
      ],
      tech: [
        "\u6C92\u6709\u4EBA\u7DAD\u8B77",
        "\u6709\u4EBA\u6703\u8DD1\u5DE5\u5177",
        "\u6709\u5DE5\u7A0B\u652F\u63F4",
        "\u6709\u5E73\u53F0\u7D93\u9A57",
        "\u6709\u7DAD\u904B\u6D41\u7A0B"
      ],
      quality: [
        "\u80FD\u7528\u5C31\u597D",
        "\u53EF\u4EBA\u5DE5\u4FEE\u6B63",
        "\u591A\u6578\u60C5\u5883\u8981\u7A69",
        "\u8981\u63A5\u8FD1 GPT",
        "\u932F\u4E0D\u8D77"
      ]
    }[key];
    return labels ? labels[this.state[key]] : "";
  }
  overviewFactorRows(usageScore, score) {
    const rows = [
      [
        "\u8CC7\u6599",
        this.overviewLabel("privacy"),
        this.state.privacy >= 3 ? "\u8D8A\u4E0D\u80FD\u5916\u6D41\uFF0C\u8D8A\u6709\u672C\u6A5F\u6216\u79C1\u6709\u90E8\u7F72\u7684\u7406\u7531\u3002" : "\u8CC7\u6599\u9650\u5236\u4E0D\u9AD8\u6642\uFF0C\u5148\u7528 API \u6703\u6BD4\u8F03\u5FEB\u3002"
      ],
      [
        "\u7528\u91CF",
        `${this.state.requests} \u6B21 / \u5929`,
        usageScore >= 3 ? "\u56FA\u5B9A\u4E14\u5927\u91CF\u7684\u5DE5\u4F5C\uFF0C\u624D\u6BD4\u8F03\u53EF\u80FD\u6524\u5E73\u81EA\u67B6\u6210\u672C\u3002" : "\u7528\u91CF\u9084\u5C0F\u6642\uFF0C\u786C\u9AD4\u8207\u7DAD\u904B\u901A\u5E38\u6BD4 token \u5E33\u55AE\u66F4\u8CB4\u3002"
      ],
      [
        "\u7DAD\u904B",
        this.overviewLabel("tech"),
        this.state.tech >= 3 ? "\u6709\u4EBA\u80FD\u66F4\u65B0\u3001\u76E3\u63A7\u8207\u6392\u932F\uFF0C\u81EA\u67B6\u624D\u4E0D\u6703\u5361\u5728\u7B2C\u4E00\u9031\u3002" : "\u7DAD\u904B\u80FD\u529B\u4E0D\u8DB3\u6642\uFF0C\u6A21\u578B\u80FD\u8DD1\u4E0D\u4EE3\u8868\u670D\u52D9\u80FD\u7A69\u5B9A\u4EA4\u4ED8\u3002"
      ],
      [
        "\u54C1\u8CEA",
        this.overviewLabel("quality"),
        this.state.quality >= 3 ? "\u54C1\u8CEA\u9580\u6ABB\u8D8A\u9AD8\uFF0C\u8D8A\u8981\u4FDD\u7559 GPT/API \u4F5C\u70BA\u57FA\u6E96\u6216\u5099\u63F4\u3002" : "\u54C1\u8CEA\u9700\u6C42\u8F03\u9B06\u6642\uFF0C\u53EF\u4EE5\u5148\u7528\u5C0F\u6A21\u578B\u9A57\u8B49\u6D41\u7A0B\u3002"
      ]
    ];
    const meter = Math.max(0, Math.min(100, Math.round(score / 10 * 100)));
    return `
			<div class="native-overview-meter" aria-label="\u81EA\u67B6\u9069\u5408\u5EA6">
				<div class="native-overview-meter-fill" style="width:${meter}%"></div>
			</div>
			<div class="mt-3 divide-y divide-border">
				${rows.map(
      ([label, value, note]) => `
							<div class="native-overview-factor">
								<div class="text-xs font-semibold text-foreground">${label}</div>
								<div>
									<div class="text-sm font-semibold text-foreground">${value}</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${note}</div>
								</div>
							</div>
						`
    ).join("")}
			</div>
		`;
  }
  overviewRange(key, label, min, max, step, suffix = "", help = "") {
    const value = this.state[key];
    const semantic = this.overviewLabel(key);
    const progress = Math.max(
      0,
      Math.min(100, Math.round((value - min) / (max - min) * 100))
    );
    const valueLabel = semantic || `${value}${suffix}`;
    const scaleLabels = {
      requests: ["\u5076\u723E", "\u56FA\u5B9A\u5927\u91CF"],
      privacy: ["\u53EF\u5916\u90E8\u8655\u7406", "\u4E0D\u80FD\u5916\u6D41"],
      tech: ["\u6C92\u4EBA\u7DAD\u8B77", "\u6709\u6D41\u7A0B"],
      quality: ["\u53EF\u4EBA\u5DE5\u4FEE", "\u932F\u4E0D\u8D77"]
    }[key] || ["\u4F4E", "\u9AD8"];
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
      if (this.state.architecture === "moe") return "\u7E3D\u6B0A\u91CD";
      if (this.state.params <= 14) return "\u7B46\u96FB\u5BE6\u9A57\u7D1A";
      if (this.state.params <= 35) return "\u5DE5\u4F5C\u7AD9\u7D1A";
      if (this.state.params <= 80) return "\u4F3A\u670D\u5668\u7D1A";
      return "\u8CC7\u6599\u4E2D\u5FC3\u7D1A";
    }
    if (key === "activeParams") {
      if (this.effectiveActiveParams() <= 4) return "\u4F4E\u555F\u7528\u91CF";
      if (this.effectiveActiveParams() <= 14) return "\u4E2D\u555F\u7528\u91CF";
      return "\u4F3A\u670D\u5668\u7D1A";
    }
    if (key === "quant") {
      return {
        2: "\u6975\u7701\u8A18\u61B6\u9AD4",
        4: "\u7701\u8A18\u61B6\u9AD4",
        8: "\u6298\u8877",
        16: "\u9AD8\u7CBE\u5EA6"
      }[this.state.quant] || `${this.state.quant}-bit`;
    }
    if (key === "context") {
      return this.contextGuide().label;
    }
    return "";
  }
  modelSettingRange(key, label, min, max, step, valueText, help, scaleLabels) {
    const value = this.state[key];
    const progress = Math.max(
      0,
      Math.min(100, Math.round((value - min) / (max - min) * 100))
    );
    const semantic = this.modelSettingLabel(key);
    const valueLabel = semantic ? `${valueText} \xB7 ${semantic}` : valueText;
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
      ["dense", "Dense", "\u6BCF\u500B token \u90FD\u8DD1\u6574\u500B\u6A21\u578B"],
      ["moe", "MoE", "\u8F09\u5165\u5168\u90E8\u6B0A\u91CD\uFF0C\u4F46\u6BCF\u500B token \u53EA\u555F\u7528\u4E00\u90E8\u5206\u5C08\u5BB6"]
    ];
    return `
			<div class="native-setting-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">\u6A21\u578B\u67B6\u69CB</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">Dense \u770B\u7E3D\u53C3\u6578\uFF1BMoE \u8981\u5206\u958B\u770B\u7E3D\u6B0A\u91CD\u8207\u6BCF token \u555F\u7528\u53C3\u6578\u3002</div>
					</div>
					<div class="native-setting-value">${this.state.architecture === "moe" ? "MoE \xB7 sparse" : "Dense"}</div>
				</div>
				<div class="native-architecture-grid" role="group" aria-label="\u6A21\u578B\u67B6\u69CB">
					${options.map(
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
							`
    ).join("")}
				</div>
			</div>
		`;
  }
  modelPresets() {
    const presets = [
      {
        id: "dense14",
        label: "Dense 14B",
        note: "\u50B3\u7D71\u5C0F\u6A21\u578B\u57FA\u6E96",
        patch: {
          architecture: "dense",
          params: 14,
          activeParams: 14,
          context: 8,
          quant: 4
        }
      },
      {
        id: "qwen36",
        label: "Qwen3.6 35B-A3B",
        note: "35B total / 3B active / 256k native",
        patch: {
          architecture: "moe",
          params: 35,
          activeParams: 3,
          context: 256,
          quant: 4
        }
      },
      {
        id: "gemma4",
        label: "Gemma 4 26B-A4B",
        note: "26B total / 4B active / 128k",
        patch: {
          architecture: "moe",
          params: 26,
          activeParams: 4,
          context: 128,
          quant: 4
        }
      },
      {
        id: "deepseekv4",
        label: "DeepSeek V4 Flash",
        note: "284B total / 13B active / 1M",
        patch: {
          architecture: "moe",
          params: 284,
          activeParams: 13,
          context: 1024,
          quant: 4
        }
      }
    ];
    const active = presets.find(
      (preset) => preset.patch.architecture === this.state.architecture && preset.patch.params === this.state.params && preset.patch.activeParams === this.state.activeParams && preset.patch.context === this.state.context && preset.patch.quant === this.state.quant
    )?.id;
    return `
			<div class="native-setting-control">
				<div>
					<div class="text-sm font-semibold text-foreground">\u5E38\u898B\u6A21\u578B\u7BC4\u4F8B</div>
					<div class="mt-1 text-xs leading-5 text-muted-foreground">\u9EDE\u4E00\u500B\u7BC4\u4F8B\uFF0C\u770B dense \u8207 MoE \u7684\u8A18\u61B6\u9AD4\u53D6\u6368\u5DEE\u5728\u54EA\u88E1\u3002</div>
				</div>
				<div class="native-preset-grid">
					${presets.map(
      (preset) => `
								<button
									type="button"
									data-preset="${preset.id}"
									class="native-preset-option ${active === preset.id ? "is-active" : ""}"
									aria-pressed="${active === preset.id ? "true" : "false"}"
								>
									<span class="native-preset-title">${preset.label}</span>
									<span class="native-preset-note">${preset.note}</span>
								</button>
							`
    ).join("")}
				</div>
			</div>
		`;
  }
  modelQuantChoices() {
    const options = [
      [2, "2-bit", "\u6975\u7701\uFF0C\u4F46\u54C1\u8CEA\u98A8\u96AA\u6700\u9AD8"],
      [4, "4-bit", "\u5E38\u898B\u7701\u8A18\u61B6\u9AD4\u9078\u64C7"],
      [8, "8-bit", "\u54C1\u8CEA\u8207\u8A18\u61B6\u9AD4\u6298\u8877"],
      [16, "16-bit", "\u8F03\u5B8C\u6574\uFF0C\u4F46\u6700\u5403\u8A18\u61B6\u9AD4"]
    ];
    return `
			<div class="native-setting-control">
				<div class="flex items-start justify-between gap-3">
					<div>
						<div class="text-sm font-semibold text-foreground">\u91CF\u5316\u4F4D\u5143</div>
						<div class="mt-1 text-xs leading-5 text-muted-foreground">\u91CF\u5316\u4E0D\u662F\u9023\u7E8C\u65CB\u9215\uFF0C\u800C\u662F\u5E38\u898B\u683C\u5F0F\u9078\u64C7\u3002\u8D8A\u4F4E\u8D8A\u7701\u8A18\u61B6\u9AD4\uFF0C\u4E5F\u8D8A\u53EF\u80FD\u72A7\u7272\u54C1\u8CEA\u3002</div>
					</div>
					<div class="native-setting-value">${this.state.quant}-bit \xB7 ${this.modelSettingLabel("quant")}</div>
				</div>
				<div class="native-quant-grid" role="group" aria-label="\u91CF\u5316\u4F4D\u5143">
					${options.map(
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
							`
    ).join("")}
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
    const recommendation = score >= 6 ? [
      "\u53EF\u4EE5\u8A8D\u771F\u8A55\u4F30\u81EA\u67B6",
      "\u4F60\u5DF2\u7D93\u6709\u660E\u78BA\u7684\u8CC7\u6599\u3001\u7528\u91CF\u6216\u63A7\u5236\u9700\u6C42\u3002\u4E0B\u4E00\u6B65\u4E0D\u662F\u5148\u8CB7 GPU\uFF0C\u800C\u662F\u7528\u4E00\u500B\u5C0F\u4EFB\u52D9\u505A\u53EF\u9A57\u8B49\u7684 PoC\u3002"
    ] : score >= 3 ? [
      "\u5148\u505A\u6DF7\u5408\u67B6\u69CB",
      "\u628A\u8CC7\u6599\u654F\u611F\u6216\u56FA\u5B9A\u91CD\u8907\u7684\u5DE5\u4F5C\u653E\u672C\u6A5F\uFF1B\u9AD8\u96E3\u5EA6\u63A8\u7406\u3001\u4F4E\u983B\u4EFB\u52D9\u4ECD\u7528 GPT/API \u7576\u57FA\u6E96\u3002"
    ] : [
      "\u5148\u7528 API \u9A57\u8B49\u9700\u6C42",
      "\u76EE\u524D\u81EA\u67B6\u5F88\u5BB9\u6613\u8B8A\u6210\u7DAD\u904B\u8CA0\u64D4\u3002\u5148\u628A\u4EFB\u52D9\u3001\u6210\u672C\u3001\u901F\u5EA6\u548C\u54C1\u8CEA\u57FA\u6E96\u8DD1\u6E05\u695A\u3002"
    ];
    return `
			${this.card(
      "\u81EA\u67B6\u9069\u4E0D\u9069\u5408\u4F60\uFF1F",
      `<div class="mb-3 text-sm leading-6 text-muted-foreground">
					\u81EA\u67B6\u4E0D\u662F\u628A ChatGPT \u642C\u56DE\u5BB6\u3002\u9019\u88E1\u5148\u7528\u56DB\u500B\u689D\u4EF6\u5224\u65B7\uFF1A\u8CC7\u6599\u80FD\u4E0D\u80FD\u51FA\u53BB\u3001\u7528\u91CF\u5920\u4E0D\u5920\u56FA\u5B9A\u3001\u8AB0\u80FD\u7DAD\u8B77\u3001\u54C1\u8CEA\u9580\u6ABB\u6709\u591A\u9AD8\u3002
				</div>
				<div class="native-overview-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">\u4F60\u7684\u60C5\u5883</div>
						${this.overviewRange("requests", "\u6BCF\u5929\u5927\u6982\u6703\u554F\u5E7E\u6B21", 0, 2e3, 50, " \u6B21", "\u4E0D\u7528\u7CBE\u6E96\uFF0C\u91CD\u9EDE\u662F\u770B\u5B83\u662F\u5076\u723E\u4F7F\u7528\uFF0C\u9084\u662F\u56FA\u5B9A\u5927\u91CF\u5DE5\u4F5C\u3002")}
						${this.overviewRange("privacy", "\u8CC7\u6599\u80FD\u4E0D\u80FD\u4E1F\u5230\u5916\u90E8\u670D\u52D9", 0, 4, 1, "", "\u516C\u958B\u8CC7\u6599\u3001\u5167\u90E8\u6587\u4EF6\u3001\u5BA2\u6236\u8CC7\u6599\u8207\u6A5F\u5BC6\u8CC7\u6599\uFF0C\u90E8\u7F72\u9078\u64C7\u6703\u5B8C\u5168\u4E0D\u540C\u3002")}
						${this.overviewRange("tech", "\u8AB0\u53EF\u4EE5\u7DAD\u8B77\u9019\u5957\u6771\u897F", 0, 4, 1, "", "\u81EA\u67B6\u4E4B\u5F8C\uFF0C\u66F4\u65B0\u3001\u76E3\u63A7\u3001\u6B0A\u9650\u3001\u5B89\u5168\u8207\u6545\u969C\u6392\u9664\u90FD\u8981\u6709\u4EBA\u8CA0\u8CAC\u3002")}
						${this.overviewRange("quality", "\u7B54\u6848\u54C1\u8CEA\u9700\u8981\u591A\u63A5\u8FD1 GPT", 0, 4, 1, "", "\u54C1\u8CEA\u9580\u6ABB\u8D8A\u9AD8\uFF0C\u8D8A\u4E0D\u80FD\u53EA\u770B\u6A21\u578B\u80FD\u4E0D\u80FD\u555F\u52D5\uFF0C\u8981\u62FF\u771F\u5BE6\u4EFB\u52D9\u6E2C\u3002")}
					</div>
					<div class="rounded-lg border border-border bg-background/60 p-4">
						<div class="text-xs font-semibold text-muted-foreground">\u76EE\u524D\u5224\u65B7</div>
						<div class="mt-2 text-xl font-semibold tracking-normal text-foreground">${recommendation[0]}</div>
						<div class="mt-2 text-sm leading-6 text-muted-foreground">${recommendation[1]}</div>
						<div class="mt-4">
							${this.overviewFactorRows(usageScore, score)}
						</div>
					</div>
				</div>`
    )}
			${this.card(
      "\u9019\u9801\u8981\u5E36\u8D70\u7684\u5224\u65B7",
      `<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">\u4E0D\u662F\u514D\u8CBB\u7248 ChatGPT</div>
						<div class="leading-6 text-muted-foreground">\u81EA\u67B6\u662F\u628A token \u5E33\u55AE\u63DB\u6210\u786C\u9AD4\u3001\u7DAD\u904B\u3001\u66F4\u65B0\u3001\u5B89\u5168\u8207\u54C1\u8CEA\u98A8\u96AA\u3002</div>
					</div>
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">\u5148\u627E\u7A69\u5B9A\u4EFB\u52D9</div>
						<div class="leading-6 text-muted-foreground">\u5148\u7528 API \u8DD1\u51FA\u7A69\u5B9A\u9700\u6C42\uFF0C\u518D\u6C7A\u5B9A\u54EA\u4E9B\u56FA\u5B9A\u5DE5\u4F5C\u503C\u5F97\u642C\u5230\u672C\u6A5F\u6216\u79C1\u6709\u96F2\u3002</div>
					</div>
					<div class="native-decision-row px-3 py-3">
						<div class="font-semibold text-foreground">\u5931\u6557\u6642\u8AB0\u8CA0\u8CAC</div>
						<div class="leading-6 text-muted-foreground">\u4E0D\u8981\u53EA\u554F\u80FD\u4E0D\u80FD\u8DD1\uFF0C\u4E5F\u8981\u554F\u8AB0\u7DAD\u8B77\u3001\u600E\u9EBC\u66F4\u65B0\u3001\u5982\u4F55\u76E3\u63A7\u3001\u7B54\u6848\u932F\u4E86\u8AB0\u8655\u7406\u3002</div>
					</div>
				</div>`
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
      total: weights + kv + runtime
    };
  }
  contextGuide() {
    const k = this.state.context;
    if (k <= 8) {
      return {
        label: "\u77ED\u6587\u4EF6",
        plain: "\u5927\u6982\u50CF\u5E7E\u9801 PDF\u3001\u5E7E\u7BC7\u65B0\u805E\uFF0C\u6216\u4E00\u5C0F\u6BB5\u7A0B\u5F0F\u78BC\u3002\u9069\u5408\u77ED\u554F\u7B54\u3001\u77ED\u7FFB\u8B6F\u3001\u55AE\u9801 OCR\u3002",
        tasks: [
          ["QA", "\u4E00\u5C0F\u4EFD\u6587\u4EF6\u5167\u627E\u7B54\u6848"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u77ED\u6587\u6216\u4E00\u5C0F\u7BC0\u624B\u518A"],
          ["OCR", "\u55AE\u9801\u8868\u683C\u6216\u6536\u64DA"],
          ["Coding", "\u4E00\u500B\u5C0F\u6A94\u6848\u7247\u6BB5"]
        ]
      };
    }
    if (k <= 16) {
      return {
        label: "\u4E2D\u77ED\u6587\u4EF6",
        plain: "\u5927\u6982\u50CF\u4E00\u4EFD\u77ED\u5831\u544A\u3001\u4E00\u7AE0\u6559\u6750\uFF0C\u6216\u5E7E\u500B\u7A0B\u5F0F\u6A94\u3002\u9069\u5408\u6458\u8981\u3001\u6BD4\u5C0D\u3001\u7FFB\u8B6F\u4E00\u6BB5\u6587\u4EF6\u3002",
        tasks: [
          ["QA", "\u77ED\u5831\u544A\u6216\u55AE\u7AE0\u6559\u6750"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u5E7E\u9801\u5408\u7D04\u3001\u8B1B\u7FA9\u6216\u8349\u7A3F"],
          ["OCR", "\u5C11\u91CF\u6383\u63CF\u9801\u9762"],
          ["Coding", "\u5C0F\u529F\u80FD\u7684\u76F8\u95DC\u6A94\u6848"]
        ]
      };
    }
    if (k <= 32) {
      return {
        label: "\u4E2D\u578B\u6587\u4EF6",
        plain: "\u5927\u6982\u50CF\u4E00\u4EFD\u8F03\u5B8C\u6574\u7684 PDF \u7BC0\u9078\u3001\u5E7E\u7AE0\u6559\u6750\uFF0C\u6216\u4E00\u7D44\u76F8\u95DC\u7A0B\u5F0F\u6A94\u3002\u9069\u5408\u591A\u6BB5 QA\u3001\u6458\u8981\u8207\u6539\u5BEB\u3002",
        tasks: [
          ["QA", "\u4E00\u4EFD\u4E2D\u578B\u5831\u544A"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u8F03\u9577\u6587\u4EF6\uFF0C\u4F46\u4ECD\u8981\u5206\u6BB5\u6AA2\u67E5"],
          ["OCR", "\u591A\u9801\u8868\u683C\u8207\u6BB5\u843D"],
          ["Coding", "\u4E00\u500B\u5C0F\u6A21\u7D44\u4E0A\u4E0B\u6587"]
        ]
      };
    }
    if (k <= 64) {
      return {
        label: "\u9577\u6587\u4EF6",
        plain: "\u5927\u6982\u50CF\u9577\u5831\u544A\u3001\u5927\u91CF OCR \u6587\u5B57\uFF0C\u6216\u591A\u500B\u7A0B\u5F0F\u6A94\u3002\u4ECD\u4E0D\u7B49\u65BC\u6574\u672C\u66F8\u6216\u6574\u500B\u5C08\u6848\uFF1B\u4EFB\u52D9\u8D8A\u8907\u96DC\u8D8A\u9700\u8981\u5206\u6BB5\u3002",
        tasks: [
          ["QA", "\u9577\u5831\u544A\u6216\u591A\u6587\u4EF6\u7BC0\u9078"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u8AD6\u6587\u8349\u7A3F\u8207\u53C3\u8003\u6BB5\u843D"],
          ["OCR", "\u591A\u9801\u8CA1\u5831\u6216\u8868\u683C"],
          ["Coding", "\u8DE8\u6A94\u6848\u9664\u932F\u8207\u91CD\u69CB"]
        ]
      };
    }
    if (k <= 128) {
      return {
        label: "\u8D85\u9577\u6587\u4EF6",
        plain: "\u5927\u6982\u50CF\u77ED\u66F8\u3001\u5927\u578B\u898F\u683C\u66F8\u3001\u5927\u91CF OCR \u7D50\u679C\uFF0C\u6216\u8F03\u591A\u7A0B\u5F0F\u6A94\u3002\u770B\u4F3C\u5F88\u5927\uFF0C\u4F46\u5B8C\u6574\u66F8\u7C4D\u3001\u5B8C\u6574\u5C08\u6848\u3001\u9577\u671F\u5C0D\u8A71\u4ECD\u53EF\u80FD\u8D85\u51FA\u7BC4\u570D\u3002",
        tasks: [
          ["QA", "\u9577\u5831\u544A\u52A0\u591A\u4EFD\u9644\u4EF6"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u77ED\u66F8\u7AE0\u7BC0\u6216\u9577\u7BC7\u8349\u7A3F"],
          ["OCR", "\u5927\u91CF\u6383\u63CF\u9801\u9762\u7BC0\u9078"],
          ["Coding", "\u4E2D\u578B\u5C08\u6848\u7684\u5C40\u90E8\u4E0A\u4E0B\u6587"]
        ]
      };
    }
    if (k <= 256) {
      return {
        label: "\u5927\u578B\u8CC7\u6599\u5305",
        plain: "\u5927\u6982\u50CF\u4E00\u672C\u77ED\u66F8\u3001\u539A\u898F\u683C\u66F8\u3001\u8F03\u591A\u6383\u63CF\u9801 OCR\uFF0C\u6216\u4E00\u500B\u4E2D\u578B\u5C08\u6848\u7684\u5C40\u90E8\u8CC7\u6599\u3002\u4E0A\u4E0B\u6587\u8B8A\u5927\uFF0C\u8A18\u61B6\u9AD4\u4E5F\u6703\u660E\u986F\u589E\u52A0\u3002",
        tasks: [
          ["QA", "\u5927\u578B\u898F\u683C\u66F8\u8207\u9644\u4EF6"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u77ED\u66F8\u6216\u9577\u7BC7\u5831\u544A\u8349\u7A3F"],
          ["OCR", "\u5927\u91CF\u9801\u9762\u62BD\u53D6\u5F8C\u7684\u6587\u5B57"],
          ["Coding", "\u4E2D\u578B\u5C08\u6848\u7684\u4E00\u5927\u6BB5\u4E0A\u4E0B\u6587"]
        ]
      };
    }
    if (k <= 512) {
      return {
        label: "\u5DE8\u91CF\u8CC7\u6599\u5305",
        plain: "\u53EF\u4EE5\u653E\u9032\u975E\u5E38\u591A\u6587\u5B57\uFF0C\u4F46\u4E0D\u4EE3\u8868\u6A21\u578B\u6703\u81EA\u52D5\u7406\u89E3\u5168\u90E8\u91CD\u9EDE\u3002\u8D8A\u5927\u7684\u4E0A\u4E0B\u6587\u8D8A\u9700\u8981\u5206\u6BB5\u3001\u7D22\u5F15\u3001\u6458\u8981\u8207\u9A57\u8B49\u7B56\u7565\u3002",
        tasks: [
          ["QA", "\u591A\u4EFD\u9577\u6587\u4EF6\u8207\u9644\u4EF6"],
          ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u9577\u66F8\u7A3F\u7BC0\u9078\u8207\u53C3\u8003\u6750\u6599"],
          ["OCR", "\u5927\u91CF\u6383\u63CF\u6587\u4EF6\u62BD\u53D6\u7D50\u679C"],
          ["Coding", "\u8F03\u5927\u5C08\u6848\u7684\u591A\u6A21\u7D44\u4E0A\u4E0B\u6587"]
        ]
      };
    }
    return {
      label: "\u767E\u842C\u7D1A\u4E0A\u4E0B\u6587",
      plain: "1M token \u662F\u767E\u842C\u7D1A\u4E0A\u4E0B\u6587\uFF0C\u9069\u5408\u5C55\u793A\u300C\u80FD\u585E\u5F88\u591A\u300D\u548C\u300C\u6210\u672C\u4E5F\u5F88\u9AD8\u300D\u7684\u53D6\u6368\u3002\u5B83\u4E0D\u662F\u842C\u80FD\u8A18\u61B6\u9AD4\uFF1B\u627E\u91CD\u9EDE\u4ECD\u9700\u8981\u7D50\u69CB\u5316\u6D41\u7A0B\u3002",
      tasks: [
        ["QA", "\u591A\u672C\u624B\u518A\u6216\u5927\u91CF\u9644\u4EF6"],
        ["\u7FFB\u8B6F\uFF0F\u5BEB\u4F5C", "\u9577\u7BC7\u66F8\u7A3F\u8207\u5927\u91CF\u53C3\u8003"],
        ["OCR", "\u8D85\u5927\u91CF\u6587\u4EF6\u62BD\u53D6\u7D50\u679C"],
        ["Coding", "\u5927\u578B\u5C08\u6848\u7684\u4E00\u90E8\u5206\uFF0C\u4F46\u4ECD\u4E0D\u662F\u6574\u500B\u4E16\u754C"]
      ]
    };
  }
  contextScaleRows() {
    return [
      ["8k", "\u77ED\u6587\u4EF6", "\u5E7E\u9801 PDF\u3001\u5E7E\u7BC7\u65B0\u805E\u3001\u77ED\u554F\u7B54\u3001\u55AE\u9801 OCR\u3001\u55AE\u4E00\u7A0B\u5F0F\u7247\u6BB5"],
      ["16k", "\u4E2D\u77ED\u6587\u4EF6", "\u77ED\u5831\u544A\u3001\u4E00\u7AE0\u6559\u6750\u3001\u5E7E\u9801\u5408\u7D04\u6216\u8B1B\u7FA9\u3001\u5C0F\u529F\u80FD\u76F8\u95DC\u6A94\u6848"],
      ["32k", "\u4E2D\u578B\u6587\u4EF6", "\u5B8C\u6574\u5831\u544A\u7BC0\u9078\u3001\u5E7E\u7AE0\u6559\u6750\u3001\u591A\u9801\u8868\u683C OCR\u3001\u5C0F\u6A21\u7D44\u4E0A\u4E0B\u6587"],
      ["64k", "\u9577\u6587\u4EF6", "\u9577\u5831\u544A\u3001\u591A\u6587\u4EF6\u7BC0\u9078\u3001\u8AD6\u6587\u8349\u7A3F\u8207\u53C3\u8003\u6BB5\u843D\u3001\u8DE8\u6A94\u6848\u9664\u932F"],
      [
        "128k",
        "\u8D85\u9577\u6587\u4EF6",
        "\u77ED\u66F8\u7AE0\u7BC0\u3001\u5927\u578B\u898F\u683C\u66F8\u3001\u5927\u91CF OCR \u6587\u5B57\u3001\u4E2D\u578B\u5C08\u6848\u5C40\u90E8\u4E0A\u4E0B\u6587"
      ],
      [
        "256k",
        "\u5927\u578B\u8CC7\u6599\u5305",
        "\u4E00\u672C\u77ED\u66F8\u3001\u539A\u898F\u683C\u66F8\u3001\u5927\u91CF OCR \u7D50\u679C\u3001\u4E2D\u578B\u5C08\u6848\u8F03\u5927\u4E0A\u4E0B\u6587"
      ],
      [
        "512k",
        "\u5DE8\u91CF\u8CC7\u6599\u5305",
        "\u591A\u4EFD\u9577\u6587\u4EF6\u3001\u9577\u66F8\u7A3F\u53C3\u8003\u6750\u6599\u3001\u8F03\u5927\u5C08\u6848\u591A\u6A21\u7D44\u4E0A\u4E0B\u6587"
      ],
      [
        "1M",
        "\u767E\u842C\u7D1A\u4E0A\u4E0B\u6587",
        "\u5927\u91CF\u6587\u4EF6\u6216\u7A0B\u5F0F\u8CC7\u6599\uFF1B\u80FD\u653E\u5F88\u591A\uFF0C\u4F46\u66F4\u9700\u8981\u6458\u8981\u3001\u7D22\u5F15\u8207\u9A57\u8B49"
      ]
    ];
  }
  renderContextScale() {
    const selected = this.state.context <= 8 ? "8k" : this.state.context <= 16 ? "16k" : this.state.context <= 32 ? "32k" : this.state.context <= 64 ? "64k" : this.state.context <= 128 ? "128k" : this.state.context <= 256 ? "256k" : this.state.context <= 512 ? "512k" : "1M";
    return `
			<div>
				<div class="mb-1.5 text-[11px] font-semibold text-muted-foreground">token \u5927\u6982\u80FD\u653E\u591A\u5C11\u8CC7\u6599</div>
				<div class="native-context-scale">
					${this.contextScaleRows().map(
      ([tokens, label, examples]) => `
								<div class="native-context-scale-row ${tokens === selected ? "is-active" : ""}">
									<div class="font-mono text-xs font-semibold text-foreground">${tokens}</div>
									<div>
										<div class="text-xs font-semibold text-foreground">${label}</div>
										<div class="mt-0.5 text-[11px] leading-4 text-muted-foreground">${examples}</div>
									</div>
								</div>
							`
    ).join("")}
				</div>
				<div class="mt-1.5 text-[11px] leading-4 text-muted-foreground">\u9019\u4E0D\u662F\u56FA\u5B9A\u9801\u6578\u63DB\u7B97\u3002PDF \u6392\u7248\u3001\u8868\u683C\u3001\u7A0B\u5F0F\u78BC\u3001OCR \u932F\u5B57\u8207\u5716\u7247\u8AAA\u660E\u90FD\u6703\u6539\u8B8A\u5BE6\u969B token \u6578\u3002</div>
			</div>
		`;
  }
  renderContextGuide() {
    const guide = this.contextGuide();
    return `
			<div class="rounded-md border border-border bg-muted/20 p-3">
				<div class="flex items-center justify-between gap-3">
					<div class="text-xs font-semibold text-foreground">\u76EE\u524D\u9078\u5230\uFF1A${guide.label}</div>
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
				${guide.tasks.map(
      ([task, fit]) => `
							<div class="rounded-md bg-background/70 px-2 py-1.5">
								<div class="text-[11px] font-semibold text-foreground">${task}</div>
								<div class="mt-0.5 text-[11px] leading-4 text-muted-foreground">${fit}</div>
							</div>
						`
    ).join("")}
			</div>
		`;
  }
  memoryComponentScales() {
    const maxWeights = 300 * 2;
    const maxKv = 1024 * 0.8;
    return {
      weights: maxWeights,
      kv: maxKv,
      runtime: (maxWeights + maxKv) * 0.25
    };
  }
  renderMemorySegment(label, value, scale, className, note) {
    const width = Math.min(100, Math.max(3, Math.round(value / scale * 100)));
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
    const fit = memory <= 8 ? [
      "\u4E00\u822C 16GB \u7B46\u96FB\u4E5F\u53EF\u5BE6\u9A57",
      "\u9019\u7A2E\u8A2D\u5B9A\u9069\u5408\u8AB2\u5802\u3001\u5C0F\u578B\u6458\u8981\u3001\u5206\u985E\u6216\u5148\u6E2C\u6D41\u7A0B\u3002"
    ] : memory <= 16 ? [
      "16GB VRAM / 32GB unified memory \u8F03\u8212\u670D",
      "\u53EF\u4EE5\u505A\u6BD4\u8F03\u50CF\u6A23\u7684\u672C\u6A5F demo\uFF0C\u4F46\u9577\u4E0A\u4E0B\u6587\u6216\u591A\u4EBA\u4F7F\u7528\u6703\u5403\u7DCA\u3002"
    ] : memory <= 24 ? [
      "\u9700\u8981 24GB \u7B49\u7D1A GPU \u6216\u9AD8\u8A18\u61B6\u9AD4 Mac",
      "\u9019\u5DF2\u7D93\u63A5\u8FD1\u500B\u4EBA\u5DE5\u4F5C\u7AD9\u7B49\u7D1A\uFF1B\u4E0D\u8981\u628A\u5B83\u7576\u6210\u666E\u901A\u7B46\u96FB\u60C5\u5883\u3002"
    ] : [
      "\u5EFA\u8B70\u96F2\u7AEF\u6216\u4F3A\u670D\u5668 GPU",
      "\u9019\u7A2E\u8A2D\u5B9A\u4E0D\u662F\u4E0D\u80FD\u8DD1\uFF0C\u800C\u662F\u8981\u958B\u59CB\u8003\u616E\u90E8\u7F72\u3001\u4F75\u767C\u3001\u76E3\u63A7\u8207\u6210\u672C\u3002"
    ];
    return `
			${this.card(
      "\u6A21\u578B\u8A18\u61B6\u9AD4\u9810\u7B97",
      `<div class="mb-3 text-sm leading-6 text-muted-foreground">
					\u8ABF\u6574\u5DE6\u5074\u8A2D\u5B9A\uFF0C\u89C0\u5BDF\u53F3\u5074\u8A18\u61B6\u9AD4\u9810\u7B97\u600E\u9EBC\u8B8A\u3002Dense \u770B\u7E3D\u53C3\u6578\uFF1BMoE \u8981\u540C\u6642\u770B\u7E3D\u6B0A\u91CD\u3001\u555F\u7528\u53C3\u6578\u8207\u4E0A\u4E0B\u6587\u3002
				</div>
				<div class="native-model-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">\u6A21\u578B\u8A2D\u5B9A</div>
						<div class="grid divide-y divide-border">
							${this.modelArchitectureChoices()}
							${this.modelPresets()}
							${this.modelSettingRange("params", this.state.architecture === "moe" ? "\u7E3D\u53C3\u6578 / \u6B0A\u91CD\u5927\u5C0F" : "\u6A21\u578B\u5927\u5C0F", 1, 300, 1, `${this.state.params}B`, this.state.architecture === "moe" ? "MoE \u4ECD\u7136\u8981\u653E\u5F97\u4E0B\u5168\u90E8\u5C08\u5BB6\u6B0A\u91CD\uFF1B\u9019\u5F71\u97FF\u4E0B\u8F09\u5927\u5C0F\u3001\u78C1\u789F\u8207\u5E38\u99D0\u8A18\u61B6\u9AD4\u3002" : "B \u662F billion parameters\u3002\u8D8A\u5927\u901A\u5E38\u80FD\u529B\u8D8A\u5F37\uFF0C\u4E5F\u8D8A\u5403\u8A18\u61B6\u9AD4\u3002", ["\u5C0F\u6A21\u578B", "\u5927\u578B\u6B0A\u91CD"])}
							${this.state.architecture === "moe" ? this.modelSettingRange("activeParams", "\u6BCF token \u555F\u7528\u53C3\u6578", 1, Math.max(1, this.state.params), 1, `${this.effectiveActiveParams()}B`, "MoE \u63A8\u8AD6\u6642\u6BCF\u500B token \u53EA\u8DD1\u90E8\u5206\u5C08\u5BB6\uFF1B\u9019\u6BD4\u8F03\u63A5\u8FD1\u55AE token \u8A08\u7B97\u91CF\u8207\u901F\u5EA6\u611F\u3002", ["\u5C11\u91CF\u555F\u7528", "\u5927\u91CF\u555F\u7528"]) : ""}
							${this.modelQuantChoices()}
							<div class="grid gap-2 px-3 py-3">
								<div class="flex items-center justify-between gap-3">
									<div>
										<div class="text-sm font-semibold text-foreground">\u4E00\u6B21\u80FD\u653E\u9032\u6A21\u578B\u7684\u8CC7\u6599\u91CF</div>
										<div class="mt-0.5 text-xs leading-5 text-muted-foreground">token \u662F\u6A21\u578B\u5207\u6587\u5B57\u7684\u55AE\u4F4D\u3002\u9801\u6578\u53EA\u662F\u7C97\u4F30\uFF1BPDF\u3001\u8868\u683C\u3001\u7A0B\u5F0F\u78BC\u3001OCR \u90FD\u6703\u5403\u4E0D\u4E00\u6A23\u591A\u3002</div>
									</div>
									<div class="native-setting-value">${this.contextValueText()} \xB7 ${this.contextGuide().label}</div>
								</div>
								<div>
									<input
										data-key="context"
										type="range"
										min="8"
										max="1024"
										step="8"
										value="${this.state.context}"
										aria-label="\u4E00\u6B21\u80FD\u653E\u9032\u6A21\u578B\u7684\u8CC7\u6599\u91CF"
										aria-valuetext="${this.contextValueText()} \xB7 ${this.contextGuide().label}"
										class="native-setting-slider"
										style="--range-progress:${Math.round((this.state.context - 8) / 1016 * 100)}%"
									/>
									<div class="native-setting-scale" aria-hidden="true">
										<span>\u77ED\u6587\u4EF6</span>
										<span>1M</span>
									</div>
								</div>
								${this.renderContextScale()}
							</div>
						</div>
					</div>
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
							<div class="text-xs font-semibold text-muted-foreground">\u4F30\u7B97\u7D50\u679C</div>
							<div class="text-xs text-muted-foreground">\u7C97\u4F30\uFF0C\u5BE6\u969B\u4F9D\u5F15\u64CE\u8207\u786C\u9AD4\u800C\u8B8A</div>
						</div>
						<div class="grid gap-4 p-3">
							<div>
								<div class="flex items-end justify-between gap-3">
									<div>
										<div class="text-xs text-muted-foreground">\u7E3D\u8A18\u61B6\u9AD4\u9810\u7B97</div>
										<div class="mt-1 text-3xl font-semibold tracking-normal text-foreground">${memory} GB</div>
										<div class="mt-1 text-xs leading-5 text-muted-foreground">${this.state.architecture === "moe" ? `MoE\uFF1A${this.state.params}B \u7E3D\u6B0A\u91CD\uFF0C\u7D04 ${parts.activeParams}B \u53C3\u6578/\u6BCF token \u555F\u7528` : `Dense\uFF1A${this.state.params}B \u53C3\u6578\u6BCF token \u90FD\u6703\u53C3\u8207`}</div>
									</div>
									<div class="text-right">
										<div class="text-sm font-semibold text-foreground">${fit[0]}</div>
										<div class="mt-1 max-w-sm text-xs leading-5 text-muted-foreground">${fit[1]}</div>
									</div>
								</div>
							</div>
							<div class="grid gap-3 border-t border-border pt-3">
								<div class="flex items-center justify-between gap-3 text-[11px] text-muted-foreground">
									<span>\u5206\u9805\u8A18\u61B6\u9AD4\u7528\u91CF</span>
									<span>\u5404\u5217\u986F\u793A\u81EA\u5DF1\u7684\u8B8A\u5316\u5E45\u5EA6</span>
								</div>
								${this.renderMemorySegment("\u6A21\u578B\u6B0A\u91CD", parts.weights, scales.weights, "native-memory-fill-weights", "\u6A21\u578B\u672C\u9AD4\u3002\u6A21\u578B\u8D8A\u5927\u3001\u91CF\u5316\u4F4D\u5143\u8D8A\u9AD8\uFF0C\u9019\u584A\u8D8A\u5927\u3002")}
								${this.renderMemorySegment("KV cache", parts.kv, scales.kv, "native-memory-fill-kv", this.state.architecture === "moe" ? "\u4E0A\u4E0B\u6587\u8D8A\u9577\u4ECD\u6703\u5403\u8A18\u61B6\u9AD4\uFF1BMoE \u7684\u555F\u7528\u53C3\u6578\u4E0D\u6703\u8B93 KV cache \u6D88\u5931\u3002" : "\u4E0A\u4E0B\u6587\u8D8A\u9577\uFF0C\u63A8\u8AD6\u6642\u4FDD\u7559\u7684\u4E2D\u9593\u72C0\u614B\u8D8A\u591A\u3002")}
								${this.renderMemorySegment("\u57F7\u884C\u9918\u88D5", parts.runtime, scales.runtime, "native-memory-fill-runtime", "\u6846\u67B6\u3001\u66AB\u5B58\u3001batch \u8207\u7CFB\u7D71\u672C\u8EAB\u90FD\u9700\u8981\u984D\u5916\u7A7A\u9593\u3002")}
							</div>
						</div>
					</div>
				</div>`
    )}
			${this.card(
      "\u600E\u9EBC\u5224\u65B7\u6A21\u578B\u5927\u5C0F",
      `<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="grid gap-2 border-b border-border px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">7B\uFF5E14B</div>
						<div class="leading-6 text-muted-foreground">\u9069\u5408\u8AB2\u5802\u3001\u6458\u8981\u3001\u5206\u985E\u3001\u7C21\u55AE\u5BA2\u670D\uFF1B\u5BB9\u6613\u5728\u7B46\u96FB\u4E0A\u8DD1\u3002</div>
					</div>
					<div class="grid gap-2 border-b border-border px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">30B\uFF5E32B</div>
						<div class="leading-6 text-muted-foreground">\u54C1\u8CEA\u660E\u986F\u63D0\u5347\uFF0C\u4F46\u786C\u9AD4\u9580\u6ABB\u4E0A\u4F86\uFF1B\u9069\u5408\u5C0F\u5718\u968A PoC\u3002</div>
					</div>
					<div class="grid gap-2 px-3 py-3 md:grid-cols-[120px_1fr]">
						<div class="font-semibold text-foreground">70B+</div>
						<div class="leading-6 text-muted-foreground">\u4E0D\u662F\u4E0D\u80FD\u8DD1\uFF0C\u800C\u662F\u8981\u958B\u59CB\u50CF\u71DF\u904B\u670D\u52D9\u4E00\u6A23\u7BA1\u7406\u6210\u672C\u8207\u4F75\u767C\u3002</div>
					</div>
				</div>
				<div class="mt-3 text-xs leading-5 text-muted-foreground">
					\u4E0D\u8981\u53EA\u770B\u300C\u80FD\u4E0D\u80FD\u8DD1\u300D\u3002\u771F\u6B63\u8981\u78BA\u8A8D\u7684\u662F\uFF1A\u56DE\u61C9\u901F\u5EA6\u662F\u5426\u53EF\u63A5\u53D7\u3001\u4E0A\u4E0B\u6587\u662F\u5426\u5920\u7528\u3001\u7B54\u6848\u54C1\u8CEA\u662F\u5426\u80FD\u901A\u904E\u4F60\u7684\u4EFB\u52D9\u6E2C\u8A66\u3002
				</div>`
    )}
		`;
  }
  renderStack() {
    const stacks = {
      ollama: {
        label: "Ollama",
        value: "\u500B\u4EBA\u672C\u6A5F\u670D\u52D9",
        help: "\u6700\u5FEB\u8B93\u672C\u6A5F\u6A21\u578B\u8DD1\u8D77\u4F86\uFF0C\u901A\u5E38\u540C\u6642\u8655\u7406\u4E0B\u8F09\u3001\u555F\u52D5\u8207\u672C\u6A5F API\u3002",
        best: "\u500B\u4EBA\u958B\u767C\u3001\u8AB2\u5802\u793A\u7BC4\u3001\u5C0F\u578B PoC",
        flow: [
          "\u9078\u6A21\u578B\u6216\u8CBC\u6A21\u578B\u540D\u7A31",
          "Ollama \u4E0B\u8F09\u91CF\u5316\u6B0A\u91CD",
          "\u672C\u6A5F\u555F\u52D5\u63A8\u8AD6\u670D\u52D9",
          "App \u7528 OpenAI-compatible API \u9023\u4E0A\u53BB"
        ],
        layers: [
          ["UI", "\u53EF\u7528 Ollama CLI\u3001\u7B2C\u4E09\u65B9\u804A\u5929 UI\uFF0C\u6216\u4F60\u81EA\u5DF1\u7684 app\u3002", "\u53EF\u66FF\u63DB"],
          ["\u6A21\u578B\u6A94", "Ollama \u5E6B\u4F60\u7BA1\u7406\u6A21\u578B\u540D\u7A31\u3001\u4E0B\u8F09\u8207\u5FEB\u53D6\u3002", "\u5167\u5EFA"],
          ["\u63A8\u8AD6\u5F15\u64CE", "\u672C\u6A5F llama.cpp \u7CFB\u5217\u8DEF\u5F91\uFF0C\u9069\u5408\u55AE\u6A5F\u8207\u4F4E\u4F75\u767C\u3002", "\u5167\u5EFA"],
          [
            "API Server",
            "\u672C\u6A5F HTTP API\uFF1B\u5F88\u591A app \u53EA\u8981\u6539 baseURL \u5C31\u80FD\u63A5\u3002",
            "\u5167\u5EFA"
          ],
          ["\u7DAD\u904B", "\u4E3B\u8981\u662F\u500B\u4EBA\u6A5F\u5668\u4E0A\u7684\u7248\u672C\u3001\u6A21\u578B\u66F4\u65B0\u8207\u8A18\u61B6\u9AD4\u9650\u5236\u3002", "\u4F60\u8CA0\u8CAC"]
        ]
      },
      lmstudio: {
        label: "LM Studio",
        value: "\u684C\u9762 GUI",
        help: "\u7528\u5716\u5F62\u4ECB\u9762\u627E\u6A21\u578B\u3001\u4E0B\u8F09\u3001\u804A\u5929\uFF0C\u4E5F\u53EF\u4EE5\u4E00\u9375\u555F\u52D5\u672C\u6A5F server\u3002",
        best: "\u975E\u5DE5\u7A0B\u80CC\u666F\u3001\u6A21\u578B\u8A66\u7528\u3001\u684C\u9762 demo",
        flow: [
          "\u7528 GUI \u641C\u5C0B\u6216\u532F\u5165\u6A21\u578B",
          "\u4E0B\u8F09\u5408\u9069\u7684\u91CF\u5316\u7248\u672C",
          "\u5728\u5167\u5EFA\u804A\u5929\u5148\u8A66\u54C1\u8CEA",
          "\u9700\u8981\u6574\u5408\u6642\u555F\u52D5 local server"
        ],
        layers: [
          ["UI", "\u5167\u5EFA\u804A\u5929\u4ECB\u9762\uFF0C\u9069\u5408\u4E0D\u7528\u547D\u4EE4\u5217\u4E5F\u80FD\u8A66\u6A21\u578B\u3002", "\u5167\u5EFA"],
          ["\u6A21\u578B\u6A94", "GUI \u986F\u793A\u6A21\u578B\u8207\u91CF\u5316\u683C\u5F0F\uFF0C\u964D\u4F4E\u4E0B\u8F09\u9580\u6ABB\u3002", "\u5167\u5EFA"],
          ["\u63A8\u8AD6\u5F15\u64CE", "\u684C\u9762 app \u5305\u597D\u63A8\u8AD6\u6D41\u7A0B\uFF0C\u9069\u5408\u55AE\u6A5F\u4E92\u52D5\u3002", "\u5167\u5EFA"],
          [
            "API Server",
            "\u53EF\u958B OpenAI-compatible local server \u7D66\u5176\u4ED6\u5DE5\u5177\u9023\u3002",
            "\u53EF\u958B\u555F"
          ],
          ["\u7DAD\u904B", "\u6B63\u5F0F\u591A\u4EBA\u4F7F\u7528\u3001\u6B0A\u9650\u3001\u76E3\u63A7\u8207\u4F75\u767C\u4E0D\u662F\u5B83\u7684\u4E3B\u8981\u5F37\u9805\u3002", "\u6709\u9650"]
        ]
      },
      vllm: {
        label: "vLLM / SGLang",
        value: "\u670D\u52D9\u5316\u63A8\u8AD6",
        help: "\u628A\u6A21\u578B\u7576\u6210\u670D\u52D9\u90E8\u7F72\uFF0C\u91CD\u9EDE\u662F\u541E\u5410\u3001\u4F75\u767C\u3001batching\u3001\u76E3\u63A7\u8207\u6B0A\u9650\u3002",
        best: "\u5718\u968A\u670D\u52D9\u3001\u591A\u4EBA\u4F75\u767C\u3001\u6B63\u5F0F\u74B0\u5883",
        flow: [
          "\u6E96\u5099 GPU / \u5BB9\u5668 / \u6B0A\u91CD",
          "\u555F\u52D5\u63A8\u8AD6 server",
          "\u8A2D\u5B9A batching\u3001KV cache \u8207\u4F75\u767C",
          "\u63A5\u4E0A\u6B0A\u9650\u3001\u76E3\u63A7\u3001\u65E5\u8A8C\u8207\u5099\u63F4"
        ],
        layers: [
          [
            "UI",
            "\u901A\u5E38\u6C92\u6709\u7D66\u4E00\u822C\u4F7F\u7528\u8005\u7684 UI\uFF0C\u8981\u7531\u4F60\u7684\u7522\u54C1\u6216\u5167\u90E8\u5DE5\u5177\u63D0\u4F9B\u3002",
            "\u4F60\u8CA0\u8CAC"
          ],
          ["\u6A21\u578B\u6A94", "\u81EA\u884C\u7BA1\u7406 Hugging Face \u6B0A\u91CD\u3001\u91CF\u5316\u683C\u5F0F\u8207\u7248\u672C\u3002", "\u4F60\u8CA0\u8CAC"],
          [
            "\u63A8\u8AD6\u5F15\u64CE",
            "\u5C08\u6CE8\u9AD8\u541E\u5410\u8207\u670D\u52D9\u5316\uFF0C\u4F8B\u5982 batching\u3001prefix cache\u3001\u4E26\u884C\u3002",
            "\u6838\u5FC3"
          ],
          [
            "API Server",
            "\u63D0\u4F9B OpenAI-compatible \u6216\u81EA\u5BB6 API \u7D66\u7522\u54C1\u547C\u53EB\u3002",
            "\u6838\u5FC3"
          ],
          [
            "\u7DAD\u904B",
            "\u6B0A\u9650\u3001\u76E3\u63A7\u3001\u65E5\u8A8C\u3001\u64F4\u7E2E\u3001\u5931\u6557\u91CD\u555F\u8207\u6210\u672C\u90FD\u8981\u7D0D\u5165\u3002",
            "\u4F60\u8CA0\u8CAC"
          ]
        ]
      }
    };
    const current = stacks[this.state.stack];
    return `
			${this.card(
      "\u8EDF\u9AD4\u5806\u758A\u4E0D\u662F\u53EA\u6709\u6A21\u578B",
      `<div class="mb-3 text-sm leading-6 text-muted-foreground">
					\u6A21\u578B\u53EA\u662F\u6B0A\u91CD\u6A94\u3002\u771F\u6B63\u8B93\u5B83\u80FD\u88AB\u4F7F\u7528\u7684\uFF0C\u662F\u6A21\u578B\u7BA1\u7406\u3001\u63A8\u8AD6\u5F15\u64CE\u3001API server\u3001UI \u8207\u7DAD\u904B\u8CAC\u4EFB\u3002
				</div>
				<div class="native-stack-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">\u9078\u4E00\u7A2E\u4F7F\u7528\u65B9\u5F0F</div>
						<div class="native-stack-option-grid p-3">
							${Object.entries(stacks).map(
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
									`
      ).join("")}
						</div>
					</div>
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="flex items-center justify-between gap-3 border-b border-border px-3 py-2">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">\u76EE\u524D\u9078\u64C7</div>
								<div class="mt-1 text-lg font-semibold tracking-normal text-foreground">${current.label}</div>
							</div>
							<div class="native-setting-value">${current.value}</div>
						</div>
						<div class="grid gap-4 p-3">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">\u9069\u5408\u60C5\u5883</div>
								<div class="mt-1 text-sm leading-6 text-foreground">${current.best}</div>
							</div>
							<div class="border-t border-border pt-3">
								<div class="mb-2 text-xs font-semibold text-muted-foreground">\u6BCF\u4E00\u5C64\u8AB0\u8CA0\u8CAC</div>
								<div>
									${current.layers.map(
        ([layer, note, owner]) => `
												<div class="native-stack-layer">
													<div class="text-xs font-semibold text-foreground">${layer}</div>
													<div class="text-xs leading-5 text-muted-foreground">${note}</div>
													<div><span class="native-stack-badge">${owner}</span></div>
												</div>
											`
      ).join("")}
								</div>
							</div>
							<div class="border-t border-border pt-3">
								<div class="mb-2 text-xs font-semibold text-muted-foreground">\u5BE6\u969B\u6D41\u7A0B</div>
								<div class="native-stack-flow">
									${current.flow.map(
        (step, index) => `
												<div class="grid grid-cols-[1.75rem_1fr] items-start gap-2 rounded-md bg-muted/20 px-2 py-2 text-xs">
													<span class="grid h-5 w-5 place-items-center rounded-full bg-background text-[11px] font-semibold text-muted-foreground">${index + 1}</span>
													<span class="leading-5 text-foreground">${step}</span>
												</div>
											`
      ).join("")}
								</div>
							</div>
							<div class="rounded-md border border-border bg-muted/20 p-3 text-xs leading-5 text-muted-foreground">
								\u5B78\u7FD2\u91CD\u9EDE\uFF1A\u4E0D\u8981\u53EA\u554F\u300C\u54EA\u500B\u5DE5\u5177\u80FD\u8DD1\u6A21\u578B\u300D\u3002\u8981\u554F\u9019\u500B\u5DE5\u5177\u5E6B\u4F60\u5305\u4E86\u54EA\u4E9B\u5C64\uFF0C\u54EA\u4E9B\u5C64\u6700\u5F8C\u4ECD\u7136\u8981\u7531\u4F60\u6216\u5718\u968A\u8CA0\u8CAC\u3002
							</div>
						</div>
					</div>
				</div>`
    )}
		`;
  }
  renderHardware() {
    const options = {
      m5max128: {
        label: "MacBook Pro M5 Max",
        short: "Apple Silicon 128GB",
        price: "\u7D04 US$5.5k-7.3k",
        memory: 128,
        usable: 96,
        type: "unified memory",
        best: "\u5E36\u8457\u8D70\u7684\u55AE\u4EBA\u958B\u767C\u6A5F\u3002\u9069\u5408\u672C\u6A5F demo\u3001\u8AB2\u5802\u3001\u6E2C\u5C0F\u5230\u4E2D\u578B\u6A21\u578B\uFF0C\u6216\u628A GPT \u5DE5\u4F5C\u6D41\u642C\u4E00\u90E8\u5206\u5230\u672C\u6A5F\u3002",
        watch: "128GB \u4E0D\u662F 128GB VRAM\u3002\u7CFB\u7D71\u3001\u700F\u89BD\u5668\u3001IDE \u548C\u6A21\u578B\u5F15\u64CE\u90FD\u6703\u5403 unified memory\uFF1B\u9577\u4E0A\u4E0B\u6587\u6216\u591A\u4EBA\u670D\u52D9\u6703\u5F88\u5FEB\u5361\u4F4F\u3002",
        note: "M5 Max \u53EF\u5230 128GB unified memory\uFF1B\u50F9\u683C\u4F9D\u87A2\u5E55\u5C3A\u5BF8\u3001SSD \u8207\u5BA2\u88FD\u5316\u800C\u8B8A\u3002"
      },
      studio512: {
        label: "Mac Studio M3 Ultra",
        short: "512GB unified",
        price: "\u66FE\u53EF\u9078\u914D\u5230 US$14.1k",
        memory: 512,
        usable: 430,
        type: "unified memory",
        best: "\u60F3\u5728\u55AE\u6A5F\u4E0A\u653E\u975E\u5E38\u5927\u7684\u6B0A\u91CD\u3001\u9577\u4E0A\u4E0B\u6587\u6216\u5927\u6279\u6587\u4EF6\u5BE6\u9A57\u3002\u5F37\u9805\u662F\u5BB9\u91CF\u8207\u4F4E\u529F\u8017\u3002",
        watch: "512GB \u914D\u7F6E\u5728 2026 \u5E74\u4F9B\u8CA8\u5F88\u4E0D\u7A69\uFF0C\u751A\u81F3\u66FE\u5F9E Apple \u5B98\u7DB2\u9078\u914D\u9805\u76EE\u6D88\u5931\u3002\u80FD\u653E\u4E0B\u4E0D\u4EE3\u8868 tokens/sec \u6703\u50CF\u8CC7\u6599\u4E2D\u5FC3 GPU\u3002",
        note: "\u628A\u5B83\u7576\u6210\u7279\u6B8A\u5DE5\u4F5C\u7AD9\uFF0C\u4E0D\u662F\u4E00\u822C\u63A1\u8CFC\u57FA\u6E96\u3002"
      },
      dgxSpark: {
        label: "NVIDIA DGX Spark",
        short: "GB10 128GB",
        price: "\u7D04 US$4.7k",
        memory: 128,
        usable: 108,
        type: "coherent unified memory",
        best: "\u60F3\u7528 NVIDIA \u8EDF\u9AD4\u68E7\u3001\u6E2C\u63A5\u8FD1\u90E8\u7F72\u7AEF\u7684\u6D41\u7A0B\uFF0C\u4E26\u5728\u684C\u4E0A\u8DD1\u8F03\u5927\u7684\u6A21\u578B\u539F\u578B\u3002",
        watch: "\u662F AI dev kit\uFF0C\u4E0D\u662F\u842C\u80FD\u684C\u6A5F\u3002\u50F9\u683C\u3001\u4F9B\u8CA8\u548C ARM/NVIDIA \u8EDF\u9AD4\u76F8\u5BB9\u6027\u90FD\u8981\u5148\u78BA\u8A8D\u3002",
        note: "128GB coherent unified memory\uFF1B\u5B9A\u4F4D\u63A5\u8FD1\u500B\u4EBA AI supercomputer\u3002"
      },
      strixHalo: {
        label: "AMD Strix Halo",
        short: "Ryzen AI Max+ 395",
        price: "\u7D04 US$2.3k-3.4k",
        memory: 128,
        usable: 88,
        type: "shared LPDDR5X",
        best: "\u9810\u7B97\u6709\u9650\u4F46\u60F3\u8981 128GB \u7D1A\u5171\u4EAB\u8A18\u61B6\u9AD4\u7684\u5C0F\u578B\u684C\u6A5F\u3002\u9069\u5408\u63A2\u7D22\u3001\u6559\u5B78\u548C\u975E NVIDIA \u8DEF\u7DDA\u3002",
        watch: "ROCm / Vulkan / llama.cpp \u652F\u63F4\u8981\u770B\u5DE5\u5177\uFF1B\u6709\u4E9B\u5DE5\u4F5C\u6D41\u4ECD\u7136\u662F NVIDIA CUDA \u6700\u7701\u4E8B\u3002",
        note: "\u8A31\u591A\u6A5F\u5668\u53EF\u628A\u90E8\u5206\u8A18\u61B6\u9AD4\u5207\u7D66 iGPU\uFF0C\u5E38\u898B\u8AAA\u6CD5\u662F\u6700\u9AD8\u7D04 96GB VRAM \u985E\u914D\u7F6E\u3002"
      },
      rtxPro6000: {
        label: "RTX PRO 6000 Blackwell",
        short: "96GB GDDR7 ECC",
        price: "\u7D04 US$8k-10k+",
        memory: 96,
        usable: 90,
        type: "dedicated VRAM",
        best: "\u9700\u8981 CUDA\u3001\u751F\u7522\u7D1A\u9A45\u52D5\u3001ECC VRAM\u3001\u5DE5\u4F5C\u7AD9\u7A69\u5B9A\u6027\u8207\u8F03\u9AD8\u983B\u5BEC\u3002\u9069\u5408\u6B63\u5F0F PoC \u6216\u5C0F\u578B\u670D\u52D9\u3002",
        watch: "\u9019\u901A\u5E38\u53EA\u662F\u4E00\u5F35\u5361\uFF0C\u9084\u8981\u4E3B\u6A5F\u677F\u3001\u96FB\u6E90\u3001\u6563\u71B1\u3001\u6A5F\u6BBC\u8207\u7DAD\u904B\u3002\u8CB7\u5361\u4E0D\u7B49\u65BC\u8CB7\u5230\u670D\u52D9\u3002",
        note: "\u5E38\u88AB\u62FF\u4F86\u548C RTX 5090 \u985E\u6D88\u8CBB\u5361\u6BD4\u8F03\uFF1B\u5DEE\u50F9\u4E3B\u8981\u8CB7 VRAM\u3001ECC\u3001\u9A45\u52D5\u8207\u4FDD\u56FA\u3002"
      }
    };
    const selected = options[this.state.gpu] || options.m5max128;
    const parts = this.modelMemoryBreakdown();
    const userCount = Math.max(1, this.state.users);
    const projected = Math.ceil(
      parts.weights + parts.kv * userCount + parts.runtime
    );
    const headroom = selected.usable - projected;
    const fit = headroom >= 32 ? [
      "\u9918\u88D5\u5145\u8DB3",
      "\u53EF\u4EE5\u505A\u8F03\u9577\u4E0A\u4E0B\u6587\u3001\u8F03\u5927 batch \u6216\u66F4\u591A\u5BE6\u9A57\uFF0C\u4F46\u4ECD\u8981\u5BE6\u6E2C\u901F\u5EA6\u3002",
      "text-emerald-600"
    ] : headroom >= 0 ? [
      "\u53EF\u4EE5\u8DD1\uFF0C\u9918\u88D5\u6709\u9650",
      "\u9069\u5408 demo \u6216\u55AE\u4EBA\u6E2C\u8A66\uFF1B\u6B63\u5F0F\u670D\u52D9\u8981\u964D\u4F4E\u4E0A\u4E0B\u6587\u3001\u7E2E\u5C0F\u6A21\u578B\u6216\u6E1B\u5C11\u4F75\u767C\u3002",
      "text-amber-600"
    ] : [
      "\u6703\u7206\u6216\u56B4\u91CD\u63DB\u9801",
      "\u9019\u7D44\u8A2D\u5B9A\u4E0D\u9069\u5408\u9019\u53F0\u6A5F\u5668\u3002\u5148\u964D\u91CF\u5316\u3001\u7E2E\u4E0A\u4E0B\u6587\u3001\u6539\u5C0F\u6A21\u578B\uFF0C\u6216\u63DB\u96F2\u7AEF/API\u3002",
      "text-red-600"
    ];
    const memoryRows = [
      ["\u6A21\u578B\u6B0A\u91CD", parts.weights, "\u6A21\u578B\u672C\u9AD4\uFF0CMoE \u4E5F\u8981\u653E\u4E0B\u5168\u90E8\u5C08\u5BB6\u6B0A\u91CD\u3002"],
      [
        "\u4E0A\u4E0B\u6587 / \u6BCF\u4EBA",
        parts.kv,
        `${this.contextValueText()} \u5C0D\u8A71\u6216\u6587\u4EF6\u6703\u4FDD\u7559\u7684 KV cache\u3002`
      ],
      [
        "\u4F7F\u7528\u8005\u6578",
        parts.kv * userCount,
        `${userCount} \u500B\u540C\u6642\u5C0D\u8A71\u6642\uFF0CKV cache \u6703\u8DDF\u8457\u653E\u5927\u3002`
      ],
      ["\u57F7\u884C\u9918\u88D5", parts.runtime, "\u6846\u67B6\u3001\u66AB\u5B58\u3001batch \u8207\u7CFB\u7D71\u672C\u8EAB\u9700\u8981\u7684\u7A7A\u9593\u3002"]
    ];
    const maxBar = Math.max(selected.usable, projected, 1);
    return `
			${this.card(
      "\u786C\u9AD4\u63A1\u8CFC\u524D\u5148\u4F30\u9019\u4E09\u4EF6\u4E8B",
      `<div class="mb-4 text-sm leading-6 text-muted-foreground">
					\u9019\u9801\u4E0D\u662F\u6392\u884C\u699C\u3002\u5148\u9078\u4E00\u53F0\u5E38\u898B\u6A5F\u5668\uFF0C\u518D\u8ABF\u6574\u6A21\u578B\u3001\u91CF\u5316\u3001\u4E0A\u4E0B\u6587\u8207\u540C\u6642\u4F7F\u7528\u4EBA\u6578\uFF0C\u770B\u300C\u80FD\u653E\u4E0B\u300D\u548C\u300C\u503C\u5F97\u8CB7\u300D\u662F\u4E0D\u662F\u540C\u4E00\u4EF6\u4E8B\u3002
				</div>
				<div class="native-hardware-grid">
					<div class="overflow-hidden rounded-lg border border-border bg-background/60">
						<div class="border-b border-border px-3 py-2 text-xs font-semibold text-muted-foreground">\u5E38\u898B\u786C\u9AD4\u9078\u9805</div>
						<div class="native-hardware-option-grid p-3">
							${Object.entries(options).map(
        ([value, option]) => `
										<button
											type="button"
											data-key="gpu"
											data-value="${value}"
											class="native-hardware-option ${this.state.gpu === value ? "is-active" : ""}"
											aria-pressed="${this.state.gpu === value ? "true" : "false"}"
										>
											<span class="native-hardware-option-title">${option.label}</span>
											<span class="native-hardware-option-meta">${option.short} \xB7 ${option.price}</span>
										</button>
									`
      ).join("")}
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
										<div class="text-xs text-muted-foreground">${selected.memory}GB \xB7 ${selected.type}</div>
									</div>
								</div>
							</div>
							<div class="native-hardware-summary">
								<div>
									<div class="text-xs font-semibold text-muted-foreground">${this.t("\u7C97\u4F30\u9700\u6C42")}</div>
									<div class="mt-1 text-3xl font-semibold text-foreground">${projected} GB</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${this.t("\u6A21\u578B\u6B0A\u91CD")} + ${userCount} ${getCurrentLanguage() === "en" ? userCount === 1 ? "user's context" : "users' context" : "\u4EBA\u4E0A\u4E0B\u6587"} + ${this.t("\u57F7\u884C\u9918\u88D5")}</div>
								</div>
								<div>
									<div class="text-xs font-semibold text-muted-foreground">${this.t("\u53EF\u7528\u7A7A\u9593")}</div>
									<div class="mt-1 text-3xl font-semibold text-foreground">${selected.usable} GB</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${this.t("\u6263\u6389\u7CFB\u7D71\u3001\u684C\u9762 app\u3001\u6846\u67B6\u8207\u4FDD\u5B88\u9918\u88D5\u5F8C\u7684\u4F30\u7B97")}</div>
								</div>
								<div>
									<div class="text-xs font-semibold text-muted-foreground">${this.t("\u5224\u65B7")}</div>
									<div class="mt-1 text-lg font-semibold ${fit[2]}">${fit[0]}</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${fit[1]}</div>
								</div>
							</div>
							<div class="grid gap-3 p-4">
								<div class="text-xs font-semibold text-muted-foreground">${this.t("\u8A18\u61B6\u9AD4\u7528\u5728\u54EA\u88E1")}</div>
								${memoryRows.map(([label, value, note]) => {
        const width = Math.max(
          3,
          Math.min(100, Math.round(value / maxBar * 100))
        );
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
      }).join("")}
							</div>
							<div class="grid gap-3 p-4 md:grid-cols-2">
								<div class="rounded-md bg-muted/20 p-3">
									<div class="text-xs font-semibold text-foreground">\u9069\u5408</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${selected.best}</div>
								</div>
								<div class="rounded-md bg-muted/20 p-3">
									<div class="text-xs font-semibold text-foreground">\u8981\u5C0F\u5FC3</div>
									<div class="mt-1 text-xs leading-5 text-muted-foreground">${selected.watch}</div>
								</div>
							</div>
						</div>
					</div>
				</div>`
    )}
			${this.card(
      "\u8981\u8DD1\u7684\u6A21\u578B\u8A2D\u5B9A",
      `<div class="overflow-hidden rounded-lg border border-border bg-background/60">
					<div class="grid divide-y divide-border">
						${this.modelArchitectureChoices()}
						${this.modelPresets()}
						${this.modelSettingRange("params", this.state.architecture === "moe" ? "\u7E3D\u53C3\u6578 / \u6B0A\u91CD\u5927\u5C0F" : "\u6A21\u578B\u5927\u5C0F", 1, 300, 1, `${this.state.params}B`, this.state.architecture === "moe" ? "MoE \u53EF\u4EE5\u6BCF\u6B21\u53EA\u555F\u7528\u90E8\u5206\u5C08\u5BB6\uFF0C\u4F46\u6574\u5305\u6B0A\u91CD\u4ECD\u7136\u8981\u653E\u5F97\u4E0B\u3002" : "Dense \u6A21\u578B\u6BCF\u500B token \u5E7E\u4E4E\u90FD\u6703\u7528\u5230\u6574\u500B\u6A21\u578B\u3002", ["\u5C0F\u6A21\u578B", "\u5927\u578B\u6B0A\u91CD"])}
						${this.state.architecture === "moe" ? this.modelSettingRange("activeParams", "\u6BCF token \u555F\u7528\u53C3\u6578", 1, Math.max(1, this.state.params), 1, `${this.effectiveActiveParams()}B`, "\u9019\u6BD4\u8F03\u63A5\u8FD1\u901F\u5EA6\u8207\u55AE token \u8A08\u7B97\u91CF\uFF1B\u4F46\u4E0D\u4EE3\u8868\u7E3D\u6B0A\u91CD\u53EF\u4EE5\u4E0D\u7528\u8F09\u5165\u3002", ["\u5C11\u91CF\u555F\u7528", "\u5927\u91CF\u555F\u7528"]) : ""}
						${this.modelQuantChoices()}
						${this.modelSettingRange("context", "\u4E0A\u4E0B\u6587\u9577\u5EA6", 8, 1024, 8, this.contextValueText(), "\u4E0A\u4E0B\u6587\u8D8A\u9577\uFF0C\u6BCF\u500B\u540C\u6642\u5C0D\u8A71\u90FD\u6703\u591A\u5403\u4E00\u4EFD KV cache\u3002\u6B63\u5F0F\u670D\u52D9\u6642\uFF0C\u9019\u901A\u5E38\u6BD4 demo \u66F4\u53EF\u6015\u3002", ["\u77ED\u6587\u4EF6", "1M"])}
						${this.modelSettingRange("users", "\u540C\u6642\u4F7F\u7528\u4EBA\u6578", 1, 16, 1, `${this.state.users} \u4EBA`, "\u4E0D\u662F\u5E33\u865F\u7E3D\u6578\uFF0C\u800C\u662F\u540C\u4E00\u6642\u9593\u771F\u7684\u5728\u63A8\u8AD6\u7684\u5C0D\u8A71\u6578\u3002\u591A\u4EBA\u4F7F\u7528\u6703\u653E\u5927 KV cache \u8207\u5EF6\u9072\u3002", ["\u55AE\u4EBA demo", "\u5C0F\u578B\u670D\u52D9"])}
					</div>
				</div>`
    )}
			${this.card(
      "\u63A1\u8CFC\u6642\u4E0D\u8981\u53EA\u770B\u5BB9\u91CF",
      `<div class="overflow-hidden rounded-lg border border-border bg-background/60 text-sm">
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">\u5BB9\u91CF\u6C7A\u5B9A\u80FD\u4E0D\u80FD\u653E\u4E0B</div>
						<div class="leading-6 text-muted-foreground">\u6A21\u578B\u6B0A\u91CD\u3001\u4E0A\u4E0B\u6587\u3001\u591A\u4EBA\u4F7F\u7528\u90FD\u6703\u5403\u8A18\u61B6\u9AD4\u3002\u80FD\u653E\u4E0B\u53EA\u662F\u7B2C\u4E00\u95DC\u3002</div>
					</div>
					<div class="native-decision-row border-b border-border px-3 py-3">
						<div class="font-semibold text-foreground">\u983B\u5BEC\u8207\u8EDF\u9AD4\u6C7A\u5B9A\u8DD1\u5F97\u9806\u4E0D\u9806</div>
						<div class="leading-6 text-muted-foreground">CUDA\u3001Metal\u3001ROCm\u3001MLX\u3001llama.cpp\u3001vLLM \u652F\u63F4\u4E0D\u540C\u3002\u5DE5\u5177\u93C8\u4E0D\u9806\uFF0C\u786C\u9AD4\u898F\u683C\u518D\u6F02\u4EAE\u4E5F\u6703\u5361\u3002</div>
					</div>
					<div class="native-decision-row px-3 py-3">
						<div class="font-semibold text-foreground">\u50F9\u683C\u4E0D\u662F\u7E3D\u6210\u672C</div>
						<div class="leading-6 text-muted-foreground">\u5DE5\u4F5C\u7AD9\u9084\u8981\u7B97\u96FB\u529B\u3001\u6563\u71B1\u3001\u4FDD\u56FA\u3001\u5099\u63F4\u3001\u76E3\u63A7\u3001\u66F4\u65B0\u8207\u8AB0\u8CA0\u8CAC\u6392\u932F\u3002</div>
					</div>
				</div>
				<div class="mt-3 text-xs leading-5 text-muted-foreground">
					\u50F9\u683C\u70BA 2026-05 \u516C\u958B\u7F8E\u570B\u96F6\u552E\u6216\u5A92\u9AD4\u6574\u7406\u7684\u8FD1\u4F3C\u503C\uFF0C\u5BE6\u969B\u6703\u56E0\u5730\u5340\u3001\u4F9B\u8CA8\u3001SSD\u3001\u7A05\u91D1\u8207\u6559\u80B2/\u4F01\u696D\u65B9\u6848\u6539\u8B8A\u3002
				</div>`
    )}
		`;
  }
  renderDemos() {
    const demos = {
      chat: {
        title: "\u672C\u6A5F\u5C0D\u8A71\u57FA\u6E96",
        intent: "\u5148\u78BA\u8A8D\u6A21\u578B\u771F\u7684\u80FD\u5728\u81EA\u5DF1\u7684\u96FB\u8166\u4E0A\u56DE\u61C9\uFF0C\u800C\u4E14\u901F\u5EA6\u8207\u8A18\u61B6\u9AD4\u4E0D\u662F\u53EA\u5728\u5C55\u793A\u5F71\u7247\u88E1\u597D\u770B\u3002",
        action: "\u7528 Ollama \u6216 LM Studio \u958B\u4E00\u500B\u4E2D\u5C0F\u578B\u6A21\u578B\uFF0C\u554F\u540C\u4E00\u7D44\u8AB2\u5802\u984C\u8207\u5DE5\u4F5C\u984C\u3002",
        command: "ollama run qwen3:8b",
        evidence: [
          "\u7B2C\u4E00\u6B21\u56DE\u61C9\u8981\u7B49\u591A\u4E45",
          "\u9023\u7E8C\u8FFD\u554F\u4E09\u8F2A\u5F8C\u662F\u5426\u9084\u7A69",
          "CPU/GPU/\u8A18\u61B6\u9AD4\u662F\u5426\u903C\u8FD1\u4E0A\u9650"
        ],
        decision: "\u80FD\u9806\u8DD1\u7C21\u55AE\u804A\u5929\u4E0D\u4EE3\u8868\u80FD\u8655\u7406\u9577\u6587\u4EF6\u6216\u6B63\u5F0F\u670D\u52D9\uFF1B\u5B83\u53EA\u8B49\u660E\u300C\u672C\u6A5F\u63A8\u8AD6\u9019\u689D\u8DEF\u6253\u5F97\u958B\u300D\u3002",
        pitfall: "\u56DE\u7B54\u6D41\u66A2\u4F46\u4E8B\u5BE6\u4E0D\u7A69\u3001\u9577\u4E0A\u4E0B\u6587\u8B8A\u6162\u3001\u7B46\u96FB\u98A8\u6247\u8207\u8017\u96FB\u8B93\u8AB2\u5802 demo \u5F88\u5FEB\u5931\u63A7\u3002"
      },
      api: {
        title: "\u7522\u54C1\u4E32\u63A5\u6E2C\u8A66",
        intent: "\u78BA\u8A8D\u672C\u6A5F\u6A21\u578B\u80FD\u4E0D\u80FD\u88AB\u73FE\u6709 app \u7576\u6210 OpenAI-compatible API \u4F7F\u7528\uFF0C\u800C\u4E0D\u662F\u53EA\u80FD\u5728\u804A\u5929\u8996\u7A97\u88E1\u73A9\u3002",
        action: "\u628A app \u7684 base URL \u6307\u5230\u672C\u6A5F\u670D\u52D9\uFF0C\u9001\u51FA\u4E00\u500B\u6703\u4E32\u6D41\u56DE\u8986\u7684\u7C21\u77ED\u4EFB\u52D9\u3002",
        command: "curl http://localhost:11434/v1/chat/completions",
        evidence: [
          "HTTP \u72C0\u614B\u8207\u4E32\u6D41\u662F\u5426\u6B63\u5E38",
          "\u6A21\u578B\u540D\u7A31\u3001\u932F\u8AA4\u8A0A\u606F\u3001timeout \u662F\u5426\u53EF\u63A7",
          "\u5DE5\u5177\u547C\u53EB\u8207 JSON \u8F38\u51FA\u662F\u5426\u548C GPT \u884C\u70BA\u76F8\u5BB9"
        ],
        decision: "API \u6253\u5F97\u901A\u53EA\u662F\u7B2C\u4E00\u6B65\uFF1B\u771F\u6B63\u8981\u770B\u7684\u662F\u7522\u54C1\u73FE\u6709\u6D41\u7A0B\u662F\u5426\u9700\u8981\u6539 prompt\u3001schema \u6216\u91CD\u8A66\u7B56\u7565\u3002",
        pitfall: "\u5F88\u591A\u670D\u52D9\u5BA3\u7A31\u76F8\u5BB9\uFF0C\u4F46 function calling\u3001structured output\u3001streaming \u7D30\u7BC0\u6703\u548C GPT \u4E0D\u540C\u3002"
      },
      eval: {
        title: "\u5C0F\u578B\u8A55\u6E2C\u96C6",
        intent: "\u4E0D\u8981\u6191\u611F\u89BA\u8AAA\u67D0\u500B\u6A21\u578B\u5920\u7528\u3002\u62FF\u81EA\u5DF1\u7684\u771F\u5BE6\u4EFB\u52D9\u505A\u5C0F\u578B\u8A55\u6E2C\uFF0C\u624D\u77E5\u9053\u5B83\u6703\u5728\u54EA\u88E1\u5931\u624B\u3002",
        action: "\u6E96\u5099 20 \u984C\u5E38\u898B\u4EFB\u52D9\uFF0C\u8B93 GPT \u8207\u672C\u6A5F\u6A21\u578B\u8DD1\u540C\u4E00\u4EFD\u984C\u76EE\uFF0C\u9010\u984C\u6A19\u6210\u901A\u904E\u3001\u90E8\u5206\u901A\u904E\u3001\u5931\u6557\u3002",
        command: "20 \u984C\u771F\u5BE6\u4EFB\u52D9\uFF1A\u6458\u8981\u3001\u6587\u4EF6\u554F\u7B54\u3001\u8868\u683C\u62BD\u53D6\u3001\u7FFB\u8B6F\u3001\u6539\u5BEB",
        evidence: [
          "\u6BCF\u984C\u7684\u901A\u904E/\u90E8\u5206\u901A\u904E/\u5931\u6557",
          "\u5931\u6557\u539F\u56E0\u662F\u5426\u96C6\u4E2D\u5728\u540C\u4E00\u985E\u4EFB\u52D9",
          "\u932F\u8AA4\u80FD\u4E0D\u80FD\u9760\u63D0\u793A\u6216\u6D41\u7A0B\u88DC\u6551"
        ],
        decision: "\u5982\u679C\u5931\u6557\u96C6\u4E2D\u5728\u4F4E\u98A8\u96AA\u3001\u53EF\u4EBA\u5DE5\u4FEE\u6B63\u7684\u5DE5\u4F5C\uFF0C\u672C\u6A5F\u6A21\u578B\u53EF\u80FD\u503C\u5F97\uFF1B\u5982\u679C\u932F\u5728\u95DC\u9375\u5224\u65B7\uFF0C\u5C31\u8981\u4FDD\u7559 GPT \u6216\u4EBA\u5DE5\u5BE9\u6838\u3002",
        pitfall: "\u5E73\u5747\u5206\u6578\u6703\u906E\u4F4F\u9AD8\u98A8\u96AA\u5931\u6557\uFF1B\u4E00\u984C\u8CA1\u52D9\u55AE\u4F4D\u770B\u932F\uFF0C\u53EF\u80FD\u6BD4\u5341\u984C\u6587\u6848\u5BEB\u5F97\u9806\u66F4\u91CD\u8981\u3002"
      }
    };
    const demo = demos[this.state.demo];
    const options = [
      { value: "chat", label: "1. \u5148\u8DD1\u5C0D\u8A71", help: "\u8B49\u660E\u6A21\u578B\u80FD\u5728\u672C\u6A5F\u63A8\u8AD6\u3002" },
      { value: "api", label: "2. \u518D\u63A5\u7522\u54C1", help: "\u8B49\u660E app \u80FD\u547C\u53EB\u672C\u6A5F\u670D\u52D9\u3002" },
      { value: "eval", label: "3. \u6700\u5F8C\u8A55\u6E2C", help: "\u8B49\u660E\u54C1\u8CEA\u7B26\u5408\u4F60\u7684\u4EFB\u52D9\u3002" }
    ];
    const steps = [
      ["\u6E96\u5099", "\u9078\u6A21\u578B\u3001\u555F\u52D5\u670D\u52D9\u3001\u8A18\u4E0B\u786C\u9AD4\u689D\u4EF6\u3002"],
      ["\u57F7\u884C", demo.action],
      ["\u7D00\u9304", "\u7559\u4E0B\u5EF6\u9072\u3001\u8A18\u61B6\u9AD4\u3001\u932F\u8AA4\u8A0A\u606F\u8207\u5BE6\u969B\u8F38\u51FA\uFF0C\u4E0D\u53EA\u622A\u4E00\u5F35\u6210\u529F\u756B\u9762\u3002"],
      ["\u5224\u65B7", demo.decision]
    ];
    return `
			<section class="native-demo-panel">
				<div class="native-demo-hero">
					<div>
						<div class="text-xs font-semibold text-muted-foreground">6.4 \u5BE6\u4F5C\u793A\u7BC4</div>
						<h2 class="mt-1 text-xl font-bold text-foreground">\u4E0D\u8981\u53EA\u770B\u300C\u6709\u56DE\u61C9\u300D</h2>
						<p class="mt-2 text-sm leading-6 text-muted-foreground">
							\u9019\u9801\u4E0D\u662F\u5728\u6A21\u64EC\u6A21\u578B\u8F38\u51FA\uFF0C\u800C\u662F\u6574\u7406\u4F60\u771F\u7684\u8DD1 Ollama\u3001LM Studio \u6216\u672C\u6A5F API \u6642\u8981\u9A57\u6536\u7684\u8B49\u64DA\u3002\u6210\u529F\u756B\u9762\u5F88\u4FBF\u5B9C\uFF1B\u53EF\u91CD\u8907\u7684\u8B49\u64DA\u6BD4\u8F03\u6709\u7528\u3002
						</p>
					</div>
					<div class="native-demo-receipt">
						<div class="text-xs font-semibold text-muted-foreground">\u9019\u6B21\u8981\u8B49\u660E</div>
						<div class="mt-1 text-sm font-semibold text-foreground">${demo.title}</div>
					</div>
				</div>
				<div class="native-demo-layout">
					<div class="native-demo-picker" role="group" aria-label="\u5BE6\u4F5C\u793A\u7BC4\u8DEF\u7DDA">
						${options.map(
      (option) => `
									<button
										data-key="demo"
										data-value="${option.value}"
										class="native-demo-option ${this.state.demo === option.value ? "is-active" : ""}"
									>
										<span class="native-demo-option-title">${option.label}</span>
										<span class="native-demo-option-note">${option.help}</span>
									</button>
								`
    ).join("")}
					</div>
					<div class="native-demo-detail">
						<div class="native-demo-detail-header">
							<div>
								<div class="text-lg font-bold text-foreground">${demo.title}</div>
								<div class="mt-1 text-sm leading-6 text-muted-foreground">${demo.intent}</div>
							</div>
							<div class="native-demo-status">\u9A57\u6536\u6E05\u55AE</div>
						</div>
						<div class="native-demo-command" aria-label="\u8D77\u624B\u5F0F">${demo.command}</div>
						<div class="native-demo-process">
							${steps.map(
      ([label, text], index) => `
										<div class="native-demo-step">
											<div class="native-demo-step-index">${index + 1}</div>
											<div>
												<div class="text-sm font-semibold text-foreground">${label}</div>
												<div class="mt-1 text-xs leading-5 text-muted-foreground">${text}</div>
											</div>
										</div>
									`
    ).join("")}
						</div>
						<div class="native-demo-evidence-grid">
							<div>
								<div class="text-xs font-semibold text-muted-foreground">\u8981\u7559\u4E0B\u7684\u8B49\u64DA</div>
								<ul class="mt-2 grid gap-2 text-sm leading-6 text-foreground">
									${demo.evidence.map((item) => `<li>${item}</li>`).join("")}
								</ul>
							</div>
							<div>
								<div class="text-xs font-semibold text-muted-foreground">\u5E38\u898B\u8AA4\u5224</div>
								<p class="mt-2 text-sm leading-6 text-foreground">${demo.pitfall}</p>
							</div>
						</div>
					</div>
				</div>
			</section>
		`;
  }
};
customElements.define("self-hosting-lab", SelfHostingLab);
//# sourceMappingURL=chunk-7XYOJ2TV.js.map
