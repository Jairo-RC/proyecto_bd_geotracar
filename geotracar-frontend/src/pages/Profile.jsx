import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { upgradeToPremium } from "../services/paymentService";
import ModalPremium from "../components/ModalPremium";
import OrderForm from "../components/OrderForm";
import MyOrders from "../components/MyOrders";
import "../profile.css";
import {
  FiUser,
  FiLogOut,
  FiEdit2,
  FiCheck,
  FiArrowLeft,
  FiStar,
  FiInfo,
  FiPlus,
} from "react-icons/fi";

export default function Profile() {
  const [user, setUser] = useState(null);
  const [vehicles, setVehicles] = useState([]);
  const [orders, setOrders] = useState([]);
  const [contact, setContact] = useState("");
  const [address, setAddress] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [upgrading, setUpgrading] = useState(false);
  const [upgradeMsg, setUpgradeMsg] = useState("");
  const [modalPremiumOpen, setModalPremiumOpen] = useState(false);
  const [orderModalOpen, setOrderModalOpen] = useState(false);

  const navigate = useNavigate();

  // Carga inicial: user, vehículos y órdenes
  useEffect(() => {
    const userData = JSON.parse(localStorage.getItem("user"));
    if (!userData) {
      navigate("/login");
      return;
    }
    setUser(userData);
    setContact(userData.contact || "");
    setAddress(userData.address || "");
    fetchVehicles();
    fetchMyOrders();
  }, [navigate]);

  const fetchVehicles = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get("http://localhost:4000/api/vehicles", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setVehicles(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.warn("Error cargando vehículos:", e);
      setVehicles([]);
    }
  };

  const fetchMyOrders = async () => {
    try {
      const token = localStorage.getItem("token");
      const res = await axios.get(
        "http://localhost:4000/api/orders/my-orders",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      setOrders(Array.isArray(res.data) ? res.data : []);
    } catch (e) {
      console.warn("Error cargando órdenes:", e);
      setOrders([]);
    }
  };

  const handleSave = async () => {
    if (!user) return;
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      const resp = await axios.put(
        `http://localhost:4000/api/clients/${user.id}`,
        { contact, address },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      const updatedClient = resp.data.client || {};
      const updated = { ...user, ...updatedClient, contact, address };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setMsg("¡Perfil actualizado!");
      setEditMode(false);
    } catch {
      setMsg("Error al actualizar perfil");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  const handleUpgrade = async ({ method, form }) => {
    if (!user) return;
    setUpgrading(true);
    setUpgradeMsg("");
    try {
      await upgradeToPremium({ method, form }); // <-- Usa el nuevo paymentService
      const updated = {
        ...user,
        type_client_id: 2,
        premium_since: new Date().toISOString(),
      };
      setUser(updated);
      localStorage.setItem("user", JSON.stringify(updated));
      setUpgradeMsg("¡Ahora eres Premium!");
      setModalPremiumOpen(false);
    } catch (err) {
      setUpgradeMsg(err.response?.data?.error || "Error al mejorar a Premium");
    } finally {
      setUpgrading(false);
      setTimeout(() => setUpgradeMsg(""), 3000);
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    navigate("/login");
  };

  const handleOrderCreated = (newOrder) => {
    setOrders((prev) => [
      { ...newOrder, paid: newOrder.paid ?? false },
      ...prev,
    ]);
    setOrderModalOpen(false);
  };

  const handlePaidOrder = (orderId) => {
    setOrders((prev) =>
      prev.map((o) => (o.id === orderId ? { ...o, paid: true } : o))
    );
  };

  if (!user) return null;

  return (
    <div className="profile-main">
      <div className="profile-card">
        {/* Header */}
        <div className="profile-header">
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flex: 1,
              minWidth: 0,
            }}
          >
            <div className="profile-avatar">
              <FiUser size={24} />
            </div>
            <div style={{ flex: 1, minWidth: 200 }}>
              <h2>Perfil de Usuario</h2>
              <div className="account-type">
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div className="label">
                    <b>Nombre:</b>
                  </div>
                  <div className="value">{user.name}</div>
                </div>
                <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
                  <div className="label">
                    <b>Email:</b>
                  </div>
                  <div className="value">{user.email}</div>
                </div>
                <div style={{ display: "flex", gap: 12, alignItems: "center" }}>
                  <div className="label">
                    <b>Tipo de cuenta:</b>
                  </div>
                  <span
                    className={
                      String(user.type_client_id) === "2"
                        ? "badge premium"
                        : "badge free"
                    }
                    title={
                      String(user.type_client_id) === "2"
                        ? `Premium desde ${
                            user.premium_since
                              ? new Date(
                                  user.premium_since
                                ).toLocaleDateString()
                              : ""
                          }`
                        : "Cuenta Free"
                    }
                  >
                    {String(user.type_client_id) === "2" ? (
                      <>
                        <FiStar /> Premium
                      </>
                    ) : (
                      <>
                        Free <FiInfo size={14} />
                      </>
                    )}
                  </span>
                </div>
              </div>
              {user.premium_since && (
                <div className="since">
                  Premium desde:{" "}
                  {new Date(user.premium_since).toLocaleDateString()}
                </div>
              )}
            </div>
          </div>

          <div className="profile-header-actions">
            <button
              className="btn-primary"
              onClick={() => setOrderModalOpen(true)}
              aria-label="Nueva orden"
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <FiPlus /> Nueva orden
            </button>
            <button
              className="btn-secondary"
              onClick={() => navigate("/dashboard")}
              style={{ display: "inline-flex", alignItems: "center" }}
            >
              <FiArrowLeft /> Volver
            </button>
            <button
              className="icon-logout"
              onClick={handleLogout}
              aria-label="Salir"
            >
              <FiLogOut />
            </button>
          </div>
        </div>

        {/* Contacto y dirección */}
        <div className="profile-edit-form">
          <div className="row">
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>
                <div className="small-label">Contacto</div>
                <input
                  type="tel"
                  className="profile-input"
                  value={contact}
                  disabled={!editMode}
                  onChange={(e) => setContact(e.target.value)}
                  placeholder="Teléfono o WhatsApp"
                />
              </label>
            </div>
            <div style={{ flex: 1, minWidth: 160 }}>
              <label>
                <div className="small-label">Dirección</div>
                <input
                  type="text"
                  className="profile-input"
                  value={address}
                  disabled={!editMode}
                  onChange={(e) => setAddress(e.target.value)}
                  placeholder="Dirección o ubicación"
                />
              </label>
            </div>
          </div>
          <div className="bottom-actions">
            {editMode ? (
              <button
                type="button"
                className="profile-btn"
                onClick={handleSave}
              >
                <FiCheck /> Guardar
              </button>
            ) : (
              <button
                type="button"
                className="profile-btn"
                onClick={() => setEditMode(true)}
              >
                <FiEdit2 /> Editar datos
              </button>
            )}
            {msg && <div className="feedback">{msg}</div>}
          </div>
        </div>

        {/* Upgrade */}
        {String(user.type_client_id) === "1" && (
          <div className="upgrade-section">
            <button
              className="profile-btn"
              onClick={() => setModalPremiumOpen(true)}
            >
              <FiStar /> Mejorar a Premium
            </button>
            {upgradeMsg && <div className="feedback success">{upgradeMsg}</div>}
          </div>
        )}
      </div>

      {/* Mis órdenes (solo una vez) */}
      <MyOrders
        orders={orders}
        onPaidOrder={handlePaidOrder}
        onEmptyAction={() => setOrderModalOpen(true)}
      />

      {/* Modal nueva orden */}
      {orderModalOpen && (
        <div className="generic-modal-overlay">
          <div className="generic-modal">
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <h3 style={{ margin: 0 }}>Registrar Orden</h3>
              <button
                onClick={() => setOrderModalOpen(false)}
                style={{
                  background: "none",
                  border: "none",
                  fontSize: 24,
                  cursor: "pointer",
                  color: "#e6ecf8",
                }}
                aria-label="Cerrar"
              >
                ×
              </button>
            </div>
            <OrderForm
              vehicles={vehicles}
              onOrderCreated={handleOrderCreated}
            />
          </div>
        </div>
      )}

      {/* Modal Premium */}
      <ModalPremium
        open={modalPremiumOpen}
        onClose={() => setModalPremiumOpen(false)}
        onConfirm={handleUpgrade}
      />
    </div>
  );
}
