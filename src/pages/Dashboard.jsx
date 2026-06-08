import React, { useMemo, useState, useCallback } from 'react';
import { motion } from 'framer-motion';
import { Info, ChevronLeft, ChevronRight, BarChart2, Camera } from 'lucide-react';
import {
  AreaChart, Area, BarChart, Bar, ScatterChart, Scatter,
  ComposedChart, Line, XAxis, YAxis, CartesianGrid, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from 'recharts';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import { useTrades } from '../hooks/useTrades';

// ── Helpers ────────────────────────────────────────────────────────────────────
const fd = (n) => {
  if (n == null) return '$0.00';
  const abs = Math.abs(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
  return n < 0 ? `-$${abs}` : `$${abs}`;
};
const clr    = (n) => n >= 0 ? '#00FF88' : '#FF003D';
const clrCls = (n) => n >= 0 ? 'text-[#00FF88]' : 'text-[#FF003D]';

const MONTHS = ['January','February','March','April','May','June',
  'July','August','September','October','November','December'];

// Filter trades by time period
const filterByPeriod = (trades, period, cal, selectedDay, customFrom, customTo) => {
  if (period === 'all') return trades;
  return trades.filter(t => {
    const d = t.entryTime
      ? new Date(t.entryTime)
      : t.createdAt?.toDate?.();
    if (!d) return false;
    if (period === 'day') {
      return (
        selectedDay &&
        d.getFullYear() === cal.year &&
        d.getMonth() === cal.month &&
        d.getDate() === selectedDay
      );
    }
    if (period === 'month') {
      return d.getFullYear() === cal.year && d.getMonth() === cal.month;
    }
    if (period === 'year') {
      return d.getFullYear() === cal.year;
    }
    if (period === 'custom') {
      if (!customFrom || !customTo) return true;
      const from = new Date(customFrom);
      const to   = new Date(customTo);
      to.setHours(23, 59, 59);
      return d >= from && d <= to;
    }
    return true;
  });
};

// ── Sub-components ─────────────────────────────────────────────────────────────
const Tip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background:'#0d0f14', border:'1px solid #1e2130', borderRadius:8, padding:'8px 12px', fontSize:11 }}>
      {label && <p style={{ color:'#64748B', marginBottom:3 }}>{label}</p>}
      {payload.map((p,i) => (
        <p key={i} style={{ fontWeight:800, color: typeof p.value==='number' ? clr(p.value) : (p.color||'#fff') }}>
          {typeof p.value==='number' ? fd(p.value) : p.value}
        </p>
      ))}
    </div>
  );
};

const Empty = ({ msg='No data' }) => (
  <div style={{ display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center', height:'100%', gap:6, opacity:0.3 }}>
    <BarChart2 size={16} color="#64748B"/>
    <span style={{ fontSize:9, fontWeight:700, color:'#64748B', textTransform:'uppercase', letterSpacing:'0.15em' }}>{msg}</span>
  </div>
);

// Half-circle gauge matching SOUL reference
const Gauge = ({ pct = 0, color = '#00FF88' }) => {
  const r = 26, circ = Math.PI * r, dash = Math.min(pct / 100, 1) * circ;
  return (
    <svg width="52" height="30" viewBox="0 0 64 40">
      <path d="M 6 36 A 26 26 0 0 1 58 36" fill="none" stroke="#1e2130" strokeWidth="6" strokeLinecap="round"/>
      <path d="M 6 36 A 26 26 0 0 1 58 36" fill="none" stroke={color} strokeWidth="6" strokeLinecap="round"
        strokeDasharray={`${dash} ${circ}`}/>
      {/* needle dot */}
      {(() => {
        const angle = Math.PI * (pct / 100);
        const cx = 6 + 52 * Math.cos(Math.PI - angle);
        const cy = 36 - 26 * Math.sin(Math.PI - angle);
        return <circle cx={cx} cy={cy} r="3.5" fill={color}/>;
      })()}
    </svg>
  );
};

const SHdr = ({ title }) => (
  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:10 }}>
    <span style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.18em' }}>{title}</span>
    <Info size={11} color="#334155"/>
  </div>
);

