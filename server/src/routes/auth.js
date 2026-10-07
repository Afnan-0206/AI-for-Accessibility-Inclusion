import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import { isDbConnected } from '../config/db.js';
import { User, memoryUserStore } from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
import { requireAuth } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimit.js';

const router = express.Router();

router.use(authLimiter);

// POST /api/auth/register
router.post('/register', async (req, res, next) => {
  try {
    const parseResult = registerSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      return res.status(400).json({ error: issues[0]?.message || 'Invalid input' });
    }

    const { name, email, password } = parseResult.data;
    const passwordHash = await bcrypt.hash(password, 10);

    let newUser;
    if (isDbConnected()) {
      const existing = await User.findOne({ email });
      if (existing) {
        return res.status(409).json({ error: 'An account with this email already exists.' });
      }
      newUser = await User.create({ name, email, passwordHash });
    } else {
      try {
        newUser = await memoryUserStore.create({ name, email, passwordHash });
      } catch (err) {
        if (err.code === 11000) {
          return res.status(409).json({ error: 'An account with this email already exists.' });
        }
        throw err;
      }
    }

    const userId = newUser.id || newUser._id.toString();
    const token = jwt.sign({ id: userId, email }, env.JWT_SECRET, { expiresIn: '7d' });

    res.status(201).json({
      token,
      user: {
        id: userId,
        name: newUser.name,
        email: newUser.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// POST /api/auth/login
router.post('/login', async (req, res, next) => {
  try {
    const parseResult = loginSchema.safeParse(req.body);
    if (!parseResult.success) {
      const issues = parseResult.error.issues || parseResult.error.errors || [];
      return res.status(400).json({ error: issues[0]?.message || 'Invalid input' });
    }

    const { email, password } = parseResult.data;

    let user;
    if (isDbConnected()) {
      user = await User.findOne({ email });
    } else {
      user = await memoryUserStore.findOneByEmail(email);
    }

    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const userId = user.id || user._id.toString();
    const token = jwt.sign({ id: userId, email }, env.JWT_SECRET, { expiresIn: '7d' });

    res.status(200).json({
      token,
      user: {
        id: userId,
        name: user.name,
        email: user.email,
      },
    });
  } catch (err) {
    next(err);
  }
});

// GET /api/auth/me
router.get('/me', requireAuth, async (req, res) => {
  res.status(200).json({ user: req.user });
});

export default router;
