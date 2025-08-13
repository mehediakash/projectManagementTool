let io;
const NotificationService = require('./notification.service');

const onlineUsers = new Map(); // userId -> socketId

function initSocket(server) {
  const socketIo = require('socket.io')(server, {
    cors: { origin: '*' }
  });
  io = socketIo;

  io.on('connection', (socket) => {
    const userId = socket.handshake.query.userId;
    if (userId) {
      onlineUsers.set(userId, socket.id);
      socket.join(`user:${userId}`);

      // Notify all clients in the same project about presence update
      io.emit('presence:update', Array.from(onlineUsers.keys()));
    }

    socket.on('disconnect', () => {
      if (userId) {
        onlineUsers.delete(userId);
        io.emit('presence:update', Array.from(onlineUsers.keys()));
      }
    });
  });

  NotificationService.setSocket(io);

  return server;
}

function getOnlineUsers() {
  return Array.from(onlineUsers.keys());
}

module.exports = { initSocket, getIo: () => io, getOnlineUsers };
