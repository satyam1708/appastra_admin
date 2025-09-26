// src/features/payment/paymentSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { PaymentOrder } from '@/src/types';
import { createPaymentOrder } from './paymentThunks';

interface PaymentState {
  order: PaymentOrder | null;
  loading: boolean;
  error: string | null;
}

const initialState: PaymentState = {
  order: null,
  loading: false,
  error: null,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createPaymentOrder.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createPaymentOrder.fulfilled, (state, action) => {
        state.loading = false;
        state.order = action.payload;
      })
      .addCase(createPaymentOrder.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export default paymentSlice.reducer;