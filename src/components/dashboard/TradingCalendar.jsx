import React, { useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const TradingCalendar = ({ trades = [] }) => {
  const [currentDate, setCurrentDate] = useState(new Date());

  const calendarData = useMemo(() => {
    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    const statsByDay = {};
    trades.forEach(t => {
      const d = new Date(t.entryTime || t.createdAt?.toDate());
      if (d.getFullYear() === year && d.getMonth() === month) {
        const day = d.getDate();
        if (!statsByDay[day]) statsByDay[day] = { pnl: 0, count: 0, wins: 0 };
        statsByDay[day].pnl += (t.netPnl || 0);
        statsByDay[day].count += 1;
        if (t.result === 'Win' || t.netPnl > 0) statsByDay[day].wins += 1;
      }
    });

    return { firstDay, daysInMonth, statsByDay };
  }, [trades, currentDate]);

  const prevMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1));
  const nextMonth = () => setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1));

  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const monthName = currentDate.toLocaleString('default', { month: 'long' });

  return (
    <div className="glass-panel p-6">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h3 className="text-lg font-black text-white">{monthName} {currentDate.getFullYear()}</h3>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Monthly Trading Performance</p>
        </div>
        <div className="flex gap-2">
          <button onClick={prevMonth} className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
            <ChevronLeft className="w-4 h-4 text-white" />
          </button>
          <button onClick={nextMonth} className="p-2 bg-white/5 border border-white/5 rounded-xl hover:bg-white/10 transition-all">
            <ChevronRight className="w-4 h-4 text-white" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-2">
        {days.map(d => (
          <div key={d} className="text-center text-[10px] font-black text-text-muted uppercase tracking-widest py-2">
            {d}
          </div>
        ))}
        {Array.from({ length: calendarData.firstDay }).map((_, i) => (
          <div key={`empty-${i}`} className="aspect-square opacity-0" />
        ))}
        {Array.from({ length: calendarData.daysInMonth }).map((_, i) => {
          const day = i + 1;
          const stats = calendarData.statsByDay[day];
          const isProfitable = stats?.pnl > 0;
          const isLoss = stats?.pnl < 0;

          return (
            <motion.div
              key={day}
              whileHover={{ scale: 1.05 }}
              className={`aspect-square rounded-xl p-2 border flex flex-col justify-between transition-all relative overflow-hidden
                ${stats 
                  ? isProfitable 
                    ? 'bg-trading-green/5 border-trading-green/20 shadow-[0_0_15px_rgba(0,255,136,0.05)]' 
                    : isLoss 
                      ? 'bg-trading-red/5 border-trading-red/20 shadow-[0_0_15px_rgba(255,46,99,0.05)]'
                      : 'bg-white/5 border-white/10'
                  : 'bg-white/[0.02] border-white/[0.03]'
                }`}
            >
              <span className="text-[10px] font-bold text-text-muted">{day}</span>
              {stats && (
                <div className="text-center">
                  <div className={`text-[10px] font-black ${isProfitable ? 'text-trading-green' : isLoss ? 'text-trading-red' : 'text-white'}`}>
                    {isProfitable ? '+' : ''}{stats.pnl.toLocaleString(undefined, { maximumFractionDigits: 0 })}
                  </div>
                  <div className="flex items-center justify-center gap-1 mt-0.5">
                    <span className="text-[8px] font-bold text-text-muted">{stats.count}T</span>
                    <span className={`text-[8px] font-bold ${stats.wins/stats.count >= 0.5 ? 'text-trading-green' : 'text-trading-red'}`}>
                      {Math.round((stats.wins / stats.count) * 100)}%
                    </span>
                  </div>
                </div>
              )}
              {stats && isProfitable && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-trading-green/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
              )}
              {stats && isLoss && (
                <div className="absolute top-0 right-0 w-8 h-8 bg-trading-red/10 blur-xl rounded-full -translate-y-1/2 translate-x-1/2" />
              )}
            </motion.div>
          );
        })}
      </div>
    </div>
  );
};

export default TradingCalendar;
