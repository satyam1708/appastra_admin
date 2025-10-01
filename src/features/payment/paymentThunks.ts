// src/features/payment/paymentThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { PaymentOrder } from "@/src/types";
import { Coupon } from "@/src/types";
import { AxiosError } from "axios";

interface OrderPayload {
  courseId?: string;
  testSeriesId?: string;
}

interface KnownError {
  message: string;
}

export const createPaymentOrder = createAsyncThunk<
  PaymentOrder,
  OrderPayload,
  { rejectValue: string }
>("payment/createOrder", async (orderData, { rejectWithValue }) => {
  try {
    const response = await api.post("/payment/create-order", orderData);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to create order"
    );
  }
});

export const validateCoupon = createAsyncThunk<
  { coupon: Coupon; discount: number },
  { code: string; price: number },
  { rejectValue: string }
>("payment/validateCoupon", async ({ code, price }, { rejectWithValue }) => {
  try {
    const response = await api.post("/coupons/validate", { code });
    const coupon: Coupon = response.data.data;

    // Calculate the discount
    let discount = (price * coupon.discountPercent) / 100;
    if (coupon.maxDiscount && discount > coupon.maxDiscount) {
      discount = coupon.maxDiscount;
    }

    return { coupon, discount };
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Invalid Coupon Code"
    );
  }
});