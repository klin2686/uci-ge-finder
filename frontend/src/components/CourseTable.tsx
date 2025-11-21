import type { Course } from '../types/course';
import SortArrows from '../icons/SortArrows';

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

const MIN_TABLE_WIDTH = 1000; // Minimum width before horizontal scroll kicks in
const GRID_COLUMNS = '173px 276px 115px 189px 1fr';

export default function CourseTable({ courses, isLoading, error }: CourseTableProps) {
  return (
    <div className="flex flex-col overflow-hidden w-full h-full">
      {/* Scrollable table area (horizontal + vertical) */}
      <div className="flex-1 overflow-auto">
        <div style={{ minWidth: MIN_TABLE_WIDTH }}>
          {/* Table Headers */}
          <div
            className="bg-[#f8f8f8] dark:bg-gray-700 border-b border-[#ebebeb] dark:border-gray-600 h-[53px] sticky top-0 z-10"
            style={{
              display: 'grid',
              gridTemplateColumns: GRID_COLUMNS,
            }}
          >
            <div className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Course Code
              </p>
              <div className="flex-grow" />
              <SortArrows className="text-[#7d7d7d] dark:text-gray-300 cursor-pointer" />
            </div>

            <div className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Course Title
              </p>
              <div className="flex-grow" />
              <SortArrows className="text-[#7d7d7d] dark:text-gray-300 cursor-pointer" />
            </div>

            <div className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Units
              </p>
              <div className="flex-grow" />
              <SortArrows className="text-[#7d7d7d] dark:text-gray-300 cursor-pointer" />
            </div>

            <div className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                GE Categories
              </p>
              <div className="flex-grow" />
              <SortArrows className="text-[#7d7d7d] dark:text-gray-300 cursor-pointer" />
            </div>

            <div className="h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Description
              </p>
              <div className="flex-grow" />
              <SortArrows className="text-[#7d7d7d] dark:text-gray-300 cursor-pointer" />
            </div>
          </div>

          {/* Course List */}
          <div>
            {isLoading ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">Loading courses...</p>
              </div>
            ) : error ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-red-500 dark:text-red-400 text-lg">{error}</p>
              </div>
            ) : courses.length === 0 ? (
              <div className="flex items-center justify-center py-20">
                <p className="text-gray-500 dark:text-gray-400 text-lg">
                  No courses found
                </p>
              </div>
            ) : (
              courses.map((course, index) => (
                <div
                  key={`${course.courseCode}-${index}`}
                  className="border-b border-[#ebebeb] dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: GRID_COLUMNS,
                  }}
                >
                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <p className="font-inter font-medium text-[14px] leading-5 text-black dark:text-white">
                      {course.courseCode}
                    </p>
                  </div>

                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <p className="font-inter text-[14px] leading-5 text-black dark:text-white">
                      {course.courseTitle}
                    </p>
                  </div>

                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <p className="font-inter text-[14px] leading-5 text-black dark:text-white">
                      {course.units}
                    </p>
                  </div>

                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <p className="font-inter text-[14px] leading-5 text-black dark:text-white">
                      {course.geCategories}
                    </p>
                  </div>

                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <p className="font-inter text-[14px] leading-5 text-black dark:text-white line-clamp-3">
                      {course.description}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="border-t border-[#ebebeb] dark:border-gray-600 h-[22px] shrink-0 flex items-center px-[25px]">
        <p className="font-inter font-normal text-[12px] text-[#aaaaaa] dark:text-gray-400">
          Showing {courses.length} {courses.length === 1 ? 'course' : 'courses'}
        </p>
      </div>
    </div>
  );
}
