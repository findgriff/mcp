# MCP Server (Dokku-ready)

### Features
- MCP over WebSocket at `/mcp`
- Health check at `/health`
- Tools:
  - `echo(message)`
  - `db_query(sql, params[])` — SELECT-only, parameterized

### Local Dev
```bash
cp .env.example .env
npm install
npm run dev
# open http://localhost:3000/health
```

### Build & Run
```bash
npm run build
npm start
```

### Deploy to Dokku (no SSH keys)
On your server (SSH via password for learning), assuming:

- app name: mcp
- domain: mcp.deepthinkersai.com
- Postgres service: mcpdb

**Create app, domain, db, link, HTTPS:**

```bash
sudo dokku apps:create mcp
sudo dokku domains:set mcp mcp.deepthinkersai.com
sudo dokku plugin:install https://github.com/dokku/dokku-postgres.git postgres || true
sudo dokku postgres:create mcpdb
sudo dokku postgres:link mcpdb mcp
sudo dokku plugin:install https://github.com/dokku/dokku-letsencrypt.git letsencrypt || true
sudo dokku config:set --no-restart mcp DOKKU_LETSENCRYPT_EMAIL=you@example.com
sudo dokku letsencrypt:enable mcp
sudo dokku letsencrypt:cron-job --add
```

