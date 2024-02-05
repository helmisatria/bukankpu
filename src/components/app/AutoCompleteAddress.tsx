import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Combobox } from "@headlessui/react";
import { CheckIcon, ChevronsUpDownIcon } from "lucide-react";
import { cn, toTitleCase } from "@/lib/utils";
import { Route } from "@/routes/pemilu.$dapilType";
import { dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType } from "@/lib/types";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutationSuggestAddress } from "@/queries/useMutationSuggestAddress";
import { useAtom } from "jotai";
import { addressDetailAtom, addressSuggestionsAtom, selectedDapilAtom, selectedAddressSuggestionAtom } from "@/store/global";
import { useMutation } from "@tanstack/react-query";
import { getAddressFromMagicKey, getDapil, suggestAddress } from "@/mutations/mutations";
import toast from "react-hot-toast";

type AutoCompleteAddressProps = {};

export function AutoCompleteAddress(props: AutoCompleteAddressProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const isMounted = useRef(false);

  const [addressSuggestions, setAddressSuggestions] = useAtom(addressSuggestionsAtom);
  const [selectedSuggestion, setSelectedSuggestion] = useAtom(selectedAddressSuggestionAtom);
  const [addressDetail, setAddressDetail] = useAtom(addressDetailAtom);
  const [, setSelectedDapil] = useAtom(selectedDapilAtom);

  const [value, setValue] = useState<string>(selectedSuggestion?.text || "");
  const [debouncedValue] = useDebouncedValue<string>(value, 500);
  const mutationSuggestAddress = useMutation({ mutationFn: suggestAddress });
  const mutationGetAddressDetail = useMutation({ mutationFn: getAddressFromMagicKey });
  const mutationGetDapil = useMutation({ mutationFn: getDapil });

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  useEffect(() => {
    if (mutationSuggestAddress.isPending || debouncedValue.length < 3) return;

    // have the same as selected value
    if (selectedSuggestion?.text === debouncedValue) return;

    // empty selected suggestion when changing value
    if (selectedSuggestion?.text !== debouncedValue) {
      console.log(selectedSuggestion?.text, debouncedValue);
      setAddressSuggestions([]);
    }

    mutationSuggestAddress.mutate(debouncedValue, {
      onSuccess: (data) => {
        setAddressSuggestions(data.suggestions);
      },
    });
  }, [debouncedValue]);

  useEffect(() => {
    if (!selectedSuggestion) return;

    setValue(selectedSuggestion.text);

    mutationGetAddressDetail.mutate(selectedSuggestion.magicKey, {
      onSuccess: (data) => {
        if (data.candidates) setAddressDetail(data.candidates[0]);
      },
    });
  }, [selectedSuggestion]);

  useEffect(() => {
    if (!addressDetail) return;

    mutationGetDapil.mutate(
      {
        city: addressDetail?.attributes.City!,
        district: addressDetail?.attributes.District!,
        region: addressDetail?.attributes.Region!,
        sub_region: addressDetail?.attributes.Subregion,
      },
      {
        onSuccess: (data) => {
          setSelectedDapil(data);
        },
        onError: (error) => {
          toast.error("Maaf kami tidak menemukan dapil untuk alamat ini. Coba kabupaten/kota lain.");
        },
      },
    );
  }, [addressDetail]);

  return (
    <Combobox
      as="div"
      value={selectedSuggestion}
      onChange={(val) => {
        setValue(val?.text || "");
        setSelectedSuggestion(val);
      }}
    >
      <div className="relative mt-2">
        <Combobox.Input
          ref={inputRef}
          placeholder="Contoh: Ngemplak Sleman"
          title="Pilih address"
          className="w-full rounded-md border-0 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6"
          value={value}
          onChange={handleChange}
          displayValue={(d: { nama_dapil: string }) => toTitleCase(d?.nama_dapil)}
        />
        <Combobox.Button
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
          title="Lihat pilihan address"
        >
          <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {!!addressSuggestions?.length && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {addressSuggestions.slice(0, 100).map((suggestion) => (
              <Combobox.Option
                key={suggestion.magicKey}
                value={suggestion}
                className={({ active }) =>
                  cn("relative cursor-default select-none py-2 pl-3 pr-9", active ? "bg-blue-600 text-white" : "text-gray-900")
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={cn("block truncate", selected && "font-semibold")}>{toTitleCase(suggestion.text)}</span>

                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-blue-600",
                        )}
                      >
                        <CheckIcon className="h-5 w-5" aria-hidden="true" />
                      </span>
                    )}
                  </>
                )}
              </Combobox.Option>
            ))}
          </Combobox.Options>
        )}
      </div>
    </Combobox>
  );
}
