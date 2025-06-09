const mongoose = require('mongoose');

const room_list = new mongoose.Schema({
  _id: { type: String },
  real_room_name: { type: String },
});

module.exports = mongoose.model('Real_rooms', room_list);
