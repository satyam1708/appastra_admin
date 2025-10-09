// src/features/batches/batchesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { Batch } from "@/src/types";
import { AxiosError } from "axios";

// Define a type for the data needed to create a batch
interface CreateBatchData {
  name: string;
  description?: string;
  startDate: string; // Assuming ISO string date
  endDate?: string; // Assuming ISO string date
  isPaid?: boolean;
  price?: number;
  mrp?: number;
  imageUrl?: string;
  courseId: string;
}

// Define a type for the data needed to update a batch
interface UpdateBatchData {
  id: string;
  data: Partial<CreateBatchData>; // Not all fields are required for an update
}

interface KnownError {
  message: string;
}

// No changes needed for fetchBatchById
export const fetchBatchById = createAsyncThunk<
  Batch,
  string,
  { rejectValue: string }
>("batches/fetchBatchById", async (id, { rejectWithValue }) => {
  try {
    const response = await api.get(`/batches/${id}`);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch batch"
    );
  }
});

export const createBatch = createAsyncThunk<
  Batch,
  CreateBatchData, // Changed from any
  { rejectValue: string }
>("batches/createBatch", async (batchData, { rejectWithValue }) => {
  try {
    const response = await api.post("/batches", batchData);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to create batch"
    );
  }
});

export const updateBatch = createAsyncThunk<
  Batch,
  UpdateBatchData, // Changed from { id: string; data: any }
  { rejectValue: string }
>("batches/updateBatch", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/batches/${id}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update batch"
    );
  }
});

export const deleteBatch = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("batches/deleteBatch", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/batches/${id}`);
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete batch"
    );
  }
});