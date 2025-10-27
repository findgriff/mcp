import { WebSocket } from "ws";
import { echoTool } from "./tools/echo.js";
import { dbQueryTool } from "./tools/db.js";

const tools = [echoTool, dbQueryTool];

export function handleMcpMessage(ws: WebSocket, message: string) {
  try {
    const parsed = JSON.parse(message);

    if (parsed.method === "tools/list") {
      const response = {
        jsonrpc: "2.0",
        id: parsed.id,
        result: {
          tools: tools.map((tool) => ({
            name: tool.name,
            description: tool.description,
            inputSchema: {
              type: "object",
              properties: {},
            },
          })),
        },
      };
      ws.send(JSON.stringify(response));
    } else if (parsed.method === "tools/call") {
      const tool = tools.find((t) => t.name === parsed.params.name);
      if (!tool) {
        ws.send(
          JSON.stringify({
            jsonrpc: "2.0",
            id: parsed.id,
            error: { code: -32601, message: "Method not found" },
          }),
        );
        return;
      }

      tool.execute(parsed.params.arguments || {}).then(
        (result) => {
          ws.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: parsed.id,
              result,
            }),
          );
        },
        (error) => {
          ws.send(
            JSON.stringify({
              jsonrpc: "2.0",
              id: parsed.id,
              error: {
                code: -32603,
                message: error.message || "Internal error",
              },
            }),
          );
        },
      );
    } else {
      ws.send(
        JSON.stringify({
          jsonrpc: "2.0",
          id: parsed.id,
          error: { code: -32601, message: "Method not found" },
        }),
      );
    }
  } catch (error) {
    ws.send(
      JSON.stringify({
        jsonrpc: "2.0",
        id: null,
        error: {
          code: -32700,
          message: "Parse error",
        },
      }),
    );
  }
}
