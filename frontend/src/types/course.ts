export interface Course {
  courseCode: string;
  courseTitle: string;
  units: string;
  geCategories: string;
  description: string;
}

export interface CoursesResponse {
  courses: Course[];
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

export const GE_CATEGORY_LABELS: Record<GECategory, string> = {
  'GE-1A': 'GE-1A: Lower-Division Writing',
  'GE-1B': 'GE-1B: Upper-Division Writing',
  'GE-2': 'GE-2: Science and Technology',
  'GE-3': 'GE-3: Social & Behavioral Sciences',
  'GE-4': 'GE-4: Arts and Humanities',
  'GE-5A': 'GE-5A: Quantitative Literacy',
  'GE-5B': 'GE-5B: Formal Reasoning',
  'GE-6': 'GE-6: Language Other Than English',
  'GE-7': 'GE-7: Multicultural Studies',
  'GE-8': 'GE-8: International/Global Issues',
};
