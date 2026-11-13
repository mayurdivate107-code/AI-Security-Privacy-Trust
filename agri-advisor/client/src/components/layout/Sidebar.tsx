import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Tractor,
  Compass,
  ScanLine,
  FlaskConical,
  Droplets,
  History,
  BookOpen,
  Bell,
  Settings,
} from 'lucide-react';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Farms', href: '/farms', icon: Tractor },
  { name: 'Crop Advisor', href: '/crop-recommendation', icon: Compass },
  { name: 'Disease Scanner', href: '/disease-detection', icon: ScanLine },
  { name: 'Fertilizer Guide', href: '/fertilizer-advisory', icon: FlaskConical },
  { name: 'Irrigation Guide', href: '/irrigation-advisory', icon: Droplets },
  { name: 'Advisory History', href: '/advisories', icon: History },
  { name: 'Knowledge Center', href: '/knowledge-center', icon: BookOpen },
  { name: 'Notifications', href: '/notifications', icon: Bell },
  { name: 'Settings', href: '/settings', icon: Settings },
];

export const Sidebar: React.FC<{ onClose?: () => void }> = ({ onClose }) => {
  return (
    <aside className="flex flex-col w-64 h-full bg-white border-r border-slate-200">
      <div className="flex flex-col flex-1 px-3 py-4 space-y-1 overflow-y-auto">
        <div className="px-3 pb-2 text-[11px] font-bold uppercase tracking-wider text-slate-400">
          Agricultural Advisory
        </div>
        {navigation.map((item) => (
          <NavLink
            key={item.name}
            to={item.href}
            onClick={onClose}
            className={({ isActive }) =>
              `flex items-center px-3.5 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                isActive
                  ? 'bg-agri-primary text-white shadow-sm'
                  : 'text-slate-600 hover:text-agri-primary hover:bg-emerald-50/60'
              }`
            }
          >
            <item.icon className="w-4 h-4 mr-3 shrink-0" />
            {item.name}
          </NavLink>
        ))}
      </div>

      <div className="p-4 m-3 bg-emerald-50 rounded-2xl border border-emerald-100">
        <p className="text-xs font-bold text-emerald-900">Need Expert Field Advice?</p>
        <p className="text-[11px] text-emerald-700 mt-1 leading-relaxed">
          Upload symptomatic leaf photos to receive instant organic & synthetic control measures.
        </p>
      </div>
    </aside>
  );
};
