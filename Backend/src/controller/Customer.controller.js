const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards');

const executeQuery = (sql) => {
  return new Promise((resolve, reject) => {
    dbConnection.query(sql, (error, result) => {
      if (error) {
        reject(error);
      } else {
        resolve(result);
      }
    });
  });
};

const formatDate = () => {
  const date = new Date();
  // date.setMinutes(date.getMinutes() + (7 * 60));
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}

class UserController {

  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/register', this.register);
    this.router.get('/get-shop', rolesGuard.isCustomer, this.getShop)
    this.router.get('/order', rolesGuard.isCustomer, this.getOrder);
    this.router.get('/order-info/:id', rolesGuard.isCustomer, this.getOrderInfo);
    this.router.get('/wallet', rolesGuard.isCustomer, this.getCredit);
    this.router.get('/wallet-info/:id', rolesGuard.isCustomer, this.getWallerInfo);
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

  getCredit = (req, res) => {
    const user = req.session.user;
    try {
      const query = `SELECT 
      credit.creditId, 
      credit.supEmail, 
      credit.cusEmail, 
      credit.creditTotal, 
      credit.creditAmount, 
      credit.dateUpdate,
      supplier.shopName as shopName
      FROM credit INNER JOIN supplier ON credit.supEmail = supplier.email
      WHERE credit.cusEmail LIKE '${user.userData.email}'`;
      dbConnection.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        return res.status(200).send(result);
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  };

  getWallerInfo = (req, res) => {
    const user = req.session.user;
    const creditId = req.params.id;
    try {
      const query = `SELECT 
      credit.creditId, 
      credit.supEmail, 
      credit.cusEmail, 
      credit.creditTotal, 
      credit.creditAmount, 
      credit.dateUpdate,
      supplier.shopName as shopName
      FROM credit INNER JOIN supplier ON credit.supEmail = supplier.email 
      WHERE credit.cusEmail LIKE '${user.userData.email}'
      AND credit.creditId = ${creditId}`;

      dbConnection.query(query, (err, result) => {
        if (err) {
          return res.status(500).send(err);
        }
        const query2 = `SELECT * FROM credit_history WHERE creditId = ${creditId}`;
        dbConnection.query(query2, (err, result2) => {
          if (err) {
            return res.status(500).send(err);
          }
          return res.status(200).send({
            ...result[0],
            history: result2
          });
        });
      });
    } catch (e) {
      return res.status(500).send(e);
    }
  };

  getOrder = async (req, res) => {
    const user = req.session.user;

    let sql = `SELECT 
    \`order\`.orderId, 
    \`order\`.cusEmail, 
    \`order\`.supEmail, 
    \`order\`.totalPrice, 
    \`order\`.createDate, 
    \`order\`.createTxId, 
    \`order\`.sendDate, 
    \`order\`.sendTxId, 
    \`order\`.approvDate, 
    \`order\`.approvTxId, 
    \`order\`.status,
    supplier.shopName as shopName 
    FROM \`order\` INNER JOIN supplier ON order.supEmail = supplier.email WHERE cusEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, async (error, results) => {
      if (error) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
      const ret = [];

      for (const data of results) {
        try {
          const tmp = { ...data }
          const query2 = `SELECT * FROM order_product INNER JOIN product on order_product.productId = product.productId WHERE orderId = ${data.orderId}`;
          const result2 = await executeQuery(query2);

          tmp['productList'] = result2;
          ret.push(tmp);
        } catch (error) {
          console.error(error);
          return res.status(500).send(error);
        }
      }
      return res.status(200).send(ret);
    });
  }

  getOrderInfo = async (req, res) => {
    const orderId = req.params.id
    const user = req.session.user;

    let sql = `SELECT 
    \`order\`.orderId, 
    \`order\`.cusEmail, 
    \`order\`.supEmail, 
    \`order\`.totalPrice, 
    \`order\`.createDate, 
    \`order\`.createTxId, 
    \`order\`.sendDate, 
    \`order\`.sendTxId, 
    \`order\`.approvDate, 
    \`order\`.approvTxId, 
    \`order\`.status,
    supplier.shopName as shopName 
    FROM \`order\` INNER JOIN supplier ON order.supEmail = supplier.email 
    WHERE orderId = ${orderId} AND cusEmail LIKE '${user.userData.email}'`;
    dbConnection.query(sql, async (error, results) => {
      if (error || !results[0]) {
        console.error(error);
        return res.status(500).json({ error: error.message });
      }
      const ret = { ...results[0] };

      try {
        const query2 = `SELECT * FROM order_product INNER JOIN product on order_product.productId = product.productId WHERE orderId = ${ret.orderId}`;
        const result2 = await executeQuery(query2);

        ret['productList'] = result2;
      } catch (error) {
        console.error(error);
        return res.status(500).send(error);
      }
      return res.status(200).send(ret);
    });
  }

  requestsCredit(req, res) {
    const user = req.session.user;
    const body = req.body;
    const currentDate = formatDate();

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

    const insertCreditHistory = (credit) => {
      const creditUpdate = credit.creditAmount + body.creditAmount;
      sql = `INSERT INTO Credit_History(creditId, creditTotal, creditUpdate, creditAmount, updateType) VALUES (${credit.creditId}, ${credit.creditTotal}, ${body.creditAmount}, ${creditUpdate}, 'Add')`;
      dbConnection.query(sql, (historyError, historyResult) => {
        if (historyError) {
          return res.status(500).send(historyError);
        }
        return res.status(200).send(historyResult);
      });
    }
  }

  createOrder = async (req, res) => {
    try {
      const body = req.body;
      const user = req.session.user;
      const createTxId = '';

      let sql = `SELECT creditId,creditAmount FROM credit WHERE supEmail LIKE '${body.supEmail}' AND cusEmail LIKE '${user.userData.email}'`;

      const credit = await new Promise((resolve, reject) => {
        dbConnection.query(sql, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result[0]);
        });
      });

      if (!credit || credit.creditAmount < body.totalPrice) {
        return res.status(409).send("Credit is not enough");
      }

      sql = `UPDATE credit SET creditAmount='${credit.creditAmount - body.totalPrice}' WHERE creditId = ${credit.creditId} AND cusEmail LIKE '${user.userData.email}'`;

      await new Promise((resolve, reject) => {
        dbConnection.query(sql, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        });
      });

