import type { SelectCaleg } from "../../../src/db/db.schema";

export const extractDapilDPD = (input: string): string => {
  const match = input.match(/<b><font size="3">(.*?)<\/font><\/b>/);
  return match ? match[1] : "";
};

export const extractNomorUrut = (input: string): string => {
  const match = input.match(/<font size="3">(.*?)<\/font>/);
  return match ? match[1] : "";
};

export const extractCalegId = (caleg: SelectCaleg): string => {
  return `${caleg.calegType}_${caleg.dapilCode}_${caleg.noUrut}_${String(caleg.name).replaceAll(" ", "-")}`.toLowerCase();
};

export const extractDapil = (input: string): string => {
  const match = input.match(/<center><i>Dapil<\/i><br>(.*?)<\/center>/);
  return match ? match[1] : "";
};

export const extractCenterText = (input: string): string => {
  const match = input.match(/<center>(.*?)<\/center>/);
  return match ? match[1] : "";
};

export const extractProfileId = (input: string): string => {
  const match = input.match(/value="(.*?)"/);
  return match ? match[1] : "";
};

export const extractTextAfterImg = (input: string): string => {
  const match = input.match(/<img src=".*?" width=".*?" >\s*(.*)/);
  return match ? match[1] : "";
};

export const extractImageUrl = (input: string, calegType: SelectCaleg["calegType"]): string => {
  if (!calegType) return "";

  const match = input.match(/src="(.*?)"/);
  let fileSrc = match ? match[1] : "";

  if (["DPD"].includes(calegType)) {
    fileSrc = fileSrc.replace("../", "");
    fileSrc = encodeURI(fileSrc);
    /**
     * @example
     * <center><img src=\"../berkas-dpd-dct/11/xxx.jpg\" width=\"75\" ></center>
     *
     * @returns
     * "https://infopemilu.kpu.go.id/berkas-dpd-dct/11/xxx.jpg"
     */
    return `https://infopemilu.kpu.go.id/${fileSrc}`;
  }

  if (["DPR", "DPRD_KABKOTA", "DPRD_PROVINSI"].includes(calegType)) {
    /**
     * @example
     * "<center><img src=\"https://infopemilu.kpu.go.id/dct/berkas-silon/calon_unggah/36477/pas_foto/xxx.png\" width=\"75\" loading=\"lazy\"></center>"
     *
     * @returns
     * "https://infopemilu.kpu.go.id/dct/berkas-silon/calon_unggah/36477/pas_foto/xxx.png"
     */
    return fileSrc;
  }

  return `https://infopemilu.kpu.go.id/${fileSrc}`;
};
