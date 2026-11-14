import React from 'react';
import { ShieldCheck, Lock, Award, Heart } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="w-full border-t border-slate-900 bg-[#030712] py-8 text-xs text-slate-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" />
          <span className="font-mono text-slate-400">AegisAI Enterprise AI Security Gateway</span>
          <span className="text-slate-600">|</span>
          <span>Zero Data Retention Architecture</span>
        </div>

        <div className="flex flex-wrap items-center gap-4 text-slate-400">
          <span className="flex items-center gap-1">
            <Lock className="w-3.5 h-3.5 text-cyan-400" /> DPDP Act 2023 Compliant
          </span>
          <span className="flex items-center gap-1">
            <Award className="w-3.5 h-3.5 text-amber-400" /> OWASP LLM Top 10 Guardrails
          </span>
          <span className="flex items-center gap-1">
            <Heart className="w-3.5 h-3.5 text-rose-400" /> Hackathon Edition 2026
          </span>
        </div>
      </div>
    </footer>
  );
};
