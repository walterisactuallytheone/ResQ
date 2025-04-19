const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register new user
router.post('/register', async (req, res) => {
  try {
    // Check if email already exists
    const existingUser = await User.findOne({ email: req.body.email });
    if (existingUser) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    // Create new user
    const user = new User({
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      email: req.body.email,
      password: req.body.password
    });

    await user.save();

    // Create token (remove the password from the response)
    const userObject = user.toObject();
    delete userObject.password;

    // Store user in session
    req.session.user = userObject;

    res.status(201).json({
      message: 'User registered successfully',
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Login user
router.post('/login', async (req, res) => {
  try {
    // Find user by email
    const user = await User.findOne({ email: req.body.email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Check password
    const isMatch = await user.comparePassword(req.body.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    // Create JWT token
    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '24h' }
    );

    // User object without password
    const userObject = user.toObject();
    delete userObject.password;

    // Store user in session
    req.session.user = userObject;

    res.json({
      message: 'Login successful',
      token,
      user: userObject
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Logout user
router.get('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ message: 'Could not log out, please try again' });
    }
    res.redirect('/');
  });
});

module.exports = router; 