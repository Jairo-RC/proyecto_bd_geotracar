import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      }
    : { "Content-Type": "application/json" };
}

export const adminApi = axios.create({
  baseURL: `${API_BASE}/api/admin`,
  headers: authHeaders(),
});

// Interceptor para refrescar token si necesitás (opcional)
adminApi.interceptors.request.use((cfg) => {
  const token = localStorage.getItem("token");
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});
