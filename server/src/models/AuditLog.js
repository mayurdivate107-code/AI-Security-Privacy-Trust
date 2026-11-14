import mongoose from 'mongoose';

const auditLogSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    userEmail: {
      type: String,
      default: 'anonymous@internal.local',
    },
    originalPromptHash: {
      type: String,
      required: true,
      index: true,
    },
    originalPromptPreview: {
      type: String,
      default: '',
    },
    sanitizedPrompt: {
      type: String,
      required: true,
    },
    detectedPII: {
      type: [String],
      default: [],
      index: true,
    },
    threatLevel: {
      type: String,
      enum: ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'],
      default: 'LOW',
      index: true,
    },
    threatCategory: {
      type: String,
      enum: ['NONE', 'PROMPT_INJECTION', 'JAILBREAK', 'DATA_EXFILTRATION', 'TOXICITY'],
      default: 'NONE',
      index: true,
    },
    trustScore: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
      index: true,
    },
    actionTaken: {
      type: String,
      enum: ['ALLOWED', 'REDACTED_AND_ALLOWED', 'BLOCKED'],
      required: true,
      index: true,
    },
    aiExplanation: {
      type: String,
      default: '',
    },
    aiResponse: {
      type: String,
      default: '',
    },
    complianceFlags: {
      type: [String],
      default: [],
    },
    complianceFramework: {
      type: String,
      default: 'DPDP_INDIA',
    },
    latencyMs: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,
  }
);

// Indexes for high-performance dashboard queries
auditLogSchema.index({ createdAt: -1 });
auditLogSchema.index({ threatLevel: 1, actionTaken: 1 });

export const AuditLog = mongoose.model('AuditLog', auditLogSchema);
