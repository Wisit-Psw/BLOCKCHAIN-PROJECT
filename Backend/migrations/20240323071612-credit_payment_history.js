'use strict';

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
        type: Sequelize.STRING,
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 7 HOUR')
      },
      txId: {
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue: null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Credit_Payment_History');
  }
};
