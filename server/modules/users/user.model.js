const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true, index: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['admin','manager','member','viewer'], default: 'member' },
  skills: [{ type: String }],
  availability: { type: Number, default: 1 } 
}, { timestamps: true });

module.exports = mongoose.model('User', userSchema);
