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
      const dataToSend = {
        ...batchData,
        startDate: batchData.startDate ? new Date(batchData.startDate).toISOString() : undefined,
        endDate: batchData.endDate ? new Date(batchData.endDate).toISOString() : undefined,
        price: batchData.price ? parseFloat(batchData.price as any) : undefined,
        mrp: batchData.mrp ? parseFloat(batchData.mrp as any) : undefined,
      };

      const response = await api.post('/batches', dataToSend);
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
      // FIX: Explicitly pick only the fields allowed by the backend validation schema.
      const { id, name, description, startDate, endDate, isPaid, price, mrp, imageUrl } = batchData;
      
      const dataToUpdate: Partial<Batch> = {
        name,
        description,
        isPaid,
        price: price ? parseFloat(price as any) : undefined,
        mrp: mrp ? parseFloat(mrp as any) : undefined,
        imageUrl,
      };

      if (startDate) {
        dataToUpdate.startDate = new Date(startDate).toISOString();
      }
      if (endDate) {
        dataToUpdate.endDate = new Date(endDate).toISOString();
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