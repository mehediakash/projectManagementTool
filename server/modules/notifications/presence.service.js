// src/modules/notifications/presence.service.js
const redisClient = require("../../config/redis");

const setUserOnline = async (userId) => {
  await redisClient.set(`presence:${userId}`, "online", { EX: 60 * 5 }); // 5 min expiry
};

const setUserOffline = async (userId) => {
  await redisClient.set(`presence:${userId}`, "offline", { EX: 60 * 60 }); // 1 hour expiry
};

const getUserPresence = async (userId) => {
  const status = await redisClient.get(`presence:${userId}`);
  return status || "offline";
};

module.exports = {
  setUserOnline,
  setUserOffline,
  getUserPresence
};
