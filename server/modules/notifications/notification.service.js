const Notification = require('./notification.model');
let io = null;

function setSocket(_io) { io = _io; }

async function push(userId, payload) {
  const notif = await Notification.create({ user: userId, payload, type: payload.type });
 
  if (io) io.to(`user:${userId}`).emit('notification', notif);
}

module.exports = { push, setSocket };
