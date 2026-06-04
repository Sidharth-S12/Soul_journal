import React, { useState, useRef, useEffect } from 'react';
import { Search, Bell, Clock, ChevronDown, Check } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const TIME_FILTERS = [
  { label: 'All Time',  value: 'all' },
  { label: 'This Year', value: 'year' },
  { label: 'Monthly',   value: 'month' },
  { label: 'Weekly',    value: 'week' },
  { label: 'Daily',     value: 'day' },
];

// Export context so Dashboard can read the selected filter
export const TimeFilterContext = React.createContext('all');

const Navbar = ({ onFilterChange }) => {
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Trader';
  const [filter, setFilter]   = useState(TIME_FILTERS[0]);
  const [open, setOpen]       = useState(false);
  const dropRef               = useRef(null);

  // Close dropdown on outside click
  useEffect(() => {
    const handler = (e) => { if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false); };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const select = (f) => {
    setFilter(f);
    setOpen(false);
    onFilterChange?.(f.value);
  };

  return (
    <header className="sticky top-0 z-40 bg-bg-deepest/80 backdrop-blur-xl border-b border-white/[0.04] px-6 py-3 flex items-center justify-between gap-4"
      style={{ height: 56 }}>

      {/* Search */}
      <div className="flex-1 max-w-sm relative group">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-text-muted group-focus-within:text-primary transition-colors" />
        <input
          type="text"
          placeholder="Search trades, strategies..."
          className="w-full bg-white/[0.03] border border-white/5 rounded-full pl-10 pr-4 py-2 text-xs text-white outline-none
                     focus:bg-white/[0.06] focus:border-primary/30 transition-all font-medium placeholder:text-text-muted/50"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-3">

        {/* Market status */}
        <div className="hidden lg:flex items-center gap-2 bg-white/[0.03] border border-white/[0.06] px-3 py-1.5 rounded-full">
          <div className="w-1.5 h-1.5 bg-trading-green rounded-full shadow-[0_0_6px_#00ff88]" />
          <span className="text-[9px] font-black text-white uppercase tracking-widest">Market Open</span>
          <span className="text-[9px] font-bold text-text-muted pl-2 border-l border-white/10 flex items-center gap-1">
            <Clock className="w-2.5 h-2.5" /> 14:30 UTC
          </span>
        </div>

        {/* Notifications */}
        <button className="relative p-2 text-text-muted hover:text-white transition-colors">
          <Bell className="w-4 h-4" />
          <span className="absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-primary rounded-full shadow-[0_0_6px_#FF003D]" />
        </button>

        {/* Time filter dropdown */}
        <div className="relative" ref={dropRef}>
          <button
            onClick={() => setOpen(v => !v)}
            className="flex items-center gap-2 px-4 py-2 bg-white/[0.04] border border-white/[0.08] rounded-xl
                       hover:bg-white/[0.08] hover:border-white/20 transition-all"
          >
            <span className="text-[10px] font-black text-white uppercase tracking-widest">{filter.label}</span>
            <ChevronDown className={`w-3 h-3 text-text-muted transition-transform ${open ? 'rotate-180' : ''}`} />
          </button>

          {open && (
            <div className="absolute right-0 top-full mt-2 w-40 glass-panel py-1 shadow-2xl z-50">
              {TIME_FILTERS.map(f => (
                <button key={f.value} onClick={() => select(f)}
                  className="w-full flex items-center justify-between px-4 py-2.5 text-left hover:bg-white/[0.05] transition-colors group">
                  <span className={`text-xs font-bold uppercase tracking-widest ${f.value === filter.value ? 'text-primary' : 'text-text-secondary group-hover:text-white'}`}>
                    {f.label}
                  </span>
                  {f.value === filter.value && <Check className="w-3 h-3 text-primary" />}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* User */}
        <div className="flex items-center gap-2.5 pl-3 border-l border-white/[0.08]">
          <div className="text-right hidden sm:block">
            <div className="text-[9px] font-black text-white uppercase tracking-widest">{displayName}</div>
            <div className="text-[8px] font-black text-primary uppercase tracking-tighter">Pro member</div>
          </div>
          <div className="w-7 h-7 rounded-full bg-primary/10 border border-primary/30 flex items-center justify-center">
            <span className="text-[10px] font-black text-primary">{displayName.charAt(0).toUpperCase()}</span>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;