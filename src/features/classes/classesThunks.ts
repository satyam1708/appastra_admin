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
export const createClass = createAsyncThunk<Class, Partial<Class>, { rejectValue: string }>(
  'classes/create',
  async (classData, { rejectWithValue }) => {
    try {
      const { subjectId, ...data } = classData;
      const response = await api.post(`/classes/subject/${subjectId}`, data);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create class');
    }
  }
);

export const updateClass = createAsyncThunk<Class, Partial<Class>, { rejectValue: string }>(
  'classes/update',
  async (classData, { rejectWithValue }) => {
    try {
      // FIX: Explicitly pick only the fields allowed by the backend validation schema.
      const { id, title, description, videoUrl, isLive, startTime, endTime } = classData;
      
      const dataToUpdate: Partial<Class> = {
          title,
          description,
          videoUrl,
          isLive,
      };

      if (startTime) {
        dataToUpdate.startTime = new Date(startTime).toISOString();
      }
      if (endTime) {
        dataToUpdate.endTime = new Date(endTime).toISOString();
      }
      
      const response = await api.put(`/classes/${id}`, dataToUpdate);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to update class');
    }
  }
);
export const deleteClass = createAsyncThunk<string, string, { rejectValue: string }>(
  'classes/delete',
  async (classId, { rejectWithValue }) => {
    try {
      await api.delete(`/classes/${classId}`);
      return classId;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to delete class');
    }
  }
);