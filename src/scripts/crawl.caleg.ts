import axios from "axios";
import {
  extractCalegId,
  extractCenterText,
  extractDapil,
  extractDapilDPD,
  extractImageUrl,
  extractNomorUrut,
  extractProfileId,
  extractTextAfterImg,
} from "../helpers/parser";
import { calegTable, crawlStatus, type SelectCaleg } from "../db/db.schema";
import { db } from "../db/db";
import { and, eq } from "drizzle-orm";

let timeout = 0;

const dapil = {
  DPD: await import("../data/options/dapil-dpd.json").then((m) => m.data),
  DPR: await import("../data/options/dapil-dpr.json").then((m) => m.data),
  DPRD_KABKOTA: await import("../data/options/dapil-dprd-kabkota.json").then((m) => m.data),
  DPRD_PROVINSI: await import("../data/options/dapil-dprd-provinsi.json").then((m) => m.data),
} as const;

const getCalegEndpoints = {
  DPD: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpd/dct_dpd",
    params: "kode_pro",
  },
  DPR: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr/Dct_dpr",
    params: "kode_dapil",
  },
  DPRD_KABKOTA: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprd/Dct_dprdkabko",
    params: "kode_dapil",
  },
  DPRD_PROVINSI: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprprov/Dct_dprprov",
    params: "kode_dapil",
  },
} as const;

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function crawl(calegType: keyof typeof dapil) {
  return async function (dapilCode: string) {
    const { endpoint, params } = getCalegEndpoints[calegType];

    const { data } = await axios.get(endpoint, {
      params: {
        [params]: dapilCode,
      },
    });

    return data;
  };
}

async function saveDapilResponse(calegType: keyof typeof dapil, dapilCode: string, data: string[][]) {
  for (const rawCaleg of data) {
    let caleg = {
      calegType: calegType,
      dapilCode: dapilCode,
      updatedAt: new Date().toISOString(),
    } as SelectCaleg;

    if (["DPD"].includes(calegType)) {
      caleg = {
        ...caleg,
        photoUrl: extractImageUrl(rawCaleg[2], calegType),
        dapil: extractDapilDPD(rawCaleg[0]),
        noUrut: extractNomorUrut(rawCaleg[1]),
        name: rawCaleg[3],
        gender: extractCenterText(rawCaleg[4]),
        birthPlace: rawCaleg[5],
        profileId: extractProfileId(rawCaleg[6]),
      } as SelectCaleg;
    } else {
      caleg = {
        ...caleg,
        partai: extractTextAfterImg(rawCaleg[0]),
        photoUrl: extractImageUrl(rawCaleg[3], calegType),
        dapil: extractDapil(rawCaleg[1]),
        noUrut: extractNomorUrut(rawCaleg[2]),
        name: rawCaleg[4],
        gender: rawCaleg[5],
        birthPlace: rawCaleg[6],
        profileId: extractProfileId(rawCaleg[8]),
      } as SelectCaleg;
    }

    const calegId = extractCalegId(caleg);
    const toBeInserted = { ...caleg, calegId };

    await db.insert(calegTable).values(toBeInserted).onConflictDoUpdate({
      set: toBeInserted,
      target: calegTable.calegId,
    });
  }

  await db
    .insert(crawlStatus)
    .values({
      calegType,
      dapilCode,
      updatedAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      set: {
        updatedAt: new Date().toISOString(),
      },
      target: [crawlStatus.dapilCode],
      where: and(eq(crawlStatus.calegType, "DPD"), eq(crawlStatus.dapilCode, "11")),
    });
}

async function crawlDapil(
  calegType: keyof typeof dapil,
  filter?: {
    dapilCode: string;
  }
) {
  const crawledDapil = db.select().from(crawlStatus).where(eq(crawlStatus.calegType, calegType)).all();

  const shouldCrawlDapil = dapil[calegType]
    .filter((dapil: { kode_dapil?: string; kode_pro?: string; nama_dapil?: string; nama_wilayah?: string }) => {
      const dapilCode = dapil["kode_dapil"] || dapil["kode_pro"];
      const isFiltered = filter?.dapilCode ? dapilCode === filter.dapilCode : false;

      return !crawledDapil.find((crawled) => crawled.dapilCode === dapilCode) && !isFiltered;
    })
    .map((dapil: { kode_dapil?: string; kode_pro?: string; nama_dapil?: string; nama_wilayah?: string }) => {
      const dapilCode = dapil["kode_dapil"] || dapil["kode_pro"];
      const dapilName = dapil["nama_dapil"] || dapil["nama_wilayah"];

      return {
        dapilCode,
        dapilName,
      } as { dapilCode: string; dapilName: string };
    });

  const shouldBeCrawled = dapil[calegType].length - crawledDapil.length;

  if (!shouldBeCrawled) {
    console.log(`✅ [${calegType}] All dapil already crawled`);
    return;
  }

  console.log(`⏳ [${calegType}] Crawling ${shouldBeCrawled} dapil`);

  for (const { dapilCode } of shouldCrawlDapil) {
    if (timeout > 5) {
      console.log("❌ Timeout reached");
      break;
    }

    console.log(`⏳ [${calegType}] Crawling dapil`, dapilCode);

    await crawl(calegType)(dapilCode)
      .then(async (data: { data: string[][] }) => {
        const totalCrawledData = db.select().from(crawlStatus).where(eq(crawlStatus.calegType, calegType)).all().length;
        const percentage = Math.round((totalCrawledData / dapil[calegType].length) * 100);

        console.log(`✅ [${calegType}] (${percentage}%) Crawled dapil ${dapilCode} with ${data.data.length} caleg`);
        await saveDapilResponse(calegType, dapilCode, data.data);
      })
      .catch((err) => {
        console.error(err);
        timeout += 1;
      });

    await sleep(1000); // 1 second
  }
}

/**
 * Step 1. Crawl each type of caleg (DPD, DPR, DPRD_KABKOTA, DPRD_PROVINSI)
 *
 * @todo
 * - [X] Get all dapil code from data/options/dapil-*.json file
 * - [X] Filter dapil code by `calegType` from database exlude dapil code that already crawled
 * - [X] Crawl each dapil code
 * - [X] Save caleg to database
 * - [X] Update crawl status to database
 */

for (const calegType of Object.keys(dapil)) {
  await crawlDapil(calegType as keyof typeof dapil);
}
