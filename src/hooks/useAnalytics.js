import { useMemo } from 'react';
import { useTrades } from './useTrades';

export function useAnalytics() {
    const { trades, loading, error } = useTrades();

    const stats = useMemo(() => {
        if (loading || !trades.length) return {
            netPnl: 0, winRate: 0, profitFactor: 0, dayWinPct: 0,
            avgWin: 0, avgLoss: 0, totalTrades: 0, wins: 0, losses: 0,
            totalGrossProfit: 0, totalGrossLoss: 0,
            maxDrawdown: 0,
            expectancy: 0,
            avgRR: 0,
            largestWin: 0,
            largestLoss: 0,
            accountCurve: [],
            topSetups: []
        };

        const closed = trades.filter(t => t.exitPrice != null && t.netPnl != null);
        const wins = closed.filter(t => t.result === 'Win' || t.netPnl > 0);
        const losses = closed.filter(t => t.result === 'Loss' || t.netPnl < 0);

        const totalTrades = closed.length;
        const netPnl = closed.reduce((s, t) => s + (t.netPnl || 0), 0);
        const winRate = totalTrades ? (wins.length / totalTrades) * 100 : 0;
        
        const totalGrossProfit = wins.reduce((s, t) => s + (t.netPnl || 0), 0);
        const totalGrossLoss = Math.abs(losses.reduce((s, t) => s + (t.netPnl || 0), 0));
        
        const profitFactor = totalGrossLoss > 0 ? totalGrossProfit / totalGrossLoss : (totalGrossProfit > 0 ? 100 : 0);
        
        const avgWin = wins.length ? totalGrossProfit / wins.length : 0;
        const avgLoss = losses.length ? totalGrossLoss / losses.length : 0;
        
        const expectancy = totalTrades ? (winRate/100 * avgWin) - ((1 - winRate/100) * avgLoss) : 0;
        
        const avgRR = avgLoss > 0 ? avgWin / avgLoss : 0;

        const largestWin = wins.length ? Math.max(...wins.map(t => t.netPnl)) : 0;
        const largestLoss = losses.length ? Math.min(...losses.map(t => t.netPnl)) : 0;

        // Day win %: days where total PnL > 0 / total trading days
        const byDayMap = {};
        closed.forEach(t => {
            const d = t.entryTime ? t.entryTime.split('T')[0] : (t.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0] || '');
            if (!d) return;
            byDayMap[d] = (byDayMap[d] || 0) + (t.netPnl || 0);
        });
        const dailyPnls = Object.values(byDayMap);
        const dayWins = dailyPnls.filter(v => v > 0).length;
        const dayWinPct = dailyPnls.length ? (dayWins / dailyPnls.length) * 100 : 0;

        // Account Curve & Max Drawdown
        let peak = 0;
        let runningPnl = 0;
        let maxDrawdown = 0;
        const accountCurve = closed
            .sort((a, b) => new Date(a.entryTime || a.createdAt?.toDate()) - new Date(b.entryTime || b.createdAt?.toDate()))
            .map(t => {
                runningPnl += (t.netPnl || 0);
                if (runningPnl > peak) peak = runningPnl;
                const dd = peak > 0 ? runningPnl - peak : 0;
                if (dd < maxDrawdown) maxDrawdown = dd;
                return {
                    date: t.entryTime || t.createdAt?.toDate?.()?.toISOString(),
                    pnl: runningPnl,
                    tradePnl: t.netPnl
                };
            });

        // Top Setups Calculation
        const setupsMap = {};
        closed.forEach(t => {
            if (!t.setup) return;
            if (!setupsMap[t.setup]) setupsMap[t.setup] = { name: t.setup, wins: 0, total: 0, pnl: 0 };
            setupsMap[t.setup].total += 1;
            setupsMap[t.setup].pnl += (t.netPnl || 0);
            if (t.result === 'Win' || t.netPnl > 0) setupsMap[t.setup].wins += 1;
        });
        const topSetups = Object.values(setupsMap).sort((a, b) => b.pnl - a.pnl);

        return {
            netPnl, winRate, profitFactor, dayWinPct, avgWin, avgLoss,
            totalTrades, wins: wins.length, losses: losses.length,
            totalGrossProfit, totalGrossLoss,
            maxDrawdown, expectancy, avgRR, largestWin, largestLoss,
            accountCurve, topSetups
        };
    }, [trades, loading]);

    return { ...stats, loading, error, trades };
}
