// src/models/trackFrameSql.js
const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const TrackFrame = sequelize.define(
  "TrackFrame",
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    order_tracker_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order_tracker", // <-- Importante para FK en Sequelize
        key: "id",
      },
    },
    latitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    longitude: {
      type: DataTypes.DOUBLE,
      allowNull: false,
    },
    status_id: {
      type: DataTypes.INTEGER,
      allowNull: false, // Mejor requerido, refleja el estatus del frame
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
  },
  {
    tableName: "track_frame",
    timestamps: false,
    underscored: true,
  }
);

module.exports = TrackFrame;
