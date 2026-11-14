import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext.js';
import {
  Shield,
  Lock,
  Cpu,
  BarChart3,
  ArrowRight,
  Zap,
  CheckCircle,
  FileCheck2,
  Terminal,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  const { demoLogin } = useAuth();

  return (
    <div className="space-y-24 pb-20">
      {/* Hero Section */}
      <section className="relative px-4 pt-16 pb-20 sm:pt-24 text-center max-w-5xl mx-auto space-y-6">
        {/* Glow backdrop */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none -z-10"></div>

        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-emerald-950/80 border border-emerald-500/40 text-emerald-300 text-xs font-mono font-bold tracking-wide">
          <Shield className="w-3.5 h-3.5 text-emerald-400" />
          <span>HACKATHON CHALLENGE: AI SECURITY, PRIVACY & TRUST</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-black tracking-tight text-white font-mono leading-[1.15]">
          Autonomous AI Privacy Firewall &{' '}
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-teal-300 to-cyan-400">
            Threat Auditor
          </span>
        </h1>

        <p className="max-w-2xl mx-auto text-sm sm:text-base text-slate-400 leading-relaxed font-sans">
          Eliminate corporate <span className="text-slate-200 font-semibold">"Shadow AI"</span> data leaks.
          AegisAI automatically sanitizes Aadhaar, PAN, and credentials before transit, blocks adversarial prompt injections using
          Google Gemini 2.5 Flash, and generates real-time explainable DPDP Act 2023 Trust Cards.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-wrap items-center justify-center gap-3 pt-4">
          <Link
            to="/playground"
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-lg shadow-emerald-950/60 transition-all"
          >
            Launch Firewall Playground
            <ArrowRight className="w-4 h-4" />
          </Link>

          <button
            onClick={demoLogin}
            className="flex items-center gap-2 px-6 py-3 rounded-xl text-xs font-mono font-bold text-emerald-300 bg-slate-900 hover:bg-slate-800 border border-emerald-500/40 transition-all shadow-sm"
          >
            <Zap className="w-4 h-4 text-emerald-400 fill-emerald-400" />
            1-Click Judge Demo Login
          </button>
        </div>

        {/* Live Attack Prevention Metrics Banner */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-12 text-left">
          <div className="p-4 rounded-xl cyber-card border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Redaction Latency</span>
            <span className="text-lg font-mono font-bold text-white">&lt; 15 ms</span>
            <span className="text-[10px] text-emerald-400 block mt-1">Regex Pre-Scanner</span>
          </div>

          <div className="p-4 rounded-xl cyber-card border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">AI Threat Model</span>
            <span className="text-lg font-mono font-bold text-cyan-400">Gemini 2.5 Flash</span>
            <span className="text-[10px] text-slate-400 block mt-1">Structured JSON Mode</span>
          </div>

          <div className="p-4 rounded-xl cyber-card border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">National ID Shield</span>
            <span className="text-lg font-mono font-bold text-amber-400">PAN & Aadhaar</span>
            <span className="text-[10px] text-slate-400 block mt-1">DPDP 2023 Compliant</span>
          </div>

          <div className="p-4 rounded-xl cyber-card border border-slate-800">
            <span className="text-[11px] font-mono text-slate-500 uppercase block">Data Retention</span>
            <span className="text-lg font-mono font-bold text-rose-400">Zero Raw Secrets</span>
            <span className="text-[10px] text-slate-400 block mt-1">SHA-256 Hash Ledger</span>
          </div>
        </div>
      </section>

      {/* 4-Stage Architectural Pipeline */}
      <section className="max-w-6xl mx-auto px-4 space-y-10">
        <div className="text-center space-y-2">
          <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
            ENTERPRISE ZERO-TRUST ARCHITECTURE
          </span>
          <h2 className="text-2xl sm:text-3xl font-mono font-bold text-white">
            How AegisAI Protects Corporate LLM Transits
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          <div className="p-6 rounded-2xl cyber-card border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-amber-950/60 border border-amber-500/40 flex items-center justify-center text-amber-400 font-mono font-bold text-sm">
              01
            </div>
            <h3 className="text-sm font-mono font-bold text-white">PII & Secret Redactor</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              High-speed heuristic engine scans input prompts for Indian PAN, Aadhaar, credit cards, emails, and cloud API keys, substituting them with synthetic tokens.
            </p>
          </div>

          <div className="p-6 rounded-2xl cyber-card border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-rose-950/60 border border-rose-500/40 flex items-center justify-center text-rose-400 font-mono font-bold text-sm">
              02
            </div>
            <h3 className="text-sm font-mono font-bold text-white">Adversarial Classifier</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Detects "DAN" jailbreaks, developer mode bypasses, hidden instruction extractions, and malicious base64 obfuscations before forwarding.
            </p>
          </div>

          <div className="p-6 rounded-2xl cyber-card border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-cyan-950/60 border border-cyan-500/40 flex items-center justify-center text-cyan-400 font-mono font-bold text-sm">
              03
            </div>
            <h3 className="text-sm font-mono font-bold text-white">Gemini Trust Card</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Gemini 2.5 Flash calculates a 0–100 Trust Score with explainable audit reasoning and flags compliance notes under DPDP 2023 and GDPR Article 5.
            </p>
          </div>

          <div className="p-6 rounded-2xl cyber-card border border-slate-800 space-y-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-950/60 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
              04
            </div>
            <h3 className="text-sm font-mono font-bold text-white">Audited Inference</h3>
            <p className="text-xs text-slate-400 leading-relaxed font-sans">
              Only vetted, sanitized prompts reach the LLM. Every event is hashed with SHA-256 and recorded in an immutable MongoDB analytics ledger.
            </p>
          </div>
        </div>
      </section>

      {/* Feature Showcase Grid */}
      <section className="max-w-6xl mx-auto px-4 space-y-6">
        <div className="p-8 sm:p-12 rounded-3xl cyber-card border border-slate-800 flex flex-col md:flex-row items-center justify-between gap-8">
          <div className="space-y-4 max-w-xl">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-950/60 border border-cyan-500/40 text-cyan-400 text-xs font-mono">
              <Terminal className="w-3.5 h-3.5" />
              Live Interactive Playground
            </div>
            <h3 className="text-2xl sm:text-3xl font-mono font-bold text-white">
              Test Attack Vectors with One-Click Presets
            </h3>
            <p className="text-xs sm:text-sm text-slate-400 leading-relaxed font-sans">
              Hackathon judges can instantly stress-test the firewall using our pre-built attack suite: simulated PAN card and AWS key exfiltration, adversarial system prompt extraction jailbreaks, and verified safe enterprise legal queries.
            </p>
            <div className="flex items-center gap-3 pt-2">
              <Link
                to="/playground"
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-mono font-bold text-white bg-emerald-600 hover:bg-emerald-500 transition"
              >
                Open Sandbox
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>
          </div>

          <div className="w-full md:w-auto p-5 rounded-2xl bg-[#030712] border border-slate-800 font-mono text-xs text-slate-300 space-y-2 max-w-md">
            <div className="flex items-center justify-between text-[11px] text-slate-500 border-b border-slate-800 pb-2">
              <span>SECURITY_GATEWAY_TERMINAL</span>
              <span className="text-emerald-400">● 200 OK</span>
            </div>
            <p className="text-amber-300">$ aegis-scan --input "PAN: ABCDE1234F"</p>
            <p className="text-slate-400">&gt; Masking: [REDACTED_PAN]</p>
            <p className="text-slate-400">&gt; DPDP Act 2023: Verified</p>
            <p className="text-emerald-400">&gt; Trust Score: 88/100 (Safe)</p>
          </div>
        </div>
      </section>
    </div>
  );
};
