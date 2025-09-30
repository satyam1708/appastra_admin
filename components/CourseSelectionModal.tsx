// components/CourseSelectionModal.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchCourses } from '@/src/features/courses/coursesThunks';
import { setCourseGoal, closeCourseGoalModal } from '@/src/features/courseGoal/courseGoalSlice';
import { Course } from '@/src/types';

export default function CourseSelectionModal() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);
  const { isModalOpen } = useSelector((state: RootState) => state.courseGoal);

  useEffect(() => {
    if (isModalOpen && courses.length === 0) {
      dispatch(fetchCourses());
    }
  }, [dispatch, isModalOpen, courses.length]);

  const handleCourseSelect = (course: Course) => {
    dispatch(setCourseGoal(course));
  };

  if (!isModalOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
      <div className="bg-white rounded-xl shadow-2xl p-8 w-full max-w-lg">
        <h2 className="text-2xl font-bold text-center mb-6 text-sky-900">
          Select Your Course Goal
        </h2>

        {loading && <p className="text-center">Loading courses...</p>}
        {error && <p className="text-center text-red-500">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[60vh] overflow-y-auto">
          {courses.map((course) => (
            <button
              key={course.id}
              onClick={() => handleCourseSelect(course)}
              className="p-4 bg-gray-50 rounded-lg border-2 border-transparent hover:border-blue-500 hover:bg-blue-50 transition text-left"
            >
              <h3 className="font-semibold text-lg text-gray-800">{course.name}</h3>
              <p className="text-sm text-gray-500">{course.description || 'General course curriculum'}</p>
            </button>
          ))}
        </div>
        
        <button
          onClick={() => dispatch(closeCourseGoalModal())}
          className="mt-6 w-full text-center p-3 bg-gray-100 rounded-md hover:bg-gray-200"
        >
          Skip for Now
        </button>
      </div>
    </div>
  );
}