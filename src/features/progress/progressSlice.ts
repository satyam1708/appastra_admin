// src/features/progress/progressSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Progress } from '@/src/types';
import { fetchCourseProgress, updateClassProgress } from './progressThunks';

interface ProgressState {
  progressByCourse: Record<string, Progress>;
  loading: boolean;
  error: string | null;
}

const initialState: ProgressState = {
  progressByCourse: {},
  loading: false,
  error: null,
};

const progressSlice = createSlice({
  name: 'progress',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchCourseProgress.fulfilled, (state, action) => {
        state.progressByCourse[action.meta.arg] = action.payload;
      })
      .addCase(updateClassProgress.fulfilled, (state, action) => {
        const courseId = action.payload.courseId;
        if (courseId && state.progressByCourse[courseId]) {
          // This is a simplified update. You may need more detailed logic here.
          state.progressByCourse[courseId].percentage += 1; 
        }
      });
  },
});

export default progressSlice.reducer;