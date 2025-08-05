const { Vehicle } = require("../models");

// GET /api/admin/vehicles
// Opciones de filtro: plate, brand, model, status
async function listVehiclesAdmin(req, res) {
  try {
    const { plate, brand, model, status, page = 1, limit = 25 } = req.query;
    const where = {};
    if (plate) where.plate = { [require("sequelize").Op.iLike]: `%${plate}%` };
    if (brand) where.brand = { [require("sequelize").Op.iLike]: `%${brand}%` };
    if (model) where.model = { [require("sequelize").Op.iLike]: `%${model}%` };
    if (status !== undefined) where.status = status;

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Vehicle.findAndCountAll({
      where,
      offset,
      limit: Number(limit),
      order: [["id", "ASC"]],
    });

    res.json({
      total: count,
      page: Number(page),
      per_page: Number(limit),
      vehicles: rows,
    });
  } catch (err) {
    console.error("Error listando vehículos admin:", err);
    res.status(500).json({ error: "Error listando vehículos" });
  }
}

// GET /api/admin/vehicles/:id
async function getVehicleAdmin(req, res) {
  try {
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle)
      return res.status(404).json({ error: "Vehículo no encontrado" });

    res.json({ vehicle });
  } catch (err) {
    console.error("Error obteniendo vehículo admin:", err);
    res.status(500).json({ error: "Error obteniendo vehículo" });
  }
}

// POST /api/admin/vehicles
async function createVehicleAdmin(req, res) {
  try {
    const { plate, brand, model, client_id } = req.body;
    if (!plate || !brand) {
      return res.status(400).json({ error: "Placa y marca requeridas" });
    }
    const vehicle = await Vehicle.create({
      plate: plate.trim(),
      brand: brand.trim(),
      model: model ? model.trim() : null,
      client_id: client_id !== undefined ? Number(client_id) : null,
    });
    res.status(201).json(vehicle);
  } catch (err) {
    console.error("Error creando vehículo admin:", err);
    res.status(500).json({ error: "Error creando vehículo" });
  }
}

// PUT /api/admin/vehicles/:id
async function updateVehicleAdmin(req, res) {
  try {
    const { plate, brand, model } = req.body;
    const vehicle = await Vehicle.findByPk(req.params.id);
    if (!vehicle)
      return res.status(404).json({ error: "Vehículo no encontrado" });

    if (plate !== undefined) vehicle.plate = plate;
    if (brand !== undefined) vehicle.brand = brand;
    if (model !== undefined) vehicle.model = model;

    await vehicle.save();
    res.json({ message: "Vehículo actualizado", vehicle });
  } catch (err) {
    console.error("Error actualizando vehículo admin:", err);
    res.status(500).json({ error: "Error actualizando vehículo" });
  }
}

module.exports = {
  listVehiclesAdmin,
  getVehicleAdmin,
  createVehicleAdmin,
  updateVehicleAdmin,
};
