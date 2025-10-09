// components/BatchCard.tsx
"use client";

import { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { createSubject, updateSubject } from '@/src/features/subjects/subjectsThunks';
import { createClass, updateClass } from '@/src/features/classes/classesThunks';
import { createLiveSession, endLiveSession } from '@/src/features/live/liveThunks';
import { clearActiveSession } from '@/src/features/live/liveSlice';
import { useForm, SubmitHandler } from 'react-hook-form';
import { PlusCircle, PlayCircle, Edit, Trash2, Video } from 'lucide-react';
import Modal from '@/components/Modal';
import GoLiveModal from './GoLiveModal';
import { Subject, Class as ClassType, Batch } from '@/src/types';
import HlsPlayer from './HlsPlayer';
import DeleteConfirmationModal from './DeleteConfirmationModal';


// A simple reusable form for Subjects
const SubjectForm = ({ onSubmit, subject }: { onSubmit: SubmitHandler<Partial<Subject>>; subject: Partial<Subject> | null; }) => {
    const { register, handleSubmit } = useForm<Partial<Subject>>({ defaultValues: subject || {} });
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
            <div>
                <label className="block text-sm font-medium">Subject Name</label>
                <input {...register('name', { required: true })} placeholder="e.g., Algebra" className="w-full p-2 border rounded-md bg-background" />
            </div>
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea {...register('description')} placeholder="A brief summary of the subject" className="w-full p-2 border rounded-md bg-background" />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                {subject?.id ? 'Update Subject' : 'Create Subject'}
            </button>
        </form>
    );
};

// A simple reusable form for Classes
const ClassForm = ({ onSubmit, classItem }: { onSubmit: SubmitHandler<Partial<ClassType>>; classItem: Partial<ClassType> | null; }) => {
    const { register, handleSubmit } = useForm<Partial<ClassType>>({ defaultValues: classItem || {} });
    return (
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 p-1">
             <div>
                <label className="block text-sm font-medium">Class Title</label>
                <input {...register('title', { required: true })} placeholder="e.g., Introduction to Functions" className="w-full p-2 border rounded-md bg-background" />
            </div>
            <div>
                <label className="block text-sm font-medium">Description</label>
                <textarea {...register('description')} placeholder="What will be covered in this class?" className="w-full p-2 border rounded-md bg-background" />
            </div>
            <button type="submit" className="w-full px-4 py-2 bg-primary text-primary-foreground rounded-md hover:bg-primary/90">
                {classItem?.id ? 'Update Class' : 'Create Class'}
            </button>
        </form>
    );
};


interface BatchCardProps {
  batch: Batch;
  refetchCourse: () => void;
  onEdit: (batch: Batch) => void;
  onDelete: (item: { type: 'batch' | 'subject' | 'class', id: string, name: string }) => void;
}

