import { z } from 'zod';
import { PolicyConfig } from '../models/PolicyConfig.js';

export const updatePolicySchema = z.object({
  blockPromptInjection: z.boolean().optional(),
  autoRedactPII: z.boolean().optional(),
  minimumTrustScore: z.number().min(0).max(100).optional(),
  complianceMode: z.enum(['DPDP_INDIA', 'GDPR', 'HIPAA']).optional(),
  customBlockedKeywords: z.array(z.string()).optional(),
});

/**
 * Get Security Policy
 */
export const getPolicy = async (req, res) => {
  try {
    const userId = req.user?._id;
    let policy = null;

    if (userId) {
      policy = await PolicyConfig.findOne({ userId });
    }

    if (!policy) {
      // Find system default or return default posture
      policy = (await PolicyConfig.findOne({ userId: null })) || {
        blockPromptInjection: true,
        autoRedactPII: true,
        minimumTrustScore: 70,
        complianceMode: 'DPDP_INDIA',
        customBlockedKeywords: ['internal credentials', 'confidential blueprint'],
      };
    }

    return res.status(200).json({
      success: true,
      policy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to retrieve policy settings.',
      error: error.message,
    });
  }
};

/**
 * Update Security Policy
 */
export const updatePolicy = async (req, res) => {
  try {
    const userId = req.user?._id;
    const updates = req.body;

    let policy;
    if (userId) {
      policy = await PolicyConfig.findOneAndUpdate(
        { userId },
        { ...updates, updatedAt: Date.now() },
        { new: true, upsert: true }
      );
    } else {
      policy = await PolicyConfig.findOneAndUpdate(
        { userId: null },
        { ...updates, updatedAt: Date.now() },
        { new: true, upsert: true }
      );
    }

    return res.status(200).json({
      success: true,
      message: 'Security policy updated successfully.',
      policy,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: 'Failed to update policy settings.',
      error: error.message,
    });
  }
};
