import { useState, useMemo, useEffect, useLayoutEffect, useRef } from 'react';
import type { Course } from '../types/course';
import SortArrows from '../icons/SortArrows';

interface CourseTableProps {
  courses: Course[];
  isLoading: boolean;
  error: string | null;
}

type SortColumn = 'courseCode' | 'courseTitle' | 'units' | 'geCategories';
type SortDirection = 'asc' | 'desc';

const MIN_TABLE_WIDTH = 1000; // Minimum width before horizontal scroll kicks in
const GRID_COLUMNS = '173px 276px 115px 189px 1fr';

export default function CourseTable({ courses, isLoading, error }: CourseTableProps) {
  const [sortColumn, setSortColumn] = useState<SortColumn | null>(null);
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  const [popover, setPopover] = useState<{ course: Course; anchorTop: number; anchorBottom: number; left: number } | null>(null);
  const [computedTop, setComputedTop] = useState<number | null>(null);
  const popoverRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!popover) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setPopover(null);
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [popover]);

  useLayoutEffect(() => {
    if (!popover || !popoverRef.current) {
      setComputedTop(null);
      return;
    }
    const height = popoverRef.current.offsetHeight;
    const MARGIN = 8;
    let top = popover.anchorTop;
    if (top + height > window.innerHeight - MARGIN) {
      top = Math.max(MARGIN, popover.anchorBottom - height);
    }
    setComputedTop(top);
  }, [popover]);

  const handleSort = (column: SortColumn) => {
    if (sortColumn === column) {
      // Cycle: asc -> desc -> clear
      if (sortDirection === 'asc') {
        setSortDirection('desc');
      } else {
        setSortColumn(null);
        setSortDirection('asc');
      }
    } else {
      // New column, start with ascending
      setSortColumn(column);
      setSortDirection('asc');
    }
  };

  const sortedCourses = useMemo(() => {
    if (!sortColumn) return courses;

    return [...courses].sort((a, b) => {
      const aVal = a[sortColumn];
      const bVal = b[sortColumn];

      let comparison = 0;
      if (sortColumn === 'units') {
        // Parse units as numbers for proper sorting
        const aNum = parseFloat(aVal) || 0;
        const bNum = parseFloat(bVal) || 0;
        comparison = aNum - bNum;
      } else {
        comparison = aVal.localeCompare(bVal);
      }

      return sortDirection === 'asc' ? comparison : -comparison;
    });
  }, [courses, sortColumn, sortDirection]);

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
            <div
              className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleSort('courseCode')}
            >
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Course Code
              </p>
              <div className="flex-grow" />
              <SortArrows
                className="text-[#7d7d7d] dark:text-gray-300"
                activeDirection={sortColumn === 'courseCode' ? sortDirection : null}
              />
            </div>

            <div
              className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleSort('courseTitle')}
            >
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Course Title
              </p>
              <div className="flex-grow" />
              <SortArrows
                className="text-[#7d7d7d] dark:text-gray-300"
                activeDirection={sortColumn === 'courseTitle' ? sortDirection : null}
              />
            </div>

            <div
              className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleSort('units')}
            >
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Units
              </p>
              <div className="flex-grow" />
              <SortArrows
                className="text-[#7d7d7d] dark:text-gray-300"
                activeDirection={sortColumn === 'units' ? sortDirection : null}
              />
            </div>

            <div
              className="border-r border-[#ebebeb] dark:border-gray-600 h-full flex items-center px-5 py-3.5 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-600"
              onClick={() => handleSort('geCategories')}
            >
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                GE Categories
              </p>
              <div className="flex-grow" />
              <SortArrows
                className="text-[#7d7d7d] dark:text-gray-300"
                activeDirection={sortColumn === 'geCategories' ? sortDirection : null}
              />
            </div>

            <div className="h-full flex items-center px-5 py-3.5">
              <p className="font-inter font-medium text-[16px] leading-6 text-[#7d7d7d] dark:text-gray-300">
                Description
              </p>
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
              sortedCourses.map((course, index) => (
                <div
                  key={`${course.courseCode}-${index}`}
                  className="border-b border-[#ebebeb] dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700/50"
                  style={{
                    display: 'grid',
                    gridTemplateColumns: GRID_COLUMNS,
                  }}
                >
                  <div className="border-r border-[#ebebeb] dark:border-gray-600 px-5 py-4 flex items-center">
                    <button
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        setPopover({ course, anchorTop: rect.top, anchorBottom: rect.bottom, left: rect.right + 8 });
                      }}
                      className="font-inter font-medium text-[14px] leading-5 text-blue-600 dark:text-blue-400 underline underline-offset-2 hover:text-blue-800 dark:hover:text-blue-300 cursor-pointer text-left"
                    >
                      {course.courseCode}
                    </button>
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

      {/* Course detail popover */}
      {popover && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setPopover(null)} />
          <div
            ref={popoverRef}
            className="fixed z-50 bg-white dark:bg-gray-800 rounded-lg shadow-xl border border-[#ebebeb] dark:border-gray-600 w-[345px] p-4"
            style={{
              top: computedTop ?? popover.anchorTop,
              left: popover.left,
              visibility: computedTop !== null ? 'visible' : 'hidden',
            }}
          >
            <div className="flex items-start justify-between mb-4">
              <h2 className="font-inter font-semibold text-[16px] text-black dark:text-white">
                {popover.course.courseCode}
              </h2>
              <button
                onClick={() => setPopover(null)}
                className="ml-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-lg leading-none"
                aria-label="Close"
              >
                ✕
              </button>
            </div>

            <div className="mb-3">
              <p className="font-inter font-medium text-[13px] text-[#7d7d7d] dark:text-gray-400 mb-1">
                Prerequisites
              </p>
              <p className="font-inter text-[13px] leading-5 text-black dark:text-white">
                {popover.course.prerequisites || 'None'}
              </p>
            </div>

            <div>
              <p className="font-inter font-medium text-[13px] text-[#7d7d7d] dark:text-gray-400 mb-1">
                Requirements
              </p>
              <p className="font-inter text-[13px] leading-5 text-black dark:text-white">
                {popover.course.restrictions || 'None'}
              </p>
            </div>
          </div>
        </>
      )}

      {/* Footer */}
      <div className="border-t border-[#ebebeb] dark:border-gray-600 h-[22px] shrink-0 flex items-center justify-between px-[25px]">
        <p className="font-inter font-normal text-[14px] text-[#aaaaaa] dark:text-gray-400">
          Showing {courses.length} {courses.length === 1 ? 'result' : 'results'}
        </p>
        <p className="font-inter font-normal text-[14px] text-[#aaaaaa] dark:text-gray-400">
          Data from{' '}
          <a
            href="https://icssc.link/about-anteaterapi"
            target="_blank"
            rel="noopener noreferrer"
            className="underline hover:text-[#888888] dark:hover:text-gray-300"
          >
            Anteater API
          </a>
        </p>
      </div>
    </div>
  );
}
