import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { ArrowLeft, Clock } from 'lucide-react';
import { api } from '../../lib/api.js';
import { CropAdvisory } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { CropRecommendationCard } from '../../components/advisory/CropRecommendationCard.js';
import { DiseaseAnalysisResult } from '../../components/advisory/DiseaseAnalysisResult.js';
import { FertilizerRecommendationCard } from '../../components/advisory/FertilizerRecommendationCard.js';
import { IrrigationRecommendationCard } from '../../components/advisory/IrrigationRecommendationCard.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';

export const AdvisoryDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ data: CropAdvisory }>({
    queryKey: ['advisory', id],
    queryFn: () => api.get(`/advisories/${id}`),
  });

  const adv = data?.data;

  if (isLoading) return <LoadingSpinner text="Retrieving detailed advisory report..." />;
  if (!adv) return <div className="text-center py-12 text-xs text-slate-500">Advisory record not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <div className="flex items-center justify-between">
        <button
          onClick={() => navigate('/advisories')}
          className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-agri-primary"
        >
          <ArrowLeft className="w-3.5 h-3.5 mr-1" />
          Back to Archives
        </button>

        <div className="flex items-center space-x-3 text-xs">
          <StatusBadge status={adv.advisory_type.replace('_', ' ')} type="info" />
          <span className="text-slate-400 flex items-center">
            <Clock className="w-3.5 h-3.5 mr-1" />
            {new Date(adv.created_at).toLocaleString()}
          </span>
        </div>
      </div>

      {/* Render Component according to type */}
      {adv.advisory_type === 'crop_recommendation' && (
        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-2">
            <h2 className="text-xl font-bold text-slate-900">Crop Suitability Recommendation</h2>
            <p className="text-xs text-slate-600 leading-relaxed">{adv.ai_response?.summary}</p>
          </div>
          <div className="space-y-4">
            {adv.ai_response?.recommended_crops?.map((crop: any, idx: number) => (
              <CropRecommendationCard key={idx} crop={crop} />
            ))}
          </div>
        </div>
      )}

      {adv.advisory_type === 'disease_detection' && (
        <DiseaseAnalysisResult data={adv.ai_response} />
      )}

      {adv.advisory_type === 'fertilizer' && (
        <FertilizerRecommendationCard data={adv.ai_response} />
      )}

      {adv.advisory_type === 'irrigation' && (
        <IrrigationRecommendationCard data={adv.ai_response} />
      )}
    </div>
  );
};
