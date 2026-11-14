export type ThreatLevel = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';
export type ThreatCategory = 'NONE' | 'PROMPT_INJECTION' | 'JAILBREAK' | 'DATA_EXFILTRATION' | 'TOXICITY';
export type ActionTaken = 'ALLOWED' | 'REDACTED_AND_ALLOWED' | 'BLOCKED';
export type ComplianceFramework = 'DPDP_INDIA' | 'GDPR' | 'HIPAA';

export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'analyst' | 'employee';
  organization?: string;
}

export interface PolicyConfig {
  userId?: string;
  blockPromptInjection: boolean;
  autoRedactPII: boolean;
  minimumTrustScore: number;
  complianceMode: ComplianceFramework;
  customBlockedKeywords?: string[];
  updatedAt?: string;
}

export interface AuditLog {
  _id: string;
  userId?: string;
  userEmail: string;
  originalPromptHash: string;
  originalPromptPreview: string;
  sanitizedPrompt: string;
  detectedPII: string[];
  threatLevel: ThreatLevel;
  threatCategory: ThreatCategory;
  trustScore: number;
  actionTaken: ActionTaken;
  aiExplanation: string;
  aiResponse: string;
  complianceFlags: string[];
  complianceFramework: string;
  latencyMs: number;
  createdAt: string;
}

export interface InspectionResult {
  logId: string;
  originalPromptHash: string;
  rawPromptPreview: string;
  sanitizedPrompt: string;
  redactionSummary: {
    totalRedactions: number;
    detectedPII: string[];
    details: {
      type: string;
      label: string;
      matchedLength: number;
      preview: string;
    }[];
  };
  securityAnalysis: {
    threatLevel: ThreatLevel;
    threatCategory: ThreatCategory;
    trustScore: number;
    actionTaken: ActionTaken;
    explanation: string;
    complianceFlags: string[];
    latencyMs: number;
  };
  aiResponse: string;
  policyApplied: PolicyConfig;
}

export interface ThreatTimelinePoint {
  date: string;
  totalScans: number;
  blockedThreats: number;
  safeScans: number;
  redactedScans: number;
}

export interface PIIBreakdownPoint {
  name: string;
  type: string;
  value: number;
  color: string;
}

export interface TrustBucketPoint {
  range: string;
  count: number;
  color: string;
}

export interface DashboardStats {
  stats: {
    totalScans: number;
    blockedThreats: number;
    redactedPrompts: number;
    totalPiiEntities: number;
    averageTrustScore: number;
    blockRate: number;
  };
  charts: {
    threatTimeline: ThreatTimelinePoint[];
    piiBreakdown: PIIBreakdownPoint[];
    trustDistribution: TrustBucketPoint[];
  };
  recentThreats: Partial<AuditLog>[];
}
