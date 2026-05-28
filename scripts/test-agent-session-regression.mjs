#!/usr/bin/env node

import fs from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { createAgentSessionClass } from "../src/workshop-runtime/AgentSessionCore.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.resolve(__dirname, "..");
const OUT_FILE = path.join(ROOT, "test-results", "agent-session-regression.json");

const fakeModel = { provider: "test", api: "test", id: "fake" };

function textPart(text) {
  return { type: "text", text };
}

function assistantMessage(text, timestamp = Date.now()) {
  return {
    role: "assistant",
    content: [textPart(text)],
    api: "test",
    provider: "test",
    model: "fake",
    stopReason: "stop",
    timestamp,
  };
}

function stringAssistantMessage(text, timestamp = Date.now()) {
  return {
    role: "assistant",
    content: text,
    api: "test",
    provider: "test",
    model: "fake",
    stopReason: "stop",
    timestamp,
  };
}

function createSessionClass() {
  return createAgentSessionClass({
    agentLoop: async function* () {},
    getAuthToken: async () => "test-token",
    getModel: () => fakeModel,
    i18n: (value) => value,
    streamSimpleProxy: async function* () {},
  });
}

class NoMessageEndTransport {
  async *run(userMessage) {
    yield { type: "turn_start" };
    yield { type: "message_start", message: assistantMessage("") };
    yield { type: "message_update", message: assistantMessage("partial answer") };
    yield { type: "message_update", message: assistantMessage("final answer") };
    yield { type: "turn_end" };
    yield { type: "agent_end", messages: [userMessage, assistantMessage("final answer")] };
  }
}

class MessageEndThenThinAgentEndTransport {
  async *run(userMessage) {
    const final = assistantMessage("message_end answer", 12345);
    yield { type: "turn_start" };
    yield { type: "message_start", message: assistantMessage("") };
    yield { type: "message_update", message: assistantMessage("message_end answer", 12345) };
    yield { type: "message_end", message: final };
    yield { type: "turn_end" };
    yield { type: "agent_end", messages: [userMessage] };
  }
}

class TwoAssistantMessagesTransport {
  async *run(userMessage) {
    const toolCall = {
      role: "assistant",
      content: [
        { type: "toolCall", id: "call-1", name: "calculate", arguments: { expression: "1+1" } },
      ],
      api: "test",
      provider: "test",
      model: "fake",
      stopReason: "toolUse",
      timestamp: 23456,
    };
    yield { type: "turn_start" };
    yield { type: "message_start", message: toolCall };
    yield { type: "message_end", message: toolCall };
    yield { type: "message_start", message: assistantMessage("final after tool", 34567) };
    yield { type: "message_end", message: assistantMessage("final after tool", 34567) };
    yield { type: "turn_end" };
    yield {
      type: "agent_end",
      messages: [userMessage, toolCall, assistantMessage("final after tool", 34567)],
    };
  }
}

class StringContentNoMessageEndTransport {
  async *run(userMessage) {
    yield { type: "turn_start" };
    yield { type: "message_start", message: stringAssistantMessage("") };
    yield { type: "message_update", message: stringAssistantMessage("string final answer") };
    yield { type: "turn_end" };
    yield {
      type: "agent_end",
      messages: [userMessage, stringAssistantMessage("string final answer")],
    };
  }
}

function messageSummary(message) {
  const text =
    typeof message.content === "string"
      ? message.content
      : message.content?.find?.((part) => part.type === "text")?.text || "";
  return {
    role: message.role,
    text,
    tool: message.content?.find?.((part) => part.type === "toolCall")?.name || "",
  };
}

async function runCase({ name, transport, expectedTexts = [], expectedTools = 0 }) {
  const AgentSession = createSessionClass();
  const session = new AgentSession({ transport });
  session.setModel(fakeModel);

  const observedStates = [];
  session.subscribe((event) => {
    if (event.type !== "state-update") return;
    observedStates.push({
      isStreaming: event.state.isStreaming,
      streamText:
        typeof event.state.streamMessage?.content === "string"
          ? event.state.streamMessage.content
          : event.state.streamMessage?.content?.find((part) => part.type === "text")?.text || "",
      messageCount: event.state.messages.length,
    });
  });

  await session.prompt("hello");

  const messages = session.state.messages.map(messageSummary);
  const userCount = messages.filter((message) => message.role === "user").length;
  const assistantMessages = messages.filter((message) => message.role === "assistant");
  const toolCallCount = assistantMessages.filter((message) => message.tool).length;
  const assistantText = assistantMessages.map((message) => message.text).join("\n");

  if (userCount !== 1) throw new Error(`${name}: expected one user message, got ${userCount}`);
  for (const expectedText of expectedTexts) {
    if (!assistantText.includes(expectedText)) {
      throw new Error(`${name}: missing persisted assistant text "${expectedText}"`);
    }
  }
  if (toolCallCount !== expectedTools) {
    throw new Error(
      `${name}: expected ${expectedTools} tool-call assistant message(s), got ${toolCallCount}`,
    );
  }
  if (session.state.isStreaming || session.state.streamMessage) {
    throw new Error(`${name}: final stream state was not cleared`);
  }
  if (!observedStates.some((state) => state.isStreaming)) {
    throw new Error(`${name}: isStreaming was never observed`);
  }

  return {
    name,
    finalMessages: messages,
    observedStreamingStates: observedStates.filter((state) => state.isStreaming).length,
  };
}

const results = [
  await runCase({
    name: "no-message-end-agent-end",
    transport: new NoMessageEndTransport(),
    expectedTexts: ["final answer"],
  }),
  await runCase({
    name: "message-end-then-thin-agent-end",
    transport: new MessageEndThenThinAgentEndTransport(),
    expectedTexts: ["message_end answer"],
  }),
  await runCase({
    name: "tool-call-plus-final-answer",
    transport: new TwoAssistantMessagesTransport(),
    expectedTexts: ["final after tool"],
    expectedTools: 1,
  }),
  await runCase({
    name: "string-content-no-message-end",
    transport: new StringContentNoMessageEndTransport(),
    expectedTexts: ["string final answer"],
  }),
];

await fs.mkdir(path.dirname(OUT_FILE), { recursive: true });
await fs.writeFile(
  OUT_FILE,
  `${JSON.stringify({ ok: true, generatedAt: new Date().toISOString(), results }, null, 2)}\n`,
  "utf8",
);

console.log(`Agent session regression passed: ${OUT_FILE}`);
console.log(JSON.stringify(results, null, 2));
