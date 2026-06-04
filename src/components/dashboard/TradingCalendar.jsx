import React, { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { motion } from 'framer-motion';

const DAYS   = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const MONTHS = ['January','February','March','April','May','June',
                'July','August','September','October','November','December'];

const TradingCalendar = ({ trades = [] }) => {
  const today = new Date();
  const [cal, setCal] = useState({ year: today.getFullYear(), month: today.getMonth() });

  const { dim, fdow, byDay, bestDay, worstDay } = useMemo(() => {
    const { year, month } = cal;
    const dim  = new Date(year, month + 1, 0).getDate();
    const fdow = new Date(year, month, 1).getDay();
    const byDay = {};

    trades.filter(t => t.exitPrice).forEach(t => {
      const raw = t.entryTime || t.createdAt?.toDate?.()?.toISOString?.() || '';
      const d   = raw.split('T')[0];
      if (!d) return;
      const [y, m, day] = d.split('-').map(Number);
      if (y === year && m - 1 === month) {
        if (!byDay[day]) byDay[day] = { pnl: 0, count: 0, wins: 0 };
        byDay[day].pnl   += t.netPnl || 0;
        byDay[day].count += 1;
        if (t.result === 'Win') byDay[day].wins += 1;
      }
    });

    const days   = Object.entries(byDay);
    const bestDay  = days.length ? Math.max(...days.map(([,v]) => v.pnl)) : 0;
    const worstDay = days.length ? Math.min(...days.map(([,v]) => v.pnl)) : 0;

    return { dim, fdow, byDay, bestDay, worstDay };
  }, [trades, cal]);

  const fmt = (n) => n >= 0
    ? `+$${n.toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`
    : `-$${Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 })}`;

  const isToday = (d) =>
    today.getFullYear() === cal.year &&
    today.getMonth()    === cal.month &&
    today.getDate()     === d;

  const prev = () => setCal(c => c.month === 0  ? { year: c.year - 1, month: 11 } : { ...c, month: c.month - 1 });
  const next = () => setCal(c => c.month === 11 ? { year: c.year + 1, month: 0  } : { ...c, month: c.month + 1 });

  return (
    <div className="glass-panel p-6 group">
      {/* Header */}
      <div className="flex items-center justify-between mb-5">
        <h3 className="text-xs font-black uppercase tracking-[0.2em] text-white">Trading Calendar</h3>
        <div className="flex items-center gap-2">
          <button onClick={prev} className="p-1 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <ChevronLeft className="w-3.5 h-3.5" />
          </button>
          <span className="text-[10px] font-black text-text-muted uppercase tracking-widest w-28 text-center">
            {MONTHS[cal.month].slice(0,3)} {cal.year}
          </span>
          <button onClick={next} className="p-1 hover:bg-white/5 rounded-lg text-text-muted transition-colors">
            <ChevronRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Day headers */}
      <div className="grid grid-cols-7 mb-2">
        {DAYS.map(d => (
          <div key={d} className="text-center text-[8px] font-black text-text-muted uppercase tracking-widest py-1">{d}</div>
        ))}
      </div>

      {/* Day cells */}
      <div className="grid grid-cols-7 gap-1">
        {Array.from({ length: fdow }).map((_, i) => <div key={`e${i}`} />)}
        {Array.from({ length: dim }, (_, i) => i + 1).map(d => {
          const info   = byDay[d];
          const profit = info?.pnl > 0;
          const loss   = info?.pnl < 0;
          return (
            <div
              key={d}
              title={info ? `${fmt(info.pnl)} · ${info.count} trade${info.count > 1 ? 's' : ''}` : undefined}
              className={`aspect-square rounded-lg flex flex-col items-center justify-center text-[10px] font-bold
                transition-all cursor-pointer relative
                ${isToday(d)
                  ? 'bg-primary text-white shadow-[0_0_12px_rgba(255,0,61,0.5)]'
                  : info
                    ? profit
                      ? 'bg-trading-green/15 text-trading-green border border-trading-green/20 hover:bg-trading-green/25'
                      : 'bg-primary/15 text-primary border border-primary/20 hover:bg-primary/25'
                    : 'text-text-muted hover:bg-white/[0.03] hover:text-white/60'
                }`}
            >
              {d}
              {info && (
                <div className={`w-1 h-1 rounded-full mt-0.5 ${profit ? 'bg-trading-green' : 'bg-primary'}
                  shadow-[0_0_4px_currentColor]`} />
              )}
            </div>
          );
        })}
      </div>

      {/* Best / Worst day footer */}
      <div className="flex justify-between items-center mt-5 pt-4 border-t border-white/[0.04]">
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-trading-green shadow-[0_0_5px_#00FF88]" />
          <span className="text-[9px] font-bold text-text-muted">Best Day</span>
          <span className="text-[9px] font-black text-trading-green ml-1">
            {bestDay ? fmt(bestDay) : '—'}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#FF003D]" />
          <span className="text-[9px] font-bold text-text-muted">Worst Day</span>
          <span className="text-[9px] font-black text-primary ml-1">
            {worstDay < 0 ? fmt(worstDay) : '—'}
          </span>
        </div>
      </div>
    </div>
  );
};

export default TradingCalendar;