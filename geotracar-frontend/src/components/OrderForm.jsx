import React, { useState } from "react";
import axios from "axios";
import "../profile.css";

export default function OrderForm({ vehicles = [], onOrderCreated }) {
  const [form, setForm] = useState({
    vehicle_id: "",
    arrival_date: "",
    departure_date: "",
    origin: "",
    destination: "",
    description: "",
  });
  const [loading, setLoading] = useState(false);
  const [msg, setMsg] = useState("");

  const handleChange = (e) => {
    setForm((f) => ({ ...f, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const {
        vehicle_id,
        arrival_date,
        departure_date,
        origin,
        destination,
        description,
      } = form;

      const res = await axios.post(
        "http://localhost:4000/api/orders",
        {
          vehicle_id,
          arrival_date,
          departure_date,
          origin,
          destination,
          description,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      onOrderCreated(res.data);
      setMsg(`✅ Orden creada. Costo: $${res.data.cost}`);
      setForm({
        vehicle_id: "",
        arrival_date: "",
        departure_date: "",
        origin: "",
        destination: "",
        description: "",
      });
    } catch (err) {
      console.error("Error al registrar orden:", err);
      setMsg("Error al registrar orden");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 5000);
    }
  };

  return (
    <form className="order-form" onSubmit={handleSubmit}>
      <h3>Registrar Orden</h3>

      <div className="field">
        <label>
          <div className="small-label">Vehículo</div>
          <select
            name="vehicle_id"
            required
            value={form.vehicle_id}
            onChange={handleChange}
          >
            <option value="">Seleccione vehículo…</option>
            {vehicles.map((v) => (
              <option key={v.id} value={v.id}>
                {v.plate} — {v.brand} {v.model}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="inline-group">
        <div className="field">
          <label>
            <div className="small-label">Fecha Llegada</div>
            <input
              type="date"
              name="arrival_date"
              required
              value={form.arrival_date}
              onChange={handleChange}
            />
          </label>
        </div>
        <div className="field">
          <label>
            <div className="small-label">Fecha Salida</div>
            <input
              type="date"
              name="departure_date"
              required
              value={form.departure_date}
              onChange={handleChange}
            />
          </label>
        </div>
      </div>

      <div className="field">
        <label>
          <div className="small-label">Origen</div>
          <input
            type="text"
            name="origin"
            required
            value={form.origin}
            onChange={handleChange}
            placeholder="Ciudad de origen, País"
          />
        </label>
      </div>

      <div className="field">
        <label>
          <div className="small-label">Destino</div>
          <input
            type="text"
            name="destination"
            required
            value={form.destination}
            onChange={handleChange}
            placeholder="Ciudad de destino, País"
          />
        </label>
      </div>

      <div className="extra">
        <label>
          <div className="small-label">Descripción (opcional)</div>
          <textarea
            name="description"
            rows={3}
            value={form.description}
            onChange={handleChange}
            placeholder="Detalles adicionales…"
          />
        </label>
      </div>

      <div
        style={{
          display: "flex",
          gap: 12,
          flexWrap: "wrap",
          width: "100%",
          marginTop: 4,
        }}
      >
        <button type="submit" className="submit-btn" disabled={loading}>
          {loading ? "Guardando…" : "Registrar"}
        </button>
        {msg && (
          <div className={msg.includes("✅") ? "form-msg success" : "form-msg"}>
            {msg}
          </div>
        )}
      </div>
    </form>
  );
}
