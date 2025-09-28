// components/FeaturedCourses.tsx
import CourseCard from "./CourseCard";
import { Course } from "@/src/types";

export default function FeaturedCourses({ courses }: { courses: Course[] }) {
  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-center text-sky-900 mb-10 drop-shadow-md">
        ⭐ Featured Courses
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {courses.map((course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </section>
  );
}