const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const Client = sequelize.define(
  "Client",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(80),
      allowNull: false,
      validate: {
        notEmpty: true,
        len: [3, 80],
      },
    },
    email: {
      type: DataTypes.STRING(100),
      allowNull: false,
      unique: true,
      validate: { isEmail: true },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    contact: {
      type: DataTypes.STRING(50),
      allowNull: true,
    },
    address: {
      type: DataTypes.STRING(150),
      allowNull: true,
    },
    type_client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 1, // 1 = Free, 2 = Premium
    },
    premium_since: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    track_available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    last_connection: {
      type: DataTypes.DATE,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("client", "admin"),
      allowNull: false,
      defaultValue: "client",
    },
    is_active: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  {
    tableName: "clients",
    timestamps: false,
    underscored: true,
    indexes: [{ fields: ["email"], unique: true }],
  }
);

module.exports = Client;
