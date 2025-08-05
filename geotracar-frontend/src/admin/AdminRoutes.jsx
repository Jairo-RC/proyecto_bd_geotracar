// src/admin/AdminRoutes.jsx
import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import AdminLayout from "./AdminLayout";
import AdminRoute from "./AdminRoute";
import SummaryDashboard from "./SummaryDashboard";
import UsersList from "./UsersList";
import UserDetail from "./UserDetail";
import OrdersList from "./OrdersList";
import OrderDetail from "./OrderDetail";
import VehiclesList from "./VehiclesList";

export default function AdminRoutes({ onLogout }) {
  return (
    <Routes>
      <Route
        path="/admin/*"
        element={
          <AdminRoute>
            <AdminLayout onLogout={onLogout} />
          </AdminRoute>
        }
      >
        <Route index element={<Navigate to="summary" replace />} />
        <Route path="summary" element={<SummaryDashboard />} />
        <Route path="users" element={<UsersList />} />
        <Route path="users/:id" element={<UserDetail />} />
        <Route path="orders" element={<OrdersList />} />
        <Route path="orders/:id" element={<OrderDetail />} />
        <Route path="vehicles" element={<VehiclesList />} />
      </Route>
    </Routes>
  );
}
