// src/features/courses/coursesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { Course } from "@/src/types";
import { AxiosError } from "axios";

// Define a type for the data needed to create a course
interface CreateCourseData {
  name: string;
  description?: string;
  imageUrl?: string;
}

// Define a type for the data needed to update a course
interface UpdateCourseData {
  slug: string;
  data: Partial<CreateCourseData>; // Use Partial as not all fields are required for an update
}

interface KnownError {
  message: string;
}

export const fetchCourses = createAsyncThunk<
  Course[],
  void,
  { rejectValue: string }
>("courses/fetchCourses", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/courses");
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch courses"
    );
  }
});

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
  CreateCourseData, // Changed from any
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
  UpdateCourseData, // Changed from { slug: string; data: any }
  { rejectValue: string }
>("courses/updateCourse", async ({ slug, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/courses/${slug}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update course"
    );
  }
});

export const deleteCourse = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("courses/deleteCourse", async (slug, { rejectWithValue }) => {
  try {
    await api.delete(`/courses/${slug}`);
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete course"
    );
  }
});