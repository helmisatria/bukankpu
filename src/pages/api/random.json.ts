import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { calegTable } from "../../db/db.schema";
import { random } from "lodash-es";

export const GET: APIRoute = async (context) => {
  const DB = context.locals.runtime.env.DB;
  const KV = context.locals.runtime.env.KV;
  const db = drizzle(DB);

  const cachedRandomCaleg = await KV.get("randomCaleg");
  if (cachedRandomCaleg) {
    return new Response(cachedRandomCaleg, {
      headers: {
        "content-type": "application/json",
        "cache-control": "public, max-age=60, s-maxage=60",
      },
    });
  }

  const randomCaleg = await db.select().from(calegTable).limit(100).offset(random(100, 1000)).all();
  await KV.put("randomCaleg", JSON.stringify(randomCaleg), { expirationTtl: 60 });

  return new Response(JSON.stringify(randomCaleg), {
    headers: {
      "content-type": "application/json",
      "cache-control": "public, max-age=60, s-maxage=60",
    },
  });
};
