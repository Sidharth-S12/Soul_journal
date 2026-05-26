import React from 'react';
import { motion } from 'framer-motion';
import { AreaChart, Area, ResponsiveContainer, BarChart, Bar } from 'recharts';
import { ArrowUpRight, ArrowDownRight, Info } from 'lucide-react';

const data = [
  { v: 10 }, { v: 25 }, { v: 15 }, { v: 30 }, { v: 22 }, { v: 45 }, { v: 38 }, { v: 55 }
];

const StatCard = ({ title, value, change, isPositive, type = "chart", Icon }) => {
  return (
    <motion.div 
      whileHover={{ y: -4, scale: 1.01 }}
      className="glass-panel p-6 group transition-all duration-300 hover:shadow-[0_20px_50px_rgba(0,0,0,0.5)]"
    >
      <div className="flex justify-between items-start mb-4">
        <div className="flex gap-4 items-center">
            <div className="p-3 bg-white/[0.04] border border-white/[0.06] rounded-2xl group-hover:bg-primary/10 group-hover:border-primary/20 transition-all duration-500">
                <Icon className="w-5 h-5 text-text-secondary group-hover:text-primary transition-colors" />
            </div>
            <div>
                <div className="flex items-center gap-1.5 mb-0.5">
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted">{title}</span>
                    <Info className="w-3 h-3 text-white/20 cursor-help hover:text-white/40" />
                </div>
                <h3 className="text-2xl font-black text-white tracking-tight">{value}</h3>
            </div>
        </div>

        {/* Visual Widget (Circular or Chart) */}
        <div className="w-16 h-16 relative">
            {type === 'circular' ? (
                <div className="relative w-full h-full flex items-center justify-center">
                    <svg className="w-full h-full transform -rotate-90">
                        <circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            className="text-white/[0.03]"
                        />
                        <motion.circle
                            cx="32"
                            cy="32"
                            r="28"
                            stroke="currentColor"
                            strokeWidth="4"
                            fill="transparent"
                            strokeDasharray="175.9"
                            initial={{ strokeDashoffset: 175.9 }}
                            animate={{ strokeDashoffset: 175.9 - (175.9 * (parseFloat(value) || 68.4)) / 100 }}
                            transition={{ duration: 2, ease: "easeOut" }}
                            className={`${isPositive ? 'text-trading-green' : 'text-trading-red'} shadow-[0_0_10px_currentColor]`}
                        />
                    </svg>
                    <div className={`absolute inset-0 ${isPositive ? 'bg-trading-green/10' : 'bg-trading-red/10'} blur-xl rounded-full opacity-20`} />
                </div>
            ) : type === 'bars' ? (
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data}>
                        <Bar 
                            dataKey="v" 
                            fill={isPositive ? "#00FF88" : "#FF003D"} 
                            radius={[2, 2, 0, 0]} 
                            className="opacity-40 group-hover:opacity-100 transition-opacity duration-500"
                        />
                    </BarChart>
                </ResponsiveContainer>
            ) : (
                <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={data}>
                        <defs>
                            <linearGradient id={`colorGrad-${title}`} x1="0" y1="0" x2="0" y2="1">
                                <stop offset="5%" stopColor={isPositive ? "#00FF88" : "#FF003D"} stopOpacity={0.4}/>
                                <stop offset="95%" stopColor={isPositive ? "#00FF88" : "#FF003D"} stopOpacity={0}/>
                            </linearGradient>
                        </defs>
                        <Area 
                            type="monotone" 
                            dataKey="v" 
                            stroke={isPositive ? "#00FF88" : "#FF003D"} 
                            strokeWidth={2}
                            fillOpacity={1} 
                            fill={`url(#colorGrad-${title})`} 
                            className="transition-all"
                        />
                    </AreaChart>
                </ResponsiveContainer>
            )}
        </div>
      </div>

      <div className="flex items-center gap-2 pt-2 border-t border-white/[0.03]">
        <div className={`flex items-center px-1.5 py-0.5 rounded-md text-[10px] font-black ${isPositive ? 'text-trading-green bg-trading-green/10' : 'text-trading-red bg-trading-red/10'}`}>
          {isPositive ? <ArrowUpRight className="w-3 h-3 mr-0.5" /> : <ArrowDownRight className="w-3 h-3 mr-0.5" />}
          {change}%
        </div>
        <span className="text-[10px] font-bold text-text-muted tracking-tight">vs last week</span>
      </div>
      
      {/* Background radial glow */}
      <div className={`absolute top-0 right-0 w-24 h-24 ${isPositive ? 'bg-trading-green/5' : 'bg-trading-red/5'} blur-3xl rounded-full opacity-0 group-hover:opacity-100 transition-all duration-700`} />
    </motion.div>
  );
};

export default StatCard;
