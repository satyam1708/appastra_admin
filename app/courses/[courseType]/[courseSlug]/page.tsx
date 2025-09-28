// app/courses/[courseType]/[courseSlug]/page.tsx
"use client";

import { useEffect, useState, use } from "react"; 
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchCourseBySlug } from "@/src/features/courses/coursesThunks";
import Image from "next/image";
import { Video, BookOpen, FileText, HelpCircle } from "lucide-react";
import { Course, Subject, Class, Resource, Quiz } from "@/src/types";
import PurchaseModal from "@/components/PurchaseModal"; // 👈 Import the new modal
import { openAuthModal } from "@/src/features/auth/authSlice"; // 👈 Import auth modal action

interface PageProps {
  params: Promise<{ courseSlug: string }>;
}

type Tab = "description" | "classes" | "notes" | "tests";

export default function CourseDetailPage({ params }: PageProps) {
  const { courseSlug } = use(params);
  const dispatch = useDispatch<AppDispatch>();
  const { currentCourse, loading, error } = useSelector(
    (state: RootState) => state.courses
  );
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);
  const [isPurchaseModalOpen, setPurchaseModalOpen] = useState(false); // 👈 State for modal
  const [activeTab, setActiveTab] = useState<Tab>("classes");

  useEffect(() => {
    if (courseSlug) {
      dispatch(fetchCourseBySlug(courseSlug));
    }
  }, [dispatch, courseSlug]);
  
  // 👇 NEW: Handle Buy Now click
  const handleBuyNowClick = () => {
    if (isAuthenticated) {
      setPurchaseModalOpen(true);
    } else {
      dispatch(openAuthModal());
    }
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
    // ... (This function remains the same as before)
     switch (activeTab) {
        case "description":
            return <p className="text-gray-700 leading-relaxed">{currentCourse?.description}</p>;
        case "classes":
            return (
                <div className="space-y-4">
                    {currentCourse?.subjects.map((subject: Subject) => (
                        <div key={subject.id}>
                            <h3 className="text-xl font-semibold mb-2">{subject.name}</h3>
                            <div className="space-y-2">
                                {subject.classes?.map((classItem: Class) => (
                                    <div key={classItem.id} className="flex items-center gap-4 p-3 bg-gray-50 rounded-lg border">
                                        <Video className="text-blue-500"/>
                                        <span>{classItem.title}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    ))}
                </div>
            );
        case "notes":
             return (
                <div className="space-y-4">
                    {currentCourse?.subjects.map((subject: Subject) => (
                        subject.resources?.filter(r => r.type === 'PDF').map((note: Resource) => (
                            <div key={note.id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <FileText className="text-green-500"/>
                                    <span>{note.title}</span>
                                </div>
                                <a href={note.signedUrl} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Download</a>
                            </div>
                        ))
                    ))}
                </div>
            );
        case "tests":
            return (
                <div className="space-y-4">
                     {currentCourse?.subjects.map((subject: Subject) => (
                        subject.quizzes?.map((quiz: Quiz) => (
                            <div key={quiz.id} className="flex items-center justify-between gap-4 p-3 bg-gray-50 rounded-lg border">
                                <div className="flex items-center gap-3">
                                    <HelpCircle className="text-purple-500"/>
                                    <span>{quiz.title}</span>
                                </div>
                                <button className="text-blue-600 hover:underline">Start Test</button>
                            </div>
                        ))
                    ))}
                </div>
            );
        default:
            return null;
    }
  }

  if (loading) return <div className="text-center p-10">Loading Course...</div>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  if (!currentCourse) return <div className="text-center p-10">Course not found.</div>;

  return (
    <>
      {/* 👇 NEW: Render the modal when its state is true */}
      {isPurchaseModalOpen && (
        <PurchaseModal
          course={currentCourse}
          onClose={() => setPurchaseModalOpen(false)}
        />
      )}

      <div className="container mx-auto max-w-7xl p-4 md:p-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content Column */}
          <div className="lg:col-span-2">
            <h1 className="text-4xl font-extrabold text-sky-900 mb-2">{currentCourse.name}</h1>
            <p className="text-gray-500 mb-6">By {currentCourse.teacher?.name || 'AppAstra'}</p>
            <div className="flex space-x-2 border-b mb-6">
              <TabButton tabName="description" label="Description" icon={BookOpen} />
              <TabButton tabName="classes" label="Classes" icon={Video} />
              <TabButton tabName="notes" label="Notes" icon={FileText} />
              <TabButton tabName="tests" label="Tests" icon={HelpCircle} />
            </div>
            <div className="p-4 bg-white rounded-lg shadow-sm">
              {renderContent()}
            </div>
          </div>

          {/* Sidebar Column */}
          <div className="lg:col-span-1">
            <div className="sticky top-24">
              <div className="relative w-full h-52 rounded-lg shadow-lg overflow-hidden mb-6">
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
                {/* 👇 FIX: Use the new handler for the button */}
                <button
                  onClick={handleBuyNowClick}
                  className="w-full px-6 py-3 bg-blue-600 text-white font-semibold rounded-md hover:bg-blue-700 transition"
                >
                  {currentCourse.isPaid ? 'Buy Now' : 'Enroll for Free'}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}