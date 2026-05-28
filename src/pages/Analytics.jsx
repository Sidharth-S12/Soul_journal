import React from 'react';
import Layout from '../components/Layout';
import { useAnalytics } from '../hooks/useAnalytics';
import { WinLossDonut, DailyPnLBar } from '../components/dashboard/AnalyticsCharts';
import EquityCurve from '../components/dashboard/EquityCurve';

const AnalyticsPage = () => {
  const stats = useAnalytics();
  const { accountCurve } = stats;

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight">Advanced Analytics</h1>
          <p className="text-sm text-text-muted mt-1">Deep dive into your trading edge and behavioral metrics.</p>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-2 gap-8">
          <div className="glass-panel p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Equity Performance</h3>
             <div className="h-[300px]">
                <EquityCurve data={accountCurve} />
             </div>
          </div>
          
          <div className="glass-panel p-8">
             <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Session Distribution</h3>
             <div className="h-[300px] flex items-center justify-center">
                <WinLossDonut wins={stats.wins} losses={stats.losses} />
             </div>
          </div>
        </div>

        <div className="glass-panel p-8">
           <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Daily Profit & Loss</h3>
           <div className="h-[300px]">
              <DailyPnLBar data={accountCurve} />
           </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
           {[
             { label: 'Profit Factor', val: stats.profitFactor.toFixed(2) },
             { label: 'Expectancy', val: `$${stats.expectancy.toFixed(2)}` },
             { label: 'Max Drawdown', val: `$${Math.abs(stats.maxDrawdown).toLocaleString()}` },
             { label: 'Avg R-Multiple', val: '1.8R' }
           ].map((item, i) => (
             <div key={i} className="glass-panel p-6">
               <div className="text-[10px] font-black text-text-muted uppercase tracking-widest mb-1">{item.label}</div>
               <div className="text-xl font-black text-white">{item.val}</div>
             </div>
           ))}
        </div>
      </div>
    </Layout>
  );
};

export default AnalyticsPage;
