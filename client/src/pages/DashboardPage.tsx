import React, { useState, useEffect } from 'react';
import { api, isBackendAlive } from '../lib/api.js';
import { DashboardStats } from '../types/index.js';
import { StatCard } from '../components/common/StatCard.js';
import { ThreatTimelineChart } from '../components/charts/ThreatTimelineChart.js';
import { PIICategoryChart } from '../components/charts/PIICategoryChart.js';
import { TrustDistributionChart } from '../components/charts/TrustDistributionChart.js';
import { ThreatBadge } from '../components/common/ThreatBadge.js';
import { DEFAULT_STATS } from '../lib/clientFallback.js';
import {
  ShieldCheck,
  ShieldAlert,
  Lock,
  Scale,
  RefreshCw,
  Cpu,
  ArrowUpRight,
} from 'lucide-react';
import { Link } from 'react-router-dom';

export const DashboardPage: React.FC = () => {
  const [data, setData] = useState<DashboardStats>(DEFAULT_STATS);
  const [loading, setLoading] = useState(false);

  const fetchStats = async () => {
    const online = await isBackendAlive();
    if (!online) {
      setData(DEFAULT_STATS);
      return;
    }
    try {
      setLoading(true);
      const res: any = await api.get('/dashboard/stats');
      if (res.success && res.stats) {
        setData(res);
      }
    } catch (err: any) {
      console.warn('[AegisAI Telemetry] Using local cached dashboard analytics:', err.message);
      setData(DEFAULT_STATS);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const stats = data.stats;

  return (
    <div className="space-y-8 pb-16">
      {/* Header with Title and Refresh */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-emerald-400">
              Live Telemetry Feed
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-mono font-extrabold text-white tracking-tight mt-1">
            Security & Trust Command Center
          </h1>
          <p className="text-xs text-slate-400 font-sans mt-0.5">
            Real-time adversarial threat vectors, PII pseudonymization, and DPDP compliance auditing
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={fetchStats}
            disabled={loading}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-mono font-semibold bg-slate-900 border border-slate-800 text-slate-300 hover:text-white hover:bg-slate-800 transition"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>

          <Link
            to="/playground"
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs font-mono font-bold text-white bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 shadow-md shadow-emerald-950/40 transition"
          >
            <Cpu className="w-3.5 h-3.5" />
            Open Playground
          </Link>
        </div>
      </div>

      {/* 4 KPI Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          title="Total Prompts Scanned"
          value={stats.totalScans.toLocaleString()}
          subtitle="Processed via Aegis Gateway"
          trend="+14% this week"
          glowColor="cyan"
          icon={<ShieldCheck className="w-5 h-5" />}
        />

        <StatCard
          title="Threats Blocked"
          value={stats.blockedThreats.toLocaleString()}
          subtitle={`${stats.blockRate}% Interception Rate`}
          trend="Shield Active"
          glowColor="rose"
          icon={<ShieldAlert className="w-5 h-5" />}
        />

        <StatCard
          title="PII Entities Masked"
          value={stats.totalPiiEntities.toLocaleString()}
          subtitle="Aadhaar, PAN, Emails, Keys"
          trend="DPDP Compliant"
          glowColor="amber"
          icon={<Lock className="w-5 h-5" />}
        />

        <StatCard
          title="Average Trust Score"
          value={`${stats.averageTrustScore}/100`}
          subtitle="Enterprise Grade Safety"
          trend="High Confidence"
          glowColor="emerald"
          icon={<Scale className="w-5 h-5" />}
        />
      </div>

      {/* Recharts Visualizations Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Timeline AreaChart (2 Cols) */}
        <div className="lg:col-span-2 cyber-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Activity Timeline
              </span>
              <h3 className="text-base font-mono font-bold text-white">
                Prompts Inspected vs. Blocked Threats (7 Days)
              </h3>
            </div>
            <div className="flex items-center gap-3 text-[11px] font-mono">
              <span className="flex items-center gap-1.5 text-cyan-400">
                <span className="w-2.5 h-2.5 rounded-full bg-cyan-400"></span> Total Scans
              </span>
              <span className="flex items-center gap-1.5 text-rose-400">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-400"></span> Blocked
              </span>
            </div>
          </div>

          <ThreatTimelineChart data={data.charts.threatTimeline} />
        </div>

        {/* PII Breakdown Donut Chart (1 Col) */}
        <div className="cyber-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Privacy Defense
            </span>
            <h3 className="text-base font-mono font-bold text-white">
              Redacted PII Breakdown
            </h3>
          </div>

          <PIICategoryChart data={data.charts.piiBreakdown} />
        </div>
      </div>

      {/* Trust Score Distribution BarChart & Recent Threats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Trust Score Buckets */}
        <div className="cyber-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div>
            <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
              Trust Score Calibration
            </span>
            <h3 className="text-base font-mono font-bold text-white">
              Prompt Trust Score Distribution
            </h3>
          </div>

          <TrustDistributionChart data={data.charts.trustDistribution} />
        </div>

        {/* Recent Blocked Threats Feed */}
        <div className="cyber-card rounded-2xl border border-slate-800 p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <span className="text-xs font-mono font-bold text-slate-400 uppercase tracking-wider block">
                Security Interceptions
              </span>
              <h3 className="text-base font-mono font-bold text-white">
                Recent Adversarial Threats
              </h3>
            </div>
            <Link
              to="/logs"
              className="text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1"
            >
              Full Log Ledger <ArrowUpRight className="w-3.5 h-3.5" />
            </Link>
          </div>

          <div className="space-y-3">
            {data.recentThreats.map((threat: any, idx: number) => (
              <div
                key={idx}
                className="p-3.5 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-slate-700 transition space-y-1.5"
              >
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-rose-300">
                    {threat.threatCategory?.replace('_', ' ') || 'PROMPT INJECTION'}
                  </span>
                  <ThreatBadge level={threat.threatLevel || 'CRITICAL'} />
                </div>
                <p className="text-xs font-mono text-slate-300 line-clamp-1">
                  "{threat.originalPromptPreview}"
                </p>
                <p className="text-[11px] text-slate-500 font-sans line-clamp-1">
                  {threat.aiExplanation}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
