import React from 'react';
import { motion } from 'framer-motion';
import { HiFire } from 'react-icons/hi';

const StreakCard = () => {
  return (
    <div className="glass-card p-6 flex items-center gap-6 group hover:border-primary/20 transition-all">
      <div className="relative">
        <div className="absolute inset-0 bg-primary/40 blur-2xl rounded-full animate-pulse-glow" />
        <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-primary-danger flex items-center justify-center shadow-[0_0_20px_rgba(255,0,60,0.4)]">
          <HiFire className="text-3xl text-white shadow-xl" />
        </div>
      </div>
      
      <div className="flex-1">
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-text-muted mb-1">Current Streak</p>
        <h3 className="text-3xl font-black text-white leading-none">12 <span className="text-sm font-medium text-text-muted uppercase tracking-normal">Days</span></h3>
        
        <div className="flex gap-1 mt-3">
          {[...Array(7)].map((_, i) => (
            <div 
              key={i} 
              className={`h-1.5 flex-1 rounded-full ${i < 5 ? 'bg-primary shadow-[0_0_8px_rgba(255,0,60,0.4)]' : 'bg-white/10'}`} 
            />
          ))}
        </div>
        <p className="text-[10px] text-text-muted mt-2 font-medium">Keep it up! Your longest is 24 days.</p>
      </div>
    </div>
  );
};

export default StreakCard;
