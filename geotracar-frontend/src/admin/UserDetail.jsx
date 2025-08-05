import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "../admin/AdminShared.css"; // estilos compartidos

export default function UserDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [form, setForm] = useState({
    name: "",
    contact: "",
    address: "",
    type_client_id: "",
    role: "",
    is_active: true,
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [resetting, setResetting] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const fetchUser = async () => {
    try {
      const data = await apiFetch(`/api/admin/users/${id}`);
      setUser(data);
      setForm({
        name: data.name || "",
        contact: data.contact || "",
        address: data.address || "",
        type_client_id: data.type_client_id || "",
        role: data.role || "client",
        is_active: !!data.is_active,
      });
    } catch (err) {
      console.error("Error obteniendo usuario:", err);
      setError("No se pudo cargar el usuario.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUser();
  }, [id]);

  const handleSave = async (e) => {
    e.preventDefault();
    setError("");
    setMessage("");
    setSaving(true);
    try {
      const payload = {
        name: form.name,
        contact: form.contact,
        address: form.address,
        type_client_id: form.type_client_id,
        role: form.role,
        is_active: form.is_active,
      };
      const res = await apiFetch(`/api/admin/users/${id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      setMessage("Usuario actualizado correctamente.");
      setUser((u) => ({ ...u, ...res.user }));
    } catch (err) {
      console.error("Error guardando usuario:", err);
      setError(err.message || "Error actualizando usuario.");
    } finally {
      setSaving(false);
    }
  };

  const handleResetPassword = async () => {
    if (!window.confirm("¿Resetear contraseña del usuario?")) return;
    setResetting(true);
    setError("");
    setMessage("");
    try {
      const res = await apiFetch(`/api/admin/users/${id}/reset-password`, {
        method: "POST",
      });
      setMessage(
        `Contraseña reseteada. Temporal: ${res.tempPassword || "(oculta)"}`
      );
    } catch (err) {
      console.error("Error reseteando contraseña:", err);
      setError("No se pudo resetear la contraseña.");
    } finally {
      setResetting(false);
    }
  };

  if (loading)
    return (
      <div className="admin-page">
        <div className="spinner">Cargando usuario...</div>
      </div>
    );

  return (
    <div className="admin-page">
      <div className="header-row">
        <div>
          <h2 className="page-title">Usuario #{id}</h2>
          <div className="subtext">{user?.email}</div>
        </div>
        <div className="actions-group">
          <button
            className="btn outline small"
            onClick={() => navigate("/admin/users")}
          >
            Volver
          </button>
          <button
            className="btn secondary small"
            onClick={handleResetPassword}
            disabled={resetting}
          >
            {resetting ? "Reseteando..." : "Resetear contraseña"}
          </button>
        </div>
      </div>

      {error && <div className="alert error">{error}</div>}
      {message && <div className="alert success">{message}</div>}

      <div className="two-column">
        <div className="card panel">
          <h3 className="card-title">Detalles del usuario</h3>
          <form onSubmit={handleSave} className="form-grid">
            <div className="field">
              <label>Nombre</label>
              <input
                value={form.name}
                onChange={(e) =>
                  setForm((f) => ({ ...f, name: e.target.value }))
                }
                required
              />
            </div>
            <div className="field">
              <label>Contacto</label>
              <input
                value={form.contact || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, contact: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Dirección</label>
              <input
                value={form.address || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, address: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Tipo de cliente</label>
              <input
                value={form.type_client_id || ""}
                onChange={(e) =>
                  setForm((f) => ({ ...f, type_client_id: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Rol</label>
              <select
                value={form.role}
                onChange={(e) =>
                  setForm((f) => ({ ...f, role: e.target.value }))
                }
              >
                <option value="client">Client</option>
                <option value="admin">Admin</option>
              </select>
            </div>
            <div className="field">
              <label>Activo</label>
              <select
                value={form.is_active ? "true" : "false"}
                onChange={(e) =>
                  setForm((f) => ({
                    ...f,
                    is_active: e.target.value === "true",
                  }))
                }
              >
                <option value="true">Sí</option>
                <option value="false">No</option>
              </select>
            </div>
            <div className="form-footer">
              <button className="btn primary" type="submit" disabled={saving}>
                {saving ? "Guardando..." : "Guardar cambios"}
              </button>
            </div>
          </form>
        </div>

        <div className="right-sidebar">
          <div className="card panel small-section">
            <h4 className="card-title">Órdenes</h4>
            {user.orders && user.orders.length > 0 ? (
              <ul className="simple-list">
                {user.orders.map((o) => (
                  <li key={o.id}>
                    <div>
                      <strong>#{o.id}</strong> {o.description || "-"}{" "}
                      <span className="muted">
                        {new Date(o.create_date).toLocaleDateString()}
                      </span>
                    </div>
                    <div>
                      <button
                        className="link-btn"
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                      >
                        Ver
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted">No tiene órdenes</div>
            )}
          </div>
          <div className="card panel small-section">
            <h4 className="card-title">Pagos</h4>
            {user.Payments && user.Payments.length > 0 ? (
              <ul className="simple-list">
                {user.Payments.map((p) => (
                  <li key={p.id}>
                    <div>
                      <strong>${Number(p.amount).toLocaleString()}</strong>{" "}
                      <span className="muted">
                        {new Date(p.create_date).toLocaleDateString()}
                      </span>
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="muted">No tiene pagos</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
