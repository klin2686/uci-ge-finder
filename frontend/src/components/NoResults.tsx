import type { CategoryId } from "../types";
import { categoryById } from "../lib/categories";
import { IconSearch } from "./icons";

interface Props {
  search: string;
  cats: CategoryId[];
  onClear: () => void;
}

export function NoResults({ search, cats, onClear }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed px-6 py-10"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border-2)",
        color: "var(--color-text-muted)",
      }}
    >
      <div
        className="w-14 h-14 rounded-[14px] grid place-items-center mb-[18px]"
        style={{
          background: "var(--color-bg-2)",
          color: "var(--color-text-muted)",
        }}
      >
        <IconSearch className="w-[26px] h-[26px]" />
      </div>

      <h3
        className="m-0 text-[18px] font-semibold tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        No matching courses
      </h3>
      <p className="mt-1.5 max-w-[380px] text-[13.5px]">
        {cats.length === 2 ? (
          <>
            No class currently fulfills both{" "}
            <strong style={{ color: "var(--color-text-2)" }}>
              {categoryById(cats[0]).short}
            </strong>{" "}
            and{" "}
            <strong style={{ color: "var(--color-text-2)" }}>
              {categoryById(cats[1]).short}
            </strong>
            {search && <> with the search term "{search}"</>}.
          </>
        ) : (
          <>
            Nothing matches your filters
            {search && <> and the search term "{search}"</>}.
          </>
        )}
      </p>
      <button
        onClick={onClear}
        className="mt-[18px] flex items-center justify-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] border transition-all hover:-translate-y-px"
        style={{
          maxWidth: 200,
          background: "var(--color-bg-2)",
          borderColor: "var(--color-border)",
          color: "var(--color-text-2)",
        }}
      >
        Clear filters
      </button>
    </div>
  );
}
