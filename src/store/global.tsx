import { atomWithStorage } from "jotai/utils";
import { atomWithImmer, withImmer } from "jotai-immer";
import type { DapilType } from "@/lib/types";
import { atom } from "jotai";

const primitiveSelectedDapilAtom = atomWithStorage<Record<DapilType, { kode_dapil: string; nama_dapil: string } | null>>(
  "selected-dapil",
  {
    DPR: null,
    DPD: null,
    DPRD_KABKOTA: null,
    DPRD_PROVINSI: null,
  },
);

export const resetAllSelectedAtom = atom(null, (_get, set) => {
  set(selectedAddressSuggestionAtom, null);
  set(addressSuggestionsAtom, []);
  set(queryAddressAtom, "");
  set(addressDetailAtom, null);
  set(selectedDapilAtom, {
    DPR: null,
    DPD: null,
    DPRD_KABKOTA: null,
    DPRD_PROVINSI: null,
  });
});

export const selectedDapilAtom = withImmer(primitiveSelectedDapilAtom);

export const queryAddressAtom = atom<string>("");
export const addressSuggestionsAtom = atom<
  {
    text: string;
    magicKey: string;
  }[]
>([]);

export const selectedAddressSuggestionAtom = atomWithStorage<{
  text: string;
  magicKey: string;
} | null>("selected-suggestion-address", null);

type GeocodingResponse = {
  address: string;
  location: {
    x: number;
    y: number;
  };
  score: number;
  attributes: {
    Status: string;
    Score: number;
    Match_addr: string;
    LongLabel: string;
    ShortLabel: string;
    Addr_type: string;
    Type: string;
    PlaceName: string;
    Place_addr: string;
    Phone: string;
    URL: string;
    Rank: number;
    AddBldg: string;
    AddNum: string;
    AddNumFrom: string;
    AddNumTo: string;
    AddRange: string;
    Side: string;
    StPreDir: string;
    StPreType: string;
    StName: string;
    StType: string;
    StDir: string;
    BldgType: string;
    BldgName: string;
    LevelType: string;
    LevelName: string;
    UnitType: string;
    UnitName: string;
    SubAddr: string;
    StAddr: string;
    Block: string;
    Sector: string;
    Nbrhd: string;
    District: string;
    City: string;
    MetroArea: string;
    Subregion: string;
    Region: string;
    RegionAbbr: string;
    Territory: string;
    Zone: string;
    Postal: string;
    PostalExt: string;
    Country: string;
    CntryName: string;
    LangCode: string;
    Distance: number;
    X: number;
    Y: number;
    DisplayX: number;
    DisplayY: number;
    Xmin: number;
    Xmax: number;
    Ymin: number;
    Ymax: number;
    ExInfo: string;
  };
  extent: {
    xmin: number;
    ymin: number;
    xmax: number;
    ymax: number;
  };
};

export const addressDetailAtom = atom<GeocodingResponse | null>(null);

export const filterCalegAtom = atomWithImmer<{
  partai: string[];
  pendidikan: string[];
}>({
  partai: [],
  pendidikan: [],
});
