import React from 'react';

export const ConfidenceIndicator: React.FC<{ confidence: number }> = ({ confidence }) => {
  const percentage = Math.round(confidence <= 1 ? confidence * 100 : confidence);

  return (
    <div className="flex items-center space-x-2 text-xs">
      <span className="text-agri-muted">Model Confidence:</span>
      <div className="w-20 bg-slate-200 h-2 rounded-full overflow-hidden">
        <div
          className="bg-agri-primary h-full rounded-full transition-all duration-500"
          style={{ width: `${percentage}%` }}
        />
      </div>
      <span className="font-bold text-agri-text">{percentage}%</span>
    </div>
  );
};
