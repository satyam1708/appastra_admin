// app/youtube-pdf/page.tsx
"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchAllMaterials } from '@/src/features/materials/materialsThunks';
import { Resource } from '@/src/types';

const ResourceCard = ({ resource }: { resource: Resource }) => (
  <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
    <h3 className="text-lg font-semibold">{resource.title}</h3>
    <a
      href={resource.signedUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition"
    >
      Watch on YouTube & Download PDF
    </a>
  </div>
);

export default function YouTubePdfPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { resources, loading, error } = useSelector((state: RootState) => state.materials);

  useEffect(() => {
    dispatch(fetchAllMaterials());
  }, [dispatch]);

  const youtubePdfs = resources.YOUTUBE || [];

  if (loading) return <p>Loading YouTube PDFs...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">YouTube PDF</h1>
      <div className="space-y-4">
        {youtubePdfs.map((resource: Resource) => (
          <ResourceCard key={resource.id} resource={resource} />
        ))}
      </div>
    </div>
  );
}