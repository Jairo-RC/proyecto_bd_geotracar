// src/routes/deviceRoutes.js
const express = require("express");
const router = express.Router();

const {
  getAllDevices,
  createDevice,
} = require("../controllers/deviceController");


/**
 * GET /api/devices
 * - Lista todos los dispositivos
 * POST /api/devices
 * - Crea un nuevo dispositivo
 */
router.route("/").get(getAllDevices).post(createDevice);

module.exports = router;
