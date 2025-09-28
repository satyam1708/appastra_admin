// app/courses/[courseType]/[courseId]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchSubjectsByCourse } from "@/src/features/subjects/subjectsThunks";
import { fetchClassesBySubject } from "@/src/features/classes/classesThunks";
import { fetchCourseProgress } from "@/src/features/progress/progressThunks";
import { Subject, Class } from "@/src/types";

interface PageProps {
  params: { courseId: string };
}

export default function CourseDetailPage({ params }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { subjectsByCourse, loading: subjectsLoading } = useSelector((state: RootState) => state.subjects);
  const { classesBySubject, loading: classesLoading } = useSelector((state: RootState) => state.classes);
  const { progressByCourse } = useSelector((state: RootState) => state.progress);

  const subjects = subjectsByCourse[params.courseId] || [];
  const courseProgress = progressByCourse[params.courseId];

  useEffect(() => {
    dispatch(fetchSubjectsByCourse(params.courseId));
    dispatch(fetchCourseProgress(params.courseId));
  }, [dispatch, params.courseId]);

  useEffect(() => {
    subjects.forEach((subject: Subject) => {
      dispatch(fetchClassesBySubject(subject.id));
    });
  }, [dispatch, subjects]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-2">Course Details</h1>
      {courseProgress && (
        <p className="mb-6 text-lg">
            Your Progress: {courseProgress.percentage.toFixed(2)}%
        </p>
      )}

      {(subjectsLoading || classesLoading) ? <p>Loading course content...</p> : (
        <div className="space-y-6">
            {subjects.map((subject: Subject) => (
                <div key={subject.id} className="p-4 border rounded-lg bg-white shadow-sm">
                    <h2 className="text-2xl font-semibold mb-3">{subject.name}</h2>
                    <div className="space-y-2">
                      {(classesBySubject[subject.id] || []).map((classItem: Class) => (
                        <div key={classItem.id} className="p-3 border-l-4 border-blue-500 bg-gray-50 rounded-r-lg">
                          <h3 className="text-lg font-medium">{classItem.title}</h3>
                          <p className="text-gray-600">{classItem.description}</p>
                        </div>
                      ))}
                    </div>
                </div>
            ))}
        </div>
      )}
    </div>
  );
}