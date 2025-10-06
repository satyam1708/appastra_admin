// src/features/classes/classesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Class } from '@/src/types';
import { fetchClassesBySubject, createClass } from './classesThunks';

interface ClassesState {
  classesBySubject: Record<string, Class[]>;
  loading: boolean;
  error: string | null;
}

const initialState: ClassesState = {
  classesBySubject: {},
  loading: false,
  error: null,
};

const classesSlice = createSlice({
  name: 'classes',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClassesBySubject.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClassesBySubject.fulfilled, (state, action) => {
        state.loading = false;
        state.classesBySubject[action.meta.arg] = action.payload;
      })
      .addCase(fetchClassesBySubject.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createClass.fulfilled, (state, action) => {
        const { subjectId } = action.meta.arg;
        // This is a simplified update. A more robust solution might involve
        // updating the classes within the correct subject in the courses slice.
      });
  },
});

export default classesSlice.reducer;