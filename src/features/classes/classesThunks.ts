// src/features/classes/classesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Class } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchClassesBySubject = createAsyncThunk<Class[], string, { rejectValue: string }>(
  'classes/fetchBySubject',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/classes/subject/${subjectId}`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch classes');
    }
  }
);
export const createClass = createAsyncThunk<Class, { subjectId: string; title: string; description?: string; videoUrl?: string }, { rejectValue: string }>(
  'classes/create',
  async (classData, { rejectWithValue }) => {
    try {
      const response = await api.post(`/classes/subject/${classData.subjectId}`, { title: classData.title, description: classData.description, videoUrl: classData.videoUrl });
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
  }
);