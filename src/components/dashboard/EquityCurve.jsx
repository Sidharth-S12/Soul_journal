import React from 'react';
import {
  AreaChart, Area, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer, ReferenceLine,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  const profit = val >= 0;
  return (
    <div className="bg-bg-darker/95 border border-white/10 rounded-xl px-4 py-3 shadow-2xl text-xs">
      <p className="text-text-muted mb-1 font-bold">{label}</p>
      <p className={`font-black text-sm ${profit ? 'text-trading-green' : 'text-primary'}`}>
        {profit ? '+' : ''}${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      {payload[1] && (
        <p className={`font-black text-xs mt-1 ${payload[1].value >= 0 ? 'text-trading-green/70' : 'text-primary/70'}`}>
          Day: {payload[1].value >= 0 ? '+' : ''}${Math.abs(payload[1].value).toLocaleString('en-US', { minimumFractionDigits: 2 })}
        </p>
      )}
    </div>
  );
};

// Custom dot — glows on the last point
const CustomDot = ({ cx, cy, index, data, color }) => {
  if (index !== data.length - 1) return null;
  return (
    <g>
      <circle cx={cx} cy={cy} r={5} fill={color} opacity={0.9} />
      <circle cx={cx} cy={cy} r={10} fill={color} opacity={0.15} />
    </g>
  );
};

const EquityCurve = ({ data = [] }) => {
  if (!data.length) {
    return (
      <div className="flex flex-col items-center justify-center h-full gap-3 opacity-25">
        <BarChart2 className="w-8 h-8 text-text-muted" />
        <p className="text-[10px] font-black text-text-muted uppercase tracking-[0.2em]">
          Log your first trade to see your equity curve
        </p>
      </div>
    );
  }

  const lastVal = data[data.length - 1]?.cumPnl || 0;
  const isProfit = lastVal >= 0;
  const lineColor = isProfit ? '#00FF88' : '#FF003D';

  // Calculate zero offset for gradient split
  const maxV = Math.max(...data.map(d => d.cumPnl));
  const minV = Math.min(...data.map(d => d.cumPnl));
  const zeroOff = maxV > 0 && minV < 0 ? maxV / (maxV - minV) : maxV <= 0 ? 0 : 1;

  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart data={data} margin={{ top: 10, right: 10, left: -10, bottom: 0 }}>
        <defs>
          <linearGradient id="ecFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="rgba(0,255,136,0.25)" />
            <stop offset={`${zeroOff * 100}%`} stopColor="rgba(0,255,136,0.03)" />
            <stop offset={`${zeroOff * 100}%`} stopColor="rgba(255,0,61,0.03)" />
            <stop offset="100%" stopColor="rgba(255,0,61,0.22)" />
          </linearGradient>
          <linearGradient id="ecStroke" x1="0" y1="0" x2="0" y2="1">
            <stop offset={`${zeroOff * 100}%`} stopColor="#00FF88" />
            <stop offset={`${zeroOff * 100}%`} stopColor="#FF003D" />
          </linearGradient>
          <filter id="ecGlow">
            <feGaussianBlur stdDeviation="2" result="blur" />
            <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
          </filter>
        </defs>

        <CartesianGrid strokeDasharray="2 6" stroke="rgba(255,255,255,0.03)" vertical={false} />

        <XAxis
          dataKey="date"
          axisLine={false} tickLine={false}
          tick={{ fill: '#334155', fontSize: 9, fontWeight: 700 }}
          interval="preserveStartEnd"
          dy={8}
        />
        <YAxis
          axisLine={false} tickLine={false}
          tick={{ fill: '#334155', fontSize: 9, fontWeight: 700 }}
          tickFormatter={v => `$${v >= 0 ? '' : '-'}${Math.abs(v) >= 1000 ? (Math.abs(v) / 1000).toFixed(1) + 'k' : Math.abs(v)}`}
          width={52}
        />

        <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeDasharray="4 4" strokeWidth={1} />

        <Tooltip content={<CustomTooltip />}
          cursor={{ stroke: 'rgba(255,255,255,0.08)', strokeWidth: 1, strokeDasharray: '4 4' }} />

        {/* Daily P&L subtle bars behind the line */}
        <Area
          type="monotone" dataKey="pnl"
          stroke="transparent"
          fill="rgba(255,255,255,0.02)"
          dot={false} activeDot={false}
        />

        {/* Main cumulative equity line */}
        <Area
          type="monotoneX"
          dataKey="cumPnl"
          stroke="url(#ecStroke)"
          strokeWidth={2.5}
          fill="url(#ecFill)"
          fillOpacity={1}
          dot={false}
          filter="url(#ecGlow)"
          activeDot={{
            r: 5,
            fill: lineColor,
            stroke: `${lineColor}44`,
            strokeWidth: 8,
          }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

export default EquityCurve;