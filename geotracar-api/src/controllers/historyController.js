const { TrackFrameMongo, OrderTracker, Payment } = require("../models");


// GET /api/history
exports.getHistory = async (req, res) => {
  try {
    const clientId = req.user.id;

    // 1) Trae todas las órdenes del usuario (sin raw:true para poder mapear)
    const userOrders = await OrderTracker.findAll({
      where: { client_id: clientId },
      order: [["create_date", "ASC"]],
    });

    // 2) Por cada orden, consulta si tiene pago asociado
    const ordersWithPaid = await Promise.all(
      userOrders.map(async (order) => {
        // Busca si hay un pago con ese order_id
        const payment = await Payment.findOne({
          where: { order_id: order.id },
        });
        // Devuelve la orden como objeto plano más el campo paid
        return {
          ...order.toJSON(),
          paid: !!payment, // true si hay pago, false si no
        };
      })
    );

    const orderIds = ordersWithPaid.map((order) => order.id);

    // 3) Trae las tramas de Mongo para esas órdenes
    const trackFrames = await TrackFrameMongo.find({
      order_tracker_id: { $in: orderIds },
    })
      .sort({ create_date: 1 })
      .lean();

    // 4) Devuelve la respuesta como antes pero ahora las órdenes tienen `paid`
    return res.status(200).json({ trackFrames, orders: ordersWithPaid });
  } catch (err) {
    console.error("Error en getHistory:", err);
    return res.status(500).json({ message: "Error al obtener historial" });
  }
};
