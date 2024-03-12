
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {

    productId: {
      type: DataTypes.BIGINT,
      allowNull: false,
      unique: true,
      primaryKey: true,
      autoIncrement: true
    },

    productName: {
      type: DataTypes.STRING,
      allowNull: false
    },

    productDescription: {
      type: DataTypes.STRING,
      allowNull: false
    },

    productPrice: {
      type: DataTypes.FLOAT,
      allowNull: false
    },

    productQuantity: {
      type: DataTypes.INTEGER,
      allowNull: false
    },

  });
  return Product
}
