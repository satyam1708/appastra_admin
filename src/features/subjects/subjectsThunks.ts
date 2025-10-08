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
export const createSubject = createAsyncThunk<Subject, Partial<Subject> & { batchId: string }, { rejectValue: string }>(
  'subjects/create',
  async (subjectData, { rejectWithValue }) => {
    const { batchId, ...data } = subjectData;
    try {
      const response = await api.post(`/subjects/batch/${batchId}`, data);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create subject');
    }
  }
);

export const updateSubject = createAsyncThunk<Subject, Partial<Subject>, { rejectValue: string }>(
  'subjects/update',
  async (subjectData, { rejectWithValue }) => {
    try {
      // FIX: Only include 'name' and 'description' for updates.
      const { id, name, description } = subjectData;
      const dataToUpdate = { name, description };

      const response = await api.put(`/subjects/${id}`, dataToUpdate);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to update subject');
    }
  }
);

export const deleteSubject = createAsyncThunk<string, string, { rejectValue: string }>(
  'subjects/delete',
  async (subjectId, { rejectWithValue }) => {
    try {
      await api.delete(`/subjects/${subjectId}`);
      return subjectId;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to delete subject');
    }
  }
);