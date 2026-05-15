import type { Course } from "../types";
import { IconChevR } from "./icons";

interface Props {
  compare: string[];
  courses: Course[];
  isMobile: boolean;
  onClear: () => void;
  onCompare: () => void;
}

export function CompareBar({
  compare,
  courses,
  isMobile,
  onClear,
  onCompare,
}: Props) {
  if (compare.length === 0) return null;

  return (
    <div
      className="sticky bottom-0 left-0 right-0 flex items-center justify-between gap-3.5 border-t z-10"
      style={{
        padding: "12px 24px",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        boxShadow: "0 -6px 18px oklch(0 0 0 / 0.18)",
      }}
    >
      <div
        className="flex items-center gap-2.5 text-[13px]"
        style={{ color: "var(--color-text-2)" }}
      >
        <div className="flex">
          {courses.slice(0, isMobile ? 2 : 4).map((c, i) => (
            <span
              key={c.courseCode}
              className="w-[30px] h-[30px] rounded-[8px] border grid place-items-center font-mono text-[10px] font-semibold"
              style={{
                background: "var(--color-bg-2)",
                borderColor: "var(--color-border)",
                color: "var(--color-text-2)",
                marginLeft: i === 0 ? 0 : -4,
              }}
              title={c.courseCode}
            >
              {c.courseCode.replace(/[^A-Z0-9]/gi, "").slice(0, 3)}
            </span>
          ))}
        </div>
        <span>
          <strong style={{ color: "var(--color-text)" }}>
            {compare.length}
          </strong>{" "}
          {compare.length === 1 ? "course" : "courses"} ready to compare
        </span>
      </div>

      <div className="flex gap-2">
        <button
          onClick={onClear}
          className="text-[12.5px] px-2.5 py-1.5 rounded-[6px] transition-colors"
          style={{ color: "var(--color-text-muted)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-hover)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "transparent")
          }
        >
          Clear
        </button>
        <button
          onClick={onCompare}
          className="h-9 px-3.5 rounded-lg inline-flex items-center gap-1.5 text-[13px] font-medium transition-colors"
          style={{ background: "var(--color-accent)", color: "white" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.background = "var(--color-accent-2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.background = "var(--color-accent)")
          }
        >
          Compare <IconChevR className="w-[13px] h-[13px]" />
        </button>
      </div>
    </div>
  );
}
