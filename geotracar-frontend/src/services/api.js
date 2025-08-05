// src/services/api.js

const API_BASE = import.meta.env.VITE_API_BASE_URL || "";

function authHeaders() {
  const token = localStorage.getItem("token");
  return token
    ? { 
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    : { "Content-Type": "application/json" };
}

export async function fetchVehicles() {
  const res = await fetch(`${API_BASE}/api/vehicles`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Error fetching vehicles");
  return res.json();
}

export async function fetchDevices() {
  const res = await fetch(`${API_BASE}/api/devices`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Error fetching devices");
  return res.json();
}

export async function fetchHistory() {
  const res = await fetch(`${API_BASE}/api/history`, {
    headers: authHeaders()
  });
  if (!res.ok) throw new Error("Error fetching history");
  return res.json();
}



