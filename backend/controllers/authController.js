import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';

// Helper to generate JWT
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET || 'ecoexplorer_super_secret_jwt_key_2026', {
    expiresIn: '30d',
  });
};

// Validation Helper Functions
const validateEmail = (email) => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

const validatePassword = (password) => {
  // At least 6 characters, contains at least one letter and one number
  const passwordRegex = /^(?=.*[A-Za-z])(?=.*\d).{6,}$/;
  return passwordRegex.test(password);
};

const validateName = (name) => {
  // Letters and spaces, minimum 3 characters
  const nameRegex = /^[A-Za-z\s]{3,}$/;
  return nameRegex.test(name);
};

// @desc    Register new user
// @route   POST /api/auth/register
// @access  Public
export const registerUser = async (req, res) => {
  const { name, email, password, userType } = req.body;

  // 1. Validation
  if (!name || !email || !password) {
    return res.status(400).json({ message: 'Please include all required fields' });
  }

  if (!validateName(name.trim())) {
    return res.status(400).json({ 
      message: 'Name must be at least 3 characters and contain only letters and spaces' 
    });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  if (!validatePassword(password)) {
    return res.status(400).json({ 
      message: 'Password must be at least 6 characters long and contain both letters and numbers' 
    });
  }

  const validRoles = ['traveler', 'host', 'both', 'admin'];
  const role = userType || 'traveler';
  if (!validRoles.includes(role)) {
    return res.status(400).json({ message: 'Invalid user type' });
  }

  try {
    // 2. Check if user exists
    const userExists = await User.findOne({ email: email.toLowerCase().trim() });
    if (userExists) {
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // 3. Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // 4. Create user in DB
    const user = await User.create({
      name: name.trim(),
      email: email.toLowerCase().trim(),
      password: hashedPassword,
      userType: role,
      phone: '',
      bio: '',
      country: '',
      city: ''
    });

    if (user) {
      // 5. Respond with token
      res.status(201).json({
        id: user._id,
        name: user.name,
        email: user.email,
        userType: user.userType,
        phone: user.phone,
        bio: user.bio,
        country: user.country,
        city: user.city,
        token: generateToken(user._id)
      });
    } else {
      res.status(400).json({ message: 'Invalid user data' });
    }
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: 'Server error during registration' });
  }
};

// @desc    Authenticate a user
// @route   POST /api/auth/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // 1. Validation
  if (!email || !password) {
    return res.status(400).json({ message: 'Please include email and password' });
  }

  if (!validateEmail(email)) {
    return res.status(400).json({ message: 'Please enter a valid email address' });
  }

  try {
    // 2. Check for user email
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 3. Compare password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: 'Invalid email or password' });
    }

    // 4. Respond with token
    res.status(200).json({
      id: user._id,
      name: user.name,
      email: user.email,
      userType: user.userType,
      phone: user.phone || '',
      bio: user.bio || '',
      country: user.country || '',
      city: user.city || '',
      token: generateToken(user._id)
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error during login' });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/me
// @access  Private
export const getMe = async (req, res) => {
  res.status(200).json(req.user);
};

// @desc    Update user profile
// @route   PUT /api/auth/profile
// @access  Private
export const updateUserProfile = async (req, res) => {
  const { name, email, phone, bio, country, city } = req.body;
  const userId = req.user.id;

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const updatedData = {};

    // Validate name if updated
    if (name !== undefined) {
      if (!validateName(name.trim())) {
        return res.status(400).json({ 
          message: 'Name must be at least 3 characters and contain only letters and spaces' 
        });
      }
      updatedData.name = name.trim();
    }

    // Validate email if updated and verify uniqueness
    if (email !== undefined && email.toLowerCase().trim() !== user.email) {
      const emailVal = email.toLowerCase().trim();
      if (!validateEmail(emailVal)) {
        return res.status(400).json({ message: 'Please enter a valid email address' });
      }
      
      const emailExists = await User.findOne({ email: emailVal });
      if (emailExists) {
        return res.status(400).json({ message: 'Email is already taken' });
      }
      updatedData.email = emailVal;
    }

    if (phone !== undefined) updatedData.phone = phone.trim();
    if (bio !== undefined) updatedData.bio = bio;
    if (country !== undefined) updatedData.country = country.trim();
    if (city !== undefined) updatedData.city = city.trim();

    // Perform DB update
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updatedData },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.status(200).json(updatedUser);
  } catch (error) {
    console.error('Update profile error:', error);
    res.status(500).json({ message: 'Server error during profile update' });
  }
};
