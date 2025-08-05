// src/admin/AdminLayout.jsx
import { Outlet, NavLink, useNavigate, useLocation } from "react-router-dom";
import React from "react";

const navItemClass = ({ isActive }) =>
  `block px-4 py-2 rounded-md text-sm font-medium transition ${
    isActive
      ? "bg-white/10 text-white"
      : "text-gray-300 hover:bg-white/5 hover:text-white"
  }`;

export default function AdminLayout({ user, onLogout }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = () => {
    if (onLogout) onLogout();
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const showBack = !location.pathname.match(/^\/?\/?admin(\/summary)?\/?$/i); // si no está en /admin o /admin/summary

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        background: "linear-gradient(135deg, #0f172a 0%, #1e2f5a 80%)",
        color: "#e6ecf8",
        fontFamily:
          "system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
      }}
    >
      {/* Sidebar */}
      <aside
        style={{
          width: 260,
          padding: "24px 16px",
          display: "flex",
          flexDirection: "column",
          gap: 24,
          background: "#1f2a44",
          flexShrink: 0,
        }}
      >
        <div style={{ marginBottom: 8 }}>
          <h1 style={{ margin: 0, fontSize: 20, fontWeight: 700 }}>Admin</h1>
          <div style={{ fontSize: 12, marginTop: 4 }}>{user?.name || ""}</div>
        </div>

        <nav
          style={{
            flex: 1,
            display: "flex",
            flexDirection: "column",
            gap: 4,
          }}
        >
          <NavLink to="summary" className={navItemClass}>
            Resumen
          </NavLink>
          <NavLink to="orders" className={navItemClass}>
            Órdenes
          </NavLink>
          <NavLink to="users" className={navItemClass}>
            Usuarios
          </NavLink>
          <NavLink to="vehicles" className={navItemClass}>
            Vehículos
          </NavLink>
        </nav>

        <div style={{ marginTop: "auto" }}>
          <button
            onClick={handleLogout}
            style={{
              width: "100%",
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#ef4444",
              color: "#fff",
              fontWeight: 600,
              fontSize: 12,
              letterSpacing: 0.5,
            }}
          >
            Cerrar sesión
          </button>
        </div>
      </aside>

      {/* Main content */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Top bar */}
        <header
          style={{
            padding: "12px 24px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            borderBottom: "1px solid rgba(255,255,255,0.08)",
            background: "rgba(15,23,42,0.95)",
            gap: 12,
          }}
        >
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            {showBack && (
              <button
                onClick={() => {
                  if (window.history.length > 1) navigate(-1);
                  else navigate("/admin/summary");
                }}
                aria-label="Volver"
                style={{
                  padding: "6px 12px",
                  borderRadius: 6,
                  border: "none",
                  cursor: "pointer",
                  background: "rgba(255,255,255,0.06)",
                  color: "#fff",
                  fontSize: 14,
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                }}
              >
                ← Volver
              </button>
            )}
            <div style={{ fontSize: 18, fontWeight: 600 }}>
              Panel de control
            </div>
          </div>
          <div style={{ display: "flex", gap: 16, alignItems: "center" }}>
            <div
              style={{
                fontSize: 14,
                display: "flex",
                gap: 8,
                alignItems: "center",
              }}
            >
              <div
                style={{
                  background: "#6366f1",
                  width: 32,
                  height: 32,
                  borderRadius: "50%",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontSize: 14,
                  fontWeight: 700,
                  color: "#fff",
                  textTransform: "uppercase",
                  marginRight: 6,
                }}
              >
                {user?.name?.[0] || "U"}
              </div>
              <div>
                <div style={{ margin: 0 }}>{user?.name}</div>
                <div style={{ fontSize: 12, color: "#a0a8c0" }}>
                  {user?.role}
                </div>
              </div>
            </div>
            <button
              onClick={handleLogout}
              aria-label="Cerrar sesión"
              style={{
                padding: "6px 12px",
                background: "transparent",
                border: "1px solid rgba(255,255,255,0.2)",
                borderRadius: 6,
                cursor: "pointer",
                fontSize: 12,
                color: "#e6ecf8",
                display: "flex",
                alignItems: "center",
                gap: 4,
              }}
            >
              Cerrar sesión
            </button>
          </div>
        </header>

        {/* Content outlet */}
        <main style={{ flex: 1, overflow: "auto" }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
