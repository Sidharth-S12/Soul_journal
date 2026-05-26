import React from 'react';
import { motion } from 'framer-motion';
import { HiMailOpen } from 'react-icons/hi';
import { Link } from 'react-router-dom';
import Logo from '../components/Logo';

const VerifyEmail = () => {
  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-bg-darker">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="glass-card w-full max-w-[450px] p-10 text-center"
      >
        <Logo className="justify-center mb-8" />
        <div className="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mx-auto mb-6 border border-primary/30">
          <HiMailOpen className="text-4xl text-primary animate-pulse" />
        </div>
        <h2 className="text-2xl font-black text-white mb-4">Verify your identity</h2>
        <p className="text-text-muted mb-8 italic">
          We've sent a transmission to your encrypted email address. Please click the link to authorize your terminal access.
        </p>
        <div className="space-y-4">
          <button className="btn-primary w-full">Resend Transmission</button>
          <Link to="/login" className="block text-sm text-text-muted hover:text-white transition-colors">
            Back to Login
          </Link>
        </div>
      </motion.div>
    </div>
  );
};

export default VerifyEmail;
