import React from 'react';
import { Link } from 'react-router-dom';
import {
  ScanLine,
  FlaskConical,
  Droplets,
  ArrowRight,
  ShieldCheck,
  TrendingUp,
  Cpu,
} from 'lucide-react';

export const LandingPage: React.FC = () => {
  return (
    <div className="space-y-20 pb-20">
      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-20 sm:pt-24 lg:pt-32 text-center max-w-5xl mx-auto space-y-6">
        <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-emerald-100 text-emerald-800 text-xs font-bold uppercase tracking-wider">
          <Cpu className="w-3.5 h-3.5 text-agri-primary" />
          <span>Powered by Google Gemini 2.5 Multi-Modal AI</span>
        </div>

        <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-slate-900 leading-[1.15]">
          Autonomous Agricultural Intelligence for Every{' '}
          <span className="text-agri-primary">Farmer & Field</span>
        </h1>

        <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 leading-relaxed">
          Transform raw soil chemistry, climate variables, and crop leaf photos into hyper-localized,
          scientifically validated agronomic advisories in seconds.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
          <Link
            to="/register"
            className="flex items-center px-6 py-3.5 text-sm font-bold text-white bg-agri-primary hover:bg-agri-primary-hover rounded-2xl shadow-md hover:shadow-lg transition-all"
          >
            Start Farm Consultation
            <ArrowRight className="w-4 h-4 ml-2" />
          </Link>
          <Link
            to="/login"
            className="px-6 py-3.5 text-sm font-bold text-slate-700 bg-white hover:bg-slate-50 border border-slate-200 rounded-2xl shadow-sm transition-all"
          >
            Sign In to Dashboard
          </Link>
        </div>

        {/* Feature Highlights Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-12 text-left">
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <TrendingUp className="w-5 h-5 text-agri-primary mb-2" />
            <p className="font-bold text-slate-900 text-sm">Yield Optimization</p>
            <p className="text-xs text-slate-500 mt-1">Multi-factor crop feasibility</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <ScanLine className="w-5 h-5 text-amber-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm">Vision Diagnostics</p>
            <p className="text-xs text-slate-500 mt-1">Foliar pathology identification</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <FlaskConical className="w-5 h-5 text-blue-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm">Precision Nutrition</p>
            <p className="text-xs text-slate-500 mt-1">NPK deficit & organic inputs</p>
          </div>
          <div className="p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
            <Droplets className="w-5 h-5 text-cyan-600 mb-2" />
            <p className="font-bold text-slate-900 text-sm">Irrigation Radar</p>
            <p className="text-xs text-slate-500 mt-1">Soil moisture conservation</p>
          </div>
        </div>
      </section>

      {/* How it works */}
      <section className="px-6 max-w-6xl mx-auto space-y-12">
        <div className="text-center space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-agri-primary">
            Streamlined Field Workflow
          </h2>
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900">
            From Soil Sample to Harvest Advisory
          </h3>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 mx-auto bg-emerald-50 text-agri-primary rounded-2xl flex items-center justify-center font-bold text-lg">
              1
            </div>
            <h4 className="font-bold text-base text-slate-900">Define Your Farm Holding</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Register your plot coordinates, soil classification, primary irrigation source, and historical sowing cycles.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 mx-auto bg-amber-50 text-amber-700 rounded-2xl flex items-center justify-center font-bold text-lg">
              2
            </div>
            <h4 className="font-bold text-base text-slate-900">Submit Visuals or Soil Specs</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Snap a leaf photo with suspected blight, or enter lab N-P-K and pH test parameters.
            </p>
          </div>

          <div className="p-8 bg-white rounded-3xl border border-slate-200 shadow-sm space-y-4">
            <div className="w-12 h-12 mx-auto bg-blue-50 text-blue-700 rounded-2xl flex items-center justify-center font-bold text-lg">
              3
            </div>
            <h4 className="font-bold text-base text-slate-900">Execute Field Actions</h4>
            <p className="text-xs text-slate-600 leading-relaxed">
              Receive structured organic remediation protocols, chemical dosages with pre-harvest safety intervals, and save records.
            </p>
          </div>
        </div>
      </section>

      {/* Safety & Compliance Banner */}
      <section className="px-6 max-w-4xl mx-auto">
        <div className="p-8 bg-slate-900 text-white rounded-3xl space-y-4 shadow-xl">
          <div className="flex items-center space-x-2 text-emerald-400 text-xs font-bold uppercase tracking-wider">
            <ShieldCheck className="w-4 h-4" />
            <span>Agronomic Integrity & Safety First</span>
          </div>
          <h3 className="text-2xl font-bold">Responsible Agricultural AI</h3>
          <p className="text-xs text-slate-300 leading-relaxed">
            AgriAdvisor adheres to Integrated Pest Management (IPM) guidelines. We prioritize
            biological controls (Neem formulations, Trichoderma, companion planting) before synthetic
            chemicals, and strictly specify Pre-Harvest Intervals (PHI) and Personal Protective Equipment (PPE) to protect farmer health.
          </p>
        </div>
      </section>
    </div>
  );
};
