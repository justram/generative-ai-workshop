export const models = {
  "openai-codex": {
    "gpt-5.5": {
      id: "gpt-5.5",
      name: "GPT-5.5",
      api: "openai-codex-responses",
      provider: "openai-codex",
      baseUrl: "https://chatgpt.com/backend-api",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 5, output: 30, cacheRead: 0.5, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
    "gpt-5.4": {
      id: "gpt-5.4",
      name: "GPT-5.4",
      api: "openai-codex-responses",
      provider: "openai-codex",
      baseUrl: "https://chatgpt.com/backend-api",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 2.5, output: 15, cacheRead: 0.25, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
    "gpt-5.4-mini": {
      id: "gpt-5.4-mini",
      name: "GPT-5.4 Mini",
      api: "openai-codex-responses",
      provider: "openai-codex",
      baseUrl: "https://chatgpt.com/backend-api",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 0.75, output: 4.5, cacheRead: 0.075, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
    "gpt-5.3-codex": {
      id: "gpt-5.3-codex",
      name: "GPT-5.3 Codex",
      api: "openai-codex-responses",
      provider: "openai-codex",
      baseUrl: "https://chatgpt.com/backend-api",
      reasoning: true,
      input: ["text", "image"],
      cost: { input: 1.75, output: 14, cacheRead: 0.175, cacheWrite: 0 },
      contextWindow: 272000,
      maxTokens: 128000,
    },
  },
};

export function getModel(provider, modelId) {
  const providerModels = models[provider];
  if (!providerModels) throw Error(`Unknown provider: ${provider}`);
  const model = providerModels[modelId];
  if (!model) throw Error(`Unknown model: ${provider}/${modelId}`);
  return model;
}

export function formatTokenCount(tokens = 0) {
  return new Intl.NumberFormat("en-US").format(tokens);
}

export function formatCost(cost = 0) {
  return `$${Number(cost || 0).toFixed(4)}`;
}
