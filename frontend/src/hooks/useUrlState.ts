import { useState, useCallback, useEffect } from "react";
import type { CategoryId, SortKey, SortDir, View } from "../types";

export interface AppState {
  view: View;
  search: string;
  cats: CategoryId[];
  sortBy: SortKey;
  sortDir: SortDir;
  compare: string[];
  expanded: Set<string>;
  filterSheet: boolean;
  sortSheet: boolean;
}

function readUrl(): Partial<AppState> {
  const p = new URLSearchParams(window.location.search);
  const out: Partial<AppState> = {};

  const view = p.get("view");
  if (view === "browse" || view === "compare") out.view = view;

  const q = p.get("q");
  if (q) out.search = q;

  const cats = p.get("cats");
  if (cats) out.cats = cats.split(",").filter(Boolean) as CategoryId[];

  const sortBy = p.get("sortBy") as SortKey | null;
  if (sortBy) out.sortBy = sortBy;

  const sortDir = p.get("sortDir") as SortDir | null;
  if (sortDir) out.sortDir = sortDir;

  const compare = p.get("compare");
  if (compare) out.compare = compare.split(",").filter(Boolean);

  return out;
}

type UrlParams = Pick<
  AppState,
  "view" | "search" | "cats" | "sortBy" | "sortDir" | "compare"
>;

function buildUrl(s: UrlParams): string {
  const p = new URLSearchParams();
  if (s.view !== "browse") p.set("view", s.view);
  if (s.search) p.set("q", s.search);
  if (s.cats.length) p.set("cats", s.cats.join(","));
  if (s.sortBy !== "code") p.set("sortBy", s.sortBy);
  if (s.sortDir !== "asc") p.set("sortDir", s.sortDir);
  if (s.compare.length) p.set("compare", s.compare.join(","));
  const qs = p.toString();
  return qs ? `?${qs}` : window.location.pathname;
}

const DEFAULTS: AppState = {
  view: "browse",
  search: "",
  cats: [],
  sortBy: "code",
  sortDir: "asc",
  compare: [],
  expanded: new Set(),
  filterSheet: false,
  sortSheet: false,
};

export function useAppState() {
  const [state, setState] = useState<AppState>(() => ({
    ...DEFAULTS,
    ...readUrl(),
  }));

  const set = useCallback((patch: Partial<AppState>) => {
    setState((s) => ({ ...s, ...patch }));
  }, []);

  const { view, search, cats, sortBy, sortDir, compare } = state;

  useEffect(() => {
    const url = buildUrl({ view, search, cats, sortBy, sortDir, compare });
    window.history.replaceState(null, "", url);
  }, [view, search, cats, sortBy, sortDir, compare]);

  useEffect(() => {
    const onPop = () => setState((s) => ({ ...s, ...readUrl() }));
    window.addEventListener("popstate", onPop);
    return () => window.removeEventListener("popstate", onPop);
  }, []);

  return { state, set };
}
