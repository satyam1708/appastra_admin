// components/CourseGoalManager.tsx
"use client";

import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '@/src/store/store';
import { loadCourseGoalFromStorage } from '@/src/features/courseGoal/courseGoalSlice';
import CourseSelectionModal from './CourseSelectionModal';

export default function CourseGoalManager() {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(loadCourseGoalFromStorage());
  }, [dispatch]);

  return <CourseSelectionModal />;
}