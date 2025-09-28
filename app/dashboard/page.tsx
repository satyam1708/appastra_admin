// app/dashboard/page.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchUserEnrollments } from '@/src/features/enrollments/enrollmentThunks';
import { Enrollment } from '@/src/types';
import Link from 'next/link';

export default function DashboardPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments, loading, error } = useSelector((state: RootState) => state.enrollments);

  useEffect(() => {
    dispatch(fetchUserEnrollments());
  }, [dispatch]);

  if (loading) return <p>Loading your dashboard...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Your Dashboard</h1>
      <h2 className="text-2xl font-semibold mb-4">Enrolled Courses</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: Enrollment) => (
          // @ts-ignore
          <div key={enrollment.id} className="p-4 border rounded-lg bg-white shadow-sm">
            {/* @ts-ignore */}
            <h3 className="text-xl font-semibold">{enrollment.course.name}</h3>
            {/* @ts-ignore */}
            <Link href={`/courses/paid-courses/${enrollment.courseId}`} className="text-blue-600 hover:underline">
              Go to course
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}