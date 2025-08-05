// src/utils/api.js
export const apiFetch = async (path, options = {}) => {
  const base = import.meta.env.VITE_API_BASE_URL || "";
  const token = localStorage.getItem("token");
  const headers = {
    "Content-Type": "application/json",
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {}),
  };
  const res = await fetch(`${base}${path}`, { ...options, headers });

  let text;
  try {
    text = await res.text();
  } catch {}
  let data;
  try {
    data = text ? JSON.parse(text) : {};
  } catch {
    data = { raw: text };
  }

  if (!res.ok) {
    const msg =
      data?.error || data?.message || data?.raw || `Status ${res.status}`;
    // opcional: log completo
    console.error("apiFetch error:", { path, status: res.status, data });
    throw new Error(msg);
  }
  return data;
};
