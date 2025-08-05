// src/models/index.js
require("dotenv").config();
const sequelize = require("../config/postgres");

// Sequelize models
const Client = require("./client");
const TypeClient = require("./typeClient");
const Vehicle = require("./vehicle");
const OrderDetail = require("./orderDetail");
const OrderTracker = require("./orderTracker");
const Package = require("./package");
const Payment = require("./payment");
const PaymentPackage = require("./paymentPackage");
const Device = require("./device");
const Location = require("./location");
const TrackFrame = require("./trackFrameSql"); // Tramas SQL
const TrackFrameMongo = require("./trackFrameMongo"); // Tramas Mongoose
const Tracker         = require("./tracker");

// --- RELACIONES ---

// 1) Tipo de Cliente ↔ Cliente
TypeClient.hasMany(Client, { foreignKey: "type_client_id" });
Client.belongsTo(TypeClient, { foreignKey: "type_client_id" });

// 2) Cliente ↔ Vehículo
Client.hasMany(Vehicle, { foreignKey: "client_id" });
Vehicle.belongsTo(Client, { foreignKey: "client_id" });

// 3) Vehículo ↔ Orden de Rastreo
Vehicle.hasMany(OrderTracker, { foreignKey: "vehicle_id" });
OrderTracker.belongsTo(Vehicle, { foreignKey: "vehicle_id" });

// 4) Cliente ↔ Orden de Rastreo
Client.hasMany(OrderTracker, { foreignKey: "client_id" });
OrderTracker.belongsTo(Client, { foreignKey: "client_id" });

// 5) Pago ↔ Cliente
Client.hasMany(Payment, { foreignKey: "client_id" });
Payment.belongsTo(Client, { foreignKey: "client_id" });

// 6) Pago ↔ Paquete (Many-to-Many via payment_package)
Payment.hasMany(PaymentPackage, { foreignKey: "pay_id" });
PaymentPackage.belongsTo(Payment, { foreignKey: "pay_id" });

Package.hasMany(PaymentPackage, { foreignKey: "package_id" });
PaymentPackage.belongsTo(Package, { foreignKey: "package_id" });

// 7) Dispositivo ↔ Ubicaciones
Device.hasMany(Location, { foreignKey: "device_id" });
Location.belongsTo(Device, { foreignKey: "device_id" });

// 8) Orden de Rastreo ↔ TrackFrames (SQL)
OrderTracker.hasMany(TrackFrame, { foreignKey: "order_tracker_id" });
TrackFrame.belongsTo(OrderTracker, { foreignKey: "order_tracker_id" });

// 9) Orden de Rastreo ↔ Detalles de Orden
OrderTracker.hasMany(OrderDetail, { foreignKey: "order_id" });
OrderDetail.belongsTo(OrderTracker, { foreignKey: "order_id" });

// 10) Orden de Rastreo ↔ Pagos
OrderTracker.hasMany(Payment, { foreignKey: "order_id" });
Payment.belongsTo(OrderTracker, { foreignKey: "order_id" });

// 11) Orden de Rastreo ↔ Trackers
OrderTracker.hasMany(Tracker, { foreignKey: "orderId" });
Tracker.belongsTo(OrderTracker, { foreignKey: "orderId" });


// --- EXPORTA MODELOS ---
module.exports = {
  sequelize,
  Client,
  TypeClient,
  Vehicle,
  OrderDetail,
  OrderTracker,
  Package,
  Payment,
  PaymentPackage,
  Device,
  Location,
  TrackFrame, // PostgreSQL
  TrackFrameMongo,
  Tracker
};
