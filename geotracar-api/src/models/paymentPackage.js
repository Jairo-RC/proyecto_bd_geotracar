const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const PaymentPackage = sequelize.define(
  "PaymentPackage",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    pay_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "payments", key: "id" },
    },
    package_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: { model: "packages", key: "id" },
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
    tableName: "payment_package",
    timestamps: false,
  }
);

module.exports = PaymentPackage;
