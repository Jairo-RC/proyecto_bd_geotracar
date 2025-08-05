import React, { useState } from "react";
import "../OrderPaymentModal.css";
import { payOrder } from "../services/paymentService";

export default function OrderPaymentModal({ order, onClose, onPaid }) {
  const [method, setMethod] = useState("card");
  const [form, setForm] = useState({
    cardName: "",
    cardNumber: "",
    cardExp: "",
    cardCVC: "",
    paypalEmail: "",
  });
  const [errors, setErrors] = useState({});
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
    setErrors({ ...errors, [e.target.name]: undefined });
  };

  const handleMethod = (e) => {
    setMethod(e.target.value);
    setErrors({});
  };

  function validate() {
    const newErrors = {};

    if (method === "card") {
      if (!form.cardName.trim()) newErrors.cardName = "Requerido";
      const cleanNumber = form.cardNumber.replace(/\D/g, "");
      if (!/^\d{16}$/.test(cleanNumber)) {
        newErrors.cardNumber = "Deben ser 16 dígitos";
      }
      if (!/^\d{2}\/\d{2}$/.test(form.cardExp)) {
        newErrors.cardExp = "Formato MM/AA";
      } else {
        const [mm, yy] = form.cardExp.split("/").map(Number);
        const now = new Date();
        const expDate = new Date(2000 + yy, mm - 1, 1);
        if (mm < 1 || mm > 12) {
          newErrors.cardExp = "Mes inválido";
        } else if (expDate < new Date(now.getFullYear(), now.getMonth(), 1)) {
          newErrors.cardExp = "Tarjeta vencida";
        }
      }
      if (!/^\d{3}$/.test(form.cardCVC)) {
        newErrors.cardCVC = "Deben ser 3 dígitos";
      }
    } else if (method === "paypal") {
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.paypalEmail)) {
        newErrors.paypalEmail = "Email inválido";
      }
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);

    try {
      // Guardar solo nombre y últimos 4 dígitos
      let cardString = null;
      if (method === "card") {
        const cleanNumber = form.cardNumber.replace(/\D/g, "");
        const last4 = cleanNumber.slice(-4);
        cardString = `${form.cardName} - **** **** **** ${last4}`;
      }

      const payload = {
        order_id: order.id,
        type_pay_id: method === "card" ? 1 : 2,
        card: cardString,
        paypal: method === "paypal" ? form.paypalEmail : null,
      };

      await payOrder(payload);
      setLoading(false);
      onPaid(order.id);
    } catch (err) {
      setLoading(false);
      alert(
        err.response?.data?.error ||
          "Error al registrar el pago. Revisa tu conexión."
      );
    }
  };

  return (
    <div className="modal-backdrop">
      <div className="payment-modal">
        <button className="modal-close" onClick={onClose}>
          &times;
        </button>
        <h2>Pagar Orden #{order.id}</h2>
        <form onSubmit={handleSubmit} noValidate>
          <div className="method-switch">
            <label>
              <input
                type="radio"
                name="method"
                value="card"
                checked={method === "card"}
                onChange={handleMethod}
              />{" "}
              Tarjeta
            </label>
            <label>
              <input
                type="radio"
                name="method"
                value="paypal"
                checked={method === "paypal"}
                onChange={handleMethod}
              />{" "}
              PayPal
            </label>
          </div>
          {method === "card" ? (
            <>
              <div className="form-group">
                <label>Nombre en la tarjeta</label>
                <input
                  name="cardName"
                  required
                  value={form.cardName}
                  onChange={handleChange}
                  autoComplete="cc-name"
                  className={errors.cardName ? "input-error" : ""}
                />
                {errors.cardName && (
                  <span className="error-msg">{errors.cardName}</span>
                )}
              </div>
              <div className="form-group">
                <label>Número de tarjeta</label>
                <input
                  name="cardNumber"
                  required
                  value={form.cardNumber}
                  onChange={handleChange}
                  maxLength={19}
                  autoComplete="cc-number"
                  placeholder="0000 0000 0000 0000"
                  inputMode="numeric"
                  className={errors.cardNumber ? "input-error" : ""}
                />
                {errors.cardNumber && (
                  <span className="error-msg">{errors.cardNumber}</span>
                )}
              </div>
              <div className="form-row">
                <div className="form-group">
                  <label>Expiración</label>
                  <input
                    name="cardExp"
                    required
                    value={form.cardExp}
                    onChange={handleChange}
                    maxLength={5}
                    autoComplete="cc-exp"
                    placeholder="MM/AA"
                    className={errors.cardExp ? "input-error" : ""}
                  />
                  {errors.cardExp && (
                    <span className="error-msg">{errors.cardExp}</span>
                  )}
                </div>
                <div className="form-group">
                  <label>CVC</label>
                  <input
                    name="cardCVC"
                    required
                    value={form.cardCVC}
                    onChange={handleChange}
                    maxLength={3}
                    autoComplete="cc-csc"
                    placeholder="123"
                    inputMode="numeric"
                    className={errors.cardCVC ? "input-error" : ""}
                  />
                  {errors.cardCVC && (
                    <span className="error-msg">{errors.cardCVC}</span>
                  )}
                </div>
              </div>
            </>
          ) : (
            <div className="form-group">
              <label>Email de PayPal</label>
              <input
                name="paypalEmail"
                type="email"
                required
                value={form.paypalEmail}
                onChange={handleChange}
                placeholder="tucorreo@paypal.com"
                autoComplete="email"
                className={errors.paypalEmail ? "input-error" : ""}
              />
              {errors.paypalEmail && (
                <span className="error-msg">{errors.paypalEmail}</span>
              )}
            </div>
          )}
          <button type="submit" className="btn btn.primary" disabled={loading}>
            {loading ? "Procesando..." : "Pagar"}
          </button>
        </form>
      </div>
    </div>
  );
}
