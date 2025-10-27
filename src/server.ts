import express, { type Request, type Response } from "express";
import http from "http";
import { WebSocketServer, WebSocket } from "ws";
import { handleMcpMessage } from "./mcp.js";

const PORT = Number(process.env.PORT) || 3000;

const app = express();

// Health check endpoint - returns JSON
app.get("/health", (_req: Request, res: Response) => res.json({ ok: true }));

// Root endpoint - shows HTML page
app.get("/", (_req: Request, res: Response) => {
  res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <title>MCP Server Status</title>
      <style>
        body { 
          font-family: system-ui, -apple-system, sans-serif; 
          display: flex; 
          justify-content: center; 
          align-items: center; 
          height: 100vh; 
          margin: 0; 
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
        }
        .container { 
          text-align: center; 
          background: rgba(255,255,255,0.1);
          padding: 3rem;
          border-radius: 20px;
          backdrop-filter: blur(10px);
          box-shadow: 0 8px 32px 0 rgba(31, 38, 135, 0.37);
        }
        h1 { margin: 0 0 1rem 0; font-size: 2.5rem; }
        p { font-size: 1.2rem; opacity: 0.9; }
        .status { 
          display: inline-block; 
          background: #10b981; 
          padding: 0.5rem 1.5rem; 
          border-radius: 50px; 
          margin-top: 1rem;
          font-weight: 600;
        }
        .endpoint {
          background: rgba(255,255,255,0.2);
          padding: 1rem;
          border-radius: 10px;
          margin-top: 1rem;
          font-family: monospace;
          word-break: break-all;
        }
      </style>
    </head>
    <body>
      <div class="container">
        <h1>🚀 MCP Server</h1>
        <p>Model Context Protocol Server</p>
        <div class="status">● Online</div>
        <div class="endpoint">
          <div><strong>Health:</strong> <a href="/health" style="color: white;">/health</a></div>
          <div style="margin-top: 0.5rem;"><strong>WebSocket:</strong> wss://mcp.deepthinkersai.com/mcp</div>
        </div>
      </div>
    </body>
    </html>
  `);
});

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
