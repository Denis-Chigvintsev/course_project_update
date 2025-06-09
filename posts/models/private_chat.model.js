const mongoose = require('mongoose');

const private_chatSchema = new mongoose.Schema({
  _id: { type: String },
  sender_nick: { type: String },
  receiver_nick: { type: String },
  sender_i_email: { type: String },
  message: { type: String },
  date: { type: String },
});

module.exports = mongoose.model('PrivateChat', private_chatSchema);
