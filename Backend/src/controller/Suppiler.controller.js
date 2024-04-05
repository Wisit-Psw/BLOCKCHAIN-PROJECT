const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mysql = require('mysql');
const dbConnection = require('../module/dbConection')
const rolesGuard = require('../guard/roles.guards');
const stringToByte = require('../util/byte');
const hashSha256 = require('../util/hash');
const contract = require('../contract/trade.contract');
const cacheOrder = require('../module/cache');

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

class SupplierController {
  constructor() {
    this.router = router;
    this.setupRoutes();
  }

  setupRoutes() {
    this.router.post('/register', this.register);
    this.router.get('/credit-req', rolesGuard.isSupplier, this.getCreditReq);
    this.router.get('/order', rolesGuard.isSupplier, this.getOrder);
    this.router.get('/order-info/:id', rolesGuard.isCustomer, this.getOrderInfo);
    // this.router.get('/order-info', rolesGuard.isSupplier, this.getOrderInfo);
    this.router.get('/credit', rolesGuard.isSupplier, this.getCredit);
    this.router.get('/credit-info/:id', rolesGuard.isSupplier, this.getCreditInfo);
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

    dbConnection.query(sql, async (error, results) => {
      if (error) {
        let statusCode = 500;
        if (error.code === 'ER_DUP_ENTRY') {
          statusCode = 409;
        }
        return res.status(statusCode).json({ error: error.message });
      } else {
        contract.writeContract("registerSeller", stringToByte(await hashSha256(email, 16)));
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  }

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
      customers.fullname as cusName,
      payment_slip.slipImage as slipImage
      FROM credit_history 
      INNER JOIN credit ON credit_history.creditId = credit.creditId 
      INNER JOIN customers ON credit.cusEmail = customers.email  
      LEFT JOIN payment_slip ON credit_history.creditHisId = payment_slip.creditHisId  
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
      customers.fullname as cusName
      FROM credit INNER JOIN customers ON credit.cusEmail = customers.email 
      WHERE credit.supEmail LIKE '${user.userData.email}'`;
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

  getCreditInfo = (req, res) => {
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
      customers.fullname as cusName
      FROM credit INNER JOIN customers ON credit.cusEmail = customers.email 
      WHERE credit.supEmail LIKE '${user.userData.email}'
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

  creditApproval(req, res) {
    try {
      const body = req.body;
      const user = req.session.user;

      const currentDate = formatDate();

      let credit;
      let sql = `SELECT * FROM credit WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;

      dbConnection.query(sql, async (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        if (results.length === 0) {
          return res.status(409).send("Invalid creditId.");
        }
        credit = results[0];

        if (body.status === 'Reject') {
          const txId = (await contract.writeContract(
            "lendCreditProceed",
            false,
            stringToByte(await hashSha256(user.userData.email, 16), 16), 
            stringToByte(await hashSha256(body.cusEmail, 16), 16), 
            body.creditAmount)).transactionHash;

          sql = `UPDATE Credit_History SET txId='${txId}', approvDate='${currentDate}', status='Reject', creditAmount='${credit.creditAmount}' WHERE creditHisId = ${body.creditHisId}`;
          dbConnection.query(sql, (error, results) => {
            if (error) {
              return res.status(500).json({ error: error.message });
            }
            return res.status(200).json({ message: 'Data updated successfully' });
          });
        } else {
          const txId = (await contract.writeContract(
            "lendCreditProceed",
            true,
            stringToByte(await hashSha256(user.userData.email, 16), 16), 
            stringToByte(await hashSha256(body.cusEmail, 16), 16), 
            body.creditAmount)).transactionHash;

          const newTotal = credit.creditTotal + body.creditAmount;
          const newAmount = credit.creditAmount + body.creditAmount;

          sql = `UPDATE Credit_History SET txId='${txId}', creditTotal='${newTotal}', creditUpdate='${body.creditAmount}', creditAmount='${newAmount}', approvDate='${currentDate}', status='Accept' WHERE creditHisId = ${body.creditHisId}`;
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
      const currentDate = formatDate();

      let credit;
      let sql = `SELECT * FROM credit WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;

      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: error.message });
        }
        credit = results[0];

        if (body.newCreditTotal < credit.creditTotal - credit.creditAmount) {
          return res.status(409).send("Invalid credit.");
        }

        // const newTotal = credit.creditTotal + body.creditAmount;
        const newAmount = credit.creditAmount + (body.newCreditTotal - credit.creditTotal);
        const txId = '';

        sql = `INSERT INTO Credit_History(creditId, creditTotal, creditUpdate, creditAmount, approvDate, updateType, status, txId) VALUES ('${body.creditId}', '${body.newCreditTotal}', '${Math.abs(body.newCreditTotal - credit.creditTotal)}', '${newAmount}', '${currentDate}', '${body.newCreditTotal - credit.creditTotal > 0 ? "Add" : "Decrease"}', 'Accept', '${txId}')`;

        dbConnection.query(sql, (error, results) => {
          if (error) {
            return res.status(500).json({ error: error.message });
          } else {
            sql = `UPDATE Credit SET creditTotal='${body.newCreditTotal}', creditAmount='${newAmount}', dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;

            dbConnection.query(sql, (error, results) => {
              if (error) {
                return res.status(500).json({ error: error.message });
              } else {
                return res.status(200).json({ message: 'Data updated successfully' });
              }
            });
          }
        });
      });
    } catch (e) {
      return res.status(500).json(e);
    }
  }


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
    customers.fullname as cusName 
    FROM \`order\` INNER JOIN customers ON order.cusEmail = customers.email WHERE supEmail LIKE '${user.userData.email}'`;
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
    customers.fullname as cusName 
    FROM \`order\` INNER JOIN supplier ON order.supEmail = supplier.email 
    WHERE orderId = ${orderId} AND supEmail LIKE '${user.userData.email}'`;

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

  submitOrder = async (req, res) => {
    try {
      const body = req.body;
      const user = req.session.user;

      const currentDate = formatDate();

      console.log(body)
      let sendTxId;
      try{
        sendTxId = (await contract.writeContract(
          "orderProceed", 
          stringToByte(await hashSha256(user.userData.email, 16), 16), 
          stringToByte(await hashSha256(body.cusEmail, 16), 16), 
          cacheOrder[body.orderId],
          1)).transactionHash;
  
      }catch(e){
        console.error(e)
        return res.status(500).send(e.message)
      }
      
        console.log(sendTxId)

      //remove comment while connect contract
      // if (!sendTxId) {
      //   return res.status(500).send("Transaction ID is missing");
      // }
      const sql = `UPDATE \`order\` SET 
      sendDate = '${currentDate}', 
      sendTxId = '${sendTxId}', 
      status = 'Sending' 
      WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
      console.log(sql)

      dbConnection.query(sql, (error, results) => {
        if (error) {
          return res.status(500).json({ error: "Failed to update order status" });
        } else {
          return res.status(200).send(results);
        }
      });

    } catch (e) {
      return res.status(500).json({ error: "Internal server error" });
    }
  }

  rejectOrder = async (req, res) => {
    try {
      const body = req.body;
      const user = req.session.user;

      const currentDate = formatDate();

      const approvTxId = (await contract.writeContract(
        "orderProceed", 
        stringToByte(await hashSha256(user.userData.email, 16), 16), 
        stringToByte(await hashSha256(body.cusEmail, 16), 16), 
        cacheOrder[body.orderId],
        3)).transactionHash;


      let sql = `SELECT * FROM \`order\` WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
      const order = await new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results[0]);
          }
        });
      });

      sql = `SELECT * FROM order_product WHERE orderId = ${body.orderId}`;
      const orderProd = await new Promise((resolve, reject) => {
        dbConnection.query(sql, (error, results) => {
          if (error) {
            reject(error)
          } else {
            resolve(results);
          }
        });
      });

      orderProd.forEach(async (product, index) => {
        sql = `SELECT productQuantity FROM product WHERE productId = ${product.productId};`;

        const prod = await new Promise((resolve, reject) => {
          dbConnection.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve(result[0]);
          });
        });

        sql = `UPDATE product SET productQuantity=${prod.productQuantity + product.quantity} WHERE productId = ${product.productId};`;

        await new Promise((resolve, reject) => {
          dbConnection.query(sql, (err, result) => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      });


      sql = `SELECT creditId,creditAmount FROM credit WHERE cusEmail LIKE '${order.cusEmail}' AND supEmail LIKE '${user.userData.email}'`;

      const credit = await new Promise((resolve, reject) => {
        dbConnection.query(sql, (err, result) => {
          if (err) {
            reject(err);
          }
          resolve(result[0]);
        });
      });

      sql = `UPDATE credit SET creditAmount='${credit?.creditAmount + order.totalPrice}' WHERE creditId = ${credit.creditId} AND supEmail LIKE '${user.userData.email}'`;

      await new Promise((resolve, reject) => {
        dbConnection.query(sql, (err, result) => {
          if (err) {
            console.error(err);
            reject(err);
          }
          resolve();
        });
      });

      sql = `UPDATE \`order\` SET approvDate='${currentDate}',approvTxId='${approvTxId}',status='Reject' WHERE orderId = ${body.orderId} AND supEmail LIKE '${user.userData.email}'`;
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
        const user = req.session.user;
        const currentDate = formatDate();
        let credit;
        let sql;

        sql = `SELECT * FROM Credit WHERE creditId = ${body.creditId}`;
        dbConnection.query(sql, async (error, results) => {
            if (error) {
                return res.status(500).json({ error: error.message });
            }
            credit = results[0];

            if (body.status === 'Reject') {
                sql = `UPDATE Credit_History SET approvDate='${currentDate}', status='Reject' WHERE creditHisId = ${body.creditHisId}`;

                dbConnection.query(sql, (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    }
                    return res.status(200).json({ message: 'Data updated successfully' });
                });
            } else {
                const creditTxId = (await contract.writeContract(
                  "payLoanCredit",
                  stringToByte(await hashSha256(user.userData.email, 16), 16), 
                  stringToByte(await hashSha256(credit.cusEmail, 16), 16), 
                  body.creditAmount)).transactionHash;

                sql = `UPDATE Credit_History SET approvDate='${currentDate}', status='Accept', txId='${creditTxId}' WHERE creditHisId = ${body.creditHisId}`;

                dbConnection.query(sql, (error, results) => {
                    if (error) {
                        return res.status(500).json({ error: error.message });
                    } else {
                        sql = `UPDATE Credit SET creditAmount='${credit.creditAmount + body.creditAmount}', dateUpdate='${currentDate}' WHERE creditId = ${body.creditId} AND supEmail LIKE '${user.userData.email}'`;

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


}

module.exports = (new SupplierController()).router;
