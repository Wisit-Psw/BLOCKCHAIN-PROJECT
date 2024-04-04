const swaggerJsdoc = require("swagger-jsdoc"),
  swaggerUi = require("swagger-ui-express");

module.exports = [ swaggerUi.serve, swaggerUi.setup(require('./apis.json')) ]