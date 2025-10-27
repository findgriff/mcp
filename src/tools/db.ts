import { z } from "zod";
import type { ToolHandler } from "@modelcontextprotocol/sdk";
import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  // Optional: ssl: { rejectUnauthorized: false }
});

export const dbQueryTool: ToolHandler = {
  description: "Run a parameterized SELECT query on Postgres. Only SELECT allowed.",
  inputSchema: z.object({
    sql: z.string().refine(s => /^\s*select\b/i.test(s), { message: "Only SELECT queries are allowed." }),
    params: z.array(z.union([z.string(), z.number(), z.boolean(), z.null()])).default([]),
  }),
  handler: async ({ sql, params }: { sql: string; params: (string | number | boolean | null)[] }) => {
    if (!process.env.DATABASE_URL) {
      return { text: "DATABASE_URL not set." };
    }
    const client = await pool.connect();
    try {
      const res = await client.query(sql, params);
      // Return small results prettily
      const rows = res.rows ?? [];
      const limited = rows.slice(0, 50);
      return {
        data: limited,
        text: `Rows: ${limited.length}${rows.length > 50 ? " (truncated)" : ""}`,
      };
    } finally {
      client.release();
    }
  },
};

