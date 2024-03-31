'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Order_Status', {
      orderStatusId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      orderId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        references: {
          model: 'order',
          key: 'orderId'
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE'
      },
      dateUpdate:{
        type:Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP + INTERVAL 7 HOUR')
      },
      status:{
        type:"Success"|"Sending"|"Waiting"|"Reject",
        allowNull: false,
        defaultValue:"Waiting"
      },
      txId:{
        type: Sequelize.STRING,
        allowNull: false
      },
    });
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Order_Product');
  }
};
