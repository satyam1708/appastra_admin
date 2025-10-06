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
      <div className="flex items-center">
        <input {...register('isPaid')} type="checkbox" className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label className="ml-2 block text-sm text-gray-900">Is Paid?</label>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Price</label>
        <input {...register('price')} type="number" step="0.01" className="w-full p-2 border rounded-md" />
      </div>
      <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
        {course ? 'Update Course' : 'Create Course'}
      </button>
    </form>
  );
};

export default CourseForm;