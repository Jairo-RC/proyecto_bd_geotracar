// src/admin/UsersList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../admin/SummaryDashboard.css"; // reutiliza estilos (.card, .btn, etc)

export default function UsersList() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);
  const [newUser, setNewUser] = useState({
    name: "",
    email: "",
    password: "",
    role: "client",
    type_client_id: 1,
  });
  const [search, setSearch] = useState("");
  const navigate = useNavigate();

  const fetchUsers = async () => {
    try {
      const q = search ? `?search=${encodeURIComponent(search)}` : "";
      const data = await apiFetch(`/api/admin/users${q}`);
      setUsers(data.users || data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los usuarios.");
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [search]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!newUser.name || !newUser.email) {
      setError("Nombre y email son obligatorios.");
      return;
    }
    setCreating(true);
    try {
      await apiFetch("/api/admin/users", {
        method: "POST",
        body: JSON.stringify(newUser),
      });
      setNewUser({
        name: "",
        email: "",
        password: "",
        role: "client",
        type_client_id: 1,
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar usuario?")) return;
    try {
      await apiFetch(`/api/admin/users/${id}`, {
        method: "DELETE",
      });
      fetchUsers();
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar el usuario.");
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>Usuarios</h2>

      <div
        style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 24 }}
      >
        <div className="card" style={{ flex: "1 1 320px" }}>
          <div className="card-title">Buscar</div>
          <input
            placeholder="Nombre o email"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              width: "100%",
              padding: 10,
              borderRadius: 6,
              border: "none",
              marginTop: 6,
              background: "#0f1f44",
              color: "#fff",
            }}
          />
        </div>
        <div className="card" style={{ flex: "2 1 600px" }}>
          <div className="card-title">Crear usuario</div>
          {error && <div className="form-error">{error}</div>}
          <form
            onSubmit={handleCreate}
            style={{
              display: "grid",
              gap: 12,
              gridTemplateColumns: "repeat(auto-fit,minmax(140px,1fr))",
              marginTop: 8,
            }}
          >
            <div className="field">
              <label>Nombre</label>
              <input
                value={newUser.name}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, name: e.target.value }))
                }
                placeholder="Jairo"
              />
            </div>
            <div className="field">
              <label>Email</label>
              <input
                value={newUser.email}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, email: e.target.value }))
                }
                placeholder="ejemplo@mail.com"
              />
            </div>
            <div className="field">
              <label>Contraseña (opcional)</label>
              <input
                type="password"
                value={newUser.password}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, password: e.target.value }))
                }
                placeholder="******"
              />
            </div>
            <div className="field">
              <label>Rol</label>
              <select
                value={newUser.role}
                onChange={(e) =>
                  setNewUser((u) => ({ ...u, role: e.target.value }))
                }
              >
                <option value="client">Cliente</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field" style={{ alignSelf: "end" }}>
              <button type="submit" className="btn primary" disabled={creating}>
                {creating ? "Creando..." : "Crear usuario"}
              </button>
            </div>
          </form>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="orders-table" style={{ width: "100%", marginTop: 8 }}>
          <thead>
            <tr>
              {["ID", "Nombre", "Email", "Rol", "Activo", "Acciones"].map(
                (h) => (
                  <th key={h}>{h}</th>
                )
              )}
            </tr>
          </thead>
          <tbody>
            {users.map((u) => (
              <tr key={u.id}>
                <td>{u.id}</td>
                <td>{u.name}</td>
                <td>{u.email}</td>
                <td style={{ textTransform: "capitalize" }}>{u.role}</td>
                <td>{u.is_active ? "Sí" : "No"}</td>
                <td style={{ display: "flex", gap: 8 }}>
                  <button
                    className="small-btn"
                    onClick={() => navigate(`/admin/users/${u.id}`)}
                  >
                    Ver
                  </button>
                  <button
                    className="small-btn danger"
                    onClick={() => handleDelete(u.id)}
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
