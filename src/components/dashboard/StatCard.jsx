import React from 'react';
import { motion } from 'framer-motion';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';
import {
  AreaChart, Area, ResponsiveContainer,
} from 'recharts';

/**
 * StatCard
 * Props:
 *   label      — string
 *   value      — string (pre-formatted)
 *   subValue   — string (caption below)
 *   trend      — number (positive = up, negative = down)
 *   color      — 'green' | 'red' | 'primary' | 'white'
 *   data       — array of { value } for sparkline (optional)
 */
const colorMap = {
  green: { text: 'text-trading-green', bg: 'bg-trading-green/10', stroke: '#00FF88' },
  red: { text: 'text-trading-red', bg: 'bg-trading-red/10', stroke: '#FF003D' },
  primary: { text: 'text-primary', bg: 'bg-primary/10', stroke: '#FF003D' },
  white: { text: 'text-white', bg: 'bg-white/5', stroke: '#94A3B8' },
};

const StatCard = ({ label, value, subValue, trend, color = 'white', data = [] }) => {
  const c = colorMap[color] || colorMap.white;
  const isUp = trend >= 0;
  const TrendIcon = isUp ? ArrowUpRight : ArrowDownRight;

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="glass-panel p-5 flex flex-col gap-3 relative overflow-hidden group transition-all duration-300
                 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      {/* Label */}
      <span className="text-[9px] font-black uppercase tracking-[0.2em] text-text-muted">{label}</span>

      {/* Value + sparkline */}
      <div className="flex items-end justify-between gap-2">
        <h3 className={`text-xl font-black tracking-tight leading-none ${c.text}`}>{value}</h3>
        {data.length > 1 && (
          <div className="w-16 h-8 shrink-0">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data} margin={{ top: 0, right: 0, left: 0, bottom: 0 }}>
                <defs>
                  <linearGradient id={`sg-${label}`} x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor={c.stroke} stopOpacity={0.3} />
                    <stop offset="100%" stopColor={c.stroke} stopOpacity={0} />
                  </linearGradient>
                </defs>
                <Area
                  type="monotone" dataKey="value"
                  stroke={c.stroke} strokeWidth={1.5}
                  fill={`url(#sg-${label})`} dot={false}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        )}
      </div>

      {/* Trend badge + sub-label */}
      <div className="flex items-center gap-2">
        <div className={`flex items-center gap-0.5 px-1.5 py-0.5 rounded-md text-[9px] font-black
          ${isUp ? 'bg-trading-green/10 text-trading-green' : 'bg-primary/10 text-primary'}`}>
          <TrendIcon className="w-2.5 h-2.5" />
          {Math.abs(trend)}
        </div>
        {subValue && (
          <span className="text-[9px] font-bold text-text-muted tracking-tight">{subValue}</span>
        )}
      </div>

      {/* Hover glow */}
      <div className={`absolute top-0 right-0 w-20 h-20 ${c.bg} blur-3xl rounded-full
                       opacity-0 group-hover:opacity-100 transition-all duration-700 pointer-events-none`} />
    </motion.div>
  );
};

export default StatCard;