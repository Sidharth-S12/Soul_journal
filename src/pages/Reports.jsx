import React from 'react';
import Layout from '../components/Layout';
import { BarChart, FileText, Download, Filter } from 'lucide-react';

const ReportsPage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <section className="flex items-center justify-between">
          <div>
            <h1 className="font-heading text-3xl font-black text-white tracking-tight">Performance Reports</h1>
            <p className="text-sm text-text-muted mt-1">Generate and export detailed performance dossiers.</p>
          </div>
          <div className="flex gap-3">
             <button className="btn-glass px-6 py-2 flex items-center gap-2">
               <Download className="w-4 h-4" />
               Download PDF
             </button>
          </div>
        </section>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
           <div className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                <FileText className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Monthly Summary Report</h4>
                <p className="text-xs text-text-muted px-10">Comprehensive analysis of your trading for the current month including equity curves and setup analysis.</p>
              </div>
              <button className="btn-primary w-full max-w-xs">Generate Report</button>
           </div>

           <div className="glass-panel p-8 flex flex-col items-center justify-center text-center space-y-4">
              <div className="w-16 h-16 rounded-full bg-trading-green/10 flex items-center justify-center">
                <BarChart className="w-8 h-8 text-trading-green" />
              </div>
              <div>
                <h4 className="text-lg font-black text-white">Strategy Audit</h4>
                <p className="text-xs text-text-muted px-10">Deep dive into your best and worst performing setups with statistical significance markers.</p>
              </div>
              <button className="btn-glass w-full max-w-xs border-trading-green/20 text-trading-green">Audit Strategies</button>
           </div>
        </div>
      </div>
    </Layout>
  );
};

export default ReportsPage;
