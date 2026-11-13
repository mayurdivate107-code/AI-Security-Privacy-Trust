import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Droplets, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { IrrigationFormSchema, IrrigationFormValues } from '../../schemas/index.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { FormSelect } from '../../components/forms/FormSelect.js';
import { IrrigationRecommendationCard } from '../../components/advisory/IrrigationRecommendationCard.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const IrrigationAdvisoryPage: React.FC = () => {
  const { farms, selectedFarm } = useFarmContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<IrrigationFormValues>({
    resolver: zodResolver(IrrigationFormSchema),
    defaultValues: {
      farm_id: selectedFarm?.id,
      crop_name: 'Cotton',
      growth_stage: 'Square Initiation / Flowering',
      soil_type: selectedFarm?.soil_type || 'Black',
      farm_area: selectedFarm?.area || 5,
      irrigation_method: 'Drip Irrigation',
      water_source: selectedFarm?.water_source || 'Borewell',
      water_availability: 'Moderate',
    },
  });

  const onFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const f = farms.find((farm) => farm.id === e.target.value);
    if (f) {
      setValue('farm_id', f.id);
      setValue('soil_type', f.soil_type || 'Black');
      setValue('farm_area', f.area);
      setValue('water_source', f.water_source || 'Borewell');
    }
  };

  const onSubmit = async (values: IrrigationFormValues) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res: any = await api.post('/advisories/irrigation', values);
      setResult(res.data?.ai_response || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate irrigation advisory');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-cyan-800 uppercase tracking-wider mb-1">
          <Droplets className="w-4 h-4 text-cyan-600" />
          <span>Evapotranspiration & Moisture Budgeting</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Smart Irrigation & Water Management Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Formulate watering depth schedules, prevent root hypoxia from overwatering, and mitigate drought stress
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Intake Form */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        {farms.length > 0 && (
          <div className="p-4 bg-slate-50 border border-slate-200 rounded-2xl space-y-1">
            <label className="block text-xs font-semibold text-slate-700">
              Pre-fill with Registered Farm Holding (Optional)
            </label>
            <select
              defaultValue={selectedFarm?.id || ''}
              onChange={onFarmChange}
              className="w-full text-xs bg-white border border-slate-200 rounded-xl px-3 py-2"
            >
              <option value="">Select a farm to auto-fill...</option>
              {farms.map((f) => (
                <option key={f.id} value={f.id}>
                  {f.farm_name} ({f.district}, {f.state} - {f.area} {f.area_unit})
                </option>
              ))}
            </select>
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormInput
              label="Crop"
              placeholder="e.g. Cotton / Maize / Sugarcane"
              required
              error={errors.crop_name?.message}
              {...register('crop_name')}
            />

            <FormSelect
              label="Growth Stage"
              options={[
                { label: 'Germination / Initial Emergence', value: 'Initial Emergence' },
                { label: 'Vegetative Canopy Development', value: 'Vegetative Canopy' },
                { label: 'Flowering / Flowering Initiation', value: 'Flowering Initiation' },
                { label: 'Yield Formation / Grain Filling', value: 'Yield Formation' },
                { label: 'Ripening / Maturity', value: 'Ripening Maturity' },
              ]}
              required
              error={errors.growth_stage?.message}
              {...register('growth_stage')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Dominant Soil Type"
              options={[
                { label: 'Black Cotton Soil (High Moisture Hold)', value: 'Black' },
                { label: 'Alluvial Silt Loam', value: 'Alluvial' },
                { label: 'Red / Sandy Loam (High Drainage)', value: 'Red' },
                { label: 'Laterite Soil', value: 'Laterite' },
                { label: 'Arid Sandy Soil', value: 'Sandy' },
                { label: 'Clay Soil', value: 'Clay' },
                { label: 'Other', value: 'Other' },
              ]}
              required
              error={errors.soil_type?.message}
              {...register('soil_type')}
            />

            <FormSelect
              label="Irrigation Method"
              options={[
                { label: 'Drip Irrigation (Micro)', value: 'Drip Irrigation' },
                { label: 'Sprinkler Irrigation', value: 'Sprinkler' },
                { label: 'Furrow Irrigation', value: 'Furrow' },
                { label: 'Flood / Basin Irrigation', value: 'Flood' },
                { label: 'Rainfed (Dryland)', value: 'Rainfed' },
              ]}
              required
              error={errors.irrigation_method?.message}
              {...register('irrigation_method')}
            />

            <FormInput
              label="Plot Area"
              type="number"
              step="any"
              placeholder="5"
              required
              error={errors.farm_area?.message}
              {...register('farm_area')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormSelect
              label="Water Availability"
              options={[
                { label: 'High (Continuous)', value: 'High' },
                { label: 'Moderate (Rotational)', value: 'Moderate' },
                { label: 'Low (Severe rationing)', value: 'Low' },
                { label: 'Rainfed Only', value: 'Rainfed' },
              ]}
              required
              error={errors.water_availability?.message}
              {...register('water_availability')}
            />

            <FormInput
              label="Ambient Temp (°C, Optional)"
              type="number"
              placeholder="e.g. 32"
              {...register('temperature')}
            />

            <FormInput
              label="Recent Rainfall (Past 48h mm)"
              type="number"
              placeholder="e.g. 15"
              {...register('recent_rainfall')}
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 px-4 text-xs font-bold text-white bg-cyan-700 hover:bg-cyan-800 disabled:bg-slate-300 rounded-xl shadow-md transition"
          >
            {loading ? (
              'Calculating Evapotranspiration Dynamics with Gemini...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Formulate Irrigation Schedule
              </>
            )}
          </button>
        </form>
      </div>

      {result && <IrrigationRecommendationCard data={result} />}
    </div>
  );
};
