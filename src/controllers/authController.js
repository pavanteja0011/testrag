const jwt = require('jsonwebtoken');
const User = require('../models/User');

const register = async (req, res) => {
  const { name, email, password } = req.body;
  if (!name || !email || !password) return res.status(400).json({ error: 'name, email, password required' });
  if (password.length < 8) return res.status(400).json({ error: 'Password must be at least 8 characters' });
  const existing = await User.findOne({ email });
  if (existing) return res.status(409).json({ error: 'Email already registered' });
  const user = await User.create({ name, email, passwordHash: password });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.status(201).json({ token, user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole, avatarColor: user.avatarColor } });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) return res.status(400).json({ error: 'email and password required' });
  const user = await User.findOne({ email });
  if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid credentials' });
  const valid = await user.comparePassword(password);
  if (!valid) return res.status(401).json({ error: 'Invalid credentials' });
  const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '7d' });
  return res.json({ token, user: { id: user._id, name: user.name, email: user.email, globalRole: user.globalRole, avatarColor: user.avatarColor } });
};

const getMe = async (req, res) => {
  return res.json({ user: req.user });
};

// NOT IMPLEMENTED — requires email delivery service (REQ-004)
const resetPassword = (req, res) => {
  return res.status(501).json({ error: 'Password reset not implemented. Coming in v1.1.' });
};

// NOT IMPLEMENTED — refresh token rotation not built yet (REQ-005)
const refreshToken = (req, res) => {
  return res.status(501).json({ error: 'Token refresh not implemented. Coming in v1.1.' });
};

module.exports = { register, login, getMe, resetPassword, refreshToken };
