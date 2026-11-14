import React from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: React.ReactNode;
  trend?: string;
  glowColor?: 'emerald' | 'amber' | 'rose' | 'cyan';
}

export const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  subtitle,
  icon,
  trend,
  glowColor = 'emerald',
}) => {
  const glowBorder = {
    emerald: 'border-emerald-500/20 hover:border-emerald-500/50',
    amber: 'border-amber-500/20 hover:border-amber-500/50',
    rose: 'border-rose-500/20 hover:border-rose-500/50',
    cyan: 'border-cyan-500/20 hover:border-cyan-500/50',
  }[glowColor];

  const iconBg = {
    emerald: 'bg-emerald-950/60 text-emerald-400 border-emerald-500/30',
    amber: 'bg-amber-950/60 text-amber-400 border-amber-500/30',
    rose: 'bg-rose-950/60 text-rose-400 border-rose-500/30',
    cyan: 'bg-cyan-950/60 text-cyan-400 border-cyan-500/30',
  }[glowColor];

  return (
    <div
      className={`cyber-card p-5 rounded-2xl border transition-all duration-300 hover:shadow-xl ${glowBorder}`}
    >
      <div className="flex items-center justify-between">
        <span className="text-xs font-semibold text-slate-400 uppercase tracking-wider">{title}</span>
        <div className={`p-2.5 rounded-xl border ${iconBg}`}>{icon}</div>
      </div>

      <div className="mt-4 flex items-baseline justify-between">
        <span className="text-3xl font-mono font-extrabold text-white tracking-tight">{value}</span>
        {trend && (
          <span className="text-xs font-mono font-semibold text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded-md border border-emerald-500/20">
            {trend}
          </span>
        )}
      </div>

      {subtitle && <p className="mt-1.5 text-xs text-slate-500">{subtitle}</p>}
    </div>
  );
};
