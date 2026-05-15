import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { useTheme } from "./hooks/useTheme";
import { useIsMobile } from "./hooks/useMediaQuery";
import { useAppState } from "./hooks/useUrlState";
import { useGECourses } from "./api/useCourses";
import type { SortKey, SortDir } from "./types";
import { Header } from "./components/Header";
import { BrowseView } from "./components/BrowseView";
import { CompareView } from "./components/CompareView";
import { CompareBar } from "./components/CompareBar";
import { MobileTabs } from "./components/MobileTabs";

const queryClient = new QueryClient();

function GEFinderApp() {
  const { theme, toggle: toggleTheme } = useTheme();
  const isMobile = useIsMobile();
  const { state, set } = useAppState();

  const { data: courses = [], isLoading, isError } = useGECourses(state.cats);

  const toggleExpand = (code: string) => {
    const nx = new Set(state.expanded);
    if (nx.has(code)) nx.delete(code);
    else nx.add(code);
    set({ expanded: nx });
  };

  const toggleCompare = (code: string) => {
    if (state.compare.includes(code)) {
      set({ compare: state.compare.filter((c) => c !== code) });
    } else if (state.compare.length < 4) {
      set({ compare: [...state.compare, code] });
    }
  };

  const handleSort = (key: SortKey, dir?: SortDir) => {
    if (dir) {
      set({ sortBy: key, sortDir: dir });
    } else if (state.sortBy === key) {
      set({ sortDir: state.sortDir === "asc" ? "desc" : "asc" });
    } else {
      set({ sortBy: key, sortDir: "asc" });
    }
  };

  const compareBarCourses = state.compare
    .map((code) => courses.find((c) => c.courseCode === code))
    .filter(Boolean) as typeof courses;

  return (
    <div
      className="w-full h-full flex flex-col font-sans text-[14px] leading-[1.5] tracking-[-0.005em] antialiased"
      style={{ background: "var(--color-bg)", color: "var(--color-text)" }}
    >
      <Header
        isMobile={isMobile}
        theme={theme}
        onThemeToggle={toggleTheme}
        view={state.view}
        onView={(v) => set({ view: v })}
        compareCount={state.compare.length}
      />

      <div className="flex-1 flex flex-col overflow-hidden min-h-0">
        {isLoading && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span className="text-[13.5px]">Loading courses…</span>
          </div>
        )}

        {isError && !isLoading && (
          <div
            className="flex-1 flex items-center justify-center"
            style={{ color: "var(--color-text-muted)" }}
          >
            <span className="text-[13.5px]">
              Failed to load courses. Is the backend running?
            </span>
          </div>
        )}

        {!isLoading &&
          !isError &&
          (state.view === "browse" ? (
            <BrowseView
              isMobile={isMobile}
              courses={courses}
              search={state.search}
              cats={state.cats}
              sortBy={state.sortBy}
              sortDir={state.sortDir}
              expanded={state.expanded}
              compare={state.compare}
              filterSheet={state.filterSheet}
              sortSheet={state.sortSheet}
              onSearch={(v) => set({ search: v })}
              onCats={(v) => set({ cats: v })}
              onSort={handleSort}
              onFilterSheet={(open) => set({ filterSheet: open })}
              onSortSheet={(open) => set({ sortSheet: open })}
              onToggleExpand={toggleExpand}
              onToggleCompare={toggleCompare}
              onClearFilters={() => set({ search: "", cats: [] })}
            />
          ) : (
            <CompareView
              isMobile={isMobile}
              compare={state.compare}
              allCourses={courses}
              onRemove={(code) =>
                set({ compare: state.compare.filter((c) => c !== code) })
              }
              onClear={() => set({ compare: [] })}
              onBrowse={() => set({ view: "browse" })}
            />
          ))}
      </div>

      {state.view === "browse" && (
        <CompareBar
          compare={state.compare}
          courses={compareBarCourses}
          isMobile={isMobile}
          onClear={() => set({ compare: [] })}
          onCompare={() => set({ view: "compare" })}
        />
      )}

      {isMobile && (
        <MobileTabs
          view={state.view}
          compareCount={state.compare.length}
          onView={(v) => set({ view: v })}
        />
      )}
    </div>
  );
}

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <GEFinderApp />
    </QueryClientProvider>
  );
}
