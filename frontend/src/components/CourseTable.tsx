import type { Course } from '../types/api';
import CourseRow from './CourseRow';

interface CourseTableProps {
  courses: Course[];
  loading: boolean;
}

const CourseTable = ({ courses, loading }: CourseTableProps) => {
  if (loading && courses.length === 0) {
    return (
      <div className="flex justify-center items-center py-12">
        <div className="loading loading-spinner loading-lg text-primary"></div>
      </div>
    );
  }

  if (courses.length === 0) {
    return (
      <div className="text-center py-12 text-base-content/60">
        No courses found. Try adjusting your filters.
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <table className="w-full">
        <thead className="bg-base-200">
          <tr>
            <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer hover:bg-base-300 transition-colors group">
              <div className="flex items-center gap-2">
                Course Code
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer hover:bg-base-300 transition-colors group">
              <div className="flex items-center gap-2">
                Title
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer hover:bg-base-300 transition-colors group">
              <div className="flex items-center gap-2">
                Units
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer hover:bg-base-300 transition-colors group">
              <div className="flex items-center gap-2">
                GE Categories
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </th>
            <th className="py-3 px-4 text-left text-sm font-semibold cursor-pointer hover:bg-base-300 transition-colors group">
              <div className="flex items-center gap-2">
                Description
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth={1.5}
                  stroke="currentColor"
                  className="w-4 h-4 opacity-0 group-hover:opacity-50 transition-opacity"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M8.25 15L12 18.75 15.75 15m-7.5-6L12 5.25 15.75 9"
                  />
                </svg>
              </div>
            </th>
          </tr>
        </thead>
        <tbody>
          {courses.map((course, index) => (
            <CourseRow key={`${course.courseCode}-${index}`} course={course} />
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default CourseTable;
