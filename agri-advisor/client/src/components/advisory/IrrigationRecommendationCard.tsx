import React from 'react';
import { Droplets, ShieldAlert, Sparkles, Waves } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator.js';
import { AdvisoryDisclaimer } from './AdvisoryDisclaimer.js';

interface IrrigationRecommendationCardProps {
  data: {
    summary: string;
    irrigation_status: string;
    recommended_method: string;
    watering_frequency: string;
    water_management_tips?: string[];
    growth_stage_considerations?: string[];
    overwatering_risks?: string[];
    underwatering_risks?: string[];
    water_conservation_tips?: string[];
    weather_data_used?: boolean;
    confidence: number;
  };
}

export const IrrigationRecommendationCard: React.FC<IrrigationRecommendationCardProps> = ({
  data,
}) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-sky-800 uppercase tracking-wider mb-1">
            <Droplets className="w-4 h-4 text-sky-600" />
            <span>Water Optimization Schedule</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Precision Irrigation Advisory</h2>
        </div>
        <ConfidenceIndicator confidence={data.confidence} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="p-4 bg-sky-50/70 border border-sky-100 rounded-2xl text-xs space-y-1">
          <span className="font-semibold text-sky-950 uppercase tracking-wider text-[11px]">
            Recommended Technique:
          </span>
          <p className="font-bold text-sm text-sky-900">{data.recommended_method}</p>
        </div>
        <div className="p-4 bg-emerald-50/70 border border-emerald-100 rounded-2xl text-xs space-y-1">
          <span className="font-semibold text-emerald-950 uppercase tracking-wider text-[11px]">
            Target Frequency:
          </span>
          <p className="font-bold text-sm text-emerald-900">{data.watering_frequency}</p>
        </div>
      </div>

      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {data.summary}
      </p>

      {/* Water Management Protocols */}
      {data.water_management_tips && data.water_management_tips.length > 0 && (
        <div className="space-y-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
            <Waves className="w-4 h-4 mr-1.5 text-sky-600" />
            Field Water Management Protocol
          </h4>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
            {data.water_management_tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Risks of Over / Under Watering */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
        {data.overwatering_risks && data.overwatering_risks.length > 0 && (
          <div className="p-4 bg-amber-50/50 border border-amber-200 rounded-2xl text-xs space-y-1.5">
            <h5 className="font-bold text-amber-900 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-amber-600" />
              Overwatering Hazards
            </h5>
            <ul className="text-amber-800 list-disc list-inside space-y-1 text-[11px]">
              {data.overwatering_risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        )}

        {data.underwatering_risks && data.underwatering_risks.length > 0 && (
          <div className="p-4 bg-red-50/50 border border-red-200 rounded-2xl text-xs space-y-1.5">
            <h5 className="font-bold text-red-900 flex items-center">
              <ShieldAlert className="w-3.5 h-3.5 mr-1 text-red-600" />
              Drought Stress Hazards
            </h5>
            <ul className="text-red-800 list-disc list-inside space-y-1 text-[11px]">
              {data.underwatering_risks.map((risk, idx) => (
                <li key={idx}>{risk}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <AdvisoryDisclaimer />
    </div>
  );
};
