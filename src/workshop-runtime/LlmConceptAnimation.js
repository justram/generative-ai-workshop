import { LitElement, css, html, nothing, svg } from "lit";
import { getCurrentLanguage } from "../mini-lit/index.js";

const SCENE_IDS = [
  "tokens",
  "vectors",
  "attention",
  "probabilities",
  "temperature",
  "generation",
  "limits",
];

const PALETTE = ["amber", "coral", "lavender", "sage", "sky", "sand", "stone"];

const CONTENT = {
  en: {
    label: "Concept animation",
    play: "Play",
    pause: "Pause",
    previous: "Previous",
    next: "Next",
    step: "Step",
    scene: "Scene",
    sample: "Sample",
    temperature: "Temperature",
    lowTemperature: "focused",
    highTemperature: "creative",
    liveDistribution: "live distribution",
    selectedToken: "sampled token",
    likelyPath: "steady path",
    balancedPath: "balanced sampling",
    widerPath: "more paths open",
    projectionNote: "2D projection of a much larger vector space",
    conceptualModel: "Conceptual toy model",
    conceptualNote:
      "The numbers and attention weights are simplified for learning. They are not a hidden dump from GPT.",
    sourceTokens: "source tokens",
    semanticSpace: "semantic space",
    vectorTrace: "each token gets a position-like vector",
    contextClues: "context clues",
    nextTokenQuestion: "what should come next?",
    attentionWeights: "attention weights",
    strongerClue: "stronger clue",
    weakerClue: "weaker clue",
    originalSentence: "original sentence",
    tokenPieces: "token pieces",
    segmentationPath: "continuous text becomes reusable pieces",
    segmentationHint: "This line marks the split points. It is not decoration.",
    rankedCandidates: "ranked candidates",
    sampleContinuations: "possible continuations",
    appendLoop: "predict distribution → choose token → append → repeat",
    pattern: "pattern",
    context: "context",
    probability: "probability",
    answer: "answer",
    usefulContinuation: "useful fluent continuation",
    wrongContinuation: "wrong pattern continues",
    samples: [
      {
        id: "cake",
        label: "hungry student",
        text: "The hungry student buys cake at the",
        tokens: ["The", "hungry", "student", "buys", "cake", "at", "the"],
        nextToken: "bakery",
        alternatives: [
          ["bakery", 0.42],
          ["shop", 0.24],
          ["market", 0.14],
          ["school", 0.08],
          ["gym", 0.03],
          ["...", 0.09],
        ],
        generated: ["bakery", ".", "The", "answer", "keeps", "growing."],
      },
      {
        id: "taipei",
        label: "Taipei weather",
        text: "If Taipei is raining, bring an",
        tokens: ["If", "Taipei", "is", "raining", ",", "bring", "an"],
        nextToken: "umbrella",
        alternatives: [
          ["umbrella", 0.48],
          ["raincoat", 0.18],
          ["extra", 0.1],
          ["jacket", 0.08],
          ["apple", 0.02],
          ["...", 0.14],
        ],
        generated: ["umbrella", "and", "check", "the", "forecast", "."],
      },
    ],
    scenes: [
      {
        id: "tokens",
        eyebrow: "Step 1",
        title: "Text becomes tokens",
        summary: "The model does not read sentences directly. It first sees small reusable pieces.",
        watch:
          "Notice that tokens are not always full words. A token can be a word, a character, punctuation, or spacing.",
      },
      {
        id: "vectors",
        eyebrow: "Step 2",
        title: "Tokens become vectors",
        summary:
          "Each token turns into numbers so the model can compare meaning and context mathematically.",
        watch:
          "The picture is only two-dimensional, but the real model uses a very high-dimensional space.",
      },
      {
        id: "attention",
        eyebrow: "Step 3",
        title: "Attention weighs the context",
        summary:
          "The model looks back across the context and gives different tokens different weight.",
        watch:
          "For the next token, the useful clues are not evenly spread. Some previous tokens matter much more.",
      },
      {
        id: "probabilities",
        eyebrow: "Step 4",
        title: "The model predicts a distribution",
        summary:
          "The next token is not a single fact. It is a ranked set of possible continuations.",
        watch: "A fluent answer starts as many possible next tokens with different probabilities.",
      },
      {
        id: "temperature",
        eyebrow: "Step 5",
        title: "Sampling chooses one path",
        summary: "Temperature changes how tightly the model sticks to the most likely token.",
        watch:
          "Lower temperature is steadier. Higher temperature explores more, but also makes weird choices easier.",
      },
      {
        id: "generation",
        eyebrow: "Step 6",
        title: "One token becomes a whole answer",
        summary:
          "After a token is chosen, it is appended to the context and the whole process repeats.",
        watch: "The answer feels continuous, but it is assembled one small step at a time.",
      },
      {
        id: "limits",
        eyebrow: "Bridge",
        title: "Why this is powerful and fragile",
        summary:
          "The same mechanism that makes text fluent can also continue a wrong pattern with confidence.",
        watch:
          "Section 3 shows what chat products wrap around this mechanism: system prompts, history, files, tools, and limits.",
      },
    ],
  },
  "zh-TW": {
    label: "概念動畫",
    play: "播放",
    pause: "暫停",
    previous: "上一幕",
    next: "下一幕",
    step: "推進",
    scene: "場景",
    sample: "例句",
    temperature: "溫度",
    lowTemperature: "穩定",
    highTemperature: "發散",
    liveDistribution: "目前分布",
    selectedToken: "這次抽到",
    likelyPath: "穩定接法",
    balancedPath: "均衡抽樣",
    widerPath: "更多路徑打開",
    projectionNote: "高維向量空間的二維投影",
    conceptualModel: "概念示意模型",
    conceptualNote: "這裡的機率與注意力權重是教學用的簡化示意，不是從 GPT 內部偷看出來的數值。",
    sourceTokens: "原始 token",
    semanticSpace: "語意空間",
    vectorTrace: "每個 token 會得到像位置一樣的向量",
    contextClues: "上下文線索",
    nextTokenQuestion: "下一個 token 該接什麼？",
    attentionWeights: "注意力權重",
    strongerClue: "線索較強",
    weakerClue: "線索較弱",
    originalSentence: "原始句子",
    tokenPieces: "切出的 token",
    segmentationPath: "連續文字被切成可重複使用的小片段",
    segmentationHint: "這條線標出切分點，不是裝飾線。",
    rankedCandidates: "候選 token 排名",
    sampleContinuations: "可能接續文字",
    appendLoop: "預測分布 → 選一個 token → 接回去 → 重複",
    pattern: "模式",
    context: "上下文",
    probability: "機率",
    answer: "回答",
    usefulContinuation: "有用的流暢延續",
    wrongContinuation: "錯誤模式也會延續",
    samples: [
      {
        id: "night-market",
        label: "夜市例句",
        text: "飢餓的學生在夜市買了",
        tokens: ["飢餓", "的", "學生", "在", "夜市", "買", "了"],
        nextToken: "雞排",
        alternatives: [
          ["雞排", 0.39],
          ["飲料", 0.23],
          ["宵夜", 0.15],
          ["衣服", 0.06],
          ["考卷", 0.02],
          ["...", 0.15],
        ],
        generated: ["雞排", "，", "又", "點", "了", "飲料"],
      },
      {
        id: "rain",
        label: "下雨例句",
        text: "台北下雨時，出門記得帶",
        tokens: ["台北", "下雨", "時", "，", "出門", "記得", "帶"],
        nextToken: "雨傘",
        alternatives: [
          ["雨傘", 0.47],
          ["雨衣", 0.19],
          ["外套", 0.09],
          ["悠遊卡", 0.07],
          ["蛋糕", 0.02],
          ["...", 0.16],
        ],
        generated: ["雨傘", "，", "也", "看", "一下", "雷達"],
      },
    ],
    scenes: [
      {
        id: "tokens",
        eyebrow: "第 1 步",
        title: "文字先變成 token",
        summary: "模型不是直接讀完整句子，而是先看到一小塊一小塊可重複使用的文字片段。",
        watch: "token 不一定是一個詞。它可能是中文字、英文詞的一部分、標點，甚至空白。",
      },
      {
        id: "vectors",
        eyebrow: "第 2 步",
        title: "token 變成向量",
        summary: "每個 token 會變成一串數字，模型才能用數學方式比較語意與上下文。",
        watch: "畫面只畫成二維，但真實模型是在高維空間裡處理這些數字表示。",
      },
      {
        id: "attention",
        eyebrow: "第 3 步",
        title: "注意力衡量上下文",
        summary: "模型會回頭看上下文，對不同 token 給不同權重。",
        watch: "要猜下一個 token 時，不是前面每個字都一樣重要；有些線索會被放大。",
      },
      {
        id: "probabilities",
        eyebrow: "第 4 步",
        title: "模型預測機率分布",
        summary: "下一個 token 不是一個確定事實，而是一排可能接續文字的機率。",
        watch: "流暢回答的起點，其實是很多個候選 token 和它們各自的機率。",
      },
      {
        id: "temperature",
        eyebrow: "第 5 步",
        title: "抽樣選出一條路",
        summary: "溫度會影響模型多常選最高機率答案，或願意探索比較意外的接法。",
        watch: "低溫比較穩，高溫比較有變化；但高溫也更容易出現奇怪選擇。",
      },
      {
        id: "generation",
        eyebrow: "第 6 步",
        title: "一個 token 接成完整回答",
        summary: "選出 token 後，它會被接回上下文，整個流程再跑一次。",
        watch: "回答看起來是一口氣寫出來的，其實是一步一步接出來的。",
      },
      {
        id: "limits",
        eyebrow: "銜接",
        title: "為什麼它強，也為什麼它脆弱",
        summary: "讓文字流暢延續的同一個機制，也可能讓錯誤模式被自信地延續下去。",
        watch: "第 3 章會看聊天產品在這個機制外面包了什麼：系統提示、歷史對話、檔案、工具與限制。",
      },
    ],
  },
};

