import React from 'react';
import Layout from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';
import { Book, MessageSquare, Tag } from 'lucide-react';

const JournalPage = () => {
  const { trades } = useAnalytics();

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight">Trading Journal</h1>
          <p className="text-sm text-text-muted mt-1">Review your thoughts, emotions, and execution for every trade.</p>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {trades.slice(0, 6).map((trade, i) => (
            <div key={i} className="glass-panel p-6 hover:border-primary/20 transition-all cursor-pointer group">
              <div className="flex justify-between items-start mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${trade.netPnl >= 0 ? 'bg-trading-green/10' : 'bg-trading-red/10'}`}>
                    <Book className={`w-4 h-4 ${trade.netPnl >= 0 ? 'text-trading-green' : 'text-trading-red'}`} />
                  </div>
                  <div>
                    <h4 className="text-sm font-black text-white">{trade.instrument}</h4>
                    <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{new Date(trade.entryTime || trade.createdAt?.toDate()).toDateString()}</p>
                  </div>
                </div>
                <div className={`text-xs font-black ${trade.netPnl >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
                  {trade.netPnl >= 0 ? '+' : ''}${trade.netPnl?.toLocaleString()}
                </div>
              </div>
              
              <div className="space-y-4">
                <div>
                  <div className="text-[9px] font-black text-text-muted uppercase tracking-widest mb-1 flex items-center gap-1.5">
                    <MessageSquare className="w-3 h-3" />
                    Pre-Trade Analysis
                  </div>
                  <p className="text-xs text-text-secondary line-clamp-2 italic">"{trade.preAnalysis || 'No pre-trade analysis recorded for this trade.'}"</p>
                </div>
                
                <div className="flex flex-wrap gap-2 pt-2">
                  {(trade.tags || ['No Tags']).map(tag => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-white/5 border border-white/5 text-[8px] font-black text-text-muted uppercase tracking-tighter">
                      {tag}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </Layout>
  );
};

export default JournalPage;
