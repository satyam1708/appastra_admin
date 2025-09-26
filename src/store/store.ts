// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import coursesReducer from "../features/courses/coursesSlice";
import userReducer from "../features/user/userSlice";
import subjectsReducer from "../features/subjects/subjectsSlice";
import paymentReducer from "../features/payment/paymentSlice";
// Add other reducers as you create them

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
    subjects: subjectsReducer,
    payment: paymentReducer,
    // ... add other reducers here
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;