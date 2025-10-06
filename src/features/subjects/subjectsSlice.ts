// src/features/subjects/subjectsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Subject } from '@/src/types';
import { fetchSubjectsByCourse, createSubject } from './subjectsThunks';

interface SubjectsState {
  subjectsByCourse: Record<string, Subject[]>;
  loading: boolean;
  error: string | null;
}

const initialState: SubjectsState = {
  subjectsByCourse: {},
  loading: false,
  error: null,
};

const subjectsSlice = createSlice({
  name: 'subjects',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectsByCourse.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubjectsByCourse.fulfilled, (state, action) => {
        state.loading = false;
        state.subjectsByCourse[action.meta.arg] = action.payload;
      })
      .addCase(fetchSubjectsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createSubject.fulfilled, (state, action) => {
        const { courseId } = action.meta.arg;
        if (state.subjectsByCourse[courseId]) {
          state.subjectsByCourse[courseId].push(action.payload);
        } else {
          state.subjectsByCourse[courseId] = [action.payload];
        }
      });;
  },
});

export default subjectsSlice.reducer;