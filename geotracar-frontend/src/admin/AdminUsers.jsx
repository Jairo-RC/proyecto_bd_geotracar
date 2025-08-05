// src/admin/AdminUsers.jsx
import { useEffect, useState } from "react";

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const fetchUsers = async () => {
    // Suponiendo que tienes un endpoint GET /api/admin/users que lista clientes/admins
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/users`,
        {
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
        }
      );
      if (!res.ok) throw new Error("Error cargando usuarios");
      const data = await res.json();
      setUsers(data);
    } catch (err) {
      setError("No se pudieron cargar los usuarios.");
    }
  };

  const handleCreate = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/users`,
        {
          method: "POST",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
            "Content-Type": "application/json",
          },
          body: JSON.stringify(form),
        }
      );
      if (!res.ok) {
        const d = await res.json().catch(() => ({}));
        throw new Error(d.error || "Failed");
      }
      await fetchUsers();
      setForm({ name: "", email: "", password: "", role: "client" });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!confirm("Eliminar usuario?")) return;
    try {
      const token = localStorage.getItem("token");
      await fetch(
        `${import.meta.env.VITE_API_BASE_URL || ""}/api/admin/users/${id}`,
        {
          method: "DELETE",
          headers: {
            Authorization: token ? `Bearer ${token}` : "",
          },
        }
      );
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  return (
    <div
      style={{
        padding: 24,
        maxWidth: 1000,
        margin: "0 auto",
        color: "#e6ecf8",
      }}
    >
      <h2 style={{ marginBottom: 12 }}>Gestión de usuarios</h2>
      {error && (
        <div style={{ color: "#ff6b6b", marginBottom: 8 }}>{error}</div>
      )}

      <section
        style={{
          marginBottom: 24,
          padding: 16,
          background: "rgba(255,255,255,0.04)",
          borderRadius: 10,
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit,minmax(160px,1fr))",
          gap: 12,
        }}
      >
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Nombre</label>
          <input
            value={form.name}
            onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Email</label>
          <input
            value={form.email}
            onChange={(e) => setForm((f) => ({ ...f, email: e.target.value }))}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Password</label>
          <input
            type="password"
            value={form.password}
            onChange={(e) =>
              setForm((f) => ({ ...f, password: e.target.value }))
            }
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
            }}
          />
        </div>
        <div>
          <label style={{ display: "block", fontSize: 12 }}>Rol</label>
          <select
            value={form.role}
            onChange={(e) => setForm((f) => ({ ...f, role: e.target.value }))}
            style={{
              width: "100%",
              padding: 8,
              borderRadius: 6,
              border: "none",
            }}
          >
            <option value="client">Cliente</option>
            <option value="admin">Admin</option>
          </select>
        </div>
        <div style={{ alignSelf: "end" }}>
          <button
            onClick={handleCreate}
            disabled={loading}
            style={{
              padding: "10px 14px",
              borderRadius: 8,
              border: "none",
              cursor: "pointer",
              background: "#10b981",
              color: "#fff",
              fontWeight: 600,
            }}
          >
            {loading ? "Creando..." : "Crear usuario"}
          </button>
        </div>
      </section>

      <div>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr style={{ textAlign: "left" }}>
              {["ID", "Nombre", "Email", "Rol", "Activo", "Acciones"].map(
                (h) => (
                  <th
                    key={h}
                    style={{
                      padding: "12px 8px",
                      fontSize: 12,
                      textTransform: "uppercase",
                      letterSpacing: 1,
                      borderBottom: "1px solid rgba(255,255,255,0.1)",
                    }}
                  >
                    {h}
                  </th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr
                key={u.id}
                style={{ borderBottom: "1px solid rgba(255,255,255,0.05)" }}
              >
                <td style={{ padding: "10px 8px" }}>{u.id}</td>
                <td style={{ padding: "10px 8px" }}>{u.name}</td>
                <td style={{ padding: "10px 8px" }}>{u.email}</td>
                <td
                  style={{ padding: "10px 8px", textTransform: "capitalize" }}
                >
                  {u.role}
                </td>
                <td style={{ padding: "10px 8px" }}>
                  {u.is_active ? "Sí" : "No"}
                </td>
                <td style={{ padding: "10px 8px" }}>
                  <button
                    onClick={() => handleDelete(u.id)}
                    style={{
                      background: "#ef4444",
                      border: "none",
                      padding: "6px 10px",
                      borderRadius: 6,
                      cursor: "pointer",
                      color: "#fff",
                    }}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {users.length === 0 && (
              <tr>
                <td colSpan={6} style={{ padding: 16, textAlign: "center" }}>
                  No hay usuarios.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
