import { calegTable } from "@/db/db.schema";
import { dapilEnums } from "@/lib/constants";
import type { DapilType } from "@/lib/types";
import type { APIRoute } from "astro";
import { and, eq } from "drizzle-orm";
import { drizzle } from "drizzle-orm/d1";

export const GET: APIRoute = async (context) => {
  const { DB } = context.locals.runtime.env;
  const db = drizzle(DB);

  const dapilType = context.url.searchParams.get("dapil_type")! as DapilType;
  const dapilCode = context.url.searchParams.get("dapil_code")! as string;

  if (!dapilType || !dapilCode || !dapilEnums.includes(dapilType)) {
    return new Response("Bad Request", { status: 400 });
  }

  const calegData = await db
    .select()
    .from(calegTable)
    .where(and(eq(calegTable.calegType, dapilType), eq(calegTable.dapilCode, dapilCode)));

  return new Response(JSON.stringify(calegData), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3000, s-maxage=3000, stale-while-revalidate=3000",
    },
    status: 200,
  });
};
