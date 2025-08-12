require('dotenv').config();
module.exports = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  redisUrl: process.env.REDIS_URL,
  esUrl: process.env.ELASTICSEARCH_URL
};
