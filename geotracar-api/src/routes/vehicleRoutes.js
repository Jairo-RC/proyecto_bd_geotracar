// routes/vehicleRoutes.js
const express = require('express');
const { getAllVehicles, createVehicle } = require('../controllers/vehicleController');
const router = express.Router();

router
  .route('/')
  .get(getAllVehicles)
  .post(createVehicle);

module.exports = router;
