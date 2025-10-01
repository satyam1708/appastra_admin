// src/features/materials/materialsThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { AxiosError } from "axios";
import { Resource, Quiz } from "@/src/types";

interface KnownError {
    message: string;
}

export const fetchAllMaterials = createAsyncThunk<
  Record<string, Resource[]>,
  void,
  { rejectValue: string }
>("materials/fetchAll", async (_, { rejectWithValue }) => {
  try {
    // ✅ CORRECTED PATH
    const response = await api.get("/materials/resources");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch materials"
    );
  }
});

// Keep the other thunks as they are
export const fetchSyllabus = createAsyncThunk<
  Resource[],
  void,
  { rejectValue: string }
>("materials/fetchSyllabus", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/materials/syllabus");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch syllabus"
    );
  }
});

export const fetchPreviousPapers = createAsyncThunk<
  Resource[],
  void,
  { rejectValue: string }
>("materials/fetchPreviousPapers", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/materials/previous-papers");
    return response.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch previous papers"
    );
  }
});

export const fetchQuizzes = createAsyncThunk<
  Quiz[],
  void,
  { rejectValue: string }
>("materials/fetchQuizzes", async (_, { rejectWithValue }) => {
  try {
    const response = await api.get("/materials/quizzes");
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch quizzes"
    );
  }
});