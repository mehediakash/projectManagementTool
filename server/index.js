const http = require('http');
const app = require('./app');
const config = require('./config');
const { initSocket } = require('./modules/notifications/socket');

const server = http.createServer(app);
const io = initSocket(server);

server.listen(config.port, () => {
  console.log(`Server listening on ${config.port}`);
});
