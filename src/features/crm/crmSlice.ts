// src/features/crm/crmSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { Lead } from '@/src/types';
import { fetchLeads, createLead } from './crmThunks';

interface CrmState {
  leads: Lead[];
  pagination: object | null;
  loading: boolean;
  error: string | null;
}

const initialState: CrmState = {
  leads: [],
  pagination: null,
  loading: false,
  error: null,
};

const crmSlice = createSlice({
  name: 'crm',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchLeads.pending, (state) => {
        state.loading = true;
      })
      .addCase(fetchLeads.fulfilled, (state, action) => {
        state.loading = false;
        state.leads = action.payload.leads;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchLeads.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createLead.fulfilled, (state, action) => {
        // Optionally add the new lead to the state
        state.leads.unshift(action.payload);
      });
  },
});

export default crmSlice.reducer;