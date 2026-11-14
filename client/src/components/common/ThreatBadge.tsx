import React from 'react';
import { ThreatLevel } from '../../types/index.js';
import { ShieldCheck, AlertTriangle, ShieldAlert, Skull } from 'lucide-react';

interface ThreatBadgeProps {
  level: ThreatLevel;
  className?: string;
}

export const ThreatBadge: React.FC<ThreatBadgeProps> = ({ level, className = '' }) => {
  switch (level) {
    case 'CRITICAL':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/40 ${className}`}
        >
          <Skull className="w-3.5 h-3.5 text-rose-400" />
          Critical Threat
        </span>
      );
    case 'HIGH':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/40 ${className}`}
        >
          <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
          High Risk
        </span>
      );
    case 'MEDIUM':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-yellow-950/80 text-yellow-300 border border-yellow-500/40 ${className}`}
        >
          <AlertTriangle className="w-3.5 h-3.5 text-yellow-400" />
          Medium Risk
        </span>
      );
    case 'LOW':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/40 ${className}`}
        >
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          Low / Safe
        </span>
      );
  }
};
