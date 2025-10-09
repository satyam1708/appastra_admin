// src/features/subjects/subjectsSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Subject } from '@/src/types';
import { fetchSubjectsByCourse, createSubject, updateSubject, deleteSubject } from './subjectsThunks';

interface SubjectsState {
  subjectsByCourse: { [courseId: string]: Subject[] };
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
      })
      .addCase(fetchSubjectsByCourse.fulfilled, (state, action) => {
        const { courseId, subjects } = action.payload;
        state.subjectsByCourse[courseId] = subjects;
        state.loading = false;
      })
      .addCase(fetchSubjectsByCourse.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch subjects';
      })
      // FIX: Handle the new payload structure from the createSubject thunk
      .addCase(createSubject.fulfilled, (state, action: PayloadAction<{ subject: Subject; courseId: string }>) => {
        const { subject, courseId } = action.payload;
        if (state.subjectsByCourse[courseId]) {
          state.subjectsByCourse[courseId].push(subject);
        } else {
          // In case the subject list for this course wasn't loaded yet
          state.subjectsByCourse[courseId] = [subject];
        }
      })
      .addCase(updateSubject.fulfilled, (state, action) => {
        const updatedSubject = action.payload;
        // Find which course this subject belongs to and update it
        for (const courseId in state.subjectsByCourse) {
          const subjectIndex = state.subjectsByCourse[courseId].findIndex(s => s.id === updatedSubject.id);
          if (subjectIndex !== -1) {
            state.subjectsByCourse[courseId][subjectIndex] = updatedSubject;
            break;
          }
        }
      })
      .addCase(deleteSubject.fulfilled, (state, action) => {
        const deletedSubjectId = action.meta.arg;
        // Find and remove the subject from whichever course it belongs to
        for (const courseId in state.subjectsByCourse) {
          state.subjectsByCourse[courseId] = state.subjectsByCourse[courseId].filter(
            s => s.id !== deletedSubjectId
          );
        }
      });
  },
});

export default subjectsSlice.reducer;