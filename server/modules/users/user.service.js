const User = require('./user.model');
const bcrypt = require('bcryptjs');
const redisClient = require('../../config/redis');
const SearchIndexer = require('../../integrations/search.indexer');

async function create(payload) {
  if (payload.password) {
    payload.password = await bcrypt.hash(payload.password, 10);
  } else {
    // create a random password placeholder if not provided (you can force reset later)
    payload.password = await bcrypt.hash(Math.random().toString(36).slice(2), 10);
  }
  const user = await User.create(payload);
  await redisClient.set(`user:${user._id}`, JSON.stringify(user), { EX: 60 * 5 });
  // index user in ES for search (optional)
  try { await SearchIndexer.indexUser(user); } catch (e) { /* ignore */ }
  return user;
}

async function getById(id) {
  const cache = await redisClient.get(`user:${id}`);
  if (cache) return JSON.parse(cache);
  const user = await User.findById(id).select('-password');
  if (user) await redisClient.set(`user:${id}`, JSON.stringify(user), { EX: 60 * 5 });
  return user;
}

async function update(id, payload) {
  if (payload.password) payload.password = await bcrypt.hash(payload.password, 10);
  const user = await User.findByIdAndUpdate(id, payload, { new: true }).select('-password');
  await redisClient.del(`user:${id}`);
  try { await SearchIndexer.indexUser(user); } catch (e) { /* ignore */ }
  return user;
}

async function remove(id) {
  await User.findByIdAndDelete(id);
  await redisClient.del(`user:${id}`);
  try { await SearchIndexer.deleteUserFromIndex(id); } catch (e) { /* ignore */ }
}

async function list({ q = '' }) {
  if (q && q.length > 1) {
    try {
      return await SearchIndexer.searchUsers(q, { page: 1, limit: 50 });
    } catch (e) {
      console.warn('ES user search failed', e.message);
    }
  }
  return User.find({}).select('-password').limit(100).sort({ name: 1 });
}

module.exports = { create, getById, update, remove, list };
