const TrackFrame = require("../models/trackFrameMongo");

// POST /api/trackframes
// Body: { order_tracker_id, latitude, longitude, status_id, timestamp? }
const createTrackFrame = async (req, res) => {
  try {
    const { order_tracker_id, latitude, longitude, status_id, timestamp } =
      req.body;

    // Validaciones mínimas
    if (
      order_tracker_id === undefined ||
      latitude === undefined ||
      longitude === undefined ||
      status_id === undefined
    ) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Validar tipo numérico (puedes extender esto si usas strings)
    if (isNaN(Number(latitude)) || isNaN(Number(longitude))) {
      return res
        .status(400)
        .json({ error: "Latitud y longitud deben ser numéricos" });
    }
    if (
      Number(latitude) < 8 ||
      Number(latitude) > 12 ||
      Number(longitude) > -82 ||
      Number(longitude) < -86
    ) {
      return res.status(400).json({ error: "Lat/Lng fuera de Costa Rica" });
    }

    const frame = new TrackFrame({
      order_tracker_id,
      status_id,
      create_date: timestamp ? new Date(timestamp) : new Date(),
      location: {
        type: "Point",
        coordinates: [Number(longitude), Number(latitude)],
      },
    });

    await frame.save();
    res.status(201).json(frame);
  } catch (err) {
    console.error("Error al guardar trama:", err);
    res.status(500).json({ error: "Error al guardar la trama" });
  }
};

// GET /api/trackframes?order_tracker_id=#
const getTrackFrames = async (req, res) => {
  try {
    const { order_tracker_id } = req.query;
    let query = {};
    if (order_tracker_id) query.order_tracker_id = order_tracker_id;

    const frames = await TrackFrame.find(query).sort({ timestamp: 1 });
    res.json(frames);
  } catch (err) {
    console.error("Error al obtener tramas:", err);
    res.status(500).json({ error: "Error al obtener tramas" });
  }
};

module.exports = {
  createTrackFrame,
  getTrackFrames,
};
