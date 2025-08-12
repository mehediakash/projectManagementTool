let io;
const NotificationService = require('./notification.service');

function initSocket(server) {
  const socketIo = require('socket.io')(server, {
    cors: { origin: '*' }
  });
  io = socketIo;

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) socket.join(`user:${userId}`);
    socket.on('disconnect', () => {});
  });


  NotificationService.setSocket(io);

  return server;
}

module.exports = { initSocket, getIo: () => io };
