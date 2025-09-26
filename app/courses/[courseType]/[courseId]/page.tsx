// app/courses/[courseId]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchSubjectsByCourse } from "@/src/features/subjects/subjectsThunks";
import { fetchCourseProgress } from "@/src/features/progress/progressThunks";

interface PageProps {
  params: { courseId: string };
}

export default function CourseDetailPage({ params }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { subjectsByCourse, loading } = useSelector((state: RootState) => state.subjects);
  const { progressByCourse } = useSelector((state: RootState) => state.progress);

  const subjects = subjectsByCourse[params.courseId] || [];
  const courseProgress = progressByCourse[params.courseId];

  useEffect(() => {
    dispatch(fetchSubjectsByCourse(params.courseId));
    dispatch(fetchCourseProgress(params.courseId));
  }, [dispatch, params.courseId]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Course Details</h1>
      {courseProgress && (
        <p className="mb-6 text-lg">
            Your Progress: {courseProgress.percentage.toFixed(2)}%
        </p>
      )}

      {loading ? <p>Loading subjects...</p> : (
        <div className="space-y-4">
            {subjects.map(subject => (
                <div key={subject.id} className="p-4 border rounded-lg">
                    <h2 className="text-2xl font-semibold">{subject.name}</h2>
                    {/* You would then map over subject.classes here */}
                </div>
            ))}
        </div>
      )}
    </div>
  );
}