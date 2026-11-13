import React from 'react';
import { Link } from 'react-router-dom';
import { Compass, ScanLine, FlaskConical, Droplets, History, PlusCircle } from 'lucide-react';

const actions = [
  {
    title: 'Crop Recommendation',
    desc: 'Find high-yielding crops for your soil & season',
    to: '/crop-recommendation',
    icon: Compass,
    color: 'bg-emerald-50 text-emerald-700 hover:border-emerald-300',
  },
  {
    title: 'Analyze Crop Disease',
    desc: 'Scan foliage photos for instant pest & disease triage',
    to: '/disease-detection',
    icon: ScanLine,
    color: 'bg-amber-50 text-amber-700 hover:border-amber-300',
  },
  {
    title: 'Fertilizer Advice',
    desc: 'Calculate NPK deficit & organic soil amendments',
    to: '/fertilizer-advisory',
    icon: FlaskConical,
    color: 'bg-blue-50 text-blue-700 hover:border-blue-300',
  },
  {
    title: 'Irrigation Guidance',
    desc: 'Optimize watering depth & conserve moisture',
    to: '/irrigation-advisory',
    icon: Droplets,
    color: 'bg-cyan-50 text-cyan-700 hover:border-cyan-300',
  },
  {
    title: 'Register New Farm',
    desc: 'Add acreage, soil parameters & irrigation setup',
    to: '/farms/new',
    icon: PlusCircle,
    color: 'bg-purple-50 text-purple-700 hover:border-purple-300',
  },
  {
    title: 'Advisory Archives',
    desc: 'Search past diagnostic and nutritional reports',
    to: '/advisories',
    icon: History,
    color: 'bg-slate-100 text-slate-700 hover:border-slate-300',
  },
];

export const QuickActions: React.FC = () => {
  return (
    <div className="space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-400">
        Agricultural Command Actions
      </h3>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {actions.map((act) => (
          <Link
            key={act.title}
            to={act.to}
            className={`p-4 rounded-2xl border border-slate-200/80 bg-white shadow-sm flex items-start space-x-3.5 transition-all hover:shadow hover:-translate-y-0.5 ${act.color}`}
          >
            <div className="p-2.5 rounded-xl bg-white shadow-xs shrink-0">
              <act.icon className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900">{act.title}</h4>
              <p className="text-[11px] text-slate-500 mt-0.5 leading-relaxed">{act.desc}</p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
};
