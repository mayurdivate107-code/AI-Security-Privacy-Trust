import React from 'react';
import { ResponsiveContainer, PieChart, Pie, Cell, Tooltip, Legend } from 'recharts';

interface CategoryDistributionChartProps {
  data: { name: string; value: number }[];
}

const COLORS = ['#166534', '#22C55E', '#F59E0B', '#3B82F6'];

export const CategoryDistributionChart: React.FC<CategoryDistributionChartProps> = ({ data }) => {
  if (!data || data.length === 0 || data.every((d) => d.value === 0)) {
    return (
      <div className="flex items-center justify-center h-48 text-xs text-slate-400 bg-slate-50 rounded-2xl border border-slate-100">
        No advisory records to categorize yet.
      </div>
    );
  }

  return (
    <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-sm space-y-3">
      <h3 className="text-xs font-bold uppercase tracking-wider text-slate-700">
        Advisory Category Breakdown
      </h3>
      <div className="h-56 w-full text-xs">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={50}
              outerRadius={75}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((_, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#ffffff',
                borderRadius: '12px',
                border: '1px solid #e2e8f0',
                fontSize: '11px',
              }}
            />
            <Legend verticalAlign="bottom" height={36} iconSize={8} wrapperStyle={{ fontSize: '11px' }} />
          </PieChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
