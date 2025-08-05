// src/routes/clientRoutes.js

const express = require("express");
const router = express.Router();

const {
  getClients,
  getClientById,
  createClient,
  login,
  updateClient,
  deleteClient,
} = require("../controllers/clientController");

const { requireAuth, requireAdmin } = require("../middleware/auth");

// Middleware: Permite acceso al recurso propio o si es admin
const requireSelfOrAdmin = (req, res, next) => {
  const { role, id: userId } = req.user;
  const paramId = parseInt(req.params.id, 10);
  if (role === "admin" || userId === paramId) {
    return next();
  }
  return res.status(403).json({ error: "Acceso denegado" });
};

/**
 * GET /api/clients
 * - Solo los admin pueden ver todos los clientes
 */
router.get("/", requireAuth, requireAdmin, getClients);

/**
 * POST /api/clients
 * - Registro abierto para cualquier usuario
 */
router.post("/", createClient);

/**
 * POST /api/clients/login
 * - Login de usuario
 */
router.post("/login", login);

/**
 * Rutas para un cliente específico:
 * - Solo admin o el mismo usuario puede consultar o modificar sus datos.
 * - Solo admin puede eliminar usuarios.
 */
router
  .route("/:id")
  .get(requireAuth, requireSelfOrAdmin, getClientById)
  .put(requireAuth, requireSelfOrAdmin, updateClient)
  .delete(requireAuth, requireAdmin, deleteClient);

module.exports = router;
