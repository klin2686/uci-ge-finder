export type CategoryId =
  | "Ia"
  | "Ib"
  | "II"
  | "III"
  | "IV"
  | "Va"
  | "Vb"
  | "VI"
  | "VII"
  | "VIII";

export type SortKey = "code" | "title" | "units" | "matches";
export type SortDir = "asc" | "desc";
export type View = "browse" | "compare";

export interface Course {
  courseCode: string;
  courseTitle: string;
  units: number;
  geCategories: CategoryId[];
  description: string;
  prerequisites: string;
  restrictions: string;
}
