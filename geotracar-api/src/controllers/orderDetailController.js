const { OrderDetail } = require("../models");

// GET /api/order-details
const getAllOrderDetails = async (req, res) => {
  try {
    const details = await OrderDetail.findAll();
    res.json(details);
  } catch (error) {
    console.error("Error getAllOrderDetails:", error);
    res.status(500).json({ message: "Error al obtener detalles de órdenes" });
  }
};

// GET /api/order-details/:id
const getOrderDetailById = async (req, res) => {
  try {
    const detail = await OrderDetail.findByPk(req.params.id);
    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detalle de orden no encontrado" });
    }
    res.json(detail);
  } catch (error) {
    console.error("Error getOrderDetailById:", error);
    res.status(500).json({ message: "Error al obtener detalle de orden" });
  }
};

// POST /api/order-details
const createOrderDetail = async (req, res) => {
  try {
    const { order_id, description, price } = req.body;
    // Validación mínima
    if (!order_id || !description || price === undefined) {
      return res
        .status(400)
        .json({
          message: "Faltan datos requeridos: order_id, description, price",
        });
    }
    const detail = await OrderDetail.create({ order_id, description, price });
    res.status(201).json(detail);
  } catch (error) {
    console.error("Error createOrderDetail:", error);
    res.status(500).json({ message: "Error al crear detalle de orden" });
  }
};

// PUT /api/order-details/:id
const updateOrderDetail = async (req, res) => {
  try {
    const detail = await OrderDetail.findByPk(req.params.id);
    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detalle de orden no encontrado" });
    }
    const { description, price } = req.body;
    if (description !== undefined) detail.description = description;
    if (price !== undefined) detail.price = price;
    await detail.save();
    res.json({ message: "Detalle de orden actualizado", detail });
  } catch (error) {
    console.error("Error updateOrderDetail:", error);
    res.status(500).json({ message: "Error al actualizar detalle de orden" });
  }
};

// DELETE /api/order-details/:id
const deleteOrderDetail = async (req, res) => {
  try {
    const detail = await OrderDetail.findByPk(req.params.id);
    if (!detail) {
      return res
        .status(404)
        .json({ message: "Detalle de orden no encontrado" });
    }
    await detail.destroy();
    res.json({ message: "Detalle de orden eliminado" });
  } catch (error) {
    console.error("Error deleteOrderDetail:", error);
    res.status(500).json({ message: "Error al eliminar detalle de orden" });
  }
};

module.exports = {
  getAllOrderDetails,
  getOrderDetailById,
  createOrderDetail,
  updateOrderDetail,
  deleteOrderDetail,
};
