// src/features/auth/authSlice.ts
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestOtp, verifyOtp, registerUser } from './authThunks';
import { User } from '@/src/types';

// This interface defines the complete state for your authentication flow
interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
  isAuthModalOpen: boolean;
  authStep: 'email' | 'otp' | 'register';
  emailForOtp: string;
}

const initialState: AuthState = {
  user: null,
  token: null, // Start with null, we'll load from storage on the client
  isAuthenticated: false,
  loading: false,
  error: null,
  isAuthModalOpen: false,
  authStep: 'email',
  emailForOtp: '',
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // 👇 FIX: These are the functions your components need
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
      state.authStep = 'email';
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthStep: (state, action: PayloadAction<'email' | 'otp' | 'register'>) => {
      state.authStep = action.payload;
    },
    // This action will be used to safely load the token on the client
    loadTokenFromStorage: (state) => {
        const token = localStorage.getItem('token');
        if (token) {
            state.token = token;
            state.isAuthenticated = true;
        }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    // This handles the async logic
    builder
      .addCase(requestOtp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(requestOtp.fulfilled, (state, action) => {
        state.loading = false;
        state.emailForOtp = action.payload.email;
        state.authStep = 'otp';
      })
      .addCase(requestOtp.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        if (action.payload.status === 'existing') {
          state.isAuthenticated = true;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.isAuthModalOpen = false;
          localStorage.setItem('token', action.payload.token);
        } else {
          state.authStep = 'register';
        }
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token;
        state.user = action.payload.user;
        state.isAuthModalOpen = false;
        localStorage.setItem('token', action.payload.token);
      });
  },
});

export const { openAuthModal, closeAuthModal, setAuthStep, loadTokenFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;