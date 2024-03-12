const { Sequelize } = require('sequelize');
let env = (require('dotenv').config()).parsed

const sequelize = new Sequelize(env.DB_NAME, env.DB_USERNAME, env.DB_PASSWORD, {
  name: "blockchain_project",
  dialect: 'mariadb',
  host: env.DB_HOST,
  port: Number(env.DB_PORT),
  username: env.DB_USERNAME,
  password: env.DB_PASSWORD,
  database: env.DB_NAME,
  timezone: '+07:00',
});

module.exports = sequelize;