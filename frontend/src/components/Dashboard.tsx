import { useState, useEffect } from 'react';
import type { Course, GECategory } from '../types/course';
import { fetchCourses } from '../services/api';
import { useTheme } from '../contexts/ThemeContext';
import GESelector from './GESelector';
import CourseTable from './CourseTable';
import SearchIcon from '../icons/SearchIcon';
import { MoonIcon, SunIcon } from '../icons/DarkModeToggle';

export default function Dashboard() {
  const { theme, toggleTheme } = useTheme();
  const [filter1, setFilter1] = useState<GECategory | null>(null);
  const [filter2, setFilter2] = useState<GECategory | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  // Fetch courses when filters change
  useEffect(() => {
    const loadCourses = async () => {
      if (!filter1 && !filter2) {
        setCourses([]);
        return;
      }

      setIsLoading(true);
      try {
        const data = await fetchCourses({ filter1, filter2 });
        setCourses(data.courses);
      } catch (error) {
        console.error('Error fetching courses:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadCourses();
  }, [filter1, filter2]);

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
            UCI GE Overlap Finder
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
      <div className="flex-grow flex flex-col items-center p-[50px] overflow-hidden">
        {/* Table Container */}
        <div className="flex-grow bg-white dark:bg-gray-800 border border-[#ececec] dark:border-[#4e5562] w-full rounded-[10px] flex flex-col overflow-hidden">
          {/* Search Bar */}
          <div className="border-b border-[#ebebeb] dark:border-gray-600 box-border flex gap-[30px] h-[80px] items-center justify-center px-[30px] py-5 w-full shrink-0">
            <SearchIcon className="text-[#aaaaaa] dark:text-gray-400" />
            <input
              type="text"
              placeholder="Search Courses"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="font-inter text-[20px] text-black dark:text-white placeholder:text-[#aaaaaa] dark:placeholder:text-gray-400 bg-transparent outline-none flex-shrink"
            />
            <div className="flex-grow" />
            <GESelector
              value={filter1}
              onChange={setFilter1}
              placeholder="Select GE Category"
            />
            <GESelector
              value={filter2}
              onChange={setFilter2}
              placeholder="Select GE Category"
            />
          </div>

          {/* Course Table */}
          <div className="flex-grow overflow-hidden">
            <CourseTable
              courses={filteredCourses}
              isLoading={isLoading}
            />
          </div>
        </div>
      </div>
    </div>
  );
}
