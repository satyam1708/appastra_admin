// src/features/materials/materialsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';

export const fetchAllMaterials = createAsyncThunk<any, void, { rejectValue: string }>(
  'materials/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      // ✅ CORRECTED PATH
      const response = await api.get('/materials/resources');
      return response.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch materials');
    }
  }
);

// Keep the other thunks as they are
export const fetchSyllabus = createAsyncThunk<any, void, { rejectValue: string }>(
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

export const fetchPreviousPapers = createAsyncThunk<any, void, { rejectValue: string }>(
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