      let orderId;
      sql = 'INSERT INTO `order` (cusEmail, supEmail, totalPrice, createTxId) VALUES (?, ?, ?, ?)';
      let inserts = [user.userData.email, body.supEmail, body.totalPrice, createTxId];

      // Insert order into the database
      await new Promise((resolve, reject) => {
        dbConnection.query(sql, inserts, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          orderId = result.insertId;
          resolve();
        });
      });

      if (orderId) {
        // Insert order products into the database
        let sqlProducts = 'INSERT INTO Order_Product (orderId, productId, quantity) VALUES ';
        body.productList.forEach((product, index) => {
          sqlProducts += `(${orderId}, ${product.productId}, ${product.quantity})`;
          if (index + 1 < body.productList.length) {
            sqlProducts += ', ';
          }
        });

        await new Promise((resolve, reject) => {
          dbConnection.query(sqlProducts, (err, result) => {
            if (err) {
              console.error(err);
              reject(err);
            }
            resolve();
          });
        });

        try {
          const cartId = req.body.cartId

          let sql = `DELETE FROM cart_product WHERE cartId = ${cartId}`;

          dbConnection.query(sql, (error, results) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
          });

          sql = `DELETE FROM cart  WHERE cartId = ${cartId}`;

          await new Promise((resolve, reject) => {
            dbConnection.query(sql, (err, result) => {
              if (err) {
                reject(err);
              }
              resolve();
            });
          });
        } catch (e) {
          return res.status(500).json(e);
        }

        body.productList.forEach(async (product, index) => {
          sql = `SELECT productQuantity FROM product WHERE productId = ${product.productId};`;

          const prod = await new Promise((resolve, reject) => {
            dbConnection.query(sql, (err, result) => {
              if (err) {
                reject(err);
              }
              resolve(result[0]);
            });
          });

          sql = `UPDATE product SET productQuantity=${prod.productQuantity - product.quantity} WHERE productId = ${product.productId};`;

          await new Promise((resolve, reject) => {
            dbConnection.query(sql, (err, result) => {
              if (err) {
                reject(err);
              }
              resolve();
            });
          });
        });

        return res.status(200).send("Data inserted successfully.");
      }
    } catch (e) {
      console.error(e);
      return res.status(500).send(e);
    }
  }

  receiveOrder(req, res) {
    const body = req.body;
    const user = req.session.user;

    let credit;
    let sql = `SELECT * FROM credit WHERE cusEmail = '${user.userData.email}' AND supEmail LIKE '${body.supEmail}'`;

    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }
      credit = results[0];

      const creditTxId = '';

      // if (!creditTxId) {
      // return res.status(500).json({ error: error.message });
      // }

      const currentDate = formatDate();

      sql = `INSERT INTO Credit_History(creditId, creditTotal, creditUpdate, creditAmount, approvDate, updateType, status, txId) VALUES ('${credit.creditId}', '${credit.creditTotal}', '${body.totalPrice}', '${credit.creditAmount}', '${currentDate}', 'Used', 'Accept', '${creditTxId}')`;

      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        } else {
          sql = `UPDATE credit SET dateUpdate='${currentDate}' WHERE creditId = ${credit.creditId} AND cusEmail LIKE '${user.userData.email}'`;
          dbConnection.query(sql, (error, results) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            } else {
              const approvTxId = '';
              // if (!approvTxId) {
              //   return res.status(500).send("Create transaction error");
              // }

              sql = `UPDATE \`Order\` SET approvDate='${currentDate}', approvTxId='${approvTxId}', status='Success' WHERE orderId = ${body.orderId} AND cusEmail LIKE '${user.userData.email}'`;
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
    });
  }


  creditPayment(req, res) {
    const body = req.body;
    const user = req.session.user;

    let sql = `SELECT * FROM credit WHERE cusEmail LIKE '${user.userData.email}' AND supEmail LIKE '${body.supEmail}'`;

    dbConnection.query(sql, (error, results) => {
      if (error) {
        return res.status(500).json({ error: error.message });
      }

      if (results.length === 0) {
        return res.status(404).json({ error: "Credit data not found" });
      }

      const credit = results[0];

      const currentDate = formatDate();

      if (credit.creditAmount + body.totalPayment > credit.creditTotal) {
        return res.status(409).send("Invalid payment number");
      }

      const newAmount = credit.creditAmount + body.totalPayment;
      sql = `INSERT INTO Credit_History(creditId, creditTotal,creditUpdate,creditAmount,updateType,status,txId) VALUES ('${credit.creditId}','${credit.creditTotal}','${body.totalPayment}','${newAmount}','Payment','Waiting', '')`;

      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }

        const creditHisId = results.insertId;
        sql = `INSERT INTO Payment_Slip(creditHisId, slipImage) VALUES ('${creditHisId}','${body.slipImage}')`;

        dbConnection.query(sql, (error, results2) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          }

          return res.status(200).json({ message: 'Data updated successfully' });
        });
      });
    });
  }

}

module.exports = (new UserController()).router;
