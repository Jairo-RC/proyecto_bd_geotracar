// src/routes/adminUserRoutes.js
const express = require("express");
const router = express.Router();
const {
  listUsers,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
} = require("../controllers/adminUserController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Todas estas rutas requieren estar autenticado y ser admin
router.use(requireAuth);
router.use(requireAdmin);

// Listar usuarios con filtros
router.get("/users", listUsers);

// Detalle de un usuario
router.get("/users/:id(\\d+)", getUser);

// Crear usuario
router.post("/users", createUser);

// Actualizar usuario
router.put("/users/:id(\\d+)", updateUser);

// Resetear contraseña
router.post("/users/:id(\\d+)/reset-password", resetPassword);

// Eliminar usuario
router.delete("/users/:id", deleteUser);

module.exports = router;
