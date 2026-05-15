import type { View } from "../types";
import { IconList, IconCompare } from "./icons";

interface Props {
  view: View;
  compareCount: number;
  onView: (v: View) => void;
}

export function MobileTabs({ view, compareCount, onView }: Props) {
  return (
    <div
      className="sticky bottom-0 flex border-t z-10"
      style={{
        background: "var(--color-bg)",
        borderColor: "var(--color-border)",
      }}
    >
      {(["browse", "compare"] as View[]).map((v) => (
        <button
          key={v}
          aria-selected={view === v}
          onClick={() => onView(v)}
          className="flex-1 flex flex-col items-center justify-center gap-1 pb-3 pt-2.5 text-[11px] font-medium relative"
          style={{
            color:
              view === v ? "var(--color-accent)" : "var(--color-text-muted)",
          }}
        >
          {v === "browse" ? (
            <IconList className="w-5 h-5" />
          ) : (
            <IconCompare className="w-5 h-5" />
          )}
          {v.charAt(0).toUpperCase() + v.slice(1)}
          {v === "compare" && compareCount > 0 && (
            <span
              className="absolute top-1.5 font-mono text-[9.5px] font-semibold rounded-full px-1 min-w-[14px] text-center"
              style={{
                right: "calc(50% - 22px)",
                background: "var(--color-accent)",
                color: "white",
                padding: "1px 5px",
              }}
            >
              {compareCount}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}
