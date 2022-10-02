const mongoose = require('mongoose');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    unique: true,
    required: [true, 'Username must be provided'],
  },
  room: {
    type: String,
  },
});

const User = mongoose.model('User', userSchema);

module.exports = User;