// Chart axis / grid shared config
const xAx = { axisLine:false, tickLine:false, tick:{ fill:'#334155', fontSize:8, fontWeight:700 }, interval:'preserveStartEnd' };
const yAx = { axisLine:false, tickLine:false, tick:{ fill:'#334155', fontSize:8, fontWeight:700 }, tickFormatter:v=>`$${v}`, width:40 };
const grid = { strokeDasharray:'2 5', stroke:'rgba(255,255,255,0.03)', vertical:false };

// ── Shared card style ──────────────────────────────────────────────────────────
const card = {
  background: '#111318',
  border: '1px solid #1e2130',
  borderRadius: 10,
};

// ── Main ───────────────────────────────────────────────────────────────────────
export default function Dashboard() {
  const { trades: allTrades, loading } = useTrades();
  const today = new Date();
  const [period, setPeriod]   = useState('all');
  const [cal, setCal]         = useState({ year: today.getFullYear(), month: today.getMonth() });
  const [selectedDay, setSelectedDay] = useState(null);
  const [tab, setTab]         = useState('recent');
  const [customFrom, setCustomFrom] = useState(null);
  const [customTo, setCustomTo]     = useState(null);

  const trades = useMemo(
    () => filterByPeriod(allTrades, period, cal, selectedDay, customFrom, customTo),
    [allTrades, period, cal, selectedDay, customFrom, customTo]
  );

  // ── Stats ──────────────────────────────────────────────────────────────────
  const S = useMemo(() => {
    const closed = trades.filter(t => t.exitPrice != null && t.netPnl != null);
    const wins   = closed.filter(t => t.result === 'Win');
    const losses = closed.filter(t => t.result === 'Loss');
    if (!closed.length) return { netPnl:0, winRate:0, pf:0, dayWinPct:0, avgWin:0, avgLoss:0, wins:0, losses:0, total:0 };
    const netPnl = closed.reduce((s,t) => s+(t.netPnl||0), 0);
    const gw     = wins.reduce((s,t) => s+(t.netPnl||0), 0);
    const gl     = Math.abs(losses.reduce((s,t) => s+(t.netPnl||0), 0));
    const byDay  = {};
    closed.forEach(t => {
      const d = (t.entryTime||'').split('T')[0] || t.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || '';
      if (d) byDay[d] = (byDay[d]||0) + (t.netPnl||0);
    });
    const dv = Object.values(byDay);
    return {
      netPnl, wins:wins.length, losses:losses.length, total:closed.length,
      winRate: (wins.length/closed.length)*100,
      pf: gl>0 ? gw/gl : gw>0 ? 99 : 0,
      dayWinPct: dv.length ? (dv.filter(v=>v>0).length/dv.length)*100 : 0,
      avgWin:  wins.length   ? gw/wins.length   : 0,
      avgLoss: losses.length ? gl/losses.length : 0,
    };
  }, [trades]);

  // ── Chart data ─────────────────────────────────────────────────────────────
  const { cumData, dailyData, ddData } = useMemo(() => {
    const closed = [...trades]
      .filter(t => t.exitPrice!=null && t.netPnl!=null)
      .sort((a,b) => {
        const da = a.entryTime || a.createdAt?.toDate?.()?.toISOString?.() || '';
        const db2= b.entryTime || b.createdAt?.toDate?.()?.toISOString?.() || '';
        return da.localeCompare(db2);
      });
    const byDay = {};
    closed.forEach(t => {
      const d = (t.entryTime||'').split('T')[0] || t.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || '';
      if (d) byDay[d] = (byDay[d]||0) + (t.netPnl||0);
    });
    let cum=0, peak=0;
    const cumData=[], dailyData=[], ddData=[];
    Object.entries(byDay).sort(([a],[b])=>a.localeCompare(b)).forEach(([date,pnl]) => {
      cum+=pnl; if(cum>peak) peak=cum;
      const lbl = date.slice(5).replace('-','/');
      const rounded = +cum.toFixed(2);
      cumData.push({ date:lbl, v:rounded, vNeg: rounded < 0 ? rounded : null });
      dailyData.push({ date:lbl, v:+pnl.toFixed(2) });
      ddData.push({ date:lbl, v:+(cum-peak).toFixed(2) });
    });
    return { cumData, dailyData, ddData };
  }, [trades]);


  const chartData = useMemo(() => {
    return dailyData.map(item => ({
      ...item,
      profit: item.v >= 0 ? item.v : null,
      loss: item.v < 0 ? item.v : null,
    }));
  }, [dailyData]);

  const accountBalanceData = useMemo(() => {
    return cumData.map(item => ({
      date: item.date,
      balance: item.v,
      deposits: 0
    }));
  }, [cumData]);

  const cumGradientOffset = useMemo(() => {
  if (!cumData.length) return 1;
  const maxV = Math.max(...cumData.map(d => d.v));
  const minV = Math.min(...cumData.map(d => d.v));
  if (maxV <= 0) return 0;
  if (minV >= 0) return 1;
  return maxV / (maxV - minV);
}, [cumData]);
  // ── Calendar ───────────────────────────────────────────────────────────────
  const calInfo = useMemo(() => {
    const { year, month } = cal;
    const dim  = new Date(year, month+1, 0).getDate();
    const fdow = new Date(year, month, 1).getDay();
    const byDay = {};
    allTrades.filter(t => t.exitPrice).forEach(t => {
      const raw = t.entryTime || t.createdAt?.toDate?.()?.toISOString?.() || '';
      const d   = raw.split('T')[0]; if (!d) return;
      const [y,m,day] = d.split('-').map(Number);
      if (y===year && m-1===month) {
        if (!byDay[day]) byDay[day] = { pnl:0, count:0, wins:0 };
        byDay[day].pnl   += t.netPnl||0;
        byDay[day].count += 1;
        if (t.result==='Win') byDay[day].wins+=1;
      }
    });
    const weeks=[]; let wp=0, wd=0;
    for (let d=1; d<=dim; d++) {
      if (byDay[d]) { wp+=byDay[d].pnl; wd++; }
      if (new Date(year,month,d).getDay()===6 || d===dim) { weeks.push({pnl:wp,days:wd}); wp=0; wd=0; }
    }
    const monthlyPnl  = Object.values(byDay).reduce((s,x)=>s+x.pnl, 0);
    const monthlyDays = Object.keys(byDay).length;
    return { dim, fdow, byDay, weeks, monthlyPnl, monthlyDays };
  }, [allTrades, cal]);

  // ── Scatter ────────────────────────────────────────────────────────────────
  const timeSc = useMemo(() =>
    trades.filter(t=>t.entryTime&&t.netPnl!=null).map(t => {
      const [h,m] = (t.entryTime.split('T')[1]||'').slice(0,5).split(':').map(Number);
      return { x:+(h+m/60).toFixed(2), y:+t.netPnl.toFixed(2) };
    }), [trades]);

  const durSc = useMemo(() =>
    trades.filter(t=>t.entryTime&&t.exitTime&&t.netPnl!=null).map(t => ({
      x: Math.round((new Date(t.exitTime)-new Date(t.entryTime))/60000),
      y: +t.netPnl.toFixed(2),
    })), [trades]);

  // ── Top setups ─────────────────────────────────────────────────────────────
  const topSetups = useMemo(() => {
    const m = {};
    trades.filter(t=>t.setup&&t.exitPrice).forEach(t => {
      if (!m[t.setup]) m[t.setup]={w:0,n:0,pnl:0};
      m[t.setup].n++; m[t.setup].pnl+=(t.netPnl||0);
      if (t.result==='Win') m[t.setup].w++;
    });
    return Object.entries(m)
      .map(([s,x]) => ({ setup:s, wr:x.n?+((x.w/x.n)*100).toFixed(2):0, pnl:x.pnl }))
      .sort((a,b)=>b.pnl-a.pnl).slice(0,5);
  }, [trades]);

  const recent  = useMemo(() => allTrades.filter(t=>t.exitPrice).slice(0,8), [allTrades]);
  const isToday = (d) => today.getFullYear()===cal.year && today.getMonth()===cal.month && today.getDate()===d;
  const prevM   = () => setCal(c => c.month===0?{year:c.year-1,month:11}:{...c,month:c.month-1});
  const nextM   = () => setCal(c => c.month===11?{year:c.year+1,month:0}:{...c,month:c.month+1});
  const gcol    = (n, t=50) => n >= t ? '#00FF88' : '#FF003D';

  if (loading) return (
    <div style={{ minHeight:'100vh', background:'#0d0f14', display:'flex', alignItems:'center', justifyContent:'center' }}>
      <div style={{ width:40, height:40, border:'4px solid rgba(224,60,60,0.2)', borderTop:'4px solid #e03c3c', borderRadius:'50%', animation:'spin 0.8s linear infinite' }}/>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  return (
    <div style={{ display:'flex', minHeight:'100vh', background:'#0d0f14' }}>
      <Sidebar/>

      <div style={{ flex:1, marginLeft:160, display:'flex', flexDirection:'column' }}>
        <Navbar onFilterChange={(p, from, to) => {
          setPeriod(p);
          if (p === 'custom') {
            setCustomFrom(from);
            setCustomTo(to);
          }
        }}/>

        {/* ── TOP STATS BAR ────────────────────────────────────────────── */}
        <div style={{ display:'grid', gridTemplateColumns:'repeat(5,1fr)', borderBottom:'1px solid #1e2130', background:'#0d0f14', flexShrink:0 }}>

          {/* Net P&L */}
          <div style={{ padding:'14px 18px', borderRight:'1px solid #1e2130' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:6 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.15em' }}>Net P&L</span>
              <Info size={10} color="#334155"/>
            </div>
            <div style={{ fontSize:22, fontWeight:900, color: clr(S.netPnl), letterSpacing:'-0.02em' }}>{fd(S.netPnl)}</div>
          </div>

          {/* Trade win % */}
          <div style={{ padding:'14px 18px', borderRight:'1px solid #1e2130' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.15em' }}>Trade win %</span>
              <Info size={10} color="#334155"/>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:22, fontWeight:900, color:'#e0e0e0' }}>{S.winRate.toFixed(2)}%</span>
              <div style={{ textAlign:'center' }}>
                <Gauge pct={S.winRate} color={gcol(S.winRate)}/>
                <div style={{ display:'flex', gap:5, justifyContent:'center', marginTop:2 }}>
                  <span style={{ fontSize:9, fontWeight:900, color:'#00FF88' }}>{S.wins}</span>
                  <span style={{ fontSize:9, color:'#334155' }}>○</span>
                  <span style={{ fontSize:9, fontWeight:900, color:'#FF003D' }}>{S.losses}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Profit factor */}
          <div style={{ padding:'14px 18px', borderRight:'1px solid #1e2130' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.15em' }}>Profit factor</span>
              <Info size={10} color="#334155"/>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:22, fontWeight:900, color:'#e0e0e0' }}>{S.pf>=99?'∞':S.pf.toFixed(2)}</span>
              <Gauge pct={Math.min((S.pf/3)*100,100)} color={gcol(S.pf,1)}/>
            </div>
          </div>

          {/* Day win % */}
          <div style={{ padding:'14px 18px', borderRight:'1px solid #1e2130' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.15em' }}>Day win %</span>
              <Info size={10} color="#334155"/>
            </div>
            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between' }}>
              <span style={{ fontSize:22, fontWeight:900, color:'#e0e0e0' }}>{S.dayWinPct.toFixed(2)}%</span>
              <Gauge pct={S.dayWinPct} color={gcol(S.dayWinPct)}/>
            </div>
          </div>

          {/* Avg win/loss trade */}
          <div style={{ padding:'14px 18px' }}>
            <div style={{ display:'flex', alignItems:'center', gap:4, marginBottom:4 }}>
              <span style={{ fontSize:10, fontWeight:700, color:'#555', textTransform:'uppercase', letterSpacing:'0.15em' }}>Avg win/loss trade</span>
              <Info size={10} color="#334155"/>
            </div>
            <div style={{ fontSize:18, fontWeight:900, color:'#e0e0e0', marginBottom:6 }}>
              {S.avgWin > 0 && S.avgLoss > 0 ? (S.avgWin / S.avgLoss).toFixed(2) : '—'}
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:3 }}>
              <div style={{ height:5, background:'#00FF88', borderRadius:2,
                width:`${S.avgWin+S.avgLoss>0?(S.avgWin/(S.avgWin+S.avgLoss))*80:40}px` }}/>
              <span style={{ fontSize:12, fontWeight:700, color:'#00FF88' }}>{fd(S.avgWin)}</span>
            </div>
            <div style={{ display:'flex', alignItems:'center', gap:6 }}>
              <div style={{ height:5, background:'#FF003D', borderRadius:2,
                width:`${S.avgWin+S.avgLoss>0?(S.avgLoss/(S.avgWin+S.avgLoss))*80:40}px` }}/>
              <span style={{ fontSize:12, fontWeight:700, color:'#FF003D' }}>-{fd(S.avgLoss)}</span>
            </div>
          </div>
        </div>

        {/* ── BODY ─────────────────────────────────────────────────────── */}
        <div style={{ flex:1, overflowY:'auto', padding:14 }} className="custom-scrollbar">
          <div style={{ display:'flex', flexDirection:'column', gap:14, maxWidth:1600, margin:'0 auto' }}>

            {/* ROW 1 ── Calendar + Right charts */}
            <div style={{ display:'grid', gridTemplateColumns:'1.4fr 1fr', gap:14 }}>

              {/* ── Calendar ── */}
              <div style={{ ...card, padding:16, display:'flex', flexDirection:'column' }}>
                {/* Cal header */}
                <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:12 }}>
                  <button onClick={prevM} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748B', padding:3 }}><ChevronLeft size={15}/></button>
                  <span style={{ fontSize:14, fontWeight:900, color:'#fff', minWidth:130 }}>{MONTHS[cal.month]} {cal.year}</span>
                  <button onClick={nextM} style={{ background:'none', border:'none', cursor:'pointer', color:'#64748B', padding:3 }}><ChevronRight size={15}/></button>
                  <button onClick={()=>setCal({year:today.getFullYear(),month:today.getMonth()})}
                    style={{ padding:'3px 10px', background:'#1e2130', border:'1px solid #2a2d3a', borderRadius:20, fontSize:9, fontWeight:700, color:'#94A3B8', cursor:'pointer' }}>
                    This month
                  </button>
                  <div style={{ marginLeft:'auto', display:'flex', gap:8, alignItems:'center', fontSize:11 }}>
                    <span style={{ color:'#555' }}>Monthly stats:</span>
                    <span style={{ fontWeight:900, color: clr(calInfo.monthlyPnl) }}>{fd(calInfo.monthlyPnl)}</span>
                    <span style={{ fontWeight:900, color:'#FF003D' }}>{calInfo.monthlyDays} days</span>
                    <Camera size={12} color="#475569" style={{ cursor:'pointer' }}/>
                  </div>
                </div>

                <div style={{ display:'flex', gap:8 }}>
                  {/* Grid */}
                  <div style={{ flex:1 }}>
                    {/* Day headers */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', marginBottom:4 }}>
                      {['Sun','Mon','Tue','Wed','Thu','Fri','Sat'].map(d=>(
                        <div key={d} style={{ textAlign:'center', fontSize:9, fontWeight:700, color:'#334155', textTransform:'uppercase', letterSpacing:'0.08em', paddingBottom:4 }}>{d}</div>
                      ))}
                    </div>
                    {/* Day cells */}
                    <div style={{ display:'grid', gridTemplateColumns:'repeat(7,1fr)', gap:2 }}>
                      {Array.from({length:calInfo.fdow}).map((_,i)=><div key={`e${i}`} style={{ minHeight:70 }}/>)}
                      {Array.from({length:calInfo.dim},(_,i)=>i+1).map(d=>{
                        const info   = calInfo.byDay[d];
                        const profit = info?.pnl > 0;
                        return (
                          <div key={d} onClick={()=>setSelectedDay(d)} style={{
                            minHeight:70, borderRadius:5, padding:6,
                            border: isToday(d)
                              ? '1px solid rgba(224,60,60,0.6)'
                              : info
                                ? `1px solid ${profit?'rgba(0,255,136,0.25)':'rgba(255,0,61,0.25)'}`
                                : '1px solid #1a1d25',
                            background: isToday(d)
                              ? 'rgba(224,60,60,0.08)'
                              : info
                                ? profit ? 'rgba(0,255,136,0.06)' : 'rgba(255,0,61,0.07)'
                                : 'transparent',
                            cursor:'pointer', position:'relative',
                          }}>
                            {/* Day number top-right */}
                            <div style={{ fontSize:10, color: isToday(d)?'#FF003D':info?profit?'#00FF88':'#FF003D':'#334155', textAlign:'right', marginBottom:2 }}>{d}</div>
                            {info && <>
                              <div style={{ fontSize:11, fontWeight:900, color:profit?'#00FF88':'#FF003D' }}>
                                {profit?'+':''}{fd(info.pnl)}
                              </div>
                              <div style={{ fontSize:9, color:'#475569', marginTop:1 }}>{info.count} trade{info.count>1?'s':''}</div>
                              <div style={{ fontSize:9, color:'#475569' }}>{info.count?Math.round((info.wins/info.count)*100):0}%</div>
                              <Camera size={9} color="#334155" style={{ position:'absolute', bottom:4, right:4 }}/>
                            </>}
                          </div>
                        );
                      })}
                    </div>
                  </div>

                  {/* Weekly summary column */}
                  <div style={{ width:110, flexShrink:0, display:'flex', flexDirection:'column', gap:2, paddingTop:20 }}>
                    {calInfo.weeks.map((w,i)=>(
                      <div key={i} style={{ minHeight:72, borderLeft:'1px solid #1e2130', paddingLeft:10, display:'flex', flexDirection:'column', justifyContent:'center' }}>
                        <div style={{ fontSize:9, color:'#334155', fontWeight:700 }}>Week {i+1}</div>
                        <div style={{ fontSize:11, fontWeight:900, color: clr(w.pnl) }}>{fd(w.pnl)}</div>
                        <div style={{ fontSize:9, color:'#334155' }}>{w.days} days</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right col: Cumulative P&L, Account Balance, Drawdown */}
              <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                {/* Daily net cumulative P&L */}
                <div style={{ ...card, padding:'14px 14px 10px' }}>
                  <SHdr title="Daily net cumulative P&L"/>
                  <div style={{ height:150 }}>
                    {cumData.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={cumData} margin={{top:4,right:4,left:-18,bottom:0}}>
                          <defs>
                            <linearGradient id="cumStroke" x1="0" y1="0" x2="0" y2="1">
                              <stop offset={cumGradientOffset} stopColor="#00FF88"/>
                              <stop offset={cumGradientOffset} stopColor="#FF003D"/>
                            </linearGradient>
                            <linearGradient id="cumFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%" stopColor="#00FF88" stopOpacity={0.4}/>
                              <stop offset={cumGradientOffset} stopColor="#00FF88" stopOpacity={0.1}/>
                              <stop offset={cumGradientOffset} stopColor="#FF003D" stopOpacity={0.1}/>
                              <stop offset="100%" stopColor="#FF003D" stopOpacity={0.4}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid {...grid}/>
                          <XAxis dataKey="date" {...xAx}/>
                          <YAxis {...yAx}/>
                          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeDasharray="3 3"/>
                          <Tooltip content={<Tip/>}/>
                          <Area
                            type="monotone"
                            dataKey="v"
                            stroke="url(#cumStroke)"
                            strokeWidth={2}
                            fill="url(#cumFill)"
                            dot={false}
                            isAnimationActive={false}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : <Empty msg="Log trades to see chart"/>}
                  </div>
                </div>

                {/* Account Balance */}
                <div style={{ ...card, padding:'14px 14px 10px' }}>
                  <div style={{ display:'flex', alignItems:'center', gap:6, marginBottom:6 }}>
                    <span style={{ fontSize:10, fontWeight:700, color:'#888', textTransform:'uppercase', letterSpacing:'0.18em' }}>Account balance</span>
                    <Info size={11} color="#334155"/>
                  </div>
                  <div style={{ display:'flex', gap:14, marginBottom:8 }}>
                    {[['#9b59b6','Account Balance'],['#FF003D','Deposits / Withdrawals']].map(([c,l])=>(
                      <div key={l} style={{ display:'flex', alignItems:'center', gap:4 }}>
                        <div style={{ width:8, height:8, borderRadius:'50%', background:c }}/>
                        <span style={{ fontSize:9, color:'#64748B', fontWeight:700 }}>{l}</span>
                      </div>
                    ))}
                  </div>
                  <div style={{ height:140 }}>
                    {cumData.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ComposedChart data={accountBalanceData} margin={{top:4,right:4,left:-18,bottom:0}}>
                          <CartesianGrid {...grid}/>
                          <XAxis dataKey="date" {...xAx}/>
                          <YAxis {...yAx}/>
                          <Tooltip content={<Tip/>}/>
                          <Line
                            type="monotone" dataKey="balance"
                            stroke="#9b59b6" strokeWidth={2}
                            dot={{ r:3.5, fill:'#9b59b6', strokeWidth:0 }}
                            activeDot={{ r:5 }}
                          />
                          <Line
                            type="monotone" dataKey="deposits"
                            stroke="#FF003D" strokeWidth={1.5}
                            dot={false} strokeOpacity={0.7}
                          />
                        </ComposedChart>
                      </ResponsiveContainer>
                    ) : <Empty msg="No balance data"/>}
                  </div>
                </div>

                {/* Drawdown */}
                <div style={{ ...card, padding:'14px 14px 10px' }}>
                  <SHdr title="Drawdown"/>
                  <div style={{ height:130 }}>
                    {ddData.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={ddData} margin={{top:4,right:4,left:-18,bottom:0}}>
                          <defs>
                            {/* Red fill from zero DOWN to the deepest dip — gradient fills bottom-heavy */}
                            <linearGradient id="ddRedFill" x1="0" y1="0" x2="0" y2="1">
                              <stop offset="0%"   stopColor="#FF003D" stopOpacity={0.05}/>
                              <stop offset="60%"  stopColor="#FF003D" stopOpacity={0.35}/>
                              <stop offset="100%" stopColor="#FF003D" stopOpacity={0.65}/>
                            </linearGradient>
                          </defs>
                          <CartesianGrid {...grid}/>
                          <XAxis dataKey="date" {...xAx}/>
                          <YAxis {...yAx}/>
                          {/* Zero reference line at top */}
                          <ReferenceLine y={0} stroke="rgba(255,255,255,0.15)" strokeWidth={1}/>
                          <Tooltip content={<Tip/>}/>
                          {/* Purple stroke line on top, red gradient fill below */}
                          <Area
                            type="monotone" dataKey="v"
                            stroke="#9b59b6" strokeWidth={2}
                            fill="url(#ddRedFill)"
                            dot={false} connectNulls
                            baseLine={0}
                          />
                        </AreaChart>
                      </ResponsiveContainer>
                    ) : <Empty msg="No drawdown data"/>}
                  </div>
                </div>
              </div>
            </div>

            {/* ROW 2 ── Net daily P&L | Recent Trades | Top Setups */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1.2fr 0.8fr', gap:14 }}>

              {/* Net daily P&L */}
              <div style={{ ...card, padding:'14px 14px 10px' }}>
                <SHdr title="Net daily P&L"/>
                <div style={{ height:180 }}>
                  {dailyData.length ? (
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={dailyData} margin={{top:4,right:4,left:-18,bottom:0}}>
                        <CartesianGrid {...grid}/>
                        <XAxis dataKey="date" {...xAx}/>
                        <YAxis {...yAx}/>
                        <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)"/>
                        <Tooltip content={<Tip/>}/>
                        <Bar dataKey="v" maxBarSize={20} radius={[3,3,0,0]}
                          shape={({x,y,width,height,value})=>{
                            const color = value>=0 ? '#00FF88' : '#FF003D';
                            const barY  = value>=0 ? y : y+height;
                            return <rect x={x} y={barY} width={width} height={Math.max(Math.abs(height),1)} fill={color} rx={3} opacity={0.85}/>;
                          }}
                        />
                      </BarChart>
                    </ResponsiveContainer>
                  ) : <Empty msg="No data"/>}
                </div>
              </div>

              {/* Recent trades */}
              <div style={{ ...card, display:'flex', flexDirection:'column', overflow:'hidden' }}>
                {/* Tabs */}
                <div style={{ padding:'12px 16px 0', borderBottom:'1px solid #1e2130', flexShrink:0 }}>
                  <div style={{ display:'flex', gap:16 }}>
                    {[['recent','Recent trades'],['open','Open positions']].map(([key,label])=>(
                      <button key={key} onClick={()=>setTab(key)} style={{
                        fontSize:10, fontWeight:700, textTransform:'uppercase', letterSpacing:'0.12em',
                        paddingBottom:10, color: tab===key ? '#fff' : '#64748B',
                        background:'none', border:'none',
                        borderBottom: `2px solid ${tab===key?'#FF003D':'transparent'}`,
                        cursor:'pointer', transition:'all 0.2s',
                      }}>{label}</button>
                    ))}
                  </div>
                </div>
                {/* Table */}
                <div style={{ flex:1, overflowY:'auto' }} className="custom-scrollbar">
                  {recent.length ? (
                    <table style={{ width:'100%', borderCollapse:'collapse' }}>
                      <thead>
                        <tr style={{ borderBottom:'1px solid #1e2130' }}>
                          {['Close Date','Symbol','Net P&L'].map(h=>(
                            <th key={h} style={{ padding:'9px 14px', fontSize:9, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.12em', textAlign:h==='Net P&L'?'right':'left' }}>{h}</th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {recent.map((t,i)=>(
                          <tr key={t.id||i} style={{ borderBottom:'1px solid #161820', cursor:'pointer', transition:'background 0.15s' }}
                            onMouseEnter={e=>e.currentTarget.style.background='rgba(255,255,255,0.02)'}
                            onMouseLeave={e=>e.currentTarget.style.background='transparent'}>
                            <td style={{ padding:'9px 14px', fontSize:11, color:'#64748B' }}>
                              {t.exitTime ? new Date(t.exitTime).toLocaleDateString('en-US',{month:'2-digit',day:'2-digit',year:'numeric'}) : '—'}
                            </td>
                            <td style={{ padding:'9px 14px', fontSize:11, fontWeight:900, color:'#e0e0e0' }}>{t.instrument}</td>
                            <td style={{ padding:'9px 14px', fontSize:11, fontWeight:900, color:clr(t.netPnl), textAlign:'right' }}>
                              {t.netPnl>=0?'+':''}{fd(t.netPnl)}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  ) : (
                    <div style={{ height:180, display:'flex', alignItems:'center', justifyContent:'center' }}>
                      <Empty msg="No trades logged yet"/>
                    </div>
                  )}
                </div>
              </div>

              {/* Top Setups */}
              <div style={{ ...card, padding:14 }}>
                <SHdr title="Top setups"/>
                {topSetups.length ? (
                  <table style={{ width:'100%', borderCollapse:'collapse' }}>
                    <thead>
                      <tr>
                        {['Setup','Win Rate','Net P&L'].map(h=>(
                          <th key={h} style={{ fontSize:9, fontWeight:700, color:'#475569', textTransform:'uppercase', letterSpacing:'0.1em', paddingBottom:8, textAlign:h==='Net P&L'?'right':'left' }}>{h}</th>
                        ))}
                      </tr>
                    </thead>
                    <tbody>
                      {topSetups.map((s,i)=>(
                        <tr key={i} style={{ borderTop:'1px solid #1a1d25' }}>
                          <td style={{ padding:'7px 0', fontSize:11, fontWeight:700, color:'#e0e0e0' }}>{s.setup}</td>
                          <td style={{ padding:'7px 0', fontSize:11, fontWeight:900, color:s.wr>=50?'#00FF88':'#FF003D', textAlign:'center' }}>{s.wr}%</td>
                          <td style={{ padding:'7px 0', fontSize:11, fontWeight:900, color:clr(s.pnl), textAlign:'right' }}>{fd(s.pnl)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                ) : <Empty msg="Log trades with setups"/>}
              </div>
            </div>

            {/* ROW 3 ── Trade time | Trade duration */}
            <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:14 }}>
              {[
                { title:'Trade time performance',     data:timeSc, xFmt:v=>`${Math.floor(v)}:${String(Math.round((v%1)*60)).padStart(2,'0')}`, empty:'Log trades to see' },
                { title:'Trade duration performance', data:durSc,  xFmt:v=>v<60?`${v}m`:`${(v/60).toFixed(1)}h`,                              empty:'Log trades with entry & exit time' },
              ].map(({title,data,xFmt,empty})=>(
                <div key={title} style={{ ...card, padding:'14px 14px 10px' }}>
                  <SHdr title={title}/>
                  <div style={{ height:180 }}>
                    {data.length ? (
                      <ResponsiveContainer width="100%" height="100%">
                        <ScatterChart margin={{top:4,right:4,left:-18,bottom:0}}>
                          <CartesianGrid strokeDasharray="2 5" stroke="rgba(255,255,255,0.03)"/>
                          <XAxis type="number" dataKey="x" tickFormatter={xFmt} {...xAx}/>
                          <YAxis type="number" dataKey="y" {...yAx}/>
                          <ReferenceLine y={0} stroke="rgba(255,255,255,0.08)" strokeDasharray="3 3"/>
                          <Tooltip cursor={false} content={<Tip/>}/>
                          <Scatter data={data}
                            shape={({cx,cy,payload})=>(
                              <circle cx={cx} cy={cy} r={4} fill={payload.y>=0?'#00FF88':'#FF003D'} fillOpacity={0.8}/>
                            )}/>
                        </ScatterChart>
                      </ResponsiveContainer>
                    ) : <Empty msg={empty}/>}
                  </div>
                </div>
              ))}
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}