import { Router, Response } from 'express';
import bcrypt from 'bcryptjs';
import { generateToken } from '../utils/jwt';
import { demoStore } from './demoStore';

const router = Router();

router.post('/register', async (req, res: Response) => {
  try {
    const { first_name, last_name, email, password } = req.body;

    if (!first_name || !last_name || !email || !password) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    if (password.length < 4) {
      return res.status(400).json({ message: 'Password must be at least 4 characters long' });
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
    }

    if (demoStore.users.some((user) => user.email === email)) {
      return res.status(400).json({ message: 'Email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = demoStore.createUser({
      first_name,
      last_name,
      email,
      password: hashedPassword,
      role: 'user',
    });

    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    res.status(201).json({
      message: 'User registered successfully',
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Demo registration error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

router.post('/login', async (req, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    const user = demoStore.users.find((entry) => entry.email === email);
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = generateToken({
      userId: user.user_id,
      email: user.email,
      role: user.role,
    });

    res.json({
      message: 'Login successful',
      token,
      user: {
        user_id: user.user_id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    console.error('Demo login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

export default router;
