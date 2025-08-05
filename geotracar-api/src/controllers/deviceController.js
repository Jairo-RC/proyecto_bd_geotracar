const { Device } = require('../models');

// GET /api/devices
exports.getAllDevices = async (req, res) => {
  try {
    const devices = await Device.findAll({
      attributes: ['id', 'name', 'imei']
    });
    return res.status(200).json(devices);
  } catch (err) {
    console.error('Error getAllDevices:', err);
    return res.status(500).json({ error: 'Error al obtener dispositivos' });
  }
};

// GET /api/devices/:id
exports.getDeviceById = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id, {
      attributes: ['id', 'name', 'imei']
    });
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });
    return res.json(device);
  } catch (err) {
    console.error('Error getDeviceById:', err);
    return res.status(500).json({ error: 'Error al obtener dispositivo' });
  }
};

// POST /api/devices
exports.createDevice = async (req, res) => {
  try {
    const { name, imei } = req.body;
    if (!name || !imei) {
      return res.status(400).json({ error: "Faltan campos requeridos (name, imei)" });
    }

    // Validación simple IMEI (15 dígitos numéricos)
    if (!/^\d{15}$/.test(imei)) {
      return res.status(400).json({ error: "IMEI inválido (debe tener 15 dígitos numéricos)" });
    }

    // Verifica IMEI único
    const exists = await Device.findOne({ where: { imei } });
    if (exists) {
      return res.status(409).json({ error: "El IMEI ya está registrado" });
    }

    const device = await Device.create({ name, imei });
    return res.status(201).json(device);
  } catch (err) {
    console.error('Error createDevice:', err);
    return res.status(500).json({ error: 'Error al crear dispositivo' });
  }
};

// PUT /api/devices/:id
exports.updateDevice = async (req, res) => {
  try {
    const { name, imei } = req.body;
    const device = await Device.findByPk(req.params.id);
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

    if (imei && !/^\d{15}$/.test(imei)) {
      return res.status(400).json({ error: "IMEI inválido (debe tener 15 dígitos numéricos)" });
    }

    // Solo actualiza si viene algo
    if (name !== undefined) device.name = name;
    if (imei !== undefined) device.imei = imei;

    await device.save();
    return res.json({ message: "Dispositivo actualizado", device });
  } catch (err) {
    console.error('Error updateDevice:', err);
    return res.status(500).json({ error: 'Error al actualizar dispositivo' });
  }
};

// DELETE /api/devices/:id
exports.deleteDevice = async (req, res) => {
  try {
    const device = await Device.findByPk(req.params.id);
    if (!device) return res.status(404).json({ error: 'Dispositivo no encontrado' });

    await device.destroy();
    return res.json({ message: "Dispositivo eliminado" });
  } catch (err) {
    console.error('Error deleteDevice:', err);
    return res.status(500).json({ error: 'Error al eliminar dispositivo' });
  }
};
