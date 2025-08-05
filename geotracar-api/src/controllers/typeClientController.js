const TypeClient = require("../models/typeClient");

// GET /api/type-clients
const getAllTypeClients = async (req, res) => {
  try {
    const types = await TypeClient.findAll({ order: [["id", "ASC"]] });
    res.json(types);
  } catch (err) {
    console.error("Error getting type clients:", err);
    res.status(500).json({ error: "Error al obtener tipos de cliente" });
  }
};

// GET /api/type-clients/:id
const getTypeClientById = async (req, res) => {
  try {
    const type = await TypeClient.findByPk(req.params.id);
    if (!type)
      return res.status(404).json({ error: "Tipo de cliente no encontrado" });
    res.json(type);
  } catch (err) {
    console.error("Error getting type client:", err);
    res.status(500).json({ error: "Error al obtener tipo de cliente" });
  }
};

// POST /api/type-clients
const createTypeClient = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name) return res.status(400).json({ error: "El nombre es requerido" });

    // Validar único
    if (await TypeClient.findOne({ where: { name } })) {
      return res.status(409).json({ error: "Este tipo ya existe" });
    }
    const now = new Date();
    const type = await TypeClient.create({ name, create_date: now });
    res.status(201).json(type);
  } catch (err) {
    console.error("Error creating type client:", err);
    res.status(500).json({ error: "Error al crear tipo de cliente" });
  }
};

// PUT /api/type-clients/:id
const updateTypeClient = async (req, res) => {
  try {
    const { name } = req.body;
    const type = await TypeClient.findByPk(req.params.id);
    if (!type)
      return res.status(404).json({ error: "Tipo de cliente no encontrado" });

    // Validar nombre único si hay cambio de nombre
    if (
      name &&
      name !== type.name &&
      (await TypeClient.findOne({ where: { name } }))
    ) {
      return res
        .status(409)
        .json({ error: "Ya existe otro tipo con ese nombre" });
    }

    if (name && name !== type.name) {
      type.name = name;
      type.update_date = new Date();
      await type.save();
    }

    res.json(type);
  } catch (err) {
    console.error("Error updating type client:", err);
    res.status(500).json({ error: "Error al actualizar tipo de cliente" });
  }
};

// DELETE /api/type-clients/:id
const deleteTypeClient = async (req, res) => {
  try {
    const type = await TypeClient.findByPk(req.params.id);
    if (!type)
      return res.status(404).json({ error: "Tipo de cliente no encontrado" });
    await type.destroy();
    res.json({ message: "Tipo de cliente eliminado" });
  } catch (err) {
    console.error("Error deleting type client:", err);
    res.status(500).json({ error: "Error al eliminar tipo de cliente" });
  }
};

module.exports = {
  getAllTypeClients,
  getTypeClientById,
  createTypeClient,
  updateTypeClient,
  deleteTypeClient,
};
