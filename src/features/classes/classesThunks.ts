// src/features/classes/classesThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { Class as ClassType } from "@/src/types";
import { AxiosError } from "axios";

interface KnownError {
  message: string;
}

// Thunk to fetch classes for a specific subject
export const fetchClassesBySubject = createAsyncThunk<
  { subjectId: string; classes: ClassType[] },
  string,
  { rejectValue: string }
>("classes/fetchBySubject", async (subjectId, { rejectValue }) => {
  try {
    const response = await api.get(`/classes/subject/${subjectId}`);
    return { subjectId, classes: response.data.data };
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectValue(
      error.response?.data?.message || "Failed to fetch classes"
    );
  }
});

// Thunk to create a new class
export const createClass = createAsyncThunk<
  ClassType,
  { subjectId: string; data: Partial<ClassType> },
  { rejectValue: string }
>("classes/createClass", async ({ subjectId, data }, { rejectValue }) => {
  try {
    const response = await api.post(`/classes/subject/${subjectId}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectValue(
      error.response?.data?.message || "Failed to create class"
    );
  }
});

// Thunk to update a class
export const updateClass = createAsyncThunk<
  ClassType,
  { id: string; data: Partial<ClassType> },
  { rejectValue: string }
>("classes/updateClass", async ({ id, data }, { rejectValue }) => {
  try {
    const response = await api.put(`/classes/${id}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectValue(
      error.response?.data?.message || "Failed to update class"
    );
  }
});

// Thunk to delete a class
export const deleteClass = createAsyncThunk<
  string, // Return the deleted class's ID
  string,
  { rejectValue: string }
>("classes/deleteClass", async (id, { rejectValue }) => {
  try {
    await api.delete(`/classes/${id}`);
    return id; // Return the ID on success for the reducer
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectValue(
      error.response?.data?.message || "Failed to delete class"
    );
  }
});
