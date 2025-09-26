// app/courses/[courseType]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchCourses } from "@/src/features/courses/coursesThunks";
import CourseCard from "@/components/CourseCard";
import { Course } from "@/src/types";

interface PageProps {
  params: { courseType: 'paid-courses' | 'free-courses' };
}

export default function CoursesPage({ params }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const isPaidPage = params.courseType === 'paid-courses';
  const filteredCourses = courses.filter(course => course.isPaid === isPaidPage);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {isPaidPage ? "Paid Courses" : "Free Courses"}
      </h1>
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredCourses.map((course: Course) => (
          <CourseCard key={course.id} course={course} />
        ))}
      </div>
    </div>
  );
}