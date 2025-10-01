// src/features/auth/authThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import axios, { AxiosError } from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api";

interface AuthResponse {
  token?: string;
  user?: any;
  email?: string;
  status?: string;
}

interface KnownError {
  message: string;
}

export const requestOtp = createAsyncThunk(
  "auth/requestOtp",
  async (email: string, { rejectWithValue }) => {
    try {
      await axios.post(`${API_BASE}/auth/request-otp`, { email });
      return { email, message: "OTP sent successfully" };
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || "Failed to send OTP");
    }
  }
);

export const verifyOtp = createAsyncThunk<AuthResponse, { email: string; otp: string }, { rejectValue: string }>(
  "auth/verifyOtp",
  async ({ email, otp }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/verify-otp`, { email, otp });
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || "OTP verification failed");
    }
  }
);

export const registerUser = createAsyncThunk(
  "auth/registerUser",
  async (userData: { email: string; name: string; phone: string; password: string }, { rejectWithValue }) => {
    try {
      const res = await axios.post(`${API_BASE}/auth/register`, userData);
      return res.data.data;
    } catch (err: unknown) {
        const error = err as AxiosError<KnownError>;
      return rejectWithValue(error.response?.data?.message || "Registration failed");
    }
  }
);