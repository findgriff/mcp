# How to Use Your MCP Server

## What is This?

Your MCP server is a **protocol server** - not a web app with login. It's designed for AI agents to connect and use tools.

## How to Test It

### 1. Test the Health Endpoint (Web Browser or CLI)

Open in your browser:
```
https://mcp.deepthinkersai.com/health
```

Or with curl:
```bash
curl https://mcp.deepthinkersai.com/health
```

Expected response:
```json
{"ok":true}
```

### 2. Connect with an AI Agent (Recommended)

If you're using Claude Desktop or another MCP-compatible client:

**Server URL:**
```
wss://mcp.deepthinkersai.com/mcp
```

### 3. Test the WebSocket Connection (Advanced)

Install wscat:
```bash
npm install -g wscat
```

Connect:
```bash
wscat -c wss://mcp.deepthinkersai.com/mcp
```

Once connected, send MCP protocol messages:
```json
{
  "jsonrpc": "2.0",
  "id": 1,
  "method": "tools/list"
}
```

### 4. Available Tools

Your server exposes two tools:

**`echo`** - Echo back a message
```json
{
  "jsonrpc": "2.0",
  "id": 2,
  "method": "tools/call",
  "params": {
    "name": "echo",
    "arguments": {
      "message": "Hello MCP!"
    }
  }
}
```

**`db_query`** - Run SELECT queries on Postgres
```json
{
  "jsonrpc": "2.0",
  "id": 3,
  "method": "tools/call",
  "params": {
    "name": "db_query",
    "arguments": {
      "sql": "SELECT * FROM users LIMIT 10",
      "params": []
    }
  }
}
```

## Integration Examples

### Claude Desktop

Add to your Claude Desktop config (`claude_desktop_config.json`):

```json
{
  "mcpServers": {
    "my-mcp-server": {
      "command": "npx",
      "args": [
        "-y",
        "@modelcontextprotocol/cli",
        "server",
        "wss://mcp.deepthinkersai.com/mcp"
      ]
    }
  }
}
```

### Custom AI Agent

```javascript
import WebSocket from 'ws';

const ws = new WebSocket('wss://mcp.deepthinkersai.com/mcp');

ws.on('open', () => {
  // List available tools
  ws.send(JSON.stringify({
    jsonrpc: "2.0",
    id: 1,
    method: "tools/list"
  }));
});

ws.on('message', (data) => {
  const response = JSON.parse(data.toString());
  console.log('Server response:', response);
});
```

## Troubleshooting

**Get server logs:**
```bash
sudo dokku logs mcp -t
```

**Restart the server:**
```bash
sudo dokku ps:restart mcp
```

**Check server status:**
```bash
sudo dokku ps:report mcp
```

