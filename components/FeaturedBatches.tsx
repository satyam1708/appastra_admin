// components/FeaturedBatches.tsx
"use client";

import { useSelector, useDispatch } from "react-redux";
import { RootState, AppDispatch } from "@/src/store/store";
import BatchCard from "./BatchCard";
import { Course } from "@/src/types";
import { useEffect, useMemo } from "react";
import { fetchUserEnrollments } from "@/src/features/enrollments/enrollmentThunks";

export default function FeaturedBatches({ courses }: { courses: Course[] }) {
  const dispatch = useDispatch<AppDispatch>();
  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseGoal
  );
  
  // 👇 1. Get authentication and enrollment state
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const { enrollments } = useSelector((state: RootState) => state.enrollments);

  // 👇 2. Fetch enrollments if the user is logged in
  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchUserEnrollments());
    }
  }, [dispatch, isAuthenticated]);

  // 👇 3. Create an efficient lookup set for enrolled batch IDs
  const enrolledBatchIds = useMemo(() => 
    new Set(enrollments.map(e => e.batchId)),
    [enrollments]
  );

  const batchesToShow = selectedCourse
    ? selectedCourse.batches.map((batch) => ({
        batch,
        course: selectedCourse,
      }))
    : courses.flatMap((course) =>
        course.batches.map((batch) => ({ batch, course }))
      );

  const title = selectedCourse
    ? `Batches for ${selectedCourse.name}`
    : "All Batches";

  return (
    <section className="max-w-7xl mx-auto px-6 py-16">
      <h2 className="text-3xl font-extrabold text-center text-sky-900 mb-10 drop-shadow-md">
        ⭐ {title}
      </h2>
      <div className="grid md:grid-cols-3 sm:grid-cols-2 gap-8">
        {batchesToShow.map(({ batch, course }) => (
          <BatchCard 
            key={batch.id} 
            batch={batch} 
            course={course}
            isEnrolled={enrolledBatchIds.has(batch.id)} // 👈 4. Pass the prop
          />
        ))}
      </div>
    </section>
  );
}