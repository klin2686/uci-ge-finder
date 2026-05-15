import { useMemo } from "react";
import type { Course, CategoryId, SortKey, SortDir } from "../types";
import { filterCourses, sortCourses } from "../lib/filter";
import { DesktopTable } from "./DesktopTable";
import { CourseCard } from "./CourseCard";
import { CategorySelect } from "./CategorySelect";
import { FilterSheet } from "./FilterSheet";
import { SortSheet } from "./SortSheet";
import { EmptyHero } from "./EmptyHero";
import { NoResults } from "./NoResults";
import { IconSearch, IconClose, IconFilter, IconSort } from "./icons";

interface Props {
  isMobile: boolean;
  courses: Course[];
  search: string;
  cats: CategoryId[];
  sortBy: SortKey;
  sortDir: SortDir;
  expanded: Set<string>;
  compare: string[];
  filterSheet: boolean;
  sortSheet: boolean;
  onSearch: (v: string) => void;
  onCats: (v: CategoryId[]) => void;
  onSort: (by: SortKey, dir?: SortDir) => void;
  onSortSheet: (open: boolean) => void;
  onFilterSheet: (open: boolean) => void;
  onToggleExpand: (code: string) => void;
  onToggleCompare: (code: string) => void;
  onClearFilters: () => void;
}

