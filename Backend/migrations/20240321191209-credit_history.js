'use strict';

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
      creditId:{
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
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 7 HOUR')
      },
      approvDate:{
        type:Sequelize.DATE,
        allowNull: true,
        defaultValue:null
      },
      updateType: {
        type: "Add"|"Decrease"|"Used"|"Payment",
        allowNull: false,
      },
      status:{
        type:"Aeccept"|"Reject"|"Waiting",
        allowNull: false,
        defaultValue:"Waiting"
      },
      txId:{
        type: Sequelize.STRING,
        allowNull: true,
        defaultValue:null
      }
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Credit_History');
  }
};
