// src/features/materials/materialsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';

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