import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { History, Search, Bookmark, Trash2, ArrowRight, Clock } from 'lucide-react';
import { api } from '../../lib/api.js';
import { CropAdvisory } from '../../types/index.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const AdvisoriesListPage: React.FC = () => {
  const queryClient = useQueryClient();
  const [filterType, setFilterType] = useState<string>('all');
  const [searchTerm, setSearchTerm] = useState('');

  const { data, isLoading } = useQuery<{ data: CropAdvisory[] }>({
    queryKey: ['advisories'],
    queryFn: () => api.get('/advisories'),
  });

  const toggleSaveMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/advisories/${id}/save`, {}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/advisories/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['advisories'] });
    },
  });

  const rawAdvisories = data?.data || [];

  const filtered = rawAdvisories.filter((adv) => {
    const matchesType = filterType === 'all' || adv.advisory_type === filterType;
    const cropName = (adv.ai_response?.crop_name || adv.input_data?.crop_name || '').toLowerCase();
    const matchesSearch = !searchTerm || cropName.includes(searchTerm.toLowerCase());
    return matchesType && matchesSearch;
  });

  return (
    <div className="space-y-6 pb-12">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Historical AI Advisories</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Review, bookmark, or revisit your previous crop recommendations, disease scans, and nutrient plans
          </p>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3">
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
          <input
            type="text"
            placeholder="Search by crop name (e.g. Cotton, Tomato)..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-9 pr-4 py-2 text-xs bg-white border border-slate-200 rounded-xl focus:outline-none focus:border-agri-primary"
          />
        </div>

        <div className="flex space-x-2 overflow-x-auto text-xs pb-1 sm:pb-0">
          {[
            { label: 'All Advisories', value: 'all' },
            { label: 'Crop Selection', value: 'crop_recommendation' },
            { label: 'Disease Scans', value: 'disease_detection' },
            { label: 'Fertilizer', value: 'fertilizer' },
            { label: 'Irrigation', value: 'irrigation' },
          ].map((tab) => (
            <button
              key={tab.value}
              onClick={() => setFilterType(tab.value)}
              className={`px-3 py-2 rounded-xl font-semibold transition shrink-0 ${
                filterType === tab.value
                  ? 'bg-agri-primary text-white shadow-xs'
                  : 'bg-white text-slate-600 hover:bg-slate-50 border border-slate-200'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Retrieving advisory archive..." />
      ) : filtered.length === 0 ? (
        <EmptyState
          icon={History}
          title="No Advisory Records Found"
          description="You haven't generated any agricultural advisories matching your current filter."
          actionLabel="Get Crop Advice"
          onAction={() => (window.location.href = '/crop-recommendation')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((adv) => (
            <div
              key={adv.id}
              className="bg-white p-5 rounded-2xl border border-slate-200 shadow-sm hover:border-emerald-300 transition space-y-3"
            >
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <StatusBadge
                    status={adv.advisory_type.replace('_', ' ')}
                    type={
                      adv.advisory_type === 'crop_recommendation'
                        ? 'success'
                        : adv.advisory_type === 'disease_detection'
                        ? 'danger'
                        : 'info'
                    }
                  />
                  <h3 className="font-bold text-base text-slate-900 mt-1">
                    {adv.ai_response?.crop_name ||
                      adv.input_data?.crop_name ||
                      adv.input_data?.district ||
                      'Agricultural Consultation'}
                  </h3>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => toggleSaveMutation.mutate(adv.id)}
                    className={`p-1.5 rounded-lg transition ${
                      adv.is_saved
                        ? 'text-amber-600 bg-amber-50'
                        : 'text-slate-400 hover:text-amber-600'
                    }`}
                    title={adv.is_saved ? 'Bookmarked' : 'Save Report'}
                  >
                    <Bookmark className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => {
                      if (confirm('Delete this advisory from records?')) {
                        deleteMutation.mutate(adv.id);
                      }
                    }}
                    className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>

              <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                {adv.ai_response?.summary ||
                  adv.ai_response?.primary_diagnosis ||
                  'Advisory report processed successfully.'}
              </p>

              <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100">
                <span className="text-[11px] text-slate-400 flex items-center">
                  <Clock className="w-3.5 h-3.5 mr-1" />
                  {new Date(adv.created_at).toLocaleDateString()}
                </span>
                <Link
                  to={`/advisories/${adv.id}`}
                  className="font-bold text-agri-primary hover:underline flex items-center"
                >
                  Inspect Report
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
