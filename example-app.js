const express = require('express');
const flexAuth = require('./index');
require('dotenv').config();

const app = express();
app.use(express.json());

const auth = flexAuth({
  jwtSecret: process.env.JWT_SECRET,
  mongoUri: process.env.MONGO_URI
});

app.post('/register', (req, res) => auth.register({ ...req, method: req.body.method }, res));
app.post('/login', (req, res) => auth.login({ ...req, method: req.body.method }, res));

app.listen(3000, () => console.log('Auth server running on http://localhost:3000'));
