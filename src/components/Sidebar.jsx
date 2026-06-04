import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard, TrendingUp, Calendar, BarChart3,
  Target, BookOpen, FileText, Settings, Plus, ChevronRight,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard',  path: '/dashboard' },
  { icon: TrendingUp,      label: 'Trades',     path: '/trades' },
  { icon: FileText,        label: 'Journal',    path: '/journal' },
  { icon: Calendar,        label: 'Calendar',   path: '/calendar' },
  { icon: BarChart3,       label: 'Analytics',  path: '/analytics' },
  { icon: Target,          label: 'Goals',      path: '/goals' },
  { icon: BarChart3,       label: 'Reports',    path: '/reports' },
  { icon: BookOpen,        label: 'Playbook',   path: '/playbook' },
  { icon: Settings,        label: 'Settings',   path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Soul Trader';

  return (
    <aside className="fixed left-0 top-0 h-screen bg-bg-darker/98 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col"
      style={{ width: 160 }}>

      {/* Logo */}
      <div className="px-4 pt-4 pb-3 border-b border-white/[0.04]">
        <Logo size="compact" />
      </div>

      {/* New Trade */}
      <div className="px-3 py-3">
        <button
          onClick={() => navigate('/new-trade')}
          className="w-full flex items-center justify-center gap-2 py-2.5 rounded-xl font-black text-xs text-white transition-all
            bg-primary hover:bg-primary/90 border border-primary/50
            shadow-[0_0_16px_rgba(255,0,61,0.3)] hover:shadow-[0_0_24px_rgba(255,0,61,0.5)]"
        >
          <Plus className="w-3.5 h-3.5" />
          New Trade
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map(({ icon: Icon, label, path }) => (
          <NavLink key={path} to={path}
            className={({ isActive }) =>
              `relative flex items-center gap-2.5 px-3 py-2.5 rounded-xl transition-all duration-200 group
               ${isActive ? 'text-white' : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'}`
            }
          >
            {({ isActive }) => (
              <>
                <Icon className={`w-4 h-4 shrink-0 transition-colors ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white/60'}`} />
                <span className={`text-xs tracking-wide truncate ${isActive ? 'font-bold' : 'font-medium'}`}>{label}</span>
                {isActive && (
                  <>
                    <motion.div layoutId="activePill"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl z-[-1]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                    />
                    <motion.div layoutId="activeBar"
                      className="absolute left-0 w-[3px] h-5 bg-primary rounded-r-full shadow-[2px_0_10px_rgba(255,0,61,0.8)]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    />
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Today's Focus */}
      <div className="mx-2 mb-2">
        <div className="glass-panel p-3 bg-primary/5 border-primary/10 relative overflow-hidden group">
          <div className="absolute bottom-0 right-0 w-16 h-16 bg-primary/10 blur-2xl rounded-full" />
          <img
            src="https://images.unsplash.com/photo-1544022613-e87ce74567ad?auto=format&fit=crop&q=80&w=200"
            alt="Focus"
            className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay grayscale"
          />
          <div className="relative z-10">
            <div className="flex items-center gap-1.5 mb-1">
              <div className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              <span className="text-[8px] font-black uppercase tracking-widest text-primary">Today's Focus</span>
            </div>
            <p className="text-[9px] text-text-secondary italic mb-2 leading-relaxed">"Discipline is key."</p>
            <div className="flex justify-between text-[8px] text-white/50 font-bold mb-1">
              <span>2/3 Goals</span>
              <span className="text-primary">66%</span>
            </div>
            <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
              <motion.div className="h-full bg-primary"
                initial={{ width: 0 }} animate={{ width: '66%' }}
                transition={{ duration: 1.5, ease: 'easeOut' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* User */}
      <div className="px-3 py-3 border-t border-white/5">
        <div className="flex items-center gap-2 p-1.5 hover:bg-white/[0.03] rounded-xl transition-colors cursor-pointer group">
          <div className="relative shrink-0">
            <div className="w-7 h-7 rounded-full border border-primary/30 bg-primary/10 flex items-center justify-center">
              <span className="text-[10px] font-black text-primary">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2 h-2 bg-green-500 border border-bg-darker rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] font-bold text-white truncate">{displayName}</p>
            <p className="text-[8px] font-black text-primary uppercase tracking-tighter">Premium</p>
          </div>
          <ChevronRight className="w-3 h-3 text-text-muted shrink-0" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;