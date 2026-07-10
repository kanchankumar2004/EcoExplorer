import express from 'express';
import { registerUser, loginUser, getMe, updateUserProfile, changePassword } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 5,
  message: { message: 'Too many authentication attempts from this IP, please try again after 15 minutes' }
});

const registerValidation = [
  check('name', 'Name must be at least 3 characters and contain only letters and spaces').matches(/^[A-Za-z\s]{3,}$/),
  check('email', 'Please enter a valid email address').isEmail(),
  check('password', 'Password must be at least 6 characters long and contain both letters and numbers').matches(/^(?=.*[A-Za-z])(?=.*\d).{6,}$/)
];

const loginValidation = [
  check('email', 'Please enter a valid email address').isEmail(),
  check('password', 'Password is required').notEmpty()
];

router.post('/register', authLimiter, registerValidation, registerUser);
router.post('/login', authLimiter, loginValidation, loginUser);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);

// OAuth Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ecoexplorer_super_secret_jwt_key_2026', {
    expiresIn: '7d',
  });
};

// Google OAuth Routes
router.get('/google', passport.authenticate('google', { scope: ['profile', 'email'], session: false }));
router.get('/google/callback', passport.authenticate('google', { session: false, failureRedirect: '/login' }), (req, res) => {
  const token = generateToken(req.user._id);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login?token=${token}`);
});

// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), (req, res) => {
  const token = generateToken(req.user._id);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login?token=${token}`);
});

export default router;
