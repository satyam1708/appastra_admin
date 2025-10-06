// components/BatchCard.tsx
"use client";

import { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/store/store';
import { createSubject, updateSubject, deleteSubject } from '@/src/features/subjects/subjectsThunks';
import { createClass, updateClass, deleteClass } from '@/src/features/classes/classesThunks';
import { useForm, FieldValues } from 'react-hook-form';
import { PlusCircle, PlayCircle, Edit, Trash2 } from 'lucide-react';
import DeleteConfirmationModal from '@/components/DeleteConfirmationModal';
import Modal from '@/components/Modal';
import { Subject, Class, Batch } from '@/src/types';

interface BatchCardProps {
  batch: Batch;
  refetchCourse: () => void;
  onEdit: (batch: Batch) => void;
  onDelete: (item: { type: 'batch', id: string, name: string }) => void;
}

export default function BatchCard({ batch, refetchCourse, onEdit, onDelete }: BatchCardProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { register: subjectRegister, handleSubmit: handleSubjectSubmit, reset: resetSubjectForm } = useForm();
  const { register: classRegister, handleSubmit: handleClassSubmit, reset: resetClassForm } = useForm();

  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [isClassModalOpen, setIsClassModalOpen] = useState(false);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingClass, setEditingClass] = useState<Class | null>(null);
  const [context, setContext] = useState<{ type: 'subject' | 'batch', id: string, name: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  const onSubjectSubmit = (data: FieldValues) => {
    const subjectData = { ...editingSubject, ...data };
    const promise = editingSubject
      ? dispatch(updateSubject(subjectData))
      : dispatch(createSubject({ batchId: context!.id, ...data }));

    promise.then(() => {
      closeSubjectModal();
      refetchCourse();
    });
  };

  const onClassSubmit = (data: FieldValues) => {
    const classData = { ...editingClass, ...data };
    const promise = editingClass
      ? dispatch(updateClass(classData))
      : dispatch(createClass({ subjectId: context!.id, ...data }));
    
    promise.then(() => {
        closeClassModal();
        refetchCourse();
    });
  };

  const openSubjectModal = (ctx: { type: 'batch', id: string, name: string }, subject: Subject | null = null) => {
    setContext(ctx);
    setEditingSubject(subject);
    resetSubjectForm(subject || {});
    setIsSubjectModalOpen(true);
  };

  const closeSubjectModal = () => {
    setIsSubjectModalOpen(false);
    setEditingSubject(null);
    setContext(null);
  };

  const openClassModal = (ctx: { type: 'subject', id: string, name: string }, classToEdit: Class | null = null) => {
    setContext(ctx);
    setEditingClass(classToEdit);
    resetClassForm(classToEdit || {});
    setIsClassModalOpen(true);
  };

  const closeClassModal = () => {
    setIsClassModalOpen(false);
    setEditingClass(null);
    setContext(null);
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-4 border">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{batch.name}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => openSubjectModal({ type: 'batch', id: batch.id, name: batch.name })} className="text-sm bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
            <PlusCircle size={14} /> Add Subject
          </button>
          <button onClick={() => onEdit(batch)} className="text-sm p-1"><Edit size={14} /></button>
          <button onClick={() => onDelete({ type: 'batch', id: batch.id, name: batch.name })} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
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
                  <button onClick={() => openSubjectModal({ type: 'batch', id: batch.id, name: batch.name }, subject)} className="text-sm p-1"><Edit size={14} /></button>
                  <button onClick={() => onDelete({type: 'subject', id: subject.id, name: subject.name})} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
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
                          <button onClick={() => onDelete({type: 'class', id: cls.id, name: cls.title})} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
                      </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

      <Modal isOpen={isSubjectModalOpen} onClose={closeSubjectModal} title={editingSubject ? 'Edit Subject' : `Add Subject to ${context?.name}`}>
        <form onSubmit={handleSubjectSubmit(onSubjectSubmit)} className="space-y-4">
          <input {...subjectRegister('name')} placeholder="Subject Name" className="w-full p-2 border rounded-md" required />
          <textarea {...subjectRegister('description')} placeholder="Subject Description" className="w-full p-2 border rounded-md" />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{editingSubject ? 'Update' : 'Create'}</button>
        </form>
      </Modal>

      <Modal isOpen={isClassModalOpen} onClose={closeClassModal} title={editingClass ? 'Edit Class' : `Add Class to ${context?.name}`}>
        <form onSubmit={handleClassSubmit(onClassSubmit)} className="space-y-4">
          <input {...classRegister('title')} placeholder="Class Title" className="w-full p-2 border rounded-md" required />
          <textarea {...classRegister('description')} placeholder="Class Description" className="w-full p-2 border rounded-md" />
          <input {...classRegister('videoUrl')} placeholder="Video URL" className="w-full p-2 border rounded-md" />
          <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">{editingClass ? 'Update' : 'Add'}</button>
        </form>
      </Modal>

        {/* Video Player Modal */}
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