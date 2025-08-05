const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const Vehicle = sequelize.define(
  "Vehicle",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    plate: {
      type: DataTypes.STRING(16), // Limita el tamaño, recomendable (ej: "ABC-1234")
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [3, 16], // Ajusta según tus necesidades
      },
    },
    brand: {
      type: DataTypes.STRING(32), // Limita la longitud, buena práctica
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [2, 32],
      },
    },
    model: {
      type: DataTypes.STRING(32),
      allowNull: true,
      validate: {
        len: [0, 32],
      },
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: true, // Si siempre debe pertenecer a un cliente, cámbialo a false
      references: {
        model: "clients", // nombre exacto de tu tabla en PostgreSQL
        key: "id",
      },
    },
  },
  {
    tableName: "vehicles", // para que la tabla se llame exactamente "vehicles"
    timestamps: false, // desactiva createdAt/updatedAt
    underscored: true, // respeta el snake_case
  }
);

module.exports = Vehicle;
