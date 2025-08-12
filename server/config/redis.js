const { createClient } = require('redis');
const config = require('./index');
const client = createClient({ url: config.redisUrl });

// client.on('error', (err) => console.error('Redis Client Error', err));
// client.connect().then(() => console.log('Redis connected'));

module.exports = client;
