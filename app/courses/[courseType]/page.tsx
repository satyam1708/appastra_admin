// app/courses/[courseType]/page.tsx
"use client";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchCourses } from "@/src/features/courses/coursesThunks";
import CourseCard from "@/components/CourseCard";
import BatchCard from "@/components/BatchCard";
import { Course, Batch } from "@/src/types";

interface PageProps {
  params: Promise<{ courseType: 'paid-courses' | 'free-courses' }>;
}

export default function CoursesPage({ params }: PageProps) {
  const { courseType } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );
  const { selectedCourse } = useSelector((state: RootState) => state.courseGoal);

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, courses.length]);

  const isPaidPage = courseType === 'paid-courses';

  const renderContent = () => {
    if (loading) return <p>Loading...</p>;
    if (error) return <p className="text-red-500">{error}</p>;

    if (selectedCourse) {
      const batchesToShow = selectedCourse.batches.filter(batch => {
        // This assumes free courses have no price and paid courses have a price > 0
        return isPaidPage ? (selectedCourse.price ?? 0) > 0 : (selectedCourse.price ?? 0) === 0;
      });

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {batchesToShow.map((batch: Batch) => (
            <BatchCard key={batch.id} batch={batch} course={selectedCourse} />
          ))}
        </div>
      );
    } else {
      const filteredCourses = courses.filter(course => course.isPaid === isPaidPage);
      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredCourses.map((course: Course) => (
            <CourseCard key={course.id} course={course} />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">
        {selectedCourse
          ? `${isPaidPage ? "Paid" : "Free"} Batches for ${selectedCourse.name}`
          : isPaidPage ? "Paid Courses" : "Free Courses"}
      </h1>
      {renderContent()}
    </div>
  );
}