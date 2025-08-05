// src/admin/OrdersList.jsx
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { apiFetch } from "../utils/api";
import "./SummaryDashboard.css";

export default function OrdersList() {
  const [orders, setOrders] = useState([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [perPage] = useState(10);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const load = async (p = 1) => {
    try {
      const data = await apiFetch(
        `/api/admin/orders?limit=${perPage}&page=${p}`
      );
      setOrders(data.orders || []);
      setTotal(data.total || 0);
      setPage(data.page || 1);
    } catch (err) {
      console.error("Error listando órdenes:", err);
      setError("No se pudieron cargar las órdenes.");
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Eliminar orden?")) return;
    try {
      await apiFetch(`/api/admin/orders/${id}`, { method: "DELETE" });
      await load(page);
    } catch (err) {
      console.error(err);
      setError("No se pudo eliminar la orden.");
    }
  };

  return (
    <div className="admin-page">
      <h1>Órdenes</h1>
      <button
        className="btn primary"
        onClick={() => navigate("/admin/orders/new")}
      >
        Crear orden
      </button>
      {error && <div className="form-error">{error}</div>}
      <div className="table-wrapper" style={{ marginTop: 16 }}>
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
            {orders.map((o) => (
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
                    onClick={() => handleDelete(o.id)}
                  >
                    Eliminar
                  </button>
                </td>
              </tr>
            ))}
            {orders.length === 0 && (
              <tr>
                <td colSpan={10} className="empty-row">
                  No hay órdenes.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      <div
        style={{ marginTop: 16, display: "flex", gap: 8, alignItems: "center" }}
      >
        <button
          className="btn outline"
          disabled={page <= 1}
          onClick={() => load(page - 1)}
        >
          Anterior
        </button>
        <div>
          Página {page} de {Math.ceil(total / perPage) || 1}
        </div>
        <button
          className="btn outline"
          disabled={page >= Math.ceil(total / perPage)}
          onClick={() => load(page + 1)}
        >
          Siguiente
        </button>
      </div>
    </div>
  );
}
