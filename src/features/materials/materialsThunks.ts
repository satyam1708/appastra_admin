// src/features/materials/materialsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Resource } from '@/src/types';

export const fetchAllMaterials = createAsyncThunk<any, void, { rejectValue: string }>(
  'materials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/materials');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch materials');
    }
  }
);

export const fetchSyllabus = createAsyncThunk<Resource[], void, { rejectValue: string }>(
  'materials/fetchSyllabus',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/materials/syllabus');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch syllabus');
    }
  }
);

export const fetchPreviousPapers = createAsyncThunk<Resource[], void, { rejectValue: string }>(
    'materials/fetchPreviousPapers',
    async (_, { rejectWithValue }) => {
      try {
        const response = await api.get('/materials/previous-papers');
        return response.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch previous papers');
      }
    }
  );