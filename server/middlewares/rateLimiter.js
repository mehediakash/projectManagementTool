const rateLimit = require('express-rate-limit');

module.exports = rateLimit({
  windowMs: 60 * 1000, // 1 minute
  max: 120, // limit requests per window
  message: 'Too many requests from this IP, please try again later.'
});
