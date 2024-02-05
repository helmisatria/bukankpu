import { useEffect, useRef, useState, type ChangeEvent } from "react";
import { Combobox } from "@headlessui/react";
import { ChevronsUpDownIcon } from "lucide-react";
import { toTitleCase } from "@/lib/utils";
import { Route } from "@/routes/pemilu.$dapilType";
import { dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType } from "@/lib/types";
import { useDebouncedValue } from "@mantine/hooks";
import { useMutationSuggestAddress } from "@/queries/useMutationSuggestAddress";

type AutoCompleteAddressProps = {};

export function AutoCompleteAddress(props: AutoCompleteAddressProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const buttonRef = useRef<HTMLButtonElement>(null);
  const params = Route.useParams();

  const [value, setValue] = useState<string>("");
  const [debouncedValue] = useDebouncedValue<string>(value, 500);
  const mutation = useMutationSuggestAddress();

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    setValue(event.target.value);
  };

  // Fetch API (optional)
  useEffect(() => {
    mutation.mutate({ text: debouncedValue });
  }, [debouncedValue]);

  useEffect(() => {
    // setTimeout(() => {
    //   if (buttonRef) buttonRef.current?.click();
    // }, 1000);

    inputRef.current?.focus();
  }, [params, buttonRef]);

  const dapilType = dapilParamsToEnum[params.dapilType as DapilParamsType];

  return (
    <Combobox
      as="div"
      // value={selectedDapil?.[dapilType]}
      onChange={(val) => {
        // setSelectedDapil((draft) => {
        //   draft[dapilType] = val;
        // });
      }}
    >
      <div className="relative mt-2">
        <Combobox.Input
          ref={inputRef}
          title="Pilih address"
          className="w-full rounded-md border-0 bg-white py-2 pl-3 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-indigo-600 sm:text-sm sm:leading-6"
          onChange={handleChange}
          displayValue={(d: { nama_dapil: string }) => toTitleCase(d?.nama_dapil)}
        />
        <Combobox.Button
          ref={buttonRef}
          className="absolute inset-y-0 right-0 flex items-center rounded-r-md px-2 focus:outline-none"
          title="Lihat pilihan address"
        >
          <ChevronsUpDownIcon className="h-5 w-5 text-gray-400" aria-hidden="true" />
        </Combobox.Button>

        {/* {!!filteredDapil?.length && (
          <Combobox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
            {filteredDapil.slice(0, 100).map((person) => (
              <Combobox.Option
                key={person.kode_dapil}
                value={person}
                className={({ active }) =>
                  cn("relative cursor-default select-none py-2 pl-3 pr-9", active ? "bg-indigo-600 text-white" : "text-gray-900")
                }
              >
                {({ active, selected }) => (
                  <>
                    <span className={cn("block truncate", selected && "font-semibold")}>{toTitleCase(person.nama_dapil)}</span>

                    {selected && (
                      <span
                        className={cn(
                          "absolute inset-y-0 right-0 flex items-center pr-4",
                          active ? "text-white" : "text-indigo-600",
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
        )} */}
      </div>
    </Combobox>
  );
}
