const bcrypt = require("bcrypt");
const { Op } = require("sequelize");
const { Client, OrderTracker, Payment, Vehicle } = require("../models");
const jwt = require("jsonwebtoken");

// Helpers
const generateRandomPassword = () => {
  return Math.random().toString(36).slice(-8); // simple, podés mejorar
};

// Lista paginada y filtrada de usuarios
// GET /api/admin/users?search=&role=&type_client_id=&page=1&limit=25&active=true
async function listUsers(req, res) {
  try {
    const {
      search = "",
      role,
      type_client_id,
      page = 1,
      limit = 25,
      active,
    } = req.query;

    const where = {};
    if (search) {
      where[Op.or] = [
        { name: { [Op.iLike]: `%${search}%` } },
        { email: { [Op.iLike]: `%${search}%` } },
      ];
    }
    if (role) where.role = role;
    if (type_client_id) where.type_client_id = type_client_id;
    if (active !== undefined) {
      // aceptar 'true' / 'false'
      where.is_active = active === "true";
    }

    const offset = (Number(page) - 1) * Number(limit);
    const { count, rows } = await Client.findAndCountAll({
      where,
      order: [["create_date", "DESC"]],
      offset,
      limit: Number(limit),
      attributes: { exclude: ["password"] },
    });

    res.json({
      total: count,
      page: Number(page),
      per_page: Number(limit),
      users: rows,
    });
  } catch (err) {
    console.error("Error listando usuarios admin:", err);
    res.status(500).json({ error: "Error listando usuarios" });
  }
}

// GET /api/admin/users/:id
async function getUser(req, res) {
  try {
    const user = await Client.findByPk(req.params.id, {
      attributes: { exclude: ["password"] },
      include: [
        {
          model: OrderTracker,
          required: false,
          separate: true, // para que el orden y includes funcionen bien en hasMany
          order: [["create_date", "DESC"]],
          include: [
            {
              model: Vehicle,
              required: false,
              attributes: ["id", "plate", "brand", "model"],
            },
            {
              model: Payment,
              required: false,
              attributes: ["id", "amount", "create_date"],
            },
          ],
        },
        {
          model: Payment,
          attributes: ["id", "amount", "create_date"],
          required: false,
        },
      ],
    });
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const plain = user.toJSON();

    // Normalizar: poner sus órdenes en user.orders para frontend
    if (plain.OrderTrackers) {
      plain.orders = plain.OrderTrackers;
      delete plain.OrderTrackers;
    }

    res.json(plain);
  } catch (err) {
    console.error("Error obteniendo usuario admin:", err);
    res.status(500).json({ error: "Error obteniendo usuario" });
  }
}

// POST /api/admin/users
async function createUser(req, res) {
  try {
    const { name, email, password, contact, address, type_client_id, role } =
      req.body;
    if (!name || !email) {
      return res.status(400).json({ error: "Faltan campos requeridos" });
    }

    // Verificar unicidad
    if (await Client.findOne({ where: { email } })) {
      return res.status(409).json({ error: "Email ya registrado" });
    }

    const plainPassword = password || generateRandomPassword();
    const hashed = await bcrypt.hash(plainPassword, 10);

    const user = await Client.create({
      name,
      email,
      password: hashed,
      contact: contact || null,
      address: address || null,
      type_client_id: type_client_id || 1,
      role: role || "client",
    });

    res.status(201).json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type_client_id: user.type_client_id,
        role: user.role,
      },
      tempPassword: password ? undefined : plainPassword,
    });
  } catch (err) {
    console.error("Error creando usuario admin:", err);
    res.status(500).json({ error: "Error creando usuario" });
  }
}

// PUT /api/admin/users/:id
async function updateUser(req, res) {
  try {
    const { name, contact, address, type_client_id, role, is_active } =
      req.body;
    const user = await Client.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    if (name !== undefined) user.name = name;
    if (contact !== undefined) user.contact = contact;
    if (address !== undefined) user.address = address;
    if (type_client_id !== undefined) user.type_client_id = type_client_id;
    if (role !== undefined) user.role = role;
    if (is_active !== undefined) user.is_active = is_active;

    await user.save();
    res.json({
      message: "Usuario actualizado",
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        type_client_id: user.type_client_id,
        role: user.role,
        is_active: user.is_active,
      },
    });
  } catch (err) {
    console.error("Error actualizando usuario admin:", err);
    res.status(500).json({ error: "Error actualizando usuario" });
  }
}

// POST /api/admin/users/:id/reset-password
async function resetPassword(req, res) {
  try {
    const user = await Client.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    const tempPassword = Math.random().toString(36).slice(-8);
    const hashed = await bcrypt.hash(tempPassword, 10);
    user.password = hashed;
    await user.save();

    res.json({ message: "Contraseña reseteada", tempPassword });
  } catch (err) {
    console.error("Error reseteando contraseña:", err);
    res.status(500).json({ error: "Error reseteando contraseña" });
  }
}

// DELETE /api/admin/users/:id
async function deleteUser(req, res) {
  try {
    const user = await Client.findByPk(req.params.id);
    if (!user) return res.status(404).json({ error: "Usuario no encontrado" });

    await user.destroy(); // borrado físico. Si prefieres soft delete, en lugar de destroy podrías hacer is_active = false

    res.json({ message: "Usuario eliminado" });
  } catch (err) {
    console.error("Error eliminando usuario admin:", err);
    res.status(500).json({ error: "Error eliminando usuario" });
  }
}

module.exports = {
  listUsers,
  getUser,
  createUser,
  updateUser,
  resetPassword,
  deleteUser,
};
