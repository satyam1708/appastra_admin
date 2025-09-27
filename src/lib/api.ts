// src/lib/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:5050/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Interceptor to add the auth token to every request
// We will move this logic into a setup function
export const setupInterceptors = (store: any) => {
  api.interceptors.request.use((config) => {
    const token = store.getState().auth.token;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  }, (error) => {
    return Promise.reject(error);
  });
};

export default api;