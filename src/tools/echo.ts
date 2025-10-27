import { z } from "zod";
import type { ToolHandler } from "@modelcontextprotocol/sdk";

export const echoTool: ToolHandler = {
  description: "Echo back a message",
  inputSchema: z.object({
    message: z.string().min(1),
  }),
  handler: async ({ message }) => {
    return { text: message };
  },
};

