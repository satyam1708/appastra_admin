// src/features/live/liveSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { LiveSession } from '@/src/types';
import { fetchLiveSessions, createLiveSession, endLiveSession } from './liveThunks';

interface LiveState {
  sessionsByClass: Record<string, LiveSession[]>;
  activeSession: LiveSession | null;
  loading: boolean;
  error: string | null;
}

const initialState: LiveState = {
  sessionsByClass: {},
  activeSession: null, 
  loading: false,
  error: null,
};

const liveSlice = createSlice({
  name: 'live',
  initialState,
  reducers: {
    clearActiveSession: (state) => {
        state.activeSession = null;
    }
  },
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
      })
      .addCase(createLiveSession.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createLiveSession.fulfilled, (state, action) => {
        state.loading = false;
        state.activeSession = action.payload; // ✅ Set the active session
      })
      .addCase(createLiveSession.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(endLiveSession.fulfilled, (state) => {
        state.loading = false;
        state.activeSession = null; // ✅ Clear the session on success
      });
  },
});

export const { clearActiveSession } = liveSlice.actions;
export default liveSlice.reducer;