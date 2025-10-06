"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '../../src/store/store';
import { fetchCourses, createCourse, updateCourse, deleteCourse } from '../../src/features/courses/coursesThunks';
import { Course } from '../../src/types';
import Link from 'next/link';
import Modal from '@/components/Modal';
import CourseForm from '@/components/CourseForm';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const handleCreate = () => {
    setSelectedCourse(null);
    setIsModalOpen(true);
  };

  const handleEdit = (course: Course) => {
    setSelectedCourse(course);
    setIsModalOpen(true);
  };

  const handleDelete = (course: Course) => {
    setSelectedCourse(course);
    setIsDeleteModalOpen(true);
  };

  const handleFormSubmit = (data: Partial<Course>) => {
    if (selectedCourse) {
      dispatch(updateCourse({ ...selectedCourse, ...data }));
    } else {
      dispatch(createCourse(data));
    }
    setIsModalOpen(false);
  };

  const confirmDelete = () => {
    if (selectedCourse) {
      dispatch(deleteCourse(selectedCourse.id));
    }
    setIsDeleteModalOpen(false);
  };

  if (loading) return <p className="text-center p-10">Loading courses...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Courses</h1>
        <button onClick={handleCreate} className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          Add Course
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course: Course) => (
          <div key={course.id} className="bg-white rounded-lg shadow-md p-4 flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-semibold">{course.name}</h3>
              <p className="text-gray-600">{course.description}</p>
            </div>
            <div className="mt-4 flex justify-end space-x-2">
              <Link href={`/courses/${course.slug}`} className="px-3 py-1 bg-gray-200 text-sm rounded-md hover:bg-gray-300">
                View
              </Link>
              <button onClick={() => handleEdit(course)} className="px-3 py-1 bg-yellow-500 text-white text-sm rounded-md hover:bg-yellow-600">
                Edit
              </button>
              <button onClick={() => handleDelete(course)} className="px-3 py-1 bg-red-600 text-white text-sm rounded-md hover:bg-red-700">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={selectedCourse ? 'Edit Course' : 'Create Course'}>
        <CourseForm onSubmit={handleFormSubmit} course={selectedCourse} />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={selectedCourse?.name || ''}
      />
    </div>
  );
}