export function getLlmConceptContent(language = getCurrentLanguage()) {
  return CONTENT[language] ?? CONTENT["zh-TW"];
}

export function getLlmConceptScenes(language = getCurrentLanguage()) {
  return getLlmConceptContent(language).scenes;
}

export class LlmConceptAnimation extends LitElement {
  static properties = {
    sceneIndex: { type: Number },
    playing: { type: Boolean },
    temperature: { type: Number },
    sampleIndex: { type: Number },
  };

  static styles = css`
    :host {
      display: block;
      container-type: inline-size;
      height: 100%;
      min-height: 0;
      color: var(--foreground);
      --paper: color-mix(in oklab, var(--background) 86%, #f4dfad 14%);
      --paper-strong: color-mix(in oklab, var(--background) 76%, #f0cf86 24%);
      --ink: var(--foreground);
      --quiet: var(--muted-foreground);
      --line: color-mix(in oklab, var(--border) 72%, var(--foreground) 28%);
      --amber: #d99a1b;
      --coral: #df744a;
      --lavender: #8f79b8;
      --sage: #7ba66a;
      --sky: #5d9fbb;
      --sand: #c6a15f;
      --stone: #9a9a9a;
    }

    :host-context(.dark) {
      --paper: color-mix(in oklab, var(--card) 84%, #322616 16%);
      --paper-strong: color-mix(in oklab, var(--card) 76%, #6e4b18 24%);
      --line: color-mix(in oklab, var(--border) 80%, #f5d28c 20%);
      --amber: #e6ad35;
      --coral: #e6815a;
      --lavender: #a995ce;
      --sage: #93bc7f;
      --sky: #75b3cc;
      --sand: #d5b777;
      --stone: #b9b3aa;
    }

    * {
      box-sizing: border-box;
    }

    .shell {
      display: grid;
      grid-template-rows: auto minmax(0, 1fr) auto;
      gap: 1rem;
      height: 100%;
      min-height: 0;
      padding: 1.25rem;
      background:
        radial-gradient(
          circle at 18% 8%,
          color-mix(in oklab, var(--amber) 14%, transparent),
          transparent 28%
        ),
        radial-gradient(
          circle at 82% 12%,
          color-mix(in oklab, var(--sky) 14%, transparent),
          transparent 30%
        ),
        var(--background);
    }

    .topbar,
    .controlbar,
    .stage {
      border: 1px solid var(--line);
      background: color-mix(in oklab, var(--paper) 94%, transparent);
    }

    .topbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      gap: 1rem;
      padding: 0.9rem 1rem;
      border-radius: 1rem;
    }

    .title {
      display: grid;
      gap: 0.18rem;
      min-width: 0;
    }

    .eyebrow {
      color: var(--quiet);
      font-size: 0.72rem;
      font-weight: 700;
      letter-spacing: 0.04em;
      text-transform: uppercase;
    }

    .heading {
      margin: 0;
      overflow: hidden;
      color: var(--ink);
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: clamp(1.4rem, 2.4vw, 2.35rem);
      font-weight: 700;
      line-height: 1.08;
      white-space: normal;
    }

    .note {
      max-width: 22rem;
      color: var(--quiet);
      font-size: 0.8rem;
      line-height: 1.45;
      text-align: right;
    }

    .stage {
      position: relative;
      display: grid;
      min-height: 24rem;
      overflow: hidden;
      border-radius: 1.2rem;
      background:
        linear-gradient(135deg, color-mix(in oklab, var(--paper) 92%, white 8%), var(--paper)),
        var(--paper);
    }

    :host-context(.dark) .stage {
      background:
        radial-gradient(
          circle at 80% 15%,
          color-mix(in oklab, var(--sky) 11%, transparent),
          transparent 26%
        ),
        linear-gradient(135deg, color-mix(in oklab, var(--paper) 86%, black 14%), var(--paper));
    }

    .scene-frame {
      position: relative;
      display: grid;
      min-height: 100%;
      padding: clamp(1.2rem, 2.6vw, 2.4rem);
      overflow: hidden;
      isolation: isolate;
    }

    .scene-grid,
    .scene-column,
    .flow-row,
    .temperature-layout,
    .attention-layout {
      position: relative;
      z-index: 1;
      min-width: 0;
    }

    .scene-column {
      display: grid;
      gap: clamp(1rem, 2vw, 1.45rem);
      align-content: center;
    }

    .flow-row {
      display: grid;
      grid-template-columns: minmax(0, 0.72fr) minmax(0, 1.48fr);
      align-items: center;
      gap: clamp(2rem, 5vw, 4rem);
    }

    .concept-card,
    .distribution-panel,
    .split-panel,
    .selected-card,
    .temperature-rail,
    .loop-note,
    .attention-summary {
      min-width: 0;
      border: 1px solid color-mix(in oklab, var(--line) 80%, transparent);
      background: color-mix(in oklab, var(--background) 62%, var(--paper) 38%);
    }

    .concept-card,
    .distribution-panel,
    .selected-card,
    .attention-summary {
      border-radius: 1.4rem;
      padding: clamp(0.95rem, 1.7vw, 1.45rem);
    }

    .concept-card.strong {
      background: color-mix(in oklab, var(--background) 62%, var(--paper-strong) 38%);
    }

    .card-label {
      margin: 0 0 0.85rem;
      color: var(--quiet);
      font-size: 0.82rem;
      font-weight: 750;
      line-height: 1.25;
    }

    .card-main {
      margin: 0;
      color: var(--ink);
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: clamp(1.15rem, 2vw, 1.65rem);
      font-weight: 750;
      line-height: 1.35;
    }

    .token-chip-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.36rem;
      align-items: center;
      max-width: 100%;
    }

    .token-card-layout {
      display: grid;
      gap: 0.82rem;
    }

    .token-chip {
      display: inline-flex;
      align-items: center;
      justify-content: center;
      min-width: 2.15rem;
      max-width: 7rem;
      min-height: 1.9rem;
      padding: 0.28rem 0.45rem;
      border: 1.3px solid var(--chip-color);
      border-radius: 0.75rem;
      background: color-mix(in oklab, var(--chip-color) 24%, var(--background) 76%);
      color: var(--ink);
      font-weight: 760;
      line-height: 1.05;
      text-align: center;
      white-space: nowrap;
    }

    .token-stack {
      display: grid;
      justify-items: center;
      gap: 0.28rem;
    }

    .token-stack .token-chip {
      width: 100%;
    }

    .token-index-label {
      color: var(--quiet);
      font-family: var(--font-mono), ui-monospace, monospace;
      font-size: 0.78rem;
      font-weight: 650;
    }

    .split-panel {
      position: relative;
      display: grid;
      gap: 0.62rem;
      border-style: dashed;
      border-radius: 1.35rem;
      padding: 0.7rem clamp(0.72rem, 1.4vw, 1rem) 0.86rem;
      background: color-mix(in oklab, var(--background) 76%, var(--paper) 24%);
    }

    .split-note {
      margin: 0;
      color: var(--quiet);
      font-size: 0.78rem;
      font-weight: 750;
      line-height: 1.35;
    }

    .split-rail {
      display: grid;
      gap: 0.42rem;
    }

    .split-marker-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.36rem;
      align-items: center;
      min-height: 1.25rem;
      padding-inline: 0.1rem;
      border-bottom: 1.3px solid color-mix(in oklab, var(--quiet) 58%, transparent);
    }

    .split-marker {
      display: inline-flex;
      width: var(--marker-width);
      justify-content: center;
      opacity: 0;
      animation: tokenStepIn 260ms ease-out forwards;
    }

    .split-dot {
      width: 0.62rem;
      height: 0.62rem;
      border-radius: 999px;
      background: var(--sand);
      box-shadow: 0 0 0 3px color-mix(in oklab, var(--sand) 20%, transparent);
    }

    .split-caption {
      margin: 0;
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: clamp(0.98rem, 1.6vw, 1.25rem);
      font-style: italic;
      font-weight: 650;
      line-height: 1.35;
      opacity: 0;
      animation: tokenStepIn 280ms ease-out 720ms forwards;
    }

    .distribution-panel {
      display: grid;
      gap: 0.85rem;
    }

    .distribution-panel.with-examples {
      gap: 0.48rem;
      padding: 0.9rem 1rem;
    }

    .distribution-panel.with-examples .card-label {
      margin-bottom: 0.2rem;
    }

    .distribution-panel.with-examples .prob-row-html {
      gap: 0.55rem;
      font-size: 0.88rem;
    }

    .distribution-panel.with-examples .prob-track {
      height: 1.05rem;
    }

    .prob-row-html {
      display: grid;
      grid-template-columns: minmax(3rem, 5.5rem) minmax(0, 1fr) 3.1rem;
      gap: 0.75rem;
      align-items: center;
      min-width: 0;
      opacity: 0;
      animation: tokenStepIn 260ms ease-out forwards;
    }

    .prob-name {
      overflow: hidden;
      color: var(--ink);
      font-weight: 760;
      text-overflow: ellipsis;
      white-space: nowrap;
    }

    .prob-track {
      position: relative;
      height: 1.35rem;
      overflow: hidden;
      border-radius: 0.44rem;
      background: color-mix(in oklab, var(--muted) 50%, transparent);
    }

    .prob-fill {
      position: absolute;
      inset-block: 0;
      inset-inline-start: 0;
      width: calc(var(--prob) * 100%);
      max-width: 100%;
      border-radius: inherit;
      background: var(--bar-color);
      opacity: 0.86;
      transform: scaleX(0);
      transform-origin: left center;
      transition: width 360ms ease-out;
      animation: weightGrow 420ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
    }

    .prob-percent {
      color: var(--quiet);
      font-family: var(--font-mono), ui-monospace, monospace;
      font-weight: 760;
      text-align: right;
      white-space: nowrap;
    }

    .continuation-panel {
      display: grid;
      gap: 0.24rem;
      min-width: 0;
      margin-top: 0.14rem;
      padding: 0.5rem 0.64rem;
      border: 1px solid color-mix(in oklab, var(--line) 62%, transparent);
      border-radius: 0.9rem;
      background: color-mix(in oklab, var(--background) 70%, transparent);
    }

    .continuation-title {
      margin: 0;
      color: var(--quiet);
      font-size: 0.72rem;
      font-weight: 760;
    }

    .continuation-line {
      overflow-wrap: anywhere;
      color: var(--quiet);
      font-size: 0.72rem;
      font-weight: 650;
      line-height: 1.28;
      opacity: 0;
      animation: tokenStepIn 240ms ease-out forwards;
    }

    .temperature-layout {
      display: grid;
      grid-template-columns: minmax(0, 1.1fr) minmax(13rem, 0.75fr);
      grid-template-areas:
        "rail rail"
        "distribution selected";
      gap: clamp(0.75rem, 1.6vw, 1.15rem);
      align-content: center;
    }

    .temperature-rail {
      grid-area: rail;
      display: grid;
      gap: 0.28rem;
      border-radius: 1.4rem;
      padding: 0.52rem clamp(0.85rem, 1.4vw, 1.1rem);
      background: color-mix(in oklab, var(--background) 64%, var(--paper-strong) 36%);
    }

    .temperature-rail-row {
      display: grid;
      grid-template-columns: auto minmax(0, 1fr) auto;
      align-items: center;
      gap: 0.65rem;
    }

    .rail-endpoint {
      color: var(--quiet);
      font-size: 0.8rem;
      font-weight: 750;
      white-space: nowrap;
    }

    .temperature-track {
      position: relative;
      height: 1.15rem;
    }

    .temperature-track::before {
      position: absolute;
      inset-inline: 0;
      top: 0.56rem;
      height: 1px;
      background: color-mix(in oklab, var(--quiet) 68%, transparent);
      content: "";
    }

    .temperature-knob {
      position: absolute;
      top: 0.1rem;
      left: calc(var(--temp-pos) * 100%);
      width: 1.05rem;
      height: 1.05rem;
      border: 3px solid var(--background);
      border-radius: 999px;
      background: var(--amber);
      transform: translateX(-50%);
      box-shadow: 0 1px 3px rgb(0 0 0 / 0.22);
      transition: left 360ms cubic-bezier(0.2, 0.8, 0.2, 1);
    }

    .temperature-mode {
      margin: 0;
      color: var(--ink);
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: 1.05rem;
      font-style: italic;
      font-weight: 650;
      line-height: 1.15;
      text-align: center;
    }

    .temperature-layout .distribution-panel {
      grid-area: distribution;
      gap: 0.36rem;
      padding: 0.72rem;
    }

    .temperature-layout .distribution-panel .card-label {
      margin-bottom: 0.22rem;
    }

    .temperature-layout .prob-row-html {
      grid-template-columns: minmax(2.6rem, 4.2rem) minmax(0, 1fr) 2.6rem;
      gap: 0.42rem;
      font-size: 0.86rem;
    }

    .temperature-layout .prob-track {
      height: 0.78rem;
    }

    .selected-card {
      grid-area: selected;
      display: grid;
      gap: 0.75rem;
      align-self: center;
      border-color: var(--coral);
      background: color-mix(in oklab, var(--coral) 25%, var(--background) 75%);
      padding: 0.85rem;
      animation: selectedPulse 460ms ease-out;
    }

    .selected-token {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 1rem;
      color: var(--ink);
      font-size: 1.25rem;
      font-weight: 800;
    }

    .loop-note {
      align-self: stretch;
      border-radius: 1rem;
      padding: 0.52rem 0.7rem;
      color: var(--quiet);
      font-size: 0.78rem;
      font-weight: 700;
      line-height: 1.45;
    }

    .selected-card .loop-note {
      border: 0;
      background: color-mix(in oklab, var(--background) 54%, transparent);
    }

    .attention-layout {
      display: grid;
      grid-template-rows: auto auto;
      gap: clamp(1rem, 2.5vw, 1.6rem);
      align-content: center;
    }

    .attention-context {
      display: grid;
      grid-template-columns: minmax(0, 1fr) minmax(4.5rem, auto);
      align-items: start;
      gap: clamp(1rem, 3vw, 2.4rem);
    }

    .attention-token-grid {
      display: flex;
      flex-wrap: wrap;
      gap: 0.65rem;
      align-items: flex-start;
    }

    .attention-token-grid .token-stack {
      opacity: 0;
      transform: translateY(0.35rem);
      animation: tokenStepIn 280ms ease-out forwards;
    }

    .attention-target {
      display: grid;
      min-width: 4.5rem;
      min-height: 4.5rem;
      place-items: center;
      border: 2px dashed var(--coral);
      border-radius: 1rem;
      color: var(--ink);
      font-size: 1.35rem;
      font-weight: 800;
    }

    .attention-summary {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.55rem 0.9rem;
    }

    .attention-summary .card-label {
      grid-column: 1 / -1;
      margin-bottom: 0.2rem;
    }

    .weight-row {
      display: grid;
      grid-template-columns: minmax(3rem, 5rem) minmax(0, 1fr);
      gap: 0.75rem;
      align-items: center;
      opacity: 0;
      animation: tokenStepIn 260ms ease-out forwards;
    }

    .weight-track {
      height: 0.85rem;
      overflow: hidden;
      border-radius: 999px;
      background: color-mix(in oklab, var(--muted) 55%, transparent);
    }

    .weight-fill {
      display: block;
      width: calc(var(--weight) * 100%);
      height: 100%;
      border-radius: inherit;
      background: var(--weight-color);
      opacity: 0.88;
      transform: scaleX(0);
      transform-origin: left center;
      animation: weightGrow 420ms cubic-bezier(0.2, 0.7, 0.2, 1) forwards;
    }

    .connector-layer {
      position: absolute;
      inset: 0;
      z-index: 2;
      width: 100%;
      height: 100%;
      color: color-mix(in oklab, var(--quiet) 74%, transparent);
      pointer-events: none;
      overflow: visible;
    }

    .connector-path {
      fill: none;
      stroke: color-mix(in oklab, var(--quiet) 74%, transparent);
      stroke-width: 1.45;
      stroke-linecap: round;
      stroke-linejoin: round;
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: pathDraw 620ms ease-out forwards;
    }

    .connector-path.split {
      stroke: color-mix(in oklab, var(--sand) 85%, var(--ink) 15%);
      stroke-width: 1.65;
      stroke-dasharray: 4 6;
      opacity: 0.9;
    }

    .connector-path.attention {
      stroke: var(--attention-stroke, var(--coral));
      opacity: var(--attention-opacity, 0.88);
      stroke-linecap: round;
      animation:
        pathDraw 620ms ease-out forwards,
        attentionArcIn 320ms ease-out both;
    }

    .connector-dot {
      fill: var(--sand);
    }

    .connector-dot.attention-dot {
      fill: var(--attention-stroke, var(--coral));
      opacity: var(--attention-opacity, 0.72);
      filter: drop-shadow(0 0 4px color-mix(in oklab, var(--attention-stroke, var(--coral)) 45%, transparent));
    }

    .stage svg {
      width: 100%;
      height: 100%;
      min-height: 24rem;
    }

    .stage-label {
      fill: var(--quiet);
      font-family: var(--font-sans), system-ui, sans-serif;
      font-size: 13px;
      font-weight: 650;
    }

    .svg-sentence {
      color: var(--ink);
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: 20px;
      font-weight: 700;
      line-height: 1.28;
    }

    .serif-label {
      fill: var(--ink);
      font-family: var(--font-serif), ui-serif, Georgia, serif;
      font-size: 27px;
      font-weight: 700;
    }

    .hand-label {
      fill: var(--ink);
      font-family: "Bradley Hand", "Segoe Print", var(--font-serif), serif;
      font-size: 18px;
      font-style: italic;
    }

    .axis,
    .soft-line {
      stroke: color-mix(in oklab, var(--quiet) 70%, transparent);
      stroke-width: 1.35;
      fill: none;
      stroke-linecap: round;
    }

    .ghost-line {
      stroke: color-mix(in oklab, var(--quiet) 34%, transparent);
      stroke-width: 1.1;
      stroke-dasharray: 3 6;
      fill: none;
      stroke-linecap: round;
    }

    .split-line {
      stroke: color-mix(in oklab, var(--sand) 78%, var(--ink) 22%);
      stroke-width: 1.8;
      stroke-dasharray: 5 7;
      fill: none;
      stroke-linecap: round;
      opacity: 0.95;
    }

    .attention-line {
      fill: none;
      stroke-linecap: round;
      opacity: 0.9;
    }

    .loop-path,
    .bridge-path {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: pathDraw 760ms ease-out forwards;
    }

    .generated-token,
    .mini-card {
      opacity: 0;
      animation: svgTokenFadeIn 300ms ease-out forwards;
    }

    .vector-arrow,
    .semantic-trace {
      stroke-dasharray: 1;
      stroke-dashoffset: 1;
      animation: pathDraw 820ms ease-out forwards;
    }

    .semantic-trace {
      animation-delay: 620ms;
    }

    .vector-node {
      opacity: 0;
      transform-box: fill-box;
      transform-origin: center;
      animation: vectorPointIn 320ms ease-out forwards;
    }

    .vector-node text {
      opacity: 0;
      animation: labelFadeIn 220ms ease-out forwards;
    }

    .token rect,
    .token-chip {
      stroke-width: 1.2;
      filter: drop-shadow(0 1px 0 rgb(0 0 0 / 0.08));
    }

    .token text {
      fill: var(--ink);
      font-family: var(--font-sans), system-ui, sans-serif;
      font-size: 16px;
      font-weight: 650;
    }

    .token-index {
      fill: var(--quiet);
      font-size: 12px;
      font-weight: 500;
    }

    .prob-label {
      fill: var(--ink);
      font-family: var(--font-sans), system-ui, sans-serif;
      font-size: 15px;
      font-weight: 650;
    }

    .prob-value {
      fill: var(--quiet);
      font-size: 13px;
      font-weight: 650;
    }

    .controlbar {
      display: grid;
      grid-template-columns: auto minmax(8rem, 1fr) minmax(11rem, auto);
      align-items: center;
      gap: 0.85rem;
      padding: 0.75rem;
      border-radius: 1rem;
    }

    .controlbar.has-temp {
      grid-template-columns: auto minmax(8rem, 1fr) minmax(11rem, auto) minmax(13rem, auto);
    }

    .button-row {
      display: inline-flex;
      align-items: center;
      gap: 0.35rem;
    }

    button,
    select {
      min-height: 2.15rem;
      border: 1px solid var(--line);
      border-radius: 0.75rem;
      background: color-mix(in oklab, var(--background) 74%, var(--paper-strong) 26%);
      color: var(--foreground);
      font: inherit;
      user-select: none;
    }

    button {
      display: inline-grid;
      min-width: 2.15rem;
      place-items: center;
      padding: 0 0.72rem;
      font-size: 0.86rem;
      font-weight: 700;
    }

    button:disabled {
      opacity: 0.45;
    }

    select {
      max-width: 13rem;
      padding: 0 0.7rem;
      font-size: 0.84rem;
      font-weight: 650;
    }

    .scrubber,
    .temp {
      display: grid;
      gap: 0.35rem;
    }

    .temp-presets {
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 0.25rem;
    }

    .temp-presets button {
      min-width: 0;
      min-height: 1.65rem;
      padding: 0 0.45rem;
      border-radius: 0.55rem;
      color: var(--quiet);
      font-size: 0.72rem;
      white-space: nowrap;
    }

    .temp-presets button.active {
      border-color: var(--amber);
      background: color-mix(in oklab, var(--amber) 24%, var(--background) 76%);
      color: var(--foreground);
    }

    .meta-row {
      display: flex;
      align-items: baseline;
      justify-content: space-between;
      gap: 0.75rem;
      color: var(--quiet);
      font-size: 0.76rem;
      font-weight: 700;
    }

    input[type="range"] {
      width: 100%;
      height: 1.15rem;
      appearance: none;
      -webkit-appearance: none;
      background: transparent;
      cursor: default;
    }

    input[type="range"]::-webkit-slider-runnable-track {
      height: 0.35rem;
      border: 1px solid color-mix(in oklab, var(--line) 84%, var(--ink) 16%);
      border-radius: 999px;
      background:
        linear-gradient(var(--amber), var(--amber)) 0 / var(--range-progress, 0%) 100% no-repeat,
        color-mix(in oklab, var(--background) 72%, var(--paper-strong) 28%);
    }

    input[type="range"]::-webkit-slider-thumb {
      width: 0.95rem;
      height: 0.95rem;
      margin-top: -0.35rem;
      appearance: none;
      -webkit-appearance: none;
      border: 2px solid var(--background);
      border-radius: 999px;
      background: var(--amber);
      box-shadow: 0 1px 2px rgb(0 0 0 / 0.2);
    }

    @media (max-width: 880px) {
      .shell {
        padding: 0.8rem;
      }

      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .heading {
        white-space: normal;
      }

      .note {
        max-width: none;
        text-align: left;
      }

      .controlbar {
        grid-template-columns: 1fr;
      }
    }

    @container (max-width: 760px) {
      .shell {
        padding: 0.85rem;
      }

      .topbar {
        align-items: flex-start;
        flex-direction: column;
      }

      .note {
        max-width: none;
        text-align: left;
      }

      .controlbar,
      .controlbar.has-temp {
        grid-template-columns: 1fr;
      }

      .stage,
      .stage svg {
        min-height: 19rem;
      }

      .prob-row-html {
        grid-template-columns: minmax(2.5rem, 4.6rem) minmax(0, 1fr) 2.8rem;
      }

      select {
        max-width: none;
      }
    }

    @container (max-width: 560px) {
      .flow-row,
      .temperature-layout {
        grid-template-columns: 1fr;
      }

      .temperature-layout {
        grid-template-areas:
          "rail"
          "distribution"
          "selected";
      }

      .attention-context {
        grid-template-columns: 1fr;
      }

      .attention-summary {
        grid-template-columns: repeat(2, minmax(0, 1fr));
      }
    }

    @media (prefers-reduced-motion: reduce) {
      *,
      *::before,
      *::after {
        animation-duration: 0.001ms !important;
        animation-iteration-count: 1 !important;
        scroll-behavior: auto !important;
        transition-duration: 0.001ms !important;
      }
    }

    @keyframes tokenStepIn {
      from {
        opacity: 0;
        transform: translateY(0.35rem);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }

    @keyframes svgTokenFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    @keyframes weightGrow {
      from {
        transform: scaleX(0);
      }
      to {
        transform: scaleX(1);
      }
    }

    @keyframes attentionArcIn {
      from {
        opacity: 0;
      }
      to {
        opacity: var(--attention-opacity, 0.88);
      }
    }

    @keyframes selectedPulse {
      from {
        box-shadow: 0 0 0 0 color-mix(in oklab, var(--coral) 42%, transparent);
      }
      to {
        box-shadow: 0 0 0 12px transparent;
      }
    }

    @keyframes pathDraw {
      from {
        stroke-dashoffset: 1;
      }
      to {
        stroke-dashoffset: 0;
      }
    }

    @keyframes vectorPointIn {
      from {
        opacity: 0;
        transform: scale(0.45);
      }
      to {
        opacity: 1;
        transform: scale(1);
      }
    }

    @keyframes labelFadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }
  `;

  constructor() {
    super();
    this.sceneIndex = 0;
    this.playing = false;
    this.temperature = 0.8;
    this.sampleIndex = 0;
    this.timer = null;
    this.connectorFrame = 0;
    this.resizeObserver = null;
  }

  connectedCallback() {
    super.connectedCallback();
    this.syncPlayback();
  }

  disconnectedCallback() {
    this.stopPlayback();
    if (this.connectorFrame) window.cancelAnimationFrame(this.connectorFrame);
    this.resizeObserver?.disconnect();
    super.disconnectedCallback();
  }

  firstUpdated() {
    this.resizeObserver = new ResizeObserver(() => this.scheduleConnectorDraw());
    this.resizeObserver.observe(this);
    this.scheduleConnectorDraw();
  }

  updated(changed) {
    if (changed.has("playing")) this.syncPlayback();
    if (changed.has("sceneIndex")) {
      this.dispatchEvent(
        new CustomEvent("scene-change", {
          detail: { sceneIndex: this.sceneIndex },
          bubbles: true,
          composed: true,
        }),
      );
    }
    if (
      changed.has("sceneIndex") ||
      changed.has("temperature") ||
      changed.has("sampleIndex")
    ) {
      this.scheduleConnectorDraw();
    }
  }

  get copy() {
    return getLlmConceptContent();
  }

