import React from 'react';
import Layout from '../components/Layout';
import { User, Bell, Shield, Wallet, LogOut } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const SettingsPage = () => {
  const { currentUser } = useAuth();
  
  const sections = [
    { icon: User, title: 'Profile Settings', desc: 'Update your display name and avatar' },
    { icon: Bell, title: 'Notifications', desc: 'Manage your trade alerts and summary emails' },
    { icon: Shield, title: 'Security', desc: 'Secure your account with 2FA and password management' },
    { icon: Wallet, title: 'Subscription', desc: 'Manage your premium plan and billing' },
  ];

  return (
    <Layout>
      <div className="space-y-8">
        <section>
          <h1 className="font-heading text-3xl font-black text-white tracking-tight">System Settings</h1>
          <p className="text-sm text-text-muted mt-1">Customize your Soul Journal experience.</p>
        </section>

        <div className="max-w-3xl space-y-4">
          {sections.map((s, i) => (
            <div key={i} className="glass-panel p-6 flex items-center justify-between group cursor-pointer hover:border-primary/20 transition-all">
              <div className="flex items-center gap-4">
                <div className="p-3 rounded-2xl bg-white/5 border border-white/5 group-hover:bg-primary/10 group-hover:border-primary/20 transition-all">
                  <s.icon className="w-5 h-5 text-text-muted group-hover:text-primary transition-all" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white">{s.title}</h4>
                  <p className="text-[10px] font-bold text-text-muted uppercase tracking-widest mt-0.5">{s.desc}</p>
                </div>
              </div>
              <button className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-white transition-colors">Configure</button>
            </div>
          ))}
          
          <div className="pt-8">
            <button className="flex items-center justify-center gap-2 w-full py-4 rounded-2xl bg-primary/10 border border-primary/20 text-primary font-black text-xs uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              <LogOut className="w-4 h-4" />
              Sign Out of Account
            </button>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default SettingsPage;
