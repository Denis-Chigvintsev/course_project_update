const mongoose = require('mongoose');

const room_chat_Schema = new mongoose.Schema({
  _id: { type: String },
  sender_nick: { type: String },
  sender_i_email: { type: String },
  message: { type: String },
  date: { type: String },
  real_room: { type: String },
});
module.exports = mongoose.model('RoomChat', room_chat_Schema);
