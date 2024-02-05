import type { APIRoute } from "astro";
import { drizzle } from "drizzle-orm/d1";
import { dapilTable } from "../../db/db.schema";
import { z } from "zod";
import { and, eq, like, or } from "drizzle-orm";

const requestBodySchema = z.object({
  district: z.string().min(3),
  city: z.string().min(3),
  region: z.string().min(3),
  sub_region: z.string().optional(),
});

const responseBodySchema = z.object({
  DPD: z.object({
    kode_wilayah: z.string(),
    nama_wilayah: z.string(),
    nama_dapil: z.string(),
  }),
  DPR: z.object({
    kode_wilayah: z.string(),
    nama_wilayah: z.string(),
    nama_dapil: z.string(),
  }),
  DPRD_PROVINSI: z.object({
    kode_wilayah: z.string(),
    nama_wilayah: z.string(),
    nama_dapil: z.string(),
  }),
  DPRD_KABKOTA: z.object({
    kode_wilayah: z.string().optional(),
    nama_wilayah: z.string().optional(),
    nama_dapil: z.string().optional(),
  }),
});

export const POST: APIRoute = async (context) => {
  const { DB, KV } = context.locals.runtime.env;

  const requestJson = await context.request.json();
  const requestBody = requestBodySchema.safeParse(requestJson);

  if (!requestBody.success) {
    return new Response(
      JSON.stringify({
        error: "Bad Request",
        message: "Maaf, terjadi kesalahan dalam mengambil data dapil",
      }),
      { status: 400 },
    );
  }

  const db = drizzle(DB);

  const { district, city, region, sub_region } = requestBody.data;

  // const cachedData = await KV.get(`dapil:${district}:${city}`);

  // if (cachedData) {
  //   return new Response(cachedData, {
  //     headers: {
  //       "content-type": "application/json",
  //       "cache-control": "public, max-age=86400, s-maxage=86400",
  //     },
  //   });
  // }

  try {
    const allDapilDPD = (await import("../../db/dapil-dpd.json")).data;

    const dapilDPD = allDapilDPD.find((d) => d.nama_wilayah.includes(region.toUpperCase()));
    console.log("dapilDPD -->", dapilDPD);

    let dapilDPR = await db
      .select()
      .from(dapilTable)
      .where(
        and(
          //
          eq(dapilTable.dapilType, "DPR"),
          or(
            eq(dapilTable.areaName, region.toUpperCase()),
            sub_region ? eq(dapilTable.areaName, sub_region.toUpperCase()) : undefined,
            sub_region ? eq(dapilTable.areaName, sub_region.split(" ").reverse().join(" ").toUpperCase()) : undefined,
          ),
          dapilDPD?.kode_pro ? like(dapilTable.areaCode, `${dapilDPD?.kode_pro}%`) : undefined,
        ),
      );

    console.log("dapilDPR -->", dapilDPR);

    let dapilProvinsi = await db
      .select()
      .from(dapilTable)
      .where(
        and(
          eq(dapilTable.dapilType, "DPRD_PROVINSI"),
          or(
            eq(dapilTable.areaName, district.toUpperCase()),
            sub_region ? eq(dapilTable.areaName, sub_region.toUpperCase()) : undefined,
            sub_region ? eq(dapilTable.areaName, sub_region.split(" ").reverse().join(" ").toUpperCase()) : undefined,
          ),
          dapilDPD?.kode_pro ? like(dapilTable.areaCode, `${dapilDPD?.kode_pro}%`) : undefined,
          dapilDPR?.[0]?.areaCode ? like(dapilTable.areaCode, `${dapilDPR[0].areaCode}%`) : undefined,
        ),
      );

    console.log({ dapilProvinsi });

    const dapilKabKota = await db
      .select()
      .from(dapilTable)
      .where(
        and(
          eq(dapilTable.dapilType, "DPRD_KABKOTA"),
          eq(dapilTable.areaName, city.toUpperCase()),
          dapilDPD?.kode_pro ? like(dapilTable.areaCode, `${dapilDPD?.kode_pro}%`) : undefined,
          dapilDPR?.[0]?.areaCode ? like(dapilTable.areaCode, `${dapilDPR[0].areaCode}%`) : undefined,
          dapilProvinsi?.[0]?.areaCode ? like(dapilTable.areaCode, `${dapilProvinsi[0].areaCode}%`) : undefined,
        ),
      );

    // recheck
    if (!dapilDPR[0]) {
      if (dapilProvinsi) {
        dapilDPR = await db
          .select()
          .from(dapilTable)
          .where(
            and(
              eq(dapilTable.dapilType, "DPR"),
              or(
                eq(dapilTable.areaName, region.toUpperCase()),
                sub_region ? eq(dapilTable.areaName, sub_region.toUpperCase()) : undefined,
                sub_region ? eq(dapilTable.areaName, sub_region.split(" ").reverse().join(" ").toUpperCase()) : undefined,
                dapilProvinsi?.[0]?.areaCode ? eq(dapilTable.areaCode, `${dapilProvinsi[0].areaCode?.slice(0, 4)}`) : undefined,
              ),
            ),
          );
      }

      if (!dapilDPR.length && dapilKabKota[0]) {
        dapilDPR = await db
          .select()
          .from(dapilTable)
          .where(
            and(
              eq(dapilTable.dapilType, "DPR"),
              or(
                eq(dapilTable.areaName, region.toUpperCase()),
                sub_region ? eq(dapilTable.areaName, sub_region.toUpperCase()) : undefined,
                sub_region ? eq(dapilTable.areaName, sub_region.split(" ").reverse().join(" ").toUpperCase()) : undefined,
                dapilKabKota?.[0]?.areaCode ? eq(dapilTable.areaCode, `${dapilKabKota[0].areaCode?.slice(0, 4)}`) : undefined,
              ),
            ),
          );
      }
    }

    if (!dapilProvinsi[0]) {
      dapilProvinsi = await db
        .select()
        .from(dapilTable)
        .where(
          and(
            eq(dapilTable.dapilType, "DPRD_PROVINSI"),
            or(
              eq(dapilTable.areaName, district.toUpperCase()),
              sub_region ? eq(dapilTable.areaName, sub_region.toUpperCase()) : undefined,
              sub_region ? eq(dapilTable.areaName, sub_region.split(" ").reverse().join(" ").toUpperCase()) : undefined,
              dapilKabKota?.[0]?.areaCode ? eq(dapilTable.areaCode, `${dapilKabKota[0].areaCode?.slice(0, 4)}`) : undefined,
            ),
          ),
        );
    }

    console.log({ dapilKabKota });

    const data = {
      DPD: {
        kode_wilayah: dapilDPD?.kode_pro,
        nama_wilayah: dapilDPD?.nama_wilayah,
        kode_dapil: dapilDPD?.kode_pro,
        nama_dapil: dapilDPD?.nama_wilayah,
      },
      DPR: {
        kode_wilayah: dapilDPR?.[0]?.areaCode,
        nama_wilayah: dapilDPR?.[0]?.areaName,
        kode_dapil: dapilDPR?.[0]?.dapilCode,
        nama_dapil: dapilDPR?.[0]?.dapilName,
      },
      DPRD_PROVINSI: {
        kode_wilayah: dapilProvinsi?.[0]?.areaCode,
        nama_wilayah: dapilProvinsi?.[0]?.areaName,
        kode_dapil: dapilProvinsi?.[0]?.dapilCode,
        nama_dapil: dapilProvinsi?.[0]?.dapilName,
      },
      DPRD_KABKOTA: {
        kode_wilayah: dapilKabKota?.[0]?.areaCode,
        nama_wilayah: dapilKabKota?.[0]?.areaName,
        kode_dapil: dapilKabKota?.[0]?.dapilCode,
        nama_dapil: dapilKabKota?.[0]?.dapilName,
      },
    };

    console.log(data);

    const validateResponseBody = responseBodySchema.safeParse(data);

    if (!validateResponseBody.success) {
      return new Response(
        JSON.stringify({
          error: "Bad Request",
          message: "Maaf, tidak dapat menemukan dapil untuk wilayah yang kamu minta",
        }),
        { status: 422 },
      );
    }

    // await KV.put(`dapil:${district}:${city}`, JSON.stringify(data), { expirationTtl: 86400 });

    return new Response(JSON.stringify(data), {
      headers: {
        "content-type": "application/json",
        // "cache-control": "public, max-age=86400, s-maxage=86400",
      },
    });
  } catch (error) {
    console.log("error -->", error);
    return new Response(
      JSON.stringify({
        error: "Bad Request",
        message: "Maaf, terjadi kesalahan dalam mengambil data dapil",
      }),
      { status: 400 },
    );
  }
};
