import express from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/config.js';

const app = express();

const verifyToken = (req, res, next) => {
  const bearerHeader = req.headers['authorization'];
  if (!bearerHeader) {
    return res.status(401).json({ message: 'No token, authorization denied' });
  }

  const token = bearerHeader.split(' ')[1]; 
  try {
    const decoded = jwt.verify(token, config.jwtSecret);
    req.user = decoded;
    next();
  } catch (err) {
    res.status(401).json({ message: 'Token is not valid' });
  }
};

export default verifyToken;
