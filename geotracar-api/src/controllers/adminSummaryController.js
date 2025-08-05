// src/controllers/adminSummaryController.js
const {
  Client,
  OrderTracker,
  Payment,
  Vehicle,
  TrackFrame,
} = require("../models");
const { Op, fn, col, literal, Sequelize } = require("sequelize");

async function getSummary(req, res) {
  try {
    // Usuarios activos
    const totalUsers = await Client.count({ where: { is_active: true } });

    // Órdenes totales
    const totalOrders = await OrderTracker.count();

    // Top clientes por número de órdenes
    const ordersByClient = await OrderTracker.findAll({
      attributes: [
        "client_id",
        [fn("COUNT", col("OrderTracker.id")), "orders_count"],
      ],
      group: ["client_id", "Client.id", "Client.name", "Client.email"],
      order: [[literal("orders_count"), "DESC"]],
      limit: 5,
      include: [
        {
          model: Client,
          attributes: ["id", "name", "email"],
        },
      ],
    });

    // Ingresos totales (sumatoria de pagos)
    const totalRevenueRow = await Payment.findOne({
      attributes: [[fn("COALESCE", fn("SUM", col("amount")), 0), "total"]],
    });
    const totalRevenue = Number(totalRevenueRow?.toJSON()?.total || 0);

    // Vehículos: obtener último trackframe por vehículo vía su última orden + trackframe
    const vehicles = await Vehicle.findAll({
      attributes: ["id"],
      include: [
        {
          model: OrderTracker,
          attributes: ["id"],
          required: false,
          order: [["create_date", "DESC"]],
          include: [
            {
              model: TrackFrame,
              attributes: ["status_id", "create_date"],
              required: false,
              order: [["create_date", "DESC"]],
              limit: 1,
            },
          ],
          limit: 1,
        },
      ],
    });

    let moving = 0;
    let parked = 0;
    vehicles.forEach((v) => {
      // Navegar la inclusión: Vehicle -> last OrderTracker -> its last TrackFrame
      const lastOrder = v.OrderTrackers?.[0];
      const lastFrame = lastOrder?.TrackFrames?.[0];
      if (!lastFrame) return;
      if (Number(lastFrame.status_id) === 1) moving += 1;
      else if (Number(lastFrame.status_id) === 2) parked += 1;
    });
    const totalVehicles = vehicles.length;
    const inactive = totalVehicles - moving - parked;

    res.json({
      users: { total: totalUsers },
      orders: {
        total: totalOrders,
        top_clients: ordersByClient.map((o) => {
          const plain = o.toJSON();
          return {
            client: plain.Client,
            orders_count: plain.orders_count,
          };
        }),
      },
      revenue: { total: totalRevenue },
      vehicles: {
        total: totalVehicles,
        moving,
        parked,
        inactive,
      },
    });
  } catch (err) {
    console.error("Error obteniendo resumen admin:", err);
    res.status(500).json({ error: "Error obteniendo resumen" });
  }
}

module.exports = { getSummary };
