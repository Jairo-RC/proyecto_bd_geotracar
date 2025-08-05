// src/models/device.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const Device = sequelize.define(
  "Device",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    imei: {
      type: DataTypes.STRING(32),
      unique: true,
      allowNull: true,
      validate: {
        len: [8, 32],
      },
    },
    model: {
      type: DataTypes.STRING(80),
      allowNull: true,
      validate: {
        len: [2, 80],
      },
    },
    status: {
      type: DataTypes.STRING(16),
      allowNull: true,
      defaultValue: "active",
    },
    // Sequelize manejará estas dos:
    // createdAt, updatedAt
  },
  {
    tableName: "devices",
    timestamps: true, // Para que maneje createdAt y updatedAt automáticamente
    underscored: false, // Porque en tu tabla las columnas son camelCase/PascalCase
  }
);

module.exports = Device;
