import React from 'react';
import { motion } from 'framer-motion';
import { 
  Target, Zap, Flame, Award, 
  ChevronRight, ArrowUpRight, ArrowDownRight, Info
} from 'lucide-react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/dashboard/StatCard';
import EquityCurve from '../components/dashboard/EquityCurve';
import TradingCalendar from '../components/dashboard/TradingCalendar';
import RecentTradesTable from '../components/dashboard/RecentTradesTable';
import { WinLossDonut, DailyPnLBar } from '../components/dashboard/AnalyticsCharts';
import { useAnalytics } from '../hooks/useAnalytics';

const Dashboard = () => {
  const stats = useAnalytics();
  const { trades, loading, accountCurve } = stats;

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  if (loading) {
    return (
       <div className="min-h-screen bg-bg-deepest flex items-center justify-center">
         <div className="flex flex-col items-center gap-4">
           <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin" />
           <p className="text-[10px] font-black text-text-muted uppercase tracking-widest animate-pulse">Initializing Journal...</p>
         </div>
       </div>
    );
  }

  return (
    <div className="min-h-screen bg-bg-deepest flex overflow-hidden font-body">
      <Sidebar />

      <main className="flex-1 ml-[220px] h-screen overflow-y-auto custom-scrollbar relative">
        <Navbar />

        <motion.div 
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="p-6 lg:p-10 max-w-[1600px] mx-auto space-y-8"
        >
          {/* Hero Section */}
          <section className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div>
              <h1 className="font-heading text-3xl font-black text-white tracking-tight">Performance Overview</h1>
              <p className="text-sm text-text-muted mt-1">Welcome back. Your metrics are looking sharp today.</p>
            </div>
            <div className="flex gap-4">
              <div className="glass-panel px-4 py-2 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-trading-green/10">
                  <Flame className="w-4 h-4 text-trading-green" />
                </div>
                <div>
                    <div className="text-[9px] font-black text-text-muted uppercase">Streak</div>
                    <div className="text-sm font-black text-white">12 Days</div>
                </div>
              </div>
              <div className="glass-panel px-4 py-2 flex items-center gap-3">
                <div className="p-2 rounded-lg bg-primary/10">
                  <Award className="w-4 h-4 text-primary" />
                </div>
                <div>
                    <div className="text-[9px] font-black text-text-muted uppercase">Rank</div>
                    <div className="text-sm font-black text-white">Elite</div>
                </div>
              </div>
            </div>
          </section>

          {/* Stat Cards Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-5 gap-6">
            <StatCard 
              label="Net P&L" 
              value={`${stats.netPnl >= 0 ? '+' : ''}$${stats.netPnl.toLocaleString()}`} 
              subValue="vs last week"
              trend={12.4}
              color={stats.netPnl >= 0 ? 'green' : 'red'}
              data={accountCurve.slice(-7).map(d => ({ value: d.pnl }))}
            />
            <StatCard 
              label="Win Rate" 
              value={`${Math.round(stats.winRate)}%`} 
              subValue="consistency"
              trend={2.1}
              color="green"
              data={[{value: 20}, {value: 40}, {value: 30}, {value: 60}, {value: stats.winRate}]}
            />
            <StatCard 
              label="Profit Factor" 
              value={stats.profitFactor.toFixed(2)} 
              subValue="efficiency"
              trend={-0.5}
              color={stats.profitFactor >= 1 ? 'green' : 'red'}
            />
            <StatCard 
              label="Day Win %" 
              value={`${Math.round(stats.dayWinPct)}%`} 
              subValue="daily edge"
              trend={5.4}
              color="green"
            />
             <StatCard 
              label="Avg Win/Loss" 
              value={`$${Math.round(stats.avgWin)} / $${Math.round(stats.avgLoss)}`} 
              subValue="R:R Ratio"
              trend={stats.avgRR.toFixed(1)}
              color="primary"
            />
          </section>

          {/* Middle Row: Equity Curve + Side Info */}
          <div className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <motion.div variants={itemVariants} className="xl:col-span-8 space-y-8">
               {/* Main Performance Chart */}
               <div className="glass-panel p-8">
                 <div className="flex items-center justify-between mb-8">
                    <div>
                      <h3 className="text-lg font-black text-white">Equity Curve</h3>
                      <p className="text-[10px] font-black text-text-muted uppercase tracking-widest mt-1">Real-time performance metrics</p>
                    </div>
                    <div className="flex gap-2">
                       {['1D', '1W', '1M', 'ALL'].map(tf => (
                         <button key={tf} className={`px-3 py-1 rounded-lg text-[10px] font-black uppercase transition-all ${tf === 'ALL' ? 'bg-primary text-white' : 'bg-white/5 text-text-muted hover:text-white'}`}>
                           {tf}
                         </button>
                       ))}
                    </div>
                 </div>
                 <div className="h-[350px]">
                    <EquityCurve data={accountCurve} />
                 </div>
               </div>

               {/* Recent Trades Table */}
               <RecentTradesTable trades={trades} />
            </motion.div>

            <motion.div variants={itemVariants} className="xl:col-span-4 space-y-8">
               {/* Trade Summary / Donut */}
               <div className="glass-panel p-6">
                  <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Trade Distribution</h3>
                  <div className="relative">
                    <WinLossDonut wins={stats.wins} losses={stats.losses} />
                  </div>
                  <div className="grid grid-cols-2 gap-4 mt-6">
                    <div className="p-4 rounded-2xl bg-trading-green/5 border border-trading-green/10">
                      <div className="text-[9px] font-black text-trading-green uppercase">Wins</div>
                      <div className="text-xl font-black text-white">{stats.wins}</div>
                    </div>
                    <div className="p-4 rounded-2xl bg-trading-red/5 border border-trading-red/10">
                      <div className="text-[9px] font-black text-trading-red uppercase">Losses</div>
                      <div className="text-xl font-black text-white">{stats.losses}</div>
                    </div>
                  </div>
               </div>

               <TradingCalendar trades={trades} />

               {/* Goals / Discipline */}
               <div className="glass-panel p-6 overflow-hidden relative group">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-sm font-black text-white uppercase tracking-widest">Discipline Goal</h3>
                    <Target className="w-4 h-4 text-primary" />
                  </div>
                  <div className="space-y-6">
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                        <span>Weekly Volume</span>
                        <span>{trades.length}/20 Trades</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: `${Math.min((trades.length/20) * 100, 100)}%` }}
                          className="h-full bg-primary shadow-[0_0_10px_#ff003c]" 
                        />
                      </div>
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black text-text-muted uppercase tracking-widest mb-2">
                        <span>Consistency Goal</span>
                        <span>80%</span>
                      </div>
                      <div className="h-2 w-full bg-white/5 rounded-full overflow-hidden">
                        <motion.div 
                          initial={{ width: 0 }} 
                          animate={{ width: '80%' }}
                          className="h-full bg-trading-green shadow-[0_0_10px_#00ff88]" 
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-8 p-4 rounded-xl bg-white/[0.02] border border-white/5 group-hover:border-primary/20 transition-all">
                    <div className="flex items-center gap-3">
                      <Zap className="w-4 h-4 text-yellow-500 animate-pulse" />
                      <div>
                        <div className="text-[10px] font-black text-white uppercase">Pro Tip</div>
                        <p className="text-[10px] text-text-muted leading-tight mt-0.5">Maintain your 1:2 R:R ratio to hit elite rank next status.</p>
                      </div>
                    </div>
                  </div>

                  {/* Decorative background glow */}
                  <div className="absolute -bottom-10 -right-10 w-32 h-32 bg-primary/10 blur-[50px] pointer-events-none" />
               </div>
            </motion.div>
          </div>

          {/* Bottom Analytics Row */}
          <motion.div variants={itemVariants} className="grid grid-cols-1 xl:grid-cols-3 gap-8">
            <div className="glass-panel p-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Daily P&L Performance</h3>
               <DailyPnLBar data={accountCurve} />
            </div>
            
            <div className="glass-panel p-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6">Profit Metrics</h3>
               <div className="space-y-4">
                  {[
                    { label: 'Largest Win', val: stats.largestWin, color: 'trading-green' },
                    { label: 'Largest Loss', val: stats.largestLoss, color: 'trading-red' },
                    { label: 'Profit Factor', val: stats.profitFactor.toFixed(2), color: 'white' },
                    { label: 'Expectancy', val: `$${stats.expectancy.toFixed(2)}`, color: 'white' },
                  ].map((m, i) => (
                    <div key={i} className="flex items-center justify-between py-3 border-b border-white/[0.04] last:border-0 hover:bg-white/[0.01] transition-all px-2 rounded-lg">
                       <span className="text-[10px] font-bold text-text-muted uppercase tracking-widest">{m.label}</span>
                       <span className={`text-xs font-black text-${m.color}`}>
                         {typeof m.val === 'number' && m.val >= 0 ? '+' : ''}{typeof m.val === 'number' ? `$${m.val.toLocaleString()}` : m.val}
                       </span>
                    </div>
                  ))}
               </div>
            </div>

            <div className="glass-panel p-6">
               <h3 className="text-sm font-black text-white uppercase tracking-widest mb-6 px-1 flex items-center justify-between">
                 <span>Elite Trading Setups</span>
                 <ArrowUpRight className="w-3.5 h-3.5 text-text-muted" />
               </h3>
               <div className="space-y-2">
                 {stats.topSetups.slice(0, 3).map((s, i) => (
                   <div key={i} className="p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-primary/20 transition-all flex items-center justify-between group">
                     <div>
                       <div className="text-xs font-black text-white">{s.name}</div>
                       <div className="text-[9px] font-black text-text-muted uppercase mt-0.5">{Math.round((s.wins/s.total)*100)}% Win Rate</div>
                     </div>
                     <div className="text-right">
                       <div className={`text-xs font-black ${s.pnl >= 0 ? 'text-trading-green' : 'text-trading-red'}`}>
                         {s.pnl >= 0 ? '+' : ''}${s.pnl.toLocaleString()}
                       </div>
                       <div className="text-[9px] font-black text-text-muted uppercase mt-0.5">{s.total} Trades</div>
                     </div>
                   </div>
                 ))}
                 {stats.topSetups.length === 0 && (
                   <p className="text-[10px] text-text-muted font-black uppercase text-center py-4">No setups recorded yet</p>
                 )}
               </div>
            </div>
          </motion.div>

        </motion.div>
      </main>
    </div>
  );
};

export default Dashboard;