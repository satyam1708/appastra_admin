// src/features/admin/adminThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { AdminStats, User } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchDashboardStats = createAsyncThunk<AdminStats, void, { rejectValue: string }>(
  'admin/fetchDashboardStats',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/admin/dashboard');
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch stats');
    }
  }
);

export const fetchAllUsers = createAsyncThunk<{users: User[], pagination: object}, { page?: number; limit?: number }, { rejectValue: string }>(
  'admin/fetchAllUsers',
  async ({ page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/admin/users?page=${page}&limit=${limit}`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch users');
    }
  }
);

export const updateUserRole = createAsyncThunk<User, { userId: string; role: User['role'] }, { rejectValue: string }>(
    'admin/updateUserRole',
    async ({ userId, role }, { rejectWithValue }) => {
      try {
        const response = await api.patch(`/admin/users/${userId}/role`, { role });
        return response.data.data;
      } catch (err: unknown) {
        const error = err as AxiosError<KnownError>;
        return rejectWithValue(error.response?.data?.message || 'Failed to update role');
      }
    }
  );