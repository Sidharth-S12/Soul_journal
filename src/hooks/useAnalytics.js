import { useMemo } from 'react';
import { useTrades } from './useTrades';

/**
 * useAnalytics
 * Derives all dashboard statistics from the real-time trades list.
 * No dummy data — everything is 0 / empty until the user logs trades.
 */
export function useAnalytics() {
    const { trades, loading, error } = useTrades();

    const stats = useMemo(() => {
        // Only count closed trades (have exitPrice and netPnl)
        const closed = trades.filter(t => t.exitPrice && t.netPnl != null);

        if (!closed.length) {
            return {
                trades,
                loading,
                error,
                netPnl: 0,
                winRate: 0,
                profitFactor: 0,
                dayWinPct: 0,
                avgWin: 0,
                avgLoss: 0,
                avgRR: 0,
                wins: 0,
                losses: 0,
                largestWin: 0,
                largestLoss: 0,
                expectancy: 0,
                topSetups: [],
                accountCurve: [],
            };
        }

        const wins = closed.filter(t => t.result === 'Win');
        const losses = closed.filter(t => t.result === 'Loss');

        // ── Core metrics ──────────────────────────────────────────────────────────
        const netPnl = closed.reduce((s, t) => s + (t.netPnl || 0), 0);
        const winRate = (wins.length / closed.length) * 100;
        const grossWin = wins.reduce((s, t) => s + (t.netPnl || 0), 0);
        const grossLoss = Math.abs(losses.reduce((s, t) => s + (t.netPnl || 0), 0));
        const profitFactor = grossLoss > 0 ? grossWin / grossLoss : grossWin > 0 ? 99 : 0;
        const avgWin = wins.length ? grossWin / wins.length : 0;
        const avgLoss = losses.length ? grossLoss / losses.length : 0;
        const avgRR = avgLoss > 0 ? avgWin / avgLoss : 0;
        const largestWin = wins.length ? Math.max(...wins.map(t => t.netPnl || 0)) : 0;
        const largestLoss = losses.length ? Math.max(...losses.map(t => Math.abs(t.netPnl || 0))) : 0;
        const expectancy = (winRate / 100) * avgWin - ((1 - winRate / 100) * avgLoss);

        // ── Day win % ─────────────────────────────────────────────────────────────
        const byDay = {};
        closed.forEach(t => {
            const d = (t.entryTime || '').split('T')[0]
                || t.createdAt?.toDate?.()?.toISOString?.()?.split('T')[0]
                || '';
            if (d) byDay[d] = (byDay[d] || 0) + (t.netPnl || 0);
        });
        const dayVals = Object.values(byDay);
        const dayWinPct = dayVals.length
            ? (dayVals.filter(v => v > 0).length / dayVals.length) * 100
            : 0;

        // ── Account curve (sorted by date, cumulative) ────────────────────────────
        const sortedByDate = [...closed].sort((a, b) => {
            const da = (a.entryTime || a.createdAt?.toDate?.()?.toISOString?.() || '');
            const db2 = (b.entryTime || b.createdAt?.toDate?.()?.toISOString?.() || '');
            return da.localeCompare(db2);
        });

        let cum = 0;
        const accountCurve = sortedByDate.map(t => {
            cum += t.netPnl || 0;
            const date = (t.entryTime || t.createdAt?.toDate?.()?.toISOString?.() || '').split('T')[0];
            return {
                date: date.slice(5),        // MM-DD
                pnl: +(t.netPnl || 0).toFixed(2),
                cumPnl: +cum.toFixed(2),
                result: t.result,
                instrument: t.instrument,
            };
        });

        // ── Top setups ────────────────────────────────────────────────────────────
        const setupMap = {};
        closed.forEach(t => {
            const key = t.setup || 'Custom';
            if (!setupMap[key]) setupMap[key] = { name: key, wins: 0, total: 0, pnl: 0 };
            setupMap[key].total += 1;
            setupMap[key].pnl += t.netPnl || 0;
            if (t.result === 'Win') setupMap[key].wins += 1;
        });
        const topSetups = Object.values(setupMap)
            .sort((a, b) => b.pnl - a.pnl)
            .slice(0, 5);

        return {
            trades,
            loading,
            error,
            netPnl,
            winRate,
            profitFactor,
            dayWinPct,
            avgWin,
            avgLoss,
            avgRR,
            wins: wins.length,
            losses: losses.length,
            largestWin,
            largestLoss,
            expectancy,
            topSetups,
            accountCurve,
        };
    }, [trades, loading, error]);

    return stats;
}