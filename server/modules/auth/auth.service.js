const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const config = require('../../config');
const User = require('../users/user.model');

async function signUp({ name, email, password, role = 'member',skills,availability }) {
  const hashed = await bcrypt.hash(password, 10);
  const user = await User.create({ name, email, password: hashed, role ,skills,availability});
  return user;
}

async function signIn({ email, password }) {
  const user = await User.findOne({ email });
  if (!user) throw new Error('Invalid credentials');
  const ok = await bcrypt.compare(password, user.password);
  if (!ok) throw new Error('Invalid credentials');
  const token = jwt.sign({ sub: user._id, role: user.role }, config.jwtSecret, { expiresIn: '7d' });
  return { token, user };
}

module.exports = { signUp, signIn };
