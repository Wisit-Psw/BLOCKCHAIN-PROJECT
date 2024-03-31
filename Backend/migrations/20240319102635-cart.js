'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.createTable('Cart', {
      cartId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      cusEmail:{
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'email' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      supEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Supplier',
          key: 'email' 
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      }
    });
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.dropTable('Cart');
  }
};
