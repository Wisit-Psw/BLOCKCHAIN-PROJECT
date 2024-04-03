const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mysql = require('mysql');
let env = (require('dotenv').config()).parsed
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards');
const stringToByte = require('../util/byte');
const hashSha256 = require('../util/hash');
const contract = require('../contract/trade.contract');

class SupplierController {
  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/register', this.register);
    this.router.post('/credit-approval',rolesGuard.isSupplier, this.creditApproval);
    this.router.post('/update-credit',rolesGuard.isSupplier, this.updateCredit);
    this.router.post('/submit-order',rolesGuard.isSupplier, this.submitOrder);
    this.router.post('/reject-order',rolesGuard.isSupplier, this.rejectOrder);
    this.router.post('/submit-credit-payment',rolesGuard.isSupplier, this.submitCreditPayment);
  }

  register = async (req, res) => {
    const { email, name, phone, address, password, confirmPassword } = req.body;

    if (email.trim() === '' || !email.includes('@')) {
      return res.status(409).json({ error: 'Invalid email.' });

    }

    if (name.trim() === '') {
      return res.status(409).json({ error: 'Invalid name.' });
    }

    if (phone.trim() === '' || phone.length !== 10 || phone[0] !== '0') {
      return res.status(409).json({ error: 'Invalid phone.' });
    }

    if (address.trim() === '') {
      return res.status(409).json({ error: 'Invalid address.' });
    }

    if (password.trim() === '' || password.length < 8) {
      return res.status(409).json({ error: 'password is not safe.' });

    }

    if (password !== confirmPassword) {
      return res.status(409).json({ error: 'confirm Ppassword is wrong.' });
    }

    dbConnection.query('SELECT * FROM customers WHERE email = ' + `'${email}'`, async (error, results) => {
      if (error) {
        return res.status(500).json({ error: 'Error fetching user from database.' });
      }

      const user = results[0];
      if (user) {
        return res.status(409).json({ error: 'Email already exist.' });
      }
    });

    const hashPass = await bcrypt.hash(password, 10)
    const sql = `INSERT INTO supplier (email, shopName, phone, address, password) VALUES ('${email}','${name}','${phone}','${address}','${hashPass}')`;

    dbConnection.query(sql, (error, results) => {
      if (error) {
        let statusCode = 500;
        if (error.code === 'ER_DUP_ENTRY') {
          statusCode = 409;
        }
        return res.status(statusCode).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  };

  creditApproval(req, res) {
    const body = req.body;
    const user = req.session.user;

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    let credit;
    let sql = `SELECT * FROM credit WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      if (results.length == 0) {
        return res.status(409).send("Invalid creditId.")
      }
      credit = results[0];
    });

    if (body.status === 'Reject') {
      let sql = `UPDATE Credit_History SET dateAccept='${currentDate}', status='Reject',creditAmount='${credit.creditAmount}' WHERE creditHisId = ${body.creditHisId}'`;
      dbConnection.query(sql, (error, results) => {
        if (error) {
          let statusCode = 500;
          return res.status(statusCode).json({ error: error.message });
        }
        return res.status(200).json({ message: 'Data updated successfully' });
      });
    }

    const newTotal = credit.creditTotal + body.creditAmount;
    const newAmount = credit.creditAmount + body.creditAmount;

    sql = `UPDATE Credit_History SET creditTotal='${newTotal}',creditUpdate='${body.creditAmount}',creditAmount='${newAmount}',approvDate='${currentDate}', status='Aeccept' WHERE creditHisId = ${body.creditHisId}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        let statusCode = 500;
        return res.status(statusCode).json({ error: error.message });
      } else {

        sql = `UPDATE Credit SET creditTotal='${newTotal}',creditAmount='${newAmount}',dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
        dbConnection.query(sql, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(200).json({ message: 'Data updated successfully' });
          }
        });
      }
    });
  }

  updateCredit(req, res) {
    const body = req.body;
    const user = req.session.user;

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    let credit;
    sql = `SELECT * FROM credit WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      credit = results[0];
    });

    if (body.newCreditTotal < credit.creditTotal - credit.creditAmount) {
      return res.status(409).send("Invalid credit.");
    }

    const newTotal = credit.creditTotal + body.creditAmount;
    const newAmount = credit.creditAmount + body.creditAmount;

    const txId = '';

    // sql = `UPDATE Credit_History SET creditTotal='${body.newCreditTotal}',dateAccept='${currentDate}',creditUpdateAmount='',dateUpdate='${currentDate}', status='Aeccept' WHERE creditHisId = ${body.creditHisId} AND supEmail LIKE '${user.userData.email}'`;
    let sql = `INSERT INTO Credit_History(creditId,creditTotal, creditUpdate,creditAmount,approvDate,updateType,status,txId) VALUES ('${body.creditId}','${body.newCreditTotal}','${body.newCreditTotal - credit.creditTotal}','${currentDate}','${body.newCreditTotal - credit.creditTotal > 0 ? "Add" : "Decrease"},'Aeccept'. '${txId}')`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        sql = `UPDATE Credit SET creditTotal='${newTotal}',creditAmount='${newAmount}',dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
        dbConnection.query(sql, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(200).json({ message: 'Data updated successfully' });
          }
        });
      }
    });
  }

  submitOrder(req, res) {
    const body = req.body;
    const user = req.session.user.userData;

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    const sendTxId = '';
    if (!sendTxId) {
      return res.status(500).send("Create transaction error")
    }

    let sql = `UPDATE Order SET sendDate='${currentDate}',sendTxId='${sendTxId}',status='Sending' WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data updated successfully' });
      }
    });

  }

  rejectOrder(req, res) {
    const body = req.body;
    const user = req.session.user;

    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    const approvTxId = '';
    if (!approvTxId) {

    }

    let sql = `UPDATE Order SET approvDate='${currentDate}',approvTxId='${approvTxId}',status='Reject' WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data updated successfully' });
      }
    });
  }

  submitCreditPayment(req, res) {
    const body = req.body;
    const user = req.session.user

    let creditHis;
    sql = `SELECT * FROM Credit_History WHERE creditHisId = ${body.creditHisId}`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      creditHis = results[0];
    });


    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    // const newAmount = credit.creditAmount+body.totalPayment
    // if(newAmount > credit.creditTotal){
    //   return res.status(409).send("Invalid payment number")
    // }

    const creditTxId = '';

    if (!creditTxId) {

    }

    sql = `UPDATE Credit_History SET ,approvDate='${currentDate}',status='Aeccept',txId='${creditTxId}' WHERE creditHisId = ${body.creditHisId}`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        sql = `UPDATE Credit SET creditAmount='${creditHis.creditAmount}',dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
        dbConnection.query(sql, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(200).json({ message: 'Data updated successfully' });
          }
        });
      }
    });

  }
}

module.exports = (new SupplierController()).router;
