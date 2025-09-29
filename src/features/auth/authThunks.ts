// authThunks.ts - CORRECTED
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/request-otp`, { email });
      return { email, message: "OTP sent successfully" };
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
      // 🟢 FIX: Return the entire data payload so the frontend can check for 'token' or 'email'
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "OTP verification failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { email: string; name: string; phone: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, userData);
      // 🟢 Register also returns { token, user } in its data field
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Registration failed");
    }
  }
);