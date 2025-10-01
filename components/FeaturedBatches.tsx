// components/FeaturedBatches.tsx
"use client";

import { useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import BatchCard from "./BatchCard";
import { Course, Batch } from "@/src/types";

export default function FeaturedBatches({ courses }: { courses: Course[] }) {
  const { selectedCourse } = useSelector(
    (state: RootState) => state.courseGoal
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
          <BatchCard key={batch.id} batch={batch} course={course} />
        ))}
      </div>
    </section>
  );
}