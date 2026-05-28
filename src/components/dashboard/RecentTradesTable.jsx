import React from 'react';
import { motion } from 'framer-motion';
import { ChevronRight } from 'lucide-react';

const RecentTradesTable = ({ trades = [] }) => {
  return (
    <div className="glass-panel overflow-hidden">
      <div className="px-6 py-5 border-b border-white/[0.04] flex items-center justify-between">
        <h3 className="text-sm font-black text-white uppercase tracking-widest">Recent Trades</h3>
        <button className="text-[10px] font-black text-primary uppercase tracking-widest hover:text-primary-glow transition-colors">
          View All
        </button>
      </div>
      
<<<<<<< HEAD
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3 px-6">
=======
      <div className="overflow-x-auto">
        <table className="w-full">
>>>>>>> 1242b10 (pages updated)
          <thead>
            <tr className="bg-white/[0.01]">
              <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Date</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Symbol</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Direction</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">P&L</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">R-Multiple</th>
              <th className="px-6 py-4 text-left text-[10px] font-black text-text-muted uppercase tracking-widest">Setup</th>
              <th className="px-6 py-4 text-right text-[10px] font-black text-text-muted uppercase tracking-widest">Action</th>
            </tr>
          </thead>
<<<<<<< HEAD
          <tbody>
            {trades.map((trade, i) => (
              <motion.tr 
                key={i}
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: i * 0.1 }}
                className="group/row bg-white/[0.02] hover:bg-white/[0.05] transition-all cursor-pointer relative"
              >
                <td className="px-6 py-6 rounded-l-2xl">
                  <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-bg-darker flex items-center justify-center text-lg border border-white/[0.05] group-hover/row:border-primary/20 transition-colors flex-shrink-0">
                      {trade.icon}
                    </div>
                    <div>
                        <p className="text-sm font-black text-white tracking-tight">{trade.asset}</p>
                        <p className="text-[10px] font-medium text-text-muted mt-1">{trade.strategy}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-6">
                  <div className={`flex items-center gap-1.5 text-xs font-black italic tracking-tighter ${trade.direction === 'Long' ? 'text-trading-green' : 'text-trading-red'}`}>
                    {trade.direction === 'Long' ? <ArrowRight className="-rotate-45 w-3 h-3" /> : <ArrowLeft className="-rotate-45 w-3 h-3" />}
                    {trade.direction}
                  </div>
                </td>
                <td className="px-6 py-6">
                  <span className={`px-2.5 py-1.5 rounded-md text-[9px] font-black uppercase tracking-tighter inline-block ${
                    trade.result === 'Win' ? 'bg-trading-green/10 text-trading-green border border-trading-green/20' : 'bg-trading-red/10 text-trading-red border border-trading-red/20'
                  }`}>
                    {trade.result}
                  </span>
                </td>
                <td className="px-6 py-6 text-sm font-black text-white/90 tracking-tight">{trade.rMultiple}</td>
                <td className={`px-6 py-6 text-sm font-black ${trade.result === 'Win' ? 'text-trading-green' : 'text-trading-red-glow'}`}>
                  {trade.pnl}
                </td>
                <td className="px-6 py-6 text-right rounded-r-2xl">
                    <div className="flex items-center justify-end gap-4">
                        <span className="text-[11px] font-bold text-text-muted">{trade.date}</span>
                        <MoreHorizontal className="w-4 h-4 text-text-muted opacity-0 group-hover/row:opacity-100 transition-opacity flex-shrink-0" />
                    </div>
                </td>
                
                {/* Visual accent for active row */}
                <div className={`absolute inset-y-0 left-0 w-1 ${trade.result === 'Win' ? 'bg-trading-green' : 'bg-trading-red'} rounded-l-2xl scale-y-0 group-hover/row:scale-y-100 transition-transform origin-center`} />
              </motion.tr>
            ))}
=======
          <tbody className="divide-y divide-white/[0.02]">
            {trades.slice(0, 10).map((trade, idx) => {
              const isProfit = trade.netPnl > 0;
              const date = new Date(trade.entryTime || trade.createdAt?.toDate()).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric'
              });

              return (
                <motion.tr
                   key={trade.id || idx}
                   initial={{ opacity: 0, y: 10 }}
                   animate={{ opacity: 1, y: 0 }}
                   transition={{ delay: idx * 0.05 }}
                   className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                >
                  <td className="px-6 py-4 text-xs font-bold text-text-muted">{date}</td>
                  <td className="px-6 py-4 text-xs font-black text-white">{trade.instrument}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${trade.direction === 'Long' ? 'bg-trading-green/10 text-trading-green' : 'bg-trading-red/10 text-trading-red'}`}>
                      {trade.direction}
                    </span>
                  </td>
                  <td className={`px-6 py-4 text-right text-xs font-black ${isProfit ? 'text-trading-green' : 'text-trading-red'}`}>
                    {isProfit ? '+' : ''}${trade.netPnl?.toLocaleString(undefined, { minimumFractionDigits: 2 })}
                  </td>
                  <td className="px-6 py-4 text-right text-xs font-bold text-text-secondary">
                    {trade.rMultiple ? `${trade.rMultiple}R` : '—'}
                  </td>
                  <td className="px-6 py-4 text-xs font-black text-text-secondary">{trade.setup || 'Custom'}</td>
                  <td className="px-6 py-4 text-right">
                    <button className="p-2 rounded-lg bg-white/5 border border-white/5 group-hover:bg-primary group-hover:border-primary transition-all">
                      <ChevronRight className="w-3.5 h-3.5 text-white" />
                    </button>
                  </td>
                </motion.tr>
              );
            })}
>>>>>>> 1242b10 (pages updated)
          </tbody>
        </table>
      </div>
      
      {trades.length === 0 && (
        <div className="py-20 text-center">
          <p className="text-xs font-black text-text-muted uppercase tracking-widest">No trades recorded yet</p>
        </div>
      )}
    </div>
  );
};

export default RecentTradesTable;
