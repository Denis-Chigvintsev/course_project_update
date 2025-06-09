const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  contactPhone: { type: String },
  nick: { type: String },
  isOnline: { type: Boolean },
  socket_id_: { type: String },
});

module.exports = mongoose.model('Users', userSchema);
