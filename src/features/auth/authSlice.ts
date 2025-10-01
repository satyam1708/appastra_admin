import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import { requestOtp, verifyOtp, registerUser } from './authThunks';
import { User } from '@/src/types';

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
    openAuthModal: (state) => {
      state.isAuthModalOpen = true;
      state.authStep = 'email'; // Always start at the email step
      state.error = null;
    },
    closeAuthModal: (state) => {
      state.isAuthModalOpen = false;
    },
    setAuthStep: (state, action: PayloadAction<'email' | 'otp' | 'register'>) => {
      state.authStep = action.payload;
    },
    // Safely loads token on the client-side to prevent hydration errors
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
          state.token = action.payload.token ?? null;
          state.user = action.payload.user ?? null; // ✅ FIXED
          state.isAuthModalOpen = false;
          if (action.payload.token) {
            localStorage.setItem('token', action.payload.token);
          }
        } else {
          state.emailForOtp = action.payload.email ?? '';
          state.authStep = 'register';
        }
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.isAuthenticated = true;
        state.token = action.payload.token ?? null;
        state.user = action.payload.user ?? null; // ✅ FIXED
        state.isAuthModalOpen = false;
        if (action.payload.token) {
            localStorage.setItem('token', action.payload.token);
        }
      });
  },
});

export const { openAuthModal, closeAuthModal, setAuthStep, loadTokenFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;