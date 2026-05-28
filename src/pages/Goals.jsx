import React from 'react';
import Layout from '../components/Layout';
import { Target, Trophy, Star, TrendingUp } from 'lucide-react';

const GoalsPage = () => {
  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight">Trading Goals</h1>
          <p className="text-sm text-text-muted mt-1">Set milestones and track your journey to becoming a pro trader.</p>
        </section>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-primary/10 border border-primary/20">
                <Trophy className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Main Milestone</h3>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black text-text-muted uppercase mb-2">
                <span>Account Funding Goal</span>
                <span>$25,000 / $50,000</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-primary rounded-full shadow-[0_0_15px_rgba(255,0,61,0.5)]" style={{ width: '50%' }} />
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-trading-green/10 border border-trading-green/20">
                <Star className="w-5 h-5 text-trading-green" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Discipline</h3>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black text-text-muted uppercase mb-2">
                <span>Max Loss Limit Adherence</span>
                <span>100%</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-trading-green rounded-full shadow-[0_0_15px_rgba(0,255,136,0.5)]" style={{ width: '100%' }} />
              </div>
            </div>
          </div>

          <div className="glass-panel p-8 space-y-6">
            <div className="flex items-center gap-3">
              <div className="p-3 rounded-2xl bg-purple-500/10 border border-purple-500/20">
                <TrendingUp className="w-5 h-5 text-purple-500" />
              </div>
              <h3 className="text-sm font-black text-white uppercase tracking-widest">Growth</h3>
            </div>
            <div>
              <div className="flex justify-between text-[10px] font-black text-text-muted uppercase mb-2">
                <span>Monthly P&L Target</span>
                <span>$2,450 / $5,000</span>
              </div>
              <div className="h-3 w-full bg-white/5 rounded-full overflow-hidden p-0.5 border border-white/5">
                <div className="h-full bg-purple-500 rounded-full shadow-[0_0_15px_rgba(168,85,247,0.5)]" style={{ width: '49%' }} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default GoalsPage;
