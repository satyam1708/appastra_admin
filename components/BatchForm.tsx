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
    defaultValues: batch ? {
      ...batch,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
    } : { courseId },
  });

  useEffect(() => {
    reset(batch ? {
      ...batch,
      startDate: batch.startDate ? new Date(batch.startDate).toISOString().split('T')[0] : '',
      endDate: batch.endDate ? new Date(batch.endDate).toISOString().split('T')[0] : '',
    } : { courseId });
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
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Start Date</label>
          <input type="date" {...register('startDate')} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">End Date</label>
          <input type="date" {...register('endDate')} className="w-full p-2 border rounded-md" />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Price</label>
          <input type="number" {...register('price')} className="w-full p-2 border rounded-md" />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">MRP</label>
          <input type="number" {...register('mrp')} className="w-full p-2 border rounded-md" />
        </div>
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700">Image URL</label>
        <input {...register('imageUrl')} className="w-full p-2 border rounded-md" />
      </div>
      <div className="flex items-center">
        <input type="checkbox" {...register('isPaid')} className="h-4 w-4 text-blue-600 border-gray-300 rounded" />
        <label className="ml-2 block text-sm text-gray-900">Is this a paid batch?</label>
      </div>
      <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
        {batch ? 'Update Batch' : 'Create Batch'}
      </button>
    </form>
  );
};

export default BatchForm;