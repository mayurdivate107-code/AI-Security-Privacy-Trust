import React from 'react';
import {
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  CartesianGrid,
} from 'recharts';

interface AdvisoryActivityChartProps {
  data: { date: string; count: number }[];
}

export const AdvisoryActivityChart: React.FC<AdvisoryActivityChartProps> = ({ data }) => {
  if (!data || data.length === 0) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
        No advisory activity logged yet.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
        AI Advisory Consultations (Last 7 Days)
      </h3>
      <div className="h-56 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
            <XAxis dataKey="date" stroke="#94a3b8" fontSize={11} tickLine={false} />
            <YAxis stroke="#94a3b8" fontSize={11} tickLine={false} allowDecimals={false} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
              }}
            />
            <Bar dataKey="count" fill="#166534" radius={[6, 6, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
