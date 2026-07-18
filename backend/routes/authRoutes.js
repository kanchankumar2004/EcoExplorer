import express from 'express';
import { registerUser, loginUser, getMe, updateUserProfile, changePassword, verifyEmail, deleteAccount } from '../controllers/authController.js';
import { protect } from '../middleware/authMiddleware.js';
import { check } from 'express-validator';
import rateLimit from 'express-rate-limit';
import passport from 'passport';
import jwt from 'jsonwebtoken';

const router = express.Router();

const authLimiter = (req, res, next) => next();

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
router.post('/verify-email', verifyEmail);
router.get('/me', protect, getMe);
router.put('/profile', protect, updateUserProfile);
router.put('/change-password', protect, changePassword);
router.delete('/profile', protect, deleteAccount);

// OAuth Helper
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ecoexplorer_super_secret_jwt_key_2026', {
    expiresIn: '7d',
  });
};


// GitHub OAuth Routes
router.get('/github', passport.authenticate('github', { scope: ['user:email'], session: false }));
router.get('/github/callback', passport.authenticate('github', { session: false, failureRedirect: '/login' }), (req, res) => {
  const token = generateToken(req.user._id);
  const frontendUrl = process.env.FRONTEND_URL || 'http://localhost:3000';
  res.redirect(`${frontendUrl}/login?token=${token}`);
});

export default router;
