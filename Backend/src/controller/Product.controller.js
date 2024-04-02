const express = require('express');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards')


class PrductController {

  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('/', rolesGuard.isAsuthenticated, this.getProduct);
    this.router.get('/info/:id', rolesGuard.isAsuthenticated, this.getProductData);
    this.router.post('/add', rolesGuard.isSupplier, this.addProduct);
    this.router.post('/update', rolesGuard.isSupplier, this.updateProduct);
    this.router.put('/delete', rolesGuard.isSupplier, this.deleteProduct);
  }

  getProduct = (req, res) => {
    try {
      const user = req.session.user
      let query = "SELECT * FROM `product` ";
      if (user.isSupplier) {
        query += `WHERE supEmail LIKE '${user.userData.email}'`;
      } else {
        query += `WHERE supEmail LIKE '${atob(req.query.supId)}'`;
      }

      dbConnection.query(query, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }

  getProductData = (req, res) => {
    try {
      const prodId = req.params.id;
      const query = `SELECT * FROM product WHERE productId = ${prodId}`;

      dbConnection.query(query, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result[0]);
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }

  addProduct = async (req, res) => {
    const user = req.session.user;

    const { productImage,productName, productDescription, productPrice, productQuantity } = req.body
    const sql = `INSERT INTO product (productName,productImage, productDescription, productPrice, productQuantity, supEmail) VALUES ('${productName}','${productImage}','${productDescription}','${productPrice}','${productQuantity}','${user.userData.email}')`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        console.log(error)
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(201).json({ message: 'Data inserted successfully' });
      }
    });
  }

  updateProduct = (req, res) => {
    const { productId, productName, productDescription, productPrice, productQuantity } = req.body
    const sql = `UPDATE product SET productName='${productName}',productDescription='${productDescription}',productPrice='${productPrice}',productQuantity='${productQuantity}' WHERE productId = ${productId}`;

    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  }

  deleteProduct = (req, res) => {
    const productId = req.query.productId
    const sql = `DELETE FROM product  WHERE productId = ${productId}`;

    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  }

}

module.exports = (new PrductController()).router;
