import React from 'react';
import Layout from '../components/Layout';
import TradingCalendar from '../components/dashboard/TradingCalendar';
import { useAnalytics } from '../hooks/useAnalytics';

const CalendarPage = () => {
  const { trades } = useAnalytics();

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight">Trading Calendar</h1>
          <p className="text-sm text-text-muted mt-1">Track your daily performance and consistency over time.</p>
        </section>
        
        <div className="max-w-4xl">
          <TradingCalendar trades={trades} />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="glass-panel p-6">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Best Trading Day</h3>
            <div className="text-xl font-black text-trading-green">Tuesday</div>
            <div className="text-[10px] font-bold text-text-muted mt-1">Average Profit: +$450</div>
          </div>
          <div className="glass-panel p-6">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Worst Trading Day</h3>
            <div className="text-xl font-black text-trading-red">Friday</div>
            <div className="text-[10px] font-bold text-text-muted mt-1">Average Loss: -$120</div>
          </div>
          <div className="glass-panel p-6">
            <h3 className="text-xs font-black text-text-muted uppercase tracking-widest mb-2">Most Consistent Day</h3>
            <div className="text-xl font-black text-white">Wednesday</div>
            <div className="text-[10px] font-bold text-text-muted mt-1">85% Win Rate</div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default CalendarPage;
