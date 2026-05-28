import { i18n } from "../mini-lit/index.js";
import { agentLoop, getModel } from "./AgentRuntime.js";
import { getAuthToken } from "./AuthToken.js";
import { createAgentSessionClass } from "./AgentSessionCore.js";
import { streamSimpleProxy } from "./ProxyClient.js";

export const AgentSession = createAgentSessionClass({
  agentLoop,
  getAuthToken,
  getModel,
  i18n,
  streamSimpleProxy,
});
