// src/routes/payments.js
const express = require("express");
const router = express.Router();
const {
  getPayments,
  createPayment,
  createOrderPayment,
} = require("../controllers/paymentController");
const { requireAuth } = require("../middleware/auth");

// Todas estas rutas requieren usuario autenticado
router.use(requireAuth);

router.get("/", getPayments);
router.post("/", createPayment);
router.post("/order", createOrderPayment);

module.exports = router;
