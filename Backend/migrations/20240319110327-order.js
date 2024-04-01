'use strict';
const { Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order', {
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
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
      totalPrice: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      createDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      createTxId: {
        type: Sequelize.STRING,
        allowNull: false
      },
      sendDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      sendTxId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      approvDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      approvTxId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      },
      status: {
        type: Sequelize.STRING, //"Success"|"Sending"|"Waiting"|"Reject"
        allowNull: false,
        defaultValue: "Waiting"
      }
    });

    // Add interval to createDate after table creation
    await queryInterface.sequelize.query(
      'ALTER TABLE `Order` MODIFY COLUMN `createDate` DATETIME NOT NULL DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 HOUR)'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order');
  }
};

