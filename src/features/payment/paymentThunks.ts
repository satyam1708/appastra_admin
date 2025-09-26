// src/features/payment/paymentThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { PaymentOrder } from '@/src/types';

interface OrderPayload {
  courseId?: string;
  testSeriesId?: string;
}

export const createPaymentOrder = createAsyncThunk<PaymentOrder, OrderPayload, { rejectValue: string }>(
  'payment/createOrder',
  async (orderData, { rejectWithValue }) => {
    try {
      const response = await api.post('/payment/create-order', orderData);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to create order');
    }
  }
);