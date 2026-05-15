import type { SortKey, SortDir } from "../types";
import { IconClose, IconArrowUp, IconArrowDn } from "./icons";

interface Props {
  sortBy: SortKey;
  sortDir: SortDir;
  onSort: (by: SortKey, dir: SortDir) => void;
  onClose: () => void;
}

const OPTS: { key: SortKey; label: string }[] = [
  { key: "code", label: "Course code" },
  { key: "title", label: "Title" },
  { key: "units", label: "Units" },
  { key: "matches", label: "GE category count" },
];

export function SortSheet({ sortBy, sortDir, onSort, onClose }: Props) {
  return (
    <div
      className="absolute inset-0 z-50 flex items-end animate-fade-in"
      style={{ background: "oklch(0 0 0 / 0.5)" }}
      onClick={onClose}
    >
      <div
        className="w-full flex flex-col rounded-t-[18px] border-t animate-slide-up"
        style={{
          background: "var(--color-surface)",
          borderColor: "var(--color-border)",
          maxHeight: "60%",
        }}
        onClick={(e) => e.stopPropagation()}
      >
        <div
          className="w-9 h-1 rounded-full mx-auto mt-2.5 mb-1.5"
          style={{ background: "var(--color-border-2)" }}
        />

        <div
          className="flex items-center justify-between px-[18px] pb-3.5 border-b"
          style={{ borderColor: "var(--color-border)" }}
        >
          <h3 className="m-0 text-[17px] font-semibold tracking-tight">
            Sort by
          </h3>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-lg grid place-items-center"
            aria-label="Close"
          >
            <IconClose className="w-[18px] h-[18px]" />
          </button>
        </div>

        <div className="px-[18px] pt-3 pb-6 overflow-y-auto flex flex-col gap-2">
          {OPTS.map((o) => {
            const sel = sortBy === o.key;
            return (
              <button
                key={o.key}
                onClick={() =>
                  onSort(o.key, sel && sortDir === "asc" ? "desc" : "asc")
                }
                className="w-full flex items-center gap-3 px-3.5 py-3 rounded-[10px] text-left text-[14px] transition-colors"
                style={{
                  minHeight: 44,
                  background: sel ? "var(--color-accent-bg)" : "transparent",
                  color: sel ? "var(--color-text)" : "var(--color-text-2)",
                }}
                onMouseEnter={(e) => {
                  if (!sel)
                    e.currentTarget.style.background = "var(--color-hover)";
                }}
                onMouseLeave={(e) => {
                  if (!sel) e.currentTarget.style.background = "transparent";
                }}
              >
                <span className="flex-1">{o.label}</span>
                {sel && (
                  <span
                    style={{ color: "var(--color-accent)", marginLeft: "auto" }}
                  >
                    {sortDir === "asc" ? (
                      <IconArrowUp className="w-4 h-4" />
                    ) : (
                      <IconArrowDn className="w-4 h-4" />
                    )}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
