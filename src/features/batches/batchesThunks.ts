// src/features/batches/batchesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Batch } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const createBatch = createAsyncThunk<Batch, Partial<Batch>, { rejectValue: string }>(
  'batches/create',
  async (batchData, { rejectWithValue }) => {
    try {
      const response = await api.post('/batches', batchData);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create batch');
    }
  }
);

export const updateBatch = createAsyncThunk<Batch, Partial<Batch>, { rejectValue: string }>(
  'batches/update',
  async (batchData, { rejectWithValue }) => {
    try {
      // FIX: Remove non-editable fields from the batch data payload.
      const { id, subjects, classes, ...dataToUpdate } = batchData;
      
      // Also ensure price and mrp are numbers
      if (dataToUpdate.price) {
        dataToUpdate.price = parseFloat(dataToUpdate.price as any);
      }
      if (dataToUpdate.mrp) {
        dataToUpdate.mrp = parseFloat(dataToUpdate.mrp as any);
      }

      const response = await api.put(`/batches/${id}`, dataToUpdate);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to update batch');
    }
  }
);

export const deleteBatch = createAsyncThunk<string, string, { rejectValue: string }>(
  'batches/delete',
  async (batchId, { rejectWithValue }) => {
    try {
      await api.delete(`/batches/${batchId}`);
      return batchId;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to delete batch');
    }
  }
);