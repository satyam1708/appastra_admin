// src/features/crm/crmThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { Lead } from '@/src/types';
import { AxiosError } from 'axios';

type LeadInput = Omit<Lead, 'id' | 'createdAt' | 'updatedAt' | 'status'>;

interface KnownError {
  message: string;
}

export const createLead = createAsyncThunk<Lead, LeadInput, { rejectValue: string }>(
  'crm/createLead',
  async (leadData, { rejectWithValue }) => {
    try {
      const response = await api.post('/crm/leads', leadData);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to create lead');
    }
  }
);

export const fetchLeads = createAsyncThunk<{leads: Lead[], pagination: object}, { page?: number; limit?: number; status?: string }, { rejectValue: string }>(
  'crm/fetchLeads',
  async ({ page = 1, limit = 10, status }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/crm/leads?page=${page}&limit=${limit}${status ? `&status=${status}` : ''}`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch leads');
    }
  }
);