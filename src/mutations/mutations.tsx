import { queryAddressAtom } from "@/store/global";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { useAtom } from "jotai";

interface Suggestion {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

interface Response {
  suggestions: Suggestion[];
}

async function suggestAddress(text: string) {
  const url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest";

  const response = await axios.get(url, {
    params: {
      f: "json",
      text,
    },
  });

  return response.data;
}

export const useMutationSuggestAddress = () => {
  return useMutation({
    mutationFn: suggestAddress,
  });
};
