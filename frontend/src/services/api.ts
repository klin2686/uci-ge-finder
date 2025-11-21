import type { CoursesResponse, GECategory } from '../types/course';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

interface FetchCoursesParams {
  filter1?: GECategory | null;
  filter2?: GECategory | null;
  cursor?: string | null;
  take?: number;
}

export async function fetchCourses({
  filter1 = null,
  filter2 = null,
  cursor = null,
  take = 100,
}: FetchCoursesParams = {}): Promise<CoursesResponse> {
  const params = new URLSearchParams();

  if (filter1) params.append('filter1', filter1);
  if (filter2) params.append('filter2', filter2);
  if (cursor) params.append('cursor', cursor);
  params.append('take', take.toString());

  const response = await fetch(`${API_BASE_URL}/api/ge-courses?${params.toString()}`);

  if (!response.ok) {
    throw new Error('Failed to fetch courses');
  }

  return response.json();
}
