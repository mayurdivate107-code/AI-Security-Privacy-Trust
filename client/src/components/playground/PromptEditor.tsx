import React from 'react';
import { Shield, Sparkles, X, SlidersHorizontal, Lock } from 'lucide-react';
import { PolicyConfig } from '../../types/index.js';

interface PromptEditorProps {
  prompt: string;
  onChange: (val: string) => void;
  onSubmit: () => void;
  isLoading: boolean;
  activePolicy: PolicyConfig;
  onPolicyChange?: (policy: Partial<PolicyConfig>) => void;
}

export const PromptEditor: React.FC<PromptEditorProps> = ({
  prompt,
  onChange,
  onSubmit,
  isLoading,
  activePolicy,
  onPolicyChange,
}) => {
  return (
    <div className="cyber-card rounded-2xl border border-slate-800 p-5 space-y-4">
      {/* Header with Active Policy Status Pills */}
      <div className="flex flex-wrap items-center justify-between gap-2 pb-3 border-b border-slate-800/80">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-400" />
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-slate-200">
            Prompt Sandbox & Threat Simulator
          </span>
        </div>

        {/* Quick Toggles */}
        <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
          <button
            type="button"
            onClick={() => onPolicyChange?.({ autoRedactPII: !activePolicy.autoRedactPII })}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
              activePolicy.autoRedactPII
                ? 'bg-emerald-950/60 border-emerald-500/40 text-emerald-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Lock className="w-3 h-3" />
            PII Redact: {activePolicy.autoRedactPII ? 'ON' : 'OFF'}
          </button>

          <button
            type="button"
            onClick={() => onPolicyChange?.({ blockPromptInjection: !activePolicy.blockPromptInjection })}
            className={`px-2 py-0.5 rounded border transition-colors flex items-center gap-1 ${
              activePolicy.blockPromptInjection
                ? 'bg-rose-950/60 border-rose-500/40 text-rose-300'
                : 'bg-slate-900 border-slate-800 text-slate-500'
            }`}
          >
            <Shield className="w-3 h-3" />
            Injection Shield: {activePolicy.blockPromptInjection ? 'ACTIVE' : 'OFF'}
          </button>

          <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400 flex items-center gap-1">
            <SlidersHorizontal className="w-3 h-3 text-cyan-400" />
            Min Trust: {activePolicy.minimumTrustScore}
          </span>
        </div>
      </div>

      {/* Textarea Input */}
      <div className="relative">
        <textarea
          rows={6}
          value={prompt}
          onChange={(e) => onChange(e.target.value)}
          placeholder="Enter corporate prompt or simulate an adversarial attack (e.g., paste PAN numbers, AWS API keys, or jailbreak commands)..."
          className="w-full bg-[#030712]/90 border border-slate-800 rounded-xl p-4 text-xs sm:text-sm text-slate-100 placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 focus:ring-1 focus:ring-emerald-500/40 resize-none font-mono leading-relaxed"
        />

        {prompt && (
          <button
            type="button"
            onClick={() => onChange('')}
            className="absolute top-3 right-3 p-1.5 rounded-lg bg-slate-800/80 text-slate-400 hover:text-white transition"
            title="Clear prompt"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Footer Bar: Character Count & Trigger Action */}
      <div className="flex items-center justify-between pt-1">
        <div className="text-[11px] font-mono text-slate-500">
          <span>{prompt.length} chars</span>
          <span className="mx-2">•</span>
          <span>Target: Gemini 2.5 Flash</span>
        </div>

        <button
          type="button"
          onClick={onSubmit}
          disabled={!prompt.trim() || isLoading}
          className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold font-mono tracking-wide text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 disabled:opacity-40 disabled:cursor-not-allowed shadow-lg shadow-emerald-950/50 transition-all"
        >
          {isLoading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
              <span>Auditing Threat Vector...</span>
            </>
          ) : (
            <>
              <Sparkles className="w-4 h-4 text-emerald-200" />
              <span>Forward Through AegisAI Firewall</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
};
