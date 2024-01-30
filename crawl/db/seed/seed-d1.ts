import { gt, gte } from "drizzle-orm";
import { calegTable } from "../../../src/db/db.schema";
import { db } from "../db";
import { exec } from "child_process";
import { createFileSync, pathExistsSync } from "fs-extra/esm";
import { camelCase, snakeCase } from "lodash-es";
import { readFileSync, writeFileSync } from "fs";

// Constants
const BATCH_SIZE = 30_000;

const DB: "local" | "production" = (process.env as any).DB_ENV || "local";
const CHECKPOINT_FILE = `${import.meta.dirname}/sql/checkpoint.${DB}.txt`;

// Function to get the last processed id from checkpoint file
function getLastProcessedId(): number {
  if (!pathExistsSync(CHECKPOINT_FILE)) {
    return 0;
  }

  const content = readFileSync(CHECKPOINT_FILE, "utf8");
  return Number(content);
}

// Function to update the checkpoint file
function updateCheckpoint(id: number): void {
  createFileSync(CHECKPOINT_FILE);
  writeFileSync(CHECKPOINT_FILE, id.toString());
}

// Function to convert data to an insert query
function convertToInsertQuery(data: any[]): string {
  if (data.length === 0) {
    return "";
  }

  const columns = Object.keys(data[0]).map((column) => snakeCase(column));

  const valueRows = data.map((row) => {
    const valueRows =
      "(" +
      columns
        .map((column) => {
          const value = row[camelCase(column)];
          if (value === null || value === undefined) {
            return "NULL";
          } else if (typeof value === "string") {
            // Escaping single quotes for SQL strings
            return "'" + value.replace(/'/g, "''") + "'";
          }
          return value;
        })
        .join(", ") +
      ")";

    const insertQuery = "INSERT INTO caleg (" + columns.join(", ") + ") VALUES \n" + valueRows + "ON CONFLICT DO NOTHING ;";
    return insertQuery;
  });

  return valueRows.join("\n");
}

// Function to create SQL file
function createSqlFile(data: any[], batchId: number): string {
  const sql = convertToInsertQuery(data);
  const filePath = `${import.meta.dirname}/sql/batch_${batchId}.sql`;
  createFileSync(filePath);
  writeFileSync(filePath, sql);

  return filePath;
}

// Function to execute wrangler command
function executeWrangler(filePath: string): Promise<void> {
  return new Promise((resolve, reject) => {
    exec(
      `wrangler d1 execute bukankpu --file=${filePath} ${DB === "local" ? "--local" : ""}`,
      { maxBuffer: 1024 * 1000 * 100 },
      (error, stdout, stderr) => {
        if (error) {
          reject(error);
          console.error(`exec error: ${error}`);
          console.error(`stderr: ${stderr}`);
          console.error(`stdout: ${stdout}`);
          return;
        }
        resolve();
      }
    );
  });
}

// Main seeding function
async function seedDatabase() {
  while (true) {
    let lastProcessedId = getLastProcessedId();
    console.log("Processing batch", lastProcessedId);

    const data = db.select().from(calegTable).where(gt(calegTable.id, lastProcessedId)).limit(BATCH_SIZE).all();

    if (data.length === 0) break;

    // remove previous file
    const previousFilePath = `${import.meta.dirname}/sql/batch_${lastProcessedId}.sql`;
    if (pathExistsSync(previousFilePath)) {
      exec(`rm ${previousFilePath}`);
    }

    const batchId = lastProcessedId + data.length;
    const filePath = createSqlFile(data, lastProcessedId);

    try {
      await executeWrangler(filePath);
      updateCheckpoint(data[data.length - 1].id);
      console.log(`Batch ${batchId} processed successfully.`);
    } catch (error) {
      console.error(`Error processing batch ${batchId}:`, error);
      console.error("Retrying...");
      // break;
    }
  }
}

// Run the seeding process
seedDatabase();
