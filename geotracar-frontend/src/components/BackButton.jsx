// src/components/BackButton.jsx
import React from "react";
import { useNavigate, useLocation } from "react-router-dom";

/**
 * Muestra un botón "Volver" si hay historial.
 * Si no hay historial válido, puede navegar a una ruta fallback (por defecto "/").
 */
export default function BackButton({ fallback = -1, style = {}, ...props }) {
  const navigate = useNavigate();
  const location = useLocation();

  const handleClick = () => {
    // Si hay historial navegable, retrocede; si no, va al fallback absoluto.
    if (window.history.length > 1) {
      navigate(-1);
    } else if (fallback && typeof fallback === "string") {
      navigate(fallback);
    } else {
      navigate(fallback);
    }
  };

  return (
    <button
      onClick={handleClick}
      aria-label="Volver"
      className="btn back"
      style={{
        padding: "6px 12px",
        borderRadius: 6,
        border: "none",
        cursor: "pointer",
        background: "transparent",
        display: "inline-flex",
        alignItems: "center",
        gap: 6,
        fontSize: 14,
        ...style,
      }}
      {...props}
    >
      ← Volver
    </button>
  );
}
