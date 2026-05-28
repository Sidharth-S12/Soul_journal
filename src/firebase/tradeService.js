import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

// Get current user ID
const getCurrentUserId = () => {
  const auth = getAuth();
  return auth.currentUser?.uid;
};

/**
 * Save a new trade to Firestore
 */
export const saveTrade = async (tradeData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Validate required fields
    if (!tradeData.instrument || !tradeData.entryPrice) {
      throw new Error('Missing required fields: instrument, entryPrice');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');

    const tradeDocument = {
      ...tradeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(tradesCollection, tradeDocument);
    console.log('Trade saved with ID:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      data: tradeDocument
    };
  } catch (error) {
    console.error('Error saving trade:', error);
    throw error;
  }
};

/**
 * Get all trades for current user
 */
export const getAllTrades = async () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const snapshot = await getDocs(tradesCollection);

    const trades = [];
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

/**
 * Update a trade
 */
export const updateTrade = async (tradeId, updatedData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);

    await updateDoc(tradeRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });

    console.log('Trade updated:', tradeId);
    return { success: true, id: tradeId };
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
};

/**
 * Delete a trade
 */
export const deleteTrade = async (tradeId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);
    await deleteDoc(tradeRef);

    console.log('Trade deleted:', tradeId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};

/**
 * Get trades filtered by date range
 */
export const getTradesByDateRange = async (startDate, endDate) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(
      tradesCollection,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    const trades = [];

    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by date:', error);
    throw error;
  }
};

/**
 * Get trades by result (Win/Loss)
 */
export const getTradesByResult = async (result) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(tradesCollection, where('result', '==', result));

    const snapshot = await getDocs(q);
    const trades = [];

    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by result:', error);
    throw error;
  }
};

export default {
  saveTrade,
  getAllTrades,
  updateTrade,
  deleteTrade,
  getTradesByDateRange,
  getTradesByResult
};

import {
  collection,
  addDoc,
  query,
  where,
  getDocs,
  updateDoc,
  doc,
  deleteDoc,
  serverTimestamp
} from 'firebase/firestore';
import { db } from './firebase';
import { getAuth } from 'firebase/auth';

// Get current user ID
const getCurrentUserId = () => {
  const auth = getAuth();
  return auth.currentUser?.uid;
};

/**
 * Save a new trade to Firestore
 */
export const saveTrade = async (tradeData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    // Validate required fields
    if (!tradeData.instrument || !tradeData.entryPrice) {
      throw new Error('Missing required fields: instrument, entryPrice');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');

    const tradeDocument = {
      ...tradeData,
      userId,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    };

    const docRef = await addDoc(tradesCollection, tradeDocument);
    console.log('Trade saved with ID:', docRef.id);

    return {
      success: true,
      id: docRef.id,
      data: tradeDocument
    };
  } catch (error) {
    console.error('Error saving trade:', error);
    throw error;
  }
};

/**
 * Get all trades for current user
 */
export const getAllTrades = async () => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const snapshot = await getDocs(tradesCollection);

    const trades = [];
    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades:', error);
    throw error;
  }
};

/**
 * Update a trade
 */
export const updateTrade = async (tradeId, updatedData) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);

    await updateDoc(tradeRef, {
      ...updatedData,
      updatedAt: serverTimestamp()
    });

    console.log('Trade updated:', tradeId);
    return { success: true, id: tradeId };
  } catch (error) {
    console.error('Error updating trade:', error);
    throw error;
  }
};

/**
 * Delete a trade
 */
export const deleteTrade = async (tradeId) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradeRef = doc(db, 'users', userId, 'trades', tradeId);
    await deleteDoc(tradeRef);

    console.log('Trade deleted:', tradeId);
    return { success: true };
  } catch (error) {
    console.error('Error deleting trade:', error);
    throw error;
  }
};

/**
 * Get trades filtered by date range
 */
export const getTradesByDateRange = async (startDate, endDate) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(
      tradesCollection,
      where('createdAt', '>=', startDate),
      where('createdAt', '<=', endDate)
    );

    const snapshot = await getDocs(q);
    const trades = [];

    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by date:', error);
    throw error;
  }
};

/**
 * Get trades by result (Win/Loss)
 */
export const getTradesByResult = async (result) => {
  try {
    const userId = getCurrentUserId();
    if (!userId) {
      throw new Error('User not authenticated');
    }

    const tradesCollection = collection(db, 'users', userId, 'trades');
    const q = query(tradesCollection, where('result', '==', result));

    const snapshot = await getDocs(q);
    const trades = [];

    snapshot.forEach((doc) => {
      trades.push({
        id: doc.id,
        ...doc.data()
      });
    });

    return trades;
  } catch (error) {
    console.error('Error fetching trades by result:', error);
    throw error;
  }
};

export default {
  saveTrade,
  getAllTrades,
  updateTrade,
  deleteTrade,
  getTradesByDateRange,
  getTradesByResult
};
