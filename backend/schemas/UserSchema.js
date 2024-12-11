const mongoose = require('mongoose');

// user model
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
  },
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
  skills: {
    type: Array,
  },
  dateOfBirth: {
    type: Date,
  },
  institution: {
    type: String,
  },
  location: {
    type: String,
    required: true,
  }
});

module.exports = mongoose.model('User', UserSchema);