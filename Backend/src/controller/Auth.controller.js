const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const mysql = require('mysql');
let env = (require('dotenv').config()).parsed

class Auth {
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
        this.router.post('/login', this.login);
        this.router.get('/get-session', this.getSession);
    }

    login = async (req, res) => {
        const { email, password } = req.body;
        let userData = {};
    
        try {
            if (!email || !password) {
                return res.status(400).json({ error: 'Email and password are required.' });
            }
    
            const [customerResults, supplierResults] = await Promise.all([
                new Promise((resolve, reject) => {
                    this.dbConnection.query('SELECT * FROM customers WHERE email = ?', [email], (error, results) => {
                        if (error) {
                            console.error('Error fetching user from customers:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                }),
                new Promise((resolve, reject) => {
                    this.dbConnection.query('SELECT * FROM supplier WHERE email = ?', [email], (error, results) => {
                        if (error) {
                            console.error('Error fetching user from suppliers:', error);
                            reject(error);
                        } else {
                            resolve(results);
                        }
                    });
                })
            ]);
    
            const customer = customerResults[0];
            const supplier = supplierResults[0];
    
            if (!customer && !supplier) {
                return res.status(401).json({ error: 'User not found.' });
            }
    
            const user = customer || supplier;
            const passwordMatch = await bcrypt.compare(password, user.password);
    
            if (!passwordMatch) {
                return res.status(401).json({ error: 'Invalid credentials.' });
            }
    
            userData = {
                isSupplier: !!supplier,
                isCustomer: !!customer,
                userData: {
                    name: user.fullname,
                    phone: user.phone,
                    email: user.email,
                    address: user.address,
                }
            };
    
            return res.status(200).json(userData);
        } catch (error) {
            console.error('Login error:', error);
            return res.status(500).json({ error: 'Internal server error.' });
        }
    };
    

    getSession = (req, res) => {
        if (!req.session.user) {
            return res.status(401).send("Unauthorized")
        }
        return res.status(200).send(req.session.user)
    }


}

module.exports = (new Auth()).router;
