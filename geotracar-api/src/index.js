// src/index.js
require("dotenv").config();
const express = require("express");
const cors = require("cors");

const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conexiones a bases de datos
require("./config/postgres");
require("./config/mongodb");

// Modelos y relaciones
const { sequelize } = require("./models");

// Import de rutas
const clientRoutes = require("./routes/clientRoutes");
const vehicleRoutes = require("./routes/vehicleRoutes");
const deviceRoutes = require("./routes/deviceRoutes");
const orderDetailRoutes = require("./routes/orderDetailRoutes");
const locationRoutes = require("./routes/locationRoutes");
const typeClientRoutes = require("./routes/typeClientRoutes");
const trackerRoutes = require("./routes/trackerRoutes");
const trackFrameRoutes = require("./routes/trackFrameRoutes");
const packageRoutes = require("./routes/packageRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const historyRoutes = require("./routes/historyRoutes");
const orderTrackerRoutes = require("./routes/orderTrackerRoutes");
const upgradeRoutes = require("./routes/upgradeRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const adminOrderRoutes = require("./routes/adminOrderRoutes");
const adminVehicleRoutes = require("./routes/adminVehicleRoutes");
const adminSummaryRoutes = require("./routes/adminSummaryRoutes");

// Jobs (CRON)
const startOrderValidationJob = require("./jobs/orderValidationJob");
startOrderValidationJob();

// Montar rutas
app.use("/api/clients", clientRoutes);
app.use("/api/vehicles", vehicleRoutes);
app.use("/api/devices", deviceRoutes);
app.use("/api/order-details", orderDetailRoutes);
app.use("/api/locations", locationRoutes);
app.use("/api/type-clients", typeClientRoutes);
app.use("/api/trackers", trackerRoutes);
app.use("/api/trackframes", trackFrameRoutes);
app.use("/api/packages", packageRoutes);
app.use("/api/payments", paymentRoutes); // <— así
app.use("/api/history", historyRoutes);
app.use("/api/orders", orderTrackerRoutes);
app.use("/api", upgradeRoutes);
app.use("/api/admin", adminUserRoutes);
app.use("/api/admin", adminOrderRoutes);
app.use("/api/admin", adminVehicleRoutes);
app.use("/api/admin", adminSummaryRoutes);

// Ruta base
app.get("/", (req, res) => {
  res.send("API GEOTRACAR activa 🚗📡");
});

// 404
app.use((req, res) => {
  res.status(404).json({ error: "Ruta no encontrada" });
});

// Handler de errores
app.use((err, req, res, next) => {
  console.error(err.stack || err);
  res.status(500).json({ error: "Error interno del servidor" });
});

// Sincronizar y arrancar
sequelize
  .sync({ alter: false, force: false })
  .then(() => {
    console.log("📦 Modelos sincronizados con PostgreSQL");
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Servidor escuchando en puerto ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Error conectando a PostgreSQL:", err);
  });
