import mongoose from 'mongoose';

const policyConfigSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      unique: true,
      sparse: true,
    },
    blockPromptInjection: {
      type: Boolean,
      default: true,
    },
    autoRedactPII: {
      type: Boolean,
      default: true,
    },
    minimumTrustScore: {
      type: Number,
      default: 70,
      min: 0,
      max: 100,
    },
    complianceMode: {
      type: String,
      enum: ['DPDP_INDIA', 'GDPR', 'HIPAA'],
      default: 'DPDP_INDIA',
    },
    customBlockedKeywords: {
      type: [String],
      default: ['internal credentials', 'confidential blueprint', 'passwords.txt'],
    },
  },
  {
    timestamps: true,
  }
);

export const PolicyConfig = mongoose.model('PolicyConfig', policyConfigSchema);
