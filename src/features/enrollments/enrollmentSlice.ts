// src/features/enrollments/enrollmentSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Enrollment } from '@/src/types';
import { fetchUserEnrollments, enrollInCourse } from './enrollmentThunks';

interface EnrollmentState {
  enrollments: Enrollment[];
  loading: boolean;
  error: string | null;
}

const initialState: EnrollmentState = {
  enrollments: [],
  loading: false,
  error: null,
};

const enrollmentSlice = createSlice({
  name: 'enrollments',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchUserEnrollments.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchUserEnrollments.fulfilled, (state, action) => {
        state.loading = false;
        state.enrollments = action.payload;
      })
      .addCase(enrollInCourse.fulfilled, (state, action) => {
        state.enrollments.push(action.payload);
      });
  },
});

export default enrollmentSlice.reducer;