export function BrowseView({
  isMobile,
  courses,
  search,
  cats,
  sortBy,
  sortDir,
  expanded,
  compare,
  filterSheet,
  sortSheet,
  onSearch,
  onCats,
  onSort,
  onSortSheet,
  onFilterSheet,
  onToggleExpand,
  onToggleCompare,
  onClearFilters,
}: Props) {
  const filtered = useMemo(
    () => filterCourses(courses, search, cats),
    [courses, search, cats],
  );
  const sorted = useMemo(
    () => sortCourses(filtered, sortBy, sortDir),
    [filtered, sortBy, sortDir],
  );
  const hasFilter = search.trim().length > 0 || cats.length > 0;

  const handleCat0Change = (v: CategoryId | null) => {
    if (v) onCats([v, ...(cats[1] ? [cats[1]] : [])]);
    else onCats(cats.filter((_, i) => i !== 0));
  };
  const handleCat1Change = (v: CategoryId | null) => {
    if (v) onCats([...(cats[0] ? [cats[0]] : []), v]);
    else onCats(cats.filter((_, i) => i !== 1));
  };

  return (
    <div className="flex flex-col flex-1 overflow-hidden min-h-0 relative">
      {/* toolbar */}
      <div
        className="flex gap-3 items-stretch"
        style={{
          padding: isMobile ? "14px 16px 4px" : "18px 24px 0",
          flexDirection: isMobile ? "column" : "row",
        }}
      >
        {/* search */}
        <label
          className="flex-1 flex items-center gap-2.5 rounded-xl border h-12 px-3.5 transition-all"
          style={{
            minHeight: isMobile ? 40 : undefined,
            background: "var(--color-surface)",
            borderColor: "var(--color-border)",
          }}
          onFocusCapture={(e) => {
            const el = e.currentTarget as HTMLLabelElement;
            el.style.borderColor = "var(--color-accent-bd)";
            el.style.background = "var(--color-surface-2)";
          }}
          onBlurCapture={(e) => {
            const el = e.currentTarget as HTMLLabelElement;
            el.style.borderColor = "var(--color-border)";
            el.style.background = "var(--color-surface)";
          }}
        >
          <span
            className="grid place-items-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <IconSearch className="w-[18px] h-[18px]" />
          </span>
          <input
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            placeholder={
              isMobile
                ? "Search courses"
                : "Search by course code, title, or keyword"
            }
            className="flex-1 h-full text-[14.5px] bg-transparent border-0 outline-none"
            style={{ color: "var(--color-text)" }}
          />
          {search && (
            <button
              onClick={() => onSearch("")}
              className="w-6 h-6 rounded-full grid place-items-center transition-colors"
              style={{
                color: "var(--color-text-muted)",
                background: "var(--color-hover)",
              }}
              aria-label="Clear search"
              onMouseEnter={(e) => {
                e.currentTarget.style.color = "var(--color-text)";
                e.currentTarget.style.background = "var(--color-surface-2)";
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.color = "var(--color-text-muted)";
                e.currentTarget.style.background = "var(--color-hover)";
              }}
            >
              <IconClose className="w-3 h-3" />
            </button>
          )}
        </label>

        {/* desktop category selects */}
        {!isMobile && (
          <>
            <CategorySelect
              value={cats[0]}
              otherValue={cats[1]}
              placeholder="First GE category"
              onChange={handleCat0Change}
            />
            <CategorySelect
              value={cats[1]}
              otherValue={cats[0]}
              placeholder="Second GE category"
              onChange={handleCat1Change}
            />
          </>
        )}
      </div>

      {/* mobile tools row */}
      {isMobile && (
        <div style={{ padding: "6px 16px 0" }}>
          <div className="flex gap-2 items-center flex-wrap">
            <PillBtn
              active={cats.length > 0}
              onClick={() => onFilterSheet(true)}
            >
              <IconFilter className="w-3.5 h-3.5" />
              {cats.length === 0
                ? "Filter"
                : `${cats.length} ${cats.length === 1 ? "category" : "categories"}`}
            </PillBtn>
            <PillBtn onClick={() => onSortSheet(true)}>
              <IconSort className="w-3.5 h-3.5" /> Sort
            </PillBtn>
            {cats.map((cid) => (
              <span
                key={cid}
                className="h-9 inline-flex items-center rounded-full border font-mono text-[12.5px] font-semibold tracking-[0.02em]"
                style={{
                  paddingLeft: 14,
                  paddingRight: 8,
                  background: "var(--color-accent-bg)",
                  borderColor: "var(--color-accent-bd)",
                  color: "var(--color-accent-2)",
                }}
              >
                {cid}
                <button
                  onClick={() => onCats(cats.filter((x) => x !== cid))}
                  className="inline-flex items-center ml-1 opacity-75 hover:opacity-100"
                >
                  <IconClose className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>
      )}

      {/* meta row */}
      <div
        className="flex items-center justify-between"
        style={{
          padding: isMobile ? "10px 16px 8px" : "14px 24px 12px",
          color: "var(--color-text-muted)",
          fontSize: isMobile ? 12.5 : 13,
        }}
      >
        <div className="flex items-center gap-3 flex-wrap">
          <span>
            Showing{" "}
            <strong style={{ color: "var(--color-text)" }}>
              {sorted.length}
            </strong>{" "}
            {sorted.length === 1 ? "course" : "courses"}
          </span>
        </div>
        {hasFilter && (
          <button
            onClick={onClearFilters}
            className="text-[12.5px] px-2.5 py-1.5 rounded-[6px] transition-colors"
            style={{ color: "var(--color-text-muted)" }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background = "var(--color-hover)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background = "transparent")
            }
          >
            Clear all
          </button>
        )}
      </div>

      {!isMobile && (
        <div
          className="h-px mx-6"
          style={{ background: "var(--color-border)" }}
        />
      )}

      {/* results */}
      <div
        className="flex-1 overflow-y-auto"
        style={{ padding: isMobile ? "6px 16px 24px" : "16px 24px 24px" }}
      >
        {sorted.length === 0 ? (
          hasFilter ? (
            <NoResults search={search} cats={cats} onClear={onClearFilters} />
          ) : (
            <EmptyHero
              totalCourses={courses.length}
              onPick={(id) => onCats([id])}
            />
          )
        ) : !isMobile ? (
          <DesktopTable
            rows={sorted}
            sortBy={sortBy}
            sortDir={sortDir}
            expanded={expanded}
            compare={compare}
            selectedCats={cats}
            onSort={onSort}
            onToggleExpand={onToggleExpand}
            onToggleCompare={onToggleCompare}
          />
        ) : (
          <div className="flex flex-col gap-2.5">
            {sorted.map((c) => (
              <CourseCard
                key={c.courseCode}
                course={c}
                expanded={expanded.has(c.courseCode)}
                onToggle={() => onToggleExpand(c.courseCode)}
                inCompare={compare.includes(c.courseCode)}
                onCompare={() => onToggleCompare(c.courseCode)}
                selectedCats={cats}
              />
            ))}
          </div>
        )}
      </div>

      {/* mobile sheets */}
      {filterSheet && (
        <FilterSheet
          cats={cats}
          onCats={onCats}
          onClose={() => onFilterSheet(false)}
        />
      )}
      {sortSheet && (
        <SortSheet
          sortBy={sortBy}
          sortDir={sortDir}
          onSort={(by, dir) => {
            onSort(by, dir);
            onSortSheet(false);
          }}
          onClose={() => onSortSheet(false)}
        />
      )}
    </div>
  );
}

function PillBtn({
  active,
  onClick,
  children,
}: {
  active?: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      onClick={onClick}
      className="h-9 px-3.5 rounded-full border text-[13px] font-medium inline-flex items-center gap-2 transition-all"
      style={{
        background: active ? "var(--color-accent-bg)" : "var(--color-surface)",
        borderColor: active ? "var(--color-accent-bd)" : "var(--color-border)",
        color: active ? "var(--color-accent-2)" : "var(--color-text-2)",
      }}
    >
      {children}
    </button>
  );
}
