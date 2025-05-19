const User = require('../models/User');
const TempUser = require('../models/TempUser');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const { sendOTPEmail } = require('../utils/emailService');

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

exports.register = async (req, res) => {
  try {
    const { name, email, password, role } = req.body;

    const userExists = await User.findOne({ email });
    if (userExists) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    if (!password) {
      return res.status(400).json({ success: false, message: 'Password is required' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    // Hash the password before storing in TempUser
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const tempUser = new TempUser({
      name,
      email,
      password: hashedPassword, // Store the hashed password in TempUser
      role,
      otp,
      otpExpiry
    });

    await tempUser.save();
    await sendOTPEmail(email, otp);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please verify your email.'
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;

    const tempUser = await TempUser.findOne({ email });
    if (tempUser) {
      if (tempUser.otp !== otp) {
        return res.status(400).json({ success: false, message: 'Invalid OTP' });
      }
      if (tempUser.otpExpiry < Date.now()) {
        return res.status(400).json({ success: false, message: 'OTP has expired' });
      }

      const newUser = new User({
        name: tempUser.name,
        email: tempUser.email,
        password: tempUser.password, // Now transferring the hashed password
        role: tempUser.role,
        isVerified: true
      });

      // Disable the pre-save password hashing hook for this operation
      // since we're already transferring a hashed password
      newUser.$skipPasswordHashing = true;
      await newUser.save();
      await TempUser.deleteOne({ email });

      return res.status(200).json({ success: true, message: 'Email verified successfully' });
    }

    // OTP verification for forgot password
    const user = await User.findOne({ email });
    if (!user || !user.otp || user.otp.code !== otp) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }
    if (user.otp.expiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    res.status(200).json({ success: true, message: 'OTP verified successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resendOTP = async (req, res) => {
  try {
    const { email } = req.body;
    const tempUser = await TempUser.findOne({ email });

    if (!tempUser) {
      return res.status(404).json({ success: false, message: 'User not found or already verified' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    tempUser.otp = otp;
    tempUser.otpExpiry = otpExpiry;

    await tempUser.save();
    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: 'OTP resent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password, role } = req.body;

    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    if (user.role !== role) {
      return res.status(401).json({ success: false, message: 'Role mismatch' });
    }

    if (!user.isVerified) {
      return res.status(401).json({ success: false, message: 'Please verify your email first' });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      success: true,
      token,
      role: user.role,
      user: {
        id: user._id,
        name: user.name,
        email: user.email
      }
    });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = { code: otp, expiry: otpExpiry };
    await user.save();
    await sendOTPEmail(email, otp);

    res.status(200).json({ success: true, message: 'Password reset OTP sent successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.resetPassword = async (req, res) => {
  try {
    const { email, newPassword, otp } = req.body;

    const user = await User.findOne({ email, 'otp.code': otp });
    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid OTP' });
    }

    if (user.otp.expiry < Date.now()) {
      return res.status(400).json({ success: false, message: 'OTP expired' });
    }

    user.password = newPassword; // The pre-save hook will hash this
    user.otp = undefined;
    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};