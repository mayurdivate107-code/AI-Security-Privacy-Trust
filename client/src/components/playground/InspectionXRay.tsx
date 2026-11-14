import React from 'react';
import { InspectionResult } from '../../types/index.js';
import { ThreatBadge } from '../common/ThreatBadge.js';
import { ActionBadge } from '../common/ActionBadge.js';
import { TrustGauge } from '../common/TrustGauge.js';
import {
  ShieldAlert,
  Bot,
  Lock,
  Cpu,
  CheckCircle2,
  AlertTriangle,
  Scale,
  Clock,
  Fingerprint,
} from 'lucide-react';

interface InspectionXRayProps {
  result: InspectionResult | null;
  isLoading: boolean;
}

export const InspectionXRay: React.FC<InspectionXRayProps> = ({ result, isLoading }) => {
  if (isLoading) {
    return (
      <div className="cyber-card rounded-2xl border border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="relative">
          <div className="w-16 h-16 border-2 border-emerald-500/30 border-t-emerald-400 rounded-full animate-spin"></div>
          <Cpu className="w-6 h-6 text-emerald-400 absolute inset-0 m-auto animate-pulse" />
        </div>
        <div>
          <h3 className="text-sm font-mono font-bold text-white uppercase tracking-wider">
            Executing Multi-Stage Security Pipeline
          </h3>
          <p className="text-xs text-slate-400 mt-1 max-w-sm">
            PII regex scrubber → Adversarial prompt injection classifier → Gemini 2.5 Trust Auditor...
          </p>
        </div>
      </div>
    );
  }

  if (!result) {
    return (
      <div className="cyber-card rounded-2xl border border-slate-800 p-8 h-full flex flex-col items-center justify-center text-center space-y-4">
        <div className="w-16 h-16 rounded-2xl bg-slate-900 border border-slate-800 flex items-center justify-center text-slate-600">
          <Fingerprint className="w-8 h-8 text-slate-500" />
        </div>
        <div>
          <h3 className="text-sm font-mono font-bold text-slate-300 uppercase tracking-wider">
            Live Inspection X-Ray Idle
          </h3>
          <p className="text-xs text-slate-500 mt-1 max-w-sm">
            Select a 1-Click attack preset on the left or enter a custom prompt to observe real-time privacy redacting, threat triage, and DPDP compliance auditing.
          </p>
        </div>
      </div>
    );
  }

  const { securityAnalysis, redactionSummary, sanitizedPrompt, aiResponse } = result;
  const isBlocked = securityAnalysis.actionTaken === 'BLOCKED';

  // Highlight redacted tokens in sanitized prompt
  const renderHighlightedSanitized = (text: string) => {
    const parts = text.split(/(\[REDACTED_[A-Z_]+\])/g);
    return parts.map((part, i) => {
      if (part.startsWith('[REDACTED_')) {
        return (
          <span
            key={i}
            className="inline-block px-1.5 py-0.5 mx-0.5 text-[10px] font-mono font-bold rounded bg-amber-950/80 text-amber-300 border border-amber-500/40"
          >
            {part}
          </span>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-5 space-y-6">
      {/* Header with Status and Action Badge */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-4 border-b border-slate-800/80">
        <div>
          <span className="text-[10px] font-mono font-bold text-slate-500 uppercase tracking-widest block">
            STAGE 4 COMPLETED
          </span>
          <h2 className="text-base font-mono font-extrabold text-white flex items-center gap-2">
            Inspection Verdict: <ActionBadge action={securityAnalysis.actionTaken} />
          </h2>
        </div>

        <div className="flex items-center gap-2 text-xs font-mono text-slate-400">
          <Clock className="w-3.5 h-3.5 text-cyan-400" />
          <span>{securityAnalysis.latencyMs}ms inspection latency</span>
        </div>
      </div>

      {/* Step 1: PII Sanitization X-Ray */}
      <div className="space-y-2">
        <div className="flex items-center justify-between">
          <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase">
            <Lock className="w-3.5 h-3.5 text-amber-400" />
            Step 1: PII & Secret Redaction X-Ray
          </span>
          <span className="text-[11px] font-mono text-amber-400">
            {redactionSummary.totalRedactions} Identifiers Masked
          </span>
        </div>

        <div className="bg-[#030712]/90 border border-slate-800 rounded-xl p-3 text-xs font-mono text-slate-300 leading-relaxed max-h-32 overflow-y-auto">
          {renderHighlightedSanitized(sanitizedPrompt)}
        </div>

        {redactionSummary.detectedPII.length > 0 && (
          <div className="flex flex-wrap gap-1.5 pt-1">
            {redactionSummary.detectedPII.map((tag) => (
              <span
                key={tag}
                className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-amber-950/60 text-amber-300 border border-amber-500/30 font-semibold"
              >
                ● {tag.replace('_', ' ')}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Step 2: Threat & Injection Vector Analysis */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase">
          <ShieldAlert className="w-3.5 h-3.5 text-rose-400" />
          Step 2: Threat & Injection Vector
        </span>

        <div className="grid grid-cols-2 gap-3">
          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Threat Level</span>
            <ThreatBadge level={securityAnalysis.threatLevel} />
          </div>

          <div className="p-3 rounded-xl bg-slate-900/60 border border-slate-800 text-xs space-y-1">
            <span className="text-[10px] font-mono text-slate-500 uppercase block">Attack Vector</span>
            <span className="font-mono font-bold text-slate-200">
              {securityAnalysis.threatCategory.replace('_', ' ')}
            </span>
          </div>
        </div>
      </div>

      {/* Step 3: Explainable Trust Scorecard & Compliance */}
      <div className="space-y-3 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase">
          <Scale className="w-3.5 h-3.5 text-cyan-400" />
          Step 3: Explainable Trust Scorecard & Compliance
        </span>

        <div className="flex flex-col sm:flex-row items-center gap-5 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
          <TrustGauge score={securityAnalysis.trustScore} size="md" />

          <div className="space-y-2 flex-1 text-xs">
            <p className="text-slate-300 leading-relaxed font-sans">
              <span className="font-mono font-bold text-white text-[11px] block text-cyan-400 mb-0.5">
                AI Auditor Reasoning:
              </span>
              {securityAnalysis.explanation}
            </p>

            {securityAnalysis.complianceFlags && securityAnalysis.complianceFlags.length > 0 && (
              <div className="space-y-1 pt-1">
                {securityAnalysis.complianceFlags.map((flag, idx) => (
                  <div key={idx} className="flex items-center gap-1.5 text-[11px] text-slate-400">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                    <span>{flag}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Step 4: Final Safe Gemini Response or Security Block */}
      <div className="space-y-2 pt-2 border-t border-slate-800/80">
        <span className="text-xs font-mono font-bold text-slate-300 flex items-center gap-1.5 uppercase">
          <Bot className="w-3.5 h-3.5 text-emerald-400" />
          Step 4: Downstream LLM Response
        </span>

        {isBlocked ? (
          <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-500/50 text-xs space-y-2">
            <div className="flex items-center gap-2 text-rose-300 font-mono font-bold">
              <AlertTriangle className="w-4 h-4 text-rose-400" />
              <span>TRANSMISSION BLOCKED BY AEGISAI FIREWALL</span>
            </div>
            <p className="text-rose-200/90 leading-relaxed">{aiResponse}</p>
          </div>
        ) : (
          <div className="p-4 rounded-xl bg-emerald-950/20 border border-emerald-500/30 text-xs space-y-2">
            <div className="flex items-center gap-2 text-emerald-400 font-mono font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-400" />
              <span>Vetted & Safe Response (Gemini 2.5 Flash)</span>
            </div>
            <p className="text-slate-200 leading-relaxed font-sans">{aiResponse}</p>
          </div>
        )}
      </div>
    </div>
  );
};
