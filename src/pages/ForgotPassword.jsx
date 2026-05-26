import React from 'react';
import { motion } from 'framer-motion';
import { HiMail } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const ForgotPassword = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-darker">
      <motion.div 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="glass-card w-full max-w-[450px] p-10"
      >
        <Logo className="justify-center mb-8" />
        <h2 className="text-2xl font-black text-white text-center mb-2">Reset Password</h2>
        <p className="text-text-muted text-center mb-8 text-sm">
          Enter your email and we'll send you instructions to reset your password.
        </p>
        
        <form className="space-y-6">
          <div className="space-y-2">
            <label className="text-xs font-bold text-text-muted uppercase tracking-widest ml-1">Email Address</label>
            <div className="relative group">
              <HiMail className="absolute left-4 top-1/2 -translate-y-1/2 text-text-muted group-focus-within:text-primary transition-colors text-xl" />
              <input 
                type="email"
                placeholder="name@example.com"
                className="input-field pl-12"
                required
              />
            </div>
          </div>
          
          <button className="btn-primary w-full">Send Reset Link</button>
        </form>

        <div className="mt-8 text-center">
          <Link to="/login" className="text-sm text-text-muted hover:text-primary transition-colors">
            Back to Secure Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default ForgotPassword;
