import { configureStore } from '@reduxjs/toolkit';
import { useDispatch } from 'react-redux';
import authReducer from '../features/auth/authSlice';
// import other slices when ready

export const store = configureStore({
  reducer: {
    auth: authReducer,
    // add other reducers here
  },
});

// Infer types for dispatch and state
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed useDispatch hook for convenience
export const useAppDispatch = () => useDispatch<AppDispatch>();
