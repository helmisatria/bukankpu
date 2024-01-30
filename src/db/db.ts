import { drizzle } from "drizzle-orm/better-sqlite3";
import Database from "better-sqlite3";

const sqlite = new Database("./src/db/bukankpu.db");

export const db = drizzle(sqlite);
