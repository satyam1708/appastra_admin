// src/features/tests/testThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import api from '@/src/lib/api';
import { TestSeries, Test, TestAttempt } from '@/src/types';

export const fetchTestSeries = createAsyncThunk<TestSeries[], void, { rejectValue: string }>(
  'tests/fetchTestSeries',
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get('/materials/test-series');
      return response.data.data;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Failed to fetch test series');
    }
  }
);

export const fetchTestDetails = createAsyncThunk<Test, string, { rejectValue: string }>(
    'tests/fetchTestDetails',
    async (testId, { rejectWithValue }) => {
      try {
        const response = await api.get(`/materials/tests/${testId}`);
        return response.data.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to fetch test details');
      }
    }
);

export const submitTestAttempt = createAsyncThunk<TestAttempt, { testId: string; responses: any }, { rejectValue: string }>(
    'tests/submitAttempt',
    async ({ testId, responses }, { rejectWithValue }) => {
      try {
        const response = await api.post(`/materials/tests/${testId}/attempt`, { responses });
        return response.data.data;
      } catch (err: any) {
        return rejectWithValue(err.response?.data?.message || 'Failed to submit test');
      }
    }
);