import React from 'react';
import { Sprout, Calendar, Droplets, ShieldAlert, CheckCircle2 } from 'lucide-react';
import { CropSuitabilityScore } from './CropSuitabilityScore.js';

interface CropRecommendationCardProps {
  crop: {
    crop_name: string;
    scientific_name?: string;
    suitability_score: number;
    reason: string;
    soil_compatibility: string;
    climate_compatibility: string;
    water_requirements: string;
    growing_duration_days?: number | null;
    suitable_seasons?: string[];
    cultivation_tips?: string[];
    potential_risks?: string[];
  };
}

export const CropRecommendationCard: React.FC<CropRecommendationCardProps> = ({ crop }) => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm space-y-4 hover:border-emerald-300 transition">
      <div className="flex flex-wrap items-start justify-between gap-3 border-b border-slate-100 pb-4">
        <div>
          <div className="flex items-center space-x-2">
            <Sprout className="w-5 h-5 text-agri-primary" />
            <h3 className="text-lg font-bold text-slate-900">{crop.crop_name}</h3>
          </div>
          {crop.scientific_name && (
            <p className="text-xs italic text-slate-500 mt-0.5">{crop.scientific_name}</p>
          )}
        </div>
        <CropSuitabilityScore score={crop.suitability_score} />
      </div>

      <p className="text-xs text-slate-700 leading-relaxed">{crop.reason}</p>

      {/* Grid of Key Agronomic Factors */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs bg-slate-50 p-4 rounded-xl">
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Soil Fit:</span>
          <p className="text-slate-600">{crop.soil_compatibility}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-900 block mb-1">Climate Fit:</span>
          <p className="text-slate-600">{crop.climate_compatibility}</p>
        </div>
        <div>
          <span className="font-semibold text-slate-900 block mb-1 flex items-center">
            <Droplets className="w-3.5 h-3.5 mr-1 text-sky-500" />
            Water Need:
          </span>
          <p className="text-slate-600">{crop.water_requirements}</p>
        </div>
      </div>

      {crop.growing_duration_days && (
        <div className="flex items-center text-xs text-slate-600 space-x-2">
          <Calendar className="w-4 h-4 text-emerald-600" />
          <span>
            Expected Duration: <strong className="text-slate-900">{crop.growing_duration_days} days</strong>
          </span>
        </div>
      )}

      {/* Cultivation Tips */}
      {crop.cultivation_tips && crop.cultivation_tips.length > 0 && (
        <div className="space-y-1.5 pt-2">
          <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900 flex items-center">
            <CheckCircle2 className="w-3.5 h-3.5 mr-1.5 text-emerald-600" />
            Key Cultivation Tips
          </h4>
          <ul className="text-xs text-slate-600 list-disc list-inside space-y-1 pl-1">
            {crop.cultivation_tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      {/* Potential Risks */}
      {crop.potential_risks && crop.potential_risks.length > 0 && (
        <div className="space-y-1.5 pt-2 border-t border-slate-100">
          <h4 className="text-xs font-bold uppercase tracking-wider text-amber-900 flex items-center">
            <ShieldAlert className="w-3.5 h-3.5 mr-1.5 text-amber-600" />
            Field Risk Factors
          </h4>
          <ul className="text-xs text-amber-800 list-disc list-inside space-y-1 pl-1">
            {crop.potential_risks.map((risk, idx) => (
              <li key={idx}>{risk}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};
