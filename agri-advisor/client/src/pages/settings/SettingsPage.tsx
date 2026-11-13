import React, { useState } from 'react';
import { Settings, Shield, Sliders } from 'lucide-react';
import { FormSelect } from '../../components/forms/FormSelect.js';

export const SettingsPage: React.FC = () => {
  const [unit, setUnit] = useState('metric');
  const [language, setLanguage] = useState('en');
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  return (
    <div className="max-w-2xl mx-auto space-y-6 pb-12">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">Application Settings</h1>
        <p className="text-xs text-slate-500 mt-0.5">
          Configure regional units, localized language, and notification preferences
        </p>
      </div>

      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-sm space-y-6">
        <div className="space-y-4">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
            <Sliders className="w-4 h-4 mr-2 text-agri-primary" />
            Regional & Measurement Preferences
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <FormSelect
              label="Standard Units"
              value={unit}
              onChange={(e) => setUnit(e.target.value)}
              options={[
                { label: 'Metric (Hectares, Kilograms, Celsius)', value: 'metric' },
                { label: 'Imperial (Acres, Pounds, Fahrenheit)', value: 'imperial' },
                { label: 'Regional (Bigha, Quintal)', value: 'regional' },
              ]}
            />

            <FormSelect
              label="Interface Language"
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              options={[
                { label: 'English', value: 'en' },
                { label: 'Hindi (हिंदी)', value: 'hi' },
                { label: 'Marathi (मराठी)', value: 'mr' },
                { label: 'Telugu (తెలుగు)', value: 'te' },
              ]}
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-100 space-y-3">
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-900 flex items-center">
            <Shield className="w-4 h-4 mr-2 text-emerald-600" />
            Notification Triggers
          </h3>

          <label className="flex items-center justify-between p-3.5 bg-slate-50 rounded-2xl cursor-pointer">
            <div>
              <span className="text-xs font-bold text-slate-800 block">
                Real-Time Pest & Disease Outbreak Warnings
              </span>
              <span className="text-[11px] text-slate-400">
                Receive proactive alerts when humidity & temp spike fungal spore risks
              </span>
            </div>
            <input
              type="checkbox"
              checked={notificationsEnabled}
              onChange={(e) => setNotificationsEnabled(e.target.checked)}
              className="w-4 h-4 text-agri-primary rounded border-slate-300 focus:ring-agri-primary"
            />
          </label>
        </div>

        <button
          onClick={() => alert('Settings preference saved locally!')}
          className="w-full py-2.5 px-4 text-xs font-bold text-white bg-agri-primary hover:bg-agri-primary-hover rounded-xl shadow-sm transition"
        >
          Save Preferences
        </button>
      </div>
    </div>
  );
};
