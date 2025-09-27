// app/previous-year/page.tsx
"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchPreviousPapers } from '@/src/features/materials/materialsThunks';
import { Resource } from '@/src/types';

const PaperCard = ({ paper }: { paper: Resource }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <div>
        <h3 className="text-lg font-semibold">{paper.title}</h3>
        <p className="text-sm text-gray-500">{paper.description}</p>
      </div>
      <a
        href={paper.signedUrl}
        target="_blank"
        rel="noopener noreferrer"
        className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition"
      >
        Download Paper
      </a>
    </div>
  );

export default function PreviousYearPage() {
  const dispatch = useDispatch<AppDispatch>();
  // Assuming a new slice `previousPapers` in the store, or adapt materialsSlice
  const { previousPapers, loading, error } = useSelector((state: RootState) => state.materials);

  useEffect(() => {
    // @ts-ignore
    dispatch(fetchPreviousPapers());
  }, [dispatch]);

  if (loading) return <p>Loading previous year papers...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Previous Year Papers</h1>
      <div className="space-y-4">
        {previousPapers && previousPapers.map((paper: Resource) => (
          <PaperCard key={paper.id} paper={paper} />
        ))}
      </div>
    </div>
  );
}