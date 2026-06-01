import { Type } from "./AgentSchema.js";

function evaluateExpression(expression) {
  try {
    const result = Function(`"use strict"; return (${expression});`)();
    return { output: `${expression} = ${result}`, details: undefined };
  } catch (error) {
    throw Error(error?.message || String(error));
  }
}

export const calculateTool = {
  label: "Calculator",
  name: "calculate",
  description: "Evaluate mathematical expressions",
  parameters: Type.Object({
    expression: Type.String({
      description: "The mathematical expression to evaluate",
    }),
  }),
  execute: async (_id, args) => evaluateExpression(args.expression),
};

function currentTime(timezone) {
  const now = new Date();
  if (!timezone) {
    return {
      output: now.toLocaleString("en-US", { dateStyle: "full", timeStyle: "long" }),
      details: { utcTimestamp: now.getTime() },
    };
  }
  try {
    return {
      output: now.toLocaleString("en-US", {
        timeZone: timezone,
        dateStyle: "full",
        timeStyle: "long",
      }),
      details: { utcTimestamp: now.getTime() },
    };
  } catch {
    throw Error(`Invalid timezone: ${timezone}. Current UTC time: ${now.toISOString()}`);
  }
}

export const getCurrentTimeTool = {
  label: "Current Time",
  name: "get_current_time",
  description: "Get the current date and time",
  parameters: Type.Object({
    timezone: Type.Optional(
      Type.String({
        description: "Optional timezone (e.g., 'America/New_York', 'Europe/London')",
      }),
    ),
  }),
  execute: async (_id, args) => currentTime(args.timezone),
};
