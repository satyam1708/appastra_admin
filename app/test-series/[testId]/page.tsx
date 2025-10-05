// app/test-series/[testId]/page.tsx
"use client";

import { useEffect, use } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchTestDetails } from "@/src/features/tests/testThunks";
import { Test, TestQuestion } from "@/src/types";
import Link from "next/link";

interface PageProps {
  params: Promise<{ testId: string }>;
}

const TestQuestionCard = ({ question }: { question: TestQuestion }) => (
    <div className="bg-white rounded-lg shadow-md p-4 flex justify-between items-center">
      <h3 className="text-lg font-semibold">{question.text}</h3>
      {/* Link might need to be adjusted based on your routing for individual questions */}
      <Link href={`/test/question/${question.id}`} className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition">
          Start Question
      </Link>
    </div>
  );

export default function TestSeriesDetailPage({ params }: PageProps) {
  const { testId } = use(params); // ✅ FIXED: Unwrap params with use()
  const dispatch = useDispatch<AppDispatch>();
  const { currentTest, loading, error } = useSelector((state: RootState) => state.tests);

  useEffect(() => {
    dispatch(fetchTestDetails(testId));
  }, [dispatch, testId]);

  if (loading) return <p>Loading tests...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!currentTest) return <p>No tests found in this series.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{currentTest.title}</h1>
      <div className="space-y-4">
        {currentTest.questionsList.map((question) => (
          <TestQuestionCard key={question.id} question={question} />
        ))}
      </div>
    </div>
  );
}