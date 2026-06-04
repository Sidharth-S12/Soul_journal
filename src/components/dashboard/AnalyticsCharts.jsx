import React from 'react';
import {
  PieChart, Pie, Cell, Tooltip, ResponsiveContainer,
  BarChart, Bar, XAxis, YAxis, CartesianGrid, ReferenceLine,
} from 'recharts';
import { BarChart2 } from 'lucide-react';

// ── Shared empty state ────────────────────────────────────────────────────────
const Empty = ({ msg }) => (
  <div className="flex flex-col items-center justify-center h-full gap-2 opacity-25">
    <BarChart2 className="w-5 h-5 text-text-muted" />
    <p className="text-[9px] font-black text-text-muted uppercase tracking-[0.15em]">{msg}</p>
  </div>
);

// ── WinLossDonut ──────────────────────────────────────────────────────────────
const DonutTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-bg-darker/95 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p style={{ color: payload[0].payload.fill }} className="font-black">
        {payload[0].name}: {payload[0].value}
      </p>
    </div>
  );
};

export const WinLossDonut = ({ wins = 0, losses = 0 }) => {
  const total = wins + losses;
  if (!total) {
    return <Empty msg="No trades yet" />;
  }

  const data = [
    { name: 'Wins', value: wins, fill: '#00FF88' },
    { name: 'Losses', value: losses, fill: '#FF003D' },
  ];
  const winRate = Math.round((wins / total) * 100);

  return (
    <div className="relative h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <PieChart>
          <Pie
            data={data}
            cx="50%" cy="50%"
            innerRadius={55} outerRadius={80}
            startAngle={90} endAngle={-270}
            paddingAngle={3}
            dataKey="value"
            strokeWidth={0}
          >
            {data.map((entry, i) => (
              <Cell key={i} fill={entry.fill} opacity={0.85} />
            ))}
          </Pie>
          <Tooltip content={<DonutTooltip />} />
        </PieChart>
      </ResponsiveContainer>

      {/* Centre label */}
      <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
        <span className="text-2xl font-black text-white leading-none">{winRate}%</span>
        <span className="text-[9px] font-black text-text-muted uppercase tracking-widest mt-0.5">Win Rate</span>
      </div>
    </div>
  );
};

// ── DailyPnLBar ───────────────────────────────────────────────────────────────
const BarTip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const val = payload[0]?.value;
  return (
    <div className="bg-bg-darker/95 border border-white/10 rounded-lg px-3 py-2 text-xs shadow-xl">
      <p className="text-text-muted mb-1">{label}</p>
      <p className={`font-black ${val >= 0 ? 'text-trading-green' : 'text-primary'}`}>
        {val >= 0 ? '+' : ''}${Math.abs(val).toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
    </div>
  );
};

export const DailyPnLBar = ({ data = [] }) => {
  if (!data.length) return <div className="h-[180px]"><Empty msg="No P&L data yet" /></div>;

  return (
    <div className="h-[180px]">
      <ResponsiveContainer width="100%" height="100%">
        <BarChart data={data} margin={{ top: 4, right: 4, left: -28, bottom: 0 }}>
          <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.03)" vertical={false} />
          <XAxis
            dataKey="date"
            tick={{ fill: '#334155', fontSize: 8, fontWeight: 700 }}
            axisLine={false} tickLine={false}
            interval="preserveStartEnd"
          />
          <YAxis
            tick={{ fill: '#334155', fontSize: 8, fontWeight: 700 }}
            axisLine={false} tickLine={false}
            tickFormatter={v => `$${v}`}
          />
          <ReferenceLine y={0} stroke="rgba(255,255,255,0.1)" strokeWidth={1} />
          <Tooltip content={<BarTip />} cursor={{ fill: 'rgba(255,255,255,0.03)' }} />
          <Bar
            dataKey="pnl"
            maxBarSize={16}
            radius={[3, 3, 0, 0]}
            shape={(props) => {
              const { x, y, width, height, value } = props;
              const color = value >= 0 ? '#00FF88' : '#FF003D';
              const barY = value >= 0 ? y : y + height;
              const barH = Math.abs(height);
              return (
                <rect x={x} y={barY} width={width} height={Math.max(barH, 1)}
                  fill={color} rx={3} opacity={0.8} />
              );
            }}
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
};