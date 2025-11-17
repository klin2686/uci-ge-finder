export interface Course {
  courseCode: string;
  courseTitle: string;
  units: string;
  geCategories: string;
  description: string;
}

export interface CoursesResponse {
  courses: Course[];
  nextCursor: string | null;
}

export type GECategory =
  | 'GE-1A'
  | 'GE-1B'
  | 'GE-2'
  | 'GE-3'
  | 'GE-4'
  | 'GE-5A'
  | 'GE-5B'
  | 'GE-6'
  | 'GE-7'
  | 'GE-8';

export const GE_CATEGORIES: GECategory[] = [
  'GE-1A',
  'GE-1B',
  'GE-2',
  'GE-3',
  'GE-4',
  'GE-5A',
  'GE-5B',
  'GE-6',
  'GE-7',
  'GE-8',
];

export interface GEFilterParams {
  category1?: GECategory;
  category2?: GECategory;
  take?: number;
  cursor?: string;
}
