// src/components/ModalPremium.jsx
import React, { useState } from "react";
import "../ModalPremium.css";

export default function ModalPremium({ open, onClose, onConfirm }) {
  const [payType, setPayType] = useState("tarjeta");
  const [fields, setFields] = useState({
    nombre: "",
    numero: "",
    vencimiento: "",
    cvc: "",
    correoPaypal: "",
  });
  const [touched, setTouched] = useState(false);

  if (!open) return null;

  // Validaciones
  const isCardValid =
    fields.nombre.length > 2 &&
    /^\d{16}$/.test(fields.numero) &&
    /^\d{2}\/\d{2}$/.test(fields.vencimiento) &&
    /^\d{3}$/.test(fields.cvc);

  const isPaypalValid = /\S+@\S+\.\S+/.test(fields.correoPaypal);

  // Envía todo en un solo objeto
  const handlePay = () => {
    setTouched(true);
    if (
      (payType === "tarjeta" && isCardValid) ||
      (payType === "paypal" && isPaypalValid)
    ) {
      onConfirm({
        method: payType, // solo "tarjeta" o "paypal"
        form: {
          cardName: fields.nombre,
          cardNumber: fields.numero,
          cardExp: fields.vencimiento,
          cardCVC: fields.cvc,
          paypalEmail: fields.correoPaypal,
        },
      });
    }
  };

  return (
    <div className="modal-premium-backdrop">
      <div className="modal-premium">
        <h2>Mejorar a Premium</h2>
        <p style={{ marginBottom: 12 }}>
          Obtén <b>50% de descuento</b> en todos los paquetes.
          <br />
          <b>Precio único:</b>{" "}
          <span style={{ color: "#2563eb", fontWeight: 600 }}>₡10,000</span>
        </p>
        <div className="modal-pay-methods">
          <button
            className={payType === "tarjeta" ? "active" : ""}
            onClick={() => setPayType("tarjeta")}
          >
            Tarjeta
          </button>
          <button
            className={payType === "paypal" ? "active" : ""}
            onClick={() => setPayType("paypal")}
          >
            PayPal
          </button>
        </div>
        {payType === "tarjeta" ? (
          <form
            className="modal-form"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="modal-input"
              placeholder="Nombre en tarjeta"
              value={fields.nombre}
              onChange={(e) =>
                setFields((f) => ({ ...f, nombre: e.target.value }))
              }
              maxLength={50}
              required
            />
            <input
              className="modal-input"
              placeholder="Número de tarjeta (16 dígitos)"
              value={fields.numero}
              onChange={(e) =>
                setFields((f) => ({
                  ...f,
                  numero: e.target.value.replace(/\D/g, ""),
                }))
              }
              maxLength={16}
              required
            />
            <div style={{ display: "flex", gap: 10 }}>
              <input
                className="modal-input"
                style={{ flex: 1 }}
                placeholder="MM/AA"
                value={fields.vencimiento}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    vencimiento: e.target.value
                      .replace(/[^0-9/]/g, "")
                      .slice(0, 5),
                  }))
                }
                maxLength={5}
                required
              />
              <input
                className="modal-input"
                style={{ flex: 1 }}
                placeholder="CVC"
                value={fields.cvc}
                onChange={(e) =>
                  setFields((f) => ({
                    ...f,
                    cvc: e.target.value.replace(/\D/g, "").slice(0, 3),
                  }))
                }
                maxLength={3}
                required
              />
            </div>
            {touched && !isCardValid && (
              <div style={{ color: "red", margin: "4px 0", fontSize: 13 }}>
                Verifica los datos de tu tarjeta.
              </div>
            )}
          </form>
        ) : (
          <form
            className="modal-form"
            autoComplete="off"
            onSubmit={(e) => e.preventDefault()}
          >
            <input
              className="modal-input"
              placeholder="Correo de PayPal"
              value={fields.correoPaypal}
              onChange={(e) =>
                setFields((f) => ({ ...f, correoPaypal: e.target.value }))
              }
              required
            />
            {touched && !isPaypalValid && (
              <div style={{ color: "red", margin: "4px 0", fontSize: 13 }}>
                Ingresa un correo válido.
              </div>
            )}
          </form>
        )}
        <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
          <button
            className="modal-premium-btn"
            onClick={handlePay}
            style={{
              opacity:
                (payType === "tarjeta" && !isCardValid) ||
                (payType === "paypal" && !isPaypalValid)
                  ? 0.7
                  : 1,
            }}
          >
            Pagar y mejorar
          </button>
          <button className="modal-premium-cancel" onClick={onClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
}
