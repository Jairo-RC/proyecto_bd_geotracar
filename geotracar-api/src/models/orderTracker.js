// src/models/orderTracker.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const OrderTracker = sequelize.define(
  "OrderTracker",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "clients", key: "id" },
    },
    vehicle_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "vehicles", key: "id" },
    },
    arrival_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: true },
    },
    departure_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      validate: { isDate: true },
    },

    // ← Nuevas columnas:
    origin: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    destination: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: { notEmpty: true },
    },
    cost: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },

    create_date: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    update_date: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    description: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
    type_track_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
    },
    code_qr: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    tableName: "order_tracker",
    timestamps: false,
    underscored: true,
  }
);

module.exports = OrderTracker;
