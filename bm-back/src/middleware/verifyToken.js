import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const verifyToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  try {
    const verified = jwt.verify(token, config.jwtSecret);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
};

export default verifyToken;










