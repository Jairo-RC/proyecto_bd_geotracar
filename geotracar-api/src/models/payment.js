const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const Payment = sequelize.define(
  "Payment",
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    client_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    type_pay_id: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "type_pay",
        key: "id",
      },
    },
    amount: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    card: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    paypal: {
      type: DataTypes.STRING,
      allowNull: true,
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
    order_id: {
      type: DataTypes.INTEGER,
      allowNull: true,
      references: {
        model: "order_tracker",
        key: "id",
      },
    },
  },
  {
    tableName: "payments",
    timestamps: false,
  }
);

module.exports = Payment;
