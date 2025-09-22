//authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/request-otp`, { email });
      return res.data.message;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk(
  "auth/verifyOtp",
  async ({ email, otp }: { email: string; otp: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      return res.data.data.token;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);
