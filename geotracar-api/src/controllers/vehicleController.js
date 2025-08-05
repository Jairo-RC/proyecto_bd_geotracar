// ===================== IMPORTS =====================
const { Vehicle, OrderTracker, TrackFrame } = require("../models");
const { Op } = require("sequelize");

// ===================== GET /api/vehicles =====================
exports.getAllVehicles = async (req, res) => {
  try {
    const vehicles = await Vehicle.findAll({
      attributes: ["id", "plate", "brand", "model"],
    });

    const enriched = await Promise.all(
      vehicles.map(async (v) => {
        // Buscar la última orden del vehículo
        const lastOrder = await OrderTracker.findOne({
          where: { vehicle_id: v.id },
          order: [["create_date", "DESC"]],
          attributes: ["id"],
        });

        let latest = null;
        if (lastOrder) {
          // Buscar el último TrackFrame (sin filtrar status)
          latest = await TrackFrame.findOne({
            where: { order_tracker_id: lastOrder.id },
            order: [["create_date", "DESC"]],
          });
        }

        return {
          id: v.id,
          plate: v.plate,
          brand: v.brand,
          model: v.model,
          status: latest?.status_id ?? null,
          position: latest?.location?.coordinates
            ? {
                lat: latest.location.coordinates[1],
                lng: latest.location.coordinates[0],
                at: latest.create_date,
              }
            : null,
        };
      })
    );

    return res.status(200).json(enriched);
  } catch (err) {
    console.error("🚨 vehicleController error:", err);
    return res.status(500).json({ error: "Error al obtener vehículos" });
  }
};

// ===================== GET /api/vehicles/:id =====================
exports.getVehicleById = async (req, res) => {
  try {
    const v = await Vehicle.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "Vehículo no encontrado" });

    // Buscar última orden
    const lastOrder = await OrderTracker.findOne({
      where: { vehicle_id: v.id },
      order: [["create_date", "DESC"]],
      attributes: ["id"],
    });

    let latest = null;
    if (lastOrder) {
      latest = await TrackFrame.findOne({
        where: {
          order_tracker_id: lastOrder.id,
          status_id: {
            [Op.in]: [1, 2], // estado 1 = en movimiento, 2 = finalizado
          },
        },
        order: [["create_date", "DESC"]],
      });
    }

    return res.json({
      id: v.id,
      plate: v.plate,
      brand: v.brand,
      model: v.model,
      status: latest?.status_id ?? null,
      position: latest?.location?.coordinates
        ? {
            lat: latest.location.coordinates[1],
            lng: latest.location.coordinates[0],
            at: latest.create_date,
          }
        : null,
    });
  } catch (err) {
    console.error("🚨 getVehicleById error:", err);
    return res.status(500).json({ error: "Error al obtener vehículo" });
  }
};

// ===================== POST /api/vehicles =====================
exports.createVehicle = async (req, res) => {
  try {
    const { plate, brand, model } = req.body;
    if (!plate || !brand || !model)
      return res.status(400).json({ error: "Faltan campos requeridos" });

    const existing = await Vehicle.findOne({ where: { plate } });
    if (existing)
      return res
        .status(409)
        .json({ error: "Ya existe un vehículo con esa placa" });

    const vehicle = await Vehicle.create({ plate, brand, model });
    return res.status(201).json(vehicle);
  } catch (err) {
    console.error("🚨 createVehicle error:", err);
    return res.status(500).json({ error: "Error al crear vehículo" });
  }
};

// ===================== PUT /api/vehicles/:id =====================
exports.updateVehicle = async (req, res) => {
  try {
    const v = await Vehicle.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "Vehículo no encontrado" });

    const { plate, brand, model } = req.body;
    if (plate && plate !== v.plate) {
      const exists = await Vehicle.findOne({ where: { plate } });
      if (exists)
        return res
          .status(409)
          .json({ error: "Ya existe un vehículo con esa placa" });
      v.plate = plate;
    }

    if (brand !== undefined) v.brand = brand;
    if (model !== undefined) v.model = model;

    await v.save();
    res.json({ message: "Vehículo actualizado", vehicle: v });
  } catch (err) {
    console.error("🚨 updateVehicle error:", err);
    res.status(500).json({ error: "Error al actualizar vehículo" });
  }
};

// ===================== DELETE /api/vehicles/:id =====================
exports.deleteVehicle = async (req, res) => {
  try {
    const v = await Vehicle.findByPk(req.params.id);
    if (!v) return res.status(404).json({ error: "Vehículo no encontrado" });

    await v.destroy();
    res.json({ message: "Vehículo eliminado" });
  } catch (err) {
    console.error("🚨 deleteVehicle error:", err);
    res.status(500).json({ error: "Error al eliminar vehículo" });
  }
};
