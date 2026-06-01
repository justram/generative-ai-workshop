function cloneMessage(message) {
  if (!message || typeof message !== "object") return message;
  return { ...message };
}

function isToolCall(part) {
  return part?.type === "toolCall" && (part.name || part.id);
}

function normalizeToolOutput(result) {
  if (typeof result === "string") return { output: result, details: {} };
  if (!result || typeof result !== "object") {
    return { output: String(result ?? ""), details: {} };
  }
  return {
    output: typeof result.output === "string" ? result.output : JSON.stringify(result.output ?? ""),
    details: result.details ?? {},
  };
}

function resolveTool(tools = [], toolCall) {
  return (
    tools.find((tool) => tool.name === toolCall.name) ??
    (!toolCall.name && tools.length === 1 ? tools[0] : undefined)
  );
}

async function executeTool(tools, toolCall, signal, queue) {
  const tool = resolveTool(tools, toolCall);
  const toolName = toolCall.name ?? tool?.name ?? "tool";
  queue.push({
    type: "tool_execution_start",
    toolCallId: toolCall.id,
    toolName,
    args: toolCall.arguments,
  });

  let output;
  let details = {};
  let isError = false;
  try {
    if (!tool) throw Error(`Tool ${toolName} not found`);
    const result = await tool.execute(toolCall.id, toolCall.arguments ?? {}, signal);
    ({ output, details } = normalizeToolOutput(result));
  } catch (error) {
    output = error?.message || String(error);
    details = {};
    isError = true;
  }

  queue.push({
    type: "tool_execution_end",
    toolCallId: toolCall.id,
    toolName,
    result: { output, details },
    isError,
  });

  return {
    role: "toolResult",
    toolCallId: toolCall.id,
    toolName,
    output,
    details,
    isError,
    timestamp: Date.now(),
  };
}

async function runModelTurn(context, options, signal, streamTransport, queue) {
  const preprocessedMessages = options.preprocessor
    ? await options.preprocessor(context.messages, signal)
    : context.messages.slice();
  const modelContext = {
    systemPrompt: context.systemPrompt,
    messages: preprocessedMessages.map((message) => {
      if (message.role !== "toolResult") return message;
      const { details: _details, ...withoutDetails } = message;
      return withoutDetails;
    }),
    tools: context.tools,
  };
  const stream = await streamTransport(options.model, modelContext, { ...options, signal });
  let current = null;
  let started = false;

  for await (const event of stream) {
    if (event.type === "start") {
      current = cloneMessage(event.partial);
      started = true;
      context.messages.push(current);
      queue.push({ type: "message_start", message: cloneMessage(current) });
      continue;
    }

    if (
      [
        "text_start",
        "text_delta",
        "text_end",
        "thinking_start",
        "thinking_delta",
        "thinking_end",
        "toolcall_start",
        "toolcall_delta",
        "toolcall_end",
      ].includes(event.type)
    ) {
      if (!event.partial) continue;
      current = cloneMessage(event.partial);
      if (started) context.messages[context.messages.length - 1] = current;
      queue.push({
        type: "message_update",
        assistantMessageEvent: event,
        message: cloneMessage(current),
      });
      continue;
    }

    if (event.type === "done" || event.type === "error") {
      const finalMessage = stream.result ? await stream.result() : current;
      if (!finalMessage) return current;
      if (started) context.messages[context.messages.length - 1] = finalMessage;
      else context.messages.push(finalMessage);
      queue.push({ type: "message_end", message: finalMessage });
      return finalMessage;
    }
  }

  const finalMessage = stream.result ? await stream.result() : current;
  if (finalMessage) {
    if (started) context.messages[context.messages.length - 1] = finalMessage;
    else context.messages.push(finalMessage);
    queue.push({ type: "message_end", message: finalMessage });
  }
  return finalMessage;
}

export async function* agentLoop(userMessage, context, options, signal, streamTransport) {
  const queue = [];
  const push = (event) => queue.push(event);
  const flush = async function* flushEvents() {
    while (queue.length) yield queue.shift();
  };

  const workingContext = {
    systemPrompt: context.systemPrompt ?? "",
    messages: [...(context.messages ?? []), userMessage],
    tools: context.tools ?? [],
  };
  const emittedMessages = [userMessage];

  push({ type: "agent_start" });
  push({ type: "turn_start" });
  push({ type: "message_start", message: userMessage });
  push({ type: "message_end", message: userMessage });
  yield* flush();

  const maxTurns = options.maxTurns ?? 8;
  for (let turn = 0; turn < maxTurns; turn += 1) {
    if (turn > 0) push({ type: "turn_start" });
    yield* flush();

    const assistantMessage = await runModelTurn(
      workingContext,
      options,
      signal,
      streamTransport,
      queue,
    );
    yield* flush();

    if (!assistantMessage) break;
    emittedMessages.push(assistantMessage);

    if (assistantMessage.stopReason === "error" || assistantMessage.stopReason === "aborted") {
      push({ type: "turn_end", message: assistantMessage, toolResults: [] });
      push({ type: "agent_end", messages: emittedMessages });
      yield* flush();
      return;
    }

    const toolCalls = (assistantMessage.content ?? []).filter(isToolCall);
    if (!toolCalls.length) {
      push({ type: "turn_end", message: assistantMessage, toolResults: [] });
      push({ type: "agent_end", messages: emittedMessages });
      yield* flush();
      return;
    }

    const toolResults = [];
    for (const toolCall of toolCalls) {
      const toolResult = await executeTool(workingContext.tools, toolCall, signal, queue);
      toolResults.push(toolResult);
      workingContext.messages.push(toolResult);
      emittedMessages.push(toolResult);
      push({ type: "message_start", message: toolResult });
      push({ type: "message_end", message: toolResult });
      yield* flush();
    }
    push({ type: "turn_end", message: assistantMessage, toolResults });
    yield* flush();
  }

  push({ type: "agent_end", messages: emittedMessages });
  yield* flush();
}
