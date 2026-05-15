import type { CategoryId } from "../types";

export interface GECategory {
  id: CategoryId;
  short: CategoryId;
  name: string;
  hue: number;
}

export const GE_CATEGORIES: GECategory[] = [
  { id: "Ia", short: "Ia", name: "Lower Division Writing", hue: 24 },
  { id: "Ib", short: "Ib", name: "Upper Division Writing", hue: 48 },
  { id: "II", short: "II", name: "Science and Technology", hue: 230 },
  { id: "III", short: "III", name: "Social & Behavioral Sciences", hue: 280 },
  { id: "IV", short: "IV", name: "Arts and Humanities", hue: 330 },
  { id: "Va", short: "Va", name: "Quantitative Literacy", hue: 200 },
  { id: "Vb", short: "Vb", name: "Formal Reasoning", hue: 160 },
  { id: "VI", short: "VI", name: "Language Other Than English", hue: 110 },
  { id: "VII", short: "VII", name: "Multicultural Studies", hue: 80 },
  { id: "VIII", short: "VIII", name: "International/Global Issues", hue: 12 },
];

export const categoryById = (id: CategoryId) =>
  GE_CATEGORIES.find((c) => c.id === id)!;
