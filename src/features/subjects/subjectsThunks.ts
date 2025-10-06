// src/features/subjects/subjectsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Subject } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchSubjectsByCourse = createAsyncThunk<Subject[], string, { rejectValue: string }>(
  'subjects/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects/course/${courseId}`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch subjects');
    }
  }
);
export const createSubject = createAsyncThunk<Subject, { courseId: string; name: string; description?: string }, { rejectValue: string }>(
  'subjects/create',
  async (subjectData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/subjects/course/${subjectData.courseId}`, { name: subjectData.name, description: subjectData.description });
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create subject');
    }
  }
);