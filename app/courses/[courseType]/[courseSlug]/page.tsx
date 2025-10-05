// app/courses/[courseType]/[courseSlug]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchCourseBySlug } from "@/src/features/courses/coursesThunks";
import { enrollInCourse } from "@/src/features/enrollments/enrollmentThunks";
import Image from "next/image";
import { Video, BookOpen, Layers } from "lucide-react";
import { Course, Batch } from "@/src/types";
import PurchaseModal from "@/components/PurchaseModal";
import { openAuthModal } from "@/src/features/auth/authSlice";
import { fetchUserEnrollments } from "@/src/features/enrollments/enrollmentThunks";
import { useMemo } from "react";
import Link from "next/link";
import EnrolledCourseView from "@/components/EnrolledCourseView";

// CORRECTED: Define params as a plain object
interface PageProps {
  params: { courseSlug: string };
}

type Tab = "description" | "classes" | "notes" | "tests" | "batches";

// CORRECTED: Destructure params directly
export default function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = params;
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading, error } = useSelector(
    (state: RootState) => state.courses
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false);
  const [selectedBatch, setSelectedBatch] = useState<Batch | null>(null);
  const { enrollments } = useSelector((state: RootState) => state.enrollments);
  const [activeTab, setActiveTab] = useState<Tab>("batches");

  useEffect(() => {
    if (courseSlug) {
      dispatch(fetchCourseBySlug(courseSlug as string));
    }
    if (isAuthenticated) {
      dispatch(fetchUserEnrollments());
    }
  }, [dispatch, courseSlug, isAuthenticated]);

  const enrolledBatch = useMemo(() => {
    if (!currentCourse || !enrollments || enrollments.length === 0) {
      return null;
    }
    const courseBatchIds = new Set(currentCourse.batches.map((b) => b.id));
    const enrolledCourseBatch = enrollments.find(
      (e) => e.batchId && courseBatchIds.has(e.batchId)
    );

    if (!enrolledCourseBatch) return null;

    return currentCourse.batches.find(
      (b) => b.id === enrolledCourseBatch.batchId
    );
  }, [currentCourse, enrollments]);

  const isEnrolled = !!enrolledBatch;

  const handleEnrollClick = (batch: Batch) => {
    if (!isAuthenticated) {
      dispatch(openAuthModal());
      return;
    }
    if (currentCourse) {
      if (batch.isPaid) {
        setSelectedBatch(batch);
        setPurchaseModalOpen(true);
      } else {
        dispatch(
          enrollInCourse({ courseId: currentCourse.id, batchId: batch.id })
        )
          .unwrap()
          .then(() => alert("Successfully enrolled!"))
          .catch((err) => alert(`Enrollment failed: ${err}`));
      }
    }
  };

  const handleCloseModal = () => {
    setPurchaseModalOpen(false);
    setSelectedBatch(null);
  };

  const TabButton = ({
    tabName,
    label,
    icon: Icon,
  }: {
    tabName: Tab;
    label: string;
    icon: React.ElementType;
  }) => (
    <button
      onClick={() => setActiveTab(tabName)}
      className={`flex items-center gap-2 px-4 py-2 text-sm font-medium rounded-md transition-colors ${
        activeTab === tabName
          ? "bg-blue-600 text-white"
          : "text-gray-600 hover:bg-gray-100"
      }`}
    >
      <Icon size={16} />
      {label}
    </button>
  );

  const renderContent = () => {
    if (enrolledBatch) {
      return <EnrolledCourseView batch={enrolledBatch} />;
    }
    switch (activeTab) {
      case "batches":
        return (
          <div className="space-y-4">
            {currentCourse?.batches?.map((batch: Batch) => (
              <div
                key={batch.id}
                className="p-4 bg-gray-50 rounded-lg border flex justify-between items-center"
              >
                <div>
                  <h3 className="font-semibold text-lg">{batch.name}</h3>
                  <p className="text-sm text-gray-600">
                    Starts: {new Date(batch.startDate).toLocaleDateString()}
                  </p>
                </div>
                <button
                  onClick={() => handleEnrollClick(batch)}
                  className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
                >
                  Enroll Now
                </button>
              </div>
            ))}
            {(!currentCourse?.batches ||
              currentCourse.batches.length === 0) && (
              <p>No specific batches available for this course.</p>
            )}
          </div>
        );
      case "description":
        return (
          <p className="text-gray-700 leading-relaxed">
            {currentCourse?.description}
          </p>
        );
      default:
        return null;
    }
  };

  if (loading) return <div className="text-center p-10">Loading Course...</div>;
  if (error)
    return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  if (!currentCourse)
    return <div className="text-center p-10">Course not found.</div>;

  const hasBatches = currentCourse.batches && currentCourse.batches.length > 0;
  const mainEnrollBatch = hasBatches ? currentCourse.batches[0] : null;

  return (
    <>
      {isPurchaseModalOpen && selectedBatch && currentCourse && (
        <PurchaseModal
          course={currentCourse}
          batch={selectedBatch}
          onClose={handleCloseModal}
        />
      )}
      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-sky-900 mb-2">
              {currentCourse.name}
            </h1>
            <p className="text-gray-500 mb-6">
              By {currentCourse.teacher?.name || "AppAstra"}
            </p>
            {!isEnrolled && (
              <div className="flex space-x-2 border-b mb-6">
                <TabButton tabName="batches" label="Batches" icon={Layers} />
                <TabButton
                  tabName="description"
                  label="Description"
                  icon={BookOpen}
                />
                <TabButton tabName="classes" label="Classes" icon={Video} />
              </div>
            )}
            <div className="p-4 bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative w-full h-52 rounded-lg shadow-lg overflow-hidden mb-6">
                <Image
                  src={
                    mainEnrollBatch?.imageUrl ||
                    currentCourse.imageUrl ||
                    "/images/img1.png"
                  }
                  alt={currentCourse.name}
                  fill
                  className="object-cover"
                />
              </div>
              <div className="bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-3xl font-bold text-blue-600 mb-4">
                  {mainEnrollBatch?.isPaid
                    ? `₹${mainEnrollBatch.price}`
                    : "Free"}
                </h2>
                {isEnrolled ? (
                  <Link
                    href="#course-content"
                    className="w-full text-center block px-6 py-3 bg-green-600 text-white font-semibold rounded-md hover:bg-green-700 transition"
                  >
                    Go to Course Content
                  </Link>
                ) : (
                  <button
                    onClick={() =>
                      mainEnrollBatch && handleEnrollClick(mainEnrollBatch)
                    }
                    disabled={!mainEnrollBatch}
                    className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    {mainEnrollBatch?.isPaid ? "Buy Now" : "Enroll for Free"}
                  </button>
                )}
                {!hasBatches && (
                  <p className="text-xs text-center text-red-500 mt-2">
                    No batches available for enrollment.
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
