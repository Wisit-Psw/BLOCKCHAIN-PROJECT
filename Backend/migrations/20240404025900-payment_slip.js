'use strict';
const { Sequelize } = require('sequelize');

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Payment_Slip', {
      slipImageId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      creditHisId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'Credit_History',
          key: 'creditHisId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      slipImage: {
        type: Sequelize.TEXT,
        allowNull: false
      }
    });

    await queryInterface.sequelize.query(
      'ALTER TABLE `Payment_Slip` MODIFY COLUMN `slipImage` LONGTEXT;'
    );
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Payment_Slip');
  }
};
