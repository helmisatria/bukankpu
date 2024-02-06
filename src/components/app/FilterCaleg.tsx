import { useAtom } from "jotai";
import type { DapilParamsType } from "@/lib/types";
import { useCaleg } from "@/queries/useCaleg";
import { Route } from "@/routes/pemilu.$dapilType";
import { uniq } from "lodash-es";
import { filterCalegAtom } from "@/store/global";
import type { SelectCaleg } from "@/db/db.schema";
import { toTitleCase } from "@/lib/utils";

export const useFilteredListCaleg = (listCaleg: SelectCaleg[]): SelectCaleg[] => {
  const [filterState] = useAtom(filterCalegAtom);

  const filteredList = listCaleg.filter((caleg) => {
    const educationMatch =
      filterState.pendidikan.length === 0 || caleg.education?.some((ed) => filterState.pendidikan.includes(ed.level));
    const partaiMatch = filterState.partai.length === 0 || filterState.partai.includes(caleg.partai!);

    return educationMatch && partaiMatch;
  });

  return filteredList;
};

export const FilterCaleg = () => {
  const { dapilType } = Route.useParams();
  const { data: listCaleg } = useCaleg(dapilType as DapilParamsType);

  // Use the atom for filter state
  const [filterState, setFilterState] = useAtom(filterCalegAtom);

  // Derive pendidikan options from listCaleg
  const pendidikanOptions = uniq(listCaleg?.map((caleg) => caleg.education?.map((education) => education.level)).flat()).filter(
    Boolean,
  ) as string[];

  // Function to handle checkbox changes
  const handleCheckboxChange = (category: keyof typeof filterState, value: string) => {
    setFilterState((draft) => {
      const currentIndex = draft[category].indexOf(value);
      if (currentIndex === -1) {
        draft[category].push(value);
      } else {
        draft[category].splice(currentIndex, 1);
      }
    });
  };

  // Helper function to render checkboxes for a given category
  const renderCheckboxes = (options: string[], category: keyof typeof filterState) => (
    <>
      <dt className="text-gray-500 text-sm">{toTitleCase(category)}</dt>
      <div className="flex gap-x-2 flex-wrap">
        {options.map((option) => (
          <div key={option}>
            <label htmlFor={`${category}-${option}`} className="inline-flex items-center text-sm">
              <input
                id={`${category}-${option}`}
                aria-describedby={`${category}-${option}-description`}
                name={`${category}-${option}`}
                type="checkbox"
                checked={filterState[category].includes(option)}
                onChange={() => handleCheckboxChange(category, option)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-600"
              />
              <span className="ml-1">
                {option}{" "}
                <span className="text-gray-500">
                  ({listCaleg?.filter((caleg) => caleg.education?.some((ed) => ed.level === option)).length})
                </span>
              </span>
            </label>
          </div>
        ))}
      </div>
    </>
  );

  return (
    <>
      <h2 className="sr-only">Filter Data</h2>
      <dl>
        {renderCheckboxes(pendidikanOptions, "pendidikan")}
        {/* Uncomment and populate these options accordingly */}
        {/* {renderCheckboxes(filterState.partai, "partai")} */}
        {/* Additional categories can be similarly managed */}
      </dl>
    </>
  );
};
