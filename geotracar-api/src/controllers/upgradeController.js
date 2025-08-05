// src/controllers/upgradeController.js

const { Client, Payment } = require("../models");

const UPGRADE_FEE = 10000; // monto fijo
const UPGRADE_TYPE_PAY_ID = 3; // ID del tipo de pago "Upgrade Premium" (verifica que sea 3)

// POST /api/clients/upgrade
async function upgradeToPremium(req, res) {
  try {
    const clientId = req.user.id;
    const client = await Client.findByPk(clientId);

    // 1. Validar que el cliente exista
    if (!client) {
      return res.status(404).json({ error: "Cliente no encontrado" });
    }

    // 2. Validar que no sea ya Premium
    if (client.type_client_id === 2) {
      return res.status(400).json({ error: "Ya eres Premium" });
    }

    // 3. Extraer datos de pago
    const { type_pay_id, card, paypal } = req.body;
    const typePayId = Number(type_pay_id);


    // 4. Validar tipo de pago y datos requeridos según corresponda
    if (typePayId === 1) {
      // Pago con tarjeta
      if (!card || !card.number) {
        return res
          .status(400)
          .json({ error: "Datos de tarjeta incompletos o inválidos" });
      }
    } else if (typePayId === 2) {
      // Pago con PayPal
      if (!paypal || typeof paypal !== "string" || paypal.length < 5) {
        return res
          .status(400)
          .json({ error: "Datos de PayPal incompletos o inválidos" });
      }
    } else {
      // Tipo de pago inválido
      return res.status(400).json({ error: "Método de pago inválido" });
    }

    // 5. Preparar info de pago
    let cardInfo = null;
    let paypalInfo = null;

    if (typePayId === 1) {
      cardInfo = `${card.name || "No Name"} - ****${card.number.slice(-4)}`;
    }
    if (typePayId === 2) {
      paypalInfo = paypal;
    }

    // 6. Crear el registro de pago
    const payment = await Payment.create({
      client_id: clientId,
      amount: UPGRADE_FEE,
      concept: "Upgrade a Premium",
      status: "completed",
      type_pay_id: typePayId,
      card: cardInfo,
      paypal: paypalInfo,
    });

    // 7. Actualizar el cliente a Premium
    client.type_client_id = 2;
    client.premium_since = new Date();
    await client.save();

    // 8. Responder OK
    res.json({
      message: "¡Felicidades! Ahora eres Premium.",
      paymentId: payment.id,
    });
  } catch (err) {
    console.error("Error en upgradeToPremium:", err);
    res.status(500).json({ error: "Error al procesar upgrade" });
  }
}

module.exports = { upgradeToPremium };
