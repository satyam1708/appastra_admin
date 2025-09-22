//authSlice.ts
import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  user: null | { email: string }; // keep minimal since backend only gives email + token
  token: string | null;
}

const initialState: AuthState = {
  user: null,
  token: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials: (
      state,
      action: PayloadAction<{ user: AuthState["user"]; token: string }>
    ) => {
      state.user = action.payload.user;
      state.token = action.payload.token;

      // persist token in localStorage
      if (action.payload.token) {
        localStorage.setItem("token", action.payload.token);
        if (action.payload.user?.email) {
          localStorage.setItem("userEmail", action.payload.user.email);
        }
      }
    },
    loadFromStorage: (state) => {
      const token = localStorage.getItem("token");
      const email = localStorage.getItem("userEmail");
      if (token) {
        state.token = token;
        state.user = email ? { email } : null;
      }
    },
    logout: (state) => {
      state.user = null;
      state.token = null;
      localStorage.removeItem("token");
      localStorage.removeItem("userEmail");
    },
  },
});

export const { setCredentials, loadFromStorage, logout } = authSlice.actions;

export default authSlice.reducer;
