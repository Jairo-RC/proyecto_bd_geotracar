import React, { useState } from "react";
import axios from "axios";
import "../profile.css";

export default function OrderPaymentForm({ orderId, clientId, onPaid }) {
  const [typePay, setTypePay] = useState(1);
  const [card, setCard] = useState("");
  const [paypal, setPaypal] = useState("");
  const [msg, setMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg("");
    try {
      const token = localStorage.getItem("token");
      await axios.post(
        "http://localhost:4000/api/payments/order",
        {
          order_id: orderId,
          client_id: clientId,
          type_pay_id: typePay,
          card,
          paypal,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setMsg("Pago realizado correctamente");
      onPaid(orderId);
    } catch {
      setMsg("Error al procesar el pago");
    } finally {
      setLoading(false);
      setTimeout(() => setMsg(""), 3000);
    }
  };

  return (
    <form className="payment-form" onSubmit={handleSubmit}>
      <select
        value={typePay}
        onChange={(e) => setTypePay(Number(e.target.value))}
      >
        <option value={1}>Tarjeta</option>
        <option value={2}>PayPal</option>
      </select>

      {typePay === 1 ? (
        <input
          type="text"
          placeholder="Número de tarjeta"
          value={card}
          onChange={(e) => setCard(e.target.value)}
          required
        />
      ) : (
        <input
          type="email"
          placeholder="Correo PayPal"
          value={paypal}
          onChange={(e) => setPaypal(e.target.value)}
          required
        />
      )}

      <button type="submit" disabled={loading}>
        {loading ? "Procesando…" : "Pagar"}
      </button>

      {msg && <div className="profile-msg">{msg}</div>}
    </form>
  );
}
