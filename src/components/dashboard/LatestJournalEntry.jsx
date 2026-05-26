import React from 'react';
import { motion } from 'framer-motion';
import { PenLine, ArrowUpRight, Hash } from 'lucide-react';

const LatestJournalEntry = () => {
  return (
    <div className="glass-panel p-8 h-full flex flex-col group relative overflow-hidden">
        <div className="flex justify-between items-start mb-8">
            <div className="flex items-center gap-3">
                <div className="p-2 bg-white/[0.03] rounded-lg border border-white/5">
                    <PenLine className="w-4 h-4 text-text-secondary" />
                </div>
                <h3 className="text-xs font-black text-white uppercase tracking-[0.2em]">Latest Journal Entry</h3>
            </div>
            <button className="text-white/20 hover:text-white/60 transition-colors">
                <ArrowUpRight className="w-4 h-4" />
            </button>
        </div>

        <div className="relative mb-6">
            <span className="text-4xl text-white/5 absolute -top-4 -left-2 font-serif">"</span>
            <p className="text-sm font-medium text-text-secondary leading-relaxed pl-4 line-clamp-4">
                Took a clean long after liquidity sweep on 15m. Waited for confirmation on OB + FVG. Execution was patient. Managed risk well.
            </p>
        </div>

        <div className="flex flex-wrap gap-2 mt-auto">
            {['Discipline', 'Patience', 'ICT'].map((tag) => (
                <div key={tag} className="flex items-center gap-1 px-3 py-1 bg-primary/10 border border-primary/20 rounded-full">
                    <Hash className="w-2.5 h-2.5 text-primary" />
                    <span className="text-[9px] font-black text-primary uppercase tracking-tighter">{tag}</span>
                </div>
            ))}
        </div>

        <div className="flex justify-between items-center mt-6 pt-6 border-t border-white/[0.03]">
            <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold text-text-muted">May 18, 2025</span>
                <div className="w-1 h-1 rounded-full bg-text-muted opacity-30" />
                <span className="text-[10px] font-bold text-text-muted">10:45 PM</span>
            </div>
        </div>
    </div>
  );
};

export default LatestJournalEntry;
