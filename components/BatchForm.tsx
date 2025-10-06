// components/BatchForm.tsx
"use client";

import React, { useEffect } from 'react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { Batch } from '@/src/types';

interface BatchFormProps {
  onSubmit: SubmitHandler<Partial<Batch>>;
  batch?: Batch | null;
  courseId: string;
}

const BatchForm: React.FC<BatchFormProps> = ({ onSubmit, batch, courseId }) => {
  const { register, handleSubmit, reset } = useForm<Partial<Batch>>({
    defaultValues: batch || { courseId },
  });

  useEffect(() => {
    reset(batch || { courseId });
  }, [batch, courseId, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <input type="hidden" {...register('courseId')} value={courseId} />
      <div>
        <label className="block text-sm font-medium text-gray-700">Batch Name</label>
        <input {...register('name', { required: true })} className="w-full p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Description</label>
        <textarea {...register('description')} className="w-full p-2 border rounded-md" />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Start Date</label>
        <input type="date" {...register('startDate')} className="w-full p-2 border rounded-md" />
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        {batch ? 'Update Batch' : 'Create Batch'}
      </button>
    </form>
  );
};

export default BatchForm;