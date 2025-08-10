import axios from 'axios';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5050/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Optional: Add interceptors for token injection, error handling

export default api;
