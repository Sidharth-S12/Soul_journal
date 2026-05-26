import React from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const CalendarWidget = () => {
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  // Simulating trade results
  const pnlData = days.map((v) => {
      if (v === 18) return 'active'; // Today
      if ([5, 6, 12, 13, 22].includes(v)) return 'win';
      if ([8, 15, 20].includes(v)) return 'loss';
      return 'none';
  });

  return (
    <div className="glass-panel p-7 flex flex-col h-full group">
      <div className="flex justify-between items-center mb-8 pb-4 border-b border-white/[0.03]">
        <div className="flex items-center gap-2">
            <span className="w-1 h-1 rounded-full bg-primary" />
            <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Calendar</h3>
        </div>
        <div className="flex items-center gap-4">
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest">May 2025</span>
          <div className="flex gap-1">
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted transition-colors"><ChevronLeft className="w-3 h-3" /></button>
            <button className="p-1.5 hover:bg-white/5 rounded-lg text-text-muted transition-colors"><ChevronRight className="w-3 h-3" /></button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1.5">
        {['MON', 'TUE', 'WED', 'THU', 'FRI', 'SAT', 'SUN'].map(d => (
          <div key={d} className="text-center text-[8px] font-black text-text-muted mb-3 tracking-widest">{d}</div>
        ))}
        {/* Placeholder empty days for calendar start */}
        {[...Array(3)].map((_, i) => <div key={`empty-${i}`} className="aspect-square" />)}
        
        {days.map((day, i) => (
          <div 
            key={day} 
            className={`
              aspect-square rounded-lg flex items-center justify-center text-[10px] font-bold transition-all cursor-pointer relative group/day
              ${pnlData[i] === 'active' ? 'bg-primary text-white shadow-[0_0_15px_#FF003D]' : 
                pnlData[i] === 'win' ? 'text-trading-green' : 
                pnlData[i] === 'loss' ? 'text-trading-red' : 
                'text-text-secondary hover:bg-white/[0.03]'}
            `}
          >
            {day}
            
            {/* Dots for results */}
            {pnlData[i] === 'win' && <div className="absolute bottom-1 w-0.5 h-0.5 rounded-full bg-trading-green shadow-[0_0_5px_#00FF88]" />}
            {pnlData[i] === 'loss' && <div className="absolute bottom-1 w-0.5 h-0.5 rounded-full bg-trading-red shadow-[0_0_5px_#FF003D]" />}
            
            {pnlData[i] === 'active' && (
                <div className="absolute inset-0 bg-primary/20 blur-md rounded-full animate-pulse z-[-1]" />
            )}
          </div>
        ))}
      </div>

      <div className="flex justify-between items-center mt-auto pt-6 px-1">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-trading-green" />
            <span className="text-[10px] font-bold text-text-muted tracking-tight">Best Day: <span className="text-white">+$1,890</span></span>
          </div>
        </div>
        <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-trading-red" />
            <span className="text-[10px] font-bold text-text-muted tracking-tight">Worst Day: <span className="text-white">-$620</span></span>
        </div>
      </div>
    </div>
  );
};

export default CalendarWidget;
