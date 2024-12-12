const express = require('express');
const mongoose = require('mongoose');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const router = express.Router();
const User = require("../schemas/UserSchema");

// Signup controller
router.post('/signup', async (req, res) => {
  const { username, email, password, phoneNumber, name, skills, dateOfBirth, institution, location } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ 
      username, 
      email, 
      password: hashedPassword, 
      phoneNumber, 
      name, 
      skills, 
      dateOfBirth, 
      institution, 
      location 
    });
    await newUser.save();
    res.status(201).send('User created');
  } catch (error) {
    res.status(400).send(error.message);
  }
});
  
  // Login controller
router.post('/login', async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).send('Invalid username or password');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).send('Invalid username or password');
    }
    const token = jwt.sign({ id: user._id }, 'your_jwt_secret', { expiresIn: '1h' });
    res.status(200).json({ token });
  } catch (error) {
    res.status(500).send(error.message);
  }
});

// Get all users controller
router.get('/users', async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json(users);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  
module.exports = router;