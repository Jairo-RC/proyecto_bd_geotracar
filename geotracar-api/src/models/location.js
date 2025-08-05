const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const Location = sequelize.define(
  "Location",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    lat: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: -90, max: 90 },
    },
    lng: {
      type: DataTypes.DOUBLE,
      allowNull: false,
      validate: { min: -180, max: 180 },
    },
    device_id: {
      // Relación con dispositivo
      type: DataTypes.INTEGER,
      allowNull: true,
      references: { model: "devices", key: "id" },
    },
    timestamp: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    tableName: "Locations",
    timestamps: true,
    underscored: false,
  }
);

module.exports = Location;
