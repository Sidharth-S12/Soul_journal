import React from 'react';
import { motion } from 'framer-motion';

const TradingBackground = () => {
  return (
    <div className="fixed inset-0 z-[-1] overflow-hidden bg-bg-darker pointer-events-none">
      {/* Grid Overlay */}
      <div className="absolute inset-0 trading-grid opacity-20" />
      
      {/* Animated Glows */}
      <motion.div 
        className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] bg-primary/10 blur-[120px] rounded-full"
        animate={{
          scale: [1, 1.2, 1],
          opacity: [0.3, 0.5, 0.3],
          x: [0, 50, 0],
          y: [0, 30, 0],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut" }}
      />
      
      <motion.div 
        className="absolute top-[20%] -right-[5%] w-[30%] h-[30%] bg-primary-glow/5 blur-[100px] rounded-full"
        animate={{
          scale: [1, 1.3, 1],
          opacity: [0.2, 0.4, 0.2],
          x: [0, -40, 0],
          y: [0, 60, 0],
        }}
        transition={{ duration: 15, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />

      <motion.div 
        className="absolute -bottom-[10%] left-[20%] w-[50%] h-[50%] bg-blue-500/5 blur-[150px] rounded-full"
        animate={{
          scale: [1, 1.1, 1],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 12, repeat: Infinity, ease: "easeInOut", delay: 5 }}
      />

      {/* Subtle Candlestick silhouettes */}
      <div className="absolute inset-0 opacity-[0.03] select-none">
        <div className="flex items-end justify-around h-full px-10">
          {[...Array(20)].map((_, i) => (
            <div key={i} className="flex flex-col items-center gap-1">
              <div className="w-[1px] h-20 bg-primary" />
              <div className={`w-3 ${i % 3 === 0 ? 'h-32' : 'h-16'} bg-primary rounded-sm`} />
              <div className="w-[1px] h-10 bg-primary" />
            </div>
          ))}
        </div>
      </div>
      
      {/* Dark Vignette */}
      <div className="absolute inset-0 bg-radial-gradient(circle at center, transparent 0%, rgba(5, 8, 22, 0.8) 100%)" />
    </div>
  );
};

export default TradingBackground;
