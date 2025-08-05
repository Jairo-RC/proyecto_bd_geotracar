const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");
const OrderTracker = require("./orderTracker"); // Asegúrate de importar el modelo, no el string

const Tracker = sequelize.define(
  "Tracker",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    identifier: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    simNumber: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    orderId: {
      // Sequelize usa camelCase por defecto, pero tu tabla es orderId
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "order_tracker", // OJO: nombre real de la tabla en BD
        key: "id",
      },
      field: "orderId", // Forzar a que use el nombre correcto en la tabla
    },
  },
  {
    tableName: "trackers",
    timestamps: true, // createdAt y updatedAt
  }
);

module.exports = Tracker;
