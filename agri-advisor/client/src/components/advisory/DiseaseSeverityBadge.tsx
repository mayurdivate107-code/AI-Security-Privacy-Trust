import React from 'react';

export const DiseaseSeverityBadge: React.FC<{ severity: string }> = ({ severity }) => {
  const styles: Record<string, string> = {
    low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
    moderate: 'bg-amber-100 text-amber-800 border-amber-200',
    high: 'bg-red-100 text-red-800 border-red-200',
    unknown: 'bg-slate-100 text-slate-800 border-slate-200',
  };

  const level = severity.toLowerCase();
  const appliedStyle = styles[level] || styles.unknown;

  return (
    <span
      className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold border uppercase tracking-wider ${appliedStyle}`}
    >
      Severity: {severity}
    </span>
  );
};
