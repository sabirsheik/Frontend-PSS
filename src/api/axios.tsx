// src/api/axios.ts
import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

api.interceptors.response.use(
  res => res,
  err => {
    const message =
      err?.response?.data?.message || 'Something went wrong';
    throw new Error(message);
  }
);

export default api;
