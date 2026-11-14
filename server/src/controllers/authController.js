import jwt from 'jsonwebtoken';
import { z } from 'zod';
import { User } from '../models/User.js';
import { PolicyConfig } from '../models/PolicyConfig.js';
import { config } from '../config/env.js';

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  role: z.enum(['admin', 'analyst', 'employee']).optional(),
  organization: z.string().optional(),
});

export const loginSchema = z.object({
  email: z.string().email('Invalid email address format'),
  password: z.string().min(1, 'Password is required'),
});

const generateToken = (userId, role) => {
  return jwt.sign({ id: userId, role }, config.jwtSecret, {
    expiresIn: '7d',
  });
};

/**
 * Register New Enterprise User
 */
export const register = async (req, res) => {
  try {
    const { name, email, password, role = 'employee', organization } = req.body;

    const existingUser = await User.findOne({ email: email.toLowerCase() });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'An account with this corporate email already exists.',
      });
    }

    const passwordHash = await User.hashPassword(password);
    const user = await User.create({
      name,
      email: email.toLowerCase(),
      passwordHash,
      role,
      organization: organization || 'Enterprise Defense Unit',
    });

    // Create default policy config for user
    await PolicyConfig.create({
      userId: user._id,
      blockPromptInjection: true,
      autoRedactPII: true,
      minimumTrustScore: 70,
      complianceMode: 'DPDP_INDIA',
    });

    const token = generateToken(user._id, user.role);

    return res.status(201).json({
      success: true,
      message: 'User registered successfully into AegisAI Enterprise Shield.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('[Auth Register Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Failed to complete registration.',
      error: error.message,
    });
  }
};

/**
 * Authenticate User & Return JWT
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check for Demo credentials shortcut
    if (email === 'demo@aegisai.com' && password === 'Password123!') {
      let demoUser = await User.findOne({ email: 'demo@aegisai.com' });
      if (!demoUser) {
        const passwordHash = await User.hashPassword('Password123!');
        demoUser = await User.create({
          name: 'Dr. Samantha Vance',
          email: 'demo@aegisai.com',
          passwordHash,
          role: 'admin',
          organization: 'Apex Cyber Trust Lab',
        });
        await PolicyConfig.create({
          userId: demoUser._id,
          blockPromptInjection: true,
          autoRedactPII: true,
          minimumTrustScore: 70,
          complianceMode: 'DPDP_INDIA',
        });
      }

      const token = generateToken(demoUser._id, demoUser.role);
      return res.status(200).json({
        success: true,
        message: 'Authenticated successfully in Demo Hackathon Mode.',
        token,
        user: {
          id: demoUser._id,
          name: demoUser.name,
          email: demoUser.email,
          role: demoUser.role,
          organization: demoUser.organization,
        },
      });
    }

    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email address or password.',
      });
    }

    const token = generateToken(user._id, user.role);

    return res.status(200).json({
      success: true,
      message: 'Authenticated successfully.',
      token,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        organization: user.organization,
      },
    });
  } catch (error) {
    console.error('[Auth Login Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Authentication failed due to internal error.',
      error: error.message,
    });
  }
};

/**
 * Get Current Logged-in User Profile
 */
export const getMe = async (req, res) => {
  try {
    const policy = await PolicyConfig.findOne({ userId: req.user._id });
    return res.status(200).json({
      success: true,
      user: req.user,
      policy: policy || {
        blockPromptInjection: true,
        autoRedactPII: true,
        minimumTrustScore: 70,
        complianceMode: 'DPDP_INDIA',
      },
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve profile data.',
      error: error.message,
    });
  }
};
