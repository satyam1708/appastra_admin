// app/courses/[slug]/page.tsx
"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchCourseBySlug } from '@/src/features/courses/coursesThunks';
import { createSubject, updateSubject, deleteSubject } from '@/src/features/subjects/subjectsThunks';
import { createClass, updateClass, deleteClass } from '@/src/features/classes/classesThunks';
import { createBatch, updateBatch, deleteBatch } from '@/src/features/batches/batchesThunks';
import { useParams } from 'next/navigation';
import { useForm, FieldValues } from 'react-hook-form';
import { PlusCircle, PlayCircle, Edit, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { Subject, Class, Batch } from '@/src/types';
import BatchForm from '@/components/BatchForm';

export default function CourseDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { slug } = params;
  const { currentCourse, loading, error } = useSelector((state: RootState) => state.courses);

  const { register: subjectRegister, handleSubmit: handleSubjectSubmit, reset: resetSubjectForm } = useForm();
  const { register: classRegister, handleSubmit: handleClassSubmit, reset: resetClassForm } = useForm();
  const { handleSubmit: handleBatchSubmit, reset: resetBatchForm } = useForm();

  // State for modals
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isBatchModalOpen, setIsBatchModalOpen] = useState(false);

  // State for tracking what is being edited or deleted
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [editingBatch, setEditingBatch] = useState<Batch | null>(null);
  const [deletingItem, setDeletingItem] = useState<{ type: 'subject' | 'class' | 'batch', id: string, name: string } | null>(null);

  // Context for adding a class to a subject or batch
  const [classContext, setClassContext] = useState<{ type: 'subject' | 'batch', id: string, name: string } | null>(null);

  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const refetchCourse = () => {
    if (slug) {
      dispatch(fetchCourseBySlug(slug as string));
    }
  };

  useEffect(() => {
    refetchCourse();
  }, [dispatch, slug]);

  const onSubjectSubmit = (data: FieldValues) => {
    const subjectData = { ...editingSubject, ...data };
    const promise = editingSubject
      ? dispatch(updateSubject(subjectData))
      : dispatch(createSubject({ courseId: currentCourse!.id, ...data }));

    promise.then(() => {
      closeSubjectModal();
      refetchCourse();
    });
  };

  const onClassSubmit = (data: FieldValues) => {
    const classData = { ...editingClass, ...data };
    const promise = editingClass
      ? dispatch(updateClass(classData))
      : dispatch(createClass({ subjectId: classContext!.id, ...data }));

    promise.then(() => {
      closeClassModal();
      refetchCourse();
    });
  };

  const onBatchSubmit = (data: FieldValues) => {
    // FIX: Convert date to ISO string before sending
    const batchData = {
      ...editingBatch,
      ...data,
      courseId: currentCourse!.id,
      startDate: new Date(data.startDate).toISOString(),
    };
    const promise = editingBatch
      ? dispatch(updateBatch(batchData))
      : dispatch(createBatch(batchData));

    promise.then(() => {
      closeBatchModal();
      refetchCourse();
    });
  };

  const openSubjectModal = (subject: Subject | null = null) => {
    setEditingSubject(subject);
    resetSubjectForm(subject || {});
    setIsSubjectModalOpen(true);
  };

  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
  };

  const openClassModal = (context: { type: 'subject' | 'batch', id: string, name: string }, classToEdit: Class | null = null) => {
    setClassContext(context);
    setEditingClass(classToEdit);
    resetClassForm(classToEdit || {});
    setIsClassModalOpen(true);
  };

  const closeClassModal = () => {
    setIsClassModalOpen(false);
    setEditingClass(null);
    setClassContext(null);
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
        <div className="flex gap-2">
          <button onClick={() => openSubjectModal()} className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
            <PlusCircle size={18} /> Add Subject
          </button>
          <button onClick={() => openBatchModal()} className="bg-green-600 text-white px-4 py-2 rounded-md flex items-center gap-2">
            <PlusCircle size={18} /> Add Batch
          </button>
        </div>
      </div>

      {/* --- Batches and Subjects --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Batches</h2>
        {currentCourse.batches.map(batch => (
          <div key={batch.id} className="bg-card p-4 rounded-lg shadow-md mb-4 border">
            <div className="flex justify-between items-center">
              <h3 className="text-xl font-semibold">{batch.name}</h3>
              <div className="flex items-center gap-2">
                <button onClick={() => openBatchModal(batch)} className="text-sm p-1"><Edit size={14} /></button>
                <button onClick={() => openDeleteModal({ type: 'batch', id: batch.id, name: batch.name })} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
              </div>
            </div>


            <div className="mt-4 border-t pt-4">
              <h4 className="font-semibold text-lg">Subjects:</h4>
              <ul className="list-disc list-inside ml-4 mt-2 space-y-3">
                {batch.subjects?.map(subject => (
                  <li key={subject.id}>
                    <div className="flex justify-between items-center">
                      <span className="font-medium">{subject.name}</span>
                      <div className="flex items-center gap-2">
                        <button onClick={() => openClassModal({ type: 'subject', id: subject.id, name: subject.name })} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                          <PlusCircle size={14} /> Add Class
                        </button>
                        <button onClick={() => openSubjectModal(subject)} className="text-sm p-1"><Edit size={14} /></button>
                        <button onClick={() => openDeleteModal({ type: 'subject', id: subject.id, name: subject.name })} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
                      </div>
                    </div>
                    <ul className="list-circle list-inside ml-6 mt-1 text-sm text-muted-foreground">
                      {subject.classes?.map(cls => (
                        <li key={cls.id} className="flex items-center gap-2 justify-between">
                          <span>
                            {cls.title}
                            {cls.videoUrl && <button onClick={() => setVideoUrl(cls.videoUrl!)} className="text-primary ml-2"><PlayCircle size={16} /></button>}
                          </span>
                          <div>
                            <button onClick={() => openClassModal({ type: 'subject', id: subject.id, name: subject.name }, cls)} className="text-sm p-1"><Edit size={14} /></button>
                            <button onClick={() => openDeleteModal({ type: 'class', id: cls.id, name: cls.title })} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        ))}
      </div>

      {/* Modals */}
      <Modal isOpen={isSubjectModalOpen} onClose={closeSubjectModal} title={editingSubject ? 'Edit Subject' : 'Create Subject'}>
        <form onSubmit={handleSubjectSubmit(onSubjectSubmit)} className="space-y-4">
          <input {...subjectRegister('name')} placeholder="Subject Name" className="w-full p-2 border rounded-md" required />
          <textarea {...subjectRegister('description')} placeholder="Subject Description" className="w-full p-2 border rounded-md" />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{editingSubject ? 'Update' : 'Create'}</button>
        </form>
      </Modal>

      <Modal isOpen={isClassModalOpen} onClose={closeClassModal} title={editingClass ? 'Edit Class' : `Add Class to ${classContext?.name}`}>
        <form onSubmit={handleClassSubmit(onClassSubmit)} className="space-y-4">
          <input {...classRegister('title')} placeholder="Class Title" className="w-full p-2 border rounded-md" required />
          <textarea {...classRegister('description')} placeholder="Class Description" className="w-full p-2 border rounded-md" />
          <input {...classRegister('videoUrl')} placeholder="Video URL" className="w-full p-2 border rounded-md" />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{editingClass ? 'Update' : 'Add'}</button>
        </form>
      </Modal>

      <Modal isOpen={isBatchModalOpen} onClose={closeBatchModal} title={editingBatch ? 'Edit Batch' : 'Create Batch'}>
        <BatchForm
          onSubmit={onBatchSubmit}
          batch={editingBatch}
          courseId={currentCourse.id}
          allSubjects={currentCourse.subjects}
        />
      </Modal>

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={confirmDelete}
        itemName={deletingItem?.name || ''}
      />

      {/* --- Video Player Modal --- */}
      {videoUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setVideoUrl(null)}>
          <div className="bg-background p-4 rounded-lg shadow-2xl" onClick={(e) => e.stopPropagation()}>
            <video src={videoUrl} controls autoPlay className="w-full max-w-4xl max-h-[80vh]"></video>
          </div>
        </div>
      )}
    </div>
  );
}