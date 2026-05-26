import React from 'react';
import { NavLink } from 'react-router-dom';
import { motion } from 'framer-motion';
import { 
  LayoutDashboard, 
  TrendingUp, 
  BookOpen, 
  BarChart3, 
  Calendar, 
  Target, 
  PlaySquare, 
  Layers,
  FileText,
  Settings,
  ChevronRight
} from 'lucide-react';
import Logo from './Logo';

const navItems = [
  { icon: LayoutDashboard, label: 'Dashboard', path: '/dashboard' },
  { icon: TrendingUp, label: 'Trades', path: '/trades' },
  { icon: BookOpen, label: 'Journal', path: '/journal' },
  { icon: Calendar, label: 'Calendar', path: '/calendar' },
  { icon: BarChart3, label: 'Analytics', path: '/analytics' },
  { icon: Target, label: 'Goals', path: '/goals' },
  { icon: PlaySquare, label: 'Playbook', path: '/playbook' },
  { icon: Layers, label: 'Assets', path: '/assets' },
  { icon: FileText, label: 'Reports', path: '/reports' },
  { icon: Settings, label: 'Settings', path: '/settings' },
];

const Sidebar = () => {
  return (
    <aside className="fixed left-0 top-0 h-screen w-[280px] bg-bg-darker/95 backdrop-blur-3xl border-r border-white/5 z-50 flex flex-col p-6">
      <div className="mb-10">
        <Logo className="scale-90 origin-left" />
      </div>

      <nav className="flex-1 space-y-1.5 overflow-y-auto pr-2 custom-scrollbar">
        {navItems.map((item) => (
          <NavLink
            key={item.label}
            to={item.path}
            className={({ isActive }) => `
              relative flex items-center gap-3 px-5 py-3.5 rounded-xl transition-all duration-300 group
              ${isActive ? 'text-white' : 'text-text-secondary hover:text-white hover:bg-white/[0.03]'}
            `}
          >
            {({ isActive }) => (
              <>
                <item.icon className={`w-5 h-5 transition-colors duration-300 ${isActive ? 'text-primary' : 'group-hover:text-primary/70 text-text-muted'}`} />
                <span className={`font-medium text-sm tracking-wide ${isActive ? 'font-bold' : ''}`}>{item.label}</span>
                
                {isActive && (
                  <>
                    <motion.div 
                        layoutId="activePill"
                        className="absolute inset-0 bg-primary/10 border border-primary/20 rounded-xl z-[-1]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                    />
                    <motion.div 
                        layoutId="activeIndicator"
                        className="absolute left-[-2px] w-[3px] h-6 bg-primary rounded-r-full shadow-[2px_0_15px_rgba(255,0,61,0.8)]"
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                    />
                  </>
                )}
              </>
            )}
          </NavLink>
        ))}
      </nav>

      {/* Focus Area (Today's Focus) */}
      <div className="mt-6 mb-6">
          <div className="glass-panel p-5 bg-primary/5 border-primary/10 relative overflow-hidden group">
              {/* Subtle background graphic */}
              <div className="absolute bottom-0 right-0 w-24 h-24 bg-primary/10 blur-3xl rounded-full" />
              <img 
                src="https://images.unsplash.com/photo-1544022613-e87ce74567ad?auto=format&fit=crop&q=80&w=400" 
                alt="Focus" 
                className="absolute inset-0 w-full h-full object-cover opacity-10 mix-blend-overlay grayscale group-hover:scale-110 transition-transform duration-700" 
              />
              
              <div className="relative z-10">
                <div className="flex items-center gap-2 mb-2">
                    <div className="w-2 h-2 rounded-full bg-primary animate-pulse" />
                    <span className="text-[10px] font-black uppercase tracking-widest text-primary">Today's Focus</span>
                </div>
                <p className="text-[11px] text-text-secondary italic mb-3 leading-relaxed">
                  "Discipline is remembering what you want."
                </p>
                <div className="flex justify-between items-center text-[10px] text-white/60 font-bold mb-1">
                    <span>2/3 Goals Completed</span>
                    <span className="text-primary">66%</span>
                </div>
                <div className="w-full h-1 bg-white/5 rounded-full overflow-hidden">
                    <motion.div 
                        className="h-full bg-primary shadow-[0_0_10px_rgba(255,0,61,0.5)]" 
                        initial={{ width: 0 }}
                        animate={{ width: '66%' }}
                        transition={{ duration: 1.5, ease: "easeOut" }}
                    />
                </div>
              </div>
          </div>
      </div>

      {/* User Profile Section */}
      <div className="pt-6 border-t border-white/5">
        <div className="flex items-center gap-3 p-2 hover:bg-white/[0.03] rounded-2xl transition-colors cursor-pointer group">
          <div className="relative">
            <div className="w-11 h-11 rounded-full border-2 border-primary/20 p-0.5 group-hover:border-primary/40 transition-colors">
              <img 
                src="https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=100" 
                alt="User" 
                className="w-full h-full rounded-full object-cover" 
              />
            </div>
            <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-bg-dark rounded-full" />
          </div>
          <div className="flex-1 min-w-0">
            <h4 className="text-sm font-bold text-white truncate">Soul Trader</h4>
            <div className="flex items-center gap-1.5">
                <div className="px-1.5 py-0.5 bg-primary/20 rounded border border-primary/20">
                    <span className="text-[8px] font-black text-primary uppercase tracking-tighter">Premium</span>
                </div>
            </div>
          </div>
          <ChevronRight className="w-4 h-4 text-text-muted group-hover:text-primary transition-colors" />
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
