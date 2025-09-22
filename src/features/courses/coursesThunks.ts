import { createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL;

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { getState, rejectWithValue }) => {
    try {
      const state: any = getState();
      const token = state.auth.token;

      const res = await axios.get(`${API_BASE}/courses`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
    }
  }
);
