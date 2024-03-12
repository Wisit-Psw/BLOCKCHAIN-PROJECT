const express = require('express');
const bcrypt = require('bcryptjs');
const router = express.Router();
const mysql = require('mysql');
let env = (require('dotenv').config()).parsed

class UserController {

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
    this.router.post('/register', this.register);
    // this.router.post('/login', this.login);
    this.router.get('/get-session', this.getSession);
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
      res.status(409).json({ error: 'Invalid address.' });
      return
    }

    if (password.trim() === '' || password.length < 8) {
      return res.status(409).json({ error: 'password is not safe.' });

    }

    if (password !== confirmPassword) {
      return res.status(409).json({ error: 'confirm Ppassword is wrong.' });
    }

    this.dbConnection.query('SELECT * FROM supplier WHERE email = ?', [email], async (error, results) => {
      if (error) {
        console.error('Error fetching user:', error);
        return res.status(500).json({ error: 'Error fetching user from database.' });
      }

      const user = results[0];
      if (user) {
        return res.status(409).json({ error: 'Email already exist.' });
      }
    });

    const hashPass = await bcrypt.hash(password, 10)
    const sql = `INSERT INTO customers (email, fullname, phone, address, password) VALUES ('${email}','${name}','${phone}','${address}','${hashPass}')`;

    this.dbConnection.query(sql, (error, results) => {
      if (error) {
        let statusCode = 500;
        if (error.code === 'ER_DUP_ENTRY') {
          statusCode = 409;
        }
        return res.status(statusCode).json({ error: error.message });
      } else {
        console.log('Data inserted successfully.');
        return res.status(200).json({ message: 'Data inserted successfully' });
      }
    });
  };

  getSession = (req, res) => {
    try {
      const username = req.session.username;
      console.log(username)
      if (!username) {
        res.status(403).send("Unauthorized")
        return
      }
      res.send('Session value: ' + username);
    } catch {
      res.status(403).send("Unauthorized")
    }
  }

  // getProduct = (req, res) => {
  //     try {
  //         const query = "SELECT * FROM 'product'";
  //         this.dbConnection.query(query, (err, result) => {
  //             if (err) {
  //                 res.status(500).send(err);
  //             }
  //             res.status(200).send(result);
  //         });
  //     } catch (e) {
  //         res.status(500).send(e);
  //     }
  // }
}

module.exports = (new UserController()).router;
