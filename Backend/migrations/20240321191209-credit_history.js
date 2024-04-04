'use strict';
const { Sequelize } = require('sequelize');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Credit_History', {
      creditHisId: {
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
        allowNull: true,
        defaultValue: 0
      },
      creditUpdate: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      creditAmount: {
        type: Sequelize.FLOAT,
        allowNull: false,
        defaultValue: 0
      },
      requestsDate: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP')
      },
      approvDate: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null
      },
      updateType: {
        type: Sequelize.STRING, //"Add"|"Decrease"|"Used"|"Payment"
        allowNull: false,
      },
      status: {
        type: Sequelize.STRING,//"Accept"|"Reject"|"Waiting",
        allowNull: false,
        defaultValue: "Waiting"
      },
      txId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    });

    // await queryInterface.sequelize.query(
    //   'ALTER TABLE `Credit_History` MODIFY COLUMN `requestsDate` DATETIME NOT NULL DEFAULT DATE_ADD(CURRENT_TIMESTAMP, INTERVAL 7 HOUR)'
    // );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Credit_History');
  }
};
