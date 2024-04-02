const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards')

class UserController {

  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/register', this.register);
    this.router.get('/get-shop', rolesGuard.isCustomer, this.getShop)
    this.router.post('/requests-credit', rolesGuard.isCustomer, this.requestsCredit)
    this.router.post('/create-order', rolesGuard.isCustomer, this.createOrder)
    this.router.put('/receive-order', rolesGuard.isCustomer, this.receiveOrder)
    this.router.post('/credit-payment', rolesGuard.isCustomer, this.creditPayment)
  }

  register = async (req, res) => {
    try {
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

      dbConnection.query('SELECT * FROM supplier WHERE email = ' + `'${email}'`, async (error, results) => {
        if (error) {
          return res.status(500).json({ error: 'Error fetching user from database.' });
        }

        const user = results[0];
        if (user) {
          return res.status(409).json({ error: 'Email already exist.' });
        }
      });

      const hashPass = await bcrypt.hash(password, 10)
      const sql = `INSERT INTO customers (email, fullname, phone, address, password) VALUES ('${email}','${name}','${phone}','${address}','${hashPass}')`;

      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        } else {
          return res.status(200).json({ message: 'Data inserted successfully' });
        }
      });
    } catch (e) {
      return res.status(500).json({ error: e });
    }
  };

  getShop = (req, res) => {
    const user = req.session.user;
    try {
      const query = "SELECT email, shopName FROM supplier";
      dbConnection.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        const ret = [];
        const promises = [];
        result.forEach((shop) => {
          const sql = `SELECT * FROM credit WHERE cusEmail LIKE '${user.userData.email}' AND supEmail LIKE '${shop.email}'`;
          promises.push(new Promise((resolve, reject) => {
            dbConnection.query(sql, (err, result2) => {
              if (err) {
                reject(err);
              } else {
                resolve({
                  email: shop.email,
                  shopName: shop.shopName,
                  creditAmount: result2[0] ? result2[0].creditAmount : 0, // Check if result2 exists
                });
              }
            });
          }));
        });

        Promise.all(promises)
          .then((shopData) => {
            return res.status(200).send(shopData);
          })
          .catch((error) => {
            return res.status(500).send(error);
          });
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  };


  requestsCredit(req, res) {
    const user = req.session.user;
    const body = req.body;
    const currentDate = new Date().toISOString().slice(0, 19).replace('T', ' ');

    let sql = `SELECT email FROM supplier WHERE email LIKE '${body.supEmail}'`;

    dbConnection.query(sql, (err, result) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (result.length === 0) {
        return res.status(400).json({ error: "Unknown supplier" });
      }

      const supplier = result[0].email;

      sql = `SELECT * FROM credit WHERE supEmail LIKE '${body.supEmail}' AND cusEmail LIKE '${user.userData.email}'`;
      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        let credit;
        if (results.length > 0) {
          credit = results[0];
          insertCreditHistory(credit);
        } else {
          // Insert new credit record if not exists
          sql = `INSERT INTO Credit(cusEmail, supEmail, dateUpdate) VALUES ('${user.userData.email}', '${body.supEmail}', '${currentDate}')`;
          dbConnection.query(sql, (insertError, insertResults) => {
            if (insertError) {
              return res.status(500).json({ error: insertError.message });
            }
            credit = {
              creditId: insertResults.insertId,
              supEmail: body.supEmail,
              cusEmail: user.userData.email,
              creditTotal: 0,
              creditAmount: 0,
              dateUpdate: currentDate
            };
            insertCreditHistory(credit);
          });
        }
      });
    });

    const  insertCreditHistory = (credit) => {
      const creditUpdate = credit.creditAmount + body.creditAmount;
      sql = `INSERT INTO Credit_History(creditId, creditTotal, creditUpdate, creditAmount, updateType) VALUES (${credit.creditId}, ${credit.creditTotal}, ${creditUpdate}, ${body.creditAmount}, 'Add')`;
      dbConnection.query(sql, (historyError, historyResult) => {
        if (historyError) {
          return res.status(500).send(historyError);
        }
        return res.status(200).send(historyResult);
      });
    }
  }



  createOrder(req, res) {
    try {

      const body = req.body;
      const user = req.session.user;

      const createTxId = '';

      if (!createTxId) {

      }

      let orderId;
      let sql = `INSERT INTO Order( cusEmail,supEmail,totalPrice,createTxId) VALUES ('${user.userData.email}','${body.supEmail}','${body.totalAmount}','${createTxId}')`;
      dbConnection.query(sql, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        orderId = result.insertId;
      });

      if (orderId) {
        let sql = `INSERT INTO Order_Product( orderId,productId,quantity) VALUES `
        body.productList.forEach((product, index) => {
          sql += `('${orderId}','${product.productId}','${product.quantity}')`;
          if (index + 1 < body.productList.length) {
            sql += ', ';
          }
        });
        dbConnection.query(sql, (err, result) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send("Data inserted successful.");
        });
      }
    }
    catch (e) {
      return res.status(500).send(e);
    }
  }

  receiveOrder(req, res) {
    const body = req.body;
    const user = req.session.user;

    let credit;
    sql = `SELECT * FROM credit WHERE cusEmail = ${user.userData.email} AND supEmail LIKE '${body.supEmail}' AND creditId = ${body.creditId}`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      credit = results[0];
    });

    const creditTxId = '';

    if (!creditTxId) {

    }
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    const newTotal = credit.creditTotal - body.totalPrice;
    const newAmount = credit.creditAmount - body.totalPrice

    if (newAmount < 0) {
      return res.status(409).send("Credit is not enough")
    }

    sql = `INSERT INTO Credit_History(creditId, creditTotal,creditUpdate,creditAmount,approvDate,updateType,status,txId) VALUES ('${credit.creditId}','${newTotal}','${body.totalPrice}','${newAmount}','${currentDate}','Used','Accept','${creditTxId}')`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        sql = `UPDATE Credit SET creditAmount='${newAmount}',dateUpdate='${currentDate}' WHERE creditId = ${credit.creditId} AND supEmail LIKE '${user.userData.email}'`;
        dbConnection.query(sql, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          } else {
            return res.status(200).json({ message: 'Data updated successfully' });
          }
        });
      }
    });


    const approvTxId = '';
    if (!approvTxId) {
      return res.status(500).send("Create transaction error")
    }

    sql = `UPDATE Order SET approvDate='${currentDate}',approvTxId='${approvTxId}',status='Success' WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      } else {
        return res.status(200).json({ message: 'Data updated successfully' });
      }
    });
  }

  creditPayment(req, res) {
    const body = req.body;
    const user = req.session.user

    let credit;
    sql = `SELECT * FROM credit WHERE cusEmail = ${user.userData.email} AND supEmail LIKE '${body.supEmail}'`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      credit = results[0];
    });

    // const creditTxId = '';

    // if (!creditTxId) {

    // }
    const currentDate = new Date();
    currentDate.setMinutes(currentDate.getMinutes() + (7 * 60));

    // const newTotal = credit.creditTotal-body.totalPrice;
    if (credit.creditAmount + body.totalPayment > credit.creditTotal) {
      return res.status(409).send("Invalid payment number")
    }

    const newAmount = credit.creditAmount + body.totalPayment

    sql = `INSERT INTO Credit_History(creditId, creditTotal,creditUpdate,creditAmount,approvDate,updateType,status,txId) VALUES ('${credit.creditId}','${credit.creditTotal}','${body.totalPayment}','${newAmount}','${currentDate}','Payment','Waiting')`;
    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      return res.status(200).json({ message: 'Data updated successfully' });
    });
  }
}

module.exports = (new UserController()).router;
