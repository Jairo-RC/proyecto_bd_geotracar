const Tracker = require("../models/tracker");

// GET /api/trackers
exports.getAllTrackers = async (req, res) => {
  try {
    const trackers = await Tracker.findAll();
    res.json(trackers);
  } catch (err) {
    console.error("Error al obtener trackers:", err);
    res.status(500).json({ error: "Error al obtener trackers" });
  }
};

// GET /api/trackers/:id
exports.getTrackerById = async (req, res) => {
  try {
    const tracker = await Tracker.findByPk(req.params.id);
    if (!tracker)
      return res.status(404).json({ error: "Tracker no encontrado" });
    res.json(tracker);
  } catch (err) {
    console.error("Error al obtener tracker:", err);
    res.status(500).json({ error: "Error al obtener tracker" });
  }
};

// POST /api/trackers
exports.createTracker = async (req, res) => {
  try {
    const { identifier, simNumber, orderId } = req.body;
    if (!identifier) {
      return res
        .status(400)
        .json({ error: "El campo identifier es obligatorio" });
    }
    // Puedes validar orderId aquí si quieres asegurarte que existe

    const newTracker = await Tracker.create({
      identifier,
      simNumber: simNumber || null,
      orderId: orderId || null,
    });
    res.status(201).json(newTracker);
  } catch (err) {
    console.error("Error al crear tracker:", err);
    res.status(400).json({ error: "Error al crear tracker" });
  }
};

// PUT /api/trackers/:id
exports.updateTracker = async (req, res) => {
  try {
    const tracker = await Tracker.findByPk(req.params.id);
    if (!tracker)
      return res.status(404).json({ error: "Tracker no encontrado" });

    const { identifier, simNumber, orderId } = req.body;
    if (identifier !== undefined) tracker.identifier = identifier;
    if (simNumber !== undefined) tracker.simNumber = simNumber;
    if (orderId !== undefined) tracker.orderId = orderId;

    await tracker.save();
    res.json({ message: "Tracker actualizado", tracker });
  } catch (err) {
    console.error("Error al actualizar tracker:", err);
    res.status(400).json({ error: "Error al actualizar tracker" });
  }
};

// DELETE /api/trackers/:id
exports.deleteTracker = async (req, res) => {
  try {
    const tracker = await Tracker.findByPk(req.params.id);
    if (!tracker)
      return res.status(404).json({ error: "Tracker no encontrado" });

    await tracker.destroy();
    res.json({ message: "Tracker eliminado" });
  } catch (err) {
    console.error("Error al eliminar tracker:", err);
    res.status(400).json({ error: "Error al eliminar tracker" });
  }
};
