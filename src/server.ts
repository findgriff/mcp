import express, { type Request, type Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { buildMcpServer } from "./mcp.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

const server = http.createServer(app);
const wss = new WebSocketServer({ server, path: "/mcp" });

const mcp = buildMcpServer();

wss.on("connection", (ws: WebSocket) => {
  const session = mcp.connectWebSocket(ws);
  session.on("close", () => {
    // cleanup if needed
  });
});

server.listen(PORT, () => {
  console.log(`HTTP :${PORT} (/health) + WS :${PORT}/mcp`);
});

