import React, { useState } from 'react';
import { ScanLine, Sparkles, UploadCloud } from 'lucide-react';
import { api } from '../../lib/api.js';
import { ImageUploader } from '../../components/forms/ImageUploader.js';
import { FormInput } from '../../components/forms/FormInput.js';
import { FormSelect } from '../../components/forms/FormSelect.js';
import { FormTextarea } from '../../components/forms/FormTextarea.js';
import { DiseaseAnalysisResult } from '../../components/advisory/DiseaseAnalysisResult.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const DiseaseDetectionPage: React.FC = () => {
  const { farms, selectedFarm } = useFarmContext();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cropName, setCropName] = useState('');
  const [growthStage, setGrowthStage] = useState('Vegetative');
  const [observations, setObservations] = useState('');
  const [farmId, setFarmId] = useState(selectedFarm?.id || '');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) {
      setError('Please select or capture a crop leaf image first.');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResult(null);

      const formData = new FormData();
      formData.append('image', selectedFile);
      if (cropName) formData.append('crop_name', cropName);
      if (growthStage) formData.append('growth_stage', growthStage);
      if (observations) formData.append('additional_observations', observations);
      if (farmId) formData.append('farm_id', farmId);

      const res: any = await api.post('/advisories/disease-detection', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      const analysisData = res.data?.analysis_result || res.data;
      setResult({
        ...analysisData,
        signed_image_url: res.data?.signed_image_url,
      });
    } catch (err: any) {
      setError(err.message || 'Disease scanning failed. Please try a clearer leaf photo.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-12">
      <div>
        <div className="flex items-center space-x-2 text-xs font-bold text-amber-800 uppercase tracking-wider mb-1">
          <ScanLine className="w-4 h-4 text-amber-600" />
          <span>Computer Vision Foliage Scanner</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-slate-900">
          Plant Disease & Pest Diagnostic Studio
        </h1>
        <p className="text-xs text-slate-500 mt-1">
          Upload or capture leaf specimens displaying spots, chlorosis, or wilting for instant biological & chemical triage
        </p>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-2xl text-xs text-red-600">
          {error}
        </div>
      )}

      {/* Input Diagnostic Studio */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          <ImageUploader onImageSelected={(file) => setSelectedFile(file)} />

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <FormInput
              label="Declared Crop (Optional)"
              placeholder="e.g. Tomato / Cotton / Paddy"
              value={cropName}
              onChange={(e) => setCropName(e.target.value)}
              helperText="Helps AI calibrate pathogen signatures"
            />

            <FormSelect
              label="Crop Growth Stage"
              value={growthStage}
              onChange={(e) => setGrowthStage(e.target.value)}
              options={[
                { label: 'Seedling / Nursery', value: 'Seedling' },
                { label: 'Vegetative Canopy Growth', value: 'Vegetative' },
                { label: 'Flowering / Tillering', value: 'Flowering' },
                { label: 'Fruiting / Grain Filling', value: 'Fruiting' },
                { label: 'Maturity / Harvesting', value: 'Maturity' },
              ]}
            />

            {farms.length > 0 && (
              <FormSelect
                label="Associated Farm Holding"
                value={farmId}
                onChange={(e) => setFarmId(e.target.value)}
                options={[
                  { label: 'Unassigned', value: '' },
                  ...farms.map((f) => ({ label: f.farm_name, value: f.id })),
                ]}
              />
            )}
          </div>

          <FormTextarea
            label="Observed Symptoms & Context"
            placeholder="e.g. Brown concentric lesions appeared 3 days ago after heavy morning dew..."
            value={observations}
            onChange={(e) => setObservations(e.target.value)}
          />

          <button
            type="submit"
            disabled={loading || !selectedFile}
            className="flex items-center justify-center w-full py-3.5 px-4 text-xs font-bold text-white bg-amber-600 hover:bg-amber-700 disabled:bg-slate-300 rounded-xl shadow-md transition"
          >
            {loading ? (
              'Analyzing Plant Pathology with Gemini Vision...'
            ) : (
              <>
                <Sparkles className="w-4 h-4 mr-2" />
                Run Multimodal Foliage Diagnostic
              </>
            )}
          </button>
        </form>
      </div>

      {/* Diagnostic Pathology Output */}
      {result && <DiseaseAnalysisResult data={result} />}
    </div>
  );
};
