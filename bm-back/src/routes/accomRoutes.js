import express from 'express';
import jwt from 'jsonwebtoken';
import * as accomController from '../controllers/accomController.js';

const router = express.Router();

const authenticateToken = (req, res, next) => {
  const token = req.header('Authorization')?.split(' ')[1];
  console.log('Authorization header:', req.header('Authorization'));
  if (!token) {
    return res.status(401).json({ error: 'Access denied, no token provided' });
  }
  try {
    const verified = jwt.verify(token, process.env.JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    console.error('Token verification error:', error);
    res.status(400).json({ error: 'Invalid token' });
  }
};

router.get('/', authenticateToken, accomController.findAccommodations);
router.post('/', authenticateToken, accomController.createAccommodation);

export default router;
