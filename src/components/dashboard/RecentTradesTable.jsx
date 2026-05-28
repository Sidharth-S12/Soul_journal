import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, MoreHorizontal, ArrowRight, ArrowLeft } from 'lucide-react';

const trades = [
  { asset: 'EURUSD', strategy: 'ICT - LIQ Sweep', direction: 'Long', result: 'Win', rMultiple: '+2.35R', pnl: '+$780.50', date: 'May 18, 2025', icon: '🇪🇺' },
  { asset: 'XAUUSD', strategy: 'Breaker + FVG', direction: 'Short', result: 'Win', rMultiple: '+1.42R', pnl: '+$620.00', date: 'May 18, 2025', icon: '🥇' },
  { asset: 'NAS100', strategy: 'MSS + OB', direction: 'Long', result: 'Loss', rMultiple: '-0.85R', pnl: '-$420.00', date: 'May 17, 2025', icon: '🇺🇸' },
  { asset: 'GBPUSD', strategy: 'ICT - FVG', direction: 'Long', result: 'Win', rMultiple: '+1.87R', pnl: '+$550.00', date: 'May 17, 2025', icon: '🇬🇧' },
];

const RecentTradesTable = () => {
  return (
    <div className="glass-panel flex flex-col h-full group">
      <div className="p-8 border-b border-white/[0.03] flex justify-between items-center bg-white/[0.01]">
        <div className="flex items-center gap-3">
            <h2 className="text-sm font-black text-white uppercase tracking-[0.2em] flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
                Recent Trades
            </h2>
        </div>
        <button className="text-[10px] font-black text-text-muted hover:text-primary tracking-widest uppercase transition-all flex items-center gap-1.5 group/btn">
            View all <ExternalLink className="w-3 h-3 group-hover/btn:translate-x-0.5 transition-transform" />
        </button>
      </div>
      
      <div className="flex-1 overflow-auto custom-scrollbar">
        <table className="w-full text-left border-separate border-spacing-y-3 px-6">
          <thead>
            <tr className="text-text-muted text-[10px] font-black uppercase tracking-[0.2em]">
              <th className="px-6 py-4">Pair / Asset</th>
              <th className="px-6 py-4">Direction</th>
              <th className="px-6 py-4">Result</th>
              <th className="px-6 py-4">R Multiple</th>
              <th className="px-6 py-4">P&L</th>
              <th className="px-6 py-4 text-right">Date</th>
            </tr>
          </thead>
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
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default RecentTradesTable;
