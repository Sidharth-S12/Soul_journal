import React from 'react';
import { Search, Bell, Clock, ChevronDown } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Trader';

  return (
    <header className="sticky top-0 z-40 bg-bg-deepest/80 backdrop-blur-xl border-b border-white/[0.04] px-6 lg:px-10 py-4 flex items-center justify-between">
      {/* Search */}
      <div className="flex-1 max-w-md relative group">
        <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
          <Search className="w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          placeholder="Search trades, strategies, journals..." 
          className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-11 pr-4 py-2 text-xs text-white outline-none focus:bg-white/[0.06] focus:border-primary/30 transition-all font-medium"
        />
      </div>

      {/* Right Actions */}
      <div className="flex items-center gap-6">
        {/* Time / Market Status */}
        <div className="hidden xl:flex items-center gap-2 bg-white/[0.03] px-3 py-1.5 rounded-full border border-white/5">
          <div className="w-1.5 h-1.5 bg-trading-green rounded-full shadow-[0_0_8px_#00ff88]" />
          <span className="text-[10px] font-black text-white uppercase tracking-widest">Market Open</span>
          <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest pl-2 border-l border-white/10 flex items-center gap-1.5">
            <Clock className="w-3 h-3" />
            14:30 UTC
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-text-muted hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full" />
        </button>

        {/* Timeframe selector */}
        <div className="hidden md:flex items-center gap-2 px-4 py-2 bg-white/[0.03] border border-white/5 rounded-xl cursor-pointer hover:bg-white/10 transition-all">
          <span className="text-[10px] font-black text-white uppercase tracking-widest">All Time</span>
          <ChevronDown className="w-3 h-3 text-text-muted" />
        </div>

        {/* User profile */}
        <div className="flex items-center gap-3 pl-6 border-l border-white/[0.08]">
          <div className="text-right hidden sm:block">
            <div className="text-[10px] font-black text-white uppercase tracking-widest">{displayName}</div>
            <div className="text-[8px] font-black text-primary uppercase tracking-tighter">Pro member</div>
          </div>
          <div className="w-8 h-8 rounded-full border border-primary/30 p-0.5 flex items-center justify-center bg-primary/10">
            <span className="text-[10px] font-black text-primary">{displayName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
