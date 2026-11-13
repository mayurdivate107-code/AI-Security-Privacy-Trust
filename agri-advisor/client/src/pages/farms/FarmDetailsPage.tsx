import React from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { Tractor, MapPin, ArrowLeft, Droplets, Compass, ScanLine } from 'lucide-react';
import { api } from '../../lib/api.js';
import { Farm } from '../../types/index.js';
import { LoadingSpinner } from '../../components/common/LoadingSpinner.js';

export const FarmDetailsPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();

  const { data, isLoading } = useQuery<{ data: Farm }>({
    queryKey: ['farm', id],
    queryFn: () => api.get(`/farms/${id}`),
  });

  const farm = data?.data;

  if (isLoading) return <LoadingSpinner text="Loading farm details..." />;
  if (!farm) return <div className="text-center py-12 text-xs text-slate-500">Farm profile not found.</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate('/farms')}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-agri-primary"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to All Farms
      </button>

      <div className="bg-white rounded-3xl border border-slate-200 p-6 sm:p-8 shadow-sm space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-100 pb-5">
          <div className="flex items-center space-x-3">
            <div className="p-3 bg-emerald-50 text-agri-primary rounded-2xl">
              <Tractor className="w-6 h-6" />
            </div>
            <div>
              <h1 className="text-2xl font-bold text-slate-900">{farm.farm_name}</h1>
              <div className="flex items-center text-xs text-slate-500 mt-0.5">
                <MapPin className="w-3.5 h-3.5 mr-1 text-slate-400" />
                <span>
                  {farm.village ? `${farm.village}, ` : ''}
                  {farm.district}, {farm.state}, {farm.country}
                </span>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Link
              to="/crop-recommendation"
              className="px-3.5 py-2 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover rounded-xl shadow-xs transition"
            >
              Get Crop Advice
            </Link>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-xs">
          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Total Land Area</span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {farm.area} {farm.area_unit}
            </p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Dominant Soil</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{farm.soil_type || 'Unspecified'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Soil pH Reaction</span>
            <p className="text-lg font-bold text-slate-900 mt-1">{farm.soil_ph ?? 'Not tested'}</p>
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
            <span className="text-slate-400 block text-[11px]">Water System</span>
            <p className="text-lg font-bold text-slate-900 mt-1">
              {farm.irrigation_available ? farm.water_source || 'Irrigated' : 'Rainfed'}
            </p>
          </div>
        </div>

        {/* Quick actions for this farm */}
        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
            Field Advisory Shortcuts
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <Link
              to="/crop-recommendation"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-emerald-300 flex items-center space-x-2.5 transition"
            >
              <Compass className="w-4 h-4 text-emerald-600" />
              <span className="font-semibold text-slate-800">Recommend Suitable Crops</span>
            </Link>
            <Link
              to="/disease-detection"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-amber-300 flex items-center space-x-2.5 transition"
            >
              <ScanLine className="w-4 h-4 text-amber-600" />
              <span className="font-semibold text-slate-800">Scan Crop for Disease</span>
            </Link>
            <Link
              to="/fertilizer-advisory"
              className="p-3.5 rounded-xl border border-slate-200 hover:border-blue-300 flex items-center space-x-2.5 transition"
            >
              <Droplets className="w-4 h-4 text-blue-600" />
              <span className="font-semibold text-slate-800">Calculate Fertilizer Needs</span>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};
