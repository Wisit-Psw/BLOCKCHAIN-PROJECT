'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Product', {
      productId: {
        type: Sequelize.BIGINT,
        allowNull: false,
        primaryKey: true,
        unique: true,
        autoIncrement: true
      },
      productName: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productImage: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productDescription: {
        type: Sequelize.STRING,
        allowNull: false
      },
      productPrice: {
        type: Sequelize.FLOAT,
        allowNull: false
      },
      productQuantity: {
        type: Sequelize.INTEGER,
        allowNull: false
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

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Product');
  }
};
