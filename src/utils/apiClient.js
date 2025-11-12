import axios from "axios";

// Base URL dari env, dukung dua nama variabel agar tidak mismatch
const BASE_URL =
  (import.meta?.env?.VITE_API_BASE_URL) ||
  (import.meta?.env?.VITE_API_URL) ||
  "http://127.0.0.1:8000/api";

const apiClient = axios.create({
  baseURL: BASE_URL,
  headers: {
    Accept: "application/json",
  },
});

// Interceptor: jika ada token login di localStorage, override Authorization
apiClient.interceptors.request.use((config) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }
  }
  return config;
});

export default apiClient;
