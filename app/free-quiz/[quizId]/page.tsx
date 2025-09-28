// app/quiz/[quizId]/page.tsx
"use client";

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { AppDispatch, RootState } from "@/src/store/store";
import { fetchQuizzes } from "@/src/features/materials/materialsThunks";
import { Quiz, QuizQuestion } from "@/src/types";

interface PageProps {
  params: { quizId: string };
}

export default function QuizPage({ params }: PageProps) {
  const dispatch = useDispatch<AppDispatch>();
  const { quizzes, loading, error } = useSelector((state: RootState) => state.materials);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<string, string>>({});

  useEffect(() => {
    dispatch(fetchQuizzes());
  }, [dispatch]);

  const quiz = quizzes.find((q: Quiz) => q.id === params.quizId);
  const currentQuestion = quiz?.quizquestions[currentQuestionIndex];

  const handleAnswer = (questionId: string, answer: string) => {
    setSelectedAnswers({ ...selectedAnswers, [questionId]: answer });
  };

  if (loading) return <p>Loading quiz...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!quiz) return <p>Quiz not found.</p>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">{quiz.title}</h1>
      {currentQuestion ? (
        <div>
          <h2 className="text-xl mb-4">{currentQuestion.text}</h2>
          <div className="space-y-2">
            {Object.entries(currentQuestion.options).map(([key, value]) => (
              <button
                key={key}
                onClick={() => handleAnswer(currentQuestion.id, key)}
                className={`w-full text-left p-3 border rounded-lg ${selectedAnswers[currentQuestion.id] === key ? 'bg-blue-200' : 'bg-white'}`}
              >
                {String(value)}
              </button>
            ))}
          </div>
          <div className="mt-6 flex justify-between">
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-gray-300 rounded-md disabled:opacity-50"
            >
              Previous
            </button>
            <button
              onClick={() => setCurrentQuestionIndex(currentQuestionIndex + 1)}
              disabled={currentQuestionIndex === quiz.quizquestions.length - 1}
              className="px-4 py-2 bg-blue-600 text-white rounded-md disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      ) : (
        <div>
          <h2 className="text-2xl">Quiz Completed!</h2>
          {/* You can show a summary of answers here */}
        </div>
      )}
    </div>
  );
}