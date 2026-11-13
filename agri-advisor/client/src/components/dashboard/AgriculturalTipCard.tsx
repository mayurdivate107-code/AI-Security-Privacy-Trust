import React from 'react';
import { Lightbulb } from 'lucide-react';

const tips = [
  'Neem Cake application (100 kg/acre) during basal ploughing suppresses soil-borne root-knot nematodes while retarding nitrogen leaching.',
  'Installing 5 pheromone traps per acre detects initial adult moth flights 10 days before visible larval damage occurs in maize and cotton.',
  'Spraying 1% Potassium Nitrate (KNO3) during dry spells reduces transpirational water loss and reinforces leaf turgor pressure.',
  'Trichoderma viride seed coating (4g/kg seed) prevents Rhizoctonia and Pythium damping-off in seedling nurseries.',
  'Avoid nitrogen top-dressing during continuous drizzling or overcast skies; succulent foliage attracts fungal blast and sucking aphids.',
];

export const AgriculturalTipCard: React.FC = () => {
  // Pick deterministic tip based on day of month
  const tipIndex = new Date().getDate() % tips.length;
  const currentTip = tips[tipIndex];

  return (
    <div className="p-5 bg-gradient-to-r from-emerald-50 to-teal-50 border border-emerald-100 rounded-2xl flex items-start space-x-3.5">
      <div className="p-2.5 bg-emerald-100 text-emerald-800 rounded-xl shrink-0">
        <Lightbulb className="w-5 h-5" />
      </div>
      <div className="space-y-1 text-xs">
        <h4 className="font-bold text-emerald-950 uppercase tracking-wider text-[11px]">
          Agronomist Field Tip of the Day
        </h4>
        <p className="text-emerald-900 leading-relaxed">{currentTip}</p>
      </div>
    </div>
  );
};
