import React from 'react';
import { Sprout, Calendar, MapPin } from 'lucide-react';
import { useAuth } from '../../contexts/AuthContext.js';
import { useFarmContext } from '../../contexts/FarmContext.js';

export const WelcomeCard: React.FC = () => {
  const { profile } = useAuth();
  const { selectedFarm } = useFarmContext();

  const today = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });

  return (
    <div className="relative overflow-hidden bg-gradient-to-r from-agri-primary to-emerald-800 text-white p-6 sm:p-8 rounded-3xl shadow-sm">
      <div className="relative z-10 max-w-2xl space-y-3">
        <div className="flex items-center space-x-2 text-emerald-200 text-xs font-semibold uppercase tracking-wider">
          <Calendar className="w-3.5 h-3.5" />
          <span>{today}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
          Welcome back, {profile?.full_name || 'Agricultural Producer'}!
        </h1>
        <p className="text-xs sm:text-sm text-emerald-100/90 leading-relaxed">
          Your AI Agronomist is active. Monitor crop health, calculate precision fertigation, and safeguard yield against climatic stress.
        </p>

        {selectedFarm && (
          <div className="inline-flex items-center space-x-2 px-3 py-1.5 bg-white/10 backdrop-blur-sm rounded-xl text-xs font-medium text-emerald-100 border border-white/10">
            <MapPin className="w-3.5 h-3.5 text-emerald-300" />
            <span>
              Active Plot: <strong>{selectedFarm.farm_name}</strong> ({selectedFarm.district}, {selectedFarm.state})
            </span>
          </div>
        )}
      </div>

      <div className="absolute right-0 bottom-0 translate-x-8 translate-y-8 opacity-10 pointer-events-none">
        <Sprout className="w-64 h-64 text-white" />
      </div>
    </div>
  );
};
