import { useState, useEffect } from 'react';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

/**
 * useTrades — real-time Firestore listener for the current user's trades.
 *
 * Firestore path: users/{uid}/trades/{tradeId}
 *
 * Each trade document shape:
 * {
 *   uid, instrument, direction, setup, marketEnv, tags,
 *   entryPrice, entryTime, positionSize, sizeUnit, leverage,
 *   stopLoss, takeProfit, riskPct, rewardPct,
 *   exitPrice, exitTime, result, netPnl, currency,
 *   rMultiple, commissions,
 *   preAnalysis, tradePlan, execution,
 *   wentWell, improved, lessonsLearned,
 *   notes, attachments,
 *   createdAt (Firestore Timestamp)
 * }
 */
export function useTrades() {
    const { currentUser } = useAuth();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        if (!currentUser?.uid) {
            setTrades([]);
            setLoading(false);
            return;
        }

        const q = query(
            collection(db, 'users', currentUser.uid, 'trades'),
            orderBy('createdAt', 'desc')
        );

        const unsub = onSnapshot(
            q,
            (snap) => {
                const data = snap.docs.map(doc => ({ id: doc.id, ...doc.data() }));
                setTrades(data);
                setLoading(false);
            },
            (err) => {
                console.error('useTrades error:', err);
                setError(err);
                setLoading(false);
            }
        );

        return () => unsub();
    }, [currentUser?.uid]);

    return { trades, loading, error };
}