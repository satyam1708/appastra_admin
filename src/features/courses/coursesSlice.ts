// src/features/courses/coursesSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Course } from '@/src/types';
import { fetchCourses, fetchCourseBySlug, createCourse, updateCourse, deleteCourse } from './coursesThunks';

interface CoursesState {
  courses: Course[];
  currentCourse: Course | null;
  loading: boolean;
  error: string | null;
}

const initialState: CoursesState = {
  courses: [],
  currentCourse: null,
  loading: false,
  error: null,
};

const coursesSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch all courses
      .addCase(fetchCourses.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourses.fulfilled, (state, action: PayloadAction<Course[]>) => {
        state.loading = false;
        state.courses = action.payload;
      })
      .addCase(fetchCourses.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch courses';
      })
      // Fetch single course by slug
      .addCase(fetchCourseBySlug.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCourseBySlug.fulfilled, (state, action: PayloadAction<Course>) => {
        state.loading = false;
        state.currentCourse = action.payload;
      })
      .addCase(fetchCourseBySlug.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload || 'Failed to fetch course';
      })
      // Create course
      .addCase(createCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        state.courses.push(action.payload);
      })
      // Update course
      .addCase(updateCourse.fulfilled, (state, action: PayloadAction<Course>) => {
        const index = state.courses.findIndex(course => course.id === action.payload.id);
        if (index !== -1) {
          state.courses[index] = action.payload;
        }
        if (state.currentCourse?.id === action.payload.id) {
          state.currentCourse = action.payload;
        }
      })
      // Delete course
      .addCase(deleteCourse.fulfilled, (state, action) => {
        // FIX: Filter by the slug passed to the thunk, which is in action.meta.arg
        const deletedSlug = action.meta.arg;
        state.courses = state.courses.filter(course => course.slug !== deletedSlug);
      });
  },
});

export default coursesSlice.reducer;