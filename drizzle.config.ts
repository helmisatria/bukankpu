import type { Config } from "drizzle-kit";

export default {
  schema: "./crawl/db/db.schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./crawl/db/bukankpu.db",
  },
} satisfies Config;
