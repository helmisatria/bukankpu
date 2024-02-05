import { useMutation } from "@tanstack/react-query";
import axios from "axios";

interface Suggestion {
  text: string;
  magicKey: string;
  isCollection: boolean;
}

interface Response {
  suggestions: Suggestion[];
}

export const useMutationSuggestAddress = () => {
  return useMutation({
    mutationFn: async ({ text }: { text: string }) => {
      const url = "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer/suggest";

      const response = await axios.get(url, {
        params: {
          f: "json",
          text: text,
        },
      });

      return response.data as Response;
    },
  });
};
