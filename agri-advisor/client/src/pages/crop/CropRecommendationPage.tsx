import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Compass, Sparkles } from 'lucide-react';
import { api } from '../../lib/api.js';
import { CropRecommendationFormSchema, CropRecommendationFormValues } from '../../schemas/index.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { FormSelect } from '../../components/forms/FormSelect.js';
import { FormTextarea } from '../../components/forms/FormTextarea.js';
import { CropRecommendationCard } from '../../components/advisory/CropRecommendationCard.js';
import { ConfidenceIndicator } from '../../components/advisory/ConfidenceIndicator.js';
import { AdvisoryDisclaimer } from '../../components/advisory/AdvisoryDisclaimer.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const CropRecommendationPage: React.FC = () => {
  const { farms, selectedFarm } = useFarmContext();
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<CropRecommendationFormValues>({
    resolver: zodResolver(CropRecommendationFormSchema),
    defaultValues: {
      farm_id: selectedFarm?.id,
      state: selectedFarm?.state || 'Maharashtra',
      district: selectedFarm?.district || 'Nashik',
      soil_type: selectedFarm?.soil_type || 'Black',
      soil_ph: selectedFarm?.soil_ph,
      farm_area: selectedFarm?.area || 5,
      area_unit: selectedFarm?.area_unit || 'acre',
      water_availability: selectedFarm?.irrigation_available ? 'High' : 'Moderate',
      growing_season: 'Kharif',
    },
  });

  const onFarmChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const f = farms.find((farm) => farm.id === e.target.value);
    if (f) {
      setValue('farm_id', f.id);
      setValue('state', f.state);
      setValue('district', f.district);
      setValue('soil_type', f.soil_type || 'Black');
      setValue('farm_area', f.area);
      setValue('area_unit', f.area_unit);
      setValue('soil_ph', f.soil_ph);
      setValue('water_availability', f.irrigation_available ? 'High' : 'Moderate');
    }
  };

  const onSubmit = async (values: CropRecommendationFormValues) => {
    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const res: any = await api.post('/advisories/crop-recommendation', values);
      setResult(res.data?.ai_response || res.data);
    } catch (err: any) {
      setError(err.message || 'Failed to generate crop recommendation');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2.5 text-xs font-bold text-emerald-800 uppercase tracking-wider mb-1">
          <Compass className="w-4 h-4 text-emerald-600" />
          <span>Strategic Crop Selection</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          AI-Powered Crop Suitability Recommendation
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Analyze soil metrics, season, and geography to identify the highest-yielding, climate-resilient crops
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Input Form */}
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
              label="State / Province"
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
              placeholder="e.g. 6.8"
              error={errors.soil_ph?.message}
              {...register('soil_ph')}
            />

            <FormSelect
              label="Growing Season"
              options={[
                { label: 'Kharif (Monsoon: Jun - Oct)', value: 'Kharif' },
                { label: 'Rabi (Winter: Oct - Mar)', value: 'Rabi' },
                { label: 'Zaid (Summer: Mar - Jun)', value: 'Zaid' },
                { label: 'Whole Year', value: 'Whole Year' },
              ]}
              required
              error={errors.growing_season?.message}
              {...register('growing_season')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Farm Area"
              type="number"
              step="any"
              placeholder="5"
              required
              error={errors.farm_area?.message}
              {...register('farm_area')}
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

            <FormSelect
              label="Water Availability"
              options={[
                { label: 'High (Assured Canal / Drip)', value: 'High' },
                { label: 'Moderate (Borewell / Seasonal)', value: 'Moderate' },
                { label: 'Low (Limited)', value: 'Low' },
                { label: 'Rainfed Only (Dryland)', value: 'Rainfed' },
              ]}
              required
              error={errors.water_availability?.message}
              {...register('water_availability')}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Available Nitrogen (kg/ha)"
              type="number"
              placeholder="e.g. 280"
              {...register('nitrogen')}
            />
            <FormInput
              label="Available Phosphorus (kg/ha)"
              type="number"
              placeholder="e.g. 18"
              {...register('phosphorus')}
            />
            <FormInput
              label="Available Potassium (kg/ha)"
              type="number"
              placeholder="e.g. 210"
              {...register('potassium')}
            />
          </div>

          <FormTextarea
            label="Additional Field Notes / Previous Crop"
            placeholder="e.g. Rotated with chickpea last winter, field has slight drainage slope..."
            {...register('additional_information')}
          />

          <button
            type="submit"
            disabled={loading}
            className="flex items-center justify-center w-full py-3.5 px-4 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover disabled:bg-slate-300 rounded-xl shadow-md transition"
          >
            {loading ? (
              'Analyzing Agronomic Feasibility with Gemini...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Generate Tailored Crop Recommendations
              </>
            )}
          </button>
        </form>
      </div>

      {/* Generated Recommendations Output */}
      {result && (
        <div className="space-y-6">
          <div className="p-6 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
              <div>
                <h3 className="text-xl font-bold text-slate-900">Recommended Cultivation Plan</h3>
                <p className="text-xs text-slate-500 mt-0.5">Top-ranked crops based on your soil and water profile</p>
              </div>
              <ConfidenceIndicator confidence={result.overall_confidence || 0.85} />
            </div>

            <p className="text-xs text-slate-700 bg-slate-50 p-4 rounded-2xl leading-relaxed border border-slate-100">
              {result.summary}
            </p>

            {result.data_limitations && result.data_limitations.length > 0 && (
              <div className="p-3 bg-amber-50/70 border border-amber-200 rounded-xl text-xs text-amber-900">
                <span className="font-bold block mb-1">Data Limitations:</span>
                <ul className="list-disc list-inside space-y-0.5 text-[11px]">
                  {result.data_limitations.map((lim: string, idx: number) => (
                    <li key={idx}>{lim}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>

          <div className="grid grid-cols-1 gap-6">
            {result.recommended_crops?.map((crop: any, idx: number) => (
              <CropRecommendationCard key={idx} crop={crop} />
            ))}
          </div>

          <AdvisoryDisclaimer />
        </div>
      )}
    </div>
  );
};
