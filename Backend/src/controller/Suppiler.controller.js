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
    this.router.get('/credit-req', rolesGuard.isSupplier, this.getCreditReq);
    this.router.post('/credit-approval', rolesGuard.isSupplier, this.creditApproval);
    this.router.post('/update-credit', rolesGuard.isSupplier, this.updateCredit);
    this.router.post('/submit-order', rolesGuard.isSupplier, this.submitOrder);
    this.router.post('/reject-order', rolesGuard.isSupplier, this.rejectOrder);
    this.router.post('/submit-credit-payment', rolesGuard.isSupplier, this.submitCreditPayment);
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

  getCreditReq = async (req, res) => {
    try {
      const user = req.session.user;

      let sql = `SELECT 
      credit_history.creditHisId, 
      credit_history.creditId, 
      credit_history.creditTotal, 
      credit_history.creditUpdate, 
      credit_history.creditAmount, 
      credit_history.requestsDate, 
      credit_history.approvDate, 
      credit_history.updateType, 
      credit_history.status, 
      credit_history.txId,
      customers.email as cusEmail,
      customers.fullname as cusName 
      FROM credit_history 
      INNER JOIN credit ON credit_history.creditId = credit.creditId 
      INNER JOIN customers ON credit.cusEmail = customers.email  
      WHERE supEmail LIKE '${user.userData.email}' AND status LIKE 'Waiting'`;
      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        return res.status(200).send(results);
      });
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  creditApproval(req, res) {
    try {
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
        if (results.length === 0) {
          return res.status(409).send("Invalid creditId.");
        }
        credit = results[0];
  
        if (body.status === 'Reject') {
          sql = `UPDATE Credit_History SET approvDate='${currentDate}', status='Reject', creditAmount='${credit.creditAmount}' WHERE creditHisId = ${body.creditHisId}`;
          dbConnection.query(sql, (error, results) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ message: 'Data updated successfully' });
          });
        } else {
          const newTotal = credit.creditTotal + body.creditAmount;
          const newAmount = credit.creditAmount + body.creditAmount;
  
          sql = `UPDATE Credit_History SET creditTotal='${newTotal}', creditUpdate='${body.creditAmount}', creditAmount='${newAmount}', approvDate='${currentDate}', status='Accept' WHERE creditHisId = ${body.creditHisId}`;
          dbConnection.query(sql, (error, results) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            } else {
              sql = `UPDATE Credit SET creditTotal='${newTotal}', creditAmount='${newAmount}', dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;
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
      });
    } catch (e) {
      return res.status(500).json(e);
    }
  }
  

  updateCredit(req, res) {
    try {
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

      // sql = `UPDATE Credit_History SET creditTotal='${body.newCreditTotal}',dateAccept='${currentDate}',creditUpdateAmount='',dateUpdate='${currentDate}', status='Accept' WHERE creditHisId = ${body.creditHisId} AND supEmail LIKE '${user.userData.email}'`;
      let sql = `INSERT INTO Credit_History(creditId,creditTotal, creditUpdate,creditAmount,approvDate,updateType,status,txId) VALUES ('${body.creditId}','${body.newCreditTotal}','${body.newCreditTotal - credit.creditTotal}','${currentDate}','${body.newCreditTotal - credit.creditTotal > 0 ? "Add" : "Decrease"},'Accept'. '${txId}')`;
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
    } catch (e) {
      return res.status(500).json(e);

    }
  }

  submitOrder(req, res) {
    try {
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
    } catch (e) {
      return res.status(500).json(e);

    }
  }

  rejectOrder(req, res) {
    try {
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
    } catch (e) {
      return res.status(500).json(e);
    }
  }

  submitCreditPayment(req, res) {
    try {
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

      sql = `UPDATE Credit_History SET ,approvDate='${currentDate}',status='Accept',txId='${creditTxId}' WHERE creditHisId = ${body.creditHisId}`;
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
    } catch (e) {
      return res.status(500).json(e);
    }
  }
}

module.exports = (new SupplierController()).router;
