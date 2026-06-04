import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../firebase/firebase';
import { useAuth } from '../context/AuthContext';

export function useTrades() {
    const { currentUser } = useAuth();
    const [trades, setTrades] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        // Guard: must have a real Firebase uid
        const uid = currentUser?.uid;
        if (!uid) {
            setTrades([]);
            setLoading(false);
            return;
        }

        setLoading(true);

        // Path: users/{uid}/trades  — same path NewTrade.jsx writes to
        const q = query(
            collection(db, 'users', uid, 'trades'),
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