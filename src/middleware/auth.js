const jwt = require('jsonwebtoken');
const User = require('../models/User');

const authenticate = async (req, res, next) => {
  const header = req.headers.authorization;
  if (!header?.startsWith('Bearer ')) return res.status(401).json({ error: 'Missing token' });
  const token = header.slice(7);
  try {
    const payload = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(payload.id).select('-passwordHash');
    if (!user || !user.isActive) return res.status(401).json({ error: 'Invalid or inactive account' });
    req.user = user;
    next();
  } catch {
    return res.status(401).json({ error: 'Token invalid or expired' });
  }
};

module.exports = { authenticate };
