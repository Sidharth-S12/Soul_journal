import React from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip, BarChart, Bar, XAxis, YAxis, CartesianGrid } from 'recharts';

export const WinLossDonut = ({ wins = 0, losses = 0 }) => {
  const data = [
    { name: 'Wins', value: wins },
    { name: 'Losses', value: losses },
  ];
  const COLORS = ['#00ff88', '#ff2e63'];

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
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
          >
            {data.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip 
            contentStyle={{ backgroundColor: '#0b0b12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
            itemStyle={{ color: '#fff', fontSize: '10px', fontWeight: 'bold', textTransform: 'uppercase' }}
          />
        </PieChart>
      </ResponsiveContainer>
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center pointer-events-none">
        <div className="text-xl font-black text-white">{wins + losses ? Math.round((wins / (wins + losses)) * 100) : 0}%</div>
        <div className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none">Win rate</div>
      </div>
    </div>
  );
};

export const DailyPnLBar = ({ data = [] }) => {
  const bars = data.map(d => ({
    date: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pnl: d.tradePnl
  })).slice(-15);

  return (
    <div className="h-[200px] w-full">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={bars}>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
          <YAxis axisLine={false} tickLine={false} tick={{ fill: '#64748b', fontSize: 9 }} />
          <Tooltip 
             contentStyle={{ backgroundColor: '#0b0b12', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '12px' }}
             itemStyle={{ fontSize: '10px', fontWeight: 'bold' }}
          />
          <Bar dataKey="pnl">
            {bars.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={entry.pnl > 0 ? '#00ff88' : '#ff2e63'} fillOpacity={0.8} />
            ))}
          </Bar>
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};
