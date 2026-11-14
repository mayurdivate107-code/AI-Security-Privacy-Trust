import React from 'react';
import { ActionTaken } from '../../types/index.js';
import { CheckCircle2, ShieldOff, EyeOff } from 'lucide-react';

interface ActionBadgeProps {
  action: ActionTaken;
  className?: string;
}

export const ActionBadge: React.FC<ActionBadgeProps> = ({ action, className = '' }) => {
  switch (action) {
    case 'BLOCKED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-rose-950/80 text-rose-300 border border-rose-500/50 ${className}`}
        >
          <ShieldOff className="w-3.5 h-3.5 text-rose-400" />
          Blocked
        </span>
      );
    case 'REDACTED_AND_ALLOWED':
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-amber-950/80 text-amber-300 border border-amber-500/50 ${className}`}
        >
          <EyeOff className="w-3.5 h-3.5 text-amber-400" />
          Redacted & Allowed
        </span>
      );
    case 'ALLOWED':
    default:
      return (
        <span
          className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider bg-emerald-950/80 text-emerald-300 border border-emerald-500/50 ${className}`}
        >
          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
          Allowed
        </span>
      );
  }
};
