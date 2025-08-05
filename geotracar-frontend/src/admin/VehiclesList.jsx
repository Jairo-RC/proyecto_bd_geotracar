import React, { useEffect, useState } from "react";
import { apiFetch } from "../utils/api";
import "./SummaryDashboard.css";

export default function VehiclesList() {
  const [vehicles, setVehicles] = useState([]);
  const [form, setForm] = useState({
    plate: "",
    brand: "",
    model: "",
    client_id: "",
  });
  const [error, setError] = useState("");
  const [creating, setCreating] = useState(false);

  const fetchVehicles = async () => {
    try {
      const data = await apiFetch("/api/admin/vehicles");
      setVehicles(data.vehicles || []);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los vehículos.");
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.plate || !form.brand) {
      setError("Placa y marca son obligatorios.");
      return;
    }
    setCreating(true);
    try {
      const payload = {
        plate: form.plate.trim(),
        brand: form.brand.trim(),
        model: form.model.trim() || undefined,
        client_id: form.client_id ? Number(form.client_id) : undefined,
      };
      await apiFetch("/api/admin/vehicles", {
        method: "POST",
        body: JSON.stringify(payload),
      });
      setForm({ plate: "", brand: "", model: "", client_id: "" });
      fetchVehicles();
    } catch (err) {
      console.error(err);
      setError(err.message);
    } finally {
      setCreating(false);
    }
  };

  return (
    <div style={{ padding: 24, maxWidth: 1100, margin: "0 auto" }}>
      <h2 style={{ marginBottom: 16 }}>Vehículos</h2>
      {error && <div className="form-error">{error}</div>}

      <div
        style={{ marginBottom: 24, display: "flex", gap: 32, flexWrap: "wrap" }}
      >
        <div className="card" style={{ flex: "1 1 420px", minWidth: 320 }}>
          <div className="card-title">Agregar vehículo</div>
          <form
            onSubmit={handleCreate}
            className="vehicle-form"
            style={{ marginTop: 8 }}
          >
            <div className="form-grid">
              <div className="field">
                <label>Placa</label>
                <input
                  value={form.plate}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, plate: e.target.value }))
                  }
                  placeholder="ABC-1234"
                />
              </div>
              <div className="field">
                <label>Marca</label>
                <input
                  value={form.brand}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, brand: e.target.value }))
                  }
                  placeholder="Toyota"
                />
              </div>
              <div className="field">
                <label>Modelo</label>
                <input
                  value={form.model}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, model: e.target.value }))
                  }
                  placeholder="Corolla"
                />
              </div>
              <div className="field">
                <label>ID Cliente (opcional)</label>
                <input
                  value={form.client_id}
                  onChange={(e) =>
                    setForm((f) => ({ ...f, client_id: e.target.value }))
                  }
                  placeholder="123"
                />
              </div>
            </div>
            <button type="submit" className="btn primary" disabled={creating}>
              {creating ? "Creando..." : "Agregar vehículo"}
            </button>
          </form>
        </div>
      </div>

      <div style={{ overflowX: "auto" }}>
        <table className="orders-table">
          <thead>
            <tr>
              {["ID", "Placa", "Marca", "Modelo", "Cliente"].map((h) => (
                <th key={h}>{h}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {vehicles.map((v) => (
              <tr key={v.id}>
                <td>{v.id}</td>
                <td>{v.plate}</td>
                <td>{v.brand}</td>
                <td>{v.model || "-"}</td>
                <td>{v.client_id || "-"}</td>
              </tr>
            ))}
            {vehicles.length === 0 && (
              <tr>
                <td colSpan={5} style={{ textAlign: "center", padding: 16 }}>
                  No hay vehículos.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
