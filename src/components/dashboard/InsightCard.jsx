import React from 'react';
import { motion } from 'framer-motion';
import { Quote } from 'lucide-react';

const InsightCard = () => {
  return (
    <div className="glass-panel relative h-full min-h-[250px] flex flex-col justify-end overflow-hidden p-8 group">
      {/* Cinematic Background Image - Using a stylized samurai/red sun aesthetic */}
      <div className="absolute inset-0 z-0">
        <img 
            src="https://images.unsplash.com/photo-1549490349-8643362247b5?auto=format&fit=crop&q=80&w=600" 
            alt="Bushido" 
            className="w-full h-full object-cover grayscale opacity-40 mix-blend-luminosity group-hover:scale-105 transition-transform duration-[2s]"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-bg-deepest via-bg-deepest/60 to-transparent" />
        
        {/* Red Sun Effect */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-primary opacity-20 blur-[80px] rounded-full animate-glow-pulse" />
        <div className="absolute top-10 right-10 w-24 h-24 border border-primary/20 rounded-full animate-spin-slow opacity-30" />
      </div>

      <div className="relative z-10">
        <motion.div 
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true }}
          className="mb-4"
        >
          <div className="flex items-center gap-3">
              <Quote className="w-5 h-5 text-primary rotate-180" />
              <span className="text-[10px] font-black text-text-muted uppercase tracking-[0.3em]">Daily Insight</span>
          </div>
        </motion.div>
        
        <h3 className="text-xl font-heading font-black text-white leading-tight mb-4 max-w-[200px] group-hover:translate-x-1 transition-transform">
          The market rewards consistency, not ego.
        </h3>
        
        <div className="flex items-center gap-2">
            <div className="h-[1px] w-4 bg-primary" />
            <p className="text-primary text-[10px] font-black uppercase tracking-widest">- Soul</p>
        </div>
      </div>

      {/* Decorative pulse at the bottom */}
      <div className="absolute bottom-[-20%] left-[-10%] w-[200%] h-1 bg-primary/20 blur-sm animate-glow-pulse" />
    </div>
  );
};

export default InsightCard;