  get scenes() {
    return this.copy.scenes;
  }

  get scene() {
    return this.scenes[this.sceneIndex] ?? this.scenes[0];
  }

  get sample() {
    return this.copy.samples[this.sampleIndex] ?? this.copy.samples[0];
  }

  syncPlayback() {
    this.stopPlayback();
    if (!this.playing) return;
    this.timer = window.setInterval(() => {
      this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
    }, 3000);
  }

  stopPlayback() {
    if (this.timer) window.clearInterval(this.timer);
    this.timer = null;
  }

  previousScene() {
    this.sceneIndex = (this.sceneIndex + this.scenes.length - 1) % this.scenes.length;
  }

  nextScene() {
    this.sceneIndex = (this.sceneIndex + 1) % this.scenes.length;
  }

  setScene(index) {
    this.sceneIndex = Math.max(0, Math.min(this.scenes.length - 1, Number(index) || 0));
  }

  render() {
    const progress = `${(this.sceneIndex / (this.scenes.length - 1)) * 100}%`;
    const tempProgress = `${((this.temperature - 0.2) / 1.8) * 100}%`;

    return html`
      <div class="shell">
        <div class="topbar">
          <div class="title">
            <div class="eyebrow">${this.copy.label} · ${this.scene.eyebrow}</div>
            <h2 class="heading">${this.scene.title}</h2>
          </div>
          <div class="note">
            <strong>${this.copy.conceptualModel}</strong><br />
            ${this.copy.conceptualNote}
          </div>
        </div>

        <div class="stage" aria-label=${this.scene.title}>${this.renderStage()}</div>

        <div class=${`controlbar ${this.scene.id === "temperature" ? "has-temp" : ""}`}>
          <div class="button-row">
            <button
              @click=${() => (this.playing = !this.playing)}
              title=${this.playing ? this.copy.pause : this.copy.play}
            >
              ${this.playing ? "Ⅱ" : "▶"}
            </button>
            <button @click=${() => this.previousScene()} title=${this.copy.previous}>←</button>
            <button @click=${() => this.nextScene()} title=${this.copy.next}>→</button>
          </div>

          <div class="scrubber">
            <div class="meta-row">
              <span>${this.copy.scene}</span>
              <span>${this.sceneIndex + 1} / ${this.scenes.length}</span>
            </div>
            <input
              type="range"
              min="0"
              max=${this.scenes.length - 1}
              step="1"
              .value=${String(this.sceneIndex)}
              style=${`--range-progress:${progress}`}
              @input=${(event) => this.setScene(event.currentTarget.value)}
              aria-label=${this.copy.scene}
            />
          </div>

          <label class="scrubber">
            <span class="meta-row">
              <span>${this.copy.sample}</span>
            </span>
            <select
              .value=${String(this.sampleIndex)}
              @change=${(event) => {
                this.sampleIndex = Number(event.currentTarget.value);
              }}
            >
              ${this.copy.samples.map(
                (sample, index) => html`<option value=${index}>${sample.label}</option>`,
              )}
            </select>
          </label>

          ${this.scene.id === "temperature"
            ? html`
                <div class="temp">
                  <span class="meta-row">
                    <span>${this.copy.temperature}</span>
                    <span>${this.getTemperatureModeLabel()} · ${this.temperature.toFixed(1)}</span>
                  </span>
                  <div class="temp-presets" role="group" aria-label=${this.copy.temperature}>
                    ${[
                      [this.copy.likelyPath, 0.35],
                      [this.copy.balancedPath, 0.8],
                      [this.copy.widerPath, 1.65],
                    ].map(
                      ([label, value]) => html`
                        <button
                          class=${Math.abs(this.temperature - value) < 0.05 ? "active" : ""}
                          @click=${() => {
                            this.temperature = value;
                          }}
                          aria-pressed=${Math.abs(this.temperature - value) < 0.05}
                        >
                          ${label}
                        </button>
                      `,
                    )}
                  </div>
                  <input
                    type="range"
                    min="0.2"
                    max="2"
                    step="0.1"
                    .value=${String(this.temperature)}
                    style=${`--range-progress:${tempProgress}`}
                    @input=${(event) => {
                      this.temperature = Number(event.currentTarget.value);
                    }}
                    aria-label=${this.copy.temperature}
                  />
                </div>
              `
            : nothing}
        </div>
      </div>
    `;
  }

