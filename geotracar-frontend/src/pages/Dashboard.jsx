import React, { useState, useEffect, useMemo, useRef } from "react";
import { useNavigate } from "react-router-dom";
import {
  MapContainer,
  TileLayer,
  Marker,
  Popup,
  Polyline,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "../dashboard.css";
import { fetchVehicles, fetchHistory } from "../services/api";
import { getStreetRoute } from "../services/routing";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const carIcon = new L.Icon({
  iconUrl: "/car.png",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

const ORDER_STATES = [
  { value: "", label: "Todos" },
  { value: "in_transit", label: "En tránsito" },
  { value: "delivered", label: "Entregada" },
  { value: "cancelled", label: "Cancelada" },
];
const PIE_COLORS = ["#6366f1", "#22c55e", "#ef4444"];

export default function Dashboard() {
  const nav = useNavigate();
  const [vehicles, setVehicles] = useState([]);
  const [history, setHistory] = useState({ trackFrames: [], orders: [] });
  const [selectedOrderId, setSelectedOrderId] = useState(null);
  const [realRoute, setRealRoute] = useState([]);
  const [stepIndex, setStepIndex] = useState(0);
  const [showPie, setShowPie] = useState(false);

  // filtros
  const [statusFilter, setStatusFilter] = useState("");
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");

  // Sidebar visible por defecto en desktop, oculto en mobile
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const mapRef = useRef(null);
  const lastCenteredOrderRef = useRef(null);

  // Cierra menú automáticamente al cambiar el tamaño de la ventana
  useEffect(() => {
    const handleResize = () => {
      setSidebarOpen(window.innerWidth > 900);
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    (async () => {
      const [veh, hist] = await Promise.all([fetchVehicles(), fetchHistory()]);
      setVehicles(veh);
      setHistory(hist);
      console.log("Vehículos recibidos:", veh);
    })();
  }, []);

  useEffect(() => {
    const iv = setInterval(async () => {
      setVehicles(await fetchVehicles());
    }, 5000);
    return () => clearInterval(iv);
  }, []);

  const filteredOrders = useMemo(() => {
    return history.orders
      .filter((o) => {
        if (statusFilter && String(o.status) !== statusFilter) return false;
        if (dateFrom) {
          const d = new Date(o.create_date || o.createDate || o.created_at);
          if (d < new Date(dateFrom)) return false;
        }
        if (dateTo) {
          const d = new Date(o.create_date || o.createDate || o.created_at);
          const until = new Date(dateTo);
          until.setHours(23, 59, 59, 999);
          if (d > until) return false;
        }
        return true;
      })
      .sort((a, b) => {
        const da = new Date(a.create_date || a.createDate || a.created_at);
        const db = new Date(b.create_date || b.createDate || b.created_at);
        return db - da;
      });
  }, [history.orders, statusFilter, dateFrom, dateTo]);

  // KPIs
  const total = vehicles.length;
  const moving = vehicles.filter((v) => Number(v.status) === 2).length;
  const parked = vehicles.filter((v) => Number(v.status) === 1).length;
  const idle = total - moving - parked;
  const kpis = [
    ["TOTAL VEHÍCULOS", total, "🚗", "#6366f1"],
    ["EN MOVIMIENTO", moving, "🚚", "#22c55e"],
    ["ESTACIONADOS", parked, "🅿️", "#ef4444"],
    ["INACTIVOS", idle, "⏸️", "#fbbf24"],
  ];

  const routes = useMemo(() => {
    const r = {};
    history.trackFrames.forEach((doc) => {
      const oid = doc.order_tracker_id;
      if (doc.location?.coordinates) {
        const [lng, lat] = doc.location.coordinates;
        r[oid] = r[oid] || [];
        r[oid].push([lat, lng]);
      }
    });
    return r;
  }, [history.trackFrames]);

  const routeCoords = selectedOrderId ? routes[selectedOrderId] || [] : [];
  const defaultCenter = useMemo(() => {
    const first = vehicles.find((v) => v.position);
    return first
      ? [first.position.lat, first.position.lng]
      : [9.9333, -84.0833];
  }, [vehicles]);

  // centrar una vez
  useEffect(() => {
    if (selectedOrderId == null || !mapRef.current) return;
    if (lastCenteredOrderRef.current === selectedOrderId) return;

    if (routeCoords.length > 1) {
      const bounds = L.latLngBounds(routeCoords);
      mapRef.current.fitBounds(bounds, { padding: [40, 40] });
    } else if (routeCoords.length === 1) {
      mapRef.current.setView(routeCoords[0], 13);
    }
    lastCenteredOrderRef.current = selectedOrderId;
  }, [selectedOrderId, routeCoords]);

  // animación ruta
  useEffect(() => {
    if (!selectedOrderId || routeCoords.length < 2) {
      setRealRoute(routeCoords);
      return;
    }

    let timer;
    let isMounted = true;

    async function fetchAndAnimate() {
      try {
        const street = await getStreetRoute(routeCoords);
        if (!isMounted) return;
        setRealRoute(street);
        setStepIndex(0);
        timer = setInterval(() => {
          setStepIndex((i) => {
            if (i + 1 < street.length) return i + 1;
            clearInterval(timer);
            return i;
          });
        }, 900);
      } catch (err) {
        console.error("Error en animación de ruta:", err);
        setRealRoute(routeCoords);
      }
    }

    fetchAndAnimate();

    return () => {
      isMounted = false;
      clearInterval(timer);
    };
  }, [selectedOrderId]); //

  const pieData = useMemo(() => {
    const inTransit = filteredOrders.filter(
      (o) => String(o.status) === "in_transit"
    ).length;
    const delivered = filteredOrders.filter(
      (o) => String(o.status) === "delivered"
    ).length;
    const cancelled = filteredOrders.filter(
      (o) => String(o.status) === "cancelled"
    ).length;
    return [
      { name: "En tránsito", value: inTransit },
      { name: "Entregada", value: delivered },
      { name: "Cancelada", value: cancelled },
    ].filter((e) => e.value > 0);
  }, [filteredOrders]);

  const logout = () => {
    localStorage.clear();
    nav("/login", { replace: true });
  };

  return (
    <div className="dashboard-main">
      {/* sidebar + content */}
      <div className="content-wrapper">
        <div className={`slide-menu ${sidebarOpen ? "open" : ""}`}>
          <div className="menu-header">
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <div className="icon-logo" aria-label="logo">
                🚗
              </div>
              <div style={{ fontWeight: 700, fontSize: 18 }}>Órdenes</div>
            </div>
            <button
              aria-label="Cerrar menu"
              className="close-btn"
              onClick={() => setSidebarOpen(false)}
            >
              ×
            </button>
          </div>

          <div className="filters-section">
            <div className="filter-row">
              <label>Estado</label>
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
              >
                {ORDER_STATES.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>
            <div className="filter-row">
              <label>Desde</label>
              <input
                type="date"
                value={dateFrom}
                onChange={(e) => setDateFrom(e.target.value)}
              />
            </div>
            <div className="filter-row">
              <label>Hasta</label>
              <input
                type="date"
                value={dateTo}
                onChange={(e) => setDateTo(e.target.value)}
              />
            </div>
            <div>
              <button
                onClick={() => {
                  setStatusFilter("");
                  setDateFrom("");
                  setDateTo("");
                }}
                className="small-secondary"
              >
                Limpiar
              </button>
            </div>
          </div>

          <div className="orders-list">
            <div style={{ fontWeight: 600, marginBottom: 6 }}>Historial</div>
            {filteredOrders.length === 0 && (
              <div style={{ fontSize: 12, color: "#aaa" }}>No hay órdenes.</div>
            )}
            <ul>
              {filteredOrders.map((o) => (
                <li
                  key={o.id}
                  // Si está pagada, permite seleccionar; si no, ignora el click
                  onClick={() => {
                    if (o.paid) {
                      setSelectedOrderId(o.id);
                      setSidebarOpen(false);
                    }
                  }}
                  className={
                    selectedOrderId === o.id
                      ? "active"
                      : !o.paid
                      ? "not-paid"
                      : ""
                  }
                  style={{
                    cursor: o.paid ? "pointer" : "not-allowed",
                    opacity: o.paid ? 1 : 0.6,
                  }}
                >
                  <div>
                    <strong>Orden {o.id}</strong> —{" "}
                    {o.description || "sin descripción"}
                  </div>

                  {/* Muestra ruta solo si está pagada */}
                  {o.paid ? (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#a6b0d0",
                        marginTop: 2,
                        fontWeight: 500,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span role="img" aria-label="ruta">
                        📍
                      </span>
                      {o.origin} &rarr; {o.destination}
                    </div>
                  ) : (
                    <div
                      style={{
                        fontSize: 12,
                        color: "#ef4444",
                        marginTop: 2,
                        fontWeight: 600,
                        display: "flex",
                        alignItems: "center",
                        gap: 4,
                      }}
                    >
                      <span role="img" aria-label="candado">
                        🔒
                      </span>
                      Esta orden no se ha pagado. <br />
                      <span style={{ fontWeight: 400 }}>
                        Paga para ver la ruta de la orden.
                      </span>
                    </div>
                  )}

                  <div className="meta">
                    {o.create_date
                      ? new Date(o.create_date).toLocaleString()
                      : ""}
                  </div>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="main-area">
          <header className="dashboard-header">
            <button
              className="hamburger-btn"
              onClick={() => setSidebarOpen((open) => !open)}
              aria-label="toggle menu"
            >
              ☰
            </button>

            <div className="kpi-summary" style={{ marginLeft: 4 }}>
              {kpis.map(([label, val, ico, color]) => (
                <div
                  key={label}
                  className="kpi-small"
                  style={{ borderLeftColor: color }}
                >
                  <div style={{ fontWeight: 600, marginBottom: 2 }}>
                    {label}
                  </div>
                  <div>
                    {ico} <strong>{val}</strong>
                  </div>
                </div>
              ))}
            </div>

            <div style={{ marginLeft: "auto", display: "flex", gap: 16 }}>
              <button
                className="dashboard-btn-chart"
                onClick={() => setShowPie(true)}
                aria-label="Ver gráfico"
              >
                📊
              </button>
              <div
                className="icon-btn"
                title="Perfil"
                onClick={() => nav("/profile")}
                style={{ position: "relative" }}
              >
                <span role="img" aria-label="perfil">
                  👤
                </span>
              </div>
              <div
                className="icon-btn"
                title="Cerrar sesión"
                onClick={logout}
                style={{ position: "relative" }}
              >
                <span role="img" aria-label="salir">
                  🔓
                </span>
              </div>
            </div>
          </header>

          {/* modal */}
          {showPie && (
            <div className="modal-overlay">
              <div className="modal-content">
                <h2 style={{ color: "#6366f1" }}>Órdenes por estado</h2>
                {pieData.length === 0 ? (
                  <div
                    style={{
                      padding: "28px 0 12px 0",
                      color: "#888",
                      textAlign: "center",
                    }}
                  >
                    <div style={{ fontSize: 48, marginBottom: 8 }}>📉</div>
                    <div style={{ fontWeight: 500 }}>
                      No hay datos suficientes para mostrar el gráfico
                    </div>
                    <div style={{ fontSize: 13, marginTop: 4 }}>
                      (Aún no tienes órdenes con estados registrados)
                    </div>
                  </div>
                ) : (
                  <div style={{ width: "100%", height: 230 }}>
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={pieData}
                          dataKey="value"
                          nameKey="name"
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          label
                        >
                          {pieData.map((entry, idx) => (
                            <Cell
                              key={idx}
                              fill={PIE_COLORS[idx % PIE_COLORS.length]}
                            />
                          ))}
                        </Pie>
                        <Tooltip />
                        <Legend verticalAlign="bottom" height={26} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
                <button
                  className="modal-close"
                  onClick={() => setShowPie(false)}
                  style={{ marginTop: 16 }}
                >
                  Cerrar
                </button>
              </div>
            </div>
          )}

          {/* mapa */}
          <div className="dashboard-maparea">
            <MapContainer
              center={routeCoords.length ? routeCoords[0] : defaultCenter}
              zoom={12}
              whenCreated={(m) => {
                mapRef.current = m;
                setTimeout(() => m.invalidateSize(), 100);
              }}
              style={{ height: "100%", width: "100%" }}
            >
              <TileLayer
                attribution="&copy; OpenStreetMap"
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              />
              {realRoute.length > 1 && (
                <Polyline
                  positions={realRoute}
                  pathOptions={{ color: "#6366f1", weight: 4 }}
                />
              )}
              {realRoute.length > 0 && (
                <Marker position={realRoute[stepIndex]} icon={carIcon}>
                  <Popup>🚗 Vehículo en ruta</Popup>
                </Marker>
              )}
            </MapContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
