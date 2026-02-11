import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import authMiddleware from '../middleware/auth.js';
import { JWT_SECRET } from '../config.js';
import validate  from '../middleware/validation.js'
import { registerSchema, loginSchema } from '../validation/authValidation.js';

const router = Router();

// @route   POST /api/v1/auth/register
// @desc    Register user
router.post('/register', validate(registerSchema), async (req, res) => {
  const { name, email, password } = req.body;

  try {
    
    // Check if user exists
    let user = await User.findOne({ email });
    
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    // Create new user
    user = new User({ name, email, password });

    // Hash password
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(password, salt);

    await user.save();

    // Return token so user is auto-logged-in after registration
    const payload = { userId: user._id };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   POST /api/v1/auth/login
// @desc    Login user
router.post('/login', validate(loginSchema), async (req, res) => {
  const { email, password } = req.body;

  try {
    // Check if user doesn't exists
    let user = await User.findOne({ email });
    
    if (!user) {
      return res.status(400).json({ msg: 'Invalid Credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    // Create JWT
    const payload = { userId: user._id };

    jwt.sign(
      payload,
      JWT_SECRET,
      { expiresIn: '7d' },
      (err, token) => {
        if (err) throw err;
        res.json({
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
          }
        });
      }
    );
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

// @route   GET /api/v1/auth/me
// @desc    Get current user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    res.json({ user });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
});

export default router;