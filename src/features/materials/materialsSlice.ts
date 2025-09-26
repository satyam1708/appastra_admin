// src/features/materials/materialsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchAllMaterials } from './materialsThunks';

interface MaterialsState {
  resources: any; // Consider creating a specific type for this
  loading: boolean;
  error: string | null;
}

const initialState: MaterialsState = {
  resources: {},
  loading: false,
  error: null,
};

const materialsSlice = createSlice({
  name: 'materials',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllMaterials.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAllMaterials.fulfilled, (state, action) => {
        state.loading = false;
        state.resources = action.payload;
      })
      .addCase(fetchAllMaterials.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default materialsSlice.reducer;