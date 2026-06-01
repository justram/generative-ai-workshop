class EventStream {
  constructor(isComplete, extractResult) {
    this.isComplete = isComplete;
    this.extractResult = extractResult;
    this.queue = [];
    this.waiting = [];
    this.done = false;
    this.finalResultPromise = new Promise((resolve) => {
      this.resolveFinalResult = resolve;
    });
  }

  push(event) {
    if (this.done) return;
    if (this.isComplete(event)) {
      this.done = true;
      this.resolveFinalResult(this.extractResult(event));
    }
    const next = this.waiting.shift();
    if (next) next({ value: event, done: false });
    else this.queue.push(event);
  }

  end(result) {
    this.done = true;
    if (result !== undefined) this.resolveFinalResult(result);
    while (this.waiting.length > 0) {
      this.waiting.shift()({ value: undefined, done: true });
    }
  }

  async *[Symbol.asyncIterator]() {
    for (;;) {
      if (this.queue.length > 0) {
        yield this.queue.shift();
      } else if (this.done) {
        return;
      } else {
        const event = await new Promise((resolve) => this.waiting.push(resolve));
        if (event.done) return;
        yield event.value;
      }
    }
  }

  result() {
    return this.finalResultPromise;
  }
}

export class AssistantMessageEventStream extends EventStream {
  constructor() {
    super(
      (event) => event.type === "done" || event.type === "error",
      (event) => {
        if (event.type === "done") return event.message;
        if (event.type === "error") return event.error;
        throw Error("Unexpected event type for final result");
      },
    );
  }
}

function closePartialJson(input) {
  let output = "";
  const stack = [];
  let inString = false;
  let escaped = false;

  for (const character of input) {
    output += character;
    if (inString) {
      if (escaped) {
        escaped = false;
      } else if (character === "\\") {
        escaped = true;
      } else if (character === '"') {
        inString = false;
      }
      continue;
    }

    if (character === '"') inString = true;
    else if (character === "{") stack.push("}");
    else if (character === "[") stack.push("]");
    else if ((character === "}" || character === "]") && stack.at(-1) === character) stack.pop();
  }

  if (inString) output += '"';
  while (stack.length > 0) output += stack.pop();
  return output;
}

export function parseStreamingJson(text) {
  if (!text || text.trim() === "") return {};
  try {
    return JSON.parse(text);
  } catch {}

  try {
    return JSON.parse(closePartialJson(text));
  } catch {
    return {};
  }
}
