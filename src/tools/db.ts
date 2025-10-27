import { Pool } from "pg";

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export interface DbQueryParams {
  sql: string;
  params?: (string | number | boolean | null)[];
}

export const dbQueryTool = {
  name: "db_query",
  description: "Run a parameterized SELECT query on Postgres. Only SELECT allowed.",
  async execute(params: DbQueryParams) {
    if (!process.env.DATABASE_URL) {
      return {
        content: [
          {
            type: "text",
            text: "DATABASE_URL not set.",
          },
        ],
      };
    }

    // Validate SQL
    if (!/^\s*select\b/i.test(params.sql)) {
      return {
        content: [
          {
            type: "text",
            text: "Only SELECT queries are allowed.",
          },
        ],
        isError: true,
      };
    }

    const client = await pool.connect();
    try {
      const res = await client.query(params.sql, params.params || []);
      const rows = res.rows ?? [];
      const limited = rows.slice(0, 50);

      return {
        content: [
          {
            type: "text",
            text: `Rows: ${limited.length}${rows.length > 50 ? " (truncated)" : ""}\n${JSON.stringify(limited, null, 2)}`,
          },
        ],
      };
    } finally {
      client.release();
    }
  },
};
