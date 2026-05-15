import type { CategoryId } from "../types";
import { GE_CATEGORIES } from "../lib/categories";
import { CatBadge } from "./CatBadge";
import { IconSparkle } from "./icons";

interface Props {
  totalCourses: number;
  onPick: (id: CategoryId) => void;
}

export function EmptyHero({ totalCourses, onPick }: Props) {
  return (
    <div
      className="flex flex-col items-center justify-center text-center rounded-2xl border border-dashed p-14 mx-0"
      style={{
        background: "var(--color-surface)",
        borderColor: "var(--color-border-2)",
        color: "var(--color-text-muted)",
      }}
    >
      <div
        className="w-14 h-14 rounded-[14px] grid place-items-center mb-[18px]"
        style={{
          background: "var(--color-accent-bg)",
          color: "var(--color-accent)",
        }}
      >
        <IconSparkle className="w-[26px] h-[26px]" />
      </div>

      <h3
        className="m-0 text-[18px] font-semibold tracking-tight"
        style={{ color: "var(--color-text)" }}
      >
        Find classes that fulfill multiple GEs
      </h3>
      <p className="mt-1.5 max-w-[380px] text-[13.5px]">
        Pick up to 2 categories and we'll show you the classes that satisfy{" "}
        <strong style={{ color: "var(--color-text-2)" }}>both</strong> — no more
        cross-referencing the catalog by hand.
      </p>

      <div
        className="mt-[22px] grid gap-2 w-full max-w-[580px]"
        style={{ gridTemplateColumns: "repeat(auto-fill, minmax(180px, 1fr))" }}
      >
        {GE_CATEGORIES.map((c) => (
          <button
            key={c.id}
            onClick={() => onPick(c.id)}
            className="flex items-center gap-2.5 px-3 py-2.5 rounded-[10px] text-[13px] text-left border transition-all hover:-translate-y-px"
            style={{
              background: "var(--color-bg-2)",
              borderColor: "var(--color-border)",
              color: "var(--color-text-2)",
            }}
            onMouseEnter={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-accent-bd)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text)";
            }}
            onMouseLeave={(e) => {
              (e.currentTarget as HTMLButtonElement).style.borderColor =
                "var(--color-border)";
              (e.currentTarget as HTMLButtonElement).style.color =
                "var(--color-text-2)";
            }}
          >
            <CatBadge id={c.id} matched />
            <span>{c.name}</span>
          </button>
        ))}
      </div>

      <p
        className="mt-[22px] text-xs"
        style={{ color: "var(--color-text-faint)" }}
      >
        Currently indexing {totalCourses} courses across all 10 categories.
      </p>
    </div>
  );
}
