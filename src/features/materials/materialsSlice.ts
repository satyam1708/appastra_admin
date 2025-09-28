// src/features/materials/materialsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Resource, Quiz } from '@/src/types';
import { fetchAllMaterials, fetchSyllabus, fetchPreviousPapers, fetchQuizzes } from './materialsThunks';

interface MaterialsState {
  resources: any;
  syllabus: Resource[];
  previousPapers: Resource[];
  quizzes: Quiz[]; 
  loading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  resources: {},
  syllabus: [],
  previousPapers: [],
  quizzes: [],
  loading: false,
  error: null,
};

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchAllMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchSyllabus.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchSyllabus.fulfilled, (state, action) => {
        state.loading = false;
        state.syllabus = action.payload;
      })
      .addCase(fetchSyllabus.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchPreviousPapers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchPreviousPapers.fulfilled, (state, action) => {
        state.loading = false;
        state.previousPapers = action.payload;
      })
      .addCase(fetchPreviousPapers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchQuizzes.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchQuizzes.fulfilled, (state, action) => {
        state.loading = false;
        state.quizzes = action.payload;
      })
      .addCase(fetchQuizzes.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default materialsSlice.reducer;