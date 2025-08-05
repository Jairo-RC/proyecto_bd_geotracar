const express = require("express");
const router = express.Router();
const {
  listOrders,
  getOrder,
  createOrderAdmin,
  updateOrderAdmin,
  cancelOrderAdmin,
} = require("../controllers/adminOrderController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Protegidas: autenticado + admin
router.use(requireAuth);
router.use(requireAdmin);

// Listar todas las órdenes
router.get("/orders", listOrders);

// Detalle de orden
router.get("/orders/:id(\\d+)", getOrder);

// Crear orden como admin
router.post("/orders", createOrderAdmin);

// Actualizar orden
router.put("/orders/:id(\\d+)", updateOrderAdmin);

// Cancelar / eliminar orden
router.delete("/orders/:id(\\d+)", cancelOrderAdmin);

module.exports = router;