  renderStage() {
    switch (this.scene.id) {
      case "vectors":
        return this.renderVectorsScene();
      case "attention":
        return this.renderAttentionScene();
      case "probabilities":
        return this.renderProbabilitiesScene(false);
      case "temperature":
        return this.renderProbabilitiesScene(true);
      case "generation":
        return this.renderGenerationScene();
      case "limits":
        return this.renderLimitsScene();
      case "tokens":
      default:
        return this.renderTokensScene();
    }
  }

  renderTokensScene() {
    return html`
      <div class="scene-frame" data-scene="tokens">
        ${this.renderConnectorLayer()}
        <div class="flow-row">
          <section class="concept-card strong" data-node="sentence-card">
            <p class="card-label">${this.copy.originalSentence}</p>
            <p class="card-main">“${this.sample.text}”</p>
          </section>

          <section class="concept-card token-card-layout" data-node="token-card">
            <div>
              <p class="card-label">${this.copy.tokenPieces}</p>
              ${this.renderHtmlTokenRow("token")}
            </div>

            <section class="split-panel" data-node="split-panel">
              <div class="split-rail">
                <div class="split-marker-row">
                  ${this.sample.tokens.map(
                    (token, index) => html`
                      <span
                        class="split-marker"
                        style=${`--marker-width:${this.getTokenChipWidth(token)}px;animation-delay:${380 + index * 80}ms`}
                      >
                        <span class="split-dot" data-node=${`split-${index}`}></span>
                      </span>
                    `,
                  )}
                </div>
                <p class="split-caption">${this.copy.segmentationPath}</p>
              </div>
            </section>
          </section>
        </div>
      </div>
    `;
  }

  renderVectorsScene() {
    const positions = [
      [520, 178],
      [610, 318],
      [715, 132],
      [740, 295],
      [596, 226],
      [810, 286],
      [806, 164],
    ];
    return svg`
      <svg viewBox="0 0 920 520" role="img">
        <defs>
          <radialGradient id="semanticGlow" cx="50%" cy="50%" r="65%">
            <stop offset="0%" stop-color="var(--sky)" stop-opacity="0.22" />
            <stop offset="100%" stop-color="var(--sky)" stop-opacity="0" />
          </radialGradient>
        </defs>

        <rect
          x="54"
          y="86"
          width="322"
          height="330"
          rx="24"
          fill="color-mix(in oklab, var(--background) 68%, var(--paper-strong) 32%)"
          stroke="color-mix(in oklab, var(--line) 78%, transparent)"
        />
        <text class="stage-label" x="86" y="128">${this.copy.sourceTokens}</text>
        <foreignObject x="84" y="150" width="250" height="88">
          <div xmlns="http://www.w3.org/1999/xhtml" class="svg-sentence">${this.sample.text}</div>
        </foreignObject>
        ${this.renderSourceTokenGrid(84, 264, 252)}
        <path
          class="soft-line vector-arrow"
          pathLength="1"
          d="M344 252 C388 248 404 248 448 248"
          marker-end="url(#vectorArrow)"
        />

        <rect
          x="472"
          y="72"
          width="390"
          height="372"
          rx="28"
          fill="color-mix(in oklab, var(--background) 58%, var(--paper) 42%)"
          stroke="color-mix(in oklab, var(--line) 78%, transparent)"
        />
        <circle cx="668" cy="252" r="148" fill="url(#semanticGlow)" />
        <path class="axis" d="M510 350 H824" />
        <path class="axis" d="M668 400 V114" />
        <path
          class="ghost-line semantic-trace"
          pathLength="1"
          d="M520 178 C610 220 645 165 715 132 S700 204 596 226 S735 290 806 164"
        />
        ${this.sample.tokens.map((token, index) => {
          const [x, y] = positions[index] ?? [180 + index * 70, 250];
          const color = PALETTE[index % PALETTE.length];
          const delay = 760 + index * 120;
          return svg`
            <g class="vector-node" style=${`animation-delay:${delay}ms`}>
              <circle
                cx=${x}
                cy=${y}
                r="8"
                fill=${`var(--${color})`}
                stroke="var(--background)"
                stroke-width="2"
              ></circle>
              <text
                class="stage-label"
                x=${x + 13}
                y=${y + 4}
                style=${`animation-delay:${delay + 90}ms`}
              >
                ${token}
              </text>
            </g>
          `;
        })}
        <text class="hand-label" x="644" y="72">${this.copy.semanticSpace}</text>
        <path class="soft-line" d="M676 84 C642 106 624 128 604 164" />
        <text class="stage-label" x="532" y="410">${this.copy.projectionNote}</text>
        <text class="stage-label" x="532" y="434">${this.copy.vectorTrace}</text>
        <defs>${this.renderArrowDef("vectorArrow", "var(--quiet)")}</defs>
      </svg>
    `;
  }

