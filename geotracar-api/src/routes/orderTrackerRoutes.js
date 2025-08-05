// src/routes/orderTrackerRoutes.js
const express = require("express");
const router = express.Router();
const {
  getOrders,
  getOrderById,
  createOrder,
  getOrdersByClient,
} = require("../controllers/orderTrackerController");
const { requireAuth } = require("../middleware/auth");
const { getOrderRoute } = require("../controllers/orderTrackerController");

// pública: todas las órdenes
router.get("/", getOrders);

// protegida: las del cliente logueado
router.get("/my-orders", requireAuth, getOrdersByClient);

// pública: traer una por ID
router.get("/:id(\\d+)", getOrderById);

// protegida: crear con client_id de JWT
router.post("/", requireAuth, createOrder);

router.get("/:id(\\d+)/route", requireAuth, getOrderRoute);

module.exports = router;
