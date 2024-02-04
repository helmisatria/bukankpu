import { dapilEnums, dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType } from "@/lib/types";
import { useQuery } from "@tanstack/react-query";
import axios from "axios";

export const useWilayah = (dapilType: DapilParamsType) => {
  return useQuery({
    queryKey: ["wilayah", dapilType],
    staleTime: Infinity,
    queryFn: async () => {
      const response = await axios.get<{ kode_dapil: string; nama_dapil: string }[]>("/api/wilayah", {
        params: { dapil: dapilParamsToEnum[dapilType] },
      });

      return response.data;
    },
  });
};
