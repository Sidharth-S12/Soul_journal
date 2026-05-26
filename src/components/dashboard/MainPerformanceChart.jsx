import React, { useState, useCallback } from 'react';
import {
  ComposedChart,
  Area,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { Activity, TrendingUp, TrendingDown, Maximize2, BarChart2 } from 'lucide-react';

// ── Data ─────────────────────────────────────────────────────────────────────
const ALL_DATA = {
  '1W': [
    { time: 'May 12', pnl: -1200, volume: 8, high: -900, low: -1500 },
    { time: 'May 13', pnl: 400, volume: 14, high: 700, low: -200 },
    { time: 'May 14', pnl: 2200, volume: 22, high: 2600, low: 1800 },
    { time: 'May 15', pnl: 2800, volume: 18, high: 3100, low: 2400 },
    { time: 'May 16', pnl: 5200, volume: 31, high: 5600, low: 4700 },
    { time: 'May 17', pnl: 4100, volume: 25, high: 4500, low: 3700 },
    { time: 'May 18', pnl: 4230, volume: 19, high: 4500, low: 3900 },
  ],
  '2W': [
    { time: 'May 05', pnl: -800, volume: 6, high: -500, low: -1100 },
    { time: 'May 06', pnl: -300, volume: 9, high: 100, low: -600 },
    { time: 'May 07', pnl: 900, volume: 11, high: 1100, low: 500 },
    { time: 'May 08', pnl: 600, volume: 8, high: 1000, low: 300 },
    { time: 'May 09', pnl: 1400, volume: 15, high: 1700, low: 1000 },
    { time: 'May 12', pnl: -1200, volume: 8, high: -900, low: -1500 },
    { time: 'May 13', pnl: 400, volume: 14, high: 700, low: -200 },
    { time: 'May 14', pnl: 2200, volume: 22, high: 2600, low: 1800 },
    { time: 'May 15', pnl: 2800, volume: 18, high: 3100, low: 2400 },
    { time: 'May 16', pnl: 5200, volume: 31, high: 5600, low: 4700 },
    { time: 'May 17', pnl: 4100, volume: 25, high: 4500, low: 3700 },
    { time: 'May 18', pnl: 4230, volume: 19, high: 4500, low: 3900 },
  ],
  '1M': [
    { time: 'Apr 18', pnl: -2200, volume: 7, high: -1700, low: -2700 },
    { time: 'Apr 22', pnl: -1500, volume: 9, high: -1100, low: -1900 },
    { time: 'Apr 25', pnl: -400, volume: 10, high: 100, low: -800 },
    { time: 'Apr 28', pnl: 800, volume: 13, high: 1100, low: 400 },
    { time: 'May 01', pnl: 1600, volume: 17, high: 2000, low: 1200 },
    { time: 'May 05', pnl: 900, volume: 11, high: 1300, low: 600 },
    { time: 'May 09', pnl: 1400, volume: 15, high: 1700, low: 1000 },
    { time: 'May 12', pnl: -1200, volume: 8, high: -900, low: -1500 },
    { time: 'May 14', pnl: 2200, volume: 22, high: 2600, low: 1800 },
    { time: 'May 16', pnl: 5200, volume: 31, high: 5600, low: 4700 },
    { time: 'May 18', pnl: 4230, volume: 19, high: 4500, low: 3900 },
  ],
};

const RANGES = ['1W', '2W', '1M'];

// ── Custom Tooltip ────────────────────────────────────────────────────────────
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  const pnl = payload.find(p => p.dataKey === 'pnl')?.value;
  const volume = payload.find(p => p.dataKey === 'volume')?.value;
  const entry = payload[0]?.payload;
  const profit = pnl >= 0;

  return (
    <motion.div
      initial={{ opacity: 0, y: 4, scale: 0.97 }}
      animate={{ opacity: 1, y: 0, scale: 1 }}
      className="pointer-events-none"
    >
      <div
        style={{
          background: 'rgba(5, 8, 22, 0.96)',
          border: `1px solid ${profit ? 'rgba(0,255,136,0.25)' : 'rgba(255,0,61,0.25)'}`,
          borderRadius: 12,
          padding: '12px 16px',
          boxShadow: `0 8px 32px rgba(0,0,0,0.6), 0 0 0 1px ${profit ? 'rgba(0,255,136,0.06)' : 'rgba(255,0,61,0.06)'}`,
          minWidth: 170,
        }}
      >
        {/* Date header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 10 }}>
          <div style={{ width: 6, height: 6, borderRadius: '50%', background: profit ? '#00FF88' : '#FF003D', boxShadow: `0 0 6px ${profit ? '#00FF88' : '#FF003D'}` }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: '#64748B', letterSpacing: '0.15em', textTransform: 'uppercase' }}>{label}</span>
        </div>

        {/* P&L row */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'baseline', marginBottom: 6 }}>
          <span style={{ fontSize: 10, color: '#64748B', fontWeight: 700, letterSpacing: '0.1em' }}>NET P&L</span>
          <span style={{ fontSize: 16, fontWeight: 900, color: profit ? '#00FF88' : '#FF003D', letterSpacing: '-0.02em' }}>
            {profit ? '+' : ''}${pnl?.toLocaleString()}
          </span>
        </div>

        {/* High / Low */}
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 8, gap: 16 }}>
          <div>
            <div style={{ fontSize: 9, color: '#64748B', fontWeight: 700, marginBottom: 2 }}>HIGH</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#00FF88' }}>+${entry?.high?.toLocaleString()}</div>
          </div>
          <div style={{ textAlign: 'right' }}>
            <div style={{ fontSize: 9, color: '#64748B', fontWeight: 700, marginBottom: 2 }}>LOW</div>
            <div style={{ fontSize: 11, fontWeight: 800, color: '#FF003D' }}>${entry?.low?.toLocaleString()}</div>
          </div>
        </div>

        {/* Divider */}
        <div style={{ height: 1, background: 'rgba(255,255,255,0.04)', margin: '8px 0' }} />

        {/* Volume */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <span style={{ fontSize: 9, color: '#64748B', fontWeight: 700, letterSpacing: '0.1em' }}>VOLUME</span>
          <span style={{ fontSize: 11, fontWeight: 800, color: '#94A3B8' }}>{volume} trades</span>
        </div>
      </div>
    </motion.div>
  );
};

// ── Stat Pill ─────────────────────────────────────────────────────────────────
const StatPill = ({ label, value, color }) => (
  <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
    <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, boxShadow: `0 0 6px ${color}` }} />
    <span style={{ fontSize: 10, fontWeight: 700, color: '#64748B', letterSpacing: '0.1em', textTransform: 'uppercase' }}>{label}</span>
    <span style={{ fontSize: 11, fontWeight: 900, color: color, marginLeft: 2 }}>{value}</span>
  </div>
);

// ── Custom Y-Axis Tick ────────────────────────────────────────────────────────
const YTick = ({ x, y, payload }) => (
  <text x={x} y={y} fill="#334155" fontSize={9} fontWeight={700} textAnchor="end" dominantBaseline="middle">
    {payload.value >= 0 ? `$${(payload.value / 1000).toFixed(0)}k` : `-$${Math.abs(payload.value / 1000).toFixed(0)}k`}
  </text>
);

// ── Custom Active Dot — color based on hovered point's PnL ───────────────────
const CustomActiveDot = (props) => {
  const { cx, cy, payload } = props;
  const isProfit = payload?.pnl >= 0;
  const color = isProfit ? '#00FF88' : '#FF003D';
  const glowColor = isProfit ? 'rgba(0,255,136,0.35)' : 'rgba(255,0,61,0.35)';

  return (
    <g>
      {/* Outer glow ring */}
      <circle cx={cx} cy={cy} r={10} fill={glowColor} />
      {/* Inner solid dot */}
      <circle cx={cx} cy={cy} r={5} fill={color} stroke={color} strokeWidth={1.5} />
      {/* Center white core */}
      <circle cx={cx} cy={cy} r={2} fill="#ffffff" opacity={0.9} />
    </g>
  );
};

