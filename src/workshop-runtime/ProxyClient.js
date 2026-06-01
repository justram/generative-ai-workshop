import { i18n } from "../mini-lit/index.js";
import { AssistantMessageEventStream, parseStreamingJson } from "./AgentRuntime.js";
import { clearAuthToken } from "./AuthToken.js";

function createEmptyAssistantMessage(model) {
  return {
    role: "assistant",
    stopReason: "stop",
    content: [],
    api: model.api,
    provider: model.provider,
    model: model.id,
    usage: {
      input: 0,
      output: 0,
      cacheRead: 0,
      cacheWrite: 0,
      cost: {
        input: 0,
        output: 0,
        cacheRead: 0,
        cacheWrite: 0,
        total: 0,
      },
    },
    timestamp: Date.now(),
  };
}

function proxyError(status, statusText) {
  return i18n("Proxy error: {status} {statusText}")(status, statusText);
}

function convertProxyEvent(event, message) {
  switch (event.type) {
    case "start":
      return { type: "start", partial: message };
    case "text_start":
      message.content[event.contentIndex] = { type: "text", text: "" };
      return { type: "text_start", contentIndex: event.contentIndex, partial: message };
    case "text_delta": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "text") throw Error("Received text_delta for non-text content");
      content.text += event.delta;
      return {
        type: "text_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial: message,
      };
    }
    case "text_end": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "text") throw Error("Received text_end for non-text content");
      content.textSignature = event.contentSignature;
      return {
        type: "text_end",
        contentIndex: event.contentIndex,
        content: content.text,
        partial: message,
      };
    }
    case "thinking_start":
      message.content[event.contentIndex] = { type: "thinking", thinking: "" };
      return { type: "thinking_start", contentIndex: event.contentIndex, partial: message };
    case "thinking_delta": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "thinking") {
        throw Error("Received thinking_delta for non-thinking content");
      }
      content.thinking += event.delta;
      return {
        type: "thinking_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial: message,
      };
    }
    case "thinking_end": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "thinking")
        throw Error("Received thinking_end for non-thinking content");
      content.thinkingSignature = event.contentSignature;
      return {
        type: "thinking_end",
        contentIndex: event.contentIndex,
        content: content.thinking,
        partial: message,
      };
    }
    case "toolcall_start":
      message.content[event.contentIndex] = {
        type: "toolCall",
        id: event.id,
        name: event.toolName,
        arguments: {},
        partialJson: "",
      };
      return { type: "toolcall_start", contentIndex: event.contentIndex, partial: message };
    case "toolcall_delta": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "toolCall") {
        throw Error("Received toolcall_delta for non-toolCall content");
      }
      content.partialJson += event.delta;
      content.arguments = parseStreamingJson(content.partialJson) || {};
      message.content[event.contentIndex] = { ...content };
      return {
        type: "toolcall_delta",
        contentIndex: event.contentIndex,
        delta: event.delta,
        partial: message,
      };
    }
    case "toolcall_end": {
      const content = message.content[event.contentIndex];
      if (content?.type !== "toolCall") return undefined;
      delete content.partialJson;
      return {
        type: "toolcall_end",
        contentIndex: event.contentIndex,
        toolCall: content,
        partial: message,
      };
    }
    case "done":
      message.stopReason = event.reason;
      message.usage = event.usage;
      return { type: "done", reason: event.reason, message };
    case "error":
      message.stopReason = event.reason;
      message.errorMessage = event.errorMessage;
      message.usage = event.usage;
      return { type: "error", reason: event.reason, error: message };
    default:
      console.warn(`Unhandled event type: ${event.type}`);
      return undefined;
  }
}

export function streamSimpleProxy(model, context, options) {
  const stream = new AssistantMessageEventStream();

  (async () => {
    const message = createEmptyAssistantMessage(model);
    let reader;
    const abortReader = () => {
      reader?.cancel("Request aborted by user").catch(() => {});
    };

    options.signal?.addEventListener("abort", abortReader);

    try {
      const response = await fetch("/api/stream", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${options.authToken}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model,
          context,
          options: {
            temperature: options.temperature,
            maxTokens: options.maxTokens,
            reasoning: options.reasoning,
          },
        }),
        signal: options.signal,
      });

      if (!response.ok) {
        let messageText = proxyError(response.status, response.statusText);
        try {
          const payload = await response.json();
          if (payload.error) messageText = i18n("Proxy error: {error}")(payload.error);
        } catch {}
        throw Error(messageText);
      }

      reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = "";

      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        if (options.signal?.aborted) throw Error("Request aborted by user");

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split("\n");
        buffer = lines.pop() || "";

        for (const line of lines) {
          if (!line.startsWith("data: ")) continue;
          const raw = line.slice(6).trim();
          if (!raw) continue;
          const event = JSON.parse(raw);
          const converted = convertProxyEvent(event, message);
          if (converted) stream.push(converted);
          else throw Error("Failed to create event from proxy event");
        }
      }

      if (options.signal?.aborted) throw Error("Request aborted by user");
      stream.end();
    } catch (error) {
      const messageText = error instanceof Error ? error.message : String(error);
      if (messageText.toLowerCase().includes("proxy") && messageText.includes("Unauthorized")) {
        clearAuthToken();
      }
      message.stopReason = options.signal?.aborted ? "aborted" : "error";
      message.errorMessage = messageText;
      stream.push({ type: "error", reason: message.stopReason, error: message });
      stream.end();
    } finally {
      options.signal?.removeEventListener("abort", abortReader);
    }
  })();

  return stream;
}
