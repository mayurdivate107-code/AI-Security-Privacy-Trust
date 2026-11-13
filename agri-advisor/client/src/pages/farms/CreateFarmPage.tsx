import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Tractor, ArrowLeft } from 'lucide-react';
import { api } from '../../lib/api.js';
import { FarmFormSchema, FarmFormValues } from '../../schemas/index.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { FormSelect } from '../../components/forms/FormSelect.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const CreateFarmPage: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { refreshFarms } = useFarmContext();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FarmFormValues>({
    resolver: zodResolver(FarmFormSchema),
    defaultValues: {
      country: 'India',
      area_unit: 'acre',
      irrigation_available: false,
    },
  });

  const onSubmit = async (values: FarmFormValues) => {
    try {
      setLoading(true);
      setServerError(null);
      await api.post('/farms', values);
      await refreshFarms();
      navigate('/farms');
    } catch (err: any) {
      setServerError(err.message || 'Failed to create farm holding');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center text-xs font-semibold text-slate-500 hover:text-agri-primary"
      >
        <ArrowLeft className="w-3.5 h-3.5 mr-1" />
        Back to Farms
      </button>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="flex items-center space-x-3">
          <div className="p-3 bg-emerald-50 text-agri-primary rounded-2xl">
            <Tractor className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900">Register New Farm Holding</h1>
            <p className="text-xs text-slate-500">
              Provide acreage, location, and soil metrics for targeted AI advisory
            </p>
          </div>
        </div>

        {serverError && (
          <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-xs text-red-600">
            {serverError}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <FormInput
            label="Farm / Plot Name"
            placeholder="e.g. Green Acres North Field"
            required
            error={errors.farm_name?.message}
            {...register('farm_name')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="State"
              placeholder="e.g. Maharashtra"
              required
              error={errors.state?.message}
              {...register('state')}
            />
            <FormInput
              label="District"
              placeholder="e.g. Nashik"
              required
              error={errors.district?.message}
              {...register('district')}
            />
          </div>

          <FormInput
            label="Village / Landmark (Optional)"
            placeholder="e.g. Pimpalgaon"
            error={errors.village?.message}
            {...register('village')}
          />

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Farm Area"
              type="number"
              step="any"
              placeholder="e.g. 5.5"
              required
              error={errors.area?.message}
              {...register('area')}
            />
            <FormSelect
              label="Area Unit"
              options={[
                { label: 'Acres', value: 'acre' },
                { label: 'Hectares', value: 'hectare' },
                { label: 'Square Meters', value: 'square_meter' },
              ]}
              required
              error={errors.area_unit?.message}
              {...register('area_unit')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Dominant Soil Classification"
              options={[
                { label: 'Black Cotton Soil (Regur)', value: 'Black' },
                { label: 'Alluvial Soil', value: 'Alluvial' },
                { label: 'Red and Yellow Soil', value: 'Red' },
                { label: 'Laterite Soil', value: 'Laterite' },
                { label: 'Sandy / Arid Soil', value: 'Sandy' },
                { label: 'Clay Loam', value: 'Clay' },
                { label: 'Fertile Loamy Soil', value: 'Loamy' },
                { label: 'Other / Unknown', value: 'Other' },
              ]}
              required
              error={errors.soil_type?.message}
              {...register('soil_type')}
            />
            <FormInput
              label="Soil pH Level (Optional, 0-14)"
              type="number"
              step="0.1"
              placeholder="e.g. 6.8"
              error={errors.soil_ph?.message}
              {...register('soil_ph')}
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl space-y-3">
            <label className="flex items-center space-x-2 text-xs font-semibold text-slate-800 cursor-pointer">
              <input
                type="checkbox"
                className="w-4 h-4 text-agri-primary rounded border-slate-300 focus:ring-agri-primary"
                {...register('irrigation_available')}
              />
              <span>Irrigation Infrastructure Available on Farm</span>
            </label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-1">
              <FormInput
                label="Primary Water Source"
                placeholder="e.g. Borewell / Canal / River"
                {...register('water_source')}
              />
              <FormInput
                label="Farming Method"
                placeholder="e.g. Conventional / Organic / Mixed"
                {...register('farming_method')}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-4 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover disabled:bg-slate-300 rounded-xl shadow-sm transition"
          >
            {loading ? 'Registering Farm...' : 'Save Farm Profile'}
          </button>
        </form>
      </div>
    </div>
  );
};
