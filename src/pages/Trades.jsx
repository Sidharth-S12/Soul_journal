import React from 'react';
import Layout from '../components/Layout';
import RecentTradesTable from '../components/dashboard/RecentTradesTable';
import { useAnalytics } from '../hooks/useAnalytics';

const TradesPage = () => {
  const { trades } = useAnalytics();

  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-black text-white tracking-tight">Trade History</h1>
            <p className="text-sm text-text-muted mt-1">A complete log of all your trading activity.</p>
          </div>
          <div className="flex gap-3">
             <button className="btn-glass px-6 py-2">Export CSV</button>
             <button className="btn-primary px-6 py-2 shadow-[0_0_20px_rgba(255,0,61,0.3)]">Filter</button>
          </div>
        </section>

        <RecentTradesTable trades={trades} />
      </div>
    </Layout>
  );
};

export default TradesPage;
