import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  Upload, 
  DollarSign, 
  Target, 
  TrendingUp, 
  BarChart, 
  Zap, 
  Calendar as CalendarIcon,
  ChevronDown,
  Activity,
  Award,
  LayoutDashboard,
  PenLine,
  Settings
} from 'lucide-react';

import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StatCard from '../components/dashboard/StatCard';
import MainPerformanceChart from '../components/dashboard/MainPerformanceChart';
import RecentTradesTable from '../components/dashboard/RecentTradesTable';
import CalendarWidget from '../components/dashboard/CalendarWidget';
import InsightCard from '../components/dashboard/InsightCard';
import LatestJournalEntry from '../components/dashboard/LatestJournalEntry';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-bg-deepest flex overflow-hidden">
      {/* Background Lighting Sources */}
      <div className="light-source-red top-[-10%] left-[-5%] opacity-30" />
      <div className="light-source-red bottom-[-10%] right-[10%] opacity-20" />
      
      <Sidebar />
      
      <main className="flex-1 ml-[280px] h-screen overflow-y-auto custom-scrollbar relative z-10">
        <Navbar />
        
        <div className="p-10 space-y-10 max-w-[1600px] mx-auto">
          
          {/* Stats Grid */}
          <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-8">
            <StatCard 
              title="Net P&L" 
              value="+$4,230.50" 
              change={12.4} 
              isPositive={true} 
              Icon={DollarSign}
            />
            <StatCard 
              title="Win Rate" 
              value="68.4%" 
              change={8.7} 
              isPositive={true} 
              type="circular"
              Icon={Award}
            />
            <StatCard 
              title="Total Trades" 
              value="32" 
              change={-5} 
              isPositive={false} 
              type="bars"
              Icon={Activity}
            />
            <StatCard 
              title="Expectancy" 
              value="$132.21" 
              change={18.3} 
              isPositive={true} 
              Icon={Target}
            />
          </section>

          {/* Middle Section: Chart and Calendar */}
          <section className="grid grid-cols-1 xl:grid-cols-12 gap-8">
            <div className="xl:col-span-8">
              <MainPerformanceChart />
            </div>
            
            <div className="xl:col-span-4 flex flex-col gap-8">
                {/* Win Rate Circle Widget */}
                <div className="glass-panel p-8 flex flex-col items-center justify-between min-h-[220px]">
                    <div className="flex justify-between w-full mb-6">
                        <h3 className="text-xs font-black text-text-muted uppercase tracking-[0.2em]">Win Rate</h3>
                        <Activity className="w-4 h-4 text-white/20" />
                    </div>
                    <div className="flex-1 flex flex-col items-center justify-center">
                        <div className="relative w-28 h-28 flex items-center justify-center">
                            <svg className="w-full h-full transform -rotate-90">
                                <circle cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" className="text-white/[0.03]" />
                                <motion.circle 
                                    cx="56" cy="56" r="50" stroke="currentColor" strokeWidth="8" fill="transparent" 
                                    strokeDasharray="314" initial={{ strokeDashoffset: 314 }} animate={{ strokeDashoffset: 314 - (314 * 68.4) / 100 }}
                                    transition={{ duration: 2 }} className="text-primary-glow shadow-[0_0_15px_#FF003D]"
                                />
                            </svg>
                            <div className="absolute flex flex-col items-center">
                                <span className="text-2xl font-black text-white">68.4%</span>
                                <span className="text-[8px] font-black text-text-muted uppercase tracking-widest leading-none">22W / 10L</span>
                            </div>
                        </div>
                    </div>
                    <div className="w-full grid grid-cols-2 gap-4 mt-8 pt-4 border-t border-white/[0.03]">
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-green-500 shadow-[0_0_5px_#10b981]" />
                            <span className="text-[10px] font-bold text-text-muted">Best Day</span>
                            <span className="ml-auto text-[10px] font-black text-green-500">+$1,890</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="w-1.5 h-1.5 rounded-full bg-primary shadow-[0_0_5px_#FF003D]" />
                            <span className="text-[10px] font-bold text-text-muted">Worst Day</span>
                            <span className="ml-auto text-[10px] font-black text-primary">-$620</span>
                        </div>
                    </div>
                </div>

              <CalendarWidget />
            </div>
          </section>

          {/* Bottom Grid: Trades, Journal, Insight */}
          <section className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            <div className="lg:col-span-6">
              <RecentTradesTable />
            </div>
            <div className="lg:col-span-3">
              <LatestJournalEntry />
            </div>
            <div className="lg:col-span-3">
              <InsightCard />
            </div>
          </section>
        </div>
      </main>
      
      {/* Footer Mobile Nav Placeholder */}
      <div className="lg:hidden fixed bottom-0 left-0 w-full h-16 bg-bg-darker/90 backdrop-blur-xl border-t border-white/5 z-50 flex items-center justify-around px-6">
          <LayoutDashboard className="w-6 h-6 text-primary" />
          <TrendingUp className="w-6 h-6 text-text-muted" />
          <PenLine className="w-6 h-6 text-text-muted" />
          <Settings className="w-6 h-6 text-text-muted" />
      </div>
    </div>
  );
};

export default Dashboard;
