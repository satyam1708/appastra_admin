// app/purchases/page.tsx - UPDATED
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchUserEnrollments } from '@/src/features/enrollments/enrollmentThunks';
import { Enrollment } from '@/src/types';
import Link from 'next/link';
import Image from 'next/image';

export default function PurchasesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { enrollments, loading, error } = useSelector((state: RootState) => state.enrollments);

  useEffect(() => {
    dispatch(fetchUserEnrollments());
  }, [dispatch]);

  if (loading) return <p className="text-center p-10">Loading your courses...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto max-w-6xl p-4">
      <h1 className="text-3xl font-bold mb-6 text-sky-900">My Courses</h1>
      {enrollments.length === 0 && !loading && (
        <p>You have not purchased any courses yet.</p>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrollments.map((enrollment: Enrollment) => (
          enrollment.course && (
            <Link 
              key={enrollment.id} 
              href={`/courses/${enrollment.course.isPaid ? 'paid-courses' : 'free-courses'}/${enrollment.course.slug}`}
              className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow duration-300 group"
            >
              <div className="relative h-48 w-full">
                <Image
                  src={enrollment.course.imageUrl || "/images/img1.png"}
                  alt={enrollment.course.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="p-5">
                <h3 className="text-lg font-semibold text-sky-900 mb-2 truncate">
                  {enrollment.course.name}
                </h3>
                <span className="w-full text-center px-4 py-2 block bg-blue-600 text-white text-sm rounded-full shadow-md hover:bg-blue-700 transition">
                  Go to Course
                </span>
              </div>
            </Link>
          )
        ))}
      </div>
    </div>
  );
}