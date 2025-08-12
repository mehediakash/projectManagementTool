const jwt = require('jsonwebtoken');
const config = require('../../config');
const User = require('../users/user.model');

async function jwtMiddleware(req, res, next) {
  const auth = req.headers.authorization;
  if (!auth) return res.status(401).json({ message: 'Unauthorized' });
  const token = auth.split(' ')[1];
  try {
    const payload = jwt.verify(token, config.jwtSecret);
    const user = await User.findById(payload.sub).select('-password');
    if (!user) return res.status(401).json({ message: 'Unauthorized' });
    req.user = user;
    next();
  } catch (err) {
    return res.status(401).json({ message: 'Unauthorized', detail: err.message });
  }
}

module.exports = jwtMiddleware;
