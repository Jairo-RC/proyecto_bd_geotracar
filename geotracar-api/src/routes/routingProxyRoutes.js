// src/routes/routingProxyRoutes.js
const express = require("express");
const router = express.Router();
const axios = require("axios");

// POST /api/routing/route
// body: { coordinates: [[lat,lng], ...] }
router.post("/route", async (req, res) => {
  try {
    const { coordinates } = req.body;
    if (!Array.isArray(coordinates) || coordinates.length < 2) {
      return res.status(400).json({ error: "Se requieren al menos dos puntos" });
    }

    // Convierte [lat,lng] a [lng,lat]
    const coords = coordinates.map(([lat, lng]) => [lng, lat]);

    // Valida dentro de Costa Rica (si sigues usando eso)
    const isValidPoint = ([lat, lng]) => lat > 8 && lat < 12 && lng > -86 && lng < -82;
    const filtered = coords.filter(([lng, lat]) => isValidPoint([lat, lng]));

    if (filtered.length < 2) {
      return res
        .status(400)
        .json({ error: "No hay suficientes puntos válidos para rutear" });
    }

    const apiKey = process.env.OPENROUTESERVICE_API_KEY; // pon tu key en .env

    const response = await axios.post(
      "https://api.openrouteservice.org/v2/directions/driving-car/geojson",
      { coordinates: filtered },
      {
        headers: {
          Authorization: apiKey,
          "Content-Type": "application/json",
        },
        timeout: 10000,
      }
    );

    const route = response.data.features[0].geometry.coordinates.map(
      ([lng, lat]) => [lat, lng]
    );
    res.json({ route });
  } catch (err) {
    console.error("Error proxying route:", err?.response?.data || err.message);
    res.status(500).json({ error: "No se pudo obtener la ruta realista" });
  }
});

module.exports = router;
