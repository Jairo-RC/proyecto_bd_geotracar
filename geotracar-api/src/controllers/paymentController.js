// src/controllers/paymentController.js
const Payment = require("../models/payment");
const PaymentPackage = require("../models/paymentPackage");
const OrderTracker = require("../models/orderTracker");
const Client = require("../models/client");

// GET /api/payments
const getPayments = async (req, res) => {
  try {
    const payments = await Payment.findAll({
      include: [
        {
          model: PaymentPackage,
          attributes: ["package_id", "create_date"],
        },
      ],
      order: [["create_date", "DESC"]],
    });
    res.json(payments);
  } catch (err) {
    console.error("Error getPayments:", err);
    res.status(500).json({ error: "Error al obtener pagos" });
  }
};

// POST /api/payments
const createPayment = async (req, res) => {
  try {
    // client_id ya viene del JWT (requireAuth)
    const client_id = req.user.id;
    const { type_pay_id, amount, card, paypal, package_ids } = req.body;

    if (!type_pay_id || !amount) {
      return res
        .status(400)
        .json({ error: "type_pay_id y amount son obligatorios" });
    }
    if (amount <= 0) {
      return res.status(400).json({ error: "El monto debe ser mayor a cero" });
    }

    const now = new Date();
    const payment = await Payment.create({
      client_id,
      type_pay_id,
      amount,
      card: card || null,
      paypal: paypal || null,
      create_date: now,
      update_date: now,
    });

    let packagesLinked = [];
    if (Array.isArray(package_ids) && package_ids.length) {
      const records = package_ids.map((pkgId) => ({
        pay_id: payment.id,
        package_id: pkgId,
        create_date: now,
      }));
      packagesLinked = await PaymentPackage.bulkCreate(records);
    }

    res.status(201).json({
      payment,
      packagesLinked,
      message: "Pago registrado exitosamente",
    });
  } catch (err) {
    console.error("Error createPayment:", err);
    res.status(500).json({ error: "Error al registrar pago" });
  }
};

// POST /api/payments/order
const createOrderPayment = async (req, res) => {
  try {
    const client_id = req.user.id;
    const { order_id, type_pay_id, card, paypal } = req.body;

    console.log("user:", req.user);
    console.log("order_id:", order_id, "type_pay_id:", type_pay_id);

    // 1) Validar orden
    const order = await OrderTracker.findOne({
      where: { id: order_id, client_id },
    });
    console.log("order:", order);

    if (!order) {
      return res
        .status(404)
        .json({ error: "Orden no encontrada para este cliente" });
    }

    // 2) Crear pago usando order.cost
    const amount = order.cost;
    const now = new Date();
    const payment = await Payment.create({
      client_id,
      type_pay_id,
      amount,
      card: type_pay_id === 1 ? card : null,
      paypal: type_pay_id === 2 ? paypal : null,
      order_id,
      create_date: now,
      update_date: now,
    });
    console.log("payment:", payment);

    // 3) Si era free, pasarlo a premium
    const client = await Client.findByPk(client_id);
    if (client && client.type_client_id === 1) {
      client.type_client_id = 2;
      await client.save();
    }

    res.status(201).json({ payment, message: "Pago de orden registrado" });
  } catch (err) {
    console.error("Error createOrderPayment:", err); // Aquí aparecerá el error real
    res.status(500).json({ error: "Error al registrar pago de orden" });
  }
};

module.exports = {
  getPayments,
  createPayment,
  createOrderPayment,
};
