// src/features/user/userThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { User } from '@/src/types';

export const fetchUserProfile = createAsyncThunk<User, void, { rejectValue: string }>(
  'user/fetchProfile',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/users/profile');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch profile');
    }
  }
);

export const updateUserProfile = createAsyncThunk<User, Partial<User>, { rejectValue: string }>(
  'user/updateProfile',
  async (profileData, { rejectWithValue }) => {
    try {
      const response = await api.put('/users/profile', profileData);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to update profile');
    }
  }
);