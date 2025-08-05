const jwt = require("jsonwebtoken");
const { Client } = require("../models");

exports.requireAuth = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;
    if (!auth?.startsWith("Bearer "))
      return res.status(401).json({ error: "No token provided" });

    const token = auth.split(" ")[1];
    const payload = jwt.verify(
      token,
      process.env.JWT_SECRET || "geotracar_secret"
    );

    const user = await Client.findByPk(payload.id);
    if (!user) return res.status(401).json({ error: "Usuario inválido" });

    if (!user.is_active) {
      return res.status(403).json({ error: "Cuenta desactivada" });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error("Auth error:", err);
    res.status(401).json({ error: "Token inválido" });
  }
};

exports.requireAdmin = (req, res, next) => {
  if (!req.user) {
    return res.status(401).json({ error: "No autenticado" });
  }
  if (req.user.role !== "admin") {
    return res
      .status(403)
      .json({ error: "Se requieren permisos de administrador" });
  }
  if (!req.user.is_active) {
    return res
      .status(403)
      .json({ error: "Cuenta de administrador desactivada" });
  }
  next();
};

// Helper flexible
exports.requireRole = (allowed = []) => {
  return (req, res, next) => {
    if (!req.user) return res.status(401).json({ error: "No autenticado" });
    if (!allowed.includes(req.user.role)) {
      return res.status(403).json({ error: "Rol no autorizado" });
    }
    if (!req.user.is_active) {
      return res.status(403).json({ error: "Cuenta desactivada" });
    }
    next();
  };
};
