"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchCourseBySlug } from '@/src/features/courses/coursesThunks';
import { createSubject } from '@/src/features/subjects/subjectsThunks';
import { createClass } from '@/src/features/classes/classesThunks';
import { useParams } from 'next/navigation';
import { useForm, FieldValues } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle, PlayCircle } from 'lucide-react';

export default function CourseDetailPage() {
  const dispatch = useDispatch<AppDispatch>();
  const params = useParams();
  const { slug } = params;
  const { currentCourse, loading, error } = useSelector((state: RootState) => state.courses);

  const { register: subjectRegister, handleSubmit: handleSubjectSubmit, reset: resetSubjectForm } = useForm();
  const { register: classRegister, handleSubmit: handleClassSubmit, reset: resetClassForm } = useForm();

  const [isSubjectDialogOpen, setIsSubjectDialogOpen] = useState(false);
  const [isClassDialogOpen, setIsClassDialogOpen] = useState(false);
  const [classDialogContext, setClassDialogContext] = useState<{ type: 'subject' | 'batch', id: string, name: string } | null>(null);
  const [videoUrl, setVideoUrl] = useState<string | null>(null);

  useEffect(() => {
    if (slug) {
      dispatch(fetchCourseBySlug(slug as string));
    }
  }, [dispatch, slug]);

  const onSubjectSubmit = (data: FieldValues) => {
    if (currentCourse) {
      dispatch(createSubject({ courseId: currentCourse.id, name: data.name, description: data.description }))
        .then(() => {
          setIsSubjectDialogOpen(false);
          resetSubjectForm();
          dispatch(fetchCourseBySlug(slug as string));
        });
    }
  };
  
  const onClassSubmit = (data: FieldValues) => {
    if (classDialogContext?.type === 'subject') {
      dispatch(createClass({ subjectId: classDialogContext.id, title: data.title, description: data.description, videoUrl: data.videoUrl }))
        .unwrap()
        .then(() => {
          setIsClassDialogOpen(false);
          resetClassForm();
          dispatch(fetchCourseBySlug(slug as string));
        });
    } else if (classDialogContext?.type === 'batch') {
      // NOTE: This functionality requires a backend endpoint to create a class with a `batchId`.
      // The current backend only supports creating a class under a subject.
      // For now, this will just close the dialog.
      console.warn("Backend functionality to add a class directly to a batch is required.");
      alert("Backend functionality to add a class directly to a batch is required.");
      setIsClassDialogOpen(false);
      resetClassForm();
    }
  };

  if (loading) return <p className="text-center p-10">Loading course details...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;
  if (!currentCourse) return <p className="text-center p-10">Course not found.</p>;

  return (
    <div className="container mx-auto p-4">
      {/* --- Main Dialog for Adding Classes --- */}
      <Dialog open={isClassDialogOpen} onOpenChange={setIsClassDialogOpen}>
        <DialogContent>
          <DialogHeader><DialogTitle>Add a New Class to {classDialogContext?.name}</DialogTitle></DialogHeader>
          <form onSubmit={handleClassSubmit(onClassSubmit)} className="space-y-4">
            <input {...classRegister('title')} placeholder="Class Title" className="w-full p-2 border rounded-md" required />
            <textarea {...classRegister('description')} placeholder="Class Description" className="w-full p-2 border rounded-md" />
            <input {...classRegister('videoUrl')} placeholder="Video URL" className="w-full p-2 border rounded-md" />
            <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Add Class</button>
          </form>
        </DialogContent>
      </Dialog>

      {/* --- Course Header --- */}
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold mb-2 text-foreground">{currentCourse.name}</h1>
          <p className="text-muted-foreground mb-6">{currentCourse.description}</p>
        </div>
        <Dialog open={isSubjectDialogOpen} onOpenChange={setIsSubjectDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
              <PlusCircle size={18} /> Add Subject
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader><DialogTitle>Add a New Subject</DialogTitle></DialogHeader>
            <form onSubmit={handleSubjectSubmit(onSubjectSubmit)} className="space-y-4">
              <input {...subjectRegister('name')} placeholder="Subject Name" className="w-full p-2 border rounded-md" required />
              <textarea {...subjectRegister('description')} placeholder="Subject Description" className="w-full p-2 border rounded-md" />
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">Add Subject</button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      {/* --- Batches List --- */}
      <div>
        <h2 className="text-2xl font-semibold mb-4">Batches</h2>
        {currentCourse.batches.map(batch => (
          <div key={batch.id} className="bg-card p-4 rounded-lg shadow-md mb-4 border">
            <h3 className="text-xl font-semibold">{batch.name}</h3>
            
            {/* Subjects within Batch */}
            {batch.subjects && batch.subjects.length > 0 && (
              <div className="mt-4 border-t pt-4">
                <h4 className="font-semibold text-lg">Subjects:</h4>
                <ul className="list-disc list-inside ml-4 mt-2 space-y-3">
                  {batch.subjects.map(subject => (
                    <li key={subject.id}>
                      <div className="flex justify-between items-center">
                        <span className="font-medium">{subject.name}</span>
                        <DialogTrigger asChild>
                          <button onClick={() => { setClassDialogContext({ type: 'subject', id: subject.id, name: subject.name }); setIsClassDialogOpen(true); }} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                            <PlusCircle size={14} /> Add Class
                          </button>
                        </DialogTrigger>
                      </div>
                      <ul className="list-circle list-inside ml-6 mt-1 text-sm text-muted-foreground">
                        {subject.classes?.map(cls => (
                          <li key={cls.id} className="flex items-center gap-2">
                            {cls.title}
                            {cls.videoUrl && <button onClick={() => setVideoUrl(cls.videoUrl!)} className="text-primary"><PlayCircle size={16} /></button>}
                          </li>
                        ))}
                      </ul>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* Standalone Classes within Batch */}
            <div className="mt-4 border-t pt-4">
               <div className="flex justify-between items-center">
                <h4 className="font-semibold text-lg">Standalone Classes:</h4>
                 <DialogTrigger asChild>
                    <button onClick={() => { setClassDialogContext({ type: 'batch', id: batch.id, name: batch.name }); setIsClassDialogOpen(true); }} className="text-sm bg-secondary text-secondary-foreground px-2 py-1 rounded-md flex items-center gap-1">
                      <PlusCircle size={14} /> Add Class
                    </button>
                  </DialogTrigger>
              </div>
              {batch.classes && batch.classes.length > 0 ? (
                <ul className="list-disc list-inside ml-4 mt-2 space-y-1 text-sm">
                  {batch.classes.map(cls => (
                    <li key={cls.id} className="flex items-center gap-2">
                      {cls.title}
                      {cls.videoUrl && <button onClick={() => setVideoUrl(cls.videoUrl!)} className="text-primary"><PlayCircle size={16} /></button>}
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-sm text-muted-foreground ml-4 mt-2">No standalone classes in this batch.</p>
              )}
            </div>
          </div>
        ))}
      </div>

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

