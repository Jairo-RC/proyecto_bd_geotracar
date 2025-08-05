const Location = require('../models/location');

// GET /api/locations
exports.getAllLocations = async (req, res) => {
  try {
    const locations = await Location.findAll();
    res.json(locations);
  } catch (err) {
    console.error("Error getAllLocations:", err);
    res.status(500).json({ error: 'Error al obtener ubicaciones' });
  }
};

// GET /api/locations/:id
exports.getLocationById = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }
    res.json(location);
  } catch (err) {
    console.error("Error getLocationById:", err);
    res.status(500).json({ error: 'Error al obtener ubicación' });
  }
};

// POST /api/locations
exports.createLocation = async (req, res) => {
  try {
    const { name, latitude, longitude, ...rest } = req.body;
    if (!name || latitude === undefined || longitude === undefined) {
      return res.status(400).json({ error: 'Faltan campos requeridos: name, latitude, longitude' });
    }
    // Puedes agregar validaciones extras para lat/lng si deseas
    const location = await Location.create({ name, latitude, longitude, ...rest });
    res.status(201).json(location);
  } catch (err) {
    console.error("Error createLocation:", err);
    res.status(500).json({ error: 'Error al crear ubicación' });
  }
};

// PUT /api/locations/:id
exports.updateLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }
    const { name, latitude, longitude, ...rest } = req.body;
    if (name !== undefined) location.name = name;
    if (latitude !== undefined) location.latitude = latitude;
    if (longitude !== undefined) location.longitude = longitude;
    Object.assign(location, rest); // actualiza campos extra si hay

    await location.save();
    res.json({ message: 'Ubicación actualizada', location });
  } catch (err) {
    console.error("Error updateLocation:", err);
    res.status(500).json({ error: 'Error al actualizar ubicación' });
  }
};

// DELETE /api/locations/:id
exports.deleteLocation = async (req, res) => {
  try {
    const location = await Location.findByPk(req.params.id);
    if (!location) {
      return res.status(404).json({ error: 'Ubicación no encontrada' });
    }
    await location.destroy();
    res.json({ message: 'Ubicación eliminada' });
  } catch (err) {
    console.error("Error deleteLocation:", err);
    res.status(500).json({ error: 'Error al eliminar ubicación' });
  }
};
