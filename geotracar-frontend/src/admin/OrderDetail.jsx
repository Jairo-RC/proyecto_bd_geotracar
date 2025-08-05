// src/admin/OrderDetail.jsx
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./SummaryDashboard.css";

export default function OrderDetail() {
  const { id } = useParams(); // "new" o un número
  const navigate = useNavigate();
  const isNew = id === "new";

  const [order, setOrder] = useState(null);
  const [clients, setClients] = useState([]);
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [form, setForm] = useState({
    client_id: "",
    vehicle_id: "",
    origin: "",
    destination: "",
    arrival_date: "",
    departure_date: "",
    description: "",
  });
  const [creating, setCreating] = useState(false);
  const [updating, setUpdating] = useState(false);

  // cargar datos de referencia (clientes y vehículos)
  const loadReferences = async () => {
    try {
      const [usersRes, vehiclesRes] = await Promise.all([
        apiFetch("/api/admin/users?limit=100"),
        apiFetch("/api/admin/vehicles?limit=100"),
      ]);
      setClients(usersRes.users || []);
      setVehicles(vehiclesRes.vehicles || []);
    } catch (err) {
      console.error("Error cargando referencias:", err);
    }
  };

  // inicialización
  useEffect(() => {
    async function init() {
      await loadReferences();
      if (!isNew) {
        try {
          const data = await apiFetch(`/api/admin/orders/${id}`);
          setOrder(data);
          setForm({
            client_id: data.client_id || "",
            vehicle_id: data.vehicle_id || "",
            origin: data.origin || "",
            destination: data.destination || "",
            arrival_date: data.arrival_date || "",
            departure_date: data.departure_date || "",
            description: data.description || "",
          });
        } catch (err) {
          console.error("Error cargando orden:", err);
          setError(err.message);
        }
      }
      setLoading(false);
    }
    init();
  }, [id, isNew]);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (
      !form.client_id ||
      !form.vehicle_id ||
      !form.origin.trim() ||
      !form.destination.trim()
    ) {
      setError("Cliente, vehículo, origen y destino son obligatorios.");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        client_id: Number(form.client_id),
        vehicle_id: Number(form.vehicle_id),
        origin: form.origin,
        destination: form.destination,
        arrival_date: form.arrival_date || null,
        departure_date: form.departure_date || null,
        description: form.description || null,
      };
      const data = await apiFetch("/api/admin/orders", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      // navegar al detalle recién creado
      navigate(`/admin/orders/${data.id}`);
    } catch (err) {
      console.error("Error creando orden:", err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!order) return;
    setError("");
    setUpdating(true);
    try {
      const payload = {
        vehicle_id: form.vehicle_id ? Number(form.vehicle_id) : undefined,
        origin: form.origin,
        destination: form.destination,
        arrival_date: form.arrival_date,
        departure_date: form.departure_date,
        description: form.description,
      };
      await apiFetch(`/api/admin/orders/${order.id}`, {
        method: "PUT",
        body: JSON.stringify(payload),
      });
      const updated = await apiFetch(`/api/admin/orders/${order.id}`);
      setOrder(updated);
      setForm((f) => ({
        ...f,
        vehicle_id: updated.vehicle_id,
        origin: updated.origin,
        destination: updated.destination,
        arrival_date: updated.arrival_date,
        departure_date: updated.departure_date,
        description: updated.description,
      }));
    } catch (err) {
      console.error("Error actualizando orden:", err);
      setError(err.message);
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="loading">Cargando orden...</div>;

  // Si no es new y aún no llegó la orden, mostrar carga ligera
  if (!isNew && !order) {
    return <div className="loading">Cargando detalles de la orden...</div>;
  }

  return (
    <div className="admin-page">
      <h2>{isNew ? "Crear nueva orden" : `Orden #${order?.id}`}</h2>
      {error && <div className="form-error">{error}</div>}

      {isNew ? (
        <form onSubmit={handleCreate} style={{ display: "grid", gap: 16 }}>
          <div className="form-grid">
            <div className="field">
              <label>Cliente</label>
              <select
                value={form.client_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, client_id: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar cliente</option>
                {clients.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name} ({c.email})
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Vehículo</label>
              <select
                value={form.vehicle_id}
                onChange={(e) =>
                  setForm((f) => ({ ...f, vehicle_id: e.target.value }))
                }
                required
              >
                <option value="">Seleccionar vehículo</option>
                {vehicles.map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.plate} {v.brand && `- ${v.brand}`}
                  </option>
                ))}
              </select>
            </div>
            <div className="field">
              <label>Origen</label>
              <input
                value={form.origin}
                onChange={(e) =>
                  setForm((f) => ({ ...f, origin: e.target.value }))
                }
                placeholder="Ciudad, País"
                required
              />
            </div>
            <div className="field">
              <label>Destino</label>
              <input
                value={form.destination}
                onChange={(e) =>
                  setForm((f) => ({ ...f, destination: e.target.value }))
                }
                placeholder="Ciudad, País"
                required
              />
            </div>
            <div className="field">
              <label>Fecha de llegada</label>
              <input
                type="date"
                value={form.arrival_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, arrival_date: e.target.value }))
                }
              />
            </div>
            <div className="field">
              <label>Fecha de salida</label>
              <input
                type="date"
                value={form.departure_date}
                onChange={(e) =>
                  setForm((f) => ({ ...f, departure_date: e.target.value }))
                }
              />
            </div>
          </div>

          <div className="form-grid">
            <div className="field">
              <label>Descripción</label>
              <input
                value={form.description}
                onChange={(e) =>
                  setForm((f) => ({ ...f, description: e.target.value }))
                }
                placeholder="Detalles adicionales"
              />
            </div>
          </div>

          <button className="btn primary" type="submit" disabled={creating}>
            {creating ? "Creando..." : "Crear orden"}
          </button>
        </form>
      ) : (
        <>
          <div style={{ marginBottom: 20 }}>
            <div>
              <strong>Cliente:</strong> {order.client?.name} (
              {order.client?.email})
            </div>
            <div>
              <strong>Vehículo:</strong>{" "}
              {order.vehicle ? order.vehicle.plate : "-"}
            </div>
            <div>
              <strong>Costo:</strong> $
              {Number(order.cost || 0).toLocaleString()}
            </div>
            <div>
              <strong>Pagada:</strong> {order.paid ? "Sí" : "No"}
            </div>
          </div>

          <form onSubmit={handleUpdate} style={{ display: "grid", gap: 16 }}>
            <div className="form-grid">
              <div className="field">
                <label>Vehículo</label>
                <select
                  value={form.vehicle_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, vehicle_id: e.target.value }))
                  }
                >
                  <option value="">Seleccionar vehículo</option>
                  {vehicles.map((v) => (
                    <option key={v.id} value={v.id}>
                      {v.plate} {v.brand && `- ${v.brand}`}
                    </option>
                  ))}
                </select>
              </div>
              <div className="field">
                <label>Origen</label>
                <input
                  value={form.origin}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, origin: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Destino</label>
                <input
                  value={form.destination}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, destination: e.target.value }))
                  }
                />
              </div>
              <div className="field">
                <label>Descripción</label>
                <input
                  value={form.description}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, description: e.target.value }))
                  }
                />
              </div>
            </div>
            <button className="btn primary" type="submit" disabled={updating}>
              {updating ? "Guardando..." : "Actualizar orden"}
            </button>
          </form>
        </>
      )}
    </div>
  );
}
