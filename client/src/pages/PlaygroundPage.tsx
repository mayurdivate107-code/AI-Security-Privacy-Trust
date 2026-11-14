import React, { useState, useEffect } from 'react';
import { api, isBackendAlive } from '../lib/api.js';
import { InspectionResult, PolicyConfig } from '../types/index.js';
import { PresetButtons } from '../components/playground/PresetButtons.js';
import { PromptEditor } from '../components/playground/PromptEditor.js';
import { InspectionXRay } from '../components/playground/InspectionXRay.js';
import { clientRedactPII, clientAnalyzeThreat } from '../lib/clientFallback.js';
import { AlertCircle } from 'lucide-react';

export const PlaygroundPage: React.FC = () => {
  const [prompt, setPrompt] = useState(
    'Draft an onboarding email for Rahul Sharma, PAN: ABCDE1234F, Phone: +91-9876543210, AWS Key: AKIAIOSFODNN7EXAMPLE.'
  );
  const [result, setResult] = useState<InspectionResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [activePolicy, setActivePolicy] = useState<PolicyConfig>(() => {
    const saved = localStorage.getItem('aegis_policy');
    return saved
      ? JSON.parse(saved)
      : {
          blockPromptInjection: true,
          autoRedactPII: true,
          minimumTrustScore: 70,
          complianceMode: 'DPDP_INDIA',
        };
  });

  // Fetch current policy from backend on load (or use local)
  useEffect(() => {
    const fetchPolicy = async () => {
      const online = await isBackendAlive();
      if (!online) return;
      try {
        const res: any = await api.get('/policy');
        if (res.success && res.policy) {
          setActivePolicy(res.policy);
          localStorage.setItem('aegis_policy', JSON.stringify(res.policy));
        }
      } catch (err) {
        // Silently use cached/default policy
      }
    };
    fetchPolicy();
  }, []);

  const handlePolicyChange = (updates: Partial<PolicyConfig>) => {
    setActivePolicy((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem('aegis_policy', JSON.stringify(updated));
      return updated;
    });
  };

  const handleInspect = async () => {
    if (!prompt.trim()) return;

    setIsLoading(true);
    setError(null);

    const runClientSide = () => {
      const pii = clientRedactPII(prompt);
      const sanitized = activePolicy.autoRedactPII ? pii.sanitizedText : prompt;
      const clientInspection = clientAnalyzeThreat(prompt, sanitized, pii.detectedPII, activePolicy);
      setTimeout(() => {
        setResult(clientInspection);
        setIsLoading(false);
      }, 400);
    };

    const online = await isBackendAlive();
    if (!online) {
      runClientSide();
      return;
    }

    try {
      const res: any = await api.post('/firewall/analyze-and-chat', {
        prompt,
        policyOverrides: activePolicy,
      });

      if (res.success) {
        setResult(res);
        setIsLoading(false);
        return;
      }
    } catch (err: any) {
      console.warn('[AegisAI Firewall Engine] Executing client-side resilience pipeline:', err.message);
      runClientSide();
      return;
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6 pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
          INTERACTIVE SIMULATION LAB
        </span>
        <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight mt-1">
          AI Privacy Firewall & Threat Playground
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Simulate employee prompts, adversarial jailbreak payloads, and PII leaks against the AegisAI Gateway.
        </p>
      </div>

      {error && (
        <div className="p-4 rounded-2xl bg-rose-950/40 border border-rose-500/40 text-xs text-rose-300 flex items-center gap-2">
          <AlertCircle className="w-4 h-4 text-rose-400 shrink-0" />
          <span>{error}</span>
        </div>
      )}

      {/* 1-Click Preset Attack Buttons */}
      <PresetButtons
        disabled={isLoading}
        onSelectPreset={(presetText) => {
          setPrompt(presetText);
          setResult(null);
        }}
      />

      {/* Split-Screen Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
        {/* Left Panel: Prompt Sandbox */}
        <div className="space-y-4">
          <PromptEditor
            prompt={prompt}
            onChange={(val) => setPrompt(val)}
            onSubmit={handleInspect}
            isLoading={isLoading}
            activePolicy={activePolicy}
            onPolicyChange={handlePolicyChange}
          />
        </div>

        {/* Right Panel: Live Inspection X-Ray */}
        <div className="space-y-4">
          <InspectionXRay result={result} isLoading={isLoading} />
        </div>
      </div>
    </div>
  );
};
