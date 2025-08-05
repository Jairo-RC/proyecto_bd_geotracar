// src/admin/SummaryDashboard.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./SummaryDashboard.css";

export default function SummaryDashboard() {
  const [summary, setSummary] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [vehicleForm, setVehicleForm] = useState({
    plate: "",
    brand: "",
    model: "",
    client_id: "",
  });
  const [vehicleError, setVehicleError] = useState("");
  const [vehicleCreating, setVehicleCreating] = useState(false);
  const [ordersError, setOrdersError] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  // cargar resumen
  const loadSummary = async () => {
    try {
      const data = await apiFetch("/api/admin/summary");
      setSummary(data);
    } catch (err) {
      console.error("fetch summary error:", err);
      setError(`No se pudo cargar el resumen: ${err.message}`);
    }
  };

  // cargar órdenes recientes
  const loadRecentOrders = async () => {
    try {
      const data = await apiFetch("/api/admin/orders?limit=5&page=1");
      setRecentOrders(data.orders || []);
    } catch (err) {
      console.error("Error cargando órdenes recientes:", err);
      setOrdersError("No se pudieron cargar órdenes recientes.");
    }
  };

  useEffect(() => {
    loadSummary();
    loadRecentOrders();
  }, []);

  const handleCreateVehicle = async (e) => {
    e.preventDefault();
    setVehicleError("");
    if (!vehicleForm.plate.trim() || !vehicleForm.brand.trim()) {
      setVehicleError("Placa y marca son obligatorios.");
      return;
    }
    setVehicleCreating(true);
    try {
      const payload = {
        plate: vehicleForm.plate.trim(),
        brand: vehicleForm.brand.trim(),
        model: vehicleForm.model.trim() || undefined,
        client_id: vehicleForm.client_id
          ? Number(vehicleForm.client_id)
          : undefined,
      };
      await apiFetch("/api/admin/vehicles", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setVehicleForm({ plate: "", brand: "", model: "", client_id: "" });
      await loadSummary();
    } catch (err) {
      console.error("Error creando vehículo:", err);
      setVehicleError(err.message);
    } finally {
      setVehicleCreating(false);
    }
  };

  const handleDeleteOrder = async (orderId) => {
    if (!window.confirm("Eliminar orden?")) return;
    try {
      await apiFetch(`/api/admin/orders/${orderId}`, { method: "DELETE" });
      await loadRecentOrders();
    } catch (err) {
      console.error(err);
      setOrdersError("No se pudo eliminar la orden.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  if (error) return <div className="error-banner">{error}</div>;
  if (!summary)
    return <div className="loading">Cargando resumen de administrador...</div>;

  return (
    <div className="summary-container">
      <div className="header-row">
        <h1 className="summary-title">Resumen de Administrador</h1>
        <button className="logout-btn" onClick={handleLogout}>
          Cerrar sesión
        </button>
      </div>

      <div className="cards-row">
        <div className="card">
          <div className="card-title">Usuarios activos</div>
          <div className="card-value">{summary.users.total}</div>
        </div>

        <div className="card">
          <div className="card-title">Órdenes</div>
          <div className="card-value">Total: {summary.orders.total}</div>
          <div className="small">
            <strong>Top clientes:</strong>
            <ul className="top-clients">
              {summary.orders.top_clients?.map((c) => (
                <li key={c.client.id}>
                  {c.client.name} ({c.orders_count})
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="card">
          <div className="card-title">Ingresos</div>
          <div className="card-value">
            $
            {summary.revenue.total.toLocaleString(undefined, {
              minimumFractionDigits: 2,
            })}
          </div>
        </div>

        <div className="card">
          <div className="card-title">Vehículos</div>
          <div className="card-value">Total: {summary.vehicles.total}</div>
          <div className="small">
            <div>En movimiento: {summary.vehicles.moving}</div>
            <div>Estacionados: {summary.vehicles.parked}</div>
            <div>Inactivos: {summary.vehicles.inactive}</div>
          </div>
        </div>
      </div>

      <div className="quick-actions">
        <button
          className="btn primary"
          onClick={() => navigate("/admin/orders")}
        >
          Ver órdenes completas
        </button>
        <button
          className="btn outline"
          onClick={() => navigate("/admin/users")}
        >
          Gestionar usuarios
        </button>
        <button
          className="btn outline"
          onClick={() => navigate("/admin/vehicles")}
        >
          Ver vehículos
        </button>
      </div>

      <div className="middle-section">
        <div className="vehicle-form-card">
          <h3>Agregar vehículo</h3>
          {vehicleError && <div className="form-error">{vehicleError}</div>}
          <form onSubmit={handleCreateVehicle} className="vehicle-form">
            <div className="form-grid">
              <div className="field">
                <label>Placa</label>
                <input
                  value={vehicleForm.plate}
                  onChange={(e) =>
                    setVehicleForm((f) => ({ ...f, plate: e.target.value }))
                  }
                  placeholder="ABC-1234"
                />
              </div>
              <div className="field">
                <label>Marca</label>
                <input
                  value={vehicleForm.brand}
                  onChange={(e) =>
                    setVehicleForm((f) => ({ ...f, brand: e.target.value }))
                  }
                  placeholder="Toyota"
                />
              </div>
              <div className="field">
                <label>Modelo</label>
                <input
                  value={vehicleForm.model}
                  onChange={(e) =>
                    setVehicleForm((f) => ({ ...f, model: e.target.value }))
                  }
                  placeholder="Corolla"
                />
              </div>
              <div className="field">
                <label>ID Cliente (opcional)</label>
                <input
                  value={vehicleForm.client_id}
                  onChange={(e) =>
                    setVehicleForm((f) => ({
                      ...f,
                      client_id: e.target.value,
                    }))
                  }
                  placeholder="123"
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn create"
              disabled={vehicleCreating}
            >
              {vehicleCreating ? "Creando..." : "Agregar vehículo"}
            </button>
          </form>
        </div>

        <div className="recent-orders-card">
          <h3>Órdenes recientes</h3>
          {ordersError && <div className="form-error">{ordersError}</div>}
          <div className="table-wrapper">
            <table className="orders-table">
              <thead>
                <tr>
                  {[
                    "ID",
                    "Cliente",
                    "Email",
                    "Vehículo",
                    "Origen",
                    "Destino",
                    "Costo",
                    "Creada",
                    "Pagada",
                    "Acciones",
                  ].map((h) => (
                    <th key={h}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {recentOrders.map((o) => (
                  <tr key={o.id}>
                    <td>{o.id}</td>
                    <td>{o.client?.name || "-"}</td>
                    <td>{o.client?.email || "-"}</td>
                    <td>
                      {o.vehicle
                        ? `${o.vehicle.plate}${
                            o.vehicle.brand ? ` - ${o.vehicle.brand}` : ""
                          }`
                        : "-"}
                    </td>
                    <td>{o.origin}</td>
                    <td>{o.destination}</td>
                    <td>${Number(o.cost || 0).toLocaleString()}</td>
                    <td>{new Date(o.create_date).toLocaleString()}</td>
                    <td>{o.paid ? "Sí" : "No"}</td>
                    <td className="actions-cell">
                      <button
                        className="small-btn"
                        onClick={() => navigate(`/admin/orders/${o.id}`)}
                      >
                        Ver
                      </button>
                      <button
                        className="small-btn danger"
                        onClick={() => handleDeleteOrder(o.id)}
                      >
                        Eliminar
                      </button>
                    </td>
                  </tr>
                ))}
                {recentOrders.length === 0 && (
                  <tr>
                    <td colSpan={10} className="empty-row">
                      No hay órdenes recientes.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      <div className="bottom-shortcuts">
        <div className="card">
          <div className="card-title">Acceso rápido</div>
          <div className="shortcut-buttons">
            <button
              className="btn full"
              onClick={() => navigate("/admin/orders")}
            >
              Ver todas las órdenes
            </button>
            <button
              className="btn full"
              onClick={() => navigate("/admin/users")}
            >
              Gestionar usuarios
            </button>
            <button
              className="btn full"
              onClick={() => navigate("/admin/vehicles")}
            >
              Ver vehículos
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
