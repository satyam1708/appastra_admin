// src/features/live/liveThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { LiveSession } from '@/src/types';

export const fetchLiveSessions = createAsyncThunk<LiveSession[], string, { rejectValue: string }>(
  'live/fetchSessions',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/live/${classId}/livesessions`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch live sessions');
    }
  }
);