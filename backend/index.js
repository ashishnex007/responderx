const express = require('express');
const path = require('path');
const cors = require('cors');
const connectDB = require('./config/connectDB');

// * controllers
const userController = require('./controllers/userController');

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

connectDB();

// Set the frontend folder as the static folder
app.use(express.static(path.join(__dirname, '../frontend')));

// Serve index.html on the / endpoint
app.get('/login', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/login.html'));
});

app.get('/signup', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/register.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/dashboard.html'));
});

app.get('/admin', (req, res) => {
  res.sendFile(path.join(__dirname, '../frontend/admin.html'));
});

// Link userController
app.use('/api/users', userController);

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});