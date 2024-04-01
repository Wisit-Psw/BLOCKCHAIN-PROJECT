'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Credit', {
      creditId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
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
      },
      cusEmail: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: 'Customers',
          key: 'email'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      creditTotal: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      creditAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      dateUpdate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Credit');
  }
};
