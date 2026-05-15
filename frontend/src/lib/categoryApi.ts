import type { CategoryId } from "../types";

const ROMAN_TO_API: Record<CategoryId, string> = {
  Ia: "GE-1A",
  Ib: "GE-1B",
  II: "GE-2",
  III: "GE-3",
  IV: "GE-4",
  Va: "GE-5A",
  Vb: "GE-5B",
  VI: "GE-6",
  VII: "GE-7",
  VIII: "GE-8",
};

export const toApiParam = (id: CategoryId): string => ROMAN_TO_API[id];
