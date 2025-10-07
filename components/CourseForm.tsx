"use client";

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Course } from '@/src/types';

interface CourseFormProps {
  onSubmit: SubmitHandler<Partial<Course>>;
  course?: Course | null;
}

const CourseForm: React.FC<CourseFormProps> = ({ onSubmit, course }) => {
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
      {/* Removed isPaid and price fields */}
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {course ? 'Update Course' : 'Create Course'}
      </button>
    </form>
  );
};

export default CourseForm;
