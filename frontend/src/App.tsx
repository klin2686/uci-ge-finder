import { useState, useEffect } from 'react';
import type { GECategory, Course } from './types/api';
import { getCourses } from './services/api';
import ThemeToggle from './components/ThemeToggle';
import GESelector from './components/GESelector';
import CourseTable from './components/CourseTable';
import LoadMoreButton from './components/LoadMoreButton';

function App() {
  const [category1, setCategory1] = useState<GECategory | null>(null);
  const [category2, setCategory2] = useState<GECategory | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(false);
  const [nextCursor, setNextCursor] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const COURSES_PER_PAGE = 25;

  const fetchCourses = async (cursor?: string) => {
    try {
      setLoading(true);
      setError(null);

      const params: any = {
        take: COURSES_PER_PAGE,
      };

      if (category1) params.category1 = category1;
      if (category2) params.category2 = category2;
      if (cursor) params.cursor = cursor;

      const response = await getCourses(params);

      console.log('API Response:', response);
      console.log('Courses:', response.courses);

      if (cursor) {
        // Append to existing courses (Load More)
        setCourses((prev) => [...prev, ...response.courses]);
      } else {
        // Replace courses (new filter selection)
        setCourses(response.courses);
      }

      setNextCursor(response.nextCursor);
      setHasMore(response.nextCursor !== null);
    } catch (err) {
      setError('Failed to fetch courses. Please make sure the backend is running.');
      console.error('Error fetching courses:', err);
    } finally {
      setLoading(false);
    }
  };

  // Fetch courses when filters change
  useEffect(() => {
    setCourses([]);
    setNextCursor(null);
    setHasMore(true);
    fetchCourses();
  }, [category1, category2]);

  const handleLoadMore = () => {
    if (nextCursor && !loading) {
      fetchCourses(nextCursor);
    }
  };

  return (
    <div className="min-h-screen bg-base-100 text-base-content">
      {/* Header */}
      <header className="bg-base-200 border-b border-base-300 shadow-sm">
        <div className="container mx-auto px-6 py-5">
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-semibold text-neutral dark:text-neutral-content">UCI GE Overlap Finder</h1>
            <ThemeToggle />
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-8">
        {/* Filters */}
        <div className="mb-8 p-6 bg-base-200/50 rounded-lg">
          <GESelector
            category1={category1}
            category2={category2}
            onCategory1Change={setCategory1}
            onCategory2Change={setCategory2}
          />
        </div>

        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-error/10 border border-error/20 rounded-lg text-error">
            {error}
          </div>
        )}

        {/* Courses Table */}
        <div className="bg-base-100 rounded-lg border border-base-300 overflow-hidden">
          <CourseTable courses={courses} loading={loading} />
        </div>

        {/* Load More Button */}
        <LoadMoreButton
          onClick={handleLoadMore}
          loading={loading}
          hasMore={hasMore}
        />
      </main>
    </div>
  );
}

export default App;
