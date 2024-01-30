import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { calegTable } from "../../db/db.schema";
import { random } from "lodash-es";

export const GET: APIRoute = async (context) => {
  const DB = context.locals.runtime.env.DB;
  const db = drizzle(DB);

  const randomCaleg = await db.select().from(calegTable).limit(100).offset(random(100, 1000)).all();

  return new Response(JSON.stringify(randomCaleg), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=60, s-maxage=60",
    },
  });
};
