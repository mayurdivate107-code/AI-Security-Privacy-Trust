import React from 'react';
import { AlertTriangle } from 'lucide-react';

export const AdvisoryDisclaimer: React.FC<{ text?: string }> = ({
  text = 'All recommendations are AI-assisted decision-support estimates. Field verification by a local certified agronomist or Krishi Vigyan Kendra (KVK) is recommended before significant chemical or financial commitments.',
}) => {
  return (
    <div className="flex items-start p-4 bg-amber-50/70 border border-amber-200/80 rounded-2xl text-amber-900 text-xs">
      <AlertTriangle className="w-4 h-4 text-amber-600 mr-3 shrink-0 mt-0.5" />
      <p className="leading-relaxed">{text}</p>
    </div>
  );
};
