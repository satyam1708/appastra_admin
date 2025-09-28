// src/features/courses/coursesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api"; // 👈 Import your configured api instance
import { Course } from "@/src/types";

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
// 👇 Add this new thunk to fetch a course by its slug
export const fetchCourseBySlug = createAsyncThunk<Course, string, { rejectValue: string }>(
  'courses/fetchCourseBySlug',
  async (slug, { rejectWithValue }) => {
    try {
      const response = await api.get(`/courses/slug/${slug}`);
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch course');
    }
  }
);