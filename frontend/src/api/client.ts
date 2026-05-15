import type { CategoryId, Course } from "../types";
import { toApiParam } from "../lib/categoryApi";

const BASE = import.meta.env.VITE_API_URL ?? "";

interface CourseListResponse {
  courses: Course[];
}

export async function fetchGECourses(cats: CategoryId[]): Promise<Course[]> {
  const params = new URLSearchParams();
  if (cats[0]) params.set("category1", toApiParam(cats[0]));
  if (cats[1]) params.set("category2", toApiParam(cats[1]));

  const url = `${BASE}/api/ge-courses${params.size ? `?${params}` : ""}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`API error ${res.status}`);
  const data: CourseListResponse = await res.json();
  return data.courses;
}
