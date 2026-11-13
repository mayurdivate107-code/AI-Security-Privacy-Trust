import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { Link } from 'react-router-dom';
import { Tractor, Compass, ScanLine, Bookmark, ArrowRight, Clock } from 'lucide-react';
import { WelcomeCard } from '../../components/dashboard/WelcomeCard.js';
import { QuickActions } from '../../components/dashboard/QuickActions.js';
import { AgriculturalTipCard } from '../../components/dashboard/AgriculturalTipCard.js';
import { StatCard } from '../../components/common/StatCard.js';
import { AdvisoryActivityChart } from '../../components/charts/AdvisoryActivityChart.js';
import { CategoryDistributionChart } from '../../components/charts/CategoryDistributionChart.js';
import { StatusBadge } from '../../components/common/StatusBadge.js';
import { api } from '../../lib/api.js';
import { CropAdvisory, Farm } from '../../types/index.js';

export const DashboardPage: React.FC = () => {
  // Fetch user farms
  const { data: farmsData } = useQuery<{ data: Farm[] }>({
    queryKey: ['farms'],
    queryFn: () => api.get('/farms'),
  });

  // Fetch recent advisories
  const { data: advisoriesData } = useQuery<{ data: CropAdvisory[] }>({
    queryKey: ['advisories'],
    queryFn: () => api.get('/advisories'),
  });

  const farms = farmsData?.data || [];
  const advisories = advisoriesData?.data || [];

  const totalFarms = farms.length;
  const totalAdvisories = advisories.length;
  const diseaseScans = advisories.filter((a) => a.advisory_type === 'disease_detection').length;
  const savedAdvisories = advisories.filter((a) => a.is_saved).length;

  // Chart data calculation
  const categoryCounts = [
    {
      name: 'Crop Recs',
      value: advisories.filter((a) => a.advisory_type === 'crop_recommendation').length,
    },
    {
      name: 'Disease Scans',
      value: diseaseScans,
    },
    {
      name: 'Fertilizer',
      value: advisories.filter((a) => a.advisory_type === 'fertilizer').length,
    },
    {
      name: 'Irrigation',
      value: advisories.filter((a) => a.advisory_type === 'irrigation').length,
    },
  ];

  // Last 7 days activity
  const last7Days = Array.from({ length: 7 }).map((_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (6 - i));
    const dateStr = d.toISOString().split('T')[0];
    const count = advisories.filter((a) => a.created_at.startsWith(dateStr)).length;
    return {
      date: d.toLocaleDateString('en-US', { weekday: 'short' }),
      count,
    };
  });

  return (
    <div className="space-y-6 pb-12">
      {/* Welcome Banner */}
      <WelcomeCard />

      {/* 4 Metric Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4">
        <StatCard
          label="Registered Farms"
          value={totalFarms}
          icon={Tractor}
          subtext="Active holdings"
          color="emerald"
        />
        <StatCard
          label="Total Advisories"
          value={totalAdvisories}
          icon={Compass}
          subtext="AI consultations"
          color="blue"
        />
        <StatCard
          label="Disease Scans"
          value={diseaseScans}
          icon={ScanLine}
          subtext="Foliar screenings"
          color="amber"
        />
        <StatCard
          label="Saved Reports"
          value={savedAdvisories}
          icon={Bookmark}
          subtext="Bookmarked plans"
          color="purple"
        />
      </div>

      {/* Agronomist Tip */}
      <AgriculturalTipCard />

      {/* Quick Action Matrix */}
      <QuickActions />

      {/* Visual Analytics Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AdvisoryActivityChart data={last7Days} />
        <CategoryDistributionChart data={categoryCounts} />
      </div>

      {/* Recent Advisories Feed */}
      <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-4">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div>
            <h3 className="text-sm font-bold text-slate-900">Recent AI Field Consultations</h3>
            <p className="text-xs text-slate-500">Your latest generated agricultural advisories</p>
          </div>
          <Link
            to="/advisories"
            className="text-xs font-bold text-agri-primary hover:underline flex items-center"
          >
            View All
            <ArrowRight className="w-3.5 h-3.5 ml-1" />
          </Link>
        </div>

        {advisories.length === 0 ? (
          <div className="text-center py-8 text-xs text-slate-400">
            No advisory consultations yet. Click any quick action above to get your first crop recommendation or leaf scan.
          </div>
        ) : (
          <div className="divide-y divide-slate-100">
            {advisories.slice(0, 5).map((adv) => (
              <div
                key={adv.id}
                className="py-3.5 flex flex-wrap items-center justify-between gap-3 text-xs"
              >
                <div className="space-y-0.5">
                  <div className="flex items-center space-x-2">
                    <StatusBadge
                      status={adv.advisory_type.replace('_', ' ')}
                      type={
                        adv.advisory_type === 'crop_recommendation'
                          ? 'success'
                          : adv.advisory_type === 'disease_detection'
                          ? 'danger'
                          : 'info'
                      }
                    />
                    <span className="font-bold text-slate-800">
                      {adv.ai_response?.crop_name ||
                        adv.input_data?.crop_name ||
                        adv.input_data?.district ||
                        'Agricultural Advisory'}
                    </span>
                  </div>
                  <p className="text-slate-500 text-[11px] truncate max-w-md">
                    {adv.ai_response?.summary ||
                      adv.ai_response?.primary_diagnosis ||
                      'Consultation completed'}
                  </p>
                </div>

                <div className="flex items-center space-x-4">
                  <span className="text-[11px] text-slate-400 flex items-center">
                    <Clock className="w-3 h-3 mr-1" />
                    {new Date(adv.created_at).toLocaleDateString()}
                  </span>
                  <Link
                    to={`/advisories/${adv.id}`}
                    className="px-3 py-1.5 text-xs font-semibold text-agri-primary hover:bg-emerald-50 rounded-lg transition"
                  >
                    View Report
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
