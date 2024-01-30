import type { Config } from "drizzle-kit";

export default {
  schema: "./src/db/db.schema.ts",
  out: "./drizzle",
  driver: "better-sqlite",
  dbCredentials: {
    url: "./src/db/bukankpu.db",
  },
} satisfies Config;
