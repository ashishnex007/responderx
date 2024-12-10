const mongoose = require('mongoose');

// user model
const UserSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true
  },
  email: {
    type: String,
    required: true,
    unique: true
  },
  password: {
    type: String,
    required: true
  },
  phoneNumber: {
    type: String,
  },
  name: {
    type: String,
  },
  skills: {
    type: Array,
  },
  dateOfBirth: {
    type: Date,
  },
});

module.exports = mongoose.model('User', UserSchema);