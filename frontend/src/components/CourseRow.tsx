import type { Course } from '../types/api';

interface CourseRowProps {
  course: Course;
}

const CourseRow = ({ course }: CourseRowProps) => {
  return (
    <tr className="border-b border-base-300 hover:bg-base-200/50 transition-colors">
      <td className="py-4 px-4 text-sm font-medium whitespace-nowrap">
        {course.courseCode}
      </td>
      <td className="py-4 px-4 text-sm font-medium">
        {course.courseTitle}
      </td>
      <td className="py-4 px-4 text-sm">
        {course.units}
      </td>
      <td className="py-4 px-4 text-sm">
        {course.geCategories}
      </td>
      <td className="py-4 px-4 text-sm text-base-content/70">
        {course.description}
      </td>
    </tr>
  );
};

export default CourseRow;
