// src/services/paymentService.js
import axios from "axios";
export async function upgradeToPremium({ method, form }) {
  const token = localStorage.getItem("token");
  let payload;

  if (method === "tarjeta") {
    payload = {
      type_pay_id: 1,
      card: {
        name: form.cardName,
        number: form.cardNumber.replace(/\D/g, ""),
      },
    };
  } else if (method === "paypal") {
    payload = {
      type_pay_id: 2,
      paypal: form.paypalEmail,
    };
  } else {
    throw new Error("Método de pago no soportado");
  }

  console.log("PAYLOAD ENVIADO:", payload);

  const res = await axios.post(
    "http://localhost:4000/api/clients/upgrade",
    payload,
    { headers: { Authorization: `Bearer ${token}` } }
  );
  return res.data;
}

export async function payOrder({ order_id, type_pay_id, card, paypal }) {
  const token = localStorage.getItem("token");
  // Card debe ser string
  const payload = {
    order_id,
    type_pay_id,
    card:
      type_pay_id === 1 && card
        ? `${card.name} - ${card.number} - ${card.exp}` // o lo que quieras guardar
        : null,
    paypal: type_pay_id === 2 ? paypal : null,
  };
  return axios.post("http://localhost:4000/api/payments/order", payload, {
    headers: { Authorization: `Bearer ${token}` },
  });
}
