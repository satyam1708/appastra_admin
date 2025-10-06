"use client";

import { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchCourses, createCourse } from '@/src/features/courses/coursesThunks';
import { useForm, FieldValues } from 'react-hook-form';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { PlusCircle } from 'lucide-react';
import Link from 'next/link';

export default function CoursesPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { courses, loading, error } = useSelector((state: RootState) => state.courses);
  const { register, handleSubmit, reset } = useForm();
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchCourses());
  }, [dispatch]);

  const onSubmit = (data: FieldValues) => {
    const courseData = {
      name: data.name,
      description: data.description,
      price: parseFloat(data.price),
      isPaid: data.isPaid,
      teacherId: data.teacherId,
      slug: data.name.toLowerCase().replace(/\s+/g, '-'),
    };
    dispatch(createCourse(courseData)).then(() => {
      setIsDialogOpen(false);
      reset();
      dispatch(fetchCourses());
    });
  };

  if (loading) return <p className="text-center p-10">Loading courses...</p>;
  if (error) return <p className="text-center p-10 text-red-500">Error: {error}</p>;

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-foreground">Course Management</h1>
        <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
          <DialogTrigger asChild>
            <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md flex items-center gap-2">
              <PlusCircle size={18} /> Create Course
            </button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create a New Course</DialogTitle>
            </DialogHeader>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
              <div>
                <label className="block mb-1 font-medium">Course Name</label>
                <input {...register('name')} className="w-full p-2 border rounded-md" required />
              </div>
              <div>
                <label className="block mb-1 font-medium">Description</label>
                <textarea {...register('description')} className="w-full p-2 border rounded-md" />
              </div>
              <div>
                <label className="block mb-1 font-medium">Price</label>
                <input type="number" {...register('price')} className="w-full p-2 border rounded-md" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" {...register('isPaid')} />
                <label>Is this a paid course?</label>
              </div>
              <div>
                <label className="block mb-1 font-medium">Teacher ID</label>
                <input {...register('teacherId')} className="w-full p-2 border rounded-md" />
              </div>
              <button type="submit" className="px-4 py-2 bg-primary text-primary-foreground rounded-md">
                Create Course
              </button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {courses.map((course) => (
          <Link href={`/courses/${course.slug}`} key={course.id}>
            <div className="bg-card p-4 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <h2 className="text-xl font-semibold">{course.name}</h2>
              <p className="text-muted-foreground">{course.description}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}