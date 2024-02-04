import type { SelectCaleg } from "@/db/db.schema";
import { dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType, DapilType } from "@/lib/types";
import { selectedDapilAtom } from "@/store/global";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";

export const useCaleg = (dapilType: DapilParamsType) => {
  const [selectedDapil] = useAtom(selectedDapilAtom);

  const enumDapilType = dapilParamsToEnum[dapilType] as DapilType;

  return useQuery({
    queryKey: ["caleg", dapilType, selectedDapil[enumDapilType]?.kode_dapil],
    // staleTime: Infinity,
    enabled: !!selectedDapil[enumDapilType]?.kode_dapil,
    queryFn: async () => {
      const response = await axios.get<SelectCaleg[]>("/api/caleg", {
        params: { dapil_type: dapilParamsToEnum[dapilType], dapil_code: selectedDapil[enumDapilType]?.kode_dapil },
      });

      return response.data;
    },
  });
};
