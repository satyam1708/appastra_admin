// src/features/subjects/subjectsThunks.ts
import { createAsyncThunk } from "@reduxjs/toolkit";
import api from "@/src/lib/api";
import { Subject } from "@/src/types";
import { AxiosError } from "axios";
import { RootState } from "@/src/store/store"; // Import RootState

interface KnownError {
  message: string;
}

// Thunk to fetch subjects for a specific course
export const fetchSubjectsByCourse = createAsyncThunk<
  { courseId: string; subjects: Subject[] },
  string,
  { rejectValue: string }
>("subjects/fetchByCourse", async (courseId, { rejectWithValue }) => {
  try {
    const response = await api.get(`/subjects/course/${courseId}`);
    return { courseId, subjects: response.data.data };
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to fetch subjects"
    );
  }
});

// Thunk to create a new subject
// FIX: Update the thunk to access state and modify its return type
export const createSubject = createAsyncThunk<
  { subject: Subject; courseId: string }, // Return both the subject and the courseId
  { batchId: string; data: Partial<Subject> },
  { state: RootState; rejectValue: string } // Allow access to the global state
>(
  "subjects/createSubject",
  async ({ batchId, data }, { getState, rejectWithValue }) => {
    try {
      const response = await api.post(`/subjects/batch/${batchId}`, data);
      const newSubject = response.data.data as Subject;

      // Get courseId from the current course in the state
      const state = getState();
      const courseId = state.courses.currentCourse?.id;

      if (!courseId) {
        throw new Error("Could not find the current course to associate the subject with.");
      }

      return { subject: newSubject, courseId };
    } catch (err: unknown) {
      const error = err as AxiosError<KnownError>;
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subject"
      );
    }
  }
);


// Thunk to update a subject
export const updateSubject = createAsyncThunk<
  Subject,
  { id: string; data: Partial<Subject> },
  { rejectValue: string }
>("subjects/updateSubject", async ({ id, data }, { rejectWithValue }) => {
  try {
    const response = await api.put(`/subjects/${id}`, data);
    return response.data.data;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to update subject"
    );
  }
});

// Thunk to delete a subject
export const deleteSubject = createAsyncThunk<
  void,
  string,
  { rejectValue: string }
>("subjects/deleteSubject", async (id, { rejectWithValue }) => {
  try {
    await api.delete(`/subjects/${id}`);
    // Return the ID on success for the reducer
    return;
  } catch (err: unknown) {
    const error = err as AxiosError<KnownError>;
    return rejectWithValue(
      error.response?.data?.message || "Failed to delete subject"
    );
  }
});