const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: String,
  socketId: String,
  isOnline: Boolean,
  color: String,
  lastSeen: Date
}, {
  timestamps: true
});

module.exports = mongoose.model('User', userSchema);