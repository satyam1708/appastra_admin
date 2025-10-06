// src/features/batches/batchesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Batch } from '@/src/types';
import { createBatch, updateBatch, deleteBatch } from './batchesThunks';

interface BatchesState {
  loading: boolean;
  error: string | null;
}

const initialState: BatchesState = {
  loading: false,
  error: null,
};

const batchesSlice = createSlice({
  name: 'batches',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createBatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(createBatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(createBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(updateBatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(updateBatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(updateBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(deleteBatch.pending, (state) => {
        state.loading = true;
      })
      .addCase(deleteBatch.fulfilled, (state) => {
        state.loading = false;
      })
      .addCase(deleteBatch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default batchesSlice.reducer;