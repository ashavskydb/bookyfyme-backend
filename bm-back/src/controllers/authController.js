import { User } from '../models/User.js';
// import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { body, validationResult } from 'express-validator';
import { config } from '../config/config.js';

export const userValidationRules = () => {
  return [
    body('email', 'Enter a valid email address').isEmail(),
    body('password', 'Password must be at least 6 characters long').isLength({ min: 6 }),
    body('name', 'Name must be at least 2 characters long').isLength({ min: 2 }),
  ];
};

const validate = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }
  next();
};

export const registerUser = [
  userValidationRules(),
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const hashedPassword = await bcrypt.hash(password, 10);
      const user = await User.create({ email, password: hashedPassword });
      res.status(201).json({ message: 'User registered successfully', user: { email: user.email } });
    } catch (error) {
      console.error(error);  
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  }
];

export const loginUser = [
  userValidationRules(),
  validate,
  async (req, res) => {
    const { email, password } = req.body;
    try {
      const user = await User.findOne({ where: { email } });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(400).json({ message: 'Invalid credentials' });
      }
      const token = jwt.sign({ userId: user.id }, config.jwtSecret, { expiresIn: '1h' });
      res.status(200).json({ token });
    } catch (error) {
      console.error(error);  
      res.status(500).json({ error: 'Internal server error. Please try again later.' });
    }
  }
];
