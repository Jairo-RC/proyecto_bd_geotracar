// src/components/OrderRouteMap.jsx
import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import {
  MapContainer,
  TileLayer,
  Polyline,
  Marker,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

/**
 * Helper interno: centra el mapa en unos bounds cuando cambian.
 */
function FitBounds({ bounds }) {
  const map = useMap();
  useEffect(() => {
    if (bounds && bounds.isValid && bounds.isValid()) {
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [bounds, map]);
  return null;
}

// ícono de carrito (puedes reemplazarlo por imagen si lo prefieres)
const cartIcon = new L.DivIcon({
  html: "🚚",
  className: "order-cart-icon",
  iconSize: [32, 32],
  iconAnchor: [16, 16],
});

export default function OrderRouteMap({
  orderId, // orden seleccionada del historial
  onSelectOrder, // opcional: callback si se da click en un carrito
}) {
  const [allOrders, setAllOrders] = useState([]); // contiene startFrame
  const [selectedRoute, setSelectedRoute] = useState(null); // { trackFrames: [...] }
  const [loadingRoute, setLoadingRoute] = useState(false);
  const [error, setError] = useState(null);
  const mapRef = useRef();

  const token = localStorage.getItem("token");

  // Cargar todas las órdenes con su startFrame para mostrar carritos
  useEffect(() => {
    if (!token) return;
    const fetchOrders = async () => {
      try {
        const res = await axios.get(
          "http://localhost:4000/api/orders/my-orders",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setAllOrders(res.data);
      } catch (err) {
        console.error("Error cargando órdenes del usuario:", err);
        setError("No se pudo cargar órdenes.");
      }
    };
    fetchOrders();
  }, [token]);

  // Cuando cambia orderId, traer solo su ruta
  useEffect(() => {
    if (!orderId || !token) {
      setSelectedRoute(null);
      return;
    }
    const fetchRoute = async () => {
      setLoadingRoute(true);
      try {
        const res = await axios.get(
          `http://localhost:4000/api/orders/${orderId}/route`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        // backend debe devolver: { trackFrames: [ { location: { coordinates: [lng, lat] }, ... }, ... ] }
        setSelectedRoute(res.data);
      } catch (err) {
        console.error("Error obteniendo ruta:", err);
        setError("No se pudo cargar la ruta seleccionada.");
      } finally {
        setLoadingRoute(false);
      }
    };
    fetchRoute();
  }, [orderId, token]);

  // Construye los puntos de la ruta seleccionada
  const routeLatLngs = React.useMemo(() => {
    if (!selectedRoute?.trackFrames) return [];
    return selectedRoute.trackFrames
      .map((f) => {
        const coords = f.location?.coordinates;
        if (!coords || coords.length < 2) return null;
        const [lng, lat] = coords;
        return [lat, lng];
      })
      .filter(Boolean);
  }, [selectedRoute]);

  // Bounds de la ruta para centrar cuando esté seleccionada
  const routeBounds = React.useMemo(() => {
    if (routeLatLngs.length === 0) return null;
    return L.latLngBounds(routeLatLngs);
  }, [routeLatLngs]);

  // Punto inicial por defecto (si no hay orden seleccionada)
  const defaultCenter = allOrders?.[0]?.startFrame?.location?.coordinates
    ? [
        allOrders[0].startFrame.location.coordinates[1],
        allOrders[0].startFrame.location.coordinates[0],
      ]
    : [9.9333, -84.0833]; // Costa Rica fallback

  return (
    <div style={{ width: "100%", height: "100%" }}>
      {error && (
        <div
          style={{
            position: "absolute",
            zIndex: 1000,
            background: "#ffe3e3",
            padding: "6px 10px",
            borderRadius: 4,
            margin: 10,
          }}
        >
          {error}
        </div>
      )}
      <MapContainer
        center={defaultCenter}
        zoom={8}
        style={{ width: "100%", height: "100%", minHeight: 400 }}
        whenCreated={(mapInstance) => {
          mapRef.current = mapInstance;
        }}
      >
        <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />

        {/* Dibujar todos los carritos (startFrame) */}
        {allOrders.map((order) => {
          const sf = order.startFrame;
          if (!sf?.location?.coordinates) return null;
          const [lng, lat] = sf.location.coordinates;
          return (
            <Marker
              key={`cart-${order.id}`}
              position={[lat, lng]}
              icon={cartIcon}
              eventHandlers={{
                click: () => {
                  if (onSelectOrder) onSelectOrder(order);
                },
              }}
            />
          );
        })}

        {/* Si hay orden seleccionada, se dibuja su ruta */}
        {orderId && routeLatLngs.length > 0 && (
          <>
            <Polyline positions={routeLatLngs} pathOptions={{ weight: 6 }} />
            {/* centrar automáticamente */}
            {routeBounds && <FitBounds bounds={routeBounds} />}
          </>
        )}

        {/* Estado de carga */}
        {loadingRoute && (
          <div
            style={{
              position: "absolute",
              top: 10,
              right: 10,
              background: "rgba(255,255,255,0.9)",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 12,
              zIndex: 1000,
            }}
          >
            Cargando ruta...
          </div>
        )}
      </MapContainer>
      {!orderId && (
        <div
          style={{
            position: "absolute",
            bottom: 8,
            left: 8,
            background: "#f0f4f8",
            padding: "6px 10px",
            borderRadius: 4,
            fontSize: 12,
          }}
        >
          Mostrando todos los carritos (órdenes del usuario). Haz click en el
          historial o en un carrito para ver detalle.
        </div>
      )}
    </div>
  );
}
