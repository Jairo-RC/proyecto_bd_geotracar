// src/admin/AdminRoute.jsx
import { Navigate } from "react-router-dom";

export default function AdminRoute({ children }) {
  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  if (!token) {
    return <Navigate to="/login" replace />;
  }
  if (role !== "admin") {
    return <Navigate to="/dashboard" replace />;
  }
  return children;
}
