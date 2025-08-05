import React, { useState } from "react";
import "../profile.css";
import OrderPaymentModal from "./OrderPaymentModal";

export default function MyOrders({ orders, onPaidOrder, onEmptyAction }) {
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [qrOpen, setQrOpen] = useState(false);

  // --- QR Modal Handler
  const handleShowQR = (order) => {
    setSelectedOrder(order);
    setQrOpen(true);
  };

  const handleCloseQR = () => {
    setQrOpen(false);
    setSelectedOrder(null);
  };

  // --- Payment Modal Handler
  const handleOpenModal = (order) => {
    setSelectedOrder(order);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
    setSelectedOrder(null);
  };

  const handlePaid = (orderId) => {
    setModalOpen(false);
    setSelectedOrder(null);
    if (onPaidOrder) onPaidOrder(orderId);
  };

  if (!orders || orders.length === 0) {
    return (
      <div className="my-orders">
        <h3>Mis Órdenes</h3>
        <div className="orders-empty">
          No tienes órdenes aún.{" "}
          {onEmptyAction && (
            <button className="btn-primary" onClick={onEmptyAction}>
              + Crear primera orden
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="my-orders">
      <h3>Mis Órdenes</h3>
      <table>
        <thead>
          <tr>
            <th>#</th>
            <th>Ruta</th>
            <th>Llegada</th>
            <th>Salida</th>
            <th>Costo</th>
            <th>Estado</th>
            <th>QR</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((o) => (
            <tr key={o.id}>
              <td>{o.id}</td>
              <td>
                {o.origin} → {o.destination}
              </td>
              <td>{o.arrival_date}</td>
              <td>{o.departure_date}</td>
              <td>${o.cost}</td>
              <td>
                {o.paid ? (
                  <span className="paid-badge">Pagado</span>
                ) : (
                  <button
                    className="btn btn.primary"
                    onClick={() => handleOpenModal(o)}
                  >
                    Pagar
                  </button>
                )}
              </td>
              <td>
                {o.paid && o.code_qr && (
                  <button
                    className="btn btn.outline"
                    onClick={() => handleShowQR(o)}
                  >
                    Ver QR
                  </button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {modalOpen && (
        <OrderPaymentModal
          order={selectedOrder}
          onClose={handleCloseModal}
          onPaid={handlePaid}
        />
      )}

      {/* Modal para mostrar el QR */}
      {qrOpen && selectedOrder && (
        <div className="modal-backdrop">
          <div className="payment-modal" style={{ textAlign: "center" }}>
            <button className="modal-close" onClick={handleCloseQR}>
              &times;
            </button>
            <h2>Código QR de Orden #{selectedOrder.id}</h2>
            <div style={{ margin: "18px 0" }}>
              <img
                src={selectedOrder.code_qr}
                alt={`QR orden #${selectedOrder.id}`}
                style={{
                  width: 170,
                  height: 170,
                  borderRadius: 8,
                  border: "2px solid #6366f1",
                  background: "#fff",
                  boxShadow: "0 4px 18px 0 rgba(44,62,80,.13)",
                }}
              />
            </div>
            <div style={{ fontSize: 13, color: "#6366f1" }}>
              Escanea para ver detalles o validar la orden
            </div>
            <button
              className="btn btn.primary"
              style={{ marginTop: 16 }}
              onClick={handleCloseQR}
            >
              Cerrar
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