// ── Custom Cursor — color based on hovered point's PnL ───────────────────────
const CustomCursor = ({ points, height, payload }) => {
  if (!points?.length) return null;
  const { x, y } = points[0];
  const pnl = payload?.[0]?.payload?.pnl;
  const isProfit = pnl >= 0;
  const color = isProfit ? 'rgba(0,255,136,0.25)' : 'rgba(255,0,61,0.25)';
  const solidColor = isProfit ? 'rgba(0,255,136,0.6)' : 'rgba(255,0,61,0.6)';

  return (
    <g>
      {/* Dashed vertical line only */}
      <line
        x1={x} y1={0}
        x2={x} y2={height}
        stroke={solidColor}
        strokeWidth={1}
        strokeDasharray="4 4"
      />
    </g>
  );
};

// ── Main Component ────────────────────────────────────────────────────────────
const MainPerformanceChart = () => {
  const [range, setRange] = useState('1W');
  const [hovered, setHovered] = useState(false);

  const data = ALL_DATA[range];
  const current = data[data.length - 1].pnl;
  const first = data[0].pnl;
  const change = (((current - first) / Math.abs(first || 1)) * 100).toFixed(1);
  const profit = current >= 0;

  const pnlVals = data.map(d => d.pnl);
  const maxVal = Math.max(...pnlVals);
  const minVal = Math.min(...pnlVals);
  const zeroOffset = maxVal > 0 && minVal < 0
    ? maxVal / (maxVal - minVal)
    : maxVal <= 0 ? 0 : 1;

  const volumeVals = data.map(d => d.volume);
  const maxVol = Math.max(...volumeVals);

  const onMouseEnter = useCallback(() => setHovered(true), []);
  const onMouseLeave = useCallback(() => setHovered(false), []);

  return (
    <div
      className="glass-panel relative overflow-hidden"
      style={{ height: 500, display: 'flex', flexDirection: 'column', padding: '28px 28px 20px' }}
    >
      {/* Background glow */}
      <div style={{
        position: 'absolute', top: '-20%', right: '-10%',
        width: 500, height: 500,
        background: profit ? 'radial-gradient(circle, rgba(0,255,136,0.04) 0%, transparent 70%)' : 'radial-gradient(circle, rgba(255,0,61,0.05) 0%, transparent 70%)',
        filter: 'blur(60px)', pointerEvents: 'none', zIndex: 0,
      }} />

      {/* ── Header ── */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 20, position: 'relative', zIndex: 1 }}>

        {/* Left: title + P&L */}
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 12 }}>
            <div style={{
              width: 28, height: 28, borderRadius: 8,
              background: 'rgba(0,255,136,0.08)',
              border: '1px solid rgba(0,255,136,0.15)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
            }}>
              <Activity style={{ width: 13, height: 13, color: '#00FF88' }} />
            </div>
            <span style={{ fontSize: 10, fontWeight: 800, color: '#475569', letterSpacing: '0.2em', textTransform: 'uppercase' }}>
              Performance Overview
            </span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <span style={{ fontSize: 40, fontWeight: 900, color: '#ffffff', letterSpacing: '-0.04em', lineHeight: 1 }}>
              {profit ? '+' : ''}${current.toLocaleString()}
            </span>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 5,
              background: profit ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,61,0.1)',
              border: `1px solid ${profit ? 'rgba(0,255,136,0.2)' : 'rgba(255,0,61,0.2)'}`,
              borderRadius: 8, padding: '4px 10px',
            }}>
              {profit
                ? <TrendingUp style={{ width: 12, height: 12, color: '#00FF88' }} />
                : <TrendingDown style={{ width: 12, height: 12, color: '#FF003D' }} />}
              <span style={{ fontSize: 11, fontWeight: 900, color: profit ? '#00FF88' : '#FF003D' }}>
                {profit ? '+' : ''}{change}%
              </span>
            </div>
          </div>

          {/* Stat pills */}
          <div style={{ display: 'flex', gap: 18, marginTop: 10 }}>
            <StatPill label="Best" value="+$5,200" color="#00FF88" />
            <StatPill label="Worst" value="-$1,200" color="#FF003D" />
            <StatPill label="Avg" value="+$2,390" color="#94A3B8" />
          </div>
        </div>

        {/* Right: range selector + icons */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 10 }}>
          <div style={{ display: 'flex', background: 'rgba(255,255,255,0.03)', borderRadius: 10, padding: 3, border: '1px solid rgba(255,255,255,0.06)' }}>
            {RANGES.map(r => (
              <button
                key={r}
                onClick={() => setRange(r)}
                style={{
                  padding: '5px 14px', borderRadius: 7, fontSize: 10, fontWeight: 800,
                  letterSpacing: '0.05em', border: 'none', cursor: 'pointer',
                  background: range === r ? '#00FF88' : 'transparent',
                  color: range === r ? '#050816' : '#475569',
                  transition: 'all 0.2s',
                }}
              >
                {r}
              </button>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 6 }}>
            {[BarChart2, Maximize2].map((Icon, i) => (
              <button key={i} style={{
                width: 32, height: 32, borderRadius: 8, border: '1px solid rgba(255,255,255,0.06)',
                background: 'rgba(255,255,255,0.03)', display: 'flex', alignItems: 'center',
                justifyContent: 'center', cursor: 'pointer', color: '#475569',
              }}>
                <Icon style={{ width: 14, height: 14 }} />
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Chart ── */}
      <div style={{ flex: 1, position: 'relative', zIndex: 1 }} onMouseEnter={onMouseEnter} onMouseLeave={onMouseLeave}>
        <AnimatePresence mode="wait">
          <motion.div
            key={range}
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.3 }}
            style={{ width: '100%', height: '100%' }}
          >
            <ResponsiveContainer width="100%" height="100%">
              <ComposedChart data={data} margin={{ top: 8, right: 12, left: 0, bottom: 0 }}
                onMouseMove={() => { }} onMouseLeave={() => { }}>

                <defs>
                  {/* Main P&L gradient — green above zero, red below */}
                  <linearGradient id="pnlFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="rgba(0,255,136,0.30)" />
                    <stop offset={`${zeroOffset * 100}%`} stopColor="rgba(0,255,136,0.04)" />
                    <stop offset={`${zeroOffset * 100}%`} stopColor="rgba(255,0,61,0.04)" />
                    <stop offset="100%" stopColor="rgba(255,0,61,0.28)" />
                  </linearGradient>

                  {/* Stroke gradient */}
                  <linearGradient id="pnlStroke" x1="0" y1="0" x2="0" y2="1">
                    <stop offset={`${zeroOffset * 100}%`} stopColor="#00FF88" />
                    <stop offset={`${zeroOffset * 100}%`} stopColor="#FF003D" />
                  </linearGradient>

                  {/* Volume bar gradient */}
                  <linearGradient id="volFill" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={profit ? 'rgba(0,255,136,0.5)' : 'rgba(255,0,61,0.5)'} />
                    <stop offset="100%" stopColor={profit ? 'rgba(0,255,136,0.1)' : 'rgba(255,0,61,0.1)'} />
                  </linearGradient>

                  {/* Glow filter */}
                  <filter id="lineGlow">
                    <feGaussianBlur stdDeviation="2.5" result="blur" />
                    <feMerge>
                      <feMergeNode in="blur" />
                      <feMergeNode in="SourceGraphic" />
                    </feMerge>
                  </filter>
                </defs>

                <CartesianGrid
                  strokeDasharray="1 4"
                  stroke="rgba(255,255,255,0.04)"
                  vertical={false}
                />

                {/* Zero reference line */}
                <ReferenceLine
                  y={0}
                  stroke="rgba(255,255,255,0.12)"
                  strokeDasharray="4 4"
                  strokeWidth={1}
                />

                <XAxis
                  dataKey="time"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fill: '#334155', fontSize: 9, fontWeight: 800, letterSpacing: '0.05em' }}
                  dy={10}
                />

                {/* Left Y-axis: P&L */}
                <YAxis
                  yAxisId="pnl"
                  axisLine={false}
                  tickLine={false}
                  tick={<YTick />}
                  width={38}
                  domain={['auto', 'auto']}
                />

                {/* Right Y-axis: Volume (hidden ticks) */}
                <YAxis
                  yAxisId="vol"
                  orientation="right"
                  axisLine={false}
                  tickLine={false}
                  tick={false}
                  width={10}
                  domain={[0, maxVol * 5]}
                />

                <Tooltip
                  content={<CustomTooltip />}
                  cursor={<CustomCursor />}
                />

                {/* Volume bars (behind the area) */}
                <Bar
                  yAxisId="vol"
                  dataKey="volume"
                  fill="url(#volFill)"
                  radius={[3, 3, 0, 0]}
                  maxBarSize={16}
                  opacity={0.6}
                />

                {/* Main P&L area */}
                <Area
                  yAxisId="pnl"
                  type="monotoneX"
                  dataKey="pnl"
                  stroke="url(#pnlStroke)"
                  strokeWidth={2.5}
                  fill="url(#pnlFill)"
                  fillOpacity={1}
                  dot={false}
                  activeDot={<CustomActiveDot />}
                  animationDuration={800}
                  animationEasing="ease-out"
                  filter="url(#lineGlow)"
                />
              </ComposedChart>
            </ResponsiveContainer>
          </motion.div>
        </AnimatePresence>

        {/* Live price badge — bottom right of chart */}
        <motion.div
          animate={{ opacity: [0.7, 1, 0.7] }}
          transition={{ repeat: Infinity, duration: 2 }}
          style={{
            position: 'absolute', bottom: 28, right: 16,
            display: 'flex', alignItems: 'center', gap: 6,
            background: 'rgba(5,8,22,0.9)',
            border: `1px solid ${profit ? 'rgba(0,255,136,0.2)' : 'rgba(255,0,61,0.2)'}`,
            borderRadius: 8, padding: '5px 10px',
            backdropFilter: 'blur(12px)',
          }}
        >
          <div style={{ width: 5, height: 5, borderRadius: '50%', background: profit ? '#00FF88' : '#FF003D', boxShadow: `0 0 6px ${profit ? '#00FF88' : '#FF003D'}` }} />
          <span style={{ fontSize: 10, fontWeight: 800, color: profit ? '#00FF88' : '#FF003D', letterSpacing: '0.05em' }}>
            LIVE · {profit ? '+' : ''}${current.toLocaleString()}
          </span>
        </motion.div>
      </div>

      {/* ── Footer legend ── */}
      <div style={{ display: 'flex', gap: 20, paddingTop: 12, borderTop: '1px solid rgba(255,255,255,0.04)', marginTop: 4, position: 'relative', zIndex: 1 }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 2, background: 'linear-gradient(90deg, #00FF88, rgba(0,255,136,0.3))', borderRadius: 2 }} />
          <span style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Profit Zone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <div style={{ width: 20, height: 2, background: 'linear-gradient(90deg, #FF003D, rgba(255,0,61,0.3))', borderRadius: 2 }} />
          <span style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Drawdown Zone</span>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginLeft: 4 }}>
          <div style={{ width: 10, height: 8, background: profit ? 'rgba(0,255,136,0.35)' : 'rgba(255,0,61,0.35)', borderRadius: 2 }} />
          <span style={{ fontSize: 9, fontWeight: 800, color: '#475569', letterSpacing: '0.12em', textTransform: 'uppercase' }}>Volume</span>
        </div>
      </div>
    </div>
  );
};

export default MainPerformanceChart;