import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, User, ShieldCheck, ArrowRight, CheckCircle2 } from 'lucide-react';
import Logo from '../components/Logo';

const Signup = () => {
  const [email, setEmail] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    navigate('/dashboard');
  };

  const passwordStrength = (pwd) => {
    if (pwd.length === 0) return 0;
    if (pwd.length < 6) return 1;
    if (pwd.length < 10) return 2;
    return 3;
  };

  const strength = passwordStrength(password);

  return (
    <div className="min-h-screen bg-bg-deepest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Cinematic Background Lighting */}
      <div className="absolute top-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-glow-pulse" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
      
      <div className="absolute inset-0 trading-grid-pattern opacity-10 pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel w-full max-w-[550px] p-10 md:p-14 z-10 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative"
      >
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-50" />

        <div className="flex flex-col items-center mb-10">
          <Logo className="scale-110" />
          <div className="flex items-center gap-3 mt-8">
              <div className="h-[1px] w-6 bg-primary/30" />
              <p className="text-text-muted text-[9px] font-black uppercase tracking-[0.4em]">operative initialization</p>
              <div className="h-[1px] w-6 bg-primary/30" />
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">Operative Handle</label>
            <div className="relative group">
              <User className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Soul operative #42"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)] transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
          </div>

          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">Transmission Channel (Email)</label>
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
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">Security Key (Password)</label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input 
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)] transition-all placeholder:text-text-muted/50"
                required
              />
            </div>
            {/* Strength indicator */}
            {password && (
              <div className="flex gap-2.5 mt-3 px-1">
                {[1, 2, 3].map((s) => (
                  <div 
                    key={s} 
                    className={`h-0.5 flex-1 rounded-full transition-all duration-500 ${
                      s <= strength 
                        ? strength === 1 ? 'bg-primary' : strength === 2 ? 'bg-orange-500' : 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.5)]'
                        : 'bg-white/5'
                    }`}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="flex items-start gap-4 ml-1 pt-4 group cursor-pointer">
            <div className="relative mt-1">
                <input 
                type="checkbox" 
                id="terms" 
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer peer"
                required
                />
                <CheckCircle2 className="absolute inset-0 w-4 h-4 text-primary opacity-0 peer-checked:opacity-100 transition-opacity pointer-events-none" />
            </div>
            <label htmlFor="terms" className="text-[10px] text-text-muted leading-relaxed font-bold uppercase tracking-tighter cursor-pointer">
              I acknowledge the <span className="text-white">Operative Protocol</span> and <span className="text-white">Privacy Mandate</span>. I understand that capital risk is inherent in terminal activity.
            </label>
          </div>

          <button type="submit" className="btn-primary w-full py-4 mt-6">
            Initialize Account
          </button>
        </form>

        <div className="mt-10 text-center flex flex-col items-center gap-4">
          <p className="text-text-muted text-xs font-bold uppercase tracking-tighter">
            Already authorized?{' '}
            <Link to="/login" className="text-white hover:text-primary transition-colors border-b border-primary/40">
              Sync Terminal
            </Link>
          </p>
          <div className="flex items-center gap-2 text-[10px] text-text-muted font-bold opacity-50 uppercase tracking-widest">
              <ShieldCheck className="w-3 h-3" />
              <span>Bio-Metric encryption Ready</span>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Signup;
