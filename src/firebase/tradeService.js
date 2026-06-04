import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp,
} from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

// ── Helpers ───────────────────────────────────────────────────────────────────
const getCurrentUserId = () => {
  const auth = getAuth();
  return auth.currentUser?.uid;
};

const requireAuth = () => {
  const uid = getCurrentUserId();
  if (!uid) throw new Error('User not authenticated');
  return uid;
};

// ── Save a new trade ──────────────────────────────────────────────────────────
export const saveTrade = async (tradeData) => {
  const userId = requireAuth();

  if (!tradeData.instrument || !tradeData.entryPrice) {
    throw new Error('Missing required fields: instrument, entryPrice');
  }

  const tradeDocument = {
    ...tradeData,
    userId,
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
  };

  const docRef = await addDoc(
    collection(db, 'users', userId, 'trades'),
    tradeDocument
  );

  return { success: true, id: docRef.id, data: tradeDocument };
};

// ── Get all trades for current user ──────────────────────────────────────────
export const getAllTrades = async () => {
  const userId = requireAuth();
  const snapshot = await getDocs(collection(db, 'users', userId, 'trades'));
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Update a trade ────────────────────────────────────────────────────────────
export const updateTrade = async (tradeId, updatedData) => {
  const userId = requireAuth();
  await updateDoc(doc(db, 'users', userId, 'trades', tradeId), {
    ...updatedData,
    updatedAt: serverTimestamp(),
  });
  return { success: true, id: tradeId };
};

// ── Delete a trade ────────────────────────────────────────────────────────────
export const deleteTrade = async (tradeId) => {
  const userId = requireAuth();
  await deleteDoc(doc(db, 'users', userId, 'trades', tradeId));
  return { success: true };
};

// ── Get trades by date range ──────────────────────────────────────────────────
export const getTradesByDateRange = async (startDate, endDate) => {
  const userId = requireAuth();
  const q = query(
    collection(db, 'users', userId, 'trades'),
    where('createdAt', '>=', startDate),
    where('createdAt', '<=', endDate)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

// ── Get trades by result ──────────────────────────────────────────────────────
export const getTradesByResult = async (result) => {
  const userId = requireAuth();
  const q = query(
    collection(db, 'users', userId, 'trades'),
    where('result', '==', result)
  );
  const snapshot = await getDocs(q);
  return snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
};

export default {
  saveTrade,
  getAllTrades,
  updateTrade,
  deleteTrade,
  getTradesByDateRange,
  getTradesByResult,
};