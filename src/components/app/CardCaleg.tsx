import type { SelectCaleg } from "@/db/db.schema";
import { partaiLogo } from "@/lib/constants";
import { toTitleCase } from "@/lib/utils";
import { Loader2 } from "lucide-react";
import { useState, useEffect, useRef, type ReactEventHandler } from "react";

function ImageWithSpinner({ caleg, index }: { caleg: SelectCaleg; index: number }) {
  // Assume image is not loading by default if it's lazy loaded
  const [isLoading, setIsLoading] = useState(index <= 6);
  const hasErrorOccurred = useRef(false); // Ref to track if error has already occurred

  useEffect(() => {
    // If the image is supposed to be lazy loaded and is not in the viewport initially,
    // it won't load, so we don't show the spinner by default.
    // You might adjust the condition based on your actual visibility logic or viewport checks.
    if (index > 6) {
      setIsLoading(false);
    }
  }, [index]);

  const handleError: ReactEventHandler<HTMLImageElement> = (e) => {
    if (!hasErrorOccurred.current) {
      e.currentTarget.src = caleg.photoUrl || "";
      hasErrorOccurred.current = true; // Mark that an error has occurred to prevent future updates
      setIsLoading(false);
    }
  };

  return (
    <div className="h-60 w-full rounded relative">
      {isLoading && (
        <div className="absolute inset-0 flex justify-center items-center">
          <Loader2 className="animate-spin" /> {/* Render your spinner component here */}
        </div>
      )}

      <img
        className="h-60 w-full object-cover rounded"
        src={caleg.compressedPhotoUrl || caleg.photoUrl || ""}
        onError={handleError}
        loading={index <= 6 ? "eager" : "lazy"}
        onLoad={() => setIsLoading(false)}
        alt={caleg.name!}
        width={200}
        height={240}
        style={{
          display: isLoading ? "none" : "block",
        }}
      />
    </div>
  );
}

export const CardCaleg = ({ caleg, index }: { caleg: SelectCaleg; index: number }) => {
  const lastEducation = caleg.education?.[(caleg.education?.length ?? 1) - 1]?.level;
  const shareable = caleg.profileId;
  const awards = caleg.awards?.filter((award) => award.awardName !== "-")?.length;
  const orgs = caleg.organization?.filter((org) => org.organizationName !== "-")?.length;
  const religion = caleg.religion;
  const age = caleg.age;
  const noUrut = caleg.noUrut;
  const partai = caleg.partai as keyof typeof partaiLogo;

  return (
    <li key={caleg.id} className="rounded">
      <a href="#" className="flex rounded shadow relative flex-col w-full h-60 bg-white">
        <ImageWithSpinner caleg={caleg} index={index} />

        <div className="absolute w-full h-36 bg-gradient-to-t rounded from-white to-transparent from-5% via-white/60 bottom-0"></div>
        {noUrut && (
          <div className="absolute top-0 right-0 bg-white p-1 h-[30px] w-[30px] inline-flex items-center justify-center rounded-tr rounded-bl shadow bg-white/80 text-sm font-semibold">
            {noUrut}
          </div>
        )}

        {partai && (
          <div className="absolute top-0 left-0 m-1 opacity-80">
            <img
              src={partaiLogo[partai]}
              alt={partai}
              width={"auto"}
              height={"auto"}
              className="rounded object-contain object-left max-w-[50px] max-h-[30px]"
            />
          </div>
        )}

        <div className="absolute bottom-0 w-full px-3 py-2">
          <div className="mb-2">
            <ul className="inline-flex flex-wrap gap-1">
              {!shareable && (
                <li className="p-1 leading-4 text-xs font-semibold bg-pink-700/70 text-white md:w-2/3 rounded">
                  Tidak bersedia publikasi profile
                </li>
              )}

              {!!lastEducation && (
                <li className="p-1 leading-none text-xs font-semibold bg-white/80 rounded">
                  {caleg.education?.[(caleg.education?.length ?? 1) - 1]?.level}
                </li>
              )}

              {!!awards && <li className="p-1 leading-none text-xs font-semibold bg-white/80 rounded">Prestasi {awards}</li>}
              {!!orgs && <li className="p-1 leading-none text-xs font-semibold bg-white/80 rounded">Organisasi {orgs}</li>}
              {!!religion && <li className="p-1 leading-none text-xs font-semibold bg-white/80 rounded">{religion}</li>}
              {!!age && <li className="p-1 leading-none text-xs font-semibold bg-white/80 rounded">{age}</li>}
            </ul>
          </div>

          <h2 className="font-bold h-10 line-clamp-2 text-base text-balance leading-5 text-gray-950">
            {toTitleCase(caleg.name!)}
          </h2>
        </div>
      </a>
    </li>
  );
};
