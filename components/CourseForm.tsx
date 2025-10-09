"use client";

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Course } from '@/src/types';

// FIX: Add onCancel to the props interface
interface CourseFormProps {
  onSubmit: SubmitHandler<Partial<Course>>;
  course?: Course | null;
  onCancel: () => void; // Add this line
}

// FIX: Accept onCancel as a prop
const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, course, onCancel }) => {
  const { register, handleSubmit, reset } = useForm<Partial<Course>>({
    defaultValues: course || {}
  });

  useEffect(() => {
    reset(course || {});
  }, [course, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div>
        <label className="block text-sm font-medium text-gray-700">Course Name</label>
        <input {...register('name', { required: true })} className="w-full p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} className="w-full p-2 border rounded-md" />
      </div>
      {/* FIX: Add an onCancel button */}
      <div className="flex justify-end gap-2">
        <button type="button" onClick={onCancel} className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300">
          Cancel
        </button>
        <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
          {course ? 'Update Course' : 'Create Course'}
        </button>
      </div>
    </form>
  );
};

export default CourseForm;