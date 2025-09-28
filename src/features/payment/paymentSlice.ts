// src/features/payment/paymentSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { PaymentOrder } from '@/src/types';
import { createPaymentOrder, validateCoupon } from './paymentThunks';


interface PaymentState {
  order: PaymentOrder | null;
  loading: boolean;
  error: string | null;
  coupon: Coupon | null; // 👈 Add coupon state
  discount: number; 
}

const initialState: PaymentState = {
  order: null,
  loading: false,
  error: null,
  coupon: null,
  discount: 0,
};

const paymentSlice = createSlice({
  name: 'payment',
  initialState,
  reducers: {
    // Action to clear coupon details when the modal is closed
    clearCoupon: (state) => {
      state.coupon = null;
      state.discount = 0;
    },
  },
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
      })
      .addCase(validateCoupon.pending, (state) => {
        state.loading = true;
        state.coupon = null;
        state.discount = 0;
      })
      .addCase(validateCoupon.fulfilled, (state, action) => {
        state.loading = false;
        state.coupon = action.payload.coupon;
        state.discount = action.payload.discount;
      })
      .addCase(validateCoupon.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.coupon = null;
        state.discount = 0;
      });;
  },
});

export const { clearCoupon } = paymentSlice.actions;
export default paymentSlice.reducer;