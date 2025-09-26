// src/features/live/liveSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { LiveSession } from '@/src/types';
import { fetchLiveSessions } from './liveThunks';

interface LiveState {
  sessionsByClass: Record<string, LiveSession[]>;
  loading: boolean;
  error: string | null;
}

const initialState: LiveState = {
  sessionsByClass: {},
  loading: false,
  error: null,
};

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLiveSessions.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLiveSessions.fulfilled, (state, action) => {
        state.loading = false;
        state.sessionsByClass[action.meta.arg] = action.payload;
      })
      .addCase(fetchLiveSessions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default liveSlice.reducer;