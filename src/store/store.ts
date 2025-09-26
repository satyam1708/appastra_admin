// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import authReducer from "../features/auth/authSlice";
import coursesReducer from "../features/courses/coursesSlice";
import userReducer from "../features/user/userSlice";
import subjectsReducer from "../features/subjects/subjectsSlice";
import paymentReducer from "../features/payment/paymentSlice";
import classesReducer from "../features/classes/classesSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import materialsReducer from "../features/materials/materialsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    courses: coursesReducer,
    user: userReducer,
    subjects: subjectsReducer,
    payment: paymentReducer,
    classes: classesReducer,
    notifications: notificationsReducer,
    materials: materialsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;