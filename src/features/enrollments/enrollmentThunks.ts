// src/features/enrollments/enrollmentThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Enrollment } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchUserEnrollments = createAsyncThunk<Enrollment[], void, { rejectValue: string }>(
  'enrollments/fetchByUser',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/enrollments');
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch enrollments');
    }
  }
);

export const enrollInCourse = createAsyncThunk<Enrollment, { courseId: string; batchId?: string }, { rejectValue: string }>(
    'enrollments/enrollInCourse',
    async (enrollmentData, { rejectWithValue }) => {
      try {
        const response = await api.post('/enrollments', enrollmentData);
        return response.data.data;
      } catch (err: unknown) {
        const error = err as AxiosError<KnownError>;
        return rejectWithValue(error.response?.data?.message || 'Failed to enroll in course');
      }
    }
  );