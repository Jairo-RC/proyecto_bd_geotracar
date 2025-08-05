const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const TypeClient = sequelize.define(
  "TypeClient",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(50), // Limita la longitud (buena práctica)
      allowNull: false,
      unique: true,
      validate: {
        notEmpty: true,
        len: [2, 50],
      },
    },
    create_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    update_date: {
      type: DataTypes.DATEONLY,
      allowNull: true,
    },
  },
  {
    tableName: "type_client",
    timestamps: false,
    underscored: true, // opcional para estandarizar nombres de columna
  }
);

module.exports = TypeClient;
