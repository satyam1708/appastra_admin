// src/features/tests/testSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { TestSeries, Test, TestAttempt } from '@/src/types';
import { fetchTestSeries, fetchTestDetails, submitTestAttempt } from './testThunks';

interface TestState {
  testSeries: TestSeries[];
  currentTest: Test | null;
  testAttempt: TestAttempt | null;
  loading: boolean;
  error: string | null;
}

const initialState: TestState = {
  testSeries: [],
  currentTest: null,
  testAttempt: null,
  loading: false,
  error: null,
};

const testSlice = createSlice({
  name: 'tests',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchTestSeries.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchTestSeries.fulfilled, (state, action) => {
        state.loading = false;
        state.testSeries = action.payload;
      })
      .addCase(fetchTestSeries.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchTestDetails.fulfilled, (state, action) => {
        state.currentTest = action.payload;
      })
      .addCase(submitTestAttempt.fulfilled, (state, action) => {
        state.testAttempt = action.payload;
      });
  },
});

export default testSlice.reducer;