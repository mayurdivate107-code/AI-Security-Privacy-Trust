import React from 'react';

interface TrustGaugeProps {
  score: number;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
}

export const TrustGauge: React.FC<TrustGaugeProps> = ({ score, size = 'md', showLabel = true }) => {
  const normalized = Math.max(0, Math.min(100, Math.round(score)));

  // Gauge colors based on score tiers
  let strokeColor = '#10B981'; // Emerald
  let tierLabel = 'Enterprise Safe';
  let badgeColor = 'text-emerald-400 bg-emerald-950/60 border-emerald-500/30';

  if (normalized < 40) {
    strokeColor = '#F43F5E'; // Rose
    tierLabel = 'Critical Threat';
    badgeColor = 'text-rose-400 bg-rose-950/60 border-rose-500/30';
  } else if (normalized < 70) {
    strokeColor = '#F59E0B'; // Amber
    tierLabel = 'Elevated Risk';
    badgeColor = 'text-amber-400 bg-amber-950/60 border-amber-500/30';
  } else if (normalized < 85) {
    strokeColor = '#06B6D4'; // Cyan
    tierLabel = 'Compliant / Filtered';
    badgeColor = 'text-cyan-400 bg-cyan-950/60 border-cyan-500/30';
  }

  const dimensions = {
    sm: { width: 64, stroke: 5, fontSize: 'text-sm' },
    md: { width: 96, stroke: 7, fontSize: 'text-xl' },
    lg: { width: 130, stroke: 9, fontSize: 'text-3xl' },
  }[size];

  const radius = (dimensions.width - dimensions.stroke * 2) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (normalized / 100) * circumference;

  return (
    <div className="flex flex-col items-center justify-center">
      <div className="relative flex items-center justify-center" style={{ width: dimensions.width, height: dimensions.width }}>
        <svg className="w-full h-full -rotate-90 transform">
          {/* Background Track */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke="#1E293B"
            strokeWidth={dimensions.stroke}
            fill="transparent"
          />
          {/* Active Meter */}
          <circle
            cx={dimensions.width / 2}
            cy={dimensions.width / 2}
            r={radius}
            stroke={strokeColor}
            strokeWidth={dimensions.stroke}
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            fill="transparent"
            className="transition-all duration-700 ease-out"
          />
        </svg>

        <div className="absolute flex flex-col items-center justify-center">
          <span className={`font-mono font-bold text-white ${dimensions.fontSize}`}>
            {normalized}
          </span>
          {size !== 'sm' && <span className="text-[10px] text-slate-400 font-mono">/100</span>}
        </div>
      </div>

      {showLabel && (
        <span className={`mt-2 px-2.5 py-0.5 rounded-full text-[11px] font-semibold tracking-wide border ${badgeColor}`}>
          {tierLabel}
        </span>
      )}
    </div>
  );
};
