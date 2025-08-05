const express = require("express");
const router = express.Router();

const { requireAuth } = require("../middleware/auth"); // <--- Importa el middleware
const { getHistory } = require("../controllers/historyController");

/**
 * GET /api/history
 * - Devuelve SOLO el historial del usuario autenticado.
 */
router.get("/", requireAuth, getHistory); // <--- Protege la ruta

module.exports = router;
