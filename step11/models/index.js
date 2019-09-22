const mongoose = require('mongoose');
const userSchema = new mongoose.Schema({
  name: String,
  password: String,
});
const threadSchema = new mongoose.Schema({
  author: String,
  title: { type: String, default: '' },
  content: String,
  parentID: { type: String, default: '' },
  enabled: { type: Boolean, default: true },
  timeCreated: { type: Date, default: Date.now },
  timeEdited: { type: Date, default: Date.now },
  timeUpdated: { type: Date, default: Date.now }
});

exports.Users = mongoose.model('User', userSchema, 'Users');
exports.Threads = mongoose.model('Thread', threadSchema, 'Threads');
