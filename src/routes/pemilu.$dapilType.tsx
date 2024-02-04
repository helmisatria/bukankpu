import { AutoCompleteWilayah } from "@/components/app/AutoCompleteWilayah";
import { CardCaleg } from "@/components/app/CardCaleg";
import type { SelectCaleg } from "@/db/db.schema";
import { dapilEnumToParams, dapilEnums, dapilLabels, dapilParamsToEnum } from "@/lib/constants";
import type { DapilParamsType } from "@/lib/types";
import { toTitleCase } from "@/lib/utils";
import { useCaleg } from "@/queries/useCaleg";
import { useWilayah } from "@/queries/useWilayah";
import { Link, createFileRoute, redirect } from "@tanstack/react-router";
import { orderBy } from "lodash-es";
import { Loader2 } from "lucide-react";
import { useEffect, useState } from "react";

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

  const { data } = useWilayah(dapilType);
  let { data: listCaleg } = useCaleg(dapilType);

  listCaleg = orderBy(listCaleg, ["profileId"], ["desc"]);

  return (
    <div className="max-w-md bg-gray-50 mx-auto shadow-md min-h-screen prose">
      <header className="px-5 py-6">
        <h1 className="font-semibold text-xl">Bukan KPU</h1>

        {dapilLabels[dapilParamsToEnum[dapilType]]}
        <AutoCompleteWilayah data={data} />
      </header>

      <main className="px-5 pb-32">
        <h2 className="text-lg font-semibold">Daftar Caleg</h2>

        <ul className="grid grid-cols-2 gap-3 pt-3">
          {listCaleg?.map((caleg, index) => <CardCaleg key={caleg.id} caleg={caleg} index={index} />)}
        </ul>
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
