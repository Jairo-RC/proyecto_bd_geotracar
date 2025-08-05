const { DataTypes } = require("sequelize");
const sequelize = require("../config/postgres");

const OrderDetail = sequelize.define(
  "OrderDetail",
  {
    id: {
      // PRIMARY KEY!
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    orderId: {
      type: DataTypes.INTEGER,
      allowNull: false,
      references: {
        model: "order_tracker", // Asegúrate de que el modelo Order apunte a la tabla correcta
        key: "id",
      },
    },
    service: {
      type: DataTypes.STRING(120),
      allowNull: false,
    },
    cost: {
      type: DataTypes.FLOAT,
      allowNull: false,
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
    tableName: "order_details",
    timestamps: false, // Usas tus campos personalizados
    underscored: true, // order_id en la base, orderId en el modelo
  }
);

module.exports = OrderDetail;
