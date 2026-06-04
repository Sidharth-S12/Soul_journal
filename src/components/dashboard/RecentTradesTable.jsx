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

            <div className="overflow-x-auto">
                <table className="w-full">
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
                    <tbody className="divide-y divide-white/[0.02]">
                        {trades.slice(0, 10).map((trade, idx) => {
                            const isProfit = trade.netPnl > 0;
                            const rawDate = trade.entryTime || trade.createdAt?.toDate?.();
                            const date = rawDate
                                ? new Date(rawDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
                                : '—';

                            return (
                                <motion.tr
                                    key={trade.id || idx}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: idx * 0.04 }}
                                    className="group hover:bg-white/[0.02] transition-all cursor-pointer"
                                >
                                    <td className="px-6 py-4 text-xs font-bold text-text-muted">{date}</td>
                                    <td className="px-6 py-4 text-xs font-black text-white">{trade.instrument}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-tighter ${trade.direction === 'Long'
                                            ? 'bg-trading-green/10 text-trading-green'
                                            : 'bg-primary/10 text-primary'
                                            }`}>
                                            {trade.direction}
                                        </span>
                                    </td>
                                    <td className={`px-6 py-4 text-right text-xs font-black ${isProfit ? 'text-trading-green' : 'text-primary'}`}>
                                        {isProfit ? '+' : ''}${Math.abs(trade.netPnl ?? 0).toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                                    </td>
                                    <td className="px-6 py-4 text-right text-xs font-bold text-text-secondary">
                                        {trade.rMultiple ? `${trade.rMultiple}R` : '—'}
                                    </td>
                                    <td className="px-6 py-4 text-xs font-medium text-text-secondary truncate max-w-[120px]">
                                        {trade.setup || 'Custom'}
                                    </td>
                                    <td className="px-6 py-4 text-right">
                                        <button className="p-1.5 rounded-lg bg-white/[0.04] border border-white/[0.06] group-hover:bg-primary/10 group-hover:border-primary/30 transition-all">
                                            <ChevronRight className="w-3.5 h-3.5 text-white/60 group-hover:text-primary transition-colors" />
                                        </button>
                                    </td>
                                </motion.tr>
                            );
                        })}
                    </tbody>
                </table>
            </div>

            {trades.length === 0 && (
                <div className="py-16 text-center">
                    <p className="text-xs font-black text-text-muted uppercase tracking-widest opacity-40">
                        No trades recorded yet
                    </p>
                </div>
            )}
        </div>
    );
};

export default RecentTradesTable;