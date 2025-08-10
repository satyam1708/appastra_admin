// features/auth/authSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  user: null,
  authenticated: false,
  loading: false,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setUser(state, action) {
      state.user = action.payload;
      state.authenticated = !!action.payload;
    },
    logout(state) {
      state.user = null;
      state.authenticated = false;
    },
    setLoading(state, action) {
      state.loading = action.payload;
    }
  },
});

export const { setUser, logout, setLoading } = authSlice.actions;
export default authSlice.reducer;
