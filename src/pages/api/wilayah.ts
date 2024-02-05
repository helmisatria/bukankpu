import { dapilEnums } from "@/lib/constants";
import type { DapilType } from "@/lib/types";
import type { APIRoute } from "astro";

import dapilDpd from "~/crawl/scripts/data/dapil/dapil-dpd.json";
import dapilDpr from "~/crawl/scripts/data/dapil/dapil-dpr.json";
import dapilDprdKabkota from "~/crawl/scripts/data/dapil/dapil-dprd-kabkota.json";
import dapilDprdProvinsi from "~/crawl/scripts/data/dapil/dapil-dprd-provinsi.json";

export const GET: APIRoute = async ({ url, locals }) => {
  const search = url.searchParams.get("dapil")! as DapilType;

  if (!search || !dapilEnums.includes(search)) {
    return new Response("Bad Request", { status: 400 });
  }

  const dapil = {
    DPR: dapilDpr.data,
    DPD: dapilDpd.data.map((dapil) => ({
      kode_dapil: dapil.kode_pro,
      nama_dapil: dapil.nama_wilayah,
    })),
    DPRD_KABKOTA: dapilDprdKabkota.data,
    DPRD_PROVINSI: dapilDprdProvinsi.data,
  } satisfies Record<DapilType, any>;

  return new Response(JSON.stringify(dapil[search]), {
    headers: {
      "Content-Type": "application/json",
      "Cache-Control": "public, max-age=3000, s-maxage=3000",
    },
  });
};
