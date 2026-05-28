import React, { useMemo } from 'react';
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts';

const EquityCurve = ({ data = [] }) => {
  const chartData = useMemo(() => {
    if (!data.length) return [];
    return data.map(d => ({
      ...d,
      dateFormatted: new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }));
  }, [data]);

  const off = useMemo(() => {
    if (!chartData.length) return 0;
    const dataMax = Math.max(...chartData.map((i) => i.pnl));
    const dataMin = Math.min(...chartData.map((i) => i.pnl));

    if (dataMax <= 0) return 0;
    if (dataMin >= 0) return 1;

    return dataMax / (dataMax - dataMin);
  }, [chartData]);

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      const val = payload[0].value;
      return (
        <div className="bg-bg-darker/95 border border-white/10 backdrop-blur-xl p-3 rounded-xl shadow-2xl">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{label}</p>
          <p className={`text-sm font-black ${val >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
            {val >= 0 ? '+' : ''}${val.toLocaleString(undefined, { minimumFractionDigits: 2 })}
          </p>
        </div>
      );
    }
    return null;
  };

  return (
    <div className="h-full w-full">
      <ResponsiveContainer width="100%" height="100%">
        <AreaChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
          <defs>
            <linearGradient id="splitColor" x1="0" y1="0" x2="0" y2="1">
              <stop offset={off} stopColor="#00ff88" stopOpacity={0.3} />
              <stop offset={off} stopColor="#ff2e63" stopOpacity={0.3} />
            </linearGradient>
          </defs>
          <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis 
            dataKey="dateFormatted" 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            dy={10}
          />
          <YAxis 
            axisLine={false} 
            tickLine={false} 
            tick={{ fill: '#64748b', fontSize: 10, fontWeight: 600 }}
            tickFormatter={(value) => `$${value}`}
          />
          <Tooltip content={<CustomTooltip />} />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <Area
            type="monotone"
            dataKey="pnl"
            strokeWidth={3}
            stroke={off === 1 ? '#00ff88' : off === 0 ? '#ff2e63' : 'url(#splitColorStroke)'}
            fill="url(#splitColor)"
            baseLine={0}
            isAnimationActive={true}
            animationDuration={1500}
          />
          {/* We need a separate gradient for the stroke if we want it to perfectly match the split */}
          <defs>
             <linearGradient id="splitColorStroke" x1="0" y1="0" x2="0" y2="1">
               <stop offset={off} stopColor="#00ff88" stopOpacity={1} />
               <stop offset={off} stopColor="#ff2e63" stopOpacity={1} />
             </linearGradient>
          </defs>
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
};

export default EquityCurve;
