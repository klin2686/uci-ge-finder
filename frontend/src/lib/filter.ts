import type { Course, CategoryId, SortKey, SortDir } from "../types";

export function filterCourses(
  courses: Course[],
  search: string,
  cats: CategoryId[],
): Course[] {
  const q = search.trim().toLowerCase();
  return courses.filter((c) => {
    if (cats.length && !cats.every((cid) => c.geCategories.includes(cid)))
      return false;
    if (!q) return true;
    return (
      c.courseCode.toLowerCase().includes(q) ||
      c.courseTitle.toLowerCase().includes(q) ||
      c.description.toLowerCase().includes(q)
    );
  });
}

export function sortCourses(
  rows: Course[],
  sortBy: SortKey,
  sortDir: SortDir,
): Course[] {
  const dir = sortDir === "asc" ? 1 : -1;
  const codeKey = (c: Course): [string, number, string] => {
    const m = c.courseCode.match(/^(.*?)\s*(\d+\w*)$/);
    return [m ? m[1] : c.courseCode, m ? parseInt(m[2], 10) : 0, c.courseCode];
  };
  return [...rows].sort((a, b) => {
    if (sortBy === "code") {
      const [da, na] = codeKey(a),
        [db, nb] = codeKey(b);
      if (da !== db) return da < db ? -dir : dir;
      return (na - nb) * dir;
    }
    if (sortBy === "title")
      return a.courseTitle.localeCompare(b.courseTitle) * dir;
    if (sortBy === "units") return (a.units - b.units) * dir;
    if (sortBy === "matches")
      return (b.geCategories.length - a.geCategories.length) * dir;
    return 0;
  });
}
