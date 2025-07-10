require('dotenv').config();

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const { validateInput } = require('./utils/validate');
const { hashPassword, comparePassword } = require('./utils/hash');
const { setupOAuth, generateOAuthRoutes } = require('./utils/oauth');
const mongoose = require('mongoose');
const User = require('./models/User');

function flexAuth(config) {
  const { methods, jwtSecret, mongoUri, enableOAuth } = config;

  if (!jwtSecret || !mongoUri) {
    throw new Error('Missing required config: jwtSecret or mongoUri');
  }

  const supportedMethods = ['email-password', 'email-username-password', 'mobile-username-password'];
  const activeMethods = methods || supportedMethods;

  mongoose.connect(mongoUri, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

  if (enableOAuth) {
    setupOAuth({ jwtSecret });
  }

  const getQuery = (body) => {
    return body.email ? { email: body.email } : { mobile: body.mobile };
  };

  async function register(req, res) {
    const { method, body } = req;
    if (!activeMethods.includes(method)) return res.status(400).json({ error: 'Auth method not supported' });

    const validation = validateInput(method, body);
    if (!validation.valid) return res.status(400).json({ error: validation.message });

    const query = getQuery(body);
    const existing = await User.findOne(query);
    if (existing) return res.status(409).json({ error: 'User already exists' });

    const hashedPassword = await hashPassword(body.password);
    const newUser = new User({ ...body, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User registered', userId: newUser._id });
  }

  async function login(req, res) {
    const { method, body } = req;
    if (!activeMethods.includes(method)) return res.status(400).json({ error: 'Auth method not supported' });

    const validation = validateInput(method, body);
    if (!validation.valid) return res.status(400).json({ error: validation.message });

    const query = getQuery(body);
    const user = await User.findOne(query);
    if (!user) return res.status(404).json({ error: 'User not found' });

    const validPass = await comparePassword(body.password, user.password);
    if (!validPass) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign({ id: user._id }, jwtSecret, { expiresIn: '1h' });
    res.status(200).json({ message: 'Login successful', token, email: user.email, username: user.username });
  }

  function useOAuth(app) {
    if (!enableOAuth) {
      throw new Error('OAuth not enabled. Set enableOAuth: true in config.');
    }
    generateOAuthRoutes(app, jwtSecret);
  }

  // ✅ Return all public methods
  return {
    register,
    login,
    useOAuth
  };
}

module.exports = flexAuth;
