const express = require('express');
const router = express.Router();
const mysql = require('mysql');
let env = (require('dotenv').config()).parsed

class PrductController {

  dbConnection = mysql.createConnection({
    host: env.DB_HOST,
    user: env.DB_USERNAME,
    password: env.DB_PASSWORD,
    database: env.DB_NAME,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
  });

  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.get('', this.getProduct);
  }

  getProduct = (req, res) => {
    try {
      const query = "SELECT * FROM `product`";
      this.dbConnection.query(query, (err, result) => {
        if (err) {
          res.status(500).send(err);
        }
        res.status(200).send(result);
      });
    } catch (e) {
      res.status(500).send(e);
    }
  }
}

module.exports = (new PrductController()).router;
