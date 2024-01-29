const dapil = {
  dpd: await import("./data/options/dapil-dpd.json").then((m) => m.data),
  dpr: await import("./data/options/dapil-dpr.json").then((m) => m.data),
  dprdKabKota: await import("./data/options/dapil-dprd-kabkota.json").then((m) => m.data),
  dprdProvinsi: await import("./data/options/dapil-dprd-provinsi.json").then((m) => m.data),
};

const getCalegEndpoints = {
  dpd: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpd/dct_dpd",
    params: "kode_pro",
  },
  dpr: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dpr/Dct_dpr",
    params: "kode_dapil",
  },
  dprdKabKota: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprd/Dct_dprdkabko",
    params: "kode_dapil",
  },
  dprdProvinsi: {
    endpoint: "https://infopemilu.kpu.go.id/Pemilu/Dct_dprprov/Dct_dprprov",
    params: "kode_dapil",
  },
};
