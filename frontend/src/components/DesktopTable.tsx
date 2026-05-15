import type { Course, CategoryId, SortKey, SortDir } from "../types";
import { CourseRow } from "./CourseRow";
import { IconChevUp, IconChevDn } from "./icons";

interface ThProps {
  col: SortKey;
  label: string;
  style?: React.CSSProperties;
  sortBy: SortKey;
  sortDir: SortDir;
  onSort: (key: SortKey) => void;
}

function Th({ col, label, style, sortBy, sortDir, onSort }: ThProps) {
  const active = sortBy === col;
  return (
    <th
      className="text-left text-xs font-medium tracking-[0.04em] uppercase px-4 py-3.5 border-b cursor-pointer select-none whitespace-nowrap sticky top-0 z-[1] transition-colors"
      style={{
        color: active ? "var(--color-text)" : "var(--color-text-muted)",
        background: "var(--color-surface)",
        borderColor: "var(--color-border)",
        ...style,
      }}
      onClick={() => onSort(col)}
      onMouseEnter={(e) => {
        if (!active) e.currentTarget.style.color = "var(--color-text-2)";
      }}
      onMouseLeave={(e) => {
        if (!active) e.currentTarget.style.color = "var(--color-text-muted)";
      }}
    >
      {label}
      <span
        className="inline-flex flex-col align-middle ml-1"
        style={{
          opacity: active ? 1 : 0.4,
          color: active ? "var(--color-accent)" : undefined,
        }}
      >
        <IconChevUp
          className={`w-[9px] h-[9px] block ${active && sortDir === "desc" ? "opacity-25" : ""}`}
        />
        <IconChevDn
          className={`w-[9px] h-[9px] block ${active && sortDir === "asc" ? "opacity-25" : ""}`}
        />
      </span>
    </th>
  );
}

interface Props {
  rows: Course[];
  sortBy: SortKey;
  sortDir: SortDir;
  expanded: Set<string>;
  compare: string[];
  selectedCats: CategoryId[];
  onSort: (key: SortKey) => void;
  onToggleExpand: (code: string) => void;
  onToggleCompare: (code: string) => void;
}

export function DesktopTable({
  rows,
  sortBy,
  sortDir,
  expanded,
  compare,
  selectedCats,
  onSort,
  onToggleExpand,
  onToggleCompare,
}: Props) {
  return (
    <div
      className="flex-1 min-h-0 flex flex-col"
      style={{
        overflow: "hidden",
        border: "1px solid var(--color-border)",
        borderRadius: 14,
      }}
    >
      <div className="flex-1 min-h-0 overflow-y-auto overscroll-none">
        <table
          className="w-full text-[13.5px]"
          style={{
            borderCollapse: "separate",
            borderSpacing: 0,
            background: "var(--color-surface)",
          }}
        >
          <thead>
            <tr>
              <Th
                col="code"
                label="Course"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                col="title"
                label="Title"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                col="units"
                label="Units"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
              <Th
                col="matches"
                label="GE Categories"
                sortBy={sortBy}
                sortDir={sortDir}
                onSort={onSort}
              />
              <th
                className="text-left text-xs font-medium tracking-[0.04em] uppercase px-4 py-3.5 border-b sticky top-0 z-[1]"
                style={{
                  color: "var(--color-text-muted)",
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  cursor: "default",
                }}
              >
                Description
              </th>
              <th
                className="border-b sticky top-0 z-[1]"
                style={{
                  width: 80,
                  background: "var(--color-surface)",
                  borderColor: "var(--color-border)",
                  cursor: "default",
                }}
              />
            </tr>
          </thead>
          <tbody>
            {rows.map((c) => (
              <CourseRow
                key={c.courseCode}
                course={c}
                expanded={expanded.has(c.courseCode)}
                onToggle={() => onToggleExpand(c.courseCode)}
                inCompare={compare.includes(c.courseCode)}
                onCompare={() => onToggleCompare(c.courseCode)}
                selectedCats={selectedCats}
              />
            ))}
          </tbody>
        </table>
      </div>
      {/* attribution footer */}
      <div
        className="flex items-center justify-end px-4 border-t"
        style={{
          height: 32,
          borderColor: "var(--color-border)",
          background: "var(--color-surface)",
          fontSize: 11.5,
          color: "var(--color-text-muted)",
          flexShrink: 0,
        }}
      >
        Data from{" "}
        <a
          href="https://icssc.link/about-anteaterapi"
          target="_blank"
          rel="noreferrer"
          className="ml-1 underline underline-offset-2 transition-colors"
          style={{ color: "var(--color-accent)" }}
          onMouseEnter={(e) =>
            (e.currentTarget.style.color = "var(--color-accent-2)")
          }
          onMouseLeave={(e) =>
            (e.currentTarget.style.color = "var(--color-accent)")
          }
        >
          Anteater API
        </a>
      </div>
    </div>
  );
}
