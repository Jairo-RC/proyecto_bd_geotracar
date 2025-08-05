// src/components/PackagesList.jsx
import React, { useState, useEffect } from "react";
import axios from "axios";
import "../packages.css";

export default function PackagesList() {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  // Recupera usuario desde localStorage
  const user = JSON.parse(localStorage.getItem("user")) || {};
  const isPremium = user.type_client_id === 2;

  // Fetch de paquetes
  useEffect(() => {
    (async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get(
          `${process.env.REACT_APP_API_BASE_URL || ""}/api/packages`,
          { headers: { Authorization: `Bearer ${token}` } }
        );
        setPackages(res.data);
      } catch (err) {
        console.error("Error cargando paquetes:", err);
        setError("No se pudieron cargar los paquetes.");
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) return <p>Cargando paquetes…</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="packages-list">
      {packages.map((pkg) => {
        // Precio con descuento si es Premium
        const basePrice = parseFloat(pkg.price);
        const displayPrice = isPremium
          ? (basePrice * 0.5).toFixed(2)
          : basePrice.toFixed(2);

        return (
          <div className="package-card" key={pkg.id}>
            <h3 className="package-name">{pkg.name}</h3>
            <p className="package-desc">{pkg.description}</p>
            <p className="package-price">
              Precio: <strong>${displayPrice}</strong>{" "}
              {isPremium && <span className="badge">50% OFF</span>}
            </p>
            <button
              className="package-btn"
              onClick={() => {
                // Aquí podrías llamar a tu flujo de compra
                alert(`Seleccionaste "${pkg.name}" por $${displayPrice}`);
              }}
            >
              Comprar
            </button>
          </div>
        );
      })}
    </div>
  );
}
