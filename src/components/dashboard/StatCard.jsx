import React from 'react';
import { motion } from 'framer-motion';
import { Info, TrendingUp, TrendingDown } from 'lucide-react';
import { AreaChart, Area, ResponsiveContainer } from 'recharts';

const StatCard = ({ label, value, subValue, trend, data = [], color = 'primary' }) => {
  const isPositive = trend > 0;
  const chartColor = color === 'green' ? '#00ff88' : color === 'red' ? '#ff2e63' : '#ff003c';

  return (
    <motion.div
      whileHover={{ y: -2 }}
      className="glass-panel p-5 min-w-0"
    >
      <div className="flex justify-between items-start mb-4">
        <div>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</span>
            <Info className="w-3 h-3 text-white/10" />
          </div>
          <h3 className={`text-2xl font-black tracking-tight ${color === 'green' ? 'text-trading-green' : color === 'red' ? 'text-trading-red' : 'text-white'}`}>
            {value}
          </h3>
          {subValue && (
            <div className="flex items-center gap-1 mt-1">
              <span className={`text-[10px] font-bold ${isPositive ? 'text-trading-green' : 'text-trading-red'}`}>
                {isPositive ? '+' : ''}{trend}%
              </span>
              <span className="text-[10px] text-text-muted font-medium">{subValue}</span>
            </div>
          )}
        </div>
        <div className={`p-2 rounded-lg bg-${color}/10 border border-${color}/20`}>
          {isPositive ? (
            <TrendingUp className={`w-4 h-4 text-${color === 'green' ? 'trading-green' : 'primary'}`} />
          ) : (
            <TrendingDown className={`w-4 h-4 text-${color === 'red' ? 'trading-red' : 'primary'}`} />
          )}
        </div>
      </div>

      <div className="h-12 w-full mt-2">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <defs>
              <linearGradient id={`grad-${label}`} x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor={chartColor} stopOpacity={0.2} />
                <stop offset="100%" stopColor={chartColor} stopOpacity={0} />
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="value"
              stroke={chartColor}
              strokeWidth={2}
              fill={`url(#grad-${label})`}
              dot={false}
              isAnimationActive={true}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default StatCard;
