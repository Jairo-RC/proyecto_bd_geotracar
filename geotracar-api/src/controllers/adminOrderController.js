// src/controllers/adminOrderController.js (o como lo tengas nombrado)
const { OrderTracker, Payment, Client, Vehicle } = require("../models");
const TrackFrameMongo = require("../models/trackFrameMongo");
const NodeGeocoder = require("node-geocoder");
const { Op } = require("sequelize");

// Cálculo simple de coste (puedes reemplazar con la real si ya existe otra)
function calculateCost(origin, destination) {
  const baseCost = 5;
  const fakeDistance = 10;
  const perKmRate = 2;
  return baseCost + fakeDistance * perKmRate;
}

const geocoder = NodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER || "openstreetmap",
  apiKey: process.env.GEOCODER_API_KEY || null,
  formatter: null,
});

// GET /api/admin/orders
// filtros: client_id, vehicle_id, from, to, description
async function listOrders(req, res) {
  try {
    const {
      client_id,
      vehicle_id,
      from,
      to,
      page = 1,
      limit = 25,
      description,
    } = req.query;

    const where = {};
    if (client_id) where.client_id = client_id;
    if (vehicle_id) where.vehicle_id = vehicle_id;
    if (description)
      where.description = {
        [Op.iLike]: `%${description}%`,
      };
    if (from) {
      where.create_date = where.create_date || {};
      where.create_date[Op.gte] = new Date(from);
    }
    if (to) {
      where.create_date = where.create_date || {};
      const until = new Date(to);
      until.setHours(23, 59, 59, 999);
      where.create_date[Op.lte] = until;
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await OrderTracker.findAndCountAll({
      where,
      order: [["create_date", "DESC"]],
      offset,
      limit: Number(limit),
      include: [
        { model: Client, attributes: ["id", "name", "email"] },
        { model: Vehicle, attributes: ["id", "plate", "brand", "model"] },
        { model: Payment, attributes: ["id", "amount", "create_date"] },
      ],
    });

    // DEBUG: ver qué incluye exactamente
    console.log(
      "orders rows with includes:",
      JSON.stringify(
        rows.map((r) => r.toJSON()),
        null,
        2
      )
    );

    // Normalizar: poner client y vehicle, y paid
    const result = rows.map((o) => {
      const plain = o.toJSON();
      return {
        ...plain,
        client: plain.Client || null,
        vehicle: plain.Vehicle || null,
        paid: (plain.Payments?.length || 0) > 0,
      };
    });

    res.json({
      total: count,
      page: Number(page),
      per_page: Number(limit),
      orders: result,
    });
  } catch (err) {
    console.error("Error listando órdenes admin:", err);
    res.status(500).json({ error: "Error listando órdenes" });
  }
}

// GET /api/admin/orders/:id
async function getOrder(req, res) {
  try {
    const order = await OrderTracker.findByPk(req.params.id, {
      include: [
        { model: Client, attributes: ["id", "name", "email", "contact"] },
        { model: Vehicle, attributes: ["id", "plate", "brand", "model"] },
        { model: Payment, attributes: ["id", "amount", "create_date"] },
      ],
    });
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });

    const plain = order.toJSON();
    plain.paid = (plain.Payments?.length || 0) > 0;

    // Traer ruta/trackframes desde Mongo
    const trackFrames = await TrackFrameMongo.find({
      order_tracker_id: order.id,
    }).sort({ timestamp: 1 });

    res.json({
      ...plain,
      client: plain.Client || null,
      vehicle: plain.Vehicle || null,
      trackFrames,
    });
  } catch (err) {
    console.error("Error obteniendo orden admin:", err);
    res.status(500).json({ error: "Error obteniendo orden" });
  }
}

// POST /api/admin/orders
async function createOrderAdmin(req, res) {
  try {
    const {
      client_id,
      vehicle_id,
      arrival_date,
      departure_date,
      origin,
      destination,
      description,
      // type_track_id,  <-- eliminado según petición previa
      // code_qr,        <-- eliminado
    } = req.body;

    if (!client_id || !origin || !destination || !vehicle_id) {
      return res.status(400).json({
        error: "client_id, vehicle_id, origin y destination son obligatorios",
      });
    }

    const client = await Client.findByPk(client_id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    // Geocodificación
    const [origGeo] = await geocoder.geocode(origin);
    const [destGeo] = await geocoder.geocode(destination);
    if (!origGeo || !destGeo) {
      return res
        .status(400)
        .json({ error: "No se pudo geocodificar origen o destino" });
    }

    const cost = calculateCost(origin, destination);
    const now = new Date();
    const order = await OrderTracker.create({
      client_id,
      vehicle_id,
      arrival_date,
      departure_date,
      origin,
      destination,
      description: description || null,
      cost,
      create_date: now,
    });

    // Posiciones inicial y final en Mongo
    await TrackFrameMongo.create({
      order_tracker_id: order.id,
      status_id: 1,
      create_date: now,
      location: {
        type: "Point",
        coordinates: [origGeo.longitude, origGeo.latitude],
      },
    });
    await TrackFrameMongo.create({
      order_tracker_id: order.id,
      status_id: 2,
      create_date: now,
      location: {
        type: "Point",
        coordinates: [destGeo.longitude, destGeo.latitude],
      },
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("Error creando orden admin:", err);
    res.status(500).json({ error: "Error creando orden" });
  }
}

// PUT /api/admin/orders/:id
async function updateOrderAdmin(req, res) {
  try {
    const order = await OrderTracker.findByPk(req.params.id);
    if (!order) return res.status(404).json({ error: "Orden no encontrada" });

    const {
      vehicle_id,
      arrival_date,
      departure_date,
      origin,
      destination,
      description,
      cost,
    } = req.body;

    if (vehicle_id !== undefined) order.vehicle_id = vehicle_id;
    if (arrival_date !== undefined) order.arrival_date = arrival_date;
    if (departure_date !== undefined) order.departure_date = departure_date;
    if (origin !== undefined) order.origin = origin;
    if (destination !== undefined) order.destination = destination;
    if (description !== undefined) order.description = description;
    if (cost !== undefined) order.cost = cost;

    order.update_date = new Date();
    await order.save();

    res.json({ message: "Orden actualizada", order });
  } catch (err) {
    console.error("Error actualizando orden admin:", err);
    res.status(500).json({ error: "Error actualizando orden" });
  }
}

// DELETE /api/admin/orders/:id
async function cancelOrderAdmin(req, res) {
  const orderId = parseInt(req.params.id, 10);
  try {
    // 1. Borra track_frames en MongoDB (si tienes tracking asociado)
    await TrackFrameMongo.deleteMany({ order_tracker_id: orderId });

    // 2. Borra pagos asociados a la orden
    await Payment.destroy({ where: { order_id: orderId } });

    // 3. Borra la orden
    const deleted = await OrderTracker.destroy({ where: { id: orderId } });

    if (!deleted) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }

    res.json({ message: "Orden eliminada correctamente" });
  } catch (err) {
    console.error("Error cancelando orden admin:", err);
    res.status(500).json({ error: "Error eliminando orden" });
  }
}

module.exports = {
  listOrders,
  getOrder,
  createOrderAdmin,
  updateOrderAdmin,
  cancelOrderAdmin,
};
