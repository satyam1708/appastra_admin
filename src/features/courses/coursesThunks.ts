// src/features/courses/coursesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api"; // 👈 Import your configured api instance

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      // No need to manually get token, the api interceptor handles it
      const res = await api.get("/courses");
      return res.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || "Failed to fetch courses");
    }
  }
);