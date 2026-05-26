import React from 'react';
import { Search, Bell, ChevronDown, Command, Calendar } from 'lucide-react';
import { motion } from 'framer-motion';

const Navbar = () => {
  return (
    <header className="h-20 flex items-center justify-between px-10 sticky top-0 z-40 bg-bg-deepest/50 backdrop-blur-xl border-b border-white/[0.03]">
      <div className="flex-1 hidden md:block">
          <div className="flex items-center gap-2">
            <span className="text-2xl font-black text-white">Welcome back, <span className="text-primary-glow">Soul Trader.</span></span>
            <span className="w-2 h-2 rounded-full bg-primary-deep shadow-[0_0_8px_#FF003D] animate-pulse" />
          </div>
          <p className="text-text-secondary text-sm font-medium mt-1">Log your edge. Review with honesty. Evolve daily.</p>
      </div>

      <div className="flex-1 flex justify-center">
        <div className="relative group w-full max-w-lg">
          <div className="absolute inset-y-0 left-5 flex items-center pointer-events-none">
            <Search className="w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
          </div>
          <input 
            type="text" 
            placeholder="Search trades, notes, tags..." 
            className="w-full bg-white/[0.03] border border-white/5 rounded-full py-3 pl-12 pr-12 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/30 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)] transition-all placeholder:text-text-muted font-medium"
          />
          <div className="absolute inset-y-0 right-5 flex items-center gap-1.5 pointer-events-none">
            <div className="flex items-center gap-0.5 px-1.5 py-0.5 bg-white/5 border border-white/10 rounded text-[10px] text-text-muted font-bold">
                <Command className="w-2.5 h-2.5" />
                <span>K</span>
            </div>
          </div>
        </div>
      </div>

      <div className="flex-1 flex items-center justify-end gap-6">
        <div className="flex items-center gap-2 bg-white/[0.03] border border-white/5 rounded-2xl px-4 py-2 cursor-pointer hover:bg-white/[0.06] transition-all group">
          <Calendar className="w-4 h-4 text-text-muted group-hover:text-primary" />
          <span className="text-xs font-bold text-white flex items-center gap-1.5">
            This Week <ChevronDown className="w-3 h-3" />
          </span>
        </div>

        <button className="relative p-2.5 rounded-full bg-white/[0.03] border border-white/5 text-text-muted hover:text-white hover:bg-white/[0.06] transition-all group">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-primary rounded-full border-2 border-bg-dark shadow-[0_0_8px_#FF003D]" />
        </button>

        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-bg-slate to-bg-dark flex items-center justify-center border border-white/10 cursor-pointer hover:border-primary/40 transition-colors">
            <img src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" alt="Profile" className="w-full h-full rounded-full object-cover" />
        </div>
      </div>
    </header>
  );
};

export default Navbar;
