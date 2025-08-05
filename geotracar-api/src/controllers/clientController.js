const Client = require("../models/client");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

// Helper para validar email simple
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// GET /api/clients
const getClients = async (req, res) => {
  try {
    const clients = await Client.findAll({
      attributes: { exclude: ["password"] },
    });
    res.json(clients);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Error al obtener clientes" });
  }
};

// GET /api/clients/:id
const getClientById = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id, {
      include: [{ model: TypeClient, attributes: ["name"] }],
    });
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });
    res.json({
      ...client.toJSON(),
      type_name: client.TypeClient ? client.TypeClient.name : "free",
    });
  } catch (error) {
    res.status(500).json({ error: "Error al obtener cliente" });
  }
};

// POST /api/clients
const createClient = async (req, res) => {
  try {
    const { name, email, password, type_client_id } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "Faltan datos obligatorios" });
    }
    if (!isValidEmail(email)) {
      return res.status(400).json({ error: "Email inválido" });
    }
    if (password.length < 6) {
      return res
        .status(400)
        .json({ error: "La contraseña debe tener mínimo 6 caracteres" });
    }
    if (await Client.findOne({ where: { email } })) {
      return res.status(409).json({ error: "Email ya registrado" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const now = new Date();

    const client = await Client.create({
      name,
      email,
      password: hashedPassword,
      type_client_id: type_client_id || 1,
      track_available: true,
      create_date: now,
    });

    res.status(201).json({
      id: client.id,
      name: client.name,
      email: client.email,
      message: "Cliente creado correctamente",
    });
  } catch (error) {
    console.error("Error createClient:", error);
    res.status(500).json({ error: "Error al crear cliente" });
  }
};

// POST /api/clients/login
const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Email y contraseña requeridos" });

    const client = await Client.findOne({ where: { email } });
    if (!client) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }

    const isMatch = await bcrypt.compare(password, client.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Contraseña incorrecta" });
    }

    client.last_connection = new Date();
    await client.save();

    // Si tienes un campo rol, úsalo. Si no, ajusta a lo que tengas.
    const token = jwt.sign(
      { id: client.id, role: client.role || "client" },
      process.env.JWT_SECRET || "geotracar_secret",
      { expiresIn: "12h" }
    );

    return res.json({
      token,
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        contact: client.contact || "",
        address: client.address || "",
        role: client.role || "client",
        type_client_id: client.type_client_id, 
        last_connection: client.last_connection,
      },
      message: "Login exitoso",
    });
  } catch (error) {
    console.error("Error login:", error);
    return res.status(500).json({ message: "Error de servidor" });
  }
};

// PUT /api/clients/:id
const updateClient = async (req, res) => {
  try {
    const {
      name,
      contact,
      address,
      type_client_id,
      track_available,
      password,
    } = req.body;
    const client = await Client.findByPk(req.params.id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    if (name !== undefined) client.name = name;
    if (contact !== undefined) client.contact = contact;
    if (address !== undefined) client.address = address;
    if (type_client_id !== undefined) client.type_client_id = type_client_id;
    if (track_available !== undefined) client.track_available = track_available;
    if (password) {
      if (password.length < 6) {
        return res
          .status(400)
          .json({ error: "La contraseña debe tener mínimo 6 caracteres" });
      }
      client.password = await bcrypt.hash(password, 10);
    }
    client.update_date = new Date();

    await client.save();
    res.json({
      message: "Cliente actualizado",
      client: {
        id: client.id,
        name: client.name,
        email: client.email,
        contact: client.contact || "",
        address: client.address || "",
        role: client.role || "client",
        type_client_id: client.type_client_id,
        track_available: client.track_available,
        update_date: client.update_date,
      },
    });
  } catch (error) {
    console.error("Error updateClient:", error);
    res.status(500).json({ error: "Error al actualizar cliente" });
  }
};

// DELETE /api/clients/:id
const deleteClient = async (req, res) => {
  try {
    const client = await Client.findByPk(req.params.id);
    if (!client)
      return res.status(404).json({ error: "Cliente no encontrado" });

    await client.destroy();
    res.json({ message: "Cliente eliminado" });
  } catch (error) {
    console.error("Error deleteClient:", error);
    res.status(500).json({ error: "Error al eliminar cliente" });
  }
};

module.exports = {
  getClients,
  getClientById,
  createClient,
  login,
  updateClient,
  deleteClient,
};
