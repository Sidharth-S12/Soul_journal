import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck } from 'lucide-react';
import Logo from '../components/Logo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-bg-deepest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-glow-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-50" />

      {/* Modern Grid Overlay */}
      <div className="absolute inset-0 trading-grid-pattern opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel w-full max-w-[500px] p-10 md:p-14 z-10 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative"
      >
        {/* Top Accent Line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-50" />

        <div className="flex flex-col items-center mb-12">
          <Logo size="default" />
          <div className="flex items-center gap-2 mt-4">
            <div className="h-[1px] w-8 bg-primary/30" />
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Authorized Access Only</p>
            <div className="h-[1px] w-8 bg-primary/30" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">Terminal ID / Email</label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="master@souljournal.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)] transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center ml-1">
              <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest opacity-70">Encryption Key / Password</label>
            </div>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)] transition-all placeholder:text-text-muted/50"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="text-[11px] text-text-muted group-hover:text-text-secondary transition-colors font-bold uppercase tracking-tighter">Remember Terminal</span>
            </label>
            <Link to="/forgot-password" size="sm" className="text-[11px] text-primary hover:text-primary-glow font-black uppercase tracking-tighter transition-colors">
              Recovery Mode
            </Link>
          </div>

          <button type="submit" className="btn-primary w-full py-4 relative group overflow-hidden">
            <span className="relative z-10 flex items-center justify-center gap-2">
              Sync Terminal
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </span>
            <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
          </button>
        </form>

        <div className="mt-10 text-center flex flex-col items-center gap-4">
          <p className="text-text-muted text-xs font-bold uppercase tracking-tighter">
            New operative?{' '}
            <Link to="/signup" className="text-white hover:text-primary transition-colors border-b border-primary/40">
              Initialize Account
            </Link>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold opacity-50 uppercase tracking-widest">
            <ShieldCheck className="w-3 h-3" />
            <span>Multi-Layer Encryption Active</span>
          </div>
        </div>
      </motion.div>

    </div>
  );
};

export default Login;