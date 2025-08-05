const express = require("express");
const router = express.Router();
const {
  listVehiclesAdmin,
  getVehicleAdmin,
  createVehicleAdmin,
  updateVehicleAdmin,
} = require("../controllers/adminVehicleController");
const { requireAuth, requireAdmin } = require("../middleware/auth");

// Protección
router.use(requireAuth);
router.use(requireAdmin);

// Endpoints
router.get("/vehicles", listVehiclesAdmin);
router.get("/vehicles/:id", getVehicleAdmin);
router.post("/vehicles", createVehicleAdmin);
router.put("/vehicles/:id", updateVehicleAdmin);

module.exports = router;
