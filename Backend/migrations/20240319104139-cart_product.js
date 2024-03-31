'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Cart_Product', {
      cartProdId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      cartId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Cart',
          key: 'cartId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Product',
          key: 'productId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      quantity: {
        type: Sequelize.INTEGER,
        allowNull: false,
        defaultValue: 1,

      },
    });
  },

  async down(queryInterface, Sequelize) {
  }
};
