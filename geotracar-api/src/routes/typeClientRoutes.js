const express = require("express");
const router = express.Router();
const {
  getAllTypeClients,
  getTypeClientById,
  createTypeClient,
  updateTypeClient,
  deleteTypeClient,
} = require("../controllers/typeClientController");

// Listar todos
router.get("/", getAllTypeClients);

// Ver uno
router.get("/:id", getTypeClientById);

// Crear
router.post("/", createTypeClient);

// Actualizar
router.put("/:id", updateTypeClient);

// Borrar
router.delete("/:id", deleteTypeClient);

module.exports = router;
