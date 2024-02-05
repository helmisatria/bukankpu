import { atomWithStorage } from "jotai/utils";
import { withImmer } from "jotai-immer";
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

export const selectedDapilAtom = withImmer(primitiveSelectedDapilAtom);

export const queryAddressAtom = atom<string>("");
