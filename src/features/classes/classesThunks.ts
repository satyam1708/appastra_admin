// src/features/classes/classesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Class } from '@/src/types';

export const fetchClassesBySubject = createAsyncThunk<Class[], string, { rejectValue: string }>(
  'classes/fetchBySubject',
  async (subjectId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/classes/subject/${subjectId}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch classes');
    }
  }
);