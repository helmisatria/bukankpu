import { AutoCompleteAddress } from "@/components/app/AutoCompleteAddress";
import { AutoCompleteWilayah } from "@/components/app/AutoCompleteWilayah";
import { CardCaleg } from "@/components/app/CardCaleg";
import { dapilEnumToParams, dapilEnums, dapilLabels, dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType } from "@/lib/types";
import { useCaleg } from "@/queries/useCaleg";
import { useWilayah } from "@/queries/useWilayah";
import { selectedDapilAtom, selectedAddressSuggestionAtom, resetAllSelectedAtom } from "@/store/global";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { useAtom, useSetAtom } from "jotai";
import { orderBy } from "lodash-es";

const enums = ["dpr", "dpd", "dprd-kabkota", "dprd-provinsi"];

export const Route = createFileRoute("/pemilu/$dapilType")({
  component: PemiluDapil,
  beforeLoad: ({ params }) => {
    if (!enums.includes(params.dapilType)) {
      throw redirect({ to: "/pemilu/$dapilType", params: { dapilType: "dpr" } });
    }

    return {
      title: "Pemilu | " + params.dapilType.toUpperCase(),
    };
  },
  loader: async ({ params }) => {
    return {
      dapilType: params.dapilType as DapilParamsType,
    };
  },
});

function PemiluDapil() {
  const { dapilType } = Route.useLoaderData();
  const [selectedDapil] = useAtom(selectedDapilAtom);
  const [selectedAddressSuggestion] = useAtom(selectedAddressSuggestionAtom);
  const resetAllSelected = useSetAtom(resetAllSelectedAtom);

  const { data } = useWilayah(dapilType);
  let { data: listCaleg, isLoading: isLoadingCaleg } = useCaleg(dapilType);

  listCaleg = orderBy(listCaleg, ["profileId"], ["desc"]);

  function handleResetAddress() {
    resetAllSelected();
  }

  return (
    <div className="max-w-md bg-gray-50 mx-auto shadow-md min-h-screen flex flex-col prose">
      <header className="px-5 pt-6 sticky top-0 z-10 from-white to-transparent bg-gradient-to-b">
        <div className="flex items-center justify-between">
          <h1 className="font-semibold text-gray-500 text-base">{dapilLabels[dapilParamsToEnum[dapilType]]}</h1>
          <span className="font-semibold text-sm text-gray-400">Bukan KPU</span>
        </div>
        <AutoCompleteWilayah data={data} />
      </header>

      <main className="px-5 pb-32 flex-1 flex flex-col mt-2">
        {isLoadingCaleg && (
          <div className="flex justify-center items-center flex-1">
            <p className="text-gray-600 text-sm">Sedang mengambil data...</p>
          </div>
        )}

        {selectedDapil[dapilParamsToEnum[dapilType]] && listCaleg.length > 0 && (
          <>
            {selectedAddressSuggestion && (
              <div>
                <span className="text-gray-500 text-sm">Berdasarkan Alamat</span>
                <div className="flex justify-between leading-5 gap-x-2">
                  <p className="text-sm">{selectedAddressSuggestion.text}</p>
                  <button onClick={handleResetAddress} className="text-blue-500 text-sm font-medium">
                    Ubah
                  </button>
                </div>
              </div>
            )}
            <ul className="grid grid-cols-2 gap-3 pt-3">
              {listCaleg?.map((caleg, index) => <CardCaleg key={caleg.id} caleg={caleg} index={index} />)}
            </ul>
          </>
        )}

        {!selectedDapil[dapilParamsToEnum[dapilType]] && (
          <div className="flex flex-col text-left justify-center flex-1 pb-32">
            <p className="text-gray-800 text-xl font-semibold">Pilih dapil terlebih dahulu</p>

            <div>
              <p className="text-sm text-gray-700 mt-1 max-w-[280px]">
                Bisa coba cari dapil berdasarkan kecamatan/kabupaten kamu mencoblos
              </p>
            </div>

            <div className="mt-2">
              <AutoCompleteAddress />
              <p className="text-xs text-gray-500 pt-2 text-left">Catatan: harap pastikan lagi berdasarkan data KPU</p>
            </div>
          </div>
        )}
      </main>

      <nav className="fixed bottom-0 w-full pb-6">
        <ul className="flex max-w-md px-5 flex-wrap gap-x-2 gap-y-2">
          {dapilEnums.map((dapil) => (
            <li className="flex" key={dapil}>
              <Link
                activeProps={{ className: "!bg-pink-100 border-pink-700 text-gray-900 font-semibold" }}
                key={dapil}
                to={"/pemilu/$dapilType"}
                params={{ dapilType: dapilEnumToParams[dapil] }}
                tabIndex={0}
                className="py-1 px-3 border rounded-full text-gray-700 bg-white transition duration-100"
              >
                {dapilLabels[dapil]}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
}