export const BatchCard: React.FC<BatchCardProps> = ({ batch, refetchCourse, onEdit, onDelete }) => {
  const dispatch = useDispatch<AppDispatch>();
  const { activeSession } = useSelector((state: RootState) => state.live);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState<'subject' | 'class' | null>(null);
  const [editingSubject, setEditingSubject] = useState<Subject | null>(null);
  const [editingClass, setEditingClass] = useState<ClassType | null>(null);
  const [context, setContext] = useState<Batch | Subject | null>(null);
  const [playbackUrl, setPlaybackUrl] = useState<string | null>(null);

  const onSubjectSubmit: SubmitHandler<Partial<Subject>> = (data) => {
    const promise = editingSubject
      ? dispatch(updateSubject({ id: editingSubject.id, data }))
      : dispatch(createSubject({ batchId: (context as Batch).id, data }));

    promise.then(() => {
      closeModal();
      refetchCourse();
    });
  };

  const onClassSubmit: SubmitHandler<Partial<ClassType>> = (data) => {
    const promise = editingClass
      ? dispatch(updateClass({ id: editingClass.id, data }))
      : dispatch(createClass({ subjectId: (context as Subject).id, data }));

    promise.then(() => {
        closeModal();
        refetchCourse();
    });
  };

  const openModal = (type: 'subject' | 'class', ctx: Batch | Subject, item: Subject | ClassType | null = null) => {
    setModalContent(type);
    setContext(ctx);
    if (type === 'subject' && item) setEditingSubject(item as Subject);
    if (type === 'class' && item) setEditingClass(item as ClassType);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setModalContent(null);
    setEditingSubject(null);
    setEditingClass(null);
    setContext(null);
  };

  const handlePlayClick = (cls: ClassType) => {
    if (cls.isLive && cls.liveSessions && cls.liveSessions.length > 0) {
      const activeLiveSession = cls.liveSessions.find(s => !s.endedAt);
      if (activeLiveSession && activeLiveSession.playbackUrl) {
        setPlaybackUrl(activeLiveSession.playbackUrl);
      } else {
        setPlaybackUrl(cls.videoUrl || null);
      }
    } else {
      setPlaybackUrl(cls.videoUrl || null);
    }
  };

  const handleGoLive = (classId: string) => {
    dispatch(createLiveSession(classId)).then(() => {
      refetchCourse();
    });
  };

  const handleEndLive = () => {
    if (activeSession) {
      dispatch(endLiveSession(activeSession.id)).then(() => {
        dispatch(clearActiveSession());
        refetchCourse();
      });
    }
  };

  return (
    <div className="bg-card p-4 rounded-lg shadow-md mb-4 border">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-semibold">{batch.name}</h3>
        <div className="flex items-center gap-2">
          <button onClick={() => openModal('subject', batch)} className="text-sm bg-blue-600 text-white px-2 py-1 rounded-md flex items-center gap-1">
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
                  <button onClick={() => openModal('class', subject)} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                    <PlusCircle size={14} /> Add Class
                  </button>
                  <button onClick={() => openModal('subject', batch, subject)} className="text-sm p-1"><Edit size={14} /></button>
                  <button onClick={() => onDelete({type: 'subject', id: subject.id, name: subject.name})} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
                </div>
              </div>
              <ul className="list-circle list-inside ml-6 mt-1 text-sm text-muted-foreground">
                {subject.classes?.map(cls => (
                  <li key={cls.id} className="flex items-center gap-2 justify-between">
                    <span>
                      {cls.title}
                      {cls.isLive && (
                        <span className="ml-2 text-xs font-semibold bg-red-500 text-white px-2 py-0.5 rounded-full">
                          LIVE
                        </span>
                      )}
                      {(cls.videoUrl || (cls.isLive && cls.liveSessions && cls.liveSessions.length > 0)) && (
                        <button onClick={() => handlePlayClick(cls)} className="text-primary ml-2">
                          <PlayCircle size={16} />
                        </button>
                      )}
                    </span>
                    <div>
                      <button onClick={() => handleGoLive(cls.id)} className="text-sm p-1 text-green-600" title="Go Live">
                        <Video size={14} />
                      </button>
                      <button onClick={() => openModal('class', subject, cls)} className="text-sm p-1"><Edit size={14} /></button>
                      <button onClick={() => onDelete({type: 'class', id: cls.id, name: cls.title})} className="text-sm p-1 text-red-500"><Trash2 size={14} /></button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      </div>

        <Modal isOpen={isModalOpen} onClose={closeModal} title={
            modalContent === 'subject' ? (editingSubject ? 'Edit Subject' : 'Add Subject') : (editingClass ? 'Edit Class' : 'Add Class')
        }>
            {modalContent === 'subject' && <SubjectForm onSubmit={onSubjectSubmit} subject={editingSubject} />}
            {modalContent === 'class' && <ClassForm onSubmit={onClassSubmit} classItem={editingClass} />}
        </Modal>

      {playbackUrl && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50" onClick={() => setPlaybackUrl(null)}>
          <div className="bg-background p-4 rounded-lg shadow-2xl w-full max-w-4xl" onClick={(e) => e.stopPropagation()}>
            {playbackUrl.endsWith('.m3u8') ? (
              <HlsPlayer src={playbackUrl} />
            ) : (
              <video src={playbackUrl} controls autoPlay className="w-full max-h-[80vh]"></video>
            )}
          </div>
        </div>
      )}

      {activeSession && (
        <GoLiveModal
          session={activeSession}
          onClose={() => dispatch(clearActiveSession())}
          onEndSession={handleEndLive}
        />
      )}
    </div>
  );
};

