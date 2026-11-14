import React, { useState, useEffect } from 'react';
import { api } from '../lib/api.js';
import { PolicyConfig, ComplianceFramework } from '../types/index.js';
import {
  Shield,
  Lock,
  Scale,
  Sliders,
  CheckCircle2,
  AlertTriangle,
  Plus,
  Trash2,
  Save,
} from 'lucide-react';

export const PoliciesPage: React.FC = () => {
  const [policy, setPolicy] = useState<PolicyConfig>({
    blockPromptInjection: true,
    autoRedactPII: true,
    minimumTrustScore: 70,
    complianceMode: 'DPDP_INDIA',
    customBlockedKeywords: ['internal credentials', 'confidential blueprint', 'passwords.txt'],
  });

  const [newKeyword, setNewKeyword] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  useEffect(() => {
    const fetchPolicy = async () => {
      try {
        setLoading(true);
        const res: any = await api.get('/policy');
        if (res.success && res.policy) {
          setPolicy(res.policy);
        }
      } catch (err) {
        console.warn('Could not load policy settings from server, using defaults.');
      } finally {
        setLoading(false);
      }
    };
    fetchPolicy();
  }, []);

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      const res: any = await api.put('/policy', policy);
      if (res.success) {
        setMessage({ type: 'success', text: 'Security policies updated and active on gateway!' });
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || 'Failed to update security policies.' });
    } finally {
      setSaving(false);
    }
  };

  const addKeyword = () => {
    if (!newKeyword.trim()) return;
    const word = newKeyword.trim().toLowerCase();
    const current = policy.customBlockedKeywords || [];
    if (!current.includes(word)) {
      setPolicy({
        ...policy,
        customBlockedKeywords: [...current, word],
      });
    }
    setNewKeyword('');
  };

  const removeKeyword = (wordToRemove: string) => {
    setPolicy({
      ...policy,
      customBlockedKeywords: (policy.customBlockedKeywords || []).filter((w) => w !== wordToRemove),
    });
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-emerald-400 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-16">
      {/* Header */}
      <div className="pb-2 border-b border-slate-800">
        <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
          GOVERNANCE POSTURE
        </span>
        <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight mt-1">
          Enterprise AI Firewall Policies
        </h1>
        <p className="text-xs text-slate-400 font-sans mt-0.5">
          Tune regulatory thresholds, automatic redaction behavior, and adversarial guardrail sensitivity
        </p>
      </div>

      {message && (
        <div
          className={`p-4 rounded-2xl text-xs flex items-center gap-2 border font-mono ${
            message.type === 'success'
              ? 'bg-emerald-950/40 text-emerald-300 border-emerald-500/40'
              : 'bg-rose-950/40 text-rose-300 border-rose-500/40'
          }`}
        >
          {message.type === 'success' ? (
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          ) : (
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          )}
          <span>{message.text}</span>
        </div>
      )}

      {/* Main Settings Panel */}
      <div className="cyber-card rounded-2xl border border-slate-800 p-6 sm:p-8 space-y-8">
        {/* Toggle 1: PII Redaction */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Lock className="w-4 h-4 text-amber-400" />
              <h3 className="text-sm font-mono font-bold text-white">
                Autonomous PII & Secret Redaction
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl font-sans">
              Automatically identify and mask Indian PAN numbers, Aadhaar IDs, credit card numbers, email addresses, and cloud API keys with privacy placeholders before forwarding prompts to the LLM.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={policy.autoRedactPII}
              onChange={(e) => setPolicy({ ...policy, autoRedactPII: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-emerald-500"></div>
          </label>
        </div>

        {/* Toggle 2: Strict Injection Shield */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-800">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-rose-400" />
              <h3 className="text-sm font-mono font-bold text-white">
                Adversarial Jailbreak & Injection Shield
              </h3>
            </div>
            <p className="text-xs text-slate-400 max-w-xl font-sans">
              Intercept and immediately block any prompt that matches direct or indirect system prompt extraction, "DAN" mode bypasses, SQL injection commands, or base64 obfuscation attacks.
            </p>
          </div>

          <label className="relative inline-flex items-center cursor-pointer shrink-0">
            <input
              type="checkbox"
              checked={policy.blockPromptInjection}
              onChange={(e) => setPolicy({ ...policy, blockPromptInjection: e.target.checked })}
              className="sr-only peer"
            />
            <div className="w-12 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-rose-500"></div>
          </label>
        </div>

        {/* Slider: Minimum Trust Score Threshold */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Scale className="w-4 h-4 text-cyan-400" />
              <h3 className="text-sm font-mono font-bold text-white">
                Minimum Trust Score Threshold
              </h3>
            </div>
            <span className="font-mono text-sm font-bold text-emerald-400 bg-emerald-950/60 px-2.5 py-1 rounded-lg border border-emerald-500/30">
              {policy.minimumTrustScore} / 100
            </span>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Prompts receiving a Trust Score below this threshold from the Gemini AI Auditor are blocked automatically. Default enterprise standard: 70.
          </p>
          <input
            type="range"
            min={0}
            max={100}
            step={5}
            value={policy.minimumTrustScore}
            onChange={(e) => setPolicy({ ...policy, minimumTrustScore: Number(e.target.value) })}
            className="w-full h-2 bg-slate-800 rounded-lg appearance-none cursor-pointer accent-emerald-500"
          />
          <div className="flex justify-between text-[10px] font-mono text-slate-500">
            <span>0 (Permissive)</span>
            <span>50 (Moderate)</span>
            <span>70 (Recommended)</span>
            <span>90 (Strict)</span>
          </div>
        </div>

        {/* Selector: Compliance Framework */}
        <div className="space-y-3 pb-6 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <Sliders className="w-4 h-4 text-emerald-400" />
            <h3 className="text-sm font-mono font-bold text-white">
              Primary Regulatory Compliance Framework
            </h3>
          </div>
          <p className="text-xs text-slate-400 font-sans">
            Configures the AI Auditor's legal inspection rules and compliance notice tags.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            {[
              {
                id: 'DPDP_INDIA',
                title: 'DPDP Act 2023 (India)',
                desc: 'Sections 6 & 8: Mandatory data minimization and national identifier protections.',
              },
              {
                id: 'GDPR',
                title: 'EU GDPR',
                desc: 'Articles 5 & 32: Purpose limitation, pseudonymization, and automated decision audits.',
              },
              {
                id: 'HIPAA',
                title: 'US HIPAA',
                desc: 'PHI safeguard rules for healthcare records and patient identifier masking.',
              },
            ].map((fw) => (
              <button
                key={fw.id}
                type="button"
                onClick={() => setPolicy({ ...policy, complianceMode: fw.id as ComplianceFramework })}
                className={`p-4 rounded-xl text-left border transition-all ${
                  policy.complianceMode === fw.id
                    ? 'bg-slate-800/90 border-emerald-500/60 shadow-md shadow-emerald-950/40'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-center justify-between mb-1">
                  <span className="font-mono text-xs font-bold text-white">{fw.title}</span>
                  {policy.complianceMode === fw.id && (
                    <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
                  )}
                </div>
                <p className="text-[11px] text-slate-400 leading-relaxed font-sans">{fw.desc}</p>
              </button>
            ))}
          </div>
        </div>

        {/* Custom Blocked Keywords */}
        <div className="space-y-3">
          <h3 className="text-sm font-mono font-bold text-white">
            Custom Restricted Enterprise Keywords
          </h3>
          <p className="text-xs text-slate-400 font-sans">
            Add confidential project code names or terms that should be blocked if detected.
          </p>

          <div className="flex gap-2">
            <input
              type="text"
              value={newKeyword}
              onChange={(e) => setNewKeyword(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addKeyword())}
              placeholder="e.g. project-titan, q4-unreleased-patent"
              className="flex-1 px-4 py-2 bg-[#030712] border border-slate-800 rounded-xl text-xs text-white placeholder:text-slate-600 focus:outline-none focus:border-emerald-500/60 font-mono"
            />
            <button
              type="button"
              onClick={addKeyword}
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-mono font-bold flex items-center gap-1.5 transition"
            >
              <Plus className="w-3.5 h-3.5 text-emerald-400" />
              Add
            </button>
          </div>

          <div className="flex flex-wrap gap-2 pt-2">
            {(policy.customBlockedKeywords || []).map((word) => (
              <span
                key={word}
                className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl text-xs font-mono bg-slate-900 border border-slate-800 text-slate-300"
              >
                <span>{word}</span>
                <button
                  type="button"
                  onClick={() => removeKeyword(word)}
                  className="text-slate-500 hover:text-rose-400 transition"
                >
                  <Trash2 className="w-3 h-3" />
                </button>
              </span>
            ))}
          </div>
        </div>

        {/* Save Button */}
        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="button"
            onClick={handleSave}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 transition shadow-lg shadow-emerald-950/50 disabled:opacity-50"
          >
            <Save className="w-4 h-4" />
            {saving ? 'Updating Policies...' : 'Save & Enforce Policies'}
          </button>
        </div>
      </div>
    </div>
  );
};
