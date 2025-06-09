const mongoose = require('mongoose');

const postSchema = new mongoose.Schema({
  _id: { type: String },
  shortText: { type: String },
  description: { type: String },
  images: { type: Array },
  userID: { type: String },
  createdAt: { type: Date },
  updatedAt: { type: Date },

  tags: { type: String },
  isDeleted: { type: Boolean },
});

module.exports = mongoose.model('Posts', postSchema);
