// src/features/courseGoal/courseGoalSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '@/src/types';

interface CourseGoalState {
  selectedCourse: Course | null;
  isModalOpen: boolean;
}

const initialState: CourseGoalState = {
  selectedCourse: null,
  isModalOpen: false,
};

const courseGoalSlice = createSlice({
  name: 'courseGoal',
  initialState,
  reducers: {
    setCourseGoal: (state, action: PayloadAction<Course>) => {
      state.selectedCourse = action.payload;
      state.isModalOpen = false;
      if (typeof window !== 'undefined') {
        localStorage.setItem('selectedCourse', JSON.stringify(action.payload));
      }
    },
    clearCourseGoal: (state) => {
      state.selectedCourse = null;
      if (typeof window !== 'undefined') {
        localStorage.removeItem('selectedCourse');
      }
    },
    loadCourseGoalFromStorage: (state) => {
      if (typeof window !== 'undefined') {
        const storedCourse = localStorage.getItem('selectedCourse');
        if (storedCourse) {
          state.selectedCourse = JSON.parse(storedCourse);
        } else {
          // If no course is stored, open the selection modal
          state.isModalOpen = true;
        }
      }
    },
    openCourseGoalModal: (state) => {
      state.isModalOpen = true;
    },
    closeCourseGoalModal: (state) => {
      state.isModalOpen = false;
    },
  },
});

export const {
  setCourseGoal,
  clearCourseGoal,
  loadCourseGoalFromStorage,
  openCourseGoalModal,
  closeCourseGoalModal,
} = courseGoalSlice.actions;

export default courseGoalSlice.reducer;