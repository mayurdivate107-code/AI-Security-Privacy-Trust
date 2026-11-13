import React from 'react';

export const CropSuitabilityScore: React.FC<{ score: number }> = ({ score }) => {
  const getBadgeColor = (s: number) => {
    if (s >= 85) return 'text-emerald-700 bg-emerald-100 border-emerald-300';
    if (s >= 70) return 'text-amber-700 bg-amber-100 border-amber-300';
    return 'text-slate-700 bg-slate-100 border-slate-300';
  };

  return (
    <div
      className={`inline-flex items-center px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(
        score
      )}`}
    >
      <span>Suitability: {score}%</span>
    </div>
  );
};