  renderAttentionScene() {
    const weights = this.getAttentionWeights();
    const tokenPositions = this.sample.tokens.map((token, index) => ({
      token,
      index,
      weight: weights[index] ?? 0.25,
    }));
    const emphasized = [...tokenPositions]
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index);
    const emphasizedIndexes = new Set(emphasized.map((item) => item.index));
    return html`
      <div class="scene-frame" data-scene="attention">
        ${this.renderConnectorLayer()}
        <div class="attention-layout">
          <section class="concept-card strong">
            <div class="attention-context">
              <div>
                <p class="card-label">${this.copy.contextClues}</p>
                <div class="attention-token-grid">
                  ${tokenPositions.map(({ token, index }) => {
                    const color = PALETTE[index % PALETTE.length];
                    const active = emphasizedIndexes.has(index);
                    return html`
                      <span
                        class="token-stack"
                        data-node=${`attention-${index}`}
                        style=${`animation-delay:${index * 110}ms`}
                      >
                        <span
                          class="token-chip"
                          style=${`--chip-color:var(--${active ? "coral" : color})`}
                        >
                          ${token}
                        </span>
                        <span class="token-index-label">${index + 1}</span>
                      </span>
                    `;
                  })}
                </div>
              </div>
              <div>
                <p class="card-label">${this.copy.nextTokenQuestion}</p>
                <div class="attention-target" data-node="attention-target">?</div>
              </div>
            </div>
          </section>

          <section class="attention-summary">
            <p class="card-label">${this.copy.attentionWeights}</p>
            ${tokenPositions.map(({ token, index, weight }) => {
              const color = index === this.getStrongestAttentionIndex() ? "coral" : "sand";
              return html`
                <div class="weight-row" style=${`animation-delay:${index * 110 + 150}ms`}>
                  <span class="prob-name">${token}</span>
                  <span class="weight-track">
                    <span
                      class="weight-fill"
                      style=${`--weight:${weight};--weight-color:var(--${color});animation-delay:${index * 110 + 210}ms`}
                    ></span>
                  </span>
                </div>
              `;
            })}
          </section>
        </div>
      </div>
    `;
  }

  getAttentionWeights() {
    if (this.sample.id === "rain" || this.sample.id === "taipei")
      return [0.78, 0.9, 0.24, 0.12, 0.22, 0.72, 0.56];
    return [0.18, 0.34, 0.42, 0.24, 0.86, 0.62, 0.38];
  }

  getStrongestAttentionIndex() {
    return this.getAttentionWeights().reduce(
      (bestIndex, weight, index, weights) => (weight > weights[bestIndex] ? index : bestIndex),
      0,
    );
  }

  getTopAttentionIndexes() {
    return this.getAttentionWeights()
      .map((weight, index) => ({ weight, index }))
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 3)
      .sort((a, b) => a.index - b.index)
      .map(({ index }) => index);
  }

  getAttentionStroke(weight) {
    const percent = Math.round(Math.max(0, Math.min(1, weight)) * 100);
    return `color-mix(in oklab, var(--coral) ${percent}%, var(--sand))`;
  }

  renderProbabilitiesScene(showTemperature) {
    if (showTemperature) return this.renderTemperatureSamplingScene();
    const scaled = this.getScaledAlternatives();
    return html`
      <div class="scene-frame" data-scene="probabilities">
        ${this.renderConnectorLayer()}
        <div class="scene-column">
          <div class="flow-row">
            <section class="concept-card strong" data-node="probability-question">
              <p class="card-label">${this.copy.nextTokenQuestion}</p>
              <p class="card-main">“${this.sample.text} ...”</p>
            </section>

            <section data-node="probability-distribution">
              ${this.renderDistributionPanel(scaled, this.copy.rankedCandidates, {
                examples: this.getSampleLines(),
              })}
            </section>
          </div>
        </div>
      </div>
    `;
  }

  renderTemperatureSamplingScene() {
    const scaled = this.getScaledAlternatives(this.temperature);
    const selected = this.getTemperatureSelectedToken(scaled);
    const normalized = (this.temperature - 0.2) / 1.8;
    const modeLabel = this.getTemperatureModeLabel();
    return html`
      <div class="scene-frame" data-scene="temperature">
        ${this.renderConnectorLayer()}
        <div class="temperature-layout">
          <section class="temperature-rail">
            <div class="temperature-rail-row">
              <span class="rail-endpoint">${this.copy.lowTemperature}</span>
              <div class="temperature-track" style=${`--temp-pos:${normalized}`}>
                <span class="temperature-knob"></span>
              </div>
              <span class="rail-endpoint">${this.copy.highTemperature}</span>
            </div>
            <p class="temperature-mode">${modeLabel}</p>
          </section>

          <section data-node="temperature-distribution">
            ${this.renderDistributionPanel(scaled, this.copy.liveDistribution)}
          </section>

          <section class="selected-card" data-node="temperature-selected">
            <p class="card-label">${this.copy.selectedToken}</p>
            <div class="selected-token">
              <span>${selected.label}</span>
              <span class="prob-percent">${Math.round(selected.probability * 100)}%</span>
            </div>
            <div class="loop-note">${this.copy.appendLoop}</div>
          </section>
        </div>
      </div>
    `;
  }

  renderConnectorLayer() {
    return html`<svg class="connector-layer" aria-hidden="true"></svg>`;
  }

  renderHtmlTokenRow(prefix = "token") {
    return html`
      <div class="token-chip-row">
        ${this.sample.tokens.map((token, index) => {
          const color = PALETTE[index % PALETTE.length];
          return html`
            <span
              class="token-chip"
              data-node=${`${prefix}-${index}`}
              style=${`--chip-color:var(--${color});width:${this.getTokenChipWidth(token)}px;opacity:0;animation:tokenStepIn 260ms ease-out ${index * 80}ms forwards`}
            >
              ${token}
            </span>
          `;
        })}
      </div>
    `;
  }

  renderDistributionPanel(alternatives, title, options = {}) {
    return html`
      <div class=${`distribution-panel ${options.examples ? "with-examples" : ""}`}>
        <p class="card-label">${title}</p>
        ${alternatives.slice(0, 6).map(([label, value], index) => {
          const color = PALETTE[index % PALETTE.length];
          return html`
            <div class="prob-row-html" style=${`animation-delay:${index * 80}ms`}>
              <span class="prob-name">${label}</span>
              <span class="prob-track">
                <span
                  class="prob-fill"
                  style=${`--prob:${Math.max(0.02, value)};--bar-color:var(--${color});animation-delay:${index * 80 + 80}ms`}
                ></span>
              </span>
              <span class="prob-percent">${Math.round(value * 100)}%</span>
            </div>
          `;
        })}
        ${options.examples
          ? html`
              <section class="continuation-panel">
                <p class="continuation-title">${this.copy.sampleContinuations}</p>
                ${options.examples.map(
                  (line, index) => html`
                    <div class="continuation-line" style=${`animation-delay:${560 + index * 90}ms`}>
                      ${line}
                    </div>
                  `,
                )}
              </section>
            `
          : nothing}
      </div>
    `;
  }

  renderDistributionBars(alternatives, x, y, maxWidth) {
    return svg`
      <g>
        ${alternatives.slice(0, 6).map(([label, value], index) => {
          const rowY = y + index * 38;
          const color = `var(--${PALETTE[index % PALETTE.length]})`;
          return svg`
            <text class="prob-label" x=${x} y=${rowY + 17}>${label}</text>
            <rect
              x=${x + 105}
              y=${rowY}
              width=${maxWidth}
              height="22"
              rx="6"
              fill="color-mix(in oklab, var(--muted) 72%, transparent)"
            />
            <rect
              x=${x + 105}
              y=${rowY}
              width=${Math.max(8, value * maxWidth)}
              height="22"
              rx="6"
              fill=${color}
              opacity="0.84"
            />
            <text class="prob-value" x=${x + maxWidth + 122} y=${rowY + 17}>
              ${Math.round(value * 100)}%
            </text>
          `;
        })}
      </g>
    `;
  }

  renderGenerationScene() {
    const generated = this.sample.generated.slice(0, 6);
    return svg`
      <svg viewBox="0 0 920 520" role="img">
        <defs>${this.renderArrowDef("loopArrow", "var(--quiet)")}</defs>
        <text class="stage-label" x="72" y="104">${this.sample.text}</text>
        ${this.renderTokenRow(72, 136, 0.72)}
        <path
          class="soft-line loop-path"
          pathLength="1"
          d="M148 256 C238 228 326 228 408 256"
          marker-end="url(#loopArrow)"
        />
        <path
          class="soft-line loop-path"
          pathLength="1"
          style="animation-delay:420ms"
          d="M442 256 C534 288 630 288 724 246"
          marker-end="url(#loopArrow)"
        />
        ${generated.map(
          (token, index) => svg`
            <g class="token generated-token" style=${`animation-delay:${720 + index * 150}ms`}>
              <rect
                x=${160 + index * 92}
                y=${318 + Math.sin(index) * 10}
                width="72"
                height="44"
                rx="10"
                fill=${`color-mix(in oklab, var(--${PALETTE[index % PALETTE.length]}) 28%, var(--background) 72%)`}
                stroke=${`var(--${PALETTE[index % PALETTE.length]})`}
              ></rect>
              <text x=${174 + index * 92} y=${346 + Math.sin(index) * 10}>${token}</text>
            </g>
          `,
        )}
        <text class="hand-label" x="108" y="426">${this.copy.appendLoop}</text>
      </svg>
    `;
  }

  renderLimitsScene() {
    return svg`
      <svg viewBox="0 0 920 520" role="img">
        <text class="serif-label" x="52" y="72">${this.scene.title}</text>
        <path
          class="soft-line bridge-path"
          pathLength="1"
          d="M92 170 C170 106 292 116 360 188 S502 285 612 210 S760 144 826 230"
        />
        <g transform="translate(90 142)">
          ${this.renderMiniCard(0, 0, this.copy.pattern, "var(--sky)")}
          ${this.renderMiniCard(196, 76, this.copy.context, "var(--sage)")}
          ${this.renderMiniCard(392, 36, this.copy.probability, "var(--amber)")}
          ${this.renderMiniCard(588, 118, this.copy.answer, "var(--coral)")}
        </g>
        <path
          class="ghost-line bridge-path"
          pathLength="1"
          style="animation-delay:520ms"
          d="M194 332 C282 382 432 384 536 330 S728 284 792 360"
        />
        <text class="hand-label" x="130" y="415">${this.copy.usefulContinuation}</text>
        <text class="hand-label" x="555" y="415">${this.copy.wrongContinuation}</text>
      </svg>
    `;
  }

  renderMiniCard(x, y, label, color) {
    return svg`
      <g class="mini-card" transform=${`translate(${x} ${y})`} style=${`animation-delay:${160 + x * 0.8}ms`}>
        <rect
          width="132"
          height="78"
          rx="16"
          fill="color-mix(in oklab, var(--background) 72%, ${color} 28%)"
          stroke=${color}
        ></rect>
        <circle cx="22" cy="24" r="7" fill=${color}></circle>
        <text class="stage-label" x="40" y="29">${label}</text>
        <path class="ghost-line" d="M20 52 H110" />
      </g>
    `;
  }

  renderTokenRow(x, y, scale = 1) {
    const width = 78 * scale;
    const gap = 12 * scale;
    return svg`
      <g class="tokens" transform=${`translate(${x} ${y})`}>
        ${this.sample.tokens.map((token, index) => {
          const tx = index * (width + gap);
          const color = PALETTE[index % PALETTE.length];
          return svg`
            <g
              class="token generated-token"
              transform=${`translate(${tx} 0)`}
              style=${`animation-delay:${index * 70}ms`}
            >
              <rect
                width=${width}
                height=${48 * scale}
                rx=${11 * scale}
                fill=${`color-mix(in oklab, var(--${color}) 25%, var(--background) 75%)`}
                stroke=${`var(--${color})`}
              ></rect>
              <text x=${11 * scale} y=${29 * scale} style=${`font-size:${15 * scale}px`}
                >${token}</text
              >
              <text class="token-index" x=${width / 2 - 4} y=${70 * scale}>${index + 1}</text>
            </g>
          `;
        })}
      </g>
    `;
  }

  getTokenChipPositions(x, y, maxWidth) {
    let cursorX = 0;
    let cursorY = 0;
    const rowHeight = 46;
    const gap = 8;
    const positions = this.sample.tokens.map((token, index) => {
      const width = Math.max(48, Math.min(112, token.length * 11 + 24));
      if (cursorX > 0 && cursorX + width > maxWidth) {
        cursorX = 0;
        cursorY += rowHeight;
      }
      const chip = { token, index, x: cursorX, y: cursorY, width };
      cursorX += width + gap;
      return chip;
    });
    return positions.map((chip) => ({
      ...chip,
      absX: x + chip.x,
      absY: y + chip.y,
      centerX: x + chip.x + chip.width / 2,
      centerY: y + chip.y + 17,
    }));
  }

  renderSourceTokenGrid(x, y, maxWidth, providedPositions = null) {
    const positions = providedPositions ?? this.getTokenChipPositions(x, y, maxWidth);
    return svg`
      <g class="tokens">
        ${positions.map(({ token, index, absX, absY, width }) => {
          const color = PALETTE[index % PALETTE.length];
          return svg`
            <g
              class="token"
              transform=${`translate(${absX} ${absY})`}
              style=${`opacity:0;animation:svgTokenFadeIn 280ms ease-out ${index * 90}ms forwards`}
            >
              <rect
                width=${width}
                height="34"
                rx="10"
                fill=${`color-mix(in oklab, var(--${color}) 25%, var(--background) 75%)`}
                stroke=${`var(--${color})`}
              ></rect>
              <text x="12" y="22" style="font-size:13px">${token}</text>
            </g>
          `;
        })}
      </g>
    `;
  }

  renderTemperatureDial() {
    const angle = -130 + ((this.temperature - 0.2) / 1.8) * 260;
    const radians = (angle * Math.PI) / 180;
    const x2 = 640 + Math.cos(radians) * 58;
    const y2 = 265 + Math.sin(radians) * 58;
    return svg`
      <g>
        <text class="stage-label" x="598" y="164">${this.copy.temperature}</text>
        <circle
          cx="640"
          cy="265"
          r="78"
          fill="color-mix(in oklab, var(--background) 74%, var(--paper-strong) 26%)"
          stroke="var(--line)"
        />
        <circle cx="640" cy="265" r="55" fill="none" stroke="var(--line)" stroke-width="5" />
        <path
          d="M585 320 A78 78 0 0 1 586 210"
          fill="none"
          stroke="var(--sky)"
          stroke-width="5"
          stroke-linecap="round"
        />
        <path
          d="M694 210 A78 78 0 0 1 695 320"
          fill="none"
          stroke="var(--coral)"
          stroke-width="5"
          stroke-linecap="round"
        />
        <path
          d=${`M640 265 L${x2} ${y2}`}
          stroke="var(--ink)"
          stroke-width="5"
          stroke-linecap="round"
        />
        <circle cx="640" cy="265" r="7" fill="var(--ink)" />
        <text class="prob-value" x="560" y="360">0.2 ${this.copy.lowTemperature}</text>
        <text class="prob-value" x="672" y="360">2.0 ${this.copy.highTemperature}</text>
      </g>
    `;
  }

  getSampleLines() {
    return [
      `${this.sample.text} ${this.sample.nextToken}`,
      `${this.sample.text} ${this.getScaledAlternatives()[1]?.[0] ?? this.sample.nextToken}`,
      `${this.sample.text} ${this.getScaledAlternatives()[2]?.[0] ?? this.sample.nextToken}`,
    ];
  }

  renderSampleLines(x, y) {
    const lines = this.getSampleLines();
    return svg`
      <g>
        ${lines.map(
          (line, index) => svg`
            <text class="stage-label" x=${x} y=${y + index * 36}>${line}</text>
          `,
        )}
      </g>
    `;
  }

  getTokenChipWidth(token) {
    return Math.max(34, Math.min(86, String(token).length * 9 + 20));
  }

  scheduleConnectorDraw() {
    if (this.connectorFrame) window.cancelAnimationFrame(this.connectorFrame);
    this.connectorFrame = window.requestAnimationFrame(() => {
      this.connectorFrame = 0;
      this.drawConnectors();
    });
  }

  drawConnectors() {
    const frame = this.renderRoot.querySelector(".scene-frame");
    const layer = frame?.querySelector(".connector-layer");
    if (!frame || !layer) return;

    const frameRect = frame.getBoundingClientRect();
    const width = Math.max(1, frameRect.width);
    const height = Math.max(1, frameRect.height);
    layer.setAttribute("viewBox", `0 0 ${width} ${height}`);
    layer.replaceChildren();
    layer.append(this.createConnectorDefs());

    const scene = frame.dataset.scene;
    if (scene === "tokens") {
      this.drawArrow(layer, frame, "sentence-card", "token-card");
      this.sample.tokens.forEach((_, index) => {
        this.drawSplit(layer, frame, `token-${index}`, `split-${index}`);
      });
      return;
    }

    if (scene === "attention") {
      const emphasized = this.getTopAttentionIndexes();
      emphasized.forEach((index, drawIndex) => {
        const weight = this.getAttentionWeights()[index] ?? 0.25;
        this.drawArrow(layer, frame, `attention-${index}`, "attention-target", {
          className: "attention",
          color: this.getAttentionStroke(weight),
          opacity: 0.22 + weight * 0.54,
          width: 1.15 + weight * 3.15,
          arrow: false,
          endDot: true,
          route: "arc",
          startAnchor: "top",
          endAnchor: "left",
          lift: 36 + drawIndex * 18,
          delay: index * 110 + 260,
        });
      });
      return;
    }

    if (scene === "probabilities") {
      this.drawArrow(layer, frame, "probability-question", "probability-distribution");
      return;
    }

    if (scene === "temperature") {
      this.drawArrow(layer, frame, "temperature-distribution", "temperature-selected");
    }
  }

  createConnectorDefs() {
    const ns = "http://www.w3.org/2000/svg";
    const defs = document.createElementNS(ns, "defs");
    const marker = document.createElementNS(ns, "marker");
    marker.setAttribute("id", "layout-arrow");
    marker.setAttribute("markerWidth", "8");
    marker.setAttribute("markerHeight", "8");
    marker.setAttribute("refX", "7");
    marker.setAttribute("refY", "4");
    marker.setAttribute("orient", "auto");
    marker.setAttribute("markerUnits", "userSpaceOnUse");

    const arrow = document.createElementNS(ns, "path");
    arrow.setAttribute("d", "M0 0 L8 4 L0 8");
    arrow.setAttribute("fill", "currentColor");
    marker.append(arrow);
    defs.append(marker);
    return defs;
  }

  getNode(frame, name) {
    return frame.querySelector(`[data-node="${name}"]`);
  }

  getRelativeRect(frame, element) {
    const frameRect = frame.getBoundingClientRect();
    const rect = element.getBoundingClientRect();
    return {
      left: rect.left - frameRect.left,
      top: rect.top - frameRect.top,
      right: rect.right - frameRect.left,
      bottom: rect.bottom - frameRect.top,
      width: rect.width,
      height: rect.height,
      centerX: rect.left - frameRect.left + rect.width / 2,
      centerY: rect.top - frameRect.top + rect.height / 2,
    };
  }

  drawArrow(layer, frame, fromName, toName, options = {}) {
    const from = this.getNode(frame, fromName);
    const to = this.getNode(frame, toName);
    if (!from || !to) return;

    const a = this.getRelativeRect(frame, from);
    const b = this.getRelativeRect(frame, to);
    const leftToRight = a.centerX <= b.centerX;
    const start = this.getAnchorPoint(a, options.startAnchor, leftToRight ? "right" : "left");
    const end = this.getAnchorPoint(b, options.endAnchor, leftToRight ? "left" : "right");
    const dx = Math.max(42, Math.abs(end.x - start.x) * 0.38);
    const lift = options.lift ?? 0;
    const c1 = leftToRight ? start.x + dx : start.x - dx;
    const c2 = leftToRight ? end.x - dx : end.x + dx;
    const routeY = options.route === "arc" ? Math.min(start.y, end.y) - lift : start.y;
    const d =
      options.route === "arc"
        ? `M${start.x} ${start.y} C${c1} ${routeY}, ${c2} ${routeY}, ${end.x} ${end.y}`
        : `M${start.x} ${start.y} C${c1} ${start.y}, ${c2} ${end.y}, ${end.x} ${end.y}`;

    this.appendPath(
      layer,
      d,
      options.className ?? "",
      options.width,
      options.arrow ?? true,
      options.delay,
      options,
    );
    if (options.endDot) this.appendAttentionDot(layer, end.x, end.y, options);
  }

  getAnchorPoint(rect, anchor, fallback) {
    const resolved = anchor ?? fallback;
    if (resolved === "top") return { x: rect.centerX, y: rect.top };
    if (resolved === "bottom") return { x: rect.centerX, y: rect.bottom };
    if (resolved === "left") {
      return {
        x: rect.left,
        y: Math.max(rect.top + 20, Math.min(rect.bottom - 20, rect.centerY)),
      };
    }
    return {
      x: rect.right,
      y: Math.max(rect.top + 20, Math.min(rect.bottom - 20, rect.centerY)),
    };
  }

  drawSplit(layer, frame, fromName, toName) {
    const from = this.getNode(frame, fromName);
    const to = this.getNode(frame, toName);
    if (!from || !to) return;

    const a = this.getRelativeRect(frame, from);
    const b = this.getRelativeRect(frame, to);
    const start = { x: a.centerX, y: a.bottom + 2 };
    const end = { x: b.centerX, y: b.top + 1 };
    const midY = start.y + Math.max(18, (end.y - start.y) * 0.48);
    const d = `M${start.x} ${start.y} C${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;
    this.appendPath(layer, d, "split", null, false);
  }

  appendPath(layer, d, className = "", width = null, arrow = false, delay = null, options = {}) {
    const ns = "http://www.w3.org/2000/svg";
    const path = document.createElementNS(ns, "path");
    path.setAttribute("class", `connector-path ${className}`.trim());
    path.setAttribute("d", d);
    path.setAttribute("pathLength", "1");
    if (width) path.style.strokeWidth = `${width}px`;
    if (arrow) path.setAttribute("marker-end", "url(#layout-arrow)");
    if (delay !== null) path.style.animationDelay = `${delay}ms`;
    if (options.color) {
      path.style.setProperty("--attention-stroke", options.color);
      path.style.color = options.color;
    }
    if (options.opacity !== undefined) {
      path.style.setProperty("--attention-opacity", String(options.opacity));
    }
    layer.append(path);
  }

  appendDot(layer, x, y) {
    const ns = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("class", "connector-dot");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", "3.2");
    layer.append(circle);
  }

  appendAttentionDot(layer, x, y, options = {}) {
    const ns = "http://www.w3.org/2000/svg";
    const circle = document.createElementNS(ns, "circle");
    circle.setAttribute("class", "connector-dot attention-dot");
    circle.setAttribute("cx", String(x));
    circle.setAttribute("cy", String(y));
    circle.setAttribute("r", String(Math.max(3.2, (options.width ?? 2) * 1.05)));
    if (options.color) circle.style.setProperty("--attention-stroke", options.color);
    if (options.opacity !== undefined) {
      circle.style.setProperty("--attention-opacity", String(Math.min(0.8, options.opacity + 0.12)));
    }
    if (options.delay !== null && options.delay !== undefined) {
      circle.style.animation = "svgTokenFadeIn 180ms ease-out both";
      circle.style.animationDelay = `${options.delay + 520}ms`;
    }
    layer.append(circle);
  }

  renderArrowDef(id, color) {
    return svg`
      <marker
        id=${id}
        markerWidth="8"
        markerHeight="8"
        refX="7"
        refY="4"
        orient="auto"
        markerUnits="userSpaceOnUse"
      >
        <path d="M0 0 L8 4 L0 8" fill=${color}></path>
      </marker>
    `;
  }

  getScaledAlternatives(temperature = this.temperature) {
    const power = 1 / Math.max(0.2, temperature);
    const raw = this.sample.alternatives.map(([label, value]) => [label, Math.pow(value, power)]);
    const total = raw.reduce((sum, [, value]) => sum + value, 0) || 1;
    return raw.map(([label, value]) => [label, value / total]);
  }

  getTemperatureSelectedToken(alternatives) {
    const normalized = Math.max(0, Math.min(1, (this.temperature - 0.2) / 1.8));
    const threshold = 0.18 + normalized * 0.68;
    let cumulative = 0;
    for (const [label, value] of alternatives) {
      cumulative += value;
      if (threshold <= cumulative) return { label, probability: value };
    }
    const [label, probability] = alternatives.at(-1) ?? [this.sample.nextToken, 1];
    return { label, probability };
  }

  getTemperatureModeLabel() {
    if (this.temperature < 0.75) return this.copy.likelyPath;
    if (this.temperature > 1.35) return this.copy.widerPath;
    return this.copy.balancedPath;
  }
}

customElements.define("llm-concept-animation", LlmConceptAnimation);
