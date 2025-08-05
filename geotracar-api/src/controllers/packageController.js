const Package = require("../models/package");

// GET /api/packages
const getPackages = async (req, res) => {
  try {
    const packages = await Package.findAll({ order: [["id", "ASC"]] });
    res.json(packages);
  } catch (err) {
    console.error("Error getPackages:", err);
    res.status(500).json({ error: "Error al obtener paquetes" });
  }
};

// GET /api/packages/:id
const getPackageById = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Paquete no encontrado" });
    res.json(pkg);
  } catch (err) {
    console.error("Error getPackageById:", err);
    res.status(500).json({ error: "Error al obtener paquete" });
  }
};

// POST /api/packages
const createPackage = async (req, res) => {
  try {
    const { name, quantity, amount } = req.body;
    if (!name || quantity === undefined || amount === undefined) {
      return res
        .status(400)
        .json({ error: "Faltan datos requeridos: name, quantity, amount" });
    }
    const now = new Date();
    const pkg = await Package.create({
      name,
      quantity,
      amount,
      create_date: now,
      update_date: now,
    });
    res.status(201).json(pkg);
  } catch (err) {
    console.error("Error createPackage:", err);
    res.status(500).json({ error: "Error al crear paquete" });
  }
};

// PUT /api/packages/:id
const updatePackage = async (req, res) => {
  try {
    const { name, quantity, amount } = req.body;
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Paquete no encontrado" });

    if (name !== undefined) pkg.name = name;
    if (quantity !== undefined) pkg.quantity = quantity;
    if (amount !== undefined) pkg.amount = amount;
    pkg.update_date = new Date();

    await pkg.save();
    res.json({ message: "Paquete actualizado", package: pkg });
  } catch (err) {
    console.error("Error updatePackage:", err);
    res.status(500).json({ error: "Error al actualizar paquete" });
  }
};

// DELETE /api/packages/:id
const deletePackage = async (req, res) => {
  try {
    const pkg = await Package.findByPk(req.params.id);
    if (!pkg) return res.status(404).json({ error: "Paquete no encontrado" });

    await pkg.destroy();
    res.json({ message: "Paquete eliminado" });
  } catch (err) {
    console.error("Error deletePackage:", err);
    res.status(500).json({ error: "Error al eliminar paquete" });
  }
};

module.exports = {
  getPackages,
  getPackageById,
  createPackage,
  updatePackage,
  deletePackage,
};
