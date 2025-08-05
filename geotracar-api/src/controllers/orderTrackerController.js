// src/controllers/orderTrackerController.js

const { OrderTracker, Payment } = require("../models");
const NodeGeocoder = require("node-geocoder");
const TrackFrameMongo = require("../models/trackFrameMongo");
const QRCode = require("qrcode");

// Cálculo simple de coste por ruta
function calculateCost(origin, destination) {
  const baseCost = 5; // tarifa base fija
  const fakeDistance = 10; // km simulados
  const perKmRate = 2; // tarifa por km
  return baseCost + fakeDistance * perKmRate;
}

// Configura el geocoder
const geocoder = NodeGeocoder({
  provider: process.env.GEOCODER_PROVIDER || "openstreetmap",
  apiKey: process.env.GEOCODER_API_KEY || null,
  formatter: null,
});

// GET /api/orders
async function getOrders(req, res) {
  try {
    const orders = await OrderTracker.findAll({
      order: [["create_date", "DESC"]],
    });
    res.json(orders);
  } catch (err) {
    console.error("Error al obtener órdenes:", err);
    res.status(500).json({ error: "Error al obtener órdenes" });
  }
}

// GET /api/orders/:id/route
async function getOrderRoute(req, res) {
  try {
    const orderId = parseInt(req.params.id, 10);
    const routeDoc = await TrackFrameMongo.findOne({
      order_tracker_id: orderId,
    });
    if (!routeDoc) {
      return res.status(404).json({ error: "Ruta no encontrada" });
    }
    res.json(routeDoc);
  } catch (err) {
    console.error("Error obteniendo ruta:", err);
    res.status(500).json({ error: "Error obteniendo ruta" });
  }
}

// GET /api/orders/:id
async function getOrderById(req, res) {
  try {
    const order = await OrderTracker.findByPk(req.params.id);
    if (!order) {
      return res.status(404).json({ error: "Orden no encontrada" });
    }
    res.json(order);
  } catch (err) {
    console.error("Error al obtener orden:", err);
    res.status(500).json({ error: "Error al obtener orden" });
  }
}

// POST /api/orders
// requireAuth debe poblar req.user.id
async function createOrder(req, res) {
  try {
    const client_id = req.user.id;
    const {
      vehicle_id,
      arrival_date,
      departure_date,
      origin,
      destination,
      description,
      type_track_id,
    } = req.body;

    if (!origin || !destination) {
      return res
        .status(400)
        .json({ error: "origin y destination son obligatorios" });
    }

    // 1) Geocodifica origen y destino
    const [origGeo] = await geocoder.geocode(origin);
    const [destGeo] = await geocoder.geocode(destination);
    if (!origGeo || !destGeo) {
      return res
        .status(400)
        .json({ error: "No se pudo geocodificar origen o destino" });
    }

    // 2) Calcula coste y crea la orden en Postgres (aún SIN QR)
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
      type_track_id: type_track_id || null,
      code_qr: null, // <-- se agrega después
      cost,
      create_date: now,
    });

    // --- Genera el código QR con info de la orden ---
    const qrInfo = {
      id: order.id,
      origin: order.origin,
      destination: order.destination,
      arrival_date: order.arrival_date,
      departure_date: order.departure_date,
      cost: order.cost,
    };
    const qrDataUrl = await QRCode.toDataURL(JSON.stringify(qrInfo));
    order.code_qr = qrDataUrl;
    await order.save();

    // 3) Guarda la posición inicial (origen) en Mongo como GeoJSON Point
    await TrackFrameMongo.create({
      order_tracker_id: order.id,
      status_id: 1,
      create_date: now,
      location: {
        type: "Point",
        coordinates: [origGeo.longitude, origGeo.latitude],
      },
    });

    // 4) Guarda la posición de llegada (destino) en Mongo como GeoJSON Point
    await TrackFrameMongo.create({
      order_tracker_id: order.id,
      status_id: 2,
      create_date: now,
      location: {
        type: "Point",
        coordinates: [destGeo.longitude, destGeo.latitude],
      },
    });

    res.status(201).json(order); // <-- Devuelve la orden con el QR ya listo
  } catch (err) {
    console.error("Error al crear orden:", err);
    res.status(500).json({ error: "Error al crear orden" });
  }
}

// GET /api/orders/my-orders
async function getOrdersByClient(req, res) {
  try {
    const client_id = req.user.id;
    const orders = await OrderTracker.findAll({
      where: { client_id },
      include: [{ model: Payment, attributes: ["id"] }],
      order: [["create_date", "DESC"]],
    });

    // Marca cada orden como pagada si hay al menos un payment asociado
    const result = orders.map((o) => {
      const plain = o.toJSON();
      return {
        ...plain,
        paid: (plain.Payments?.length || 0) > 0,
      };
    });

    res.json(result);
  } catch (err) {
    console.error("Error al obtener órdenes del cliente:", err);
    res.status(500).json({ error: "Error al obtener órdenes del cliente" });
  }
}

module.exports = {
  getOrders,
  getOrderById,
  createOrder,
  getOrdersByClient,
  getOrderRoute,
};
