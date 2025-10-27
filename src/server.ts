import express, { type Request, type Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleMcpMessage } from "./mcp.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/mcp" });

wss.on("connection", (ws: WebSocket) => {
  console.log("MCP client connected");

  ws.on("message", (message: Buffer) => {
    const msg = message.toString();
    handleMcpMessage(ws, msg);
  });

  ws.on("close", () => {
    console.log("MCP client disconnected");
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
  });
});

server.listen(PORT, () => {
  console.log(`HTTP :${PORT} (/health) + WS :${PORT}/mcp`);
});
