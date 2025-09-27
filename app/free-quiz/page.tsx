// app/free-quiz/page.tsx
"use client";
import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { AppDispatch, RootState } from '@/src/store/store';
import { fetchAllMaterials } from '@/src/features/materials/materialsThunks';
import { Resource } from '@/src/types';
import Link from 'next/link';

const QuizCard = ({ quiz }: { quiz: Resource }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <h3 className="text-lg font-semibold">{quiz.title}</h3>
      <Link
        href={`/quiz/${quiz.id}`} // Assuming a dynamic route for quizzes
        className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition"
      >
        Start Quiz
      </Link>
    </div>
);

export default function FreeQuizPage() {
  const dispatch = useDispatch<AppDispatch>();
  const { resources, loading, error } = useSelector((state: RootState) => state.materials);

  useEffect(() => {
    dispatch(fetchAllMaterials());
  }, [dispatch]);

  const freeQuizzes = resources.QUIZ?.filter((quiz: any) => !quiz.isPaid) || [];

  if (loading) return <p>Loading quizzes...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Free Quizzes</h1>
      <div className="space-y-4">
        {freeQuizzes.map((quiz: Resource) => (
          <QuizCard key={quiz.id} quiz={quiz} />
        ))}
      </div>
    </div>
  );
}