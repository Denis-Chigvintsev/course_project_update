const mongoose = require('mongoose');

const chatSchema = new mongoose.Schema({
  _id: { type: String },
  message: { type: String },
  nick: { type: String },
  i_email: { type: String },
  date: { type: String },
});

module.exports = mongoose.model('Chat', chatSchema);
