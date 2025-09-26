// src/features/enrollments/enrollmentThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Enrollment } from '@/src/types';

export const fetchUserEnrollments = createAsyncThunk<Enrollment[], void, { rejectValue: string }>(
  'enrollments/fetchByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/enrollments'); // Assuming this is the new backend route
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue('Failed to fetch enrollments');
    }
  }
);

export const enrollInCourse = createAsyncThunk<Enrollment, { courseId: string; batchId?: string }, { rejectValue: string }>(
    'enrollments/enrollInCourse',
    async (enrollmentData, { rejectWithValue }) => {
      try {
        const response = await api.post('/enrollments', enrollmentData);
        return response.data.data;
      } catch (err: any) {
        return rejectWithValue('Failed to enroll in course');
      }
    }
  );