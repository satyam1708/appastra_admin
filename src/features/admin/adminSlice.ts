// src/features/admin/adminSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { AdminStats, User } from '@/src/types';
import { fetchDashboardStats, fetchAllUsers } from './adminThunks';

interface AdminState {
  stats: AdminStats | null;
  users: User[];
  pagination: object | null;
  loading: boolean;
  error: string | null;
}

const initialState: AdminState = {
  stats: null,
  users: [],
  pagination: null,
  loading: false,
  error: null,
};

const adminSlice = createSlice({
  name: 'admin',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchDashboardStats.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchDashboardStats.fulfilled, (state, action: PayloadAction<AdminStats>) => {
        state.loading = false;
        state.stats = action.payload;
      })
      .addCase(fetchDashboardStats.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllUsers.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loading = false;
        state.users = action.payload.users;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default adminSlice.reducer;