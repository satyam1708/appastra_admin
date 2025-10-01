// src/features/progress/progressThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Progress } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchCourseProgress = createAsyncThunk<Progress, string, { rejectValue: string }>(
  'progress/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/progress/course/${courseId}`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch progress');
    }
  }
);

export const updateClassProgress = createAsyncThunk<Progress, string, { rejectValue: string }>(
    'progress/updateClass',
    async (classId, { rejectWithValue }) => {
      try {
        const response = await api.post(`/progress/class/${classId}`);
        return response.data.data;
      } catch (err: unknown) {
        const error = err as AxiosError<KnownError>;
        return rejectWithValue(error.response?.data?.message || 'Failed to update progress');
      }
    }
  );