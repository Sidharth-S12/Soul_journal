import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
    Upload, X, Plus, ChevronDown, Calendar, Clock,
    TrendingUp, TrendingDown, Save, ArrowLeft, AlertCircle
} from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';
import Sidebar from '../components/Sidebar';

// ── helpers ──────────────────────────────────────────────────────────────────
const INSTRUMENTS = [
    'EURUSD', 'GBPUSD', 'USDJPY', 'AUDUSD', 'USDCAD', 'USDCHF', 'NZDUSD',
    'XAUUSD', 'XAGUSD', 'WTI', 'BRENT',
    'NAS100', 'SPX500', 'US30', 'GER40', 'UK100',
    'BTCUSD', 'ETHUSD', 'MNQ', 'MES', 'ES', 'NQ',
];
const SETUPS = [
    'ICT - LIQ Sweep', 'ICT - FVG', 'ICT - OB', 'Breaker + FVG',
    'MSS + OB', 'Trend Continuation', 'Breakout', 'Pullback', 'Reversal',
    'Support / Resistance', 'Custom',
];
const MARKETS = [
    'Trending Up', 'Trending Down', 'Ranging / Consolidation',
    'High Volatility', 'Low Volatility', 'News Driven',
];

const Section = ({ number, title, subtitle, children }) => (
    <div className="glass-panel p-7 h-full">
        <h2 className="text-sm font-black text-white mb-6 flex items-center gap-2">
            <span className="text-primary font-black">{number}.</span> {title}
            {subtitle && <span className="text-text-muted font-normal text-xs ml-1">({subtitle})</span>}
        </h2>
        <div className="space-y-5">{children}</div>
    </div>
);

const Field = ({ label, children }) => (
    <div className="space-y-1.5">
        <label className="text-[10px] font-black text-text-muted uppercase tracking-widest">{label}</label>
        {children}
    </div>
);

const inputCls = "w-full bg-white/[0.03] border border-white/10 rounded-xl px-4 py-3 text-sm text-white outline-none focus:bg-white/[0.06] focus:border-primary/40 transition-all placeholder:text-text-muted/50";
const textareaCls = `${inputCls} resize-none`;

const SelectField = ({ value, onChange, options, placeholder }) => (
    <div className="relative">
        <select
            value={value}
            onChange={e => onChange(e.target.value)}
            className={`${inputCls} appearance-none pr-10 cursor-pointer`}
        >
            <option value="" disabled>{placeholder}</option>
            {options.map(o => <option key={o} value={o} className="bg-bg-darker">{o}</option>)}
        </select>
        <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-muted pointer-events-none" />
    </div>
);

const CharCount = ({ val, max }) => (
    <div className="text-right text-[10px] text-text-muted mt-1">{(val || '').length} / {max}</div>
);

// ── Component ─────────────────────────────────────────────────────────────────
export default function NewTrade() {
    const { currentUser, loading: authLoading } = useAuth();
    const navigate = useNavigate();
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [success, setSuccess] = useState('');

    // ── Form state ──
    const [form, setForm] = useState({
        // 1. Basic
        instrument: '', direction: 'Long', setup: 'Custom', marketEnv: '', tags: [],
        tagInput: '',
        // 2. Trade Details
        entryPrice: '', entryTime: new Date().toISOString().slice(0, 16), positionSize: '', sizeUnit: 'Lots',
        leverage: '1', stopLoss: '', takeProfit: '', riskPct: '', rewardPct: '',
        // 3. Results
        exitPrice: '', exitTime: '', result: 'Win',
        netPnl: '', currency: 'USD', rMultiple: '', commissions: '',
        // 4. Journal
        preAnalysis: '', tradePlan: '', execution: '',
        // 5. Post-Trade Review
        wentWell: '', improved: '', lessonsLearned: '',
        // 6. Attachments
        notes: '',
    });

    const set = (key, val) => {
        setForm(f => ({ ...f, [key]: val }));
        if (error) setError('');
    };

    const addTag = () => {
        const t = form.tagInput.trim();
        if (t && !form.tags.includes(t)) set('tags', [...form.tags, t]);
        set('tagInput', '');
    };

    const removeTag = (t) => set('tags', form.tags.filter(x => x !== t));

    const handleSave = async () => {
        if (!form.instrument) { setError('Please select an instrument.'); return; }
        if (!form.entryPrice) { setError('Entry price is required.'); return; }
        if (!currentUser) { setError('User not authenticated. Please log in again.'); return; }

        setError('');
        setSuccess('');
        setSaving(true);

        try {
            // Defensively get UID, fallback to mock if needed (though Firebase addDoc needs real UID for subcollection)
            const uid = currentUser.uid || currentUser.id || 'mock-user-id';
            
            console.log('Saving trade for user:', uid);

            const tradeData = {
                uid: uid,
                instrument: form.instrument,
                direction: form.direction,
                setup: form.setup || 'Custom',
                marketEnv: form.marketEnv || '',
                tags: form.tags || [],
                entryPrice: parseFloat(form.entryPrice) || 0,
                entryTime: form.entryTime || new Date().toISOString(),
                positionSize: parseFloat(form.positionSize) || 0,
                sizeUnit: form.sizeUnit || 'Lots',
                leverage: form.leverage || '1',
                stopLoss: form.stopLoss ? parseFloat(form.stopLoss) : null,
                takeProfit: form.takeProfit ? parseFloat(form.takeProfit) : null,
                riskPct: parseFloat(form.riskPct) || 0,
                rewardPct: parseFloat(form.rewardPct) || 0,
                exitPrice: form.exitPrice ? parseFloat(form.exitPrice) : null,
                exitTime: form.exitTime || null,
                result: form.result || 'Win',
                netPnl: parseFloat(form.netPnl) || 0,
                currency: form.currency || 'USD',
                rMultiple: parseFloat(form.rMultiple) || 0,
                commissions: parseFloat(form.commissions) || 0,
                preAnalysis: form.preAnalysis || '',
                tradePlan: form.tradePlan || '',
                execution: form.execution || '',
                wentWell: form.wentWell || '',
                improved: form.improved || '',
                lessonsLearned: form.lessonsLearned || '',
                notes: form.notes || '',
                createdAt: serverTimestamp(),
            };

            await addDoc(collection(db, 'users', uid, 'trades'), tradeData);
            
            setSuccess('Trade saved successfully! Redirecting...');
            setTimeout(() => {
                navigate('/dashboard');
            }, 1500);
        } catch (e) {
            console.error('Save error:', e);
            setError(e.message || 'Failed to save trade. Please check your connection and try again.');
        } finally {
            setSaving(false);
        }
    };

    if (authLoading) return null;

    return (
        <div className="min-h-screen bg-bg-deepest flex overflow-hidden">
            <Sidebar />

            <main className="flex-1 ml-[220px] h-screen overflow-y-auto custom-scrollbar">
                {/* Header */}
                <div className="sticky top-0 z-40 bg-bg-deepest/80 backdrop-blur-xl border-b border-white/[0.04] px-6 lg:px-10 py-5 flex items-center justify-between">
                    <div>
                        <div className="flex items-center gap-3 mb-1">
                            <button onClick={() => navigate('/dashboard')} className="text-text-muted hover:text-white transition-colors">
                                <ArrowLeft className="w-4 h-4" />
                            </button>
                            <h1 className="text-xl font-black text-white">New Trade</h1>
                        </div>
                        <p className="text-[10px] uppercase tracking-widest text-text-muted ml-7 font-bold">Log your trade details to track performance</p>
                    </div>
                    <div className="flex gap-3">
                        <button onClick={() => navigate('/dashboard')} className="btn-glass px-5 py-2.5 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                        <button
                            onClick={handleSave}
                            disabled={saving}
                            className="btn-primary px-6 py-2.5 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50 shadow-[0_0_20px_rgba(255,0,61,0.3)]"
                        >
                            <Save className="w-3.5 h-3.5" />
                            {saving ? 'Saving...' : 'Save Trade'}
                        </button>
                    </div>
                </div>

                <div className="p-6 lg:p-10 max-w-[1600px] mx-auto">
                    {error && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-6 px-5 py-3 bg-primary/10 border border-primary/30 rounded-xl text-sm text-primary font-bold flex items-center gap-3"
                        >
                            <AlertCircle className="w-4 h-4" />
                            {error}
                        </motion.div>
                    )}

                    {success && (
                        <motion.div 
                            initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }}
                            className="mb-6 px-5 py-3 bg-trading-green/10 border border-trading-green/30 rounded-xl text-sm text-trading-green font-bold"
                        >
                            {success}
                        </motion.div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                        {/* ── 1. Basic Information ── */}
                        <div className="space-y-6">
                            <Section number="1" title="Basic Information">
                                <Field label="Instrument">
                                    <SelectField value={form.instrument} onChange={v => set('instrument', v)}
                                        options={INSTRUMENTS} placeholder="Select instrument" />
                                </Field>

                                <Field label="Direction">
                                    <div className="grid grid-cols-2 gap-2">
                                        {['Long', 'Short'].map(d => (
                                            <button key={d} onClick={() => set('direction', d)}
                                                className={`py-3 rounded-xl text-sm font-black transition-all border ${form.direction === d
                                                    ? d === 'Long'
                                                        ? 'bg-trading-green/15 border-trading-green/40 text-trading-green shadow-[0_0_15px_rgba(0,255,136,0.15)]'
                                                        : 'bg-primary/15 border-primary/40 text-primary shadow-[0_0_15px_rgba(255,0,61,0.15)]'
                                                    : 'bg-white/[0.03] border-white/10 text-text-muted hover:border-white/20'
                                                    }`}>
                                                {d === 'Long'
                                                    ? <span className="flex items-center justify-center gap-1.5"><TrendingUp className="w-3.5 h-3.5" />{d}</span>
                                                    : <span className="flex items-center justify-center gap-1.5"><TrendingDown className="w-3.5 h-3.5" />{d}</span>
                                                }
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                <Field label="Setup / Strategy">
                                    <SelectField value={form.setup} onChange={v => set('setup', v)}
                                        options={SETUPS} placeholder="Select setup / strategy" />
                                </Field>

                                <Field label="Market / Environment">
                                    <SelectField value={form.marketEnv} onChange={v => set('marketEnv', v)}
                                        options={MARKETS} placeholder="Select market condition" />
                                </Field>

                                <Field label="Tags (Optional)">
                                    <div className="space-y-2">
                                        <div className="flex gap-2">
                                            <input value={form.tagInput} onChange={e => set('tagInput', e.target.value)}
                                                onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                                                placeholder="Add tag..."
                                                className={`${inputCls} flex-1`} />
                                            <button onClick={addTag} className="px-3 py-2 bg-white/[0.05] border border-white/10 rounded-xl hover:border-primary/30 transition-colors">
                                                <Plus className="w-4 h-4 text-text-muted" />
                                            </button>
                                        </div>
                                        {form.tags.length > 0 && (
                                            <div className="flex flex-wrap gap-1.5">
                                                {form.tags.map(t => (
                                                    <span key={t} className="flex items-center gap-1 px-2.5 py-1 bg-primary/10 border border-primary/20 rounded-full text-[10px] font-black text-primary uppercase tracking-tighter">
                                                        {t}
                                                        <button onClick={() => removeTag(t)}><X className="w-2.5 h-2.5" /></button>
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                    </div>
                                </Field>
                            </Section>
                        </div>

                        {/* ── 2. Trade Details ── */}
                        <div className="space-y-6">
                            <Section number="2" title="Trade Details">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Entry Price">
                                        <input value={form.entryPrice} onChange={e => set('entryPrice', e.target.value)}
                                            placeholder="0.00000" className={inputCls} type="number" step="any" />
                                    </Field>
                                    <Field label="Entry Time">
                                        <input value={form.entryTime} onChange={e => set('entryTime', e.target.value)}
                                            className={inputCls} type="datetime-local" />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Position Size">
                                        <div className="flex gap-2">
                                            <input value={form.positionSize} onChange={e => set('positionSize', e.target.value)}
                                                placeholder="1.00" className={`${inputCls} flex-1`} type="number" step="any" />
                                            <div className="relative">
                                                <select value={form.sizeUnit} onChange={e => set('sizeUnit', e.target.value)}
                                                    className={`${inputCls} pr-8 w-24 cursor-pointer appearance-none`}>
                                                    {['Lots', 'Units', 'Contracts'].map(u => <option key={u} value={u} className="bg-bg-darker">{u}</option>)}
                                                </select>
                                                <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
                                            </div>
                                        </div>
                                    </Field>
                                    <Field label="Leverage">
                                        <input value={form.leverage} onChange={e => set('leverage', e.target.value)}
                                            placeholder="1" className={inputCls} />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Stop Loss">
                                        <input value={form.stopLoss} onChange={e => set('stopLoss', e.target.value)}
                                            placeholder="0.00" className={inputCls} type="number" step="any" />
                                    </Field>
                                    <Field label="Take Profit">
                                        <input value={form.takeProfit} onChange={e => set('takeProfit', e.target.value)}
                                            placeholder="0.00" className={inputCls} type="number" step="any" />
                                    </Field>
                                </div>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Risk %">
                                        <div className="relative">
                                            <input value={form.riskPct} onChange={e => set('riskPct', e.target.value)}
                                                placeholder="1.0" className={`${inputCls} pr-8`} type="number" step="any" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span>
                                        </div>
                                    </Field>
                                    <Field label="Reward %">
                                        <div className="relative">
                                            <input value={form.rewardPct} onChange={e => set('rewardPct', e.target.value)}
                                                placeholder="2.0" className={`${inputCls} pr-8`} type="number" step="any" />
                                            <span className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted text-sm">%</span>
                                        </div>
                                    </Field>
                                </div>
                            </Section>
                        </div>

                        {/* ── 3. Results ── */}
                        <div className="space-y-6">
                            <Section number="3" title="Results" subtitle="Post-close data">
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="Exit Price">
                                        <input value={form.exitPrice} onChange={e => set('exitPrice', e.target.value)}
                                            placeholder="0.00" className={inputCls} type="number" step="any" />
                                    </Field>
                                    <Field label="Exit Time">
                                        <input value={form.exitTime} onChange={e => set('exitTime', e.target.value)}
                                            className={inputCls} type="datetime-local" />
                                    </Field>
                                </div>

                                <Field label="Result">
                                    <div className="grid grid-cols-3 gap-2">
                                        {['Win', 'Loss', 'BE'].map(r => (
                                            <button key={r} onClick={() => set('result', r)}
                                                className={`py-3 rounded-xl text-sm font-black transition-all border ${form.result === r
                                                    ? r === 'Win' ? 'bg-trading-green/15 border-trading-green/40 text-trading-green' 
                                                    : r === 'Loss' ? 'bg-primary/15 border-primary/40 text-primary'
                                                    : 'bg-white/10 border-white/30 text-white'
                                                    : 'bg-white/[0.03] border-white/10 text-text-muted hover:border-white/20'
                                                    }`}>
                                                {r}
                                            </button>
                                        ))}
                                    </div>
                                </Field>

                                <Field label="Net P&L">
                                    <div className="flex gap-2">
                                        <input value={form.netPnl} onChange={e => set('netPnl', e.target.value)}
                                            placeholder="0.00" className={`${inputCls} flex-1`} type="number" step="any" />
                                        <div className="relative">
                                            <select value={form.currency} onChange={e => set('currency', e.target.value)}
                                                className={`${inputCls} w-20 pr-7 cursor-pointer appearance-none`}>
                                                {['USD', 'EUR', 'GBP'].map(c => <option key={c} value={c} className="bg-bg-darker">{c}</option>)}
                                            </select>
                                            <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-text-muted pointer-events-none" />
                                        </div>
                                    </div>
                                </Field>

                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                    <Field label="R Multiple">
                                        <input value={form.rMultiple} onChange={e => set('rMultiple', e.target.value)}
                                            placeholder="1.5" className={inputCls} type="number" step="any" />
                                    </Field>
                                    <Field label="Commissions">
                                        <input value={form.commissions} onChange={e => set('commissions', e.target.value)}
                                            placeholder="0.00" className={inputCls} type="number" step="any" />
                                    </Field>
                                </div>
                            </Section>
                        </div>

                    </div>

                    {/* Lower Sections Row */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                        <Section number="4" title="Trade Journal">
                            <Field label="Pre-Trade Analysis">
                                <textarea value={form.preAnalysis} onChange={e => set('preAnalysis', e.target.value)}
                                    rows={4} placeholder="What do you see?" className={textareaCls} />
                            </Field>
                            <Field label="Trade Plan & Execution">
                                <textarea value={form.tradePlan} onChange={e => set('tradePlan', e.target.value)}
                                    rows={4} placeholder="How did it go?" className={textareaCls} />
                            </Field>
                        </Section>

                        <Section number="5" title="Review & Lessons">
                            <Field label="What went well?">
                                <textarea value={form.wentWell} onChange={e => set('wentWell', e.target.value)}
                                    rows={4} placeholder="Strengths..." className={textareaCls} />
                            </Field>
                            <Field label="Lessons & Improvements">
                                <textarea value={form.lessonsLearned} onChange={e => set('lessonsLearned', e.target.value)}
                                    rows={4} placeholder="Next time..." className={textareaCls} />
                            </Field>
                        </Section>
                    </div>

                    {/* Bottom Save Bar (redundant but helpful) */}
                    <div className="flex justify-end gap-3 mt-8 pt-8 border-t border-white/[0.04]">
                        <button onClick={() => navigate('/dashboard')} className="btn-glass px-8 py-3 text-[10px] font-black uppercase tracking-widest">Cancel</button>
                        <button onClick={handleSave} disabled={saving}
                            className="btn-primary px-10 py-3 text-[10px] font-black uppercase tracking-widest flex items-center gap-2 disabled:opacity-50">
                            <Save className="w-3.5 h-3.5" />
                            {saving ? 'Saving...' : 'Save Trade'}
                        </button>
                    </div>
                </div>
            </main>
        </div>
    );
}