import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  LayoutDashboard,
  TrendingUp,
  Calendar,
  BarChart3,
  BookOpen,
  Target,
  Settings,
  ChevronRight,
  Plus,
} from 'lucide-react';
import Logo from './Logo';
import { useAuth } from '../context/AuthContext';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Trades', path: '/trades' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Reports', path: '/reports' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  const navigate = useNavigate();
  const { currentUser } = useAuth();
  const displayName = currentUser?.displayName || currentUser?.email?.split('@')[0] || 'Soul Trader';

  return (
    <aside className="fixed left-0 top-0 h-screen w-[220px] bg-bg-darker/98 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col">

      {/* Logo */}
      <div className="px-5 pt-5 pb-3">
        <Logo size="default" />
      </div>

      {/* New Trade button */}
      <div className="px-4 pb-4">
        <button
          onClick={() => navigate('/new-trade')}
          className="w-full flex items-center justify-center gap-2 py-3 rounded-xl font-black text-sm text-white transition-all
            bg-primary/90 hover:bg-primary border border-primary/50 hover:border-primary
            shadow-[0_0_20px_rgba(255,0,61,0.25)] hover:shadow-[0_0_30px_rgba(255,0,61,0.5)]"
        >
          <Plus className="w-4 h-4" />
          New Trade
        </button>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-3 space-y-0.5 overflow-y-auto custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) =>
              `relative flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 group
               ${isActive ? 'text-white' : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'}`
            }
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-4 h-4 transition-colors shrink-0 ${isActive ? 'text-primary' : 'text-text-muted group-hover:text-white/60'}`} />
                <span className={`text-sm tracking-wide ${isActive ? 'font-bold' : 'font-medium'}`}>{item.label}</span>
                {isActive && (
                  <>
                    <motion.div layoutId="activePill"
                      className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl z-[-1]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.2 }}
                    />
                    <motion.div layoutId="activeIndicator"
                      className="absolute left-0 w-[3px] h-5 bg-primary rounded-r-full shadow-[2px_0_12px_rgba(255,0,61,0.8)]"
                      initial={{ opacity: 0 }} animate={{ opacity: 1 }}
                    />
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* User profile */}
      <div className="px-4 py-4 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 hover:bg-white/[0.03] rounded-xl transition-colors cursor-pointer group">
          <div className="relative shrink-0">
            <div className="w-9 h-9 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary/40 transition-colors bg-bg-slate flex items-center justify-center">
              <span className="text-xs font-black text-primary">{displayName.charAt(0).toUpperCase()}</span>
            </div>
            <div className="absolute bottom-0 right-0 w-2.5 h-2.5 bg-green-500 border-2 border-bg-darker rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">{displayName}</h4>
            <span className="text-[9px] font-black text-primary uppercase tracking-tighter">Premium</span>
          </div>
          <ChevronRight className="w-3.5 h-3.5 text-text-muted group-hover:text-primary transition-colors shrink-0" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;