'use strict';
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Credit_Payment_History', {
      creditPayHisId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      creditId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Credit',
          key: 'creditId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      creditTotal: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      creditUsed: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      creditAmount: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      txId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE `Credit_Payment_History` MODIFY COLUMN `date` DATETIME NOT NULL DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 HOUR)'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Credit_Payment_History');
  }
};
