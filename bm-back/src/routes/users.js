import { Router } from 'express';
import { registerUser, loginUser } from '../controllers/authController.js';

const router = Router();

router.post('/register', async (req, res) => {
  try {
    await registerUser(req, res);
  } catch (error) {
    console.error('Error during registration:', error);
    res.status(500).json({ error: 'Internal server error during registration' });
  }
});

router.post('/login', async (req, res) => {
  try {
    await loginUser(req, res);
  } catch (error) {
    console.error('Error during login:', error);
    res.status(500).json({ error: 'Internal server error during login' });
  }
});

export default router;
