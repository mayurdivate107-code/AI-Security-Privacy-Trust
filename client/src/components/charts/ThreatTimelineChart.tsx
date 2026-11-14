import React from 'react';
import {
  AreaChart,
  Area,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { ThreatTimelinePoint } from '../../types/index.js';

interface ThreatTimelineChartProps {
  data: ThreatTimelinePoint[];
}

export const ThreatTimelineChart: React.FC<ThreatTimelineChartProps> = ({ data }) => {
  return (
    <div className="w-full h-72">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={data} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
          <defs>
            <linearGradient id="scansGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#06b6d4" stopOpacity={0.35} />
              <stop offset="95%" stopColor="#06b6d4" stopOpacity={0.0} />
            </linearGradient>
            <linearGradient id="threatsGradient" x1="0" y1="0" x2="0" y2="1">
              <stop offset="5%" stopColor="#f43f5e" stopOpacity={0.45} />
              <stop offset="95%" stopColor="#f43f5e" stopOpacity={0.0} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="#1e293b" vertical={false} />
          <XAxis
            dataKey="date"
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
          />
          <YAxis
            stroke="#64748b"
            fontSize={11}
            tickLine={false}
            axisLine={{ stroke: '#1e293b' }}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: '#0b1120',
              borderColor: '#334155',
              borderRadius: '12px',
              color: '#f8fafc',
              fontSize: '12px',
              boxShadow: '0 10px 25px -5px rgba(0,0,0,0.5)',
            }}
            labelStyle={{ fontWeight: 'bold', color: '#38bdf8', marginBottom: '4px' }}
          />
          <Area
            type="monotone"
            dataKey="totalScans"
            name="Total Prompts Inspected"
            stroke="#06b6d4"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#scansGradient)"
          />
          <Area
            type="monotone"
            dataKey="blockedThreats"
            name="Blocked Threats"
            stroke="#f43f5e"
            strokeWidth={2}
            fillOpacity={1}
            fill="url(#threatsGradient)"
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};
