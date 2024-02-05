import axios from "axios";

interface Suggestion {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

interface Response {
  suggestions: Suggestion[];
}

export async function suggestAddress(text: string) {
  const url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest";

  const response = await axios.get(url, {
    params: { f: "json", text: text + " Indonesia" },
  });

  return response.data;
}

export async function getAddressFromMagicKey(magicKey: string) {
  const url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/findAddressCandidates";

  const response = await axios.get(url, {
    params: { magicKey, f: "json", outFields: "*" },
  });

  return response.data;
}

export async function getDapil({
  district,
  city,
  region,
  sub_region,
}: {
  district: string;
  city: string;
  region: string;
  sub_region?: string;
}) {
  const response = await axios.post("/api/dapil", {
    district,
    city,
    region,
    sub_region,
  });

  return response.data;
}
