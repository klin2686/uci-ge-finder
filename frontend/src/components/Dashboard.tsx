import { useState, useEffect, useCallback } from 'react';
import type { Course, GECategory } from '../types/course';
import { fetchCourses, ApiError } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import GESelector from './GESelector';
import CourseTable from './CourseTable';
import SearchIcon from '../icons/SearchIcon';
import { MoonIcon, SunIcon } from '../icons/DarkModeToggle';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [category1, setCategory1] = useState<GECategory | null>(null);
  const [category2, setCategory2] = useState<GECategory | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [retryCountdown, setRetryCountdown] = useState<number | null>(null);
  const [fetchKey, setFetchKey] = useState(0);
  const [searchQuery, setSearchQuery] = useState('');

  const loadCourses = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    setRetryCountdown(null);
    try {
      const data = await fetchCourses({ category1, category2 });
      setCourses(data.courses);
    } catch (err) {
      console.error('Error fetching courses:', err);
      if (err instanceof ApiError && err.status === 429) {
        setRetryCountdown(5);
      } else {
        setError('Failed to load courses. Please try again.');
      }
      setCourses([]);
    } finally {
      setIsLoading(false);
    }
  }, [category1, category2]);

  useEffect(() => {
    loadCourses();
  }, [loadCourses, fetchKey]);

  // Countdown: tick down every second, retry when it reaches 0
  useEffect(() => {
    if (retryCountdown === null) return;
    if (retryCountdown === 0) {
      setFetchKey((k) => k + 1);
      return;
    }
    const timer = setTimeout(() => setRetryCountdown((c) => c! - 1), 1000);
    return () => clearTimeout(timer);
  }, [retryCountdown]);

  // Filter courses by search query
  const filteredCourses = courses.filter((course) => {
    if (!searchQuery) return true;
    const query = searchQuery.toLowerCase();
    return (
      course.courseCode.toLowerCase().includes(query) ||
      course.courseTitle.toLowerCase().includes(query) ||
      course.description.toLowerCase().includes(query)
    );
  });

  return (
    <div className="bg-[#f8f8f8] dark:bg-gray-900 flex flex-col h-screen overflow-hidden">
      {/* Title Bar */}
      <div className="bg-white dark:bg-gray-800 border-b-2 border-[#ebebeb] dark:border-gray-700 h-[60px] w-full shrink-0">
        <div className="flex gap-2.5 h-[60px] items-center justify-center px-[50px] py-2.5 w-full">
          <p className="font-inter font-semibold text-[24px] text-black dark:text-white">
            UCI GE Finder
          </p>
          <div className="flex-grow" />
          <button
            onClick={toggleTheme}
            className="w-[26px] h-[26px] text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Toggle dark mode"
          >
            {theme === 'dark' ? <SunIcon /> : <MoonIcon />}
          </button>
        </div>
      </div>

      {/* Content area with consistent padding */}
      <div className="flex-grow flex flex-col items-center p-[30px] overflow-hidden">
        {/* Table Container */}
        <div className="flex-grow bg-white dark:bg-gray-800 border border-[#ececec] dark:border-[#4e5562] w-full rounded-[10px] flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="border-b border-[#ebebeb] dark:border-gray-600 box-border flex gap-4 h-[80px] items-center px-[30px] py-5 w-full shrink-0">
            <SearchIcon className="shrink-0 text-[#aaaaaa] dark:text-gray-400 hidden md:block" />
            <input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-inter text-[20px] text-black dark:text-white placeholder:text-[#aaaaaa] dark:placeholder:text-gray-400 bg-transparent outline-none min-w-0 flex-1"
            />
            <div className="flex gap-4 shrink min-w-0">
              <GESelector
                value={category1}
                onChange={setCategory1}
                placeholder="Select GE Category"
              />
              <GESelector
                value={category2}
                onChange={setCategory2}
                placeholder="Select GE Category"
              />
            </div>
          </div>

          {/* Course Table */}
          <div className="flex-grow overflow-hidden">
            <CourseTable
              courses={filteredCourses}
              isLoading={isLoading}
              error={retryCountdown !== null ? `Too many requests. Retrying in ${retryCountdown}s...` : error}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
