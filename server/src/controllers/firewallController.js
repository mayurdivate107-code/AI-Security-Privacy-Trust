import crypto from 'crypto';
import { z } from 'zod';
import { redactPII } from '../services/piiRedactor.js';
import { analyzeWithGemini } from '../services/geminiThreatScanner.js';
import { AuditLog } from '../models/AuditLog.js';
import { PolicyConfig } from '../models/PolicyConfig.js';

export const analyzeChatSchema = z.object({
  prompt: z.string().min(1, 'Prompt cannot be empty').max(10000, 'Prompt exceeds maximum character length'),
  policyOverrides: z
    .object({
      autoRedactPII: z.boolean().optional(),
      blockPromptInjection: z.boolean().optional(),
      minimumTrustScore: z.number().min(0).max(100).optional(),
      complianceMode: z.enum(['DPDP_INDIA', 'GDPR', 'HIPAA']).optional(),
    })
    .optional(),
});

/**
 * Core AI Privacy Firewall & Threat Inspection Pipeline
 */
export const analyzeAndChat = async (req, res) => {
  try {
    const { prompt, policyOverrides = {} } = req.body;
    const userId = req.user?._id || null;
    const userEmail = req.user?.email || 'evaluator@aegisai.demo';

    // 1. Fetch User Policy or Fallback to Defaults
    let policy = {
      autoRedactPII: true,
      blockPromptInjection: true,
      minimumTrustScore: 70,
      complianceMode: 'DPDP_INDIA',
    };

    if (userId) {
      const dbPolicy = await PolicyConfig.findOne({ userId });
      if (dbPolicy) {
        policy = {
          autoRedactPII: dbPolicy.autoRedactPII,
          blockPromptInjection: dbPolicy.blockPromptInjection,
          minimumTrustScore: dbPolicy.minimumTrustScore,
          complianceMode: dbPolicy.complianceMode,
        };
      }
    }

    // Merge any ad-hoc playground overrides
    policy = { ...policy, ...policyOverrides };

    // 2. Compute SHA-256 Integrity Hash of Original Input
    const originalPromptHash = crypto.createHash('sha256').update(prompt).digest('hex');

    // 3. Stage 1: PII & Secret Redaction Engine
    const piiResult = redactPII(prompt);
    const sanitizedPrompt = policy.autoRedactPII ? piiResult.sanitizedText : prompt;

    // 4. Stage 2 & 3: Threat & Trust Analysis (Gemini 2.5 Flash + Heuristics)
    const inspection = await analyzeWithGemini({
      rawPrompt: prompt,
      sanitizedPrompt,
      detectedPII: piiResult.detectedPII,
      complianceMode: policy.complianceMode,
    });

    // 5. Determine Final Governance Action
    let actionTaken = 'ALLOWED';

    // Check injection block policy
    const isThreatLevelSevere = inspection.threatLevel === 'HIGH' || inspection.threatLevel === 'CRITICAL';
    const isScoreBelowMinimum = inspection.trustScore < policy.minimumTrustScore;

    if ((policy.blockPromptInjection && isThreatLevelSevere) || isScoreBelowMinimum) {
      actionTaken = 'BLOCKED';
    } else if (piiResult.detectedPII.length > 0) {
      actionTaken = 'REDACTED_AND_ALLOWED';
    } else {
      actionTaken = 'ALLOWED';
    }

    // 6. Enforce Final Response
    let finalAiResponse = inspection.safeResponse;
    if (actionTaken === 'BLOCKED') {
      finalAiResponse = `🛡️ [AEGIS_AI_FIREWALL_BLOCK]: Transmission intercepted. Security violation: ${inspection.threatCategory} (Threat Level: ${inspection.threatLevel}, Trust Score: ${inspection.trustScore}/100, Policy Minimum: ${policy.minimumTrustScore}). Prompt was not sent to downstream LLM.`;
    }

    // 7. Persist to MongoDB AuditLog
    let auditRecord = null;
    try {
      auditRecord = await AuditLog.create({
        userId,
        userEmail,
        originalPromptHash,
        originalPromptPreview: prompt.length > 80 ? `${prompt.slice(0, 77)}...` : prompt,
        sanitizedPrompt,
        detectedPII: piiResult.detectedPII,
        threatLevel: inspection.threatLevel,
        threatCategory: inspection.threatCategory,
        trustScore: inspection.trustScore,
        actionTaken,
        aiExplanation: inspection.explanation,
        aiResponse: finalAiResponse,
        complianceFlags: inspection.complianceFlags,
        complianceFramework: policy.complianceMode,
        latencyMs: inspection.latencyMs,
      });
    } catch (dbErr) {
      console.warn('[AuditLog DB Write Warning]:', dbErr.message);
    }

    // 8. Return Comprehensive Inspection Payload
    return res.status(200).json({
      success: true,
      logId: auditRecord?._id || new Date().getTime().toString(),
      originalPromptHash,
      rawPromptPreview: prompt,
      sanitizedPrompt,
      redactionSummary: {
        totalRedactions: piiResult.totalRedactions,
        detectedPII: piiResult.detectedPII,
        details: piiResult.details,
      },
      securityAnalysis: {
        threatLevel: inspection.threatLevel,
        threatCategory: inspection.threatCategory,
        trustScore: inspection.trustScore,
        actionTaken,
        explanation: inspection.explanation,
        complianceFlags: inspection.complianceFlags,
        latencyMs: inspection.latencyMs,
      },
      aiResponse: finalAiResponse,
      policyApplied: policy,
    });
  } catch (error) {
    console.error('[Firewall Analysis Error]:', error);
    return res.status(500).json({
      success: false,
      message: 'Firewall inspection failed.',
      error: error.message,
    });
  }
};
