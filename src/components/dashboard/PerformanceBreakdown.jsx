import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from 'recharts';

const data = [
  { name: 'Wins', value: 65, color: '#00FF88' },
  { name: 'Losses', value: 25, color: '#FF003D' },
  { name: 'Break Even', value: 10, color: '#64748B' },
];

const PerformanceBreakdown = () => {
  return (
    <div className="glass-card p-6 h-full flex flex-col">
      <h3 className="text-sm font-bold text-white uppercase tracking-widest mb-6">Strategy Win Rate</h3>

      <div className="flex-1 flex items-center justify-center relative">
        <ResponsiveContainer width="100%" height={200}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={60}
              outerRadius={80}
              paddingAngle={5}
              dataKey="value"
              stroke="none"
              animationDuration={1500}
            >
              {data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: '#0F172A',
                border: '1px solid rgba(255,255,255,0.1)',
                borderRadius: '12px'
              }}
            />
          </PieChart>
        </ResponsiveContainer>

        <div className="absolute flex flex-col items-center">
          <span className="text-3xl font-black text-white">65%</span>
          <span className="text-[10px] text-text-muted font-bold uppercase">Accuracy</span>
        </div>
      </div>

      <div className="space-y-3 mt-6">
        {data.map((item) => (
          <div key={item.name} className="flex justify-between items-center bg-white/5 px-3 py-2 rounded-lg">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full" style={{ backgroundColor: item.color }} />
              <span className="text-xs text-text-secondary font-medium">{item.name}</span>
            </div>
            <span className="text-xs font-bold text-white">{item.value}%</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default PerformanceBreakdown;
