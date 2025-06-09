const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  _id: { type: String },
  email: { type: String },
  password: { type: String },
  name: { type: String },
  contactPhone: { type: String },
});

module.exports = mongoose.model('Users', userSchema);
