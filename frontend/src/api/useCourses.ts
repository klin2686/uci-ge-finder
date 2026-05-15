import { useQuery } from "@tanstack/react-query";
import type { CategoryId } from "../types";
import { fetchGECourses } from "./client";

export function useGECourses(cats: CategoryId[]) {
  const key = ["ge-courses", cats[0] ?? null, cats[1] ?? null] as const;
  return useQuery({
    queryKey: key,
    queryFn: () => fetchGECourses(cats),
    staleTime: 5 * 60 * 1000,
  });
}
