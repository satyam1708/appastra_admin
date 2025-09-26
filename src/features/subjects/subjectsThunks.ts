// src/features/subjects/subjectsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Subject } from '@/src/types';

export const fetchSubjectsByCourse = createAsyncThunk<Subject[], string, { rejectValue: string }>(
  'subjects/fetchByCourse',
  async (courseId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subjects/course/${courseId}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch subjects');
    }
  }
);