'use strict';

module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn("order_tracker", "origin", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    });
    await queryInterface.addColumn("order_tracker", "destination", {
      type: Sequelize.STRING,
      allowNull: false,
      defaultValue: ""
    });
    await queryInterface.addColumn("order_tracker", "cost", {
      type: Sequelize.INTEGER,
      allowNull: false,
      defaultValue: 0
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn("order_tracker", "origin");
    await queryInterface.removeColumn("order_tracker", "destination");
    await queryInterface.removeColumn("order_tracker", "cost");
  }
};

