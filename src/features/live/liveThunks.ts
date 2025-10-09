// src/features/live/liveThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { LiveSession } from '@/src/types';
import { AxiosError } from 'axios';

interface KnownError {
  message: string;
}

export const fetchLiveSessions = createAsyncThunk<LiveSession[], string, { rejectValue: string }>(
  'live/fetchSessions',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/live/${classId}/livesessions`);
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch live sessions');
    }
  }
);
// ✅ ADD THIS NEW THUNK
export const createLiveSession = createAsyncThunk<LiveSession, string, { rejectValue: string }>(
  'live/createSession',
  async (classId, { rejectWithValue }) => {
    try {
      const response = await api.post(`/live/${classId}/livesessions`, {
        // The backend requires a startedAt timestamp
        startedAt: new Date().toISOString(),
      });
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to start live session');
    }
  }
);

// ✅ ADD THIS THUNK TO END THE SESSION
export const endLiveSession = createAsyncThunk<LiveSession, string, { rejectValue: string }>(
  'live/endSession',
  async (sessionId, { rejectWithValue }) => {
    try {
      const response = await api.patch(`/live/livesessions/${sessionId}/end`, {
        endedAt: new Date().toISOString(),
      });
      return response.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || 'Failed to end session');
    }
  }
);