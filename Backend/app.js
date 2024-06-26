const express = require('express');
const session = require('express-session');
const cors = require('cors');
const bodyParser = require('body-parser');
const sequelize = require('./database/connection');
const swaggerUi = require('swagger-ui-express');
const swaggerJsdoc = require('swagger-jsdoc');
const contract = require('./src/contract/trade.contract');
const http = require('http');

const socketServer = require('./src/module/socket')

let env = (require('dotenv').config()).parsed;
const PORT = env.PORT || 3000;

class App {
  constructor() {
    this.app = express();
    this.server = http.createServer(this.app);
    this.setupMiddleware();
    this.start();
    this.setupRoutes();

    socketServer.setServer(this.server);
  }

  setupMiddleware() {
    this.app.use(cors({
      origin: [
        /^http:\/\/localhost($|:\d+$)/,
        /^http:\/\/192\.168\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)($|:\d+$)/,
      ],
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization'],
      credentials: true
    }));

    const options = {
      definition: {
        openapi: '3.0.0',
        info: {
          title: 'Express Swagger API',
          version: '1.0.0',
          description: 'A simple Express API with Swagger documentation',
        },
      },
      apis: ['app.js'], // Path to the API files
    };

    const specs = swaggerJsdoc(options);
    this.app.use('/api', swaggerUi.serve, swaggerUi.setup(specs));

    this.app.use(bodyParser.json({ limit: '10mb' }));
    this.app.use(session({
      secret: 'mysecret',
      resave: false,
      saveUninitialized: false,
      cookie: { secure: false }
    }));

    this.app.use((req, res, next) => {
      console.log(`${req.method} ${req.url} status ${res.statusCode} `);
      next();
    });
  }

  setupRoutes() {
    const [swaggerHandler, swaggerUI] = require('./src/swagger/main');
    this.app.use("/api-docs", swaggerHandler, swaggerUI);
    this.app.use('/auth', require('./src/controller/Auth.controller'));
    this.app.use('/customer', require('./src/controller/Customer.controller'));
    this.app.use('/supplier', require('./src/controller/Suppiler.controller'));
    this.app.use('/product', require('./src/controller/Product.controller'));
    this.app.use('/cart', require('./src/controller/Cart.controller'));
    this.app.use('/cart-product', require('./src/controller/CartPorduct.controller'));

    this.app.get('/event-log', (req, res) => {
      try {
        return contract.getEventLogs().then(e => res.json(e));
      }
      catch (e) {
        console.error(e)
      }
    });
  }

  start() {
    this.server.listen(PORT, async () => {
      await sequelize.authenticate();
      console.log(`Server is running on http://localhost:${PORT}`);
    });
  }
}

module.exports = (new App());
