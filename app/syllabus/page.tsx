// app/syllabus/page.tsx
"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchSyllabus } from '@/src/features/materials/materialsThunks';
import { Resource } from '@/src/types';

const SyllabusCard = ({ item }: { item: Resource }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{item.title}</h3>
        <p className="text-sm text-gray-500">{item.description}</p>
      </div>
      <a
        href={item.signedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition"
      >
        Download
      </a>
    </div>
  );

export default function SyllabusPage() {
  const dispatch = useDispatch<AppDispatch>();
  // We'll need a new state slice for syllabus, or to adapt the materialsSlice
  // For simplicity, let's assume a new slice `syllabus` in the store
  const { syllabus, loading, error } = useSelector((state: RootState) => state.materials);


  useEffect(() => {
    // @ts-ignore
    dispatch(fetchSyllabus());
  }, [dispatch]);


  if (loading) return <p>Loading syllabus...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Syllabus</h1>
      <div className="space-y-4">
        {syllabus && syllabus.map((item: Resource) => (
          <SyllabusCard key={item.id} item={item} />
        ))}
      </div>
    </div>
  );
}