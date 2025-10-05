// app/courses/[courseType]/page.tsx
"use client";

import { useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "../../../src/store/store";
import { fetchCourses } from "../../../src/features/courses/coursesThunks";
import { fetchUserEnrollments } from "../../../src/features/enrollments/enrollmentThunks";
import BatchCard from "../../../components/BatchCard";
import { Course, Batch } from "../../../src/types";

// CORRECTED: Define params as a plain object
interface PageProps {
  params: { courseType: "paid-courses" | "free-courses" };
}

// CORRECTED: Destructure params directly
export default function CoursesPage({ params }: PageProps) {
  const { courseType } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { enrollments } = useSelector((state: RootState) => state.enrollments);
  const { courses, loading, error } = useSelector(
    (state: RootState) => state.courses
  );
  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseGoal
  );

  useEffect(() => {
    if (courses.length === 0) {
      dispatch(fetchCourses());
    }
    if (isAuthenticated) {
      dispatch(fetchUserEnrollments());
    }
  }, [dispatch, courses.length, isAuthenticated]);

  const enrolledBatchIds = useMemo(
    () => new Set(enrollments.map((e) => e.batchId)),
    [enrollments]
  );

  const isPaidPage = courseType === "paid-courses";

  const renderContent = () => {
    if (loading) return <p className="text-center p-10">Loading...</p>;
    if (error) return <p className="text-center p-10 text-red-500">{error}</p>;

    if (selectedCourse) {
      const batchesToShow = selectedCourse.batches.filter((batch) => {
        return isPaidPage ? batch.isPaid : !batch.isPaid;
      });

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {batchesToShow.map((batch: Batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              course={selectedCourse}
              isEnrolled={enrolledBatchIds.has(batch.id)}
            />
          ))}
        </div>
      );
    } else {
      const allBatches = courses.flatMap(
        (course) => course.batches.map((batch) => ({ ...batch, course }))
      );

      const filteredBatches = allBatches.filter((batch) =>
        isPaidPage ? batch.isPaid : !batch.isPaid
      );

      return (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredBatches.map((batch) => (
            <BatchCard
              key={batch.id}
              batch={batch}
              course={batch.course}
              isEnrolled={enrolledBatchIds.has(batch.id)}
            />
          ))}
        </div>
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-sky-900">
        {selectedCourse
          ? `${isPaidPage ? "Paid" : "Free"} Batches for ${selectedCourse.name}`
          : isPaidPage
            ? "All Paid Batches"
            : "All Free Batches"}
      </h1>
      {renderContent()}
    </div>
  );
}