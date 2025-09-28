// app/courses/[courseType]/[courseSlug]/page.tsx
"use client";

import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchCourseBySlug } from "@/src/features/courses/coursesThunks";
import Image from "next/image";
import PaymentButton from "@/components/PaymentButton";

interface PageProps {
  params: { courseSlug: string };
}

export default function CourseDetailPage({ params }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading, error } = useSelector((state: RootState) => state.courses);

  useEffect(() => {
    if (params.courseSlug) {
      dispatch(fetchCourseBySlug(params.courseSlug));
    }
  }, [dispatch, params.courseSlug]);

  const handlePaymentSuccess = (response: any) => {
    console.log("Payment successful:", response);
    // Here you would typically verify the payment on your backend
    alert("Payment successful!");
  };

  if (loading) return <div className="text-center p-10">Loading Course...</div>;
  if (error) return <div className="text-center p-10 text-red-500">Error: {error}</div>;
  if (!currentCourse) return <div className="text-center p-10">Course not found.</div>;

  return (
    <div className="container mx-auto p-4 md:p-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {/* Left Column: Image and Price */}
        <div className="md:col-span-1">
          <div className="relative w-full h-64 rounded-lg shadow-lg overflow-hidden mb-6">
            <Image
              src={currentCourse.imageUrl || "/images/img1.png"}
              alt={currentCourse.name}
              fill
              className="object-cover"
            />
          </div>
          <div className="bg-white p-6 rounded-lg shadow-md">
            <h2 className="text-3xl font-bold text-blue-600 mb-4">
              {currentCourse.isPaid ? `₹${currentCourse.price}` : "Free"}
            </h2>
            {currentCourse.isPaid && currentCourse.price && (
              <PaymentButton
                amount={currentCourse.price * 100} // Convert to paise
                onSuccess={handlePaymentSuccess}
              />
            )}
             {!currentCourse.isPaid && (
              <button className="w-full px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition">
                Enroll for Free
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Details and Subjects */}
        <div className="md:col-span-2">
          <h1 className="text-4xl font-extrabold text-sky-900 mb-4">{currentCourse.name}</h1>
          <p className="text-gray-600 text-lg mb-8">
            {currentCourse.description}
          </p>

          <h2 className="text-2xl font-bold text-sky-800 mb-4 border-b-2 pb-2">Course Content</h2>
          <div className="space-y-4">
            {currentCourse.subjects?.map(subject => (
              <div key={subject.id} className="p-4 border rounded-lg bg-gray-50">
                <h3 className="text-xl font-semibold">{subject.name}</h3>
                <ul className="list-disc list-inside mt-2 ml-4 text-gray-700">
                  {subject.classes?.map(classItem => (
                    <li key={classItem.id}>{classItem.title}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}