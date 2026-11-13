import React from 'react';
import { FlaskConical, Leaf } from 'lucide-react';
import { ConfidenceIndicator } from './ConfidenceIndicator.js';
import { AdvisoryDisclaimer } from './AdvisoryDisclaimer.js';

interface FertilizerRecommendationCardProps {
  data: {
    summary: string;
    nutrient_status: { nutrient: string; status: string; explanation: string }[];
    recommendations: {
      fertilizer_type: string;
      purpose: string;
      application_method: string;
      timing: string;
      dosage_guidance: string;
      precautions?: string[];
    }[];
    organic_alternatives?: string[];
    soil_improvement_tips?: string[];
    confidence: number;
  };
}

export const FertilizerRecommendationCard: React.FC<FertilizerRecommendationCardProps> = ({
  data,
}) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'low':
        return 'text-red-700 bg-red-50 border-red-200';
      case 'adequate':
        return 'text-emerald-700 bg-emerald-50 border-emerald-200';
      case 'high':
        return 'text-amber-700 bg-amber-50 border-amber-200';
      default:
        return 'text-slate-700 bg-slate-50 border-slate-200';
    }
  };

  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <FlaskConical className="w-4 h-4 text-emerald-600" />
            <span>Nutrient Management Regimen</span>
          </div>
          <h2 className="text-xl font-bold text-slate-900">Custom Crop Nutrition Plan</h2>
        </div>
        <ConfidenceIndicator confidence={data.confidence} />
      </div>

      <p className="text-xs text-slate-700 leading-relaxed bg-slate-50 p-4 rounded-2xl border border-slate-100">
        {data.summary}
      </p>

      {/* Primary N-P-K Nutrient Status */}
      <div className="space-y-3">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Soil Nutrient Balance Evaluation
        </h3>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {data.nutrient_status.map((item, idx) => (
            <div
              key={idx}
              className={`p-4 rounded-2xl border text-xs space-y-1.5 ${getStatusColor(item.status)}`}
            >
              <div className="flex items-center justify-between">
                <span className="font-bold text-sm">{item.nutrient}</span>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-white/70">
                  {item.status}
                </span>
              </div>
              <p className="text-[11px] leading-relaxed opacity-90">{item.explanation}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Scheduled Fertilizer Dosing */}
      <div className="space-y-3 pt-2">
        <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900">
          Precision Fertilizer Dosing Schedule
        </h3>
        <div className="space-y-3">
          {data.recommendations.map((rec, idx) => (
            <div
              key={idx}
              className="p-5 bg-white border border-slate-200 rounded-2xl shadow-sm text-xs space-y-2 hover:border-emerald-300 transition"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h4 className="font-bold text-sm text-slate-900">{rec.fertilizer_type}</h4>
                  <p className="text-slate-500 mt-0.5">{rec.purpose}</p>
                </div>
                <span className="px-3 py-1 bg-emerald-50 text-emerald-800 font-bold rounded-lg text-xs">
                  {rec.dosage_guidance}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-2 text-[11px] text-slate-600 border-t border-slate-100">
                <div>
                  <span className="font-semibold text-slate-800">Timing:</span> {rec.timing}
                </div>
                <div>
                  <span className="font-semibold text-slate-800">Method:</span>{' '}
                  {rec.application_method}
                </div>
              </div>

              {rec.precautions && rec.precautions.length > 0 && (
                <div className="pt-2 text-[11px] text-amber-800 space-y-1">
                  <span className="font-semibold block">Handling Precautions:</span>
                  <ul className="list-disc list-inside space-y-0.5">
                    {rec.precautions.map((p, pIdx) => (
                      <li key={pIdx}>{p}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Organic Alternatives */}
      {data.organic_alternatives && data.organic_alternatives.length > 0 && (
        <div className="p-5 bg-emerald-50/60 border border-emerald-100 rounded-2xl text-xs space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-emerald-900 flex items-center">
            <Leaf className="w-4 h-4 mr-2 text-emerald-600" />
            Biological & Organic Fertilizer Alternatives
          </h4>
          <ul className="text-emerald-800 space-y-1 list-disc list-inside">
            {data.organic_alternatives.map((org, idx) => (
              <li key={idx}>{org}</li>
            ))}
          </ul>
        </div>
      )}

      <AdvisoryDisclaimer />
    </div>
  );
};
