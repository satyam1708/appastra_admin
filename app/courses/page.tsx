// app/courses/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import {
  fetchCourses,
  createCourse,
  updateCourse,
} from "@/src/features/courses/coursesThunks";
import { useForm } from "react-hook-form";
import { Course } from "@/src/types";
import CourseForm from "@/components/CourseForm";
import Modal from "@/components/Modal";
import { PlusCircle } from "lucide-react";
import Link from "next/link";

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading } = useSelector((state: RootState) => state.courses);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const { reset } = useForm<Partial<Course>>();

  const openModal = (course: Course | null = null) => {
    setSelectedCourse(course);
    reset(course || {});
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setSelectedCourse(null);
  };

  const handleFormSubmit = (data: Partial<Course>) => {
    let promise;

    if (selectedCourse) {
      promise = dispatch(updateCourse({ slug: selectedCourse.slug, data }));
    } else {
      if (!data.name) {
        console.error("Course name is required.");
        return;
      }
      promise = dispatch(createCourse({
        name: data.name,
        description: data.description,
        imageUrl: data.imageUrl,
      }));
    }

    promise.then(() => {
      dispatch(fetchCourses());
      closeModal();
    });
  };

  if (loading && courses.length === 0) {
    return <p className="text-center p-10">Loading courses...</p>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button
          onClick={() => openModal()}
          className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2"
        >
          <PlusCircle size={18} /> Add Course
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <div
            key={course.id}
            className="bg-card border rounded-lg p-4 flex flex-col justify-between"
          >
            <div>
              <h2 className="text-xl font-semibold">{course.name}</h2>
              <p className="text-muted-foreground text-sm mt-1">
                {course.description}
              </p>
            </div>
            <div className="mt-4 flex gap-2">
              <Link
                href={`/courses/${course.slug}`}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
              >
                Manage
              </Link>
              <button
                onClick={() => openModal(course)}
                className="bg-secondary text-secondary-foreground px-3 py-1 rounded-md text-sm"
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        title={selectedCourse ? "Edit Course" : "Create New Course"}
      >
        {/* FIX: Changed 'initialData' to 'course' and added the 'onCancel' prop */}
        <CourseForm
          onSubmit={handleFormSubmit}
          course={selectedCourse}
          onCancel={closeModal}
        />
      </Modal>
    </div>
  );
}