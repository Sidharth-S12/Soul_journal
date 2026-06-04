import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Mail, Lock, Eye, EyeOff, ArrowRight, ShieldCheck, AlertCircle } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import Logo from '../components/Logo';

const Login = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      await login(email, password);
      navigate('/dashboard');
    } catch (err) {
      // Map Firebase error codes to friendly messages
      switch (err.code) {
        case 'auth/user-not-found':
        case 'auth/wrong-password':
        case 'auth/invalid-credential':
          setError('Invalid email or password. Please try again.');
          break;
        case 'auth/invalid-email':
          setError('Please enter a valid email address.');
          break;
        case 'auth/too-many-requests':
          setError('Too many failed attempts. Please try again later.');
          break;
        case 'auth/network-request-failed':
          setError('Network error. Check your connection and try again.');
          break;
        default:
          setError(err.message || 'Login failed. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-bg-deepest flex items-center justify-center p-6 relative overflow-hidden">
      {/* Background lighting */}
      <div className="absolute top-[-20%] left-[-10%] w-[600px] h-[600px] bg-primary/10 blur-[120px] rounded-full animate-glow-pulse" />
      <div className="absolute bottom-[-20%] right-[-10%] w-[600px] h-[600px] bg-primary/5 blur-[120px] rounded-full opacity-50" />
      <div className="absolute inset-0 trading-grid-pattern opacity-10 pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: 'easeOut' }}
        className="glass-panel w-full max-w-[500px] p-10 md:p-14 z-10 border-white/10 shadow-[0_40px_100px_rgba(0,0,0,0.8)] relative"
      >
        {/* Top accent line */}
        <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary-glow to-transparent opacity-50" />

        {/* Logo */}
        <div className="flex flex-col items-center mb-12">
          <Logo size="default" />
          <div className="flex items-center gap-2 mt-4">
            <div className="h-[1px] w-8 bg-primary/30" />
            <p className="text-text-muted text-[10px] font-black uppercase tracking-[0.3em]">Authorized Access Only</p>
            <div className="h-[1px] w-8 bg-primary/30" />
          </div>
        </div>

        {/* Error banner */}
        {error && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="mb-6 flex items-center gap-3 px-4 py-3 bg-primary/10 border border-primary/30 rounded-xl"
          >
            <AlertCircle className="w-4 h-4 text-primary shrink-0" />
            <p className="text-xs font-bold text-primary">{error}</p>
          </motion.div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">
              Terminal ID / Email
            </label>
            <div className="relative group">
              <Mail className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                type="email"
                value={email}
                onChange={e => setEmail(e.target.value)}
                placeholder="master@souljournal.com"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-6 text-sm text-white outline-none
                           focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)]
                           transition-all placeholder:text-text-muted/50"
                required
                disabled={loading}
              />
            </div>
          </div>

          {/* Password */}
          <div className="space-y-2">
            <label className="text-[10px] font-black text-text-secondary uppercase tracking-widest ml-1 opacity-70">
              Encryption Key / Password
            </label>
            <div className="relative group">
              <Lock className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted group-focus-within:text-primary transition-colors" />
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={e => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full bg-white/[0.03] border border-white/10 rounded-2xl py-4 pl-14 pr-14 text-sm text-white outline-none
                           focus:bg-white/[0.06] focus:border-primary/50 focus:shadow-[0_0_20px_rgba(255,0,61,0.1)]
                           transition-all placeholder:text-text-muted/50"
                required
                disabled={loading}
              />
              <button
                type="button"
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-5 top-1/2 -translate-y-1/2 text-text-muted hover:text-white transition-colors"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {/* Remember + forgot */}
          <div className="flex items-center justify-between px-1">
            <label className="flex items-center gap-3 cursor-pointer group">
              <input
                type="checkbox"
                className="w-4 h-4 rounded border-white/10 bg-white/5 text-primary focus:ring-primary/20 cursor-pointer"
              />
              <span className="text-[11px] text-text-muted group-hover:text-text-secondary transition-colors font-bold uppercase tracking-tighter">
                Remember Terminal
              </span>
            </label>
            <Link
              to="/forgot-password"
              className="text-[11px] text-primary hover:text-primary-glow font-black uppercase tracking-tighter transition-colors"
            >
              Recovery Mode
            </Link>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="btn-primary w-full py-4 relative group overflow-hidden disabled:opacity-60 disabled:cursor-not-allowed"
          >
            <span className="relative z-10 flex items-center justify-center gap-2">
              {loading ? (
                <>
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Authenticating...
                </>
              ) : (
                <>
                  Sync Terminal
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </>
              )}
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