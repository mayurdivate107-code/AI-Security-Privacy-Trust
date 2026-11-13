import React from 'react';
import { Link } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Tractor, Plus, MapPin, Trash2, ArrowRight } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';
import { EmptyState } from '../../components/common/EmptyState.js';

export const FarmsPage: React.FC = () => {
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery<{ data: Farm[] }>({
    queryKey: ['farms'],
    queryFn: () => api.get('/farms'),
  });

  const deleteMutation = useMutation({
    mutationFn: (farmId: string) => api.delete(`/farms/${farmId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['farms'] });
    },
  });

  const farms = data?.data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Farm Holdings & Plots</h1>
          <p className="text-xs text-slate-500 mt-0.5">
            Manage your agricultural land holdings, soil parameters, and water infrastructure
          </p>
        </div>
        <Link
          to="/farms/new"
          className="inline-flex items-center px-4 py-2.5 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover rounded-xl shadow-sm transition"
        >
          <Plus className="w-4 h-4 mr-1.5" />
          Add New Farm
        </Link>
      </div>

      {isLoading ? (
        <LoadingSpinner text="Loading your farm registry..." />
      ) : farms.length === 0 ? (
        <EmptyState
          icon={Tractor}
          title="No Farms Registered Yet"
          description="Register your first farm plot to enable personalized AI crop recommendations, disease scanning, and soil health monitoring."
          actionLabel="Register Farm Now"
          onAction={() => (window.location.href = '/farms/new')}
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
          {farms.map((farm) => (
            <div
              key={farm.id}
              className="bg-white rounded-2xl border border-slate-200 p-5 shadow-sm hover:border-emerald-300 transition space-y-4"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h3 className="font-bold text-base text-slate-900">{farm.farm_name}</h3>
                  <div className="flex items-center text-xs text-slate-500 mt-1">
                    <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                    <span>
                      {farm.district}, {farm.state}
                    </span>
                  </div>
                </div>
                <button
                  onClick={() => {
                    if (confirm('Are you sure you want to remove this farm profile?')) {
                      deleteMutation.mutate(farm.id);
                    }
                  }}
                  className="p-1.5 text-slate-400 hover:text-red-600 rounded-lg transition"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-xl">
                <div>
                  <span className="text-slate-400 block text-[11px]">Area:</span>
                  <p className="font-semibold text-slate-800">
                    {farm.area} {farm.area_unit}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Soil:</span>
                  <p className="font-semibold text-slate-800">{farm.soil_type || 'Unspecified'}</p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Irrigation:</span>
                  <p className="font-semibold text-slate-800">
                    {farm.irrigation_available ? 'Available' : 'Rainfed'}
                  </p>
                </div>
                <div>
                  <span className="text-slate-400 block text-[11px]">Soil pH:</span>
                  <p className="font-semibold text-slate-800">{farm.soil_ph || 'Not tested'}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-slate-100 flex items-center justify-between text-xs">
                <Link
                  to={`/farms/${farm.id}`}
                  className="text-agri-primary font-bold hover:underline flex items-center"
                >
                  View Farm Details
                  <ArrowRight className="w-3.5 h-3.5 ml-1" />
                </Link>
                <Link
                  to="/crop-recommendation"
                  className="text-slate-500 hover:text-slate-900"
                >
                  Get Advice →
                </Link>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
