const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  payload: { type: Object },
  read: { type: Boolean, default: false },
  type: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Notification', notificationSchema);
