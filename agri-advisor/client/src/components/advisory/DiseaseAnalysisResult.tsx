import React from 'react';
import { ShieldCheck, AlertCircle, Sparkles, CheckCircle, ExternalLink } from 'lucide-react';
import { DiseaseSeverityBadge } from './DiseaseSeverityBadge.js';
import { ConfidenceIndicator } from './ConfidenceIndicator.js';
import { AdvisoryDisclaimer } from './AdvisoryDisclaimer.js';

interface DiseaseAnalysisResultProps {
  data: {
    crop_name: string;
    diagnosis_status: string;
    primary_diagnosis: string;
    possible_alternatives?: string[];
    visible_symptoms?: string[];
    possible_causes?: string[];
    severity: string;
    confidence: number;
    explanation: string;
    recommended_actions?: { action: string; reason: string; priority: string }[];
    prevention_tips?: string[];
    expert_consultation_recommended?: boolean;
    disclaimer: string;
    signed_image_url?: string | null;
  };
}

export const DiseaseAnalysisResult: React.FC<DiseaseAnalysisResultProps> = ({ data }) => {
  return (
    <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
      {/* Header with Title and Severity */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
            <Sparkles className="w-4 h-4 text-emerald-600" />
            <span>Pathology Diagnostic Analysis</span>
          </div>
          <h2 className="text-2xl font-bold text-slate-900">{data.primary_diagnosis}</h2>
          <p className="text-xs text-slate-500 mt-1">Host Plant: {data.crop_name}</p>
        </div>
        <div className="flex flex-col items-start sm:items-end space-y-2">
          <DiseaseSeverityBadge severity={data.severity} />
          <ConfidenceIndicator confidence={data.confidence} />
        </div>
      </div>

      {/* Image Preview if available */}
      {data.signed_image_url && (
        <div className="w-full max-h-80 bg-slate-950 rounded-2xl overflow-hidden flex items-center justify-center p-2 border border-slate-100">
          <img
            src={data.signed_image_url}
            alt="Diagnosed crop foliage"
            className="max-h-72 object-contain rounded-xl"
          />
        </div>
      )}

      {/* Explanation Box */}
      <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl text-xs text-slate-700 leading-relaxed border border-slate-100">
        <h4 className="font-bold text-slate-900 mb-1.5">Clinical Agronomic Assessment:</h4>
        <p>{data.explanation}</p>
      </div>

      {/* Visible Symptoms & Causes */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {data.visible_symptoms && data.visible_symptoms.length > 0 && (
          <div className="p-4 bg-emerald-50/40 border border-emerald-100 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-900">
              Visible Leaf Symptomology
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              {data.visible_symptoms.map((s, idx) => (
                <li key={idx}>{s}</li>
              ))}
            </ul>
          </div>
        )}

        {data.possible_causes && data.possible_causes.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-2">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900">
              Etiological Pre-Conditions
            </h4>
            <ul className="text-xs text-slate-700 space-y-1.5 list-disc list-inside">
              {data.possible_causes.map((c, idx) => (
                <li key={idx}>{c}</li>
              ))}
            </ul>
          </div>
        )}
      </div>

      {/* Recommended Action Checklist */}
      {data.recommended_actions && data.recommended_actions.length > 0 && (
        <div className="space-y-3 pt-2">
          <h3 className="text-sm font-bold text-slate-900 flex items-center">
            <CheckCircle className="w-4 h-4 mr-2 text-agri-primary" />
            Recommended Control Protocols (Immediate Remediation)
          </h3>
          <div className="space-y-2.5">
            {data.recommended_actions.map((act, idx) => (
              <div
                key={idx}
                className="p-4 bg-white border border-slate-200 rounded-xl hover:border-emerald-300 transition text-xs space-y-1"
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-slate-900">{act.action}</span>
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                      act.priority === 'high'
                        ? 'bg-red-100 text-red-700'
                        : act.priority === 'medium'
                        ? 'bg-amber-100 text-amber-700'
                        : 'bg-slate-100 text-slate-700'
                    }`}
                  >
                    {act.priority} Priority
                  </span>
                </div>
                <p className="text-slate-500">{act.reason}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Prevention Guidelines */}
      {data.prevention_tips && data.prevention_tips.length > 0 && (
        <div className="p-4 bg-sky-50/50 border border-sky-100 rounded-2xl text-xs space-y-2">
          <h4 className="font-bold uppercase tracking-wider text-sky-900">
            Preventative Agronomic Measures
          </h4>
          <ul className="text-sky-800 space-y-1 list-disc list-inside">
            {data.prevention_tips.map((tip, idx) => (
              <li key={idx}>{tip}</li>
            ))}
          </ul>
        </div>
      )}

      <AdvisoryDisclaimer text={data.disclaimer} />
    </div>
  );
};
