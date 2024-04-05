const { Server } = require("socket.io");

class SocketServer {
  setServer(server){
    this.io = new Server(server, {
      cors: {
        origin: [
          /^http:\/\/localhost($|:\d+$)/,
          /^http:\/\/192\.168\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)\.(25[0-5]|2[0-4][0-9]|[01]?[0-9][0-9]?)($|:\d+$)/,
        ],
        methods: ['GET', 'POST', 'PUT', 'DELETE'],
        allowedHeaders: ['Content-Type', 'Authorization'],
        credentials: true
      }
    });
  }
  constructor() {
    this.io = {}
  }
}

module.exports = new SocketServer()