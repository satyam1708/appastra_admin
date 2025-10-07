// src/features/courses/coursesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api"; // 👈 Import your configured api instance
import { Course } from "@/src/types";
import { AxiosError } from "axios";

interface KnownError {
  message: string;
}

export const fetchCourses = createAsyncThunk(
  "courses/fetchCourses",
  async (_, { rejectWithValue }) => {
    try {
      // No need to manually get token, the api interceptor handles it
      const res = await api.get("/courses");
      return res.data.data;
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch courses"
      );
    }
  }
);
// 👇 Add this new thunk to fetch a course by its slug
export const fetchCourseBySlug = createAsyncThunk<
  Course,
  string,
  { rejectValue: string }
>("courses/fetchCourseBySlug", async (slug, { rejectWithValue }) => {
  try {
    const response = await api.get(`/courses/slug/${slug}`);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch course"
    );
  }
});

export const createCourse = createAsyncThunk<
  Course,
  Partial<Course>,
  { rejectValue: string }
>("courses/createCourse", async (courseData, { rejectWithValue }) => {
  try {
    const response = await api.post("/courses", courseData);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to create course"
    );
  }
});
export const updateCourse = createAsyncThunk<
  Course,
  Partial<Course>,
  { rejectValue: string }
>("courses/updateCourse", async (courseData, { rejectWithValue }) => {
  try {
    // FIX: Destructure id from courseData and use it in the URL.
    const { id, ...data } = courseData;
    const response = await api.put(`/courses/${id}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update course"
    );
  }
});

export const deleteCourse = createAsyncThunk<
  string,
  string,
  { rejectValue: string }
>("courses/deleteCourse", async (courseId, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${courseId}`);
    return courseId;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete course"
    );
  }
});
