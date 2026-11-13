import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FlaskConical, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { FertilizerFormSchema, FertilizerFormValues } from '../../schemas/index.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { FormSelect } from '../../components/forms/FormSelect.js';
import { FertilizerRecommendationCard } from '../../components/advisory/FertilizerRecommendationCard.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const FertilizerAdvisoryPage: React.FC = () => {
  const { farms, selectedFarm } = useFarmContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<FertilizerFormValues>({
    resolver: zodResolver(FertilizerFormSchema),
    defaultValues: {
      farm_id: selectedFarm?.id,
      crop_name: 'Paddy / Rice',
      growth_stage: 'Vegetative Tillering',
      soil_type: selectedFarm?.soil_type || 'Alluvial',
      soil_ph: selectedFarm?.soil_ph,
      farm_area: selectedFarm?.area || 5,
      organic_available: true,
    },
  });

  const onFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const f = farms.find((farm) => farm.id === e.target.value);
    if (f) {
      setValue('farm_id', f.id);
      setValue('soil_type', f.soil_type || 'Alluvial');
      setValue('farm_area', f.area);
      setValue('soil_ph', f.soil_ph);
    }
  };

  const onSubmit = async (values: FertilizerFormValues) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res: any = await api.post('/advisories/fertilizer', values);
      setResult(res.data?.ai_response || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate fertilizer schedule');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-blue-800 uppercase tracking-wider mb-1">
          <FlaskConical className="w-4 h-4 text-blue-600" />
          <span>Nutrient & Soil Chemistry Balancing</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Precision Fertilizer & Nutrient Advisory
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Calculate stage-by-stage N-P-K commercial fertilizer dosages (Urea, DAP, MOP) and organic manure requirements
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
              label="Target Crop"
              placeholder="e.g. Wheat, Tomato, Maize"
              required
              error={errors.crop_name?.message}
              {...register('crop_name')}
            />
            <FormSelect
              label="Current Growth Stage"
              options={[
                { label: 'Basal / Land Preparation', value: 'Basal Land Preparation' },
                { label: 'Seedling / Early Emergence', value: 'Seedling Emergence' },
                { label: 'Vegetative Tillering / Branching', value: 'Vegetative Tillering' },
                { label: 'Panicle / Flowering Initiation', value: 'Flowering Initiation' },
                { label: 'Grain Filling / Pod Development', value: 'Grain Filling' },
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
                { label: 'Black Cotton Soil (Regur)', value: 'Black' },
                { label: 'Alluvial Soil', value: 'Alluvial' },
                { label: 'Red and Yellow Soil', value: 'Red' },
                { label: 'Laterite Soil', value: 'Laterite' },
                { label: 'Sandy / Arid Soil', value: 'Sandy' },
                { label: 'Clayey Soil', value: 'Clay' },
                { label: 'Loamy Soil', value: 'Loamy' },
                { label: 'Other', value: 'Other' },
              ]}
              required
              error={errors.soil_type?.message}
              {...register('soil_type')}
            />

            <FormInput
              label="Soil pH (0-14)"
              type="number"
              step="0.1"
              placeholder="e.g. 6.5"
              error={errors.soil_ph?.message}
              {...register('soil_ph')}
            />

            <FormInput
              label="Plot Land Area (Acres/Ha)"
              type="number"
              step="any"
              placeholder="5"
              required
              error={errors.farm_area?.message}
              {...register('farm_area')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Nitrogen (N) kg/ha"
              type="number"
              placeholder="e.g. 210"
              {...register('nitrogen')}
            />
            <FormInput
              label="Phosphorus (P) kg/ha"
              type="number"
              placeholder="e.g. 15"
              {...register('phosphorus')}
            />
            <FormInput
              label="Potassium (K) kg/ha"
              type="number"
              placeholder="e.g. 180"
              {...register('potassium')}
            />
          </div>

          <div className="p-4 bg-slate-50 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-800 block">
                Farmyard Manure / Organic Compost Available?
              </span>
              <span className="text-[11px] text-slate-400">
                Helps AI formulate bio-fertilizer integrations
              </span>
            </div>
            <input
              type="checkbox"
              className="w-4 h-4 text-agri-primary rounded border-slate-300 focus:ring-agri-primary"
              {...register('organic_available')}
            />
          </div>

          <FormInput
            label="Previous Fertilizer Application"
            placeholder="e.g. Applied 50kg DAP basal 30 days ago..."
            {...register('previous_fertilizer')}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 px-4 text-xs font-bold text-white bg-blue-600 hover:bg-blue-700 disabled:bg-slate-300 rounded-xl shadow-md transition"
          >
            {loading ? (
              'Calculating Nutrient Curve with Gemini...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Compute Precision Fertilizer Regimen
              </>
            )}
          </button>
        </form>
      </div>

      {result && <FertilizerRecommendationCard data={result} />}
    </div>
  );
};
