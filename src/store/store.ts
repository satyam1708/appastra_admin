// src/store/store.ts
import { configureStore } from "@reduxjs/toolkit";
import api, { setupInterceptors } from "../lib/api"; // 👈 Import api and setupInterceptors
import authReducer from "../features/auth/authSlice";
import coursesReducer from "../features/courses/coursesSlice";
import userReducer from "../features/user/userSlice";
import subjectsReducer from "../features/subjects/subjectsSlice";
import paymentReducer from "../features/payment/paymentSlice";
import classesReducer from "../features/classes/classesSlice";
import notificationsReducer from "../features/notifications/notificationsSlice";
import materialsReducer from "../features/materials/materialsSlice";
import adminReducer from "../features/admin/adminSlice";
import crmReducer from "../features/crm/crmSlice";
import liveReducer from "../features/live/liveSlice";
import testReducer from "../features/tests/testSlice";
import enrollmentReducer from "../features/enrollments/enrollmentSlice";
import progressReducer from "../features/progress/progressSlice";
import courseGoalReducer from "../features/courseGoal/courseGoalSlice";

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
    admin: adminReducer,
    crm: crmReducer,
    live: liveReducer,
    tests: testReducer,
    enrollments: enrollmentReducer,
    progress: progressReducer,
    courseGoal: courseGoalReducer,
  },
});

// 👈 Call the setup function here
setupInterceptors(store);

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
