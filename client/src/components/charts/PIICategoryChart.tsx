import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';
import { PIIBreakdownPoint } from '../../types/index.js';

interface PIICategoryChartProps {
  data: PIIBreakdownPoint[];
}

export const PIICategoryChart: React.FC<PIICategoryChartProps> = ({ data }) => {
  const total = data.reduce((sum, item) => sum + item.value, 0);

  return (
    <div className="flex flex-col sm:flex-row items-center justify-between gap-4 w-full h-72">
      {/* Donut Chart */}
      <div className="w-full sm:w-1/2 h-52 sm:h-full relative flex items-center justify-center">
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              innerRadius={55}
              outerRadius={80}
              paddingAngle={4}
              dataKey="value"
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} stroke="#030712" strokeWidth={2} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0b1120',
                borderColor: '#334155',
                borderRadius: '12px',
                color: '#f8fafc',
                fontSize: '12px',
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
          <span className="font-mono text-2xl font-extrabold text-white">{total}</span>
          <span className="text-[10px] text-slate-400 uppercase font-mono tracking-wider">Entities</span>
        </div>
      </div>

      {/* Legend Grid */}
      <div className="w-full sm:w-1/2 flex flex-col gap-2">
        {data.map((item) => {
          const percent = total > 0 ? Math.round((item.value / total) * 100) : 0;
          return (
            <div
              key={item.name}
              className="flex items-center justify-between text-xs px-2.5 py-1.5 rounded-lg bg-slate-900/60 border border-slate-800"
            >
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: item.color }}></span>
                <span className="font-medium text-slate-300 truncate max-w-[110px]">{item.name}</span>
              </div>
              <div className="flex items-center gap-2 font-mono">
                <span className="font-bold text-white">{item.value}</span>
                <span className="text-slate-500 text-[11px]">({percent}%)</span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
