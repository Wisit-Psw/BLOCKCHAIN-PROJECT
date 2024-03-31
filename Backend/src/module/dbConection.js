let env = (require('dotenv').config()).parsed
const mysql = require('mysql');

const dbConnection = mysql.createConnection({
  host: env.DB_HOST,
  user: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0
});

module.exports = dbConnection;