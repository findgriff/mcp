import { createMcpServer, type ToolHandler } from "@modelcontextprotocol/sdk";
import { echoTool } from "./tools/echo.js";
import { dbQueryTool } from "./tools/db.js";

export function buildMcpServer() {
  const mcp = createMcpServer({
    name: "mcp-demo",
    version: "0.1.0",
  });

  mcp.tool("echo", echoTool);
  mcp.tool("db_query", dbQueryTool);

  return mcp;
}

