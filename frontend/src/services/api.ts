import type { CoursesResponse, GECategory } from '../types/course';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export class ApiError extends Error {
  status: number;
  constructor(message: string, status: number) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
  }
}

interface FetchCoursesParams {
  category1?: GECategory | null;
  category2?: GECategory | null;
}

export async function fetchCourses({
  category1 = null,
  category2 = null,
}: FetchCoursesParams = {}): Promise<CoursesResponse> {
  const params = new URLSearchParams();

  if (category1) params.append('category1', category1);
  if (category2) params.append('category2', category2);

  const response = await fetch(`${API_BASE_URL}/api/ge-courses?${params.toString()}`);

  if (!response.ok) {
    throw new ApiError('Failed to fetch courses', response.status);
  }

  return response.json();
}
