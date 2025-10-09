// app/courses/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchCourseBySlug } from '@/src/features/courses/coursesThunks';
import { createBatch, updateBatch, deleteBatch } from '@/src/features/batches/batchesThunks';
import { deleteSubject } from '@/src/features/subjects/subjectsThunks';
import { deleteClass } from '@/src/features/classes/classesThunks';
import { useParams } from 'next/navigation';
import { useForm, FieldValues } from 'react-hook-form';
import { PlusCircle } from 'lucide-react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { Batch } from '@/src/types';
import BatchForm from '@/components/BatchForm';
import BatchCard from '@/components/BatchCard';

export default function CourseDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { slug } = params;
  const { currentCourse, loading, error } = useSelector((state: RootState) => state.courses);

  const { reset: resetBatchForm } = useForm();
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'subject' | 'class' | 'batch', id: string, name: string } | null>(null);

  const refetchCourse = () => {
    if (slug) {
      dispatch(fetchCourseBySlug(slug as string));
    }
  };

  useEffect(() => {
    refetchCourse();
  }, [dispatch, slug]);

  // FIX: Change the data type to 'Partial<Batch>' to match the form's output.
  const onBatchSubmit = (data: Partial<Batch>) => {
    // We can now construct the payload with confidence, as the form enforces required fields.
    const batchPayload = {
      name: data.name!, // Add '!' to assert that name will not be null here
      description: data.description,
      startDate: new Date(data.startDate!).toISOString(),
      endDate: data.endDate ? new Date(data.endDate).toISOString() : undefined,
      isPaid: data.isPaid,
      price: data.price,
      mrp: data.mrp,
      imageUrl: data.imageUrl,
      courseId: currentCourse!.id,
    };

    let promise;

    if (editingBatch) {
      promise = dispatch(updateBatch({ id: editingBatch.id, data: batchPayload }));
    } else {
      promise = dispatch(createBatch(batchPayload));
    }

    promise.then(() => {
      closeBatchModal();
      refetchCourse();
    });
  };

  const openBatchModal = (batch: Batch | null = null) => {
    setEditingBatch(batch);
    resetBatchForm(batch || {});
    setIsBatchModalOpen(true);
  };

  const closeBatchModal = () => {
    setIsBatchModalOpen(false);
    setEditingBatch(null);
  };

  const openDeleteModal = (item: { type: 'subject' | 'class' | 'batch', id: string, name: string }) => {
    setDeletingItem(item);
    setIsDeleteModalOpen(true);
  };

  const confirmDelete = () => {
    if (deletingItem) {
      let promise;
      switch (deletingItem.type) {
        case 'subject':
          promise = dispatch(deleteSubject(deletingItem.id));
          break;
        case 'class':
          promise = dispatch(deleteClass(deletingItem.id));
          break;
        case 'batch':
          promise = dispatch(deleteBatch(deletingItem.id));
          break;
      }

      promise.then(() => {
        setIsDeleteModalOpen(false);
        refetchCourse();
      });
    }
  };

  if (loading && !currentCourse) return <p className="text-center p-10">Loading course details...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  if (!currentCourse) return <p className="text-center p-10">Course not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* --- Course Header --- */}
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-foreground">{currentCourse.name}</h1>
          <p className="text-muted-foreground">{currentCourse.description}</p>
        </div>
        <button onClick={() => openBatchModal()} className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
          <PlusCircle size={18} /> Add Batch
        </button>
      </div>

      {/* --- Batches --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Batches</h2>
        {currentCourse.batches.map(batch => (
          <BatchCard
            key={batch.id}
            batch={batch}
            refetchCourse={refetchCourse}
            onEdit={openBatchModal}
            onDelete={openDeleteModal}
          />
        ))}
      </div>

      {/* --- Modals --- */}
      <Modal isOpen={isBatchModalOpen} onClose={closeBatchModal} title={editingBatch ? 'Edit Batch' : 'Create Batch'}>
        <BatchForm
          onSubmit={onBatchSubmit}
          batch={editingBatch}
          courseId={currentCourse.id}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingItem?.name || ''}
      />
    </div>
  